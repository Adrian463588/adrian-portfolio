import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

export const DEFAULT_SITE_ORIGIN = "https://adriansyahabidin.vercel.app";
export const DEFAULT_INDEXNOW_KEY = "66f0d196e94c432d91b2984a9156e7fa";
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
export const MAX_URLS_PER_BATCH = 10_000;

const SITE_CONTENT_PREFIXES = ["src/", "public/"];
const SITE_CONTENT_FILES = new Set(["next.config.ts", "vercel.json"]);

/** Read the IndexNow public key from `public/<key>.txt` when present. */
export function resolveIndexNowKey(rootDir = process.cwd(), fallbackKey = DEFAULT_INDEXNOW_KEY) {
  const keyFilePath = path.join(rootDir, "public", `${fallbackKey}.txt`);
  if (!fs.existsSync(keyFilePath)) {
    throw new Error(`Missing IndexNow verification file: ${keyFilePath}`);
  }
  const content = fs.readFileSync(keyFilePath, "utf8").trim();
  if (!/^[a-zA-Z0-9-]{8,128}$/.test(content)) {
    throw new Error(`Invalid IndexNow key format in ${keyFilePath}`);
  }
  return content;
}

/** Extract `<loc>` URLs from sitemap XML content. */
export function parseSitemapUrls(xml) {
  const urls = [];
  for (const match of xml.matchAll(/<loc>\s*([^<\s][^<]*?)\s*<\/loc>/gi)) {
    urls.push(match[1].replaceAll("&amp;", "&").trim());
  }
  return urls;
}

/** Normalize, same-origin validate, strip fragments, and deduplicate URLs. */
export function normalizeAndFilterUrls(rawUrls, siteOrigin = DEFAULT_SITE_ORIGIN) {
  const expectedOrigin = new URL(siteOrigin).origin;
  const seen = new Set();
  const normalized = [];

  for (const raw of rawUrls) {
    const trimmed = String(raw ?? "").trim();
    if (!trimmed) continue;

    let parsed;
    try {
      const candidate = trimmed.startsWith("http://") || trimmed.startsWith("https://")
        ? trimmed
        : trimmed.includes(":") && !trimmed.startsWith("/")
          ? null
          : new URL(trimmed.startsWith("/") ? trimmed : `/${trimmed}`, expectedOrigin).toString();
      if (!candidate) continue;
      parsed = new URL(candidate);
    } catch {
      continue;
    }

    if (parsed.protocol !== "https:" || parsed.origin !== expectedOrigin) {
      continue;
    }

    parsed.hash = "";
    const finalUrl = parsed.toString();
    if (!seen.has(finalUrl)) {
      seen.add(finalUrl);
      normalized.push(finalUrl);
    }
  }

  return normalized;
}

/** Split URLs into IndexNow-compliant batches (max 10,000 per POST). */
export function chunkUrls(urls, maxBatchSize = MAX_URLS_PER_BATCH) {
  if (maxBatchSize < 1) throw new Error("maxBatchSize must be >= 1");
  const batches = [];
  for (let i = 0; i < urls.length; i += maxBatchSize) {
    batches.push(urls.slice(i, i + maxBatchSize));
  }
  return batches;
}

/** Build a single IndexNow JSON submission payload. */
export function buildIndexNowPayload({
  siteOrigin = DEFAULT_SITE_ORIGIN,
  key,
  urlList,
}) {
  const originUrl = new URL(siteOrigin);
  return {
    host: originUrl.host,
    key,
    keyLocation: `${originUrl.origin}/${key}.txt`,
    urlList,
  };
}

/** Determine whether any changed repository file affects public routes or SEO assets. */
export function shouldTriggerIndexNowForFiles(changedFiles) {
  return changedFiles.some((filePath) => {
    const normalized = filePath.replaceAll("\\", "/").replace(/^\.\//, "");
    return (
      SITE_CONTENT_FILES.has(normalized) ||
      SITE_CONTENT_PREFIXES.some((prefix) => normalized.startsWith(prefix))
    );
  });
}

function getChangedFilesFromGit(baseRef = "HEAD^", headRef = "HEAD") {
  try {
    const output = execFileSync("git", ["diff", "--name-only", baseRef, headRef], {
      encoding: "utf8",
    });
    return output
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return null;
  }
}

function parseCliArgs(argv) {
  const options = {
    urls: [],
    sitemap: `${DEFAULT_SITE_ORIGIN}/sitemap.xml`,
    dryRun: false,
    skipKeyCheck: false,
    ciFilter: false,
    baseRef: "HEAD^",
    headRef: "HEAD",
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--skip-key-check") {
      options.skipKeyCheck = true;
    } else if (arg === "--ci-filter") {
      options.ciFilter = true;
    } else if (arg === "--urls" || arg === "--deleted" || arg === "--url") {
      const value = argv[++i];
      if (!value) throw new Error(`Missing value for ${arg}`);
      options.urls.push(...value.split(",").map((v) => v.trim()).filter(Boolean));
    } else if (arg === "--sitemap") {
      const value = argv[++i];
      if (!value) throw new Error("Missing value for --sitemap");
      options.sitemap = value;
    } else if (arg === "--base-ref") {
      options.baseRef = argv[++i] ?? options.baseRef;
    } else if (arg === "--head-ref") {
      options.headRef = argv[++i] ?? options.headRef;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

async function verifyLiveKeyFile(keyLocation, expectedKey, attempts = 4, delayMs = 5000) {
  let lastStatus = "unknown";
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const res = await fetch(keyLocation, { redirect: "manual" });
      if (res.status === 200) {
        const body = (await res.text()).trim();
        if (body === expectedKey) {
          return true;
        }
        lastStatus = `200 (body mismatch: ${body.length} chars)`;
      } else {
        lastStatus = `HTTP ${res.status}`;
      }
    } catch (err) {
      lastStatus = err instanceof Error ? err.message : String(err);
    }

    if (attempt < attempts) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw new Error(`IndexNow key verification failed at ${keyLocation}: ${lastStatus}`);
}

async function loadSitemapXml(source) {
  if (source.startsWith("https://") || source.startsWith("http://")) {
    const res = await fetch(source);
    if (!res.ok) {
      throw new Error(`Failed to fetch sitemap ${source}: HTTP ${res.status}`);
    }
    return res.text();
  }
  return fs.readFileSync(path.resolve(process.cwd(), source), "utf8");
}

async function runCli() {
  const options = parseCliArgs(process.argv.slice(2));

  if (options.ciFilter && options.urls.length === 0) {
    const changedFiles = getChangedFilesFromGit(options.baseRef, options.headRef);
    if (changedFiles !== null && !shouldTriggerIndexNowForFiles(changedFiles)) {
      console.log(
        `[indexnow] Skipped: no public site/content changes in ${options.baseRef}..${options.headRef} (${changedFiles.length} file(s) changed).`
      );
      return;
    }
  }

  const key = resolveIndexNowKey();
  const rawUrls =
    options.urls.length > 0
      ? options.urls
      : parseSitemapUrls(await loadSitemapXml(options.sitemap));

  const urls = normalizeAndFilterUrls(rawUrls, DEFAULT_SITE_ORIGIN);
  if (urls.length === 0) {
    console.log("[indexnow] No valid URLs to submit; skipping.");
    return;
  }

  const batches = chunkUrls(urls, MAX_URLS_PER_BATCH);
  const keyLocation = `${DEFAULT_SITE_ORIGIN}/${key}.txt`;

  if (!options.skipKeyCheck && !options.dryRun) {
    await verifyLiveKeyFile(keyLocation, key);
    console.log(`[indexnow] Verified public key file at ${keyLocation} (HTTP 200).`);
  }

  for (let idx = 0; idx < batches.length; idx += 1) {
    const payload = buildIndexNowPayload({
      siteOrigin: DEFAULT_SITE_ORIGIN,
      key,
      urlList: batches[idx],
    });

    if (options.dryRun) {
      console.log(`[indexnow] Dry run batch ${idx + 1}/${batches.length}:`, JSON.stringify(payload));
      continue;
    }

    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    const responseText = (await res.text()).trim();
    if (!res.ok) {
      throw new Error(
        `IndexNow submission failed (batch ${idx + 1}/${batches.length}): HTTP ${res.status} ${responseText}`
      );
    }

    console.log(
      `[indexnow] Batch ${idx + 1}/${batches.length} accepted: HTTP ${res.status} (${payload.urlList.length} URL(s))${responseText ? ` - ${responseText}` : ""}`
    );
  }
}

const isMain =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isMain) {
  runCli().catch((err) => {
    console.error("[indexnow] Error:", err instanceof Error ? err.message : String(err));
    process.exit(1);
  });
}
