import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const rootDir = process.cwd();
const errors = [];

const SECRET_PATTERNS = [
  { name: "Groq API key", regex: /\bgsk_[A-Za-z0-9_-]{16,}/ },
  { name: "Google / Gemini key", regex: /\b(?:AIzaSy[A-Za-z0-9_-]{20,}|AQ\.Ab[A-Za-z0-9_-]{16,})/ },
  { name: "OpenRouter API key", regex: /\bsk-or-v1-[A-Za-z0-9_-]{16,}/ },
  { name: "Vercel token", regex: /\bvck_[A-Za-z0-9_-]{16,}/ },
  { name: "Private phone number", regex: /\(\+62\)\s*81215260921|081215260921/ },
];

const IGNORE_PREFIXES = [
  ".env.local",
  "BANKCV_MASUKKANKEGITIGNORE/",
  "private/",
  "knowledge/raw/",
  "docs/evidence/",
  "scripts/check-secrets.mjs",
];

function checkFile(relPath, content) {
  const normalized = relPath.replaceAll("\\", "/");
  if (IGNORE_PREFIXES.some((p) => normalized.startsWith(p))) return;
  for (const pat of SECRET_PATTERNS) {
    if (pat.regex.test(content)) {
      errors.push(`${pat.name} detected in ${normalized}`);
    }
  }
}

// 1. Check all git-tracked + untracked non-ignored files in working tree
const trackedAndUntracked = execSync("git ls-files -co --exclude-standard", { encoding: "utf8" })
  .split(/\r?\n/)
  .filter(Boolean);

for (const rel of trackedAndUntracked) {
  const full = path.join(rootDir, rel);
  if (!fs.existsSync(full) || fs.statSync(full).isDirectory()) continue;
  if (/\.(png|webp|jpg|jpeg|ico|woff2?|pdf|zip)$/i.test(rel)) continue;
  const content = fs.readFileSync(full, "utf8");
  checkFile(rel, content);
}

// 2. Check .env.local is NOT tracked in Git
const trackedEnv = execSync("git ls-files .env*", { encoding: "utf8" })
  .split(/\r?\n/)
  .filter((f) => f && f !== ".env.example");
if (trackedEnv.length > 0) {
  errors.push(`Forbidden tracked env file(s): ${trackedEnv.join(", ")}`);
}

// 3. Check client bundle (.next/static) if build exists
const nextStaticDir = path.join(rootDir, ".next", "static");
if (fs.existsSync(nextStaticDir)) {
  const stack = [nextStaticDir];
  while (stack.length > 0) {
    const dir = stack.pop();
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (/\.(js|css|txt|json)$/.test(entry.name)) {
        const content = fs.readFileSync(full, "utf8");
        checkFile(path.relative(rootDir, full), content);
      }
    }
  }
}

if (errors.length > 0) {
  console.error("Secret & PII scan FAILED:\n" + errors.map((e) => ` - ${e}`).join("\n"));
  process.exit(1);
}

console.log(
  `Secret & PII scan PASSED: ${trackedAndUntracked.length} workspace files${fs.existsSync(nextStaticDir) ? " + .next/static bundle" : ""} clean.`
);
