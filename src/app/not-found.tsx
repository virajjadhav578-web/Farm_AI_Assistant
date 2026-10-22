import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Sprout, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="h-16 w-16 rounded-2xl bg-farm-100 text-farm-800 flex items-center justify-center mb-4">
        <Sprout className="h-8 w-8" />
      </div>

      <h1 className="text-3xl font-extrabold text-farm-950 sm:text-4xl">404 - Field Not Found</h1>
      <p className="mt-2 text-xs sm:text-sm text-farm-600 max-w-md leading-relaxed">
        The agricultural page or crop record you are looking for has been moved or does not exist.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link href="/dashboard">
          <Button size="sm" className="gap-2">
            <Home className="h-4 w-4" />
            Go to Farmer Dashboard
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Landing Page
          </Button>
        </Link>
      </div>
    </div>
  );
}
