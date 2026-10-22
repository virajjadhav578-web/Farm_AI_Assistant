import {
  AreaUnit,
  SoilType,
  IrrigationMethod,
  FertilizerCalculationInput,
  FertilizerCalculationResult,
  IrrigationPlanInput,
  IrrigationPlanResult,
  CropRecommendationInput,
  CropRecommendationItem,
} from "../../types";
import { convertArea } from "../utils";

// Official State Agricultural University (SAU) Recommended Dose of Fertilizer (RDF in kg/ha: N-P-K)
export const CROP_RDF_DATABASE: Record<string, { n: number; p: number; k: number; category: string; duration: string; season: string }> = {
  "Sugarcane": { n: 250, p: 115, k: 115, category: "Cash Crop", duration: "12-14 months", season: "Whole Year" },
  "Cotton (Bt)": { n: 120, p: 60, k: 60, category: "Fiber / Cash", duration: "150-180 days", season: "Kharif" },
  "Soybean": { n: 30, p: 60, k: 30, category: "Oilseed", duration: "90-105 days", season: "Kharif" },
  "Wheat": { n: 120, p: 60, k: 40, category: "Cereal", duration: "110-125 days", season: "Rabi" },
  "Onion (Rabi)": { n: 100, p: 50, k: 50, category: "Vegetable", duration: "110-130 days", season: "Rabi" },
  "Maize (Corn)": { n: 120, p: 60, k: 40, category: "Cereal", duration: "100-115 days", season: "Kharif" },
  "Chickpea (Chana / Harbhara)": { n: 25, p: 50, k: 0, category: "Pulse", duration: "90-110 days", season: "Rabi" },
  "Pigeon Pea (Tur / Arhar)": { n: 25, p: 50, k: 0, category: "Pulse", duration: "150-180 days", season: "Kharif" },
  "Pomegranate": { n: 200, p: 100, k: 100, category: "Horticulture", duration: "Perennial", season: "Whole Year" },
  "Tomato": { n: 150, p: 100, k: 100, category: "Vegetable", duration: "100-120 days", season: "Kharif / Rabi" },
};

/**
 * Calculates fertilizer product requirements based on RDF and area.
 */
export function calculateFertilizers(input: FertilizerCalculationInput): FertilizerCalculationResult {
  const areaHa = convertArea(input.area, input.areaUnit, 'hectares');

  // Total pure nutrient requirement for the given plot area (kg)
  const totalN = Number((input.nitrogenRequiredKgHa * areaHa).toFixed(1));
  const totalP = Number((input.phosphorusRequiredKgHa * areaHa).toFixed(1));
  const totalK = Number((input.potassiumRequiredKgHa * areaHa).toFixed(1));

  const stepsExplanation: string[] = [];
  stepsExplanation.push(`1. Converted input area: ${input.area} ${input.areaUnit} = ${areaHa.toFixed(3)} hectares.`);
  stepsExplanation.push(`2. Target Nutrients: N = ${totalN} kg, P₂O₅ = ${totalP} kg, K₂O = ${totalK} kg.`);

  const recommendedProducts: FertilizerCalculationResult['recommendedProducts'] = [];

  // Plan A: Standard DAP + Urea + MOP
  if (input.selectedFertilizers.dap || (!input.selectedFertilizers.npk_10_26_26 && !input.selectedFertilizers.ssp)) {
    // DAP supplies 46% P2O5 and 18% N
    let dapKg = 0;
    let nSuppliedByDap = 0;
    if (totalP > 0) {
      dapKg = Number((totalP / 0.46).toFixed(1));
      nSuppliedByDap = Number((dapKg * 0.18).toFixed(1));
      recommendedProducts.push({
        name: "DAP (Diammonium Phosphate 18:46:0)",
        nutrientGrade: "18% N, 46% P₂O₅",
        quantityKg: dapKg,
        numberOfBags50kg: Math.ceil(dapKg / 50),
        notes: `Supplies all ${totalP} kg P₂O₅ and contributes ${nSuppliedByDap} kg N. Apply as basal dose at sowing.`,
      });
      stepsExplanation.push(`3. DAP calculation: ${totalP} kg P₂O₅ ÷ 0.46 = ${dapKg} kg DAP. (Contains ${nSuppliedByDap} kg N).`);
    }

    // Remaining N supplied by Urea (46% N)
    const remainingN = Math.max(0, totalN - nSuppliedByDap);
    const ureaKg = Number((remainingN / 0.46).toFixed(1));
    recommendedProducts.push({
      name: "Urea (46% N)",
      nutrientGrade: "46% Nitrogen",
      quantityKg: ureaKg,
      numberOfBags50kg: Math.ceil(ureaKg / 50),
      notes: `Fulfills remaining ${remainingN.toFixed(1)} kg Nitrogen. Best split into 2-3 split applications at critical vegetative stages.`,
    });
    stepsExplanation.push(`4. Urea calculation: Remaining N (${totalN} - ${nSuppliedByDap} = ${remainingN.toFixed(1)} kg) ÷ 0.46 = ${ureaKg} kg Urea.`);

    // K2O supplied by MOP (60% K2O)
    if (totalK > 0) {
      const mopKg = Number((totalK / 0.60).toFixed(1));
      recommendedProducts.push({
        name: "MOP (Muriate of Potash 0:0:60)",
        nutrientGrade: "60% K₂O",
        quantityKg: mopKg,
        numberOfBags50kg: Math.ceil(mopKg / 50),
        notes: `Provides ${totalK} kg Potassium. Apply 50% basal and 50% at flowering/tuber filling.`,
      });
      stepsExplanation.push(`5. MOP calculation: ${totalK} kg K₂O ÷ 0.60 = ${mopKg} kg MOP.`);
    }
  } else if (input.selectedFertilizers.npk_10_26_26) {
    // Plan B: Complex 10:26:26
    // 10:26:26 supplies 10% N, 26% P2O5, 26% K2O
    const complexKg = Number((totalP / 0.26).toFixed(1));
    const nFromComplex = Number((complexKg * 0.10).toFixed(1));
    const kFromComplex = Number((complexKg * 0.26).toFixed(1));

    recommendedProducts.push({
      name: "NPK 10:26:26 Complex",
      nutrientGrade: "10% N, 26% P₂O₅, 26% K₂O",
      quantityKg: complexKg,
      numberOfBags50kg: Math.ceil(complexKg / 50),
      notes: `Provides required ${totalP} kg P₂O₅, ${kFromComplex} kg K₂O, and ${nFromComplex} kg N. Ideal balanced basal application.`,
    });

    const remainingN = Math.max(0, totalN - nFromComplex);
    const ureaKg = Number((remainingN / 0.46).toFixed(1));
    recommendedProducts.push({
      name: "Urea (46% N)",
      nutrientGrade: "46% Nitrogen",
      quantityKg: ureaKg,
      numberOfBags50kg: Math.ceil(ureaKg / 50),
      notes: `Fulfills balance ${remainingN.toFixed(1)} kg Nitrogen in top-dressings.`,
    });

    const remainingK = Math.max(0, totalK - kFromComplex);
    if (remainingK > 2) {
      const mopKg = Number((remainingK / 0.60).toFixed(1));
      recommendedProducts.push({
        name: "MOP (Muriate of Potash)",
        nutrientGrade: "60% K₂O",
        quantityKg: mopKg,
        numberOfBags50kg: Math.ceil(mopKg / 50),
        notes: `Supplements balance ${remainingK.toFixed(1)} kg Potassium.`,
      });
    }

    stepsExplanation.push(`3. Complex calculation: ${totalP} kg P₂O₅ ÷ 0.26 = ${complexKg} kg of 10:26:26.`);
    stepsExplanation.push(`4. Balance Nitrogen: ${remainingN.toFixed(1)} kg ÷ 0.46 = ${ureaKg} kg Urea.`);
  }

  return {
    totalAreaHa: Number(areaHa.toFixed(3)),
    totalNRequiredKg: totalN,
    totalPRequiredKg: totalP,
    totalKRequiredKg: totalK,
    recommendedProducts,
    stepsExplanation,
    disclaimer: "Notice: This calculation is a stoichiometric computation based on university RDF recommendations. Always adapt based on your specific Soil Health Card (SHC) laboratory test results and local soil organic carbon content.",
  };
}

/**
 * Irrigation requirement calculations using standard FAO-56 Penman-Monteith principles.
 */
export function calculateIrrigationPlan(input: IrrigationPlanInput): IrrigationPlanResult {
  // Convert area to square meters (1 Ha = 10,000 sq m; 1 Acre = 4046.86 sq m)
  const areaHa = convertArea(input.area, input.areaUnit, 'hectares');
  const areaSqM = areaHa * 10000;

  // Growth stage crop coefficient (Kc)
  let kc = 0.5; // Initial
  if (input.growthStage === 'Development') kc = 0.8;
  if (input.growthStage === 'Mid-season') kc = 1.15; // Peak water use at flowering/pod
  if (input.growthStage === 'Late season') kc = 0.7;

  // Typical reference ET0 for Maharashtra / Deccan plateau: ~5.0 mm/day
  const et0 = 5.0; 
  let cropEtMm = et0 * kc;

  // Deduct expected rainfall
  const expectedRain = input.expectedRainfallMm || 0;
  if (expectedRain > 0) {
    const effectiveRain = Math.min(expectedRain * 0.8, cropEtMm * 3); // 80% effectiveness
    cropEtMm = Math.max(0, cropEtMm - (effectiveRain / 7)); // Spread over week
  }

  // Irrigation system application efficiency
  let efficiency = 0.85; // Drip
  if (input.irrigationMethod === 'Sprinkler') efficiency = 0.75;
  if (input.irrigationMethod === 'Flood') efficiency = 0.50;
  if (input.irrigationMethod === 'Rainfed') efficiency = 1.0;

  // Water need in liters per day = (Depth in mm / efficiency) * Area in sq m
  // (1 mm of water on 1 sq m = 1 Liter)
  const dailyLiters = Math.round((cropEtMm / efficiency) * areaSqM);
  const weeklyLiters = dailyLiters * 7;

  // Soil texture irrigation interval
  let frequency = "Every 2 days (Drip)";
  let hoursPerSession = 2.5;

  if (input.irrigationMethod === 'Flood') {
    if (input.soilType.includes('Black Cotton')) {
      frequency = "Every 10 to 12 days (Deep black soil retains moisture well)";
      hoursPerSession = 5;
    } else {
      frequency = "Every 6 to 8 days";
      hoursPerSession = 4;
    }
  } else if (input.irrigationMethod === 'Sprinkler') {
    frequency = "Every 4 to 5 days";
    hoursPerSession = 3;
  } else if (input.irrigationMethod === 'Drip') {
    frequency = "Daily or Alternate Days (1.5 - 2.5 hours runtime depending on emitter spacing)";
    hoursPerSession = 2;
  } else {
    frequency = "Rainfed — rely on conserved soil moisture and mulching";
    hoursPerSession = 0;
  }

  const guidance: string[] = [
    `Crop Coefficient (Kc) for ${input.crop} at ${input.growthStage} stage is approx. ${kc}.`,
    `Application efficiency for ${input.irrigationMethod} system is calibrated at ${Math.round(efficiency * 100)}%.`,
    `Soil texture (${input.soilType}) dictates infiltration rate. Avoid standing water to prevent root asphyxiation and collar rot.`,
  ];

  if (input.soilMoistureLevel === 'High') {
    guidance.push("Current soil moisture is already high: withhold scheduled irrigation for 48 hours to avoid fungal root pathogens.");
  }

  return {
    dailyWaterRequirementLiters: dailyLiters,
    totalWeeklyWaterLiters: weeklyLiters,
    recommendedFrequency: frequency,
    durationPerSessionHours: hoursPerSession,
    guidance,
    weatherAdjustment: expectedRain > 5 
      ? `Forecast indicates ${expectedRain} mm rainfall. Reduce irrigation runtime by 50% to conserve electricity and water.`
      : "Dry conditions expected. Maintain regular moisture especially during pollination and flowering.",
    waterSavingTips: [
      "Use organic straw or plastic mulching to reduce surface soil evaporation by up to 35%.",
      "Irrigate during early morning (6 AM - 9 AM) or late evening to minimize evaporative losses.",
      "Install sub-main flushing valves and clean drip screen filters regularly to maintain uniform discharge.",
    ],
    assumptions: [
      "Reference ET₀ assumed at 5.0 mm/day (semi-arid Indian Deccan zone).",
      "Field area measured at " + input.area + " " + input.areaUnit + " (" + (areaSqM).toFixed(0) + " m²).",
      "Drip application efficiency modeled at 85-90%, Flood at 50%.",
    ],
  };
}

/**
 * Intelligent Crop Suitability Recommendation Engine
 */
export function getCropRecommendations(input: CropRecommendationInput): CropRecommendationItem[] {
  const recommendations: CropRecommendationItem[] = [];

  // Match crops based on soil, irrigation, and season
  const isBlackSoil = input.soilType.includes("Black Cotton");
  const isRedSoil = input.soilType.includes("Red");
  const hasAssuredWater = input.irrigationAvailable === "Drip" || input.irrigationAvailable === "Sprinkler" || input.irrigationAvailable === "Flood";

  if (input.season === "Kharif" || input.season === "Whole Year") {
    if (isBlackSoil) {
      recommendations.push({
        cropName: "Cotton (Bt)",
        scientificName: "Gossypium hirsutum",
        suitabilityScore: 94,
        suitabilityExplanation: "Deep black regur soils of Maharashtra have exceptional moisture retention, which matches Cotton's deep taproot system.",
        waterRequirement: "650 - 800 mm",
        expectedDuration: "150 - 180 days",
        plantingWindow: "June 15 to July 10 (after receipt of 75-100mm monsoon rain)",
        soilSuitability: "Ideal in deep, well-drained clayey soils with pH 6.5 - 8.2.",
        risksAndLimitations: [
          "Susceptible to Pink Bollworm and sucking pests (thrips, aphids).",
          "Sensitive to waterlogging during initial 30 days.",
        ],
        recommendedNextActions: [
          "Conduct soil test for available Nitrogen and Zinc.",
          "Install pheromone traps @ 5 per acre within 45 days of sowing.",
        ],
      });

      recommendations.push({
        cropName: "Soybean (JS 335 / JS 9305)",
        scientificName: "Glycine max",
        suitabilityScore: 91,
        suitabilityExplanation: "Highly remunerative Kharif pulse/oilseed with atmospheric nitrogen fixation. Excellent fit for Marathwada and Vidarbha soils.",
        waterRequirement: "450 - 600 mm",
        expectedDuration: "90 - 105 days",
        plantingWindow: "June 20 to July 15",
        soilSuitability: "Performs best in fertile, well-aerated soils with pH 6.0 - 7.5.",
        risksAndLimitations: [
          "Sensitive to dry spells at pod filling and excessive rains at maturity.",
          "Yellow Mosaic Virus risk if whitefly vectors are uncontrolled.",
        ],
        recommendedNextActions: [
          "Seed treatment with Bradyrhizobium and PSB bio-fertilizers.",
          "Ensure seed germination test (>70%) before sowing.",
        ],
      });
    }

    if (hasAssuredWater) {
      recommendations.push({
        cropName: "Sugarcane (Co 86032 / CoM 0265)",
        scientificName: "Saccharum officinarum",
        suitabilityScore: 88,
        suitabilityExplanation: "Premier cash crop for Western Maharashtra (Kolhapur, Pune, Ahmednagar) with assured irrigation and local sugar mill connectivity.",
        waterRequirement: "1500 - 2200 mm",
        expectedDuration: "12 - 14 months",
        plantingWindow: "Suru: Jan-Feb; Adsali: July-August",
        soilSuitability: "Medium to deep fertile soils with good drainage. Tolerates slightly alkaline pH.",
        risksAndLimitations: [
          "High capital and water requirement.",
          "Susceptible to Early Shoot Borer and Whitefly in drought stress.",
        ],
        recommendedNextActions: [
          "Use paired-row drip irrigation to save 40% water.",
          "Apply trash mulching to conserve root zone moisture.",
        ],
      });
    }
  }

  if (input.season === "Rabi" || input.season === "Whole Year") {
    recommendations.push({
      cropName: "Gram / Chickpea (Digvijay / Phule Vikram)",
      scientificName: "Cicer arietinum",
      suitabilityScore: 92,
      suitabilityExplanation: "Drought-hardy pulse requiring minimal irrigation, utilizing conserved subsoil moisture in black soils.",
      waterRequirement: "250 - 350 mm (2-3 light irrigations)",
      expectedDuration: "95 - 110 days",
      plantingWindow: "October 10 to November 15",
      soilSuitability: "Medium to heavy well-drained soils, pH 6.0 - 8.0.",
      risksAndLimitations: [
        "Susceptible to Fusarium wilt in waterlogged soils.",
        "Helicoverpa pod borer attack during pod formation.",
      ],
      recommendedNextActions: [
        "Seed treatment with Trichoderma viride @ 5g/kg seed.",
        "Erect bird perches in field @ 20/acre.",
      ],
    });

    recommendations.push({
      cropName: "Rabi Onion (Bhima Kiran / N-2-4-1)",
      scientificName: "Allium cepa",
      suitabilityScore: 89,
      suitabilityExplanation: "Major commercial vegetable crop with strong storage potential and high market demand across Nashik and Pune belts.",
      waterRequirement: "500 - 650 mm",
      expectedDuration: "120 - 135 days",
      plantingWindow: "Nursery: Oct-Nov; Transplanting: Dec-Jan",
      soilSuitability: "Sandy loam to clay loam, rich in organic matter with pH 6.5 - 7.5.",
      risksAndLimitations: [
        "Price volatility in open mandis.",
        "Purple blotch and thrips infestation in humid spells.",
      ],
      recommendedNextActions: [
        "Apply Sulphur @ 30 kg/ha for better pungency and shelf life.",
        "Use micro-sprinklers for nursery management.",
      ],
    });

    recommendations.push({
      cropName: "Wheat (GW 496 / Lok-1 / HD 2967)",
      scientificName: "Triticum aestivum",
      suitabilityScore: 86,
      suitabilityExplanation: "Staple winter cereal with reliable yields under 4-5 scheduled irrigations during critical growth stages.",
      waterRequirement: "400 - 500 mm",
      expectedDuration: "105 - 120 days",
      plantingWindow: "November 1 to November 25",
      soilSuitability: "Clay loam to black soil with good fertility.",
      risksAndLimitations: [
        "Yield drops if temperature rises prematurely in February (terminal heat stress).",
      ],
      recommendedNextActions: [
        "Ensure first irrigation at Crown Root Initiation (CRI) 21 days after sowing.",
      ],
    });
  }

  // Fallback if empty
  if (recommendations.length === 0) {
    recommendations.push({
      cropName: "Pearl Millet (Bajra)",
      scientificName: "Pennisetum glaucum",
      suitabilityScore: 85,
      suitabilityExplanation: "Resilient coarse grain suitable for lighter soils and low rainfall belts.",
      waterRequirement: "300 - 350 mm",
      expectedDuration: "80 - 90 days",
      plantingWindow: "June 25 to July 20",
      soilSuitability: "Lighter sandy soils to shallow black soils.",
      risksAndLimitations: ["Downy mildew during prolonged wet foliage."],
      recommendedNextActions: ["Apply balanced basal NPK."],
    });
  }

  return recommendations;
}
