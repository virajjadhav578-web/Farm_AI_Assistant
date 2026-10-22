"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Sprout,
  Bot,
  Bug,
  CloudSun,
  FlaskConical,
  Droplets,
  TrendingUp,
  MapPin,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Which languages are supported in Farm AI Assistant?",
      a: "Farm AI Assistant provides native interface translations and AI conversational assistance in English, Hindi (हिन्दी), and Marathi (मराठी). You can switch languages at any time from the top bar.",
    },
    {
      q: "How does the Crop Disease Detection work?",
      a: "You upload a photo of an affected plant leaf or crop tissue. Our backend AI model analyzes visual symptoms (e.g., chlorosis, target spots, fungal lesions) and matches them with verified plant pathology databases. It suggests potential causes and integrated pest management steps while always encouraging laboratory confirmation for critical outbreaks.",
    },
    {
      q: "Where does the weather and mandi price data come from?",
      a: "Weather data is retrieved directly from Open-Meteo's high-resolution meteorological models. Agricultural mandi prices reflect daily arrival rates from APMC markets across Maharashtra and verified Indian government open data sources.",
    },
    {
      q: "How are fertilizer requirements calculated?",
      a: "Calculations follow standard State Agricultural University (SAU) stoichiometric formulas (Recommended Dose of Fertilizers - RDF). The calculator computes the exact number of 50-kg commercial fertilizer bags (Urea, DAP, MOP, SSP, 10:26:26) needed for your specified acreage.",
    },
    {
      q: "Is my farm data kept private and secure?",
      a: "Yes. All plot records, crop notes, and uploaded photos are isolated to your authenticated account using PostgreSQL Row Level Security (RLS) policies. We do not sell or share personal agricultural data.",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-farm-50/70 via-white to-white py-16 md:py-24 border-b border-farm-100">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <Badge variant="success" className="gap-1.5 py-1 px-3 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5 text-farm-600" />
                Empowering Indian Agriculture with Artificial Intelligence
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-farm-950 leading-[1.12]">
                Smarter Farming Starts with AI.
              </h1>

              <p className="text-base sm:text-lg text-farm-800/80 leading-relaxed max-w-2xl">
                Get personalized farming guidance, identify potential crop diseases, check local weather, and manage your farm with one intelligent agricultural assistant.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/dashboard">
                  <Button size="lg" className="gap-2 shadow-md hover:shadow-lg">
                    <span>Get Started Free</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg">
                    Explore Features
                  </Button>
                </Link>
              </div>

              {/* Units & Region assurance */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-farm-700/80 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-farm-600" />
                  <span>Marathi, Hindi & English</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-farm-600" />
                  <span>Indian Units: Acres, Gunthas & Quintals</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-farm-600" />
                  <span>Maharashtra APMC Mandi Rates</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border border-farm-200 bg-white p-5 shadow-xl ring-1 ring-farm-900/5">
                <div className="flex items-center justify-between border-b border-farm-100 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-farm-700 flex items-center justify-center text-white">
                      <Sprout className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-farm-900">Farm AI Assistant</h4>
                      <p className="text-[10px] text-farm-600">Active Advisory Engine</p>
                    </div>
                  </div>
                  <Badge variant="amber" className="text-[10px]">Real-time Decision Support</Badge>
                </div>

                <div className="space-y-3">
                  <div className="rounded-lg bg-farm-50/80 p-3 border border-farm-100 text-xs">
                    <p className="font-semibold text-farm-900 mb-1 flex items-center gap-1.5">
                      <CloudSun className="h-4 w-4 text-amber-600" />
                      Pune / Western Maharashtra
                    </p>
                    <p className="text-farm-700 text-[11px]">
                      Temp: 29°C | Humidity: 58% | Ideal 4-hour morning spray window for cotton & soybean.
                    </p>
                  </div>

                  <div className="rounded-lg bg-farm-50/80 p-3 border border-farm-100 text-xs">
                    <p className="font-semibold text-farm-900 mb-1 flex items-center gap-1.5">
                      <Bug className="h-4 w-4 text-rose-600" />
                      Disease Detection Preview
                    </p>
                    <p className="text-farm-700 text-[11px]">
                      Upload cotton or onion leaf photo to detect fungal blight or viral mosaic with IPM steps.
                    </p>
                  </div>

                  <div className="rounded-lg bg-farm-50/80 p-3 border border-farm-100 text-xs">
                    <p className="font-semibold text-farm-900 mb-1 flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                      APMC Lasalgaon Mandi
                    </p>
                    <p className="text-farm-700 text-[11px]">
                      Onion (Red): ₹2,200 / Quintal (Modal) | Arrival: 14,500 Qt.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-farm-100 text-center">
                  <Link href="/dashboard" className="text-xs font-bold text-farm-700 hover:text-farm-900 flex items-center justify-center gap-1">
                    Open Farmer Dashboard <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE-STEP EXPLANATION */}
      <section className="py-16 bg-white border-b border-farm-100">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-farm-950">
              Three Simple Steps to Smarter Agriculture
            </h2>
            <p className="mt-2 text-sm text-farm-700">
              Intuitive digital tools designed specifically for busy farmers in the field.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-farm-200 hover:border-farm-400 transition-all">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-xl bg-farm-100 text-farm-800 flex items-center justify-center font-bold text-lg mb-4">
                  1
                </div>
                <h3 className="font-bold text-base text-farm-900 mb-2">{t.landing.step1Title}</h3>
                <p className="text-xs text-farm-700 leading-relaxed">{t.landing.step1Desc}</p>
              </CardContent>
            </Card>

            <Card className="border-farm-200 hover:border-farm-400 transition-all">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-xl bg-farm-100 text-farm-800 flex items-center justify-center font-bold text-lg mb-4">
                  2
                </div>
                <h3 className="font-bold text-base text-farm-900 mb-2">{t.landing.step2Title}</h3>
                <p className="text-xs text-farm-700 leading-relaxed">{t.landing.step2Desc}</p>
              </CardContent>
            </Card>

            <Card className="border-farm-200 hover:border-farm-400 transition-all">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-xl bg-farm-100 text-farm-800 flex items-center justify-center font-bold text-lg mb-4">
                  3
                </div>
                <h3 className="font-bold text-base text-farm-900 mb-2">{t.landing.step3Title}</h3>
                <p className="text-xs text-farm-700 leading-relaxed">{t.landing.step3Desc}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES SHOWCASE */}
      <section id="features" className="py-16 md:py-20 bg-farm-50/50 border-b border-farm-100">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <Badge variant="default" className="mb-3">
              Full Feature Suite
            </Badge>
            <h2 className="text-3xl font-extrabold text-farm-950 sm:text-4xl">
              {t.landing.featuresHeading}
            </h2>
            <p className="mt-3 text-sm text-farm-700">{t.landing.featuresSub}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. AI Chat */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="h-10 w-10 rounded-lg bg-farm-700 text-white flex items-center justify-center mb-4">
                  <Bot className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-farm-900 mb-1">{t.landing.featureAiChatTitle}</h3>
                <p className="text-xs text-farm-700 mb-4 leading-relaxed">{t.landing.featureAiChatDesc}</p>
                <Link href="/assistant" className="text-xs font-semibold text-farm-700 hover:text-farm-900 flex items-center gap-1">
                  Try AI Assistant <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>

            {/* 2. Disease Detection */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="h-10 w-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center mb-4">
                  <Bug className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-farm-900 mb-1">{t.landing.featureDiseaseTitle}</h3>
                <p className="text-xs text-farm-700 mb-4 leading-relaxed">{t.landing.featureDiseaseDesc}</p>
                <Link href="/disease-detection" className="text-xs font-semibold text-farm-700 hover:text-farm-900 flex items-center gap-1">
                  Upload Leaf Photo <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>

            {/* 3. Weather & Alerts */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="h-10 w-10 rounded-lg bg-blue-700 text-white flex items-center justify-center mb-4">
                  <CloudSun className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-farm-900 mb-1">{t.landing.featureWeatherTitle}</h3>
                <p className="text-xs text-farm-700 mb-4 leading-relaxed">{t.landing.featureWeatherDesc}</p>
                <Link href="/weather" className="text-xs font-semibold text-farm-700 hover:text-farm-900 flex items-center gap-1">
                  Check Local Weather <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>

            {/* 4. Fertilizer Calculator */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="h-10 w-10 rounded-lg bg-amber-600 text-white flex items-center justify-center mb-4">
                  <FlaskConical className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-farm-900 mb-1">{t.landing.featureFertilizerTitle}</h3>
                <p className="text-xs text-farm-700 mb-4 leading-relaxed">{t.landing.featureFertilizerDesc}</p>
                <Link href="/fertilizer-calculator" className="text-xs font-semibold text-farm-700 hover:text-farm-900 flex items-center gap-1">
                  Calculate NPK Bags <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>

            {/* 5. Irrigation Planner */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="h-10 w-10 rounded-lg bg-cyan-700 text-white flex items-center justify-center mb-4">
                  <Droplets className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-farm-900 mb-1">{t.landing.featureIrrigationTitle}</h3>
                <p className="text-xs text-farm-700 mb-4 leading-relaxed">{t.landing.featureIrrigationDesc}</p>
                <Link href="/irrigation" className="text-xs font-semibold text-farm-700 hover:text-farm-900 flex items-center gap-1">
                  Plan Water Schedule <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>

            {/* 6. Market Prices */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="h-10 w-10 rounded-lg bg-harvest-600 text-white flex items-center justify-center mb-4">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-farm-900 mb-1">{t.landing.featureMarketTitle}</h3>
                <p className="text-xs text-farm-700 mb-4 leading-relaxed">{t.landing.featureMarketDesc}</p>
                <Link href="/market-prices" className="text-xs font-semibold text-farm-700 hover:text-farm-900 flex items-center gap-1">
                  View APMC Mandi Rates <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. RESPONSIBLE AI & TRUST SECTION */}
      <section className="py-16 bg-white border-b border-farm-100">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="rounded-2xl border border-farm-200 bg-farm-50/60 p-6 md:p-10">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="h-14 w-14 rounded-2xl bg-farm-700 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-farm-950">{t.landing.trustTitle}</h3>
                <p className="text-xs sm:text-sm text-farm-800/80 leading-relaxed">{t.landing.trustDesc}</p>
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-farm-700 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-farm-600 shrink-0" />
                    <span>No fabricated yield guarantees or false profit promises</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-farm-600 shrink-0" />
                    <span>Calculations aligned with State Agricultural Universities (SAU)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-farm-600 shrink-0" />
                    <span>Clear disclaimer distinctions between diagnosis & suggestions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-farm-600 shrink-0" />
                    <span>Compliant with Indian CIB&RC pest safety norms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-16 bg-farm-50/30 border-b border-farm-100">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-farm-950">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-farm-700">
              Honest and transparent information about how Farm AI Assistant operates.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-farm-200 bg-white overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-sm text-farm-900 hover:bg-farm-50/50"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-farm-600 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 pt-1 text-xs sm:text-sm text-farm-700/90 leading-relaxed border-t border-farm-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-16 bg-gradient-to-r from-farm-800 to-farm-900 text-white">
        <div className="mx-auto max-w-5xl px-4 md:px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Transform Your Farm Decision Making?
          </h2>
          <p className="text-sm sm:text-base text-farm-200 max-w-2xl mx-auto leading-relaxed">
            Join fellow farmers using digital intelligence to prevent disease, optimize fertilizer expenditure, and schedule irrigation accurately.
          </p>
          <div className="pt-2">
            <Link href="/dashboard">
              <Button variant="amber" size="lg" className="gap-2">
                Launch Farmer Dashboard Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
