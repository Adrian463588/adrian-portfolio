import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { fetchAllPublicRepos, mapGitHubRepo, syncGitHubSnapshot } from "../../scripts/sync-github.mjs";

describe("sync-github script", () => {
  it("paginates public repos and excludes private repositories", async () => {
    const page1 = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `repo-${i + 1}`,
      full_name: `Adrian463588/repo-${i + 1}`,
      html_url: `https://github.com/Adrian463588/repo-${i + 1}`,
      private: i === 0,
      fork: false,
      archived: false,
      pushed_at: "2026-10-01T00:00:00Z",
      updated_at: "2026-10-01T00:00:00Z",
      topics: [],
    }));
    const page2 = [
      {
        id: 101,
        name: "repo-101",
        full_name: "Adrian463588/repo-101",
        html_url: "https://github.com/Adrian463588/repo-101",
        private: false,
        fork: true,
        archived: false,
        pushed_at: "2026-11-01T00:00:00Z",
        updated_at: "2026-11-01T00:00:00Z",
        topics: ["kotlin"],
      },
    ];

    const mockFetch = async (url: string) => {
      const parsed = new URL(url);
      const page = Number(parsed.searchParams.get("page") || "1");
      const data = page === 1 ? page1 : page2;
      return {
        ok: true,
        status: 200,
        json: async () => data,
      };
    };

    const repos = await fetchAllPublicRepos("Adrian463588", { fetchImpl: mockFetch });
    expect(repos).toHaveLength(100);
    expect(repos.some((r: { name: string }) => r.name === "repo-1")).toBe(false);
    expect(repos.some((r: { name: string }) => r.name === "repo-101")).toBe(true);
  });

  it("preserves existing snapshot file when GitHub API fails or rate-limits", async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "gh-sync-test-"));
    const outFile = path.join(tmpDir, "github-repositories.json");
    const sentinel = JSON.stringify({
      username: "Adrian463588",
      syncedAt: "2026-11-20T00:00:00.000Z",
      count: 1,
      repositories: [
        mapGitHubRepo({
          id: 99,
          name: "ExistingRepo",
          full_name: "Adrian463588/ExistingRepo",
          html_url: "https://github.com/Adrian463588/ExistingRepo",
          private: false,
          fork: false,
          archived: false,
          pushed_at: "2026-11-20T00:00:00Z",
          updated_at: "2026-11-20T00:00:00Z",
          topics: [],
        }),
      ],
    });
    fs.writeFileSync(outFile, sentinel, "utf8");

    const failingFetch = async () => ({
      ok: false,
      status: 403,
      statusText: "rate limit exceeded",
      json: async () => ({ message: "API rate limit exceeded" }),
    });

    await expect(
      syncGitHubSnapshot({ username: "Adrian463588", outFile, fetchImpl: failingFetch })
    ).rejects.toThrow(/403|rate limit/i);

    expect(fs.readFileSync(outFile, "utf8")).toBe(sentinel);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});
