"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { RotateCcw, Search } from "lucide-react";
import type { Project, ProjectCategory, ProjectTier } from "@/types";
import {
  filterProjects,
  getAvailableCategories,
  getTopTechnologies,
  type ProjectFilterState,
} from "@/lib/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";

interface ProjectExplorerProps {
  items: Project[];
}

type OriginFilter = "all" | "professional" | "personal" | "academic" | "experiment";

export function ProjectExplorer({ items }: ProjectExplorerProps) {
  const pathname = usePathname();

  const availableCategories = useMemo(() => getAvailableCategories(items), [items]);
  const topTechnologies = useMemo(() => getTopTechnologies(items, 20), [items]);

  const [query, setQuery] = useState("");
  const [tier, setTier] = useState<"all" | ProjectTier>("all");
  const [origin, setOrigin] = useState<OriginFilter>("all");
  const [category, setCategory] = useState<"all" | ProjectCategory>("all");
  const [technology, setTechnology] = useState<string>("all");
  const [sort, setSort] = useState<"editorial" | "recent">("editorial");

  useEffect(() => {
    if (!window.location.search) return;
    const params = new URLSearchParams(window.location.search);
    const frame = requestAnimationFrame(() => {
      const q = params.get("q");
      const t = params.get("tier");
      const o = params.get("origin");
      const c = params.get("cat") as ProjectCategory | null;
      const tech = params.get("tech");
      const s = params.get("sort");
      if (q) setQuery(q);
      if (t === "featured" || t === "catalog" || t === "archive") setTier(t);
      if (
        o === "professional" ||
        o === "personal" ||
        o === "academic" ||
        o === "experiment"
      ) {
        setOrigin(o);
      }
      if (c && availableCategories.includes(c)) setCategory(c);
      if (tech) setTechnology(tech);
      if (s === "recent") setSort("recent");
    });
    return () => cancelAnimationFrame(frame);
  }, [availableCategories]);

  const updateUrl = (next: Partial<ProjectFilterState>) => {
    const state: ProjectFilterState = {
      query: next.query ?? query,
      tier: next.tier ?? tier,
      origin: next.origin ?? origin,
      category: next.category ?? category,
      technology: next.technology ?? technology,
      sort: next.sort ?? sort,
    };

    const params = new URLSearchParams();
    if (state.query.trim()) params.set("q", state.query.trim());
    if (state.tier !== "all") params.set("tier", state.tier);
    if (state.origin && state.origin !== "all") params.set("origin", state.origin);
    if (state.category !== "all") params.set("cat", state.category);
    if (state.technology !== "all") params.set("tech", state.technology);
    if (state.sort !== "editorial") params.set("sort", state.sort);

    const qs = params.toString();
    const nextUrl = qs ? `${pathname}?${qs}` : pathname;
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", nextUrl);
    }
  };

  const resetFilters = () => {
    setQuery("");
    setTier("all");
    setOrigin("all");
    setCategory("all");
    setTechnology("all");
    setSort("editorial");
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", pathname);
    }
  };

  const filtered = useMemo(
    () =>
      filterProjects(items, {
        query,
        tier,
        origin,
        category,
        technology,
        sort,
      }),
    [items, query, tier, origin, category, technology, sort]
  );

  const counts = useMemo(
    () => ({
      all: items.length,
      featured: items.filter((p) => p.featured).length,
      catalog: items.filter((p) => p.tier !== "archive").length,
      archive: items.filter((p) => p.tier === "archive").length,
      professional: items.filter((p) => p.projectOrigin === "professional").length,
      personal: items.filter((p) => ["original", "fork", "bootcamp"].includes(p.projectOrigin))
        .length,
      academic: items.filter((p) => p.projectOrigin === "academic").length,
      experiment: items.filter((p) => p.projectOrigin === "experiment").length,
    }),
    [items]
  );

  const hasActiveFilter =
    query.trim() !== "" ||
    tier !== "all" ||
    origin !== "all" ||
    category !== "all" ||
    technology !== "all" ||
    sort !== "editorial";

  const originTabs: { id: OriginFilter; label: string }[] = (
    [
      { id: "all" as const, label: `All Work (${counts.all})` },
      { id: "professional" as const, label: `Professional Work (${counts.professional})` },
      { id: "personal" as const, label: `Personal Projects (${counts.personal})` },
      { id: "academic" as const, label: `Academic Projects (${counts.academic})` },
      { id: "experiment" as const, label: `Experiments (${counts.experiment})` },
    ] satisfies { id: OriginFilter; label: string }[]
  ).filter((tab) => tab.id === "all" || counts[tab.id] > 0);

  const tierTabs: { id: "all" | ProjectTier; label: string }[] = [
    { id: "all", label: `All Eligible (${counts.all})` },
    { id: "featured", label: `Featured (${counts.featured})` },
    { id: "catalog", label: `Core Projects (${counts.catalog})` },
    { id: "archive", label: `Experiments & Archive (${counts.archive})` },
  ];

  return (
    <div className="space-y-8">
      {/* Search, technology & sort controls */}
      <div className="grid grid-cols-1 gap-4 rounded-xl border border-[#27272A] bg-[#18181B] p-4 sm:p-5 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-6">
          <label htmlFor="project-search" className="mb-1.5 block font-mono text-xs text-[#A1A1AA]">
            Search Projects
          </label>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1AA]"
            />
            <input
              id="project-search"
              type="search"
              value={query}
              onChange={(e) => {
                const v = e.target.value;
                setQuery(v);
                updateUrl({ query: v });
              }}
              placeholder="Search by project name, technology, or problem domain..."
              className="min-h-[44px] w-full rounded-lg border border-[#27272A] bg-[#09090B] py-2 pl-10 pr-4 text-sm text-[#F4F4F5] placeholder:text-[#9898A2] focus:border-[#38BDF8] focus:outline-none"
            />
          </div>
        </div>

        <div className="min-w-0 sm:grid sm:grid-cols-2 sm:gap-4 lg:col-span-6">
          <div>
            <label htmlFor="tech-filter" className="mb-1.5 block font-mono text-xs text-[#A1A1AA]">
              Technology
            </label>
            <select
              id="tech-filter"
              value={technology}
              onChange={(e) => {
                const v = e.target.value;
                setTechnology(v);
                updateUrl({ technology: v });
              }}
              className="min-h-[44px] w-full rounded-lg border border-[#27272A] bg-[#09090B] px-3 py-2 text-sm text-[#F4F4F5] focus:border-[#38BDF8] focus:outline-none"
            >
              <option value="all">All technologies</option>
              {topTechnologies.map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 sm:mt-0">
            <label htmlFor="sort-order" className="mb-1.5 block font-mono text-xs text-[#A1A1AA]">
              Sort Order
            </label>
            <select
              id="sort-order"
              value={sort}
              onChange={(e) => {
                const v = e.target.value === "recent" ? "recent" : "editorial";
                setSort(v);
                updateUrl({ sort: v });
              }}
              className="min-h-[44px] w-full rounded-lg border border-[#27272A] bg-[#09090B] px-3 py-2 text-sm text-[#F4F4F5] focus:border-[#38BDF8] focus:outline-none"
            >
              <option value="editorial">Editorial relevance</option>
              <option value="recent">Recently updated</option>
            </select>
          </div>
        </div>

        {/* Origin filter pills */}
        <div className="lg:col-span-12">
          <p className="mb-2 font-mono text-xs text-[#A1A1AA]">Engagement Origin</p>
          <div className="flex flex-wrap gap-2">
            {originTabs.map((tab) => {
              const active = origin === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setOrigin(tab.id);
                    updateUrl({ origin: tab.id });
                  }}
                  className={`min-h-[38px] rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? "border-[#38BDF8] bg-[#38BDF8]/15 text-[#7DD3FC]"
                      : "border-[#27272A] bg-[#09090B] text-[#A1A1AA] hover:border-[#3F3F46] hover:text-[#F4F4F5]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tier tabs */}
        <div className="lg:col-span-12">
          <div
            role="tablist"
            aria-label="Project tier filter"
            className="flex flex-wrap gap-2 border-t border-[#27272A] pt-4"
          >
            {tierTabs.map((tab) => {
              const selected = tier === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => {
                    setTier(tab.id);
                    updateUrl({ tier: tab.id });
                  }}
                  className={`min-h-[40px] rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors ${
                    selected
                      ? "border-[#38BDF8] bg-[#38BDF8]/15 text-[#7DD3FC]"
                      : "border-[#27272A] bg-[#09090B] text-[#A1A1AA] hover:border-[#3F3F46] hover:text-[#F4F4F5]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category pills */}
        <div className="lg:col-span-12">
          <p className="mb-2 font-mono text-xs text-[#A1A1AA]">Engineering Domain</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setCategory("all");
                updateUrl({ category: "all" });
              }}
              aria-pressed={category === "all"}
              className={`min-h-[38px] rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                category === "all"
                  ? "border-[#F4F4F5] bg-[#F4F4F5] text-[#09090B]"
                  : "border-[#27272A] bg-[#09090B] text-[#A1A1AA] hover:text-[#F4F4F5]"
              }`}
            >
              All Domains
            </button>

            {availableCategories.map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategory(cat);
                    updateUrl({ category: cat });
                  }}
                  aria-pressed={active}
                  className={`min-h-[38px] rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? "border-[#38BDF8] bg-[#38BDF8] text-[#09090B]"
                      : "border-[#27272A] bg-[#09090B] text-[#A1A1AA] hover:border-[#3F3F46] hover:text-[#F4F4F5]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Result count bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="sr-only">Filtered Engineering Projects</h2>
        <p aria-live="polite" className="font-mono text-xs text-[#A1A1AA]">
          Showing <span className="font-semibold text-[#F4F4F5]">{filtered.length}</span> of{" "}
          <span className="font-semibold text-[#F4F4F5]">{items.length}</span> verified public projects
        </p>

        {hasActiveFilter && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#27272A] bg-[#18181B] px-3.5 py-2 text-xs font-medium text-[#F4F4F5] transition-colors hover:border-[#38BDF8]/50 hover:text-[#38BDF8]"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Clear filters
          </button>
        )}
      </div>

      {/* Grid or Empty State */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-[#27272A] bg-[#18181B] px-6 py-14 text-center">
          <h2 className="text-lg font-semibold text-[#F4F4F5]">
            No matching engineering projects found
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#A1A1AA]">
            No repositories matched your current search or filter combination. Reset filters to view all {items.length} documented repositories.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#F4F4F5] px-5 py-2.5 text-sm font-semibold text-[#09090B] transition-colors hover:bg-[#38BDF8]"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
}
