"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Bot, Bug, CloudSun, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";

export function MobileNav({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const items = [
    { label: t.nav.dashboard, href: "/dashboard", icon: LayoutDashboard },
    { label: t.nav.assistant, href: "/assistant", icon: Bot },
    { label: "Disease", href: "/disease-detection", icon: Bug },
    { label: "Weather", href: "/weather", icon: CloudSun },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-14 items-center justify-around border-t border-farm-200 bg-white/95 backdrop-blur px-2 lg:hidden shadow-lg">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 px-3 py-1 text-[10px] font-medium transition-colors",
              isActive ? "text-farm-800 font-bold" : "text-farm-600 hover:text-farm-900"
            )}
          >
            <Icon className={cn("h-5 w-5", isActive ? "text-farm-700" : "text-farm-500")} />
            <span>{item.label}</span>
          </Link>
        );
      })}
      <button
        onClick={onMenuClick}
        className="flex flex-col items-center justify-center gap-0.5 px-3 py-1 text-[10px] font-medium text-farm-600 hover:text-farm-900"
      >
        <Menu className="h-5 w-5 text-farm-500" />
        <span>Menu</span>
      </button>
    </nav>
  );
}
