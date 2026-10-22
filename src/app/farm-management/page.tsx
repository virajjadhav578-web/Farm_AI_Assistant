"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { DemoStore } from "@/lib/supabase/demo-store";
import { FarmPlot, AreaUnit, SoilType, IrrigationMethod } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  MapPin,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Droplets,
  Sprout,
  AlertTriangle,
  CheckCircle2,
  X,
} from "lucide-react";

export default function FarmManagementPage() {
  const { t } = useLanguage();

  const [plots, setPlots] = useState<FarmPlot[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlot, setEditingPlot] = useState<FarmPlot | null>(null);

  // Form State
  const [plotName, setPlotName] = useState("");
  const [plotArea, setPlotArea] = useState("2.5");
  const [areaUnit, setAreaUnit] = useState<AreaUnit>("acres");
  const [soilType, setSoilType] = useState<SoilType>("Black Cotton Soil (Regur)");
  const [currentCrop, setCurrentCrop] = useState("Cotton (Bt)");
  const [sowingDate, setSowingDate] = useState("2026-06-25");
  const [irrigationMethod, setIrrigationMethod] = useState<IrrigationMethod>("Drip");
  const [growthStage, setGrowthStage] = useState("Vegetative");

  // Deletion Confirmation Modal State
  const [deletingPlotId, setDeletingPlotId] = useState<string | null>(null);

  const reloadPlots = () => {
    setPlots(DemoStore.getPlots());
  };

  useEffect(() => {
    reloadPlots();
  }, []);

  const openAddModal = () => {
    setEditingPlot(null);
    setPlotName("");
    setPlotArea("2.0");
    setAreaUnit("acres");
    setSoilType("Black Cotton Soil (Regur)");
    setCurrentCrop("Soybean");
    setSowingDate("2026-07-01");
    setIrrigationMethod("Drip");
    setGrowthStage("Vegetative");
    setModalOpen(true);
  };

  const openEditModal = (plot: FarmPlot) => {
    setEditingPlot(plot);
    setPlotName(plot.name);
    setPlotArea(String(plot.area));
    setAreaUnit(plot.area_unit);
    setSoilType(plot.soil_type);
    setCurrentCrop(plot.current_crop);
    setSowingDate(plot.sowing_date);
    setIrrigationMethod(plot.irrigation_method);
    setGrowthStage(plot.growth_stage);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plotName.trim() || Number(plotArea) <= 0) return;

    DemoStore.savePlot({
      id: editingPlot ? editingPlot.id : undefined,
      name: plotName.trim(),
      area: Number(plotArea),
      area_unit: areaUnit,
      soil_type: soilType,
      current_crop: currentCrop,
      sowing_date: sowingDate,
      irrigation_method: irrigationMethod,
      growth_stage: growthStage,
    });

    setModalOpen(false);
    reloadPlots();
  };

  const confirmDelete = () => {
    if (deletingPlotId) {
      DemoStore.deletePlot(deletingPlotId);
      setDeletingPlotId(null);
      reloadPlots();
    }
  };

  const totalArea = plots.reduce((acc, p) => acc + (Number(p.area) || 0), 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-farm-200/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-farm-950 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-farm-700" />
              {t.farm.title}
            </h1>
            <Badge variant="default" className="text-[10px]">
              {plots.length} Plots ({totalArea.toFixed(1)} Acres Total)
            </Badge>
          </div>
          <p className="text-xs text-farm-600 mt-0.5">{t.farm.subtitle}</p>
        </div>

        <Button onClick={openAddModal} size="sm" className="gap-1.5 shadow-xs">
          <Plus className="h-4 w-4" />
          {t.farm.addPlotBtn}
        </Button>
      </div>

      {/* Plots Grid */}
      {plots.length === 0 ? (
        <div className="rounded-xl border border-dashed border-farm-200 bg-white p-12 text-center text-xs text-farm-600">
          <MapPin className="h-8 w-8 text-farm-400 mx-auto mb-2" />
          <h3 className="font-bold text-sm text-farm-900">{t.farm.noPlotsYet}</h3>
          <p className="mt-1 max-w-sm mx-auto text-farm-500">
            Click <strong>Add New Plot</strong> above to register your first land parcel with soil and crop data.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plots.map((plot) => (
            <Card
              key={plot.id}
              className="border-farm-200/90 shadow-2xs hover:border-farm-400 transition-all flex flex-col justify-between"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold text-farm-900">{plot.name}</CardTitle>
                    <p className="text-xs font-semibold text-farm-700 mt-0.5">{plot.current_crop}</p>
                  </div>
                  <Badge variant="success" className="text-[10px]">
                    {plot.area} {plot.area_unit}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-1 text-xs">
                <div className="space-y-1.5 bg-farm-50/70 p-3 rounded-lg border border-farm-100 text-[11px] text-farm-800">
                  <div className="flex justify-between">
                    <span className="text-farm-500">Soil:</span>
                    <span className="font-semibold">{plot.soil_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-farm-500">Sowing Date:</span>
                    <span className="font-semibold">{plot.sowing_date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-farm-500">Growth Stage:</span>
                    <span className="font-semibold">{plot.growth_stage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-farm-500">Irrigation:</span>
                    <span className="font-semibold">{plot.irrigation_method}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-farm-100 flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(plot)}
                    className="h-7 px-2 text-xs text-farm-700"
                  >
                    <Edit2 className="h-3 w-3 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingPlotId(plot.id)}
                    className="h-7 px-2 text-xs text-rose-600 hover:text-rose-800"
                  >
                    <Trash2 className="h-3 w-3 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Plot Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-farm-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-farm-100 pb-3">
              <h3 className="font-bold text-base text-farm-950">
                {editingPlot ? "Edit Farm Plot" : "Add New Farm Plot"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded text-farm-400 hover:text-farm-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-farm-800">Plot Name / Identifier</label>
                <input
                  type="text"
                  required
                  value={plotName}
                  onChange={(e) => setPlotName(e.target.value)}
                  placeholder="e.g. North Canal Plot, Wada 1"
                  className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 space-y-1">
                  <label className="font-semibold text-farm-800">Plot Area</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={plotArea}
                    onChange={(e) => setPlotArea(e.target.value)}
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

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-farm-800">Current Standing Crop</label>
                  <input
                    type="text"
                    required
                    value={currentCrop}
                    onChange={(e) => setCurrentCrop(e.target.value)}
                    placeholder="e.g. Cotton (Bt), Sugarcane"
                    className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-farm-800">Sowing Date</label>
                  <input
                    type="date"
                    required
                    value={sowingDate}
                    onChange={(e) => setSowingDate(e.target.value)}
                    className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-farm-800">Soil Type</label>
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

                <div className="space-y-1">
                  <label className="font-semibold text-farm-800">Irrigation Method</label>
                  <select
                    value={irrigationMethod}
                    onChange={(e) => setIrrigationMethod(e.target.value as IrrigationMethod)}
                    className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                  >
                    <option value="Drip">Drip Irrigation</option>
                    <option value="Sprinkler">Sprinkler System</option>
                    <option value="Flood">Flood Furrow</option>
                    <option value="Rainfed">Rainfed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-farm-800">Current Growth Stage</label>
                <select
                  value={growthStage}
                  onChange={(e) => setGrowthStage(e.target.value)}
                  className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                >
                  <option value="Germination">Germination</option>
                  <option value="Vegetative">Vegetative / Tillering</option>
                  <option value="Flowering / Booting">Flowering / Booting</option>
                  <option value="Pod Formation / Boll Development">Pod Formation / Boll Development</option>
                  <option value="Grand Growth">Grand Growth</option>
                  <option value="Maturity">Maturity / Ripening</option>
                </select>
              </div>

              <div className="pt-3 border-t border-farm-100 flex items-center justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  {editingPlot ? "Save Changes" : "Create Plot"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingPlotId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-xl bg-white shadow-xl border border-farm-200 p-5 space-y-3">
            <div className="flex items-center gap-2.5 text-rose-600">
              <AlertTriangle className="h-5 w-5" />
              <h4 className="font-bold text-sm text-farm-950">Confirm Plot Deletion</h4>
            </div>
            <p className="text-xs text-farm-700 leading-relaxed">
              {t.farm.confirmDelete}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setDeletingPlotId(null)}>
                Cancel
              </Button>
              <Button variant="destructive" size="sm" onClick={confirmDelete}>
                Delete Permanently
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
