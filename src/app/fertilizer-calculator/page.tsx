"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { calculateFertilizers, CROP_RDF_DATABASE } from "@/lib/services/agronomy";
import { AreaUnit, FertilizerCalculationResult } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  FlaskConical,
  Scale,
  Package,
  CheckCircle2,
  HelpCircle,
  FileText,
  Info,
} from "lucide-react";

function FertilizerCalculatorContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();

  const [selectedCrop, setSelectedCrop] = useState(searchParams.get("crop") || "Cotton (Bt)");
  const [area, setArea] = useState(searchParams.get("area") || "2.5");
  const [areaUnit, setAreaUnit] = useState<AreaUnit>("acres");
  const [growthStage, setGrowthStage] = useState("Basal (At Sowing)");

  // RDF values in kg/ha
  const [nVal, setNVal] = useState(120);
  const [pVal, setPVal] = useState(60);
  const [kVal, setKVal] = useState(60);

  // Fertilizer products selection
  const [useDap, setUseDap] = useState(true);
  const [useUrea, setUseUrea] = useState(true);
  const [useMop, setUseMop] = useState(true);
  const [useComplex102626, setUseComplex102626] = useState(false);

  const [results, setResults] = useState<FertilizerCalculationResult | null>(null);

  // Update RDF defaults when crop changes
  useEffect(() => {
    const data = CROP_RDF_DATABASE[selectedCrop];
    if (data) {
      setNVal(data.n);
      setPVal(data.p);
      setKVal(data.k);
    }
  }, [selectedCrop]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = calculateFertilizers({
      crop: selectedCrop,
      area: Number(area) || 1,
      areaUnit,
      growthStage,
      nitrogenRequiredKgHa: Number(nVal),
      phosphorusRequiredKgHa: Number(pVal),
      potassiumRequiredKgHa: Number(kVal),
      selectedFertilizers: {
        dap: useDap,
        urea: useUrea,
        mop: useMop,
        npk_10_26_26: useComplex102626,
      },
    });
    setResults(res);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-farm-200/80 pb-3">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-extrabold text-farm-950 flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-amber-600" />
            {t.fertilizer.title}
          </h1>
          <Badge variant="amber" className="text-[10px]">
            Stoichiometric SAU Formulas
          </Badge>
        </div>
        <p className="text-xs text-farm-600 mt-0.5">{t.fertilizer.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form (5 cols) */}
        <div className="lg:col-span-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold">Nutrient & Plot Inputs</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCalculate} className="space-y-4 text-xs">
                {/* Crop Selection */}
                <div className="space-y-1">
                  <label className="font-semibold text-farm-800">{t.fertilizer.cropLabel}</label>
                  <select
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                  >
                    {Object.keys(CROP_RDF_DATABASE).map((crop) => (
                      <option key={crop} value={crop}>
                        {crop} ({CROP_RDF_DATABASE[crop].season})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Area & Unit */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 space-y-1">
                    <label className="font-semibold text-farm-800">{t.fertilizer.areaLabel}</label>
                    <input
                      type="number"
                      step="0.1"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-farm-800">{t.fertilizer.unitLabel}</label>
                    <select
                      value={areaUnit}
                      onChange={(e) => setAreaUnit(e.target.value as AreaUnit)}
                      className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                    >
                      <option value="acres">{t.units.acres}</option>
                      <option value="hectares">{t.units.hectares}</option>
                      <option value="gunthas">{t.units.gunthas}</option>
                    </select>
                  </div>
                </div>

                {/* Target RDF (kg/ha) */}
                <div className="rounded-lg bg-farm-50/70 p-3 border border-farm-100 space-y-2">
                  <label className="font-bold text-farm-900 block text-[11px]">
                    {t.fertilizer.npkLabel}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] text-farm-600 block">{t.fertilizer.nitrogen}</span>
                      <input
                        type="number"
                        value={nVal}
                        onChange={(e) => setNVal(Number(e.target.value))}
                        className="w-full rounded border border-farm-200 p-1 text-center font-bold text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-farm-600 block">{t.fertilizer.phosphorus}</span>
                      <input
                        type="number"
                        value={pVal}
                        onChange={(e) => setPVal(Number(e.target.value))}
                        className="w-full rounded border border-farm-200 p-1 text-center font-bold text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-farm-600 block">{t.fertilizer.potassium}</span>
                      <input
                        type="number"
                        value={kVal}
                        onChange={(e) => setKVal(Number(e.target.value))}
                        className="w-full rounded border border-farm-200 p-1 text-center font-bold text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Fertilizer Choice */}
                <div className="space-y-2">
                  <label className="font-semibold text-farm-800 block">
                    {t.fertilizer.selectProducts}
                  </label>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="plan"
                        checked={!useComplex102626}
                        onChange={() => setUseComplex102626(false)}
                        className="text-farm-700"
                      />
                      <span>Standard Plan: DAP (18:46:0) + Urea (46% N) + MOP (60% K₂O)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="plan"
                        checked={useComplex102626}
                        onChange={() => setUseComplex102626(true)}
                        className="text-farm-700"
                      />
                      <span>Complex Plan: NPK 10:26:26 + Urea + MOP</span>
                    </label>
                  </div>
                </div>

                <Button type="submit" size="md" className="w-full gap-2 shadow-xs">
                  <Scale className="h-4 w-4" />
                  {t.fertilizer.calculateBtn}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Output (7 cols) */}
        <div className="lg:col-span-7">
          {results ? (
            <div className="space-y-4">
              <Card className="border-farm-300 shadow-sm">
                <CardHeader className="pb-3 border-b border-farm-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-bold text-farm-950">
                        {t.fertilizer.resultsHeading}
                      </CardTitle>
                      <p className="text-xs text-farm-600 mt-0.5">
                        For {area} {areaUnit} ({results.totalAreaHa} Hectares) of {selectedCrop}
                      </p>
                    </div>
                    <Badge variant="default" className="text-xs">
                      Total NPK: {results.totalNRequiredKg} - {results.totalPRequiredKg} - {results.totalKRequiredKg} kg
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {results.recommendedProducts.map((p, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-farm-200 bg-farm-50/50 p-3.5 shadow-2xs"
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="font-bold text-farm-900 text-sm leading-tight">{p.name}</h4>
                          <span className="h-7 w-7 rounded-full bg-farm-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {p.numberOfBags50kg}
                          </span>
                        </div>
                        <p className="text-[11px] text-farm-600 font-medium mt-1">{p.nutrientGrade}</p>
                        <div className="mt-2 flex items-center justify-between text-xs pt-2 border-t border-farm-200/60">
                          <span className="font-bold text-farm-950 text-sm">{p.quantityKg} kg</span>
                          <span className="text-[11px] font-semibold text-farm-700">
                            {p.numberOfBags50kg} Bags (50 kg)
                          </span>
                        </div>
                        <p className="text-[10px] text-farm-700 mt-2 leading-relaxed bg-white/70 p-1.5 rounded border border-farm-100">
                          {p.notes}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl bg-white border border-farm-200 p-4 mt-4 space-y-2">
                    <h5 className="font-bold text-farm-900 text-xs flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-farm-600" />
                      {t.fertilizer.formulaSteps}
                    </h5>
                    <div className="space-y-1 font-mono text-[11px] text-farm-800 bg-farm-50/60 p-2.5 rounded-lg border border-farm-100">
                      {results.stepsExplanation.map((step, sIdx) => (
                        <p key={sIdx} className="leading-relaxed">{step}</p>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg bg-amber-50 p-3 border border-amber-200 text-amber-950 text-[11px]">
                    <strong>Agronomic Notice:</strong> {results.disclaimer}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="h-full min-h-[380px] rounded-xl border border-dashed border-farm-200 bg-white flex flex-col items-center justify-center p-8 text-center">
              <div className="h-14 w-14 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mb-3">
                <FlaskConical className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-sm text-farm-900">Fertilizer Calculator Ready</h3>
              <p className="text-xs text-farm-600 max-w-sm mt-1 leading-relaxed">
                Enter your crop, plot area, and target RDF on the left, then click <strong>{t.fertilizer.calculateBtn}</strong> to see commercial bag quantities and step-by-step stoichiometric breakdown.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FertilizerCalculatorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-farm-600">Loading fertilizer calculator...</div>}>
      <FertilizerCalculatorContent />
    </Suspense>
  );
}
