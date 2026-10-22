"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Bot,
  Bug,
  Sparkles,
  CloudSun,
  FlaskConical,
  Droplets,
  TrendingUp,
  MapPin,
  CheckSquare,
  BookOpen,
  UserCheck,
  ShieldCheck,
  LogOut,
} from "lucide-react";

export function Sidebar({ className, onClose }: { className?: string; onClose?: () => void }) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navigationSections = [
    {
      group: "Core Assistance",
      items: [
        { label: t.nav.dashboard, href: "/dashboard", icon: LayoutDashboard },
        { label: t.nav.assistant, href: "/assistant", icon: Bot },
        { label: t.nav.diseaseDetection, href: "/disease-detection", icon: Bug },
      ],
    },
    {
      group: "Agronomic Planning",
      items: [
        { label: t.nav.cropRecommendation, href: "/crop-recommendation", icon: Sparkles },
        { label: t.nav.weather, href: "/weather", icon: CloudSun },
        { label: t.nav.fertilizerCalculator, href: "/fertilizer-calculator", icon: FlaskConical },
        { label: t.nav.irrigationPlanner, href: "/irrigation", icon: Droplets },
      ],
    },
    {
      group: "Farm Operations",
      items: [
        { label: t.nav.farmManagement, href: "/farm-management", icon: MapPin },
        { label: t.nav.tasks, href: "/tasks", icon: CheckSquare },
        { label: t.nav.marketPrices, href: "/market-prices", icon: TrendingUp },
      ],
    },
    {
      group: "Resources & Account",
      items: [
        { label: t.nav.knowledge, href: "/knowledge", icon: BookOpen },
        { label: t.nav.profile, href: "/profile", icon: UserCheck },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r border-farm-200/90 bg-white/95 px-3 py-4",
        className
      )}
    >
      <div className="flex-1 space-y-6 overflow-y-auto px-1">
        {navigationSections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            <h4 className="px-3 text-[11px] font-bold uppercase tracking-wider text-farm-600/80">
              {sec.group}
            </h4>
            <div className="space-y-0.5 pt-1">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                      isActive
                        ? "bg-farm-700 text-white shadow-xs font-semibold"
                        : "text-farm-800 hover:bg-farm-50 hover:text-farm-950"
                    )}
                  >
                    <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-farm-600")} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto border-t border-farm-200/80 pt-3 px-1 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-farm-700 hover:bg-farm-50 transition-colors"
        >
          <ShieldCheck className="h-4 w-4 text-farm-600" />
          <span>Home / Landing</span>
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>{t.nav.logout}</span>
        </Link>
      </div>
    </aside>
  );
}
