"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { DemoStore } from "@/lib/supabase/demo-store";
import { fetchWeatherData, getDemonstrationWeatherData } from "@/lib/services/weather-service";
import { REALISTIC_MANDI_RECORDS } from "@/lib/services/market-service";
import { FarmPlot, FarmTask, UserProfile, WeatherData } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AlertBanner } from "@/components/ui/AlertBanner";
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
  Calendar,
  ArrowRight,
  Plus,
  Clock,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plots, setPlots] = useState<FarmPlot[]>([]);
  const [tasks, setTasks] = useState<FarmTask[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    // Load local farmer state
    const p = DemoStore.getProfile();
    const pl = DemoStore.getPlots();
    const tk = DemoStore.getTasks();
    setProfile(p);
    setPlots(pl);
    setTasks(tk);

    // Fetch weather for farmer district
    fetchWeatherData(p.district || "Pune")
      .then((w) => {
        setWeather(w);
        setWeatherLoading(false);
      })
      .catch(() => {
        setWeather(getDemonstrationWeatherData(p.district || "Pune"));
        setWeatherLoading(false);
      });
  }, []);

  const totalArea = plots.reduce((acc, plot) => acc + (Number(plot.area) || 0), 0);
  const pendingTasks = tasks.filter((t) => t.status !== "completed");
  const watchlistCrops = DemoStore.getWatchlist();
  const watchlistRecords = REALISTIC_MANDI_RECORDS.filter((r) =>
    watchlistCrops.some((c) => r.crop.toLowerCase().includes(c.toLowerCase()))
  ).slice(0, 3);

  const toggleTask = (taskId: string) => {
    DemoStore.toggleTaskStatus(taskId);
    setTasks(DemoStore.getTasks());
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP WELCOME & SUMMARY BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-farm-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-farm-950">
              {t.dashboard.welcome}, {profile?.full_name || "Ganesh Patil"}
            </h1>
            <Badge variant="success" className="text-[10px]">
              {profile?.district || "Pune"}, {profile?.state || "Maharashtra"}
            </Badge>
          </div>
          <p className="text-xs text-farm-700 mt-1">
            Managing {plots.length} active plots ({totalArea.toFixed(1)} {profile?.area_unit || "acres"} cultivated)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/assistant">
            <Button size="sm" className="gap-1.5 shadow-xs">
              <Bot className="h-4 w-4" />
              <span>{t.dashboard.askAi}</span>
            </Button>
          </Link>
          <Link href="/disease-detection">
            <Button variant="secondary" size="sm" className="gap-1.5 shadow-xs">
              <Bug className="h-4 w-4 text-emerald-700" />
              <span>{t.dashboard.detectDisease}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. LIVE AGRICULTURAL ALERT BANNER */}
      {weather && weather.alerts.length > 0 && (
        <AlertBanner
          type={weather.alerts[0].severity === "critical" ? "critical" : weather.alerts[0].severity === "warning" ? "warning" : "info"}
          title={weather.alerts[0].title}
          description={`${weather.alerts[0].description} Advice: ${weather.alerts[0].action}`}
          action={
            <Link href="/weather">
              <Button variant="outline" size="sm" className="bg-white/80 text-xs">
                View 7-Day Forecast
              </Button>
            </Link>
          }
        />
      )}

      {/* 3. KEY METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-farm-700">Active Plots</span>
            <MapPin className="h-4 w-4 text-farm-600" />
          </div>
          <p className="text-2xl font-extrabold text-farm-950 mt-2">{plots.length}</p>
          <p className="text-[11px] text-farm-600 mt-0.5">
            {totalArea.toFixed(1)} {profile?.area_unit || "acres"} total
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-farm-700">Pending Tasks</span>
            <Calendar className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-farm-950 mt-2">{pendingTasks.length}</p>
          <p className="text-[11px] text-farm-600 mt-0.5">
            {pendingTasks.filter((t) => t.priority === "high" || t.priority === "urgent").length} high priority
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-farm-700">Local Weather</span>
            <CloudSun className="h-4 w-4 text-blue-600" />
          </div>
          {weatherLoading ? (
            <p className="text-xs text-farm-500 mt-3">Loading forecast...</p>
          ) : (
            <>
              <p className="text-2xl font-extrabold text-farm-950 mt-2">
                {weather?.current.temp}°C
              </p>
              <p className="text-[11px] text-farm-600 mt-0.5 truncate">
                {weather?.current.condition} | Humidity: {weather?.current.humidity}%
              </p>
            </>
          )}
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-farm-700">Mandi Watch</span>
            <TrendingUp className="h-4 w-4 text-harvest-600" />
          </div>
          <p className="text-2xl font-extrabold text-farm-950 mt-2">
            ₹{watchlistRecords[0]?.modalPrice || "2,200"}
          </p>
          <p className="text-[11px] text-farm-600 mt-0.5 truncate">
            {watchlistRecords[0]?.crop || "Onion"} (APMC Lasalgaon)
          </p>
        </Card>
      </div>

      {/* 4. MAIN DASHBOARD CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column (8 cols): Plots & Tasks */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Plots Summary */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold">My Farm Plots</CardTitle>
                <p className="text-xs text-farm-600 mt-0.5">Active crop parcels and current vegetative stages</p>
              </div>
              <Link href="/farm-management">
                <Button variant="outline" size="sm" className="gap-1 text-xs">
                  <Plus className="h-3.5 w-3.5" />
                  Add Plot
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {plots.length === 0 ? (
                <div className="rounded-lg border border-dashed border-farm-200 p-6 text-center text-xs text-farm-600">
                  <p>{t.dashboard.noPlotsPrompt}</p>
                  <Link href="/farm-management" className="mt-3 inline-block">
                    <Button size="sm">Add First Plot</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {plots.map((plot) => (
                    <div
                      key={plot.id}
                      className="rounded-xl border border-farm-200/90 bg-farm-50/40 p-4 transition-all hover:bg-farm-50 hover:shadow-xs"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-farm-900">{plot.name}</h4>
                          <p className="text-xs font-semibold text-farm-700 mt-0.5">
                            {plot.current_crop}
                          </p>
                        </div>
                        <Badge variant="default" className="text-[10px]">
                          {plot.area} {plot.area_unit}
                        </Badge>
                      </div>

                      <div className="mt-3 space-y-1 text-[11px] text-farm-700/90">
                        <div className="flex justify-between">
                          <span className="text-farm-500">Stage:</span>
                          <span className="font-medium text-farm-800">{plot.growth_stage}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-farm-500">Irrigation:</span>
                          <span className="font-medium text-farm-800">{plot.irrigation_method}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-farm-500">Soil:</span>
                          <span className="font-medium text-farm-800 truncate max-w-[140px]">
                            {plot.soil_type}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-farm-200/60 flex items-center justify-between text-[11px]">
                        <Link
                          href={`/fertilizer-calculator?crop=${encodeURIComponent(plot.current_crop)}&area=${plot.area}`}
                          className="text-farm-700 hover:text-farm-950 font-semibold"
                        >
                          Calc Nutrients
                        </Link>
                        <Link
                          href={`/irrigation?crop=${encodeURIComponent(plot.current_crop)}&area=${plot.area}`}
                          className="text-farm-700 hover:text-farm-950 font-semibold"
                        >
                          Water Plan
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Farming Tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold">Upcoming Farming Operations</CardTitle>
                <p className="text-xs text-farm-600 mt-0.5">Timely fertilizer, spraying, and inspection reminders</p>
              </div>
              <Link href="/tasks">
                <Button variant="ghost" size="sm" className="text-xs text-farm-700">
                  Manage All ({tasks.length})
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <p className="text-xs text-farm-500">No scheduled tasks found.</p>
              ) : (
                <div className="space-y-2">
                  {tasks.slice(0, 4).map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className="flex items-center justify-between p-3 rounded-lg border border-farm-100 hover:bg-farm-50/70 transition-colors cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={task.status === "completed"}
                          onChange={() => {}}
                          className="h-4 w-4 rounded border-farm-300 text-farm-700 focus:ring-farm-600"
                        />
                        <div>
                          <p
                            className={`font-semibold ${
                              task.status === "completed"
                                ? "line-through text-farm-400"
                                : "text-farm-900"
                            }`}
                          >
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-farm-500">
                            {task.plot_name && <span>{task.plot_name}</span>}
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> Due {task.due_date}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Badge
                        variant={
                          task.priority === "urgent"
                            ? "destructive"
                            : task.priority === "high"
                            ? "warning"
                            : "default"
                        }
                        className="text-[10px]"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column (4 cols): Quick Tools & Live Mandi */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Calculators Shortcut */}
          <Card className="bg-gradient-to-br from-farm-50/80 to-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-farm-600" />
                Agronomic Decision Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <Link
                href="/fertilizer-calculator"
                className="flex items-center justify-between p-2.5 rounded-lg border border-farm-200/80 bg-white hover:bg-farm-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center">
                    <FlaskConical className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-farm-900">Fertilizer Calculator</h5>
                    <p className="text-[10px] text-farm-500">RDF to Urea/DAP/MOP bags</p>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-farm-400" />
              </Link>

              <Link
                href="/irrigation"
                className="flex items-center justify-between p-2.5 rounded-lg border border-farm-200/80 bg-white hover:bg-farm-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-md bg-cyan-100 text-cyan-800 flex items-center justify-center">
                    <Droplets className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-farm-900">Irrigation Planner</h5>
                    <p className="text-[10px] text-farm-500">Kc & soil moisture schedules</p>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-farm-400" />
              </Link>

              <Link
                href="/crop-recommendation"
                className="flex items-center justify-between p-2.5 rounded-lg border border-farm-200/80 bg-white hover:bg-farm-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-md bg-farm-100 text-farm-800 flex items-center justify-center">
                    <Sprout className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-farm-900">Crop Suitability</h5>
                    <p className="text-[10px] text-farm-500">Soil & season crop matcher</p>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-farm-400" />
              </Link>
            </CardContent>
          </Card>

          {/* Mandi Prices Watchlist */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm font-bold">Mandi Price Watchlist</CardTitle>
                <p className="text-[10px] text-farm-500 mt-0.5">Verified APMC Maharashtra rates</p>
              </div>
              <Link href="/market-prices">
                <Button variant="ghost" size="sm" className="text-xs">
                  All Mandis
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {watchlistRecords.map((mandi) => (
                <div
                  key={mandi.id}
                  className="rounded-lg border border-farm-100 p-2.5 text-xs hover:bg-farm-50/50"
                >
                  <div className="flex items-center justify-between font-semibold text-farm-900">
                    <span>{mandi.crop}</span>
                    <span className="text-farm-800 font-bold">₹{mandi.modalPrice} / Qtl</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-farm-500 mt-1">
                    <span>{mandi.market} ({mandi.district})</span>
                    <span>Range: ₹{mandi.minPrice} - {mandi.maxPrice}</span>
                  </div>
                </div>
              ))}
              <div className="pt-1 text-center">
                <Link href="/market-prices" className="text-[11px] font-semibold text-farm-700 hover:underline">
                  Configure Mandi Watchlist →
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
