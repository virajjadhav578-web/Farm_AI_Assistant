"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { Footer } from "./Footer";
import { X } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Pages that use the standalone full-width layout (landing, auth, legal)
  const isStandalonePage =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname === "/privacy" ||
    pathname === "/terms";

  if (isStandalonePage) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f8faf7]">
        <Navbar onMobileMenuToggle={() => setMobileDrawerOpen(!mobileDrawerOpen)} />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f8faf7]">
      <Navbar onMobileMenuToggle={() => setMobileDrawerOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden lg:flex shrink-0" />

        {/* Mobile Slide-over Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileDrawerOpen(false)}
            />
            <div className="relative flex w-72 max-w-[80vw] flex-col bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-farm-200 p-4">
                <span className="font-bold text-farm-900">Farm Menu</span>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="rounded-lg p-1.5 text-farm-600 hover:bg-farm-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <Sidebar onClose={() => setMobileDrawerOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-8 p-4 md:p-6 lg:p-8 max-w-7xl">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav onMenuClick={() => setMobileDrawerOpen(true)} />
    </div>
  );
}
