"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { useMotionCapabilities } from "@/hooks/useMotionCapabilities";

interface ProjectExplorerProps {
  items: Project[];
}

type OriginFilter = "all" | "professional" | "personal" | "academic" | "experiment";
type ViewMode = "gallery" | "index";

export function ProjectExplorer({ items }: ProjectExplorerProps) {
  const pathname = usePathname();
  const { canHover, reducedMotion } = useMotionCapabilities();

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
    project: Project;
    x: number;
    y: number;
  } | null>(null);

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

  const secondaryFilterCount =
    (tier !== "all" ? 1 : 0) + (category !== "all" ? 1 : 0) + (technology !== "all" ? 1 : 0);

  const hasActiveFilter =
    query.trim() !== "" ||
    origin !== "all" ||
    sort !== "editorial" ||
    secondaryFilterCount > 0;

  const originOptions: { id: OriginFilter; label: string }[] = (
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
    <div className="space-y-6">
      {/* Compact single-row editorial toolbar — keeps first projects visible in initial viewport */}
      <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-[#101216]/85 p-3 backdrop-blur-md lg:flex-row lg:items-center lg:justify-between">
        <div className="relative min-w-0 flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0A6B0]"
          />
          <input
            id="project-search"
            aria-label="Search Projects"
            type="search"
            value={query}
            onChange={(e) => {
              const v = e.target.value;
              setQuery(v);
              updateUrl({ query: v });
            }}
            placeholder="Search projects, systems, or technologies..."
            className="min-h-[42px] w-full rounded-lg border border-white/10 bg-[#08090B]/90 py-2 pl-9 pr-4 text-sm text-[#F1F3F5] placeholder:text-[#7E8591] focus:border-[#00C8F5] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="origin-filter" className="sr-only">
            Engagement Origin
          </label>
          <select
            id="origin-filter"
            aria-label="Engagement Origin"
            value={origin}
            onChange={(e) => {
              const v = e.target.value as OriginFilter;
              setOrigin(v);
              updateUrl({ origin: v });
            }}
            className="min-h-[42px] rounded-lg border border-white/10 bg-[#08090B]/90 px-3 py-2 text-xs font-medium text-[#F1F3F5] focus:border-[#00C8F5] focus:outline-none"
          >
            {originOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>

          <label htmlFor="sort-order" className="sr-only">
            Sort Order
          </label>
          <select
            id="sort-order"
            aria-label="Sort Order"
            value={sort}
            onChange={(e) => {
              const v = e.target.value === "recent" ? "recent" : "editorial";
              setSort(v);
              updateUrl({ sort: v });
            }}
            className="min-h-[42px] rounded-lg border border-white/10 bg-[#08090B]/90 px-3 py-2 text-xs font-medium text-[#F1F3F5] focus:border-[#00C8F5] focus:outline-none"
          >
            <option value="editorial">Editorial order</option>
            <option value="recent">Recently updated</option>
          </select>

          <button
            type="button"
            aria-expanded={filtersOpen}
            aria-controls="more-filters-panel"
            onClick={() => setFiltersOpen((prev) => !prev)}
            className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors ${
              filtersOpen || secondaryFilterCount > 0
                ? "border-[#00C8F5]/60 bg-[#00C8F5]/12 text-[#00C8F5]"
                : "border-white/10 bg-[#08090B]/90 text-[#F1F3F5] hover:border-white/25"
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              More Filters{secondaryFilterCount > 0 ? ` (${secondaryFilterCount})` : ""}
            </span>
          </button>

          <div
            role="group"
            aria-label="Project presentation view"
            className="inline-flex rounded-lg border border-white/10 bg-[#08090B]/90 p-0.5"
          >
            <button
              type="button"
              aria-pressed={viewMode === "gallery"}
              onClick={() => setViewMode("gallery")}
              className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "gallery"
                  ? "bg-white/12 text-[#F1F3F5]"
                  : "text-[#A0A6B0] hover:text-[#F1F3F5]"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Gallery</span>
            </button>
            <button
              type="button"
              aria-pressed={viewMode === "index"}
              onClick={() => setViewMode("index")}
              className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "index"
                  ? "bg-white/12 text-[#F1F3F5]"
                  : "text-[#A0A6B0] hover:text-[#F1F3F5]"
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
          className="grid grid-cols-1 gap-4 rounded-xl border border-white/10 bg-[#101216]/90 p-5 backdrop-blur-md lg:grid-cols-12"
        >
          <div className="lg:col-span-4">
            <label htmlFor="cat-filter" className="mb-1.5 block font-mono text-xs text-[#A0A6B0]">
              Engineering Domain
            </label>
            <select
              id="cat-filter"
              value={category}
              onChange={(e) => {
                const v = e.target.value as "all" | ProjectCategory;
                setCategory(v);
                updateUrl({ category: v });
              }}
              className="min-h-[42px] w-full rounded-lg border border-white/10 bg-[#08090B] px-3 py-2 text-sm text-[#F1F3F5] focus:border-[#00C8F5] focus:outline-none"
            >
              <option value="all">All domains</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-4">
            <label htmlFor="tech-filter" className="mb-1.5 block font-mono text-xs text-[#A0A6B0]">
              Technology Stack
            </label>
            <select
              id="tech-filter"
              value={technology}
              onChange={(e) => {
                const v = e.target.value;
                setTechnology(v);
                updateUrl({ technology: v });
              }}
              className="min-h-[42px] w-full rounded-lg border border-white/10 bg-[#08090B] px-3 py-2 text-sm text-[#F1F3F5] focus:border-[#00C8F5] focus:outline-none"
            >
              <option value="all">All technologies</option>
              {topTechnologies.map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-12">
            <p className="mb-2 font-mono text-xs text-[#A0A6B0]">Catalog Classification Tier</p>
            <div role="tablist" aria-label="Project tier filter" className="flex flex-wrap gap-2">
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
                    className={`min-h-[38px] rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                      selected
                        ? "border-[#00C8F5] bg-[#00C8F5]/15 text-[#00C8F5]"
                        : "border-white/10 bg-[#08090B] text-[#A0A6B0] hover:border-white/25 hover:text-[#F1F3F5]"
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
        <h2 className="sr-only">Filtered Engineering Projects</h2>
        <p aria-live="polite" className="font-mono text-xs text-[#A0A6B0]">
          Showing <span className="font-semibold text-[#F1F3F5]">{filtered.length}</span> of{" "}
          <span className="font-semibold text-[#F1F3F5]">{items.length}</span> verified works
        </p>

        {hasActiveFilter && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-white/15 bg-[#101216] px-3.5 py-1.5 text-xs font-medium text-[#F1F3F5] transition-colors hover:border-[#00C8F5]/60 hover:text-[#00C8F5]"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Clear filters
          </button>
        )}
      </div>

      {/* Gallery or Index View or Empty State */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[#101216]/80 px-6 py-16 text-center">
          <h2 className="font-display text-lg font-bold text-[#F1F3F5]">
            No matching engineering works found
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#A0A6B0]">
            No entries matched your current query or filter combination. Reset filters to view all{" "}
            {items.length} works.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#F1F3F5] px-5 py-2.5 text-sm font-semibold text-[#08090B] transition-colors hover:bg-[#00C8F5]"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset all filters
          </button>
        </div>
      ) : viewMode === "gallery" ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                if (!canHover || reducedMotion || e.pointerType === "touch") return;
                if (project.screenshots[0]) {
                  setHoveredPreview({ project, x: e.clientX + 24, y: e.clientY - 40 });
                } else {
                  setHoveredPreview(null);
                }
              }}
              onPointerLeave={() => setHoveredPreview(null)}
              className="group grid grid-cols-1 gap-2 py-4 transition-colors hover:bg-white/[0.025] md:grid-cols-12 md:items-center md:gap-4"
            >
              <span className="font-mono text-xs text-[#00C8F5] md:col-span-1">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="min-w-0 md:col-span-5">
                <Link
                  href={`/projects/${project.slug}/`}
                  prefetch={false}
                  className="font-display block truncate text-base font-bold text-[#F1F3F5] transition-colors group-hover:text-[#00C8F5]"
                >
                  {project.title}
                </Link>
                {project.projectOrigin === "fork" && project.upstreamCredit && (
                  <p className="truncate font-mono text-[11px] text-amber-300">
                    {project.upstreamCredit}
                  </p>
                )}
              </div>

              <span className="font-mono text-xs text-[#A0A6B0] md:col-span-3">
                {project.projectOrigin === "professional" ? "Professional Work · " : ""}
                {project.category}
              </span>

              <span className="truncate font-mono text-xs text-[#D1D5DB] md:col-span-2">
                {project.technologies.slice(0, 2).join(" · ")}
              </span>

              <div className="md:col-span-1 md:text-right">
                <Link
                  href={`/projects/${project.slug}/`}
                  prefetch={false}
                  aria-label={`Open case study for ${project.title}`}
                  className="inline-flex min-h-[36px] items-center justify-end gap-1 font-mono text-xs text-[#00C8F5]"
                >
                  <span>Open</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}

          {/* Floating desktop preview card when hovering Index rows with screenshots */}
          {hoveredPreview && hoveredPreview.project.screenshots[0] && canHover && !reducedMotion && (
            <div
              aria-hidden="true"
              className="pointer-events-none fixed z-40 hidden w-72 overflow-hidden rounded-xl border border-white/20 bg-[#08090B] shadow-2xl lg:block"
              style={{
                left: `${Math.min(hoveredPreview.x, 1080)}px`,
                top: `${Math.max(84, hoveredPreview.y)}px`,
              }}
            >
              <Image
                src={hoveredPreview.project.screenshots[0].src}
                alt={hoveredPreview.project.screenshots[0].alt}
                width={hoveredPreview.project.screenshots[0].width}
                height={hoveredPreview.project.screenshots[0].height}
                className="aspect-[16/10] w-full object-cover object-top"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
