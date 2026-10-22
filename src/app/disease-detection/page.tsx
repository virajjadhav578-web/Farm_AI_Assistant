"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { DiseaseAnalysisResult } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AlertBanner } from "@/components/ui/AlertBanner";
import {
  Bug,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  ShieldAlert,
  HelpCircle,
  FileText,
  Activity,
} from "lucide-react";

export default function DiseaseDetectionPage() {
  const { t } = useLanguage();
  const [cropName, setCropName] = useState("Cotton (कापूस)");
  const [symptoms, setSymptoms] = useState("");
  const [cropAgeDays, setCropAgeDays] = useState("45");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DiseaseAnalysisResult | null>(null);

  const sampleCrops = [
    { name: "Cotton (कापूस)", id: "cotton" },
    { name: "Soybean (सोयाबीन)", id: "soybean" },
    { name: "Sugarcane (ऊस)", id: "sugarcane" },
    { name: "Onion (कांदा)", id: "onion" },
    { name: "Tomato (टोमॅटो)", id: "tomato" },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please upload a valid JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size exceeds 5MB. Please choose a smaller photo.");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const loadSample = (crop: string) => {
    setCropName(crop);
    // Lightweight inline placeholder svg preview for sample testing
    setImagePreview("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='260' viewBox='0 0 400 260'><rect width='400' height='260' fill='%23dcfce7'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%23166534'>Foliar Leaf Photo: " + encodeURIComponent(crop) + "</text></svg>");
    setSymptoms("Angular brown spots observed on lower canopy leaves after continuous wet fog.");
  };

  const handleAnalyze = async () => {
    if (!imagePreview) {
      setError("Please upload or select an affected plant leaf image first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/disease-detection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropName,
          imageBase64: imagePreview,
          symptoms,
          cropAgeDays,
        }),
      });

      if (!res.ok) {
        throw new Error("Analysis failed. Server responded with an error.");
      }

      const data = await res.json();
      setResult(data.result);
    } catch (err: any) {
      console.error(err);
      setError("Unable to complete analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearAnalysis = () => {
    setResult(null);
    setImagePreview(null);
    setSymptoms("");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-farm-200/80 pb-3">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-extrabold text-farm-950 flex items-center gap-2">
            <Bug className="h-5 w-5 text-emerald-700" />
            {t.disease.title}
          </h1>
          <Badge variant="success" className="text-[10px]">
            AI Computer Vision Diagnostics
          </Badge>
        </div>
        <p className="text-xs text-farm-600 mt-0.5">{t.disease.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Upload & Input Form */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center justify-between">
                <span>Diagnostic Input</span>
                {imagePreview && (
                  <Button variant="ghost" size="sm" onClick={clearAnalysis} className="h-7 text-xs text-rose-600">
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Clear
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              {/* Crop Selector */}
              <div className="space-y-1.5">
                <label className="font-semibold text-farm-800">{t.disease.step1}</label>
                <select
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                >
                  {sampleCrops.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                  <option value="Wheat (गहू)">Wheat (गहू)</option>
                  <option value="Gram / Chana (चना)">Gram / Chana (चना)</option>
                  <option value="Pomegranate (डाळिंब)">Pomegranate (डाळिंब)</option>
                </select>
              </div>

              {/* Sample Photo Loaders for Evaluation */}
              <div className="space-y-1">
                <span className="text-[11px] text-farm-500 font-medium">Or load verified field sample:</span>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {sampleCrops.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => loadSample(c.name)}
                      className="rounded border border-farm-200 bg-farm-50/70 px-2 py-0.5 text-[10px] font-semibold text-farm-700 hover:bg-farm-100"
                    >
                      {c.name.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Upload Area */}
              <div className="space-y-1.5">
                <label className="font-semibold text-farm-800">{t.disease.step2}</label>
                <div className="relative rounded-xl border-2 border-dashed border-farm-300 p-4 text-center hover:border-farm-500 transition-colors bg-farm-50/30">
                  {imagePreview ? (
                    <div className="space-y-2">
                      <img
                        src={imagePreview}
                        alt="Crop leaf preview"
                        className="mx-auto h-40 w-full object-cover rounded-lg border border-farm-200"
                      />
                      <label className="inline-block text-[11px] font-bold text-farm-700 hover:underline cursor-pointer">
                        Change Photo
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer block py-4">
                      <Upload className="mx-auto h-8 w-8 text-farm-500 mb-2" />
                      <span className="block text-xs font-bold text-farm-800">
                        Click to upload leaf photo
                      </span>
                      <span className="block text-[10px] text-farm-500 mt-1">
                        Supports JPG, JPEG, PNG (max 5MB)
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Symptoms & Age */}
              <div className="space-y-1.5">
                <label className="font-semibold text-farm-800">{t.disease.step3}</label>
                <textarea
                  rows={2}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g. Yellowing veins, black margins, curled leaf tips..."
                  className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="button"
                onClick={handleAnalyze}
                isLoading={loading}
                disabled={!imagePreview}
                className="w-full gap-2 shadow-xs"
              >
                <Activity className="h-4 w-4" />
                {t.disease.buttonAnalyze}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (7 cols): Diagnostic Results */}
        <div className="lg:col-span-7">
          {result ? (
            <Card className="border-farm-300 shadow-md">
              <CardHeader className="border-b border-farm-100 pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="warning" className="text-[10px]">
                        {result.isDemo ? "Demonstration Analysis" : "Model Prediction"}
                      </Badge>
                      <span className="text-[11px] text-farm-500">
                        Confidence: {result.confidence}% ({result.confidenceLevel})
                      </span>
                    </div>
                    <CardTitle className="text-base font-extrabold text-farm-950 mt-1.5">
                      {result.possibleDisease}
                    </CardTitle>
                    <p className="text-xs text-farm-600">Crop: {result.cropName}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 text-xs">
                {/* Symptoms Observed */}
                <div>
                  <h4 className="font-bold text-farm-900 mb-1.5 flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-farm-600" />
                    Observed Symptoms
                  </h4>
                  <ul className="space-y-1 pl-4 list-disc text-farm-800">
                    {result.symptoms.map((s, idx) => (
                      <li key={idx} className="leading-relaxed">{s}</li>
                    ))}
                  </ul>
                </div>

                {/* Causes & Environmental Stress */}
                <div className="rounded-lg bg-farm-50/70 p-3 border border-farm-100">
                  <h4 className="font-bold text-farm-900 mb-1.5 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    Possible Causes & Environmental Factors
                  </h4>
                  <ul className="space-y-1 pl-4 list-disc text-farm-700 text-[11px]">
                    {result.possibleCauses.map((c, idx) => (
                      <li key={idx} className="leading-relaxed">{c}</li>
                    ))}
                  </ul>
                </div>

                {/* Treatment & IPM */}
                <div>
                  <h4 className="font-bold text-farm-900 mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {t.disease.treatment}
                  </h4>
                  <ul className="space-y-1.5 pl-4 list-disc text-farm-800">
                    {result.suggestedActions.map((a, idx) => (
                      <li key={idx} className="leading-relaxed">{a}</li>
                    ))}
                  </ul>
                </div>

                {/* Prevention */}
                <div>
                  <h4 className="font-bold text-farm-900 mb-1.5 flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4 text-farm-700" />
                    {t.disease.prevention}
                  </h4>
                  <ul className="space-y-1 pl-4 list-disc text-farm-700 text-[11px]">
                    {result.preventiveMeasures.map((p, idx) => (
                      <li key={idx} className="leading-relaxed">{p}</li>
                    ))}
                  </ul>
                </div>

                {/* Expert Confirmation Disclaimer */}
                <div className="rounded-lg bg-amber-50 p-3 border border-amber-200 text-amber-950 text-[11px] leading-relaxed">
                  <strong>Notice:</strong> {t.disease.expertNotice}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full min-h-[380px] rounded-xl border border-dashed border-farm-200 bg-white flex flex-col items-center justify-center p-8 text-center">
              <div className="h-14 w-14 rounded-full bg-farm-50 flex items-center justify-center text-farm-500 mb-3">
                <Bug className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-sm text-farm-900">No Crop Analyzed Yet</h3>
              <p className="text-xs text-farm-600 max-w-sm mt-1 leading-relaxed">
                Select your crop, upload a leaf photo or pick a sample on the left, then click <strong>Analyze Crop Health</strong> to view pathology diagnostics.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
