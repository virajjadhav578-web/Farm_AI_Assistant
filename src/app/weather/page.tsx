"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { fetchWeatherData, getDemonstrationWeatherData, MAHARASHTRA_CITIES } from "@/lib/services/weather-service";
import { WeatherData } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AlertBanner } from "@/components/ui/AlertBanner";
import {
  CloudSun,
  Search,
  Droplets,
  Wind,
  CloudRain,
  Thermometer,
  Calendar,
  ShieldCheck,
  RefreshCw,
  Clock,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function WeatherPage() {
  const { t } = useLanguage();
  const [selectedCity, setSelectedCity] = useState("Pune");
  const [searchInput, setSearchInput] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadWeather = (city: string) => {
    setLoading(true);
    fetchWeatherData(city)
      .then((data) => {
        setWeather(data);
        setSelectedCity(city);
      })
      .catch(() => {
        setWeather(getDemonstrationWeatherData(city));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadWeather("Pune");
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    loadWeather(searchInput.trim());
    setSearchInput("");
  };

  const chartData = weather?.daily.map((d) => ({
    name: new Date(d.date).toLocaleDateString("en-IN", { weekday: "short" }),
    MaxTemp: d.tempMax,
    MinTemp: d.tempMin,
    RainfallMm: d.precipitationSum,
  })) || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-farm-200/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-farm-950 flex items-center gap-2">
              <CloudSun className="h-5 w-5 text-blue-600" />
              {t.weather.title}
            </h1>
            <Badge variant="default" className="text-[10px]">
              Open-Meteo High-Resolution WMO
            </Badge>
          </div>
          <p className="text-xs text-farm-600 mt-0.5">{t.weather.subtitle}</p>
        </div>

        {/* Search District / City */}
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-farm-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter district (e.g. Nashik)..."
              className="rounded-lg border border-farm-200 bg-white pl-8 pr-3 py-1.5 text-xs text-farm-900 focus:border-farm-600 focus:outline-none w-48 sm:w-56"
            />
          </div>
          <Button type="submit" size="sm" className="h-8 text-xs">
            Search
          </Button>
        </form>
      </div>

      {/* Quick District Selector Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-bold text-farm-600 shrink-0">Major Agricultural Hubs:</span>
        {Object.keys(MAHARASHTRA_CITIES).slice(0, 8).map((city) => (
          <button
            key={city}
            onClick={() => loadWeather(city)}
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              selectedCity === city
                ? "bg-farm-700 text-white border-farm-700"
                : "border-farm-200 bg-white text-farm-700 hover:bg-farm-50"
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-xl border border-farm-200 bg-white p-12 text-center text-xs text-farm-600">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto text-farm-600 mb-2" />
          <p>Connecting to Open-Meteo meteorological feed for {selectedCity}...</p>
        </div>
      ) : weather ? (
        <div className="space-y-6">
          {/* Current Observation Card */}
          <Card className="border-farm-200/90 shadow-sm bg-gradient-to-r from-white via-farm-50/30 to-blue-50/20">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-extrabold text-farm-950">{weather.city}</h2>
                    <Badge variant="default" className="text-xs">{weather.state}</Badge>
                    {weather.isDemo && (
                      <Badge variant="amber" className="text-[10px]">Regional Baseline</Badge>
                    )}
                  </div>
                  <p className="text-xs text-farm-600 mt-1 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Last Updated: {weather.lastUpdated}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-4xl font-extrabold text-farm-950">
                    {weather.current.temp}°C
                  </div>
                  <p className="text-sm font-semibold text-farm-700 mt-0.5">
                    {weather.current.condition}
                  </p>
                </div>
              </div>

              {/* Weather Metrics Bar */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-farm-100 pt-4 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Droplets className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-farm-500 font-medium">Humidity</span>
                    <p className="font-bold text-farm-900 text-sm">{weather.current.humidity}%</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Wind className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-farm-500 font-medium">Wind Speed</span>
                    <p className="font-bold text-farm-900 text-sm">{weather.current.windSpeed} km/h</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center">
                    <CloudRain className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-farm-500 font-medium">Precipitation</span>
                    <p className="font-bold text-farm-900 text-sm">{weather.current.precipitation} mm</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Thermometer className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-farm-500 font-medium">Spray Window</span>
                    <p className="font-bold text-farm-900 text-sm">
                      {weather.current.windSpeed <= 15 ? "Favorable" : "High Drift"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agricultural Advisories & Field Alerts */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-farm-950 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-farm-700" />
              Agronomic Fieldwork Advisories for {weather.city}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {weather.alerts.map((alert, idx) => (
                <AlertBanner
                  key={idx}
                  type={alert.severity}
                  title={alert.title}
                  description={`${alert.description} Advice: ${alert.action}`}
                />
              ))}
            </div>
          </div>

          {/* 7-Day Temperature & Rain Forecast Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center justify-between">
                <span>7-Day Temperature Trend (°C)</span>
                <span className="text-xs font-normal text-farm-500">Max vs Min Daily</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} domain={["dataMin - 2", "dataMax + 2"]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderColor: "#e5e7eb",
                        borderRadius: "8px",
                        fontSize: "11px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="MaxTemp"
                      stroke="#d97706"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="Max Temp (°C)"
                    />
                    <Line
                      type="monotone"
                      dataKey="MinTemp"
                      stroke="#2d6a4f"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="Min Temp (°C)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 7-Day Day-by-Day Forecast Cards */}
          <div>
            <h3 className="font-bold text-sm text-farm-950 mb-3 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-farm-700" />
              {t.weather.dailyForecast}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {weather.daily.map((day, idx) => {
                const dateObj = new Date(day.date);
                const dayName = dateObj.toLocaleDateString("en-IN", { weekday: "short" });
                const dateNum = dateObj.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-farm-200/80 bg-white p-3 text-center shadow-2xs hover:border-farm-400 transition-all text-xs"
                  >
                    <p className="font-bold text-farm-900">{idx === 0 ? "Today" : dayName}</p>
                    <p className="text-[10px] text-farm-500 mb-2">{dateNum}</p>
                    <p className="text-base font-extrabold text-farm-950">
                      {day.tempMax}°
                    </p>
                    <p className="text-[11px] text-farm-500">{day.tempMin}°</p>
                    <p className="text-[10px] text-farm-700 font-medium mt-1 truncate">
                      {day.condition}
                    </p>
                    {day.precipitationSum > 0 && (
                      <p className="text-[10px] font-bold text-blue-600 mt-1">
                        💧 {day.precipitationSum} mm
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-[11px] text-farm-500 text-center">
            Source: {weather.source} | Coordinates: {weather.latitude.toFixed(2)}°N, {weather.longitude.toFixed(2)}°E
          </div>
        </div>
      ) : null}
    </div>
  );
}
