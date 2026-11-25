import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const srcDir = path.join(rootDir, "src");
const publicDir = path.join(rootDir, "public");
const outDir = path.join(rootDir, "out");

function walkFiles(dir, exts) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(full, exts));
    } else if (exts.some((ext) => entry.name.endsWith(ext))) {
      results.push(full);
    }
  }
  return results;
}

/** Verify exact case-sensitive path segments even on case-insensitive filesystems (Windows/macOS). */
function existsCaseSensitive(baseDir, relPosixPath) {
  const segments = relPosixPath.replace(/^\/+/, "").split("/").filter(Boolean);
  let current = baseDir;
  for (const seg of segments) {
    if (!fs.existsSync(current) || !fs.statSync(current).isDirectory()) return false;
    const entries = fs.readdirSync(current);
    if (!entries.includes(seg)) return false;
    current = path.join(current, seg);
  }
  return fs.existsSync(current) && fs.statSync(current).isFile();
}

function hasValidBinaryHeader(filePath) {
  const stat = fs.statSync(filePath);
  if (stat.size <= 0) return false;
  const buf = fs.readFileSync(filePath).subarray(0, 64);
  if (filePath.endsWith(".webp")) {
    return (
      buf.subarray(0, 4).toString("ascii") === "RIFF" &&
      buf.subarray(8, 12).toString("ascii") === "WEBP"
    );
  }
  if (filePath.endsWith(".png")) {
    return buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  }
  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) {
    return buf[0] === 0xff && buf[1] === 0xd8;
  }
  if (filePath.endsWith(".svg")) {
    return buf.toString("utf8").includes("<svg");
  }
  return true;
}

const sourceFiles = walkFiles(srcDir, [".ts", ".tsx"]);
const referenced = new Set(["/og-image.png"]);

for (const file of sourceFiles) {
  const content = fs.readFileSync(file, "utf8");
  for (const match of content.matchAll(
    /["'`](\/(?:images|projects)\/[^"'`]+\.(?:webp|png|jpg|jpeg|svg)|\/og-image\.png)["'`]/g
  )) {
    referenced.add(match[1]);
  }
}

const errors = [];
const checkOut = fs.existsSync(outDir);

for (const assetPath of [...referenced].sort()) {
  const rel = assetPath.replace(/^\/+/, "");
  const pubFile = path.join(publicDir, rel);

  if (!existsCaseSensitive(publicDir, rel)) {
    errors.push(`Missing or case-mismatched in public/: ${assetPath}`);
    continue;
  }
  if (!hasValidBinaryHeader(pubFile)) {
    errors.push(`Empty or invalid binary header in public/: ${assetPath}`);
    continue;
  }
  if (checkOut && !existsCaseSensitive(outDir, rel)) {
    errors.push(`Missing or case-mismatched in static export out/: ${assetPath}`);
  }
}

if (errors.length > 0) {
  console.error("Asset validation FAILED:\n" + errors.map((e) => ` - ${e}`).join("\n"));
  process.exit(1);
}

console.log(
  `Asset validation PASSED: ${referenced.size} referenced static assets verified cleanly in public/${checkOut ? " and out/" : ""}.`
);
