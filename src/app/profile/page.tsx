"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { DemoStore } from "@/lib/supabase/demo-store";
import { UserProfile, AreaUnit, Language } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  UserCheck,
  Save,
  Download,
  Trash2,
  Globe,
  Bell,
  Scale,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

export default function ProfileSettingsPage() {
  const { language, setLanguage, t } = useLanguage();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Form State
  const [fullName, setFullName] = useState("");
  const [preferredLang, setPreferredLang] = useState<Language>("en");
  const [state, setState] = useState("Maharashtra");
  const [district, setDistrict] = useState("Pune");
  const [village, setVillage] = useState("Baramati");
  const [farmArea, setFarmArea] = useState("5.5");
  const [areaUnit, setAreaUnit] = useState<AreaUnit>("acres");
  const [soilType, setSoilType] = useState("Black Cotton Soil (Regur)");
  const [experienceYears, setExperienceYears] = useState("12");

  // Notifications
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const p = DemoStore.getProfile();
    setProfile(p);
    setFullName(p.full_name);
    setPreferredLang(p.preferred_language || language);
    setState(p.state);
    setDistrict(p.district);
    setVillage(p.village || "");
    setFarmArea(String(p.farm_area || "5.5"));
    setAreaUnit(p.area_unit || "acres");
    setSoilType(p.soil_type || "Black Cotton Soil (Regur)");
    setExperienceYears(String(p.farming_experience_years || "12"));
  }, [language]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = DemoStore.updateProfile({
      full_name: fullName,
      preferred_language: preferredLang,
      state,
      district,
      village,
      farm_area: Number(farmArea),
      area_unit: areaUnit,
      soil_type: soilType as any,
      farming_experience_years: Number(experienceYears),
    });

    setProfile(updated);
    setLanguage(preferredLang);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportData = () => {
    const exportData = {
      profile: DemoStore.getProfile(),
      plots: DemoStore.getPlots(),
      tasks: DemoStore.getTasks(),
      watchlist: DemoStore.getWatchlist(),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Farm_AI_Data_${fullName.replace(/\s+/g, "_")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDeleteAccount = () => {
    localStorage.clear();
    setDeleteModalOpen(false);
    window.location.href = "/";
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-farm-200/80 pb-3">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-extrabold text-farm-950 flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-farm-700" />
            {t.profile.title}
          </h1>
          <Badge variant="default" className="text-[10px]">
            Farmer Preferences
          </Badge>
        </div>
        <p className="text-xs text-farm-600 mt-0.5">{t.profile.subtitle}</p>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Profile preferences and regional units updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Farmer Details */}
        <Card>
          <CardHeader className="pb-3 border-b border-farm-100">
            <CardTitle className="text-sm font-bold">Personal & Land Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-farm-800">{t.profile.fullName}</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-farm-800">{t.profile.languagePref}</label>
                <select
                  value={preferredLang}
                  onChange={(e) => setPreferredLang(e.target.value as Language)}
                  className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="mr">मराठी (Marathi)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-farm-800">{t.profile.state}</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs bg-farm-50/50"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-farm-800">{t.profile.district}</label>
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
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-farm-800">{t.profile.village}</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-farm-800">Total Farm Size</label>
                <input
                  type="number"
                  step="0.1"
                  value={farmArea}
                  onChange={(e) => setFarmArea(e.target.value)}
                  className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-farm-800">{t.profile.preferredUnit}</label>
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

              <div className="space-y-1">
                <label className="font-semibold text-farm-800">{t.profile.experience}</label>
                <input
                  type="number"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications and Alert Settings */}
        <Card>
          <CardHeader className="pb-3 border-b border-farm-100">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Bell className="h-4 w-4 text-farm-600" />
              Notification & Advisory Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4 text-xs">
            <label className="flex items-center justify-between p-3 rounded-lg border border-farm-100 hover:bg-farm-50/50 cursor-pointer">
              <div>
                <p className="font-semibold text-farm-900">Agri-Weather & Spray Window Alerts</p>
                <p className="text-[11px] text-farm-500">
                  Receive proactive alerts when high rainfall or strong winds threaten spray effectiveness.
                </p>
              </div>
              <input
                type="checkbox"
                checked={weatherAlerts}
                onChange={(e) => setWeatherAlerts(e.target.checked)}
                className="h-4 w-4 rounded border-farm-300 text-farm-700"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border border-farm-100 hover:bg-farm-50/50 cursor-pointer">
              <div>
                <p className="font-semibold text-farm-900">Farming Operation & Spray Reminders</p>
                <p className="text-[11px] text-farm-500">
                  In-app notifications when task deadlines approach for specific plots.
                </p>
              </div>
              <input
                type="checkbox"
                checked={taskReminders}
                onChange={(e) => setTaskReminders(e.target.checked)}
                className="h-4 w-4 rounded border-farm-300 text-farm-700"
              />
            </label>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end">
          <Button type="submit" size="md" className="gap-2 shadow-xs">
            <Save className="h-4 w-4" />
            Save Profile & Preferences
          </Button>
        </div>
      </form>

      {/* Data Export & Account Deletion */}
      <Card className="border-rose-200/80">
        <CardHeader className="pb-3 border-b border-rose-100">
          <CardTitle className="text-sm font-bold text-farm-950 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-rose-600" />
            Data Privacy & Account Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4 text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-lg border border-farm-100 bg-farm-50/40">
            <div>
              <h5 className="font-semibold text-farm-900">Download Farm Records</h5>
              <p className="text-[11px] text-farm-600">
                Export all your plots, soil logs, tasks, and mandi watchlists in JSON format.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportData}
              className="gap-1.5 shrink-0"
            >
              <Download className="h-4 w-4" />
              {t.profile.exportData}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-lg border border-rose-100 bg-rose-50/30">
            <div>
              <h5 className="font-semibold text-rose-950">Permanent Account Deletion</h5>
              <p className="text-[11px] text-rose-700">
                Permanently purge all user profiles, plot history, uploaded leaf photos, and chat logs.
              </p>
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setDeleteModalOpen(true)}
              className="gap-1.5 shrink-0"
            >
              <Trash2 className="h-4 w-4" />
              {t.profile.deleteAccount}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-xl bg-white shadow-xl border border-farm-200 p-5 space-y-3">
            <div className="flex items-center gap-2.5 text-rose-600">
              <ShieldAlert className="h-5 w-5" />
              <h4 className="font-bold text-sm text-farm-950">Confirm Account Deletion</h4>
            </div>
            <p className="text-xs text-farm-700 leading-relaxed">
              {t.profile.deleteConfirm} All stored land records and images will be permanently erased.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
                Permanently Erase
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
