import { curatedPrivateProjects } from "@/data/curated-projects";
import githubSnapshot from "@/data/github-repositories.json";
import { projectOverrides } from "@/data/project-overrides";
import {
  getApprovedEnterpriseProjects,
  mergeGitHubAndOverrides,
  sortProjectsEditorial,
  validateProjects,
} from "@/lib/projects";
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

const githubSlugs = new Set(githubProjects.map((project) => project.slug));
const approvedPrivate = getApprovedEnterpriseProjects(curatedPrivateProjects).filter(
  (project) => !githubSlugs.has(project.slug)
);

export const projects: Project[] = sortProjectsEditorial([
  ...githubProjects,
  ...approvedPrivate,
]);

const validation = validateProjects(projects);
if (!validation.valid) {
  throw new Error(`Invalid project dataset:\n${validation.errors.join("\n")}`);
}
