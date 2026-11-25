import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_USERNAME = "Adrian463588";
const DEFAULT_OUT_FILE = path.resolve(process.cwd(), "src/data/github-repositories.json");

export function mapGitHubRepo(repo) {
  return {
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    htmlUrl: repo.html_url,
    description: repo.description || "",
    homepage: repo.homepage || "",
    language: repo.language || null,
    topics: Array.isArray(repo.topics) ? repo.topics : [],
    fork: Boolean(repo.fork),
    archived: Boolean(repo.archived),
    license: repo.license?.spdx_id && repo.license.spdx_id !== "NOASSERTION" ? repo.license.spdx_id : null,
    stars: Number(repo.stargazers_count || 0),
    defaultBranch: repo.default_branch || "main",
    createdAt: repo.created_at || "",
    updatedAt: repo.updated_at || "",
    pushedAt: repo.pushed_at || "",
  };
}

export async function fetchAllPublicRepos(username = DEFAULT_USERNAME, options = {}) {
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  const token = options.token || process.env.GITHUB_TOKEN || "";
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "adrian-portfolio-sync",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const allRepos = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const url = `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=${perPage}&page=${page}&type=owner&sort=updated`;
    const response = await fetchImpl(url, { headers });
    if (!response.ok) {
      let detail = "";
      try {
        const errBody = await response.json();
        detail = errBody?.message ? ` (${errBody.message})` : "";
      } catch {
        detail = "";
      }
      throw new Error(`GitHub API request failed with status ${response.status}${detail}`);
    }

    const batch = await response.json();
    if (!Array.isArray(batch)) {
      throw new Error("GitHub API returned unexpected non-array payload");
    }

    const publicBatch = batch.filter((repo) => repo && repo.private !== true);
    allRepos.push(...publicBatch.map(mapGitHubRepo));

    if (batch.length < perPage) {
      break;
    }
    page += 1;
  }

  return allRepos;
}

export async function syncGitHubSnapshot(options = {}) {
  const username = options.username || DEFAULT_USERNAME;
  const outFile = options.outFile || DEFAULT_OUT_FILE;
  const fetchImpl = options.fetchImpl || globalThis.fetch;

  const repositories = await fetchAllPublicRepos(username, {
    fetchImpl,
    token: options.token,
  });

  const payload = {
    username,
    syncedAt: new Date().toISOString(),
    count: repositories.length,
    repositories,
  };

  const tmpFile = `${outFile}.tmp`;
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(tmpFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.renameSync(tmpFile, outFile);

  return payload;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  syncGitHubSnapshot()
    .then((result) => {
      console.log(`Synced ${result.count} public repositories for ${result.username} at ${result.syncedAt}`);
    })
    .catch((err) => {
      console.error(`GitHub sync failed — existing snapshot preserved: ${err.message}`);
      process.exitCode = 1;
    });
}
