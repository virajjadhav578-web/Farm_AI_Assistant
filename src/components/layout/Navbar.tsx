"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { Language } from "@/types";
import { Sprout, Globe, Bell, User, Menu, X, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function Navbar({ onMobileMenuToggle }: { onMobileMenuToggle?: () => void }) {
  const { language, setLanguage, t } = useLanguage();
  const [langDropdown, setLangDropdown] = useState(false);
  const [hasUnreadAlerts, setHasUnreadAlerts] = useState(true);

  const languages: { code: Language; label: string; sub: string }[] = [
    { code: "en", label: "English", sub: "English" },
    { code: "hi", label: "हिन्दी", sub: "Hindi" },
    { code: "mr", label: "मराठी", sub: "Marathi" },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-farm-200/80 bg-white/95 px-4 md:px-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="p-1.5 text-farm-800 rounded-lg hover:bg-farm-100 lg:hidden focus:outline-none"
          aria-label="Toggle navigation"
        >
          <Menu className="h-6 w-6" />
        </button>

        <Link href="/dashboard" className="flex items-center gap-2.5 font-bold text-farm-900">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-farm-700 text-white shadow-xs">
            <Sprout className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-farm-900 leading-tight">
              Farm AI
            </span>
            <span className="text-[10px] font-semibold text-farm-600 tracking-wider uppercase">
              Assistant
            </span>
          </div>
        </Link>

        {/* Demo Mode indicator */}
        <Badge variant="amber" className="hidden sm:inline-flex ml-2 text-[11px] gap-1 py-0.5">
          <ShieldAlert className="h-3 w-3 text-harvest-700" />
          {t.demoBadge}
        </Badge>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setLangDropdown(!langDropdown)}
            className="flex items-center gap-1.5 rounded-lg border border-farm-200 bg-farm-50/50 px-2.5 py-1.5 text-xs font-semibold text-farm-800 hover:bg-farm-100 transition-colors"
            aria-expanded={langDropdown}
          >
            <Globe className="h-3.5 w-3.5 text-farm-600" />
            <span>
              {language === "en" ? "EN" : language === "hi" ? "हिन्दी" : "मराठी"}
            </span>
          </button>

          {langDropdown && (
            <div className="absolute right-0 mt-2 w-44 rounded-xl border border-farm-200 bg-white p-1.5 shadow-lg ring-1 ring-black/5 z-50">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    setLangDropdown(false);
                  }}
                  className={`w-full text-left flex items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors ${
                    language === l.code
                      ? "bg-farm-100 font-bold text-farm-900"
                      : "text-farm-700 hover:bg-farm-50"
                  }`}
                >
                  <span className="font-medium">{l.label}</span>
                  <span className="text-[10px] text-farm-500">{l.sub}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Weather Alerts Notification */}
        <Link
          href="/weather"
          className="relative p-2 text-farm-700 hover:text-farm-900 rounded-lg hover:bg-farm-100 transition-colors"
          title="Agricultural Advisories & Alerts"
        >
          <Bell className="h-4 w-4" />
          {hasUnreadAlerts && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-harvest-500 animate-pulse" />
          )}
        </Link>

        {/* Farmer Profile / Settings Shortcut */}
        <Link
          href="/profile"
          className="flex items-center gap-2 rounded-full border border-farm-300/80 bg-farm-50 p-1 pl-2 text-xs font-medium text-farm-900 hover:bg-farm-100 transition-colors"
        >
          <span className="hidden md:inline font-semibold">Ganesh Patil</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-farm-700 text-white font-bold text-xs">
            GP
          </div>
        </Link>
      </div>
    </header>
  );
}
