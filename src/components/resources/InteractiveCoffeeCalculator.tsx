"use client";

import { useId, useMemo, useState } from "react";
import {
  calculateCoffeeBrewRatio,
  calculateCoffeeExtractionYield,
  scaleBrewSteps,
  type BrewStepInput,
} from "@/lib/calculators";

const BASE_POUR_TEMPLATE_250G: BrewStepInput[] = [
  { label: "01 Bloom", targetWaterGrams: 50 },
  { label: "02 First Pour", targetWaterGrams: 70 },
  { label: "03 Second Pour", targetWaterGrams: 70 },
  { label: "04 Final Pour", targetWaterGrams: 60 },
];

const PRESETS = [
  {
    id: "v60",
    label: "V60 Pour-Over",
    dose: "15",
    water: "250",
    beverage: "218",
    tds: "1.38",
    method: "Percolation",
  },
  {
    id: "aeropress",
    label: "AeroPress",
    dose: "14",
    water: "210",
    beverage: "188",
    tds: "1.46",
    method: "Immersion",
  },
  {
    id: "batch",
    label: "Twin Carafe",
    dose: "24",
    water: "400",
    beverage: "352",
    tds: "1.35",
    method: "Percolation",
  },
] as const;

export function InteractiveCoffeeCalculator() {
  const baseId = useId();
  const [doseStr, setDoseStr] = useState("15");
  const [waterStr, setWaterStr] = useState("250");
  const [beverageStr, setBeverageStr] = useState("218");
  const [tdsStr, setTdsStr] = useState("1.38");
  const [brewMethod, setBrewMethod] = useState("Percolation");

  const dose = Number(doseStr);
  const water = Number(waterStr);
  const beverage = Number(beverageStr);
  const tds = Number(tdsStr);

  const ratioResult = useMemo(() => calculateCoffeeBrewRatio(dose, water), [dose, water]);

  const extractionResult = useMemo(
    () =>
      calculateCoffeeExtractionYield({
        doseGrams: dose,
        beverageMassGrams: beverage,
        measuredTdsPercent: tds,
        brewMethod,
      }),
    [dose, beverage, tds, brewMethod]
  );

  const scaledSteps = useMemo(() => {
    if ("error" in ratioResult) return { error: ratioResult.error };
    return scaleBrewSteps(BASE_POUR_TEMPLATE_250G, 250, water, 0.1);
  }, [ratioResult, water]);

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
            Interactive Engine · CoffeeScienceEngine Logic
          </p>
          <h2 id={`${baseId}-heading`} className="mt-1 font-display text-xl font-bold text-[#F2F0EC]">
            Brew Ratio, Extraction Yield &amp; Pour Scaler
          </h2>
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Brew presets">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                setDoseStr(preset.dose);
                setWaterStr(preset.water);
                setBeverageStr(preset.beverage);
                setTdsStr(preset.tds);
                setBrewMethod(preset.method);
              }}
              className="active-press inline-flex min-h-[44px] items-center rounded-full border border-white/15 bg-[#1C1F26] px-3.5 py-1.5 text-xs font-medium text-[#F2F0EC] transition-colors hover:border-[#65C8F5] hover:text-[#65C8F5]"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <div>
          <label htmlFor={`${baseId}-dose`} className="block text-xs font-medium text-[#D6D9DF]">
            Dry Dose (g)
          </label>
          <input
            id={`${baseId}-dose`}
            type="number"
            min="1"
            max="2000"
            step="0.1"
            value={doseStr}
            onChange={(e) => setDoseStr(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor={`${baseId}-water`} className="block text-xs font-medium text-[#D6D9DF]">
            Target Water (g)
          </label>
          <input
            id={`${baseId}-water`}
            type="number"
            min="1"
            max="50000"
            step="1"
            value={waterStr}
            onChange={(e) => setWaterStr(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor={`${baseId}-bev`} className="block text-xs font-medium text-[#D6D9DF]">
            Beverage Mass (g)
          </label>
          <input
            id={`${baseId}-bev`}
            type="number"
            min="1"
            max="50000"
            step="0.5"
            value={beverageStr}
            onChange={(e) => setBeverageStr(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor={`${baseId}-tds`} className="block text-xs font-medium text-[#D6D9DF]">
            Measured TDS (% w/w)
          </label>
          <input
            id={`${baseId}-tds`}
            type="number"
            min="0"
            max="35"
            step="0.01"
            value={tdsStr}
            onChange={(e) => setTdsStr(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-2">
          <label htmlFor={`${baseId}-method`} className="block text-xs font-medium text-[#D6D9DF]">
            Brew Physics
          </label>
          <select
            id={`${baseId}-method`}
            value={brewMethod}
            onChange={(e) => setBrewMethod(e.target.value)}
            className="mt-1.5 min-h-[44px] w-full rounded-lg border border-white/15 bg-[#08090C] px-3.5 py-2 text-sm text-[#F2F0EC] focus:border-[#65C8F5] focus:outline-none"
          >
            <option value="Percolation">Percolation (V60 / Filter)</option>
            <option value="Immersion">Immersion (AeroPress / Press)</option>
          </select>
        </div>
      </div>

      {/* Live Outputs */}
      <div aria-live="polite" className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-[#08090C]/80 p-4">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#A7ADB7]">
            Target Brew Ratio
          </p>
          {"error" in ratioResult ? (
            <p className="mt-2 text-sm text-amber-300" role="status">
              {ratioResult.error}
            </p>
          ) : (
            <>
              <p
                data-testid="coffee-ratio-output"
                className="mt-1 font-display text-3xl font-bold tabular-nums text-[#F2F0EC]"
              >
                {ratioResult.ratioString}
              </p>
              <p className="mt-1 text-xs text-[#A7ADB7]">
                {ratioResult.doseGrams} g coffee : {ratioResult.waterGrams} g brew water
              </p>
            </>
          )}
        </div>

        <div className="rounded-xl border border-white/10 bg-[#08090C]/80 p-4">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#A7ADB7]">
            Cup Extraction Yield
          </p>
          {"error" in extractionResult ? (
            <p className="mt-2 text-sm text-amber-300" role="status">
              {extractionResult.error}
            </p>
          ) : (
            <>
              <div className="mt-1 flex flex-wrap items-baseline gap-2.5">
                <p
                  data-testid="coffee-ey-output"
                  className="font-display text-3xl font-bold tabular-nums text-[#65C8F5]"
                >
                  {extractionResult.extractionYieldPercent.toFixed(2)}%
                </p>
                <span className="rounded-md border border-white/12 bg-[#15171C] px-2 py-0.5 text-xs text-[#D6D9DF]">
                  {extractionResult.balanceBand}
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-[#A7ADB7]">
                {extractionResult.methodLabel}. {extractionResult.assumptions}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Scaled Pour Steps */}
      {!("error" in scaledSteps) && (
        <div className="space-y-2.5">
          <h3 className="font-mono text-xs uppercase tracking-wider text-[#D6D9DF]">
            Hamilton-Hare 4-Stage Pour Schedule (Scaled to {water} g)
          </h3>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[420px] text-left text-xs">
              <thead className="border-b border-white/10 bg-[#08090C] font-mono uppercase text-[#A7ADB7]">
                <tr>
                  <th className="px-4 py-2.5">Stage</th>
                  <th className="px-4 py-2.5">Pour Increment (g)</th>
                  <th className="px-4 py-2.5">Cumulative Scale Target (g)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-[#08090C]/60 font-mono tabular-nums text-[#F2F0EC]">
                {scaledSteps.map((step) => (
                  <tr key={step.label}>
                    <td className="px-4 py-2.5 font-sans font-medium">{step.label}</td>
                    <td className="px-4 py-2.5">{step.targetWaterGrams.toFixed(1)} g</td>
                    <td className="px-4 py-2.5 text-[#65C8F5]">{step.cumulativeMassGrams.toFixed(1)} g</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
