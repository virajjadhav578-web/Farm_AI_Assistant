"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { calculateIrrigationPlan } from "@/lib/services/agronomy";
import { AreaUnit, SoilType, IrrigationMethod, IrrigationPlanResult } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Droplets,
  CloudRain,
  Clock,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Activity,
  Info,
} from "lucide-react";

function IrrigationPlannerContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();

  const [crop, setCrop] = useState(searchParams.get("crop") || "Sugarcane");
  const [area, setArea] = useState(searchParams.get("area") || "3.0");
  const [areaUnit, setAreaUnit] = useState<AreaUnit>("acres");
  const [soilType, setSoilType] = useState<SoilType>("Black Cotton Soil (Regur)");
  const [growthStage, setGrowthStage] = useState<"Initial" | "Development" | "Mid-season" | "Late season">("Mid-season");
  const [irrigationMethod, setIrrigationMethod] = useState<IrrigationMethod>("Drip");
  const [soilMoistureLevel, setSoilMoistureLevel] = useState<"High" | "Adequate" | "Low" | "Critical">("Adequate");
  const [expectedRainfallMm, setExpectedRainfallMm] = useState("0");

  const [results, setResults] = useState<IrrigationPlanResult | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = calculateIrrigationPlan({
      crop,
      area: Number(area) || 1,
      areaUnit,
      soilType,
      growthStage,
      irrigationMethod,
      soilMoistureLevel,
      expectedRainfallMm: Number(expectedRainfallMm) || 0,
    });
    setResults(res);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-farm-200/80 pb-3">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-extrabold text-farm-950 flex items-center gap-2">
            <Droplets className="h-5 w-5 text-cyan-700" />
            {t.irrigation.title}
          </h1>
          <Badge variant="default" className="text-[10px]">
            FAO-56 Water Balance Model
          </Badge>
        </div>
        <p className="text-xs text-farm-600 mt-0.5">{t.irrigation.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form (5 cols) */}
        <div className="lg:col-span-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold">Field & Water Inputs</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCalculate} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-farm-800">{t.irrigation.cropLabel}</label>
                  <input
                    type="text"
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    placeholder="e.g. Sugarcane, Cotton, Wheat, Onion"
                    className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 space-y-1">
                    <label className="font-semibold text-farm-800">Cultivated Area</label>
                    <input
                      type="number"
                      step="0.1"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-farm-800">Unit</label>
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

                <div className="space-y-1">
                  <label className="font-semibold text-farm-800">{t.irrigation.soilLabel}</label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value as SoilType)}
                    className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                  >
                    <option value="Black Cotton Soil (Regur)">Black Cotton Soil (Regur)</option>
                    <option value="Clay Loam">Clay Loam</option>
                    <option value="Red Soil">Red Soil</option>
                    <option value="Sandy Loam">Sandy Loam</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-farm-800">{t.irrigation.stageLabel}</label>
                    <select
                      value={growthStage}
                      onChange={(e) => setGrowthStage(e.target.value as any)}
                      className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                    >
                      <option value="Initial">Initial / Germination</option>
                      <option value="Development">Vegetative Development</option>
                      <option value="Mid-season">Mid-season (Peak Bloom)</option>
                      <option value="Late season">Late / Maturity</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-farm-800">{t.irrigation.methodLabel}</label>
                    <select
                      value={irrigationMethod}
                      onChange={(e) => setIrrigationMethod(e.target.value as IrrigationMethod)}
                      className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                    >
                      <option value="Drip">Drip Irrigation (85-90%)</option>
                      <option value="Sprinkler">Sprinkler (75%)</option>
                      <option value="Flood">Flood Furrow (50%)</option>
                      <option value="Rainfed">Rainfed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-farm-800">{t.irrigation.moistureLabel}</label>
                    <select
                      value={soilMoistureLevel}
                      onChange={(e) => setSoilMoistureLevel(e.target.value as any)}
                      className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                    >
                      <option value="Adequate">Adequate</option>
                      <option value="High">High (Recent Rain)</option>
                      <option value="Low">Low (Dry Soil)</option>
                      <option value="Critical">Critical (Wilting)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-farm-800">{t.irrigation.rainLabel}</label>
                    <input
                      type="number"
                      value={expectedRainfallMm}
                      onChange={(e) => setExpectedRainfallMm(e.target.value)}
                      className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                    />
                  </div>
                </div>

                <Button type="submit" size="md" className="w-full gap-2 shadow-xs mt-2">
                  <Droplets className="h-4 w-4" />
                  {t.irrigation.calculateBtn}
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
                        {t.irrigation.resultsTitle}
                      </CardTitle>
                      <p className="text-xs text-farm-600 mt-0.5">
                        {crop} ({growthStage}) on {soilType}
                      </p>
                    </div>
                    <Badge variant="default" className="text-xs">
                      Method: {irrigationMethod}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4 text-xs">
                  {/* Big Number Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-farm-200 bg-cyan-50/50 p-4">
                      <span className="text-farm-600 text-[11px] font-medium block">
                        Estimated Daily Water Requirement
                      </span>
                      <p className="text-2xl font-extrabold text-cyan-950 mt-1">
                        {results.dailyWaterRequirementLiters.toLocaleString("en-IN")} Liters
                      </p>
                      <p className="text-[11px] text-cyan-800 mt-1">
                        Weekly Need: {results.totalWeeklyWaterLiters.toLocaleString("en-IN")} Liters
                      </p>
                    </div>

                    <div className="rounded-xl border border-farm-200 bg-farm-50/50 p-4">
                      <span className="text-farm-600 text-[11px] font-medium block">
                        Recommended Application Schedule
                      </span>
                      <p className="text-base font-extrabold text-farm-950 mt-1">
                        {results.recommendedFrequency}
                      </p>
                      {results.durationPerSessionHours > 0 && (
                        <p className="text-[11px] text-farm-700 mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Runtime: ~{results.durationPerSessionHours} hours/session
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Weather Adjustment Notice */}
                  <div className="rounded-lg bg-blue-50/80 p-3 border border-blue-200 text-blue-950">
                    <p className="font-semibold text-xs flex items-center gap-1.5">
                      <CloudRain className="h-4 w-4 text-blue-600" />
                      Weather & Rainfall Adjustment:
                    </p>
                    <p className="text-[11px] mt-1 leading-relaxed opacity-90">
                      {results.weatherAdjustment}
                    </p>
                  </div>

                  {/* Agronomic Guidance */}
                  <div>
                    <h5 className="font-bold text-farm-900 mb-1.5 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-farm-600" />
                      Field Specific Agronomic Guidance:
                    </h5>
                    <ul className="list-disc pl-4 space-y-1 text-farm-800 text-[11px]">
                      {results.guidance.map((g, idx) => (
                        <li key={idx} className="leading-relaxed">{g}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Water Saving Tips */}
                  <div>
                    <h5 className="font-bold text-farm-900 mb-1.5 flex items-center gap-1.5">
                      <Droplets className="h-4 w-4 text-cyan-600" />
                      {t.irrigation.waterSaving}:
                    </h5>
                    <ul className="list-disc pl-4 space-y-1 text-farm-700 text-[11px]">
                      {results.waterSavingTips.map((tip, idx) => (
                        <li key={idx} className="leading-relaxed">{tip}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Assumptions */}
                  <div className="rounded-lg bg-farm-50 p-3 border border-farm-100 text-[10px] text-farm-600 space-y-1">
                    <p className="font-bold text-farm-800">Model Assumptions & Calibration:</p>
                    {results.assumptions.map((asmp, aIdx) => (
                      <p key={aIdx}>• {asmp}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="h-full min-h-[380px] rounded-xl border border-dashed border-farm-200 bg-white flex flex-col items-center justify-center p-8 text-center">
              <div className="h-14 w-14 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-700 mb-3">
                <Droplets className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-sm text-farm-900">Irrigation Planner Ready</h3>
              <p className="text-xs text-farm-600 max-w-sm mt-1 leading-relaxed">
                Provide your crop type, soil moisture level, and irrigation method on the left to compute water requirements in liters and pumping schedules.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function IrrigationPlannerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-farm-600">Loading irrigation planner...</div>}>
      <IrrigationPlannerContent />
    </Suspense>
  );
}
