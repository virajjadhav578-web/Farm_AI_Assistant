"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { DemoStore } from "@/lib/supabase/demo-store";
import { AreaUnit, SoilType, IrrigationMethod } from "@/types";
import { Sprout, Check, ArrowRight, ArrowLeft } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Account
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Step 2: Farm Onboarding
  const [state, setState] = useState("Maharashtra");
  const [district, setDistrict] = useState("Pune");
  const [village, setVillage] = useState("");
  const [farmArea, setFarmArea] = useState("4.5");
  const [areaUnit, setAreaUnit] = useState<AreaUnit>("acres");
  const [soilType, setSoilType] = useState<SoilType>("Black Cotton Soil (Regur)");
  const [waterAvailability, setWaterAvailability] = useState("Borewell & Canal");
  const [experience, setExperience] = useState("10");

  // Step 3: First Plot
  const [plotName, setPlotName] = useState("Main Plot 1");
  const [plotArea, setPlotArea] = useState("2.5");
  const [currentCrop, setCurrentCrop] = useState("Cotton (Bt)");
  const [sowingDate, setSowingDate] = useState("2026-06-20");
  const [irrigationMethod, setIrrigationMethod] = useState<IrrigationMethod>("Drip");

  const [loading, setLoading] = useState(false);

  const handleFinish = () => {
    setLoading(true);

    // Save to DemoStore so the user immediately sees their entered plot and profile
    DemoStore.updateProfile({
      full_name: fullName || "Kisan Mitra",
      state,
      district,
      village,
      farm_area: Number(farmArea) || 4.5,
      area_unit: areaUnit,
      soil_type: soilType,
      water_availability: waterAvailability,
      farming_experience_years: Number(experience) || 10,
    });

    if (plotName && Number(plotArea) > 0) {
      DemoStore.savePlot({
        name: plotName,
        area: Number(plotArea),
        area_unit: areaUnit,
        soil_type: soilType,
        current_crop: currentCrop,
        sowing_date: sowingDate,
        irrigation_method: irrigationMethod,
        growth_stage: "Vegetative",
      });
    }

    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 500);
  };

  return (
    <div className="flex min-h-[90vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-farm-700 text-white shadow-md">
            <Sprout className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-farm-950">
            Create Your Farm AI Profile
          </h1>
          <p className="text-xs text-farm-700">
            Smart, personalized agricultural advice starts with your land records
          </p>
        </div>

        {/* Multi-step Progress Bar */}
        <div className="flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                step >= 1 ? "bg-farm-700 text-white" : "bg-farm-200 text-farm-700"
              }`}
            >
              {step > 1 ? <Check className="h-4 w-4" /> : "1"}
            </div>
            <span className="text-xs font-semibold text-farm-900 hidden sm:inline">Account</span>
          </div>

          <div className="h-0.5 w-12 sm:w-20 bg-farm-200" />

          <div className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                step >= 2 ? "bg-farm-700 text-white" : "bg-farm-200 text-farm-700"
              }`}
            >
              {step > 2 ? <Check className="h-4 w-4" /> : "2"}
            </div>
            <span className="text-xs font-semibold text-farm-900 hidden sm:inline">Farm Profile</span>
          </div>

          <div className="h-0.5 w-12 sm:w-20 bg-farm-200" />

          <div className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                step === 3 ? "bg-farm-700 text-white" : "bg-farm-200 text-farm-700"
              }`}
            >
              3
            </div>
            <span className="text-xs font-semibold text-farm-900 hidden sm:inline">First Plot</span>
          </div>
        </div>

        <Card className="border-farm-200/90 shadow-sm">
          {step === 1 && (
            <>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Step 1: Farmer Credentials</CardTitle>
                <CardDescription className="text-xs">
                  Create your login to keep all farm records and analyses private.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-farm-800">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Shinde"
                    className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-farm-800">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ramesh@example.com"
                    className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-farm-800">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full gap-2 text-xs"
                    disabled={!email || !password}
                  >
                    Next: Farm Location & Soil
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Step 2: Farm Location & Soil Details</CardTitle>
                <CardDescription className="text-xs">
                  Needed to provide accurate local weather, mandi rates, and crop suitability.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-farm-800">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs bg-farm-50/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-farm-800">District</label>
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
                      <option value="Satara">Satara</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-farm-800">Total Farm Area</label>
                    <input
                      type="number"
                      step="0.1"
                      value={farmArea}
                      onChange={(e) => setFarmArea(e.target.value)}
                      className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-farm-800">Unit</label>
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

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-farm-800">Primary Soil Type</label>
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

                <div className="flex items-center justify-between pt-2">
                  <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="gap-1">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button size="sm" onClick={() => setStep(3)} className="gap-1">
                    Next: Add First Plot <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {step === 3 && (
            <>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Step 3: Setup First Plot (Optional)</CardTitle>
                <CardDescription className="text-xs">
                  You can configure your current standing crop to receive immediate spray and irrigation reminders.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-farm-800">Plot Name</label>
                  <input
                    type="text"
                    value={plotName}
                    onChange={(e) => setPlotName(e.target.value)}
                    placeholder="e.g. North Canal Plot"
                    className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-farm-800">Current Crop</label>
                    <input
                      type="text"
                      value={currentCrop}
                      onChange={(e) => setCurrentCrop(e.target.value)}
                      placeholder="e.g. Cotton (Bt), Soybean, Wheat"
                      className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-farm-800">Sowing Date</label>
                    <input
                      type="date"
                      value={sowingDate}
                      onChange={(e) => setSowingDate(e.target.value)}
                      className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-farm-800">Irrigation Method</label>
                  <select
                    value={irrigationMethod}
                    onChange={(e) => setIrrigationMethod(e.target.value as IrrigationMethod)}
                    className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                  >
                    <option value="Drip">Drip Irrigation</option>
                    <option value="Sprinkler">Sprinkler System</option>
                    <option value="Flood">Flood / Furrow Irrigation</option>
                    <option value="Rainfed">Rainfed (Dryland)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-farm-100">
                  <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleFinish}>
                      Skip for Now
                    </Button>
                    <Button size="sm" isLoading={loading} onClick={handleFinish} className="gap-1">
                      Complete Onboarding
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          )}
        </Card>

        <p className="text-center text-xs text-farm-700">
          Already registered?{" "}
          <Link href="/login" className="font-bold text-farm-800 hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}
