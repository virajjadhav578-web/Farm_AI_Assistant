import React from "react";
import Link from "next/link";
import { Sprout, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-farm-200 bg-white text-xs text-farm-700/80">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-farm-700 text-white">
              <Sprout className="h-4 w-4" />
            </div>
            <span className="font-bold text-farm-900 text-sm">Farm AI Assistant</span>
            <span className="text-farm-400">|</span>
            <span>Agricultural Intelligence Platform</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <Link href="/privacy" className="hover:text-farm-900 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-farm-900 transition-colors">
              Terms of Service
            </Link>
            <Link href="/knowledge" className="hover:text-farm-900 transition-colors">
              Knowledge Center
            </Link>
            <Link href="/weather" className="hover:text-farm-900 transition-colors">
              Weather Advisories
            </Link>
          </div>
        </div>

        <div className="mt-6 border-t border-farm-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-farm-500">
          <p className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-farm-600" />
            Advisory Notice: Information provided is for decision support based on Indian agronomic standards. Consult registered local agricultural officers and KVKs for severe pest outbreaks.
          </p>
          <p>© {new Date().getFullYear()} Farm AI Assistant. Developed for Indian agriculture.</p>
        </div>
      </div>
    </footer>
  );
}
