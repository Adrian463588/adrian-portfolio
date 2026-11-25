"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, LayoutGrid, List, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import type { Project, ProjectCategory, ProjectTier } from "@/types";
import {
  filterProjects,
  getAvailableCategories,
  getTopTechnologies,
  type ProjectFilterState,
} from "@/lib/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectHoverPreview } from "@/components/projects/ProjectHoverPreview";
import { useMotion } from "@/context/MotionContext";

interface ProjectExplorerProps {
  items: Project[];
}

type OriginFilter = "all" | "professional" | "personal" | "academic" | "experiment";
type ViewMode = "gallery" | "index";

export function ProjectExplorer({ items }: ProjectExplorerProps) {
  const pathname = usePathname();
  const { canHover, qualityMode } = useMotion();

  const availableCategories = useMemo(() => getAvailableCategories(items), [items]);
  const topTechnologies = useMemo(() => getTopTechnologies(items, 20), [items]);

  const [query, setQuery] = useState("");
  const [tier, setTier] = useState<"all" | ProjectTier>("all");
  const [origin, setOrigin] = useState<OriginFilter>("all");
  const [category, setCategory] = useState<"all" | ProjectCategory>("all");
  const [technology, setTechnology] = useState<string>("all");
  const [sort, setSort] = useState<"editorial" | "recent">("editorial");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("gallery");
  const [hoveredPreview, setHoveredPreview] = useState<{
    project: Project | null;
    x: number;
    y: number;
  }>({ project: null, x: 0, y: 0 });

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
      if (t === "featured" || t === "catalog" || t === "archive") {
        setTier(t);
        setFiltersOpen(true);
      }
      if (
        o === "professional" ||
        o === "personal" ||
        o === "academic" ||
        o === "experiment"
      ) {
        setOrigin(o);
      }
      if (c && availableCategories.includes(c)) {
        setCategory(c);
        setFiltersOpen(true);
      }
      if (tech) {
        setTechnology(tech);
        setFiltersOpen(true);
      }
      if (s === "recent") {
        setSort("recent");
        setFiltersOpen(true);
      }
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

  const secondaryFilterCount =
    (tier !== "all" ? 1 : 0) +
    (category !== "all" ? 1 : 0) +
    (technology !== "all" ? 1 : 0) +
    (sort !== "editorial" ? 1 : 0);

  const hasActiveFilter =
    query.trim() !== "" || origin !== "all" || secondaryFilterCount > 0;

  const typeTabs: { id: OriginFilter; label: string }[] = (
    [
      { id: "all" as const, label: "All" },
      { id: "professional" as const, label: "Professional" },
      { id: "personal" as const, label: "Personal" },
      { id: "academic" as const, label: "Academic" },
      { id: "experiment" as const, label: "Experiments" },
    ] satisfies { id: OriginFilter; label: string }[]
  ).filter((tab) => tab.id === "all" || counts[tab.id] > 0);

  const scopeTabs: { id: "all" | ProjectTier; label: string }[] = [
    { id: "all", label: `All (${counts.all})` },
    { id: "featured", label: `Featured (${counts.featured})` },
    { id: "catalog", label: `Standard (${counts.catalog})` },
    { id: "archive", label: `Archive (${counts.archive})` },
  ];

  return (
    <div className="space-y-8">
      {/* Compact borderless editorial toolbar — keeps first projects immediately visible */}
      <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter by type">
          {typeTabs.map((tab) => {
            const active = origin === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setOrigin(tab.id);
                  updateUrl({ origin: tab.id });
                }}
                className={`active-press min-h-[38px] rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "border-[#65C8F5] bg-[#65C8F5]/14 text-[#65C8F5]"
                    : "border-white/12 bg-transparent text-[#A7ADB7] hover:border-white/25 hover:text-[#F2F0EC]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-0 flex-1 sm:w-56 sm:flex-initial">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A7ADB7]"
            />
            <input
              id="project-search"
              aria-label="Search projects"
              type="search"
              value={query}
              onChange={(e) => {
                const v = e.target.value;
                setQuery(v);
                updateUrl({ query: v });
              }}
              placeholder="Search projects..."
              className="min-h-[40px] w-full rounded-full border border-white/12 bg-[#15171C]/75 py-1.5 pl-9 pr-4 text-xs text-[#F2F0EC] placeholder:text-[#8E95A0] focus:border-[#65C8F5] focus:outline-none"
            />
          </div>

          <button
            type="button"
            aria-expanded={filtersOpen}
            aria-controls="more-filters-panel"
            onClick={() => setFiltersOpen((prev) => !prev)}
            className={`active-press inline-flex min-h-[40px] items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              filtersOpen || secondaryFilterCount > 0
                ? "border-[#65C8F5] bg-[#65C8F5]/14 text-[#65C8F5]"
                : "border-white/12 bg-[#15171C]/75 text-[#F2F0EC] hover:border-white/25"
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              Filters{secondaryFilterCount > 0 ? ` (${secondaryFilterCount})` : ""}
            </span>
          </button>

          <div
            role="group"
            aria-label="Project presentation view"
            className="inline-flex rounded-full border border-white/12 bg-[#15171C]/75 p-0.5"
          >
            <button
              type="button"
              aria-pressed={viewMode === "gallery"}
              onClick={() => setViewMode("gallery")}
              className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                viewMode === "gallery"
                  ? "bg-[#F2F0EC] text-[#08090C]"
                  : "text-[#A7ADB7] hover:text-[#F2F0EC]"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Gallery</span>
            </button>
            <button
              type="button"
              aria-pressed={viewMode === "index"}
              onClick={() => setViewMode("index")}
              className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                viewMode === "index"
                  ? "bg-[#F2F0EC] text-[#08090C]"
                  : "text-[#A7ADB7] hover:text-[#F2F0EC]"
              }`}
            >
              <List className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Index</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progressive-disclosure secondary filters panel */}
      {filtersOpen && (
        <div
          id="more-filters-panel"
          className="grid grid-cols-1 gap-4 rounded-xl border border-white/12 bg-[#15171C]/95 p-5 backdrop-blur-md lg:grid-cols-12"
        >
          <div className="lg:col-span-4">
            <label htmlFor="cat-filter" className="mb-1.5 block text-xs font-medium text-[#A7ADB7]">
              Category
            </label>
            <select
              id="cat-filter"
              value={category}
              onChange={(e) => {
                const v = e.target.value as "all" | ProjectCategory;
                setCategory(v);
                updateUrl({ category: v });
              }}
              className="min-h-[42px] w-full rounded-lg border border-white/12 bg-[#08090C] px-3 py-2 text-sm text-[#F2F0EC] focus:border-[#65C8F5] focus:outline-none"
            >
              <option value="all">All categories</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-4">
            <label htmlFor="tech-filter" className="mb-1.5 block text-xs font-medium text-[#A7ADB7]">
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
              className="min-h-[42px] w-full rounded-lg border border-white/12 bg-[#08090C] px-3 py-2 text-sm text-[#F2F0EC] focus:border-[#65C8F5] focus:outline-none"
            >
              <option value="all">All technologies</option>
              {topTechnologies.map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-4">
            <label htmlFor="sort-order" className="mb-1.5 block text-xs font-medium text-[#A7ADB7]">
              Sort
            </label>
            <select
              id="sort-order"
              value={sort}
              onChange={(e) => {
                const v = e.target.value === "recent" ? "recent" : "editorial";
                setSort(v);
                updateUrl({ sort: v });
              }}
              className="min-h-[42px] w-full rounded-lg border border-white/12 bg-[#08090C] px-3 py-2 text-sm text-[#F2F0EC] focus:border-[#65C8F5] focus:outline-none"
            >
              <option value="editorial">Featured</option>
              <option value="recent">Recently updated</option>
            </select>
          </div>

          <div className="lg:col-span-12">
            <p className="mb-2 text-xs font-medium text-[#A7ADB7]">Featured &amp; Archive</p>
            <div role="tablist" aria-label="Filter by archive scope" className="flex flex-wrap gap-2">
              {scopeTabs.map((tab) => {
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
                    className={`min-h-[38px] rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                      selected
                        ? "border-[#65C8F5] bg-[#65C8F5]/14 text-[#65C8F5]"
                        : "border-white/12 bg-[#08090C] text-[#A7ADB7] hover:border-white/25 hover:text-[#F2F0EC]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Result count bar + contextual active filter reset */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="sr-only">Projects</h2>
        <p aria-live="polite" className="text-xs text-[#A7ADB7]">
          Showing <span className="font-mono font-semibold text-[#F2F0EC]">{filtered.length}</span>{" "}
          of <span className="font-mono font-semibold text-[#F2F0EC]">{items.length}</span> projects
        </p>

        {hasActiveFilter && (
          <button
            type="button"
            onClick={resetFilters}
            className="active-press inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-white/15 bg-[#15171C] px-3.5 py-1.5 text-xs font-medium text-[#F2F0EC] transition-colors hover:border-[#65C8F5] hover:text-[#65C8F5]"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Clear filters</span>
          </button>
        )}
      </div>

      {/* Gallery, Editorial Index, or Empty State */}
      {filtered.length === 0 ? (
        <div className="border-y border-white/10 py-16 text-center">
          <h2 className="font-display text-lg font-bold text-[#F2F0EC]">
            No matching projects found
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#A7ADB7]">
            No entries matched your current filter selection. Reset filters to view all{" "}
            {items.length} projects.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="active-press mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#F2F0EC] px-5 py-2.5 text-sm font-semibold text-[#08090C] transition-colors hover:bg-[#65C8F5]"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>Reset all filters</span>
          </button>
        </div>
      ) : viewMode === "gallery" ? (
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              priorityImage={index < 3}
              featuredLead={index === 0}
            />
          ))}
        </div>
      ) : (
        <div className="relative divide-y divide-white/10 border-y border-white/10">
          {filtered.map((project, index) => (
            <div
              key={project.id}
              onPointerMove={(e) => {
                if (!canHover || qualityMode === "reduced" || e.pointerType === "touch") return;
                setHoveredPreview({ project, x: e.clientX, y: e.clientY });
              }}
              onPointerLeave={() =>
                setHoveredPreview((prev) => ({ ...prev, project: null }))
              }
              className="group grid grid-cols-1 gap-2 py-4 transition-colors hover:bg-white/[0.025] md:grid-cols-12 md:items-center md:gap-4"
            >
              <span className="font-mono text-xs text-[#65C8F5] md:col-span-1">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="min-w-0 md:col-span-5">
                <Link
                  href={`/projects/${project.slug}/`}
                  prefetch={false}
                  className="font-display block truncate text-base font-bold text-[#F2F0EC] transition-colors group-hover:text-[#65C8F5]"
                >
                  {project.title}
                </Link>
                {project.projectOrigin === "fork" && project.upstreamCredit && (
                  <p className="truncate text-xs text-amber-300">
                    {project.upstreamCredit}
                  </p>
                )}
              </div>

              <span className="text-xs text-[#A7ADB7] md:col-span-3">
                {project.projectOrigin === "professional" ? "Professional Work · " : ""}
                {project.category}
              </span>

              <span className="truncate text-xs text-[#D6D9DF] md:col-span-2">
                {project.technologies.slice(0, 2).join(" · ")}
              </span>

              <div className="md:col-span-1 md:text-right">
                <Link
                  href={`/projects/${project.slug}/`}
                  prefetch={false}
                  aria-label={`Open case study for ${project.title}`}
                  className="inline-flex min-h-[36px] items-center justify-end gap-1 text-xs font-medium text-[#65C8F5]"
                >
                  <span>Open</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}

          <ProjectHoverPreview
            project={hoveredPreview.project}
            pointerX={hoveredPreview.x}
            pointerY={hoveredPreview.y}
          />
        </div>
      )}
    </div>
  );
}
