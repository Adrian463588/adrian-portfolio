"use client";

import { useId, useMemo, useState } from "react";
import { calculatePerfumeDilution, solveTargetBatchMass } from "@/lib/calculators";

const BATCH_PRESETS = [
  { id: "edp", label: "EDP Formula (18%)", oil: "5.4", solvent: "24.6", top: "20", mid: "45", base: "35" },
  { id: "extrait", label: "Extrait Trial (25%)", oil: "5.0", solvent: "15.0", top: "15", mid: "40", base: "45" },
  { id: "edc", label: "Citrus EDC (6%)", oil: "3.0", solvent: "47.0", top: "60", mid: "30", base: "10" },
] as const;

export function InteractivePerfumeCalculator() {
  const baseId = useId();
  const [mode, setMode] = useState<"formula" | "target">("formula");
  const [oilStr, setOilStr] = useState("5.4");
  const [solventStr, setSolventStr] = useState("24.6");
  const [topStr, setTopStr] = useState("20");
  const [midStr, setMidStr] = useState("45");
  const [baseStr, setBaseStr] = useState("35");

  const [targetTotalStr, setTargetTotalStr] = useState("30");
  const [targetPctStr, setTargetPctStr] = useState("18");

  const formulaResult = useMemo(
    () =>
      calculatePerfumeDilution({
        fragranceGrams: Number(oilStr),
        solventGrams: Number(solventStr),
        topShare: Number(topStr),
        middleShare: Number(midStr),
        baseShare: Number(baseStr),
      }),
    [oilStr, solventStr, topStr, midStr, baseStr]
  );

  const solvedTarget = useMemo(
    () =>
      solveTargetBatchMass({
        targetTotalGrams: Number(targetTotalStr),
        targetConcentrationPct: Number(targetPctStr),
      }),
    [targetTotalStr, targetPctStr]
  );

  const inputClass =
    "mt-1.5 min-h-[44px] w-full rounded-lg border border-white/15 bg-[#08090C] px-3.5 py-2 font-mono text-sm text-[#F2F0EC] focus:border-[#65C8F5] focus:outline-none";

  return (
    <section
      aria-labelledby={`${baseId}-heading`}
      className="space-y-6 rounded-2xl border border-[#65C8F5]/30 bg-[#15171C]/90 p-5 sm:p-6"
    >
      <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#65C8F5]">
            Interactive Engine · FormulaCalculationEngine Logic
          </p>
          <h2 id={`${baseId}-heading`} className="mt-1 font-display text-xl font-bold text-[#F2F0EC]">
            Perfume Concentration &amp; Dilution Batch Solver
          </h2>
        </div>

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Perfume calculator mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "formula"}
            onClick={() => setMode("formula")}
            className={`active-press inline-flex min-h-[44px] items-center rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              mode === "formula"
                ? "bg-[#F2F0EC] text-[#08090C]"
                : "border border-white/15 bg-[#1C1F26] text-[#F2F0EC] hover:border-[#65C8F5]"
            }`}
          >
            Analyze Oil / Solvent Mass
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "target"}
            onClick={() => setMode("target")}
            className={`active-press inline-flex min-h-[44px] items-center rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              mode === "target"
                ? "bg-[#F2F0EC] text-[#08090C]"
                : "border border-white/15 bg-[#1C1F26] text-[#F2F0EC] hover:border-[#65C8F5]"
            }`}
          >
            Solve Target Batch Weight
          </button>
        </div>
      </div>

      {mode === "formula" ? (
        <>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Concentration presets">
            {BATCH_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  setOilStr(preset.oil);
                  setSolventStr(preset.solvent);
                  setTopStr(preset.top);
                  setMidStr(preset.mid);
                  setBaseStr(preset.base);
                }}
                className="active-press inline-flex min-h-[44px] items-center rounded-full border border-white/15 bg-[#1C1F26] px-3.5 py-1.5 text-xs font-medium text-[#F2F0EC] transition-colors hover:border-[#65C8F5] hover:text-[#65C8F5]"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label htmlFor={`${baseId}-oil`} className="block text-xs font-medium text-[#D6D9DF]">
                Fragrance Oils (g)
              </label>
              <input
                id={`${baseId}-oil`}
                type="number"
                min="0"
                step="0.05"
                value={oilStr}
                onChange={(e) => setOilStr(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor={`${baseId}-solvent`} className="block text-xs font-medium text-[#D6D9DF]">
                Carrier / Ethanol (g)
              </label>
              <input
                id={`${baseId}-solvent`}
                type="number"
                min="0"
                step="0.1"
                value={solventStr}
                onChange={(e) => setSolventStr(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor={`${baseId}-top`} className="block text-xs font-medium text-[#D6D9DF]">
                Top Note Share
              </label>
              <input
                id={`${baseId}-top`}
                type="number"
                min="0"
                step="1"
                value={topStr}
                onChange={(e) => setTopStr(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor={`${baseId}-mid`} className="block text-xs font-medium text-[#D6D9DF]">
                Heart Note Share
              </label>
              <input
                id={`${baseId}-mid`}
                type="number"
                min="0"
                step="1"
                value={midStr}
                onChange={(e) => setMidStr(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor={`${baseId}-base`} className="block text-xs font-medium text-[#D6D9DF]">
                Base Note Share
              </label>
              <input
                id={`${baseId}-base`}
                type="number"
                min="0"
                step="1"
                value={baseStr}
                onChange={(e) => setBaseStr(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div aria-live="polite" className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {"error" in formulaResult ? (
              <p className="text-sm text-amber-300 md:col-span-3" role="status">
                {formulaResult.error}
              </p>
            ) : (
              <>
                <div className="rounded-xl border border-white/10 bg-[#08090C]/80 p-4">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-[#A7ADB7]">
                    Concentration
                  </p>
                  <p
                    data-testid="perfume-conc-output"
                    className="mt-1 font-display text-3xl font-bold tabular-nums text-[#65C8F5]"
                  >
                    {formulaResult.concentrationPct.toFixed(2)}%
                  </p>
                  <p className="mt-1 text-xs text-[#A7ADB7]">
                    Total weight: {formulaResult.totalWeightG} g
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#08090C]/80 p-4">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-[#A7ADB7]">
                    Category Bracket
                  </p>
                  <p className="mt-1 font-display text-xl font-bold text-[#F2F0EC]">
                    {formulaResult.concentrationType}
                  </p>
                  <p className="mt-1 text-xs text-[#A7ADB7]">
                    Indicative band: {formulaResult.typicalWearWindow}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#08090C]/80 p-4">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-[#A7ADB7]">
                    Heuristic Note Score (SPL)
                  </p>
                  <p className="mt-1 font-display text-2xl font-bold tabular-nums text-[#F2F0EC]">
                    {formulaResult.splScore.toFixed(2)} · {formulaResult.splLabel}
                  </p>
                  <p className="mt-1 text-xs text-[#A7ADB7]">
                    Pyramid: {formulaResult.normalizedTopRatio}% T / {formulaResult.normalizedMiddleRatio}% H /{" "}
                    {formulaResult.normalizedBaseRatio}% B
                  </p>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${baseId}-target-total`} className="block text-xs font-medium text-[#D6D9DF]">
                Desired Batch Weight (g)
              </label>
              <input
                id={`${baseId}-target-total`}
                type="number"
                min="0.1"
                max="10000"
                step="0.5"
                value={targetTotalStr}
                onChange={(e) => setTargetTotalStr(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor={`${baseId}-target-pct`} className="block text-xs font-medium text-[#D6D9DF]">
                Target Oil Concentration (%)
              </label>
              <input
                id={`${baseId}-target-pct`}
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={targetPctStr}
                onChange={(e) => setTargetPctStr(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div aria-live="polite" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {"error" in solvedTarget ? (
              <p className="text-sm text-amber-300 sm:col-span-2" role="status">
                {solvedTarget.error}
              </p>
            ) : (
              <>
                <div className="rounded-xl border border-white/10 bg-[#08090C]/80 p-4">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-[#A7ADB7]">
                    Fragrance Oil Required
                  </p>
                  <p
                    data-testid="perfume-solved-oil"
                    className="mt-1 font-display text-3xl font-bold tabular-nums text-[#65C8F5]"
                  >
                    {solvedTarget.fragranceGrams.toFixed(2)} g
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#08090C]/80 p-4">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-[#A7ADB7]">
                    Carrier / Alcohol Solvent Required
                  </p>
                  <p className="mt-1 font-display text-3xl font-bold tabular-nums text-[#F2F0EC]">
                    {solvedTarget.solventGrams.toFixed(2)} g
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
