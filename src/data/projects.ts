import githubSnapshot from "@/data/github-repositories.json";
import { projectOverrides } from "@/data/project-overrides";
import { mergeGitHubAndOverrides, validateProjects } from "@/lib/projects";
import type { GitHubSnapshotFile, Project } from "@/types";

const snapshot = githubSnapshot as GitHubSnapshotFile;

export const githubSyncMeta = {
  username: snapshot.username,
  syncedAt: snapshot.syncedAt,
  totalPublicRepos: snapshot.count,
};

export const githubProjects: Project[] = mergeGitHubAndOverrides(
  snapshot.repositories,
  projectOverrides
);

export const projects: Project[] = githubProjects;

const validation = validateProjects(projects);
if (!validation.valid) {
  throw new Error(`Invalid project dataset:\n${validation.errors.join("\n")}`);
}
