import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";

const rootDir = process.cwd();
const outDir = path.join(rootDir, "out");
const args = new Set(process.argv.slice(2));

if (args.size === 0) {
  args.add("--validate");
  args.add("--audit");
  args.add("--links");
}

function loadTsDataModule(relPath, exportName) {
  const fullPath = path.join(rootDir, relPath);
  const src = fs.readFileSync(fullPath, "utf8");
  const transpiled = ts.transpileModule(src, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  });
  const mod = { exports: {} };
  const sandbox = {
    module: mod,
    exports: mod.exports,
    require: () => ({}),
  };
  vm.runInNewContext(transpiled.outputText, sandbox, { filename: fullPath });
  return mod.exports[exportName];
}

function walkHtmlFiles(dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkHtmlFiles(full));
    } else if (entry.name.endsWith(".html")) {
      files.push(full);
    }
  }
  return files;
}

function toRouteFromOutHtml(fullHtmlPath) {
  const rel = path.relative(outDir, fullHtmlPath).replaceAll(path.sep, "/");
  if (rel === "index.html") return "/";
  if (rel.endsWith("/index.html")) return `/${rel.slice(0, -"index.html".length)}`;
  return `/${rel}`;
}

function loadKnownProjectSlugs() {
  const slugs = new Set();
  const overridesPath = path.join(rootDir, "src/data/project-overrides.ts");
  const overridesSrc = fs.readFileSync(overridesPath, "utf8");
  for (const match of overridesSrc.matchAll(/slug:\s*"([^"]+)"/g)) {
    slugs.add(match[1]);
  }
  const snapshotPath = path.join(rootDir, "src/data/github-snapshot.json");
  if (fs.existsSync(snapshotPath)) {
    const snap = JSON.parse(fs.readFileSync(snapshotPath, "utf8"));
    for (const repo of snap.repos ?? []) {
      if (repo.slug) slugs.add(repo.slug);
    }
  }
  return slugs;
}

const competitors = loadTsDataModule("src/data/seo/competitors.ts", "COMPETITORS") ?? [];
const clusters = loadTsDataModule("src/data/seo/topic-clusters.ts", "TOPIC_CLUSTERS") ?? [];
const keywords = loadTsDataModule("src/data/seo/keyword-map.ts", "KEYWORD_MAP") ?? [];
const resources = loadTsDataModule("src/data/seo/resources.ts", "SEO_RESOURCES") ?? [];
const projectSlugs = loadKnownProjectSlugs();

function runValidate() {
  const errors = [];
  const seenSlugs = new Set();
  const seenTitles = new Set();
  const clusterIds = new Set(clusters.map((c) => c.id));
  const competitorIds = new Set(competitors.map((c) => c.id));

  for (const entry of resources) {
    if (seenSlugs.has(entry.slug)) errors.push(`Duplicate slug: ${entry.slug}`);
    seenSlugs.add(entry.slug);
    if (!clusterIds.has(entry.clusterId)) errors.push(`Unknown cluster in ${entry.slug}: ${entry.clusterId}`);
    for (const pSlug of entry.relatedProjectSlugs ?? []) {
      if (!projectSlugs.has(pSlug)) errors.push(`Unknown project slug in ${entry.slug}: ${pSlug}`);
    }
    for (const cId of entry.competitorIds ?? []) {
      if (!competitorIds.has(cId)) errors.push(`Unknown competitor ID in ${entry.slug}: ${cId}`);
    }
    if (entry.status !== "published" && entry.indexable) {
      errors.push(`Unpublished item marked indexable: ${entry.slug}`);
    }
    if (entry.status === "published" && entry.indexable) {
      const key = entry.seoTitle.toLowerCase();
      if (seenTitles.has(key)) errors.push(`Duplicate seoTitle: ${entry.seoTitle}`);
      seenTitles.add(key);
      if (!entry.sources?.length || entry.sources.some((s) => !s.startsWith("https://"))) {
        errors.push(`Missing https source URLs on ${entry.slug}`);
      }
      if (!entry.directAnswer || entry.directAnswer.length < 40) {
        errors.push(`Missing directAnswer summary on ${entry.slug}`);
      }
      if (
        (entry.kind === "comparison" || entry.kind === "alternative") &&
        entry.comparisonMatrix?.columns?.some((c) => c.isFirstParty) &&
        !entry.disclosure
      ) {
        errors.push(`Missing disclosure on first-party comparison/alternative: ${entry.slug}`);
      }
    }
  }

  for (const kw of keywords) {
    if (!resources.some((r) => r.slug === kw.targetSlug)) {
      errors.push(`Keyword ${kw.id} references missing resource slug ${kw.targetSlug}`);
    }
  }

  const published = resources.filter((r) => r.status === "published" && r.indexable);
  const gated = resources.filter((r) => r.status !== "published" || !r.indexable);
  return { valid: errors.length === 0, errors, publishedCount: published.length, gatedCount: gated.length };
}

function runKeywordsSummary() {
  return clusters.map((cluster) => {
    const kwItems = keywords.filter((k) => k.clusterId === cluster.id);
    return {
      clusterId: cluster.id,
      name: cluster.name,
      keywords: kwItems.length,
      published: kwItems.filter((k) => k.status === "published").length,
      gated: kwItems.filter((k) => k.status !== "published").length,
    };
  });
}

function runStaticOutAudit() {
  if (!fs.existsSync(outDir)) {
    return { ready: false, errors: ["out/ directory does not exist; run npm run build first."], pageCount: 0 };
  }
  const htmlFiles = walkHtmlFiles(outDir).filter((f) => {
    const rel = path.relative(outDir, f).replaceAll(path.sep, "/");
    return (
      !rel.startsWith("_not-found") &&
      !rel.startsWith("404") &&
      !rel.endsWith(".rsc.html")
    );
  });
  const errors = [];
  let jsonLdChecked = 0;

  for (const file of htmlFiles) {
    const rel = path.relative(outDir, file).replaceAll(path.sep, "/");
    const html = fs.readFileSync(file, "utf8");
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    if (!titleMatch) errors.push(`Missing <title> in ${rel}`);
    if (!/<meta\s+name="description"\s+content="[^"]+"/i.test(html)) {
      errors.push(`Missing meta description in ${rel}`);
    }
    if (!/<link\s+rel="canonical"\s+href="https:\/\/adriansyahabidin\.vercel\.app\/[^"]*"/i.test(html)) {
      errors.push(`Missing or non-canonical URL in ${rel}`);
    }
    if (!/<link\s+rel="icon"/i.test(html) || !/<link\s+rel="apple-touch-icon"/i.test(html) || !/<link\s+rel="manifest"/i.test(html)) {
      errors.push(`Missing icon/apple-touch-icon/manifest link tags in ${rel}`);
    }
    const h1Count = (html.match(/<h1[\s>]/gi) ?? []).length;
    if (h1Count !== 1) errors.push(`Expected 1 <h1>, found ${h1Count} in ${rel}`);

    for (const m of html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
      try {
        JSON.parse(m[1]);
        jsonLdChecked += 1;
      } catch {
        errors.push(`Invalid JSON-LD block in ${rel}`);
      }
    }
  }

  // Ensure gated drafts do not exist in out/ or sitemap.xml
  const sitemapPath = path.join(outDir, "sitemap.xml");
  const sitemapXml = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, "utf8") : "";
  if (!sitemapXml) errors.push("Missing out/sitemap.xml");

  for (const r of resources) {
    const outResPath = path.join(outDir, "resources", r.slug, "index.html");
    const urlFrag = `/resources/${r.slug}/`;
    if (r.status === "published" && r.indexable) {
      if (!fs.existsSync(outResPath)) errors.push(`Missing published resource HTML: ${urlFrag}`);
      if (!sitemapXml.includes(urlFrag)) errors.push(`Missing published resource in sitemap.xml: ${urlFrag}`);
    } else {
      if (fs.existsSync(outResPath)) errors.push(`Draft/gated resource leaked into out/: ${urlFrag}`);
      if (sitemapXml.includes(urlFrag)) errors.push(`Draft/gated resource leaked into sitemap.xml: ${urlFrag}`);
    }
  }

  return {
    ready: errors.length === 0,
    pageCount: htmlFiles.length,
    jsonLdChecked,
    sitemapUrls: (sitemapXml.match(/<loc>/g) ?? []).length,
    errors,
  };
}

function runInternalLinksAudit() {
  if (!fs.existsSync(outDir)) {
    return { valid: false, errors: ["out/ directory does not exist; run npm run build first."], checkedLinks: 0 };
  }
  const htmlFiles = walkHtmlFiles(outDir);
  const validRoutes = new Set(htmlFiles.map(toRouteFromOutHtml));
  const errors = [];
  let checkedLinks = 0;

  for (const file of htmlFiles) {
    const rel = path.relative(outDir, file).replaceAll(path.sep, "/");
    const html = fs.readFileSync(file, "utf8");
    for (const match of html.matchAll(/<a\s+[^>]*href="(\/[^"]*)"/gi)) {
      const rawHref = match[1];
      if (rawHref.startsWith("/_next/") || rawHref.startsWith("/images/") || rawHref.startsWith("/projects/") && rawHref.endsWith(".webp")) {
        continue;
      }
      checkedLinks += 1;
      const [pathPart] = rawHref.split("#");
      const normalized = pathPart === "" ? "/" : pathPart.endsWith("/") ? pathPart : `${pathPart}/`;
      if (!validRoutes.has(normalized) && !fs.existsSync(path.join(outDir, pathPart.replace(/^\/+/, "")))) {
        errors.push(`Broken internal href "${rawHref}" in ${rel}`);
      }
    }
  }

  return { valid: errors.length === 0, checkedLinks, errors };
}

let exitCode = 0;
const reportPayload = {
  generatedAt: new Date().toISOString(),
};

if (args.has("--validate") || args.has("--report")) {
  const val = runValidate();
  reportPayload.validation = val;
  console.log("[seo:validate]", JSON.stringify(val));
  if (!val.valid) exitCode = 1;
}

if (args.has("--keywords") || args.has("--report")) {
  const kw = runKeywordsSummary();
  reportPayload.keywords = kw;
  console.log("[seo:keywords]", JSON.stringify(kw));
}

if (args.has("--audit") || args.has("--report")) {
  const audit = runStaticOutAudit();
  reportPayload.audit = audit;
  console.log("[seo:audit]", JSON.stringify(audit));
  if (!audit.ready) exitCode = 1;
}

if (args.has("--links") || args.has("--report")) {
  const links = runInternalLinksAudit();
  reportPayload.links = links;
  console.log("[seo:links]", JSON.stringify(links));
  if (!links.valid) exitCode = 1;
}

if (args.has("--report")) {
  const outReport = path.join(rootDir, "docs/seo/advanced/SEO_CLI_SNAPSHOT.json");
  fs.mkdirSync(path.dirname(outReport), { recursive: true });
  fs.writeFileSync(outReport, `${JSON.stringify(reportPayload, null, 2)}\n`, "utf8");
  console.log("[seo:report] Wrote", path.relative(rootDir, outReport));
}

process.exit(exitCode);
