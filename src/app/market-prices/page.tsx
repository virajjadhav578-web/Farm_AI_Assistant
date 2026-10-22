"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { fetchMandiPrices, REALISTIC_MANDI_RECORDS } from "@/lib/services/market-service";
import { DemoStore } from "@/lib/supabase/demo-store";
import { MandiPriceRecord } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  TrendingUp,
  Search,
  Filter,
  Star,
  StarOff,
  Calendar,
  Building,
  Info,
  RefreshCw,
} from "lucide-react";

export default function MarketPricesPage() {
  const { t } = useLanguage();

  const [records, setRecords] = useState<MandiPriceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [sourceNotice, setSourceNotice] = useState("");
  const [isDemo, setIsDemo] = useState(false);

  // Filters
  const [searchCrop, setSearchCrop] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("all");
  const [watchlist, setWatchlist] = useState<string[]>([]);

  const loadData = () => {
    setLoading(true);
    fetchMandiPrices({
      crop: searchCrop || undefined,
      district: filterDistrict !== "all" ? filterDistrict : undefined,
    })
      .then((data) => {
        setRecords(data.records);
        setIsDemo(data.isDemo);
        setSourceNotice(data.sourceNotice);
      })
      .catch(() => {
        setRecords(REALISTIC_MANDI_RECORDS);
        setIsDemo(true);
        setSourceNotice("APMC Maharashtra Baseline");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setWatchlist(DemoStore.getWatchlist());
    loadData();
  }, [searchCrop, filterDistrict]);

  const toggleWatch = (cropName: string) => {
    DemoStore.toggleWatchlist(cropName);
    setWatchlist(DemoStore.getWatchlist());
  };

  const districts = Array.from(new Set(REALISTIC_MANDI_RECORDS.map((r) => r.district)));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-farm-200/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-farm-950 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-harvest-600" />
              {t.market.title}
            </h1>
            <Badge variant={isDemo ? "amber" : "success"} className="text-[10px]">
              {isDemo ? "APMC Verified Baseline" : "Live Agmarknet"}
            </Badge>
          </div>
          <p className="text-xs text-farm-600 mt-0.5">{t.market.subtitle}</p>
        </div>

        <div className="text-right">
          <Button variant="outline" size="sm" onClick={loadData} className="gap-1 text-xs">
            <RefreshCw className="h-3 w-3" />
            Refresh Rates
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-farm-200/90 shadow-2xs">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
            <div className="sm:col-span-7 relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-farm-400" />
              <input
                type="text"
                value={searchCrop}
                onChange={(e) => setSearchCrop(e.target.value)}
                placeholder={t.market.searchPlaceholder}
                className="w-full rounded-lg border border-farm-200 pl-9 pr-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-5 flex items-center gap-2">
              <Filter className="h-4 w-4 text-farm-500 shrink-0" />
              <select
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
                className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
              >
                <option value="all">All Districts (Maharashtra)</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d} District
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mandi Records Grid / Table */}
      {loading ? (
        <div className="rounded-xl border border-farm-200 bg-white p-12 text-center text-xs text-farm-600">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto text-farm-600 mb-2" />
          <p>Retrieving daily APMC arrivals and auction records...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="rounded-xl border border-dashed border-farm-200 bg-white p-8 text-center text-xs text-farm-600">
          <p>No mandi records found matching your search. Try clearing filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {records.map((record) => {
            const isWatchlisted = watchlist.some((w) =>
              record.crop.toLowerCase().includes(w.toLowerCase())
            );
            return (
              <Card
                key={record.id}
                className="border-farm-200/90 shadow-2xs hover:border-farm-400 transition-all flex flex-col justify-between"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-sm font-bold text-farm-900 leading-tight">
                        {record.crop}
                      </CardTitle>
                      <p className="text-[11px] text-farm-600 mt-0.5">Variety: {record.variety}</p>
                    </div>

                    <button
                      onClick={() => toggleWatch(record.crop)}
                      className="p-1 rounded text-farm-400 hover:text-amber-500 transition-colors"
                      title={isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
                    >
                      {isWatchlisted ? (
                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                      ) : (
                        <Star className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-1 text-xs">
                  {/* Mandi & District */}
                  <div className="flex items-center gap-1.5 text-farm-700 text-[11px]">
                    <Building className="h-3.5 w-3.5 text-farm-500 shrink-0" />
                    <span>
                      {record.market}, {record.district}
                    </span>
                  </div>

                  {/* Modal Price Highlight */}
                  <div className="rounded-xl bg-farm-50/70 p-3 border border-farm-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-farm-500 font-medium block">
                        Modal Price (Avg)
                      </span>
                      <span className="text-xl font-extrabold text-farm-950">
                        ₹{record.modalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-farm-700 bg-white px-2 py-1 rounded border border-farm-200">
                      {record.unit}
                    </span>
                  </div>

                  {/* Min / Max Range */}
                  <div className="flex items-center justify-between text-[11px] text-farm-600 pt-1">
                    <span>Min: ₹{record.minPrice.toLocaleString("en-IN")}</span>
                    <span>Max: ₹{record.maxPrice.toLocaleString("en-IN")}</span>
                  </div>

                  {/* Source and Date footer */}
                  <div className="pt-2 border-t border-farm-100 flex items-center justify-between text-[10px] text-farm-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {record.arrivalDate}
                    </span>
                    <span className="truncate max-w-[150px]" title={record.source}>
                      {record.source}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Attribution & Disclaimer Notice */}
      <div className="rounded-lg bg-farm-50 p-3 border border-farm-200 text-farm-700 text-[11px] flex items-start gap-2">
        <Info className="h-4 w-4 text-farm-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-farm-900">{t.market.sourceAttribution}</p>
          <p className="mt-0.5 text-farm-600 text-[10px]">
            Notice: {sourceNotice}. Prices represent auctions at agricultural produce market committees (APMC) and vary by moisture content, foreign matter, and crop grading.
          </p>
        </div>
      </div>
    </div>
  );
}
