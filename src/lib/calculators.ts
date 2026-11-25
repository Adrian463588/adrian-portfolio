/**
 * Verified mathematical calculation helpers ported directly from:
 * - Adrian463588/coffee-creator (CoffeeScienceEngine.kt)
 * - Adrian463588/ParfumCreator (FormulaCalculationEngine.kt, NativeSecurityBridge.kt, Enums.kt)
 */

export interface BrewRatioResult {
  ratioDenominator: number;
  ratioString: string;
  doseGrams: number;
  waterGrams: number;
}

export interface ExtractionYieldResult {
  extractionYieldPercent: number;
  methodLabel: string;
  assumptions: string;
  balanceBand: "Under-Extracted (<18%)" | "Balanced Target Range (18%–22%)" | "High Extraction (>22%)";
}

export interface BrewStepInput {
  label: string;
  targetWaterGrams: number;
}

export interface ScaledBrewStep {
  label: string;
  targetWaterGrams: number;
  cumulativeMassGrams: number;
}

export function calculateCoffeeBrewRatio(
  doseGrams: number,
  waterGrams: number
): BrewRatioResult | { error: string } {
  if (!Number.isFinite(doseGrams) || doseGrams <= 0 || doseGrams > 2000) {
    return { error: "Dose mass must be between 0.1 g and 2000 g." };
  }
  if (!Number.isFinite(waterGrams) || waterGrams <= 0 || waterGrams > 50000) {
    return { error: "Water mass must be between 1 g and 50000 g." };
  }
  const ratioDenominator = Math.round((waterGrams / doseGrams) * 100) / 100;
  return {
    ratioDenominator,
    ratioString: `1:${ratioDenominator.toFixed(2).replace(/\.?0+$/, (m) => (m === ".00" ? "" : m))}`,
    doseGrams,
    waterGrams,
  };
}

export function calculateCoffeeExtractionYield(params: {
  doseGrams: number;
  beverageMassGrams: number;
  measuredTdsPercent: number;
  brewMethod?: string;
}): ExtractionYieldResult | { error: string } {
  const { doseGrams, beverageMassGrams, measuredTdsPercent, brewMethod = "Percolation" } = params;
  if (!Number.isFinite(doseGrams) || doseGrams <= 0) {
    return { error: "Dose mass must be greater than zero." };
  }
  if (!Number.isFinite(beverageMassGrams) || beverageMassGrams <= 0) {
    return { error: "Measured beverage mass must be greater than zero." };
  }
  if (!Number.isFinite(measuredTdsPercent) || measuredTdsPercent < 0 || measuredTdsPercent > 35) {
    return { error: "Measured TDS must be between 0% and 35% w/w." };
  }
  const solidsTimesHundred = beverageMassGrams * measuredTdsPercent;
  if (solidsTimesHundred > doseGrams * 100) {
    return {
      error:
        "Extraction yield cannot exceed 100% of coffee dose; verify dose, cup weight, and non-coffee solutes.",
    };
  }

  const extractionYieldPercent = Math.round((solidsTimesHundred / doseGrams) * 100) / 100;
  const isImmersion = ["immersion", "french press", "aeropress", "cupping", "cold brew"].some((term) =>
    brewMethod.toLowerCase().includes(term)
  );

  const methodLabel = isImmersion
    ? "Approximate Cup-Only Mass Balance (Immersion)"
    : "Approximate Percolation Mass Balance";

  const assumptions =
    "EY% = (Beverage Mass × Measured TDS%) / Dose. Cup-only mass balance assuming pure coffee dissolved solids. " +
    (isImmersion
      ? "Immersion limitation: retained dissolved solids inside spent grounds are omitted; this is not total immersion extraction yield."
      : "Percolation limitation: retained ground solids are omitted; beverage weight must be measured rather than inferred from pour water.");

  let balanceBand: ExtractionYieldResult["balanceBand"] = "Balanced Target Range (18%–22%)";
  if (extractionYieldPercent < 18) {
    balanceBand = "Under-Extracted (<18%)";
  } else if (extractionYieldPercent > 22) {
    balanceBand = "High Extraction (>22%)";
  }

  return {
    extractionYieldPercent,
    methodLabel,
    assumptions,
    balanceBand,
  };
}

/**
 * Port of CoffeeScienceEngine.scaleRecipeSteps using Hamilton-Hare largest-remainder apportionment.
 * Guarantees exact scaled sum matching targetWaterGrams (within 0.1 g quantum precision).
 */
export function scaleBrewSteps(
  steps: BrewStepInput[],
  initialWaterGrams: number,
  targetWaterGrams: number,
  precisionQuantum = 0.1
): ScaledBrewStep[] | { error: string } {
  if (steps.length === 0) {
    return { error: "At least one pour step is required." };
  }
  if (!Number.isFinite(initialWaterGrams) || initialWaterGrams <= 0) {
    return { error: "Initial total water must be greater than zero." };
  }
  if (!Number.isFinite(targetWaterGrams) || targetWaterGrams <= 0) {
    return { error: "Target total water must be greater than zero." };
  }
  if (!Number.isFinite(precisionQuantum) || precisionQuantum <= 0) {
    return { error: "Precision quantum must be greater than zero." };
  }

  const totalQuantums = Math.round(targetWaterGrams / precisionQuantum);
  const scaleFactor = targetWaterGrams / initialWaterGrams;

  const items = steps.map((step, index) => {
    const safeWater = Math.max(0, Number.isFinite(step.targetWaterGrams) ? step.targetWaterGrams : 0);
    const ideal = safeWater * scaleFactor;
    const quantumsFloat = ideal / precisionQuantum;
    const baseQuantum = Math.floor(quantumsFloat);
    const remainder = quantumsFloat - baseQuantum;
    return { index, step, baseQuantum, remainder };
  });

  const allocated = items.reduce((acc, item) => acc + item.baseQuantum, 0);
  const deficit = Math.min(items.length, Math.max(0, totalQuantums - allocated));

  const bonusIndices = new Set(
    [...items]
      .sort((a, b) => b.remainder - a.remainder || a.index - b.index)
      .slice(0, deficit)
      .map((item) => item.index)
  );

  let runningCumulative = 0;
  return items.map((item) => {
    const stepQuantums = item.baseQuantum + (bonusIndices.has(item.index) ? 1 : 0);
    const target = Math.round(stepQuantums * precisionQuantum * 10) / 10;
    runningCumulative = Math.round((runningCumulative + target) * 10) / 10;
    return {
      label: item.step.label,
      targetWaterGrams: target,
      cumulativeMassGrams: runningCumulative,
    };
  });
}

export type ConcentrationTypeLabel =
  | "Parfum Extrait"
  | "Eau de Parfum (EDP)"
  | "Eau de Toilette (EDT)"
  | "Eau de Cologne (EDC)"
  | "Eau Fraîche";

export type SplLabel = "Subtle" | "Moderate" | "Strong" | "Intense";

export interface PerfumeCalculationResult {
  totalWeightG: number;
  fragranceWeightG: number;
  solventWeightG: number;
  concentrationPct: number;
  concentrationType: ConcentrationTypeLabel;
  typicalWearWindow: string;
  splScore: number;
  splLabel: SplLabel;
  normalizedTopRatio: number;
  normalizedMiddleRatio: number;
  normalizedBaseRatio: number;
}

export function getConcentrationBand(concentrationPct: number): {
  type: ConcentrationTypeLabel;
  typicalWearWindow: string;
} {
  const safe = Number.isFinite(concentrationPct) ? concentrationPct : 0;
  if (safe >= 20) return { type: "Parfum Extrait", typicalWearWindow: "8–12 hours" };
  if (safe >= 15) return { type: "Eau de Parfum (EDP)", typicalWearWindow: "6–8 hours" };
  if (safe >= 8) return { type: "Eau de Toilette (EDT)", typicalWearWindow: "4–6 hours" };
  if (safe >= 4) return { type: "Eau de Cologne (EDC)", typicalWearWindow: "2–4 hours" };
  return { type: "Eau Fraîche", typicalWearWindow: "< 2 hours" };
}

export function getSplBand(score: number): SplLabel {
  const safe = Number.isFinite(score) ? score : 0;
  if (safe <= 25) return "Subtle";
  if (safe <= 50) return "Moderate";
  if (safe <= 75) return "Strong";
  return "Intense";
}

export function calculatePerfumeDilution(params: {
  fragranceGrams: number;
  solventGrams: number;
  topShare: number;
  middleShare: number;
  baseShare: number;
}): PerfumeCalculationResult | { error: string } {
  const { fragranceGrams, solventGrams, topShare, middleShare, baseShare } = params;
  if (!Number.isFinite(fragranceGrams) || fragranceGrams < 0) {
    return { error: "Fragrance oil mass must be zero or positive." };
  }
  if (!Number.isFinite(solventGrams) || solventGrams < 0) {
    return { error: "Carrier/solvent mass must be zero or positive." };
  }
  const totalWeightG = Math.round((fragranceGrams + solventGrams) * 1000) / 1000;
  if (totalWeightG <= 0) {
    return { error: "Total formula weight must be greater than zero." };
  }

  const concentrationPct =
    fragranceGrams > 0 ? Math.min(100, Math.round((fragranceGrams / totalWeightG) * 10000) / 100) : 0;
  const band = getConcentrationBand(concentrationPct);

  const sTop = Number.isFinite(topShare) && topShare >= 0 ? topShare : 0;
  const sMid = Number.isFinite(middleShare) && middleShare >= 0 ? middleShare : 0;
  const sBase = Number.isFinite(baseShare) && baseShare >= 0 ? baseShare : 0;
  const shareSum = sTop + sMid + sBase;

  const normTop = shareSum > 0 ? sTop / shareSum : 0;
  const normMid = shareSum > 0 ? sMid / shareSum : 0;
  const normBase = shareSum > 0 ? sBase / shareSum : 0;

  let splScore = 0;
  if (concentrationPct > 0 && shareSum > 0) {
    // Matches NativeSecurityBridge.calculateSplFallback exact weights (0.5 top, 1.0 mid, 1.5 base) / 3
    const noteWeightFactor = (normBase * 1.5 + normMid * 1.0 + normTop * 0.5) / 3.0;
    splScore = Math.min(100, Math.max(0, Math.round(concentrationPct * noteWeightFactor * 100) / 100));
  }

  return {
    totalWeightG,
    fragranceWeightG: Math.round(fragranceGrams * 1000) / 1000,
    solventWeightG: Math.round(solventGrams * 1000) / 1000,
    concentrationPct,
    concentrationType: band.type,
    typicalWearWindow: band.typicalWearWindow,
    splScore,
    splLabel: getSplBand(splScore),
    normalizedTopRatio: Math.round(normTop * 1000) / 10,
    normalizedMiddleRatio: Math.round(normMid * 1000) / 10,
    normalizedBaseRatio: Math.round(normBase * 1000) / 10,
  };
}

export function solveTargetBatchMass(params: {
  targetTotalGrams: number;
  targetConcentrationPct: number;
}): { fragranceGrams: number; solventGrams: number } | { error: string } {
  const { targetTotalGrams, targetConcentrationPct } = params;
  if (!Number.isFinite(targetTotalGrams) || targetTotalGrams <= 0 || targetTotalGrams > 10000) {
    return { error: "Target batch size must be between 0.1 g and 10000 g." };
  }
  if (!Number.isFinite(targetConcentrationPct) || targetConcentrationPct < 0 || targetConcentrationPct > 100) {
    return { error: "Target concentration must be between 0% and 100%." };
  }
  const fragranceGrams = Math.round(targetTotalGrams * (targetConcentrationPct / 100) * 100) / 100;
  const solventGrams = Math.round((targetTotalGrams - fragranceGrams) * 100) / 100;
  return { fragranceGrams, solventGrams };
}
