"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { getCropRecommendations } from "@/lib/services/agronomy";
import { AreaUnit, SoilType, IrrigationMethod, CropRecommendationItem } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Sparkles,
  MapPin,
  Droplets,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Info,
} from "lucide-react";

export default function CropRecommendationPage() {
  const { t } = useLanguage();

  const [state, setState] = useState("Maharashtra");
  const [district, setDistrict] = useState("Pune");
  const [soilType, setSoilType] = useState<SoilType>("Black Cotton Soil (Regur)");
  const [soilPh, setSoilPh] = useState("7.5");
  const [farmArea, setFarmArea] = useState("3.0");
  const [areaUnit, setAreaUnit] = useState<AreaUnit>("acres");
  const [irrigationAvailable, setIrrigationAvailable] = useState<IrrigationMethod>("Drip");
  const [season, setSeason] = useState<"Kharif" | "Rabi" | "Zaid" | "Whole Year">("Kharif");

  const [results, setResults] = useState<CropRecommendationItem[] | null>(null);

  const handleRecommend = (e: React.FormEvent) => {
    e.preventDefault();
    const recommendations = getCropRecommendations({
      state,
      district,
      soilType,
      soilPh: Number(soilPh) || undefined,
      farmArea: Number(farmArea) || 1,
      areaUnit,
      irrigationAvailable,
      season,
    });
    setResults(recommendations);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-farm-200/80 pb-3">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-extrabold text-farm-950 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-farm-700" />
            {t.nav.cropRecommendation}
          </h1>
          <Badge variant="success" className="text-[10px]">
            Agro-Ecological Matcher
          </Badge>
        </div>
        <p className="text-xs text-farm-600 mt-0.5">
          Evaluate crop suitability based on soil texture, irrigation availability, and regional seasons across Maharashtra.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form (4 cols) */}
        <div className="lg:col-span-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold">Land & Agronomic Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRecommend} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-farm-800">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs bg-farm-50/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-farm-800">District</label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                    >
                      <option value="Pune">Pune</option>
                      <option value="Nashik">Nashik</option>
                      <option value="Nagpur">Nagpur</option>
                      <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
                      <option value="Kolhapur">Kolhapur</option>
                      <option value="Solapur">Solapur</option>
                      <option value="Amravati">Amravati</option>
                      <option value="Jalgaon">Jalgaon</option>
                      <option value="Latur">Latur</option>
                      <option value="Ahmednagar">Ahmednagar</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-farm-800">Soil Type</label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value as SoilType)}
                    className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                  >
                    <option value="Black Cotton Soil (Regur)">Black Cotton Soil (Regur)</option>
                    <option value="Red Soil">Red Soil</option>
                    <option value="Alluvial Soil">Alluvial Soil</option>
                    <option value="Sandy Loam">Sandy Loam</option>
                    <option value="Clay Loam">Clay Loam</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-farm-800">Target Season</label>
                    <select
                      value={season}
                      onChange={(e) => setSeason(e.target.value as any)}
                      className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                    >
                      <option value="Kharif">Kharif (Monsoon)</option>
                      <option value="Rabi">Rabi (Winter)</option>
                      <option value="Zaid">Zaid (Summer)</option>
                      <option value="Whole Year">Whole Year</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-farm-800">Irrigation Facility</label>
                    <select
                      value={irrigationAvailable}
                      onChange={(e) => setIrrigationAvailable(e.target.value as IrrigationMethod)}
                      className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                    >
                      <option value="Drip">Drip Irrigation</option>
                      <option value="Sprinkler">Sprinkler System</option>
                      <option value="Flood">Flood Irrigation</option>
                      <option value="Rainfed">Rainfed (Dryland)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 space-y-1">
                    <label className="font-semibold text-farm-800">Farm Area</label>
                    <input
                      type="number"
                      step="0.1"
                      value={farmArea}
                      onChange={(e) => setFarmArea(e.target.value)}
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
                      <option value="acres">Acres</option>
                      <option value="hectares">Hectares</option>
                      <option value="gunthas">Gunthas</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-farm-800">Soil pH (Optional)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={soilPh}
                    onChange={(e) => setSoilPh(e.target.value)}
                    placeholder="e.g. 7.2"
                    className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                  />
                </div>

                <Button type="submit" size="md" className="w-full gap-2 shadow-xs mt-2">
                  <Sparkles className="h-4 w-4" />
                  Evaluate Suitable Crops
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Output (7 cols) */}
        <div className="lg:col-span-7">
          {results ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-farm-950">
                  Recommended Crops for {district} ({season})
                </h3>
                <span className="text-xs text-farm-600">{results.length} matches found</span>
              </div>

              <div className="space-y-4">
                {results.map((crop, idx) => (
                  <Card key={idx} className="border-farm-200/90 shadow-xs hover:border-farm-400 transition-all">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base font-extrabold text-farm-900">
                              {crop.cropName}
                            </CardTitle>
                            {crop.scientificName && (
                              <span className="italic text-xs text-farm-500">
                                ({crop.scientificName})
                              </span>
                            )}
                          </div>
                          <Badge variant="success" className="mt-1 text-[10px]">
                            Suitability Score: {crop.suitabilityScore}/100
                          </Badge>
                        </div>
                        <span className="text-xs font-semibold text-farm-700 bg-farm-50 px-2.5 py-1 rounded-md border border-farm-100">
                          {crop.expectedDuration}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 text-xs">
                      <p className="text-farm-800 leading-relaxed font-medium">
                        {crop.suitabilityExplanation}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-farm-50/70 p-2.5 rounded-lg border border-farm-100">
                        <div>
                          <span className="text-farm-500 font-medium">Planting Window:</span>
                          <p className="text-farm-900 font-semibold">{crop.plantingWindow}</p>
                        </div>
                        <div>
                          <span className="text-farm-500 font-medium">Water Requirement:</span>
                          <p className="text-farm-900 font-semibold">{crop.waterRequirement}</p>
                        </div>
                      </div>

                      {/* Risks */}
                      <div>
                        <h5 className="font-bold text-farm-900 text-[11px] mb-1 flex items-center gap-1 text-amber-800">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                          Key Agronomic Risks & Limitations:
                        </h5>
                        <ul className="list-disc pl-4 space-y-0.5 text-farm-700 text-[11px]">
                          {crop.risksAndLimitations.map((r, rIdx) => (
                            <li key={rIdx}>{r}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Next Actions */}
                      <div>
                        <h5 className="font-bold text-farm-900 text-[11px] mb-1 flex items-center gap-1 text-emerald-800">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          Recommended Next Actions:
                        </h5>
                        <ul className="list-disc pl-4 space-y-0.5 text-farm-700 text-[11px]">
                          {crop.recommendedNextActions.map((a, aIdx) => (
                            <li key={aIdx}>{a}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="rounded-lg bg-farm-50 p-3 border border-farm-200 text-farm-700 text-[11px] flex items-start gap-2">
                <Info className="h-4 w-4 text-farm-600 shrink-0 mt-0.5" />
                <span>
                  Recommendations are computed based on Maharashtra agro-climatic zones, ICAR guidelines, and soil characteristics. Consult your taluka agricultural officer before large-scale commercial shifts.
                </span>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[380px] rounded-xl border border-dashed border-farm-200 bg-white flex flex-col items-center justify-center p-8 text-center">
              <div className="h-14 w-14 rounded-full bg-farm-50 flex items-center justify-center text-farm-500 mb-3">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-sm text-farm-900">Crop Suitability Evaluation</h3>
              <p className="text-xs text-farm-600 max-w-sm mt-1 leading-relaxed">
                Fill in your district, soil type, irrigation system, and season on the left, then click <strong>Evaluate Suitable Crops</strong> to view crop matches.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
