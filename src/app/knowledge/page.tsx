"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { KNOWLEDGE_ARTICLES } from "@/lib/services/knowledge-data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  BookOpen,
  Search,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Tag,
} from "lucide-react";

export default function KnowledgeCenterPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Crop Cultivation",
    "Soil Health",
    "Irrigation",
    "Plant Diseases and Pests",
    "Fertilizer Management",
    "Organic and Sustainable Farming",
    "Harvesting and Storage",
    "Government Agricultural Resources",
  ];

  let filtered = KNOWLEDGE_ARTICLES;

  if (selectedCategory !== "All") {
    filtered = filtered.filter((a) => a.category.toLowerCase() === selectedCategory.toLowerCase());
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-farm-200/80 pb-3">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-extrabold text-farm-950 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-farm-700" />
            {t.nav.knowledge}
          </h1>
          <Badge variant="default" className="text-[10px]">
            ICAR & Agricultural University Library
          </Badge>
        </div>
        <p className="text-xs text-farm-600 mt-0.5">
          Verified research-backed package of practices, disease management, and government scheme guides.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-farm-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search articles by crop, pest, fertilizer, or government subsidy..."
          className="w-full rounded-xl border border-farm-200 bg-white pl-10 pr-4 py-2.5 text-xs text-farm-900 placeholder:text-farm-400 focus:border-farm-600 focus:outline-none focus:ring-1 focus:ring-farm-600 shadow-2xs"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`shrink-0 rounded-full border px-3 py-1 font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-farm-700 text-white border-farm-700"
                : "border-farm-200 bg-white text-farm-700 hover:bg-farm-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Article Cards Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-farm-200 bg-white p-12 text-center text-xs text-farm-600">
          <p>No agricultural publications found matching your query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((art) => (
            <Card
              key={art.id}
              className="border-farm-200/90 shadow-2xs hover:border-farm-400 transition-all flex flex-col justify-between"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <Badge variant="default" className="text-[10px]">
                    {art.category}
                  </Badge>
                  <span className="text-farm-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {art.readTime}
                  </span>
                </div>
                <CardTitle className="text-sm font-bold text-farm-900 leading-snug">
                  <Link href={`/knowledge/${art.id}`} className="hover:text-farm-700">
                    {art.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0 text-xs">
                <p className="text-farm-600 leading-relaxed line-clamp-2">
                  {art.summary}
                </p>

                <div className="pt-2 border-t border-farm-100 flex items-center justify-between text-[11px]">
                  <span className="text-farm-400 truncate max-w-[200px]" title={art.source}>
                    {art.source}
                  </span>
                  <Link
                    href={`/knowledge/${art.id}`}
                    className="font-bold text-farm-700 hover:text-farm-950 flex items-center gap-1"
                  >
                    Read Guide <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
