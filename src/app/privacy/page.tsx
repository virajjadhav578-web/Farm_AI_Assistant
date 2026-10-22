import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, ArrowLeft, Lock, Database, Trash2 } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div>
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1 text-xs text-farm-700">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Button>
        </Link>
      </div>

      <div className="space-y-2 border-b border-farm-200 pb-4">
        <h1 className="text-3xl font-extrabold text-farm-950 flex items-center gap-2">
          <ShieldCheck className="h-7 w-7 text-farm-700" />
          Privacy Policy
        </h1>
        <p className="text-xs text-farm-600">Effective Date: October 2026 | Last Updated: October 2026</p>
      </div>

      <Card className="border-farm-200/90 shadow-xs">
        <CardContent className="p-6 md:p-8 space-y-6 text-xs sm:text-sm text-farm-800 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-farm-950 flex items-center gap-2">
              <Lock className="h-4 w-4 text-farm-600" />
              1. Information We Collect
            </h2>
            <p>
              Farm AI Assistant collects only the data necessary to provide personalized agricultural advisory, weather intelligence, and farm management services:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-farm-700">
              <li><strong>Account Information:</strong> Name, email address, password hash, and preferred language (English, Hindi, Marathi).</li>
              <li><strong>Farm Profile & Plots:</strong> State, district, village, soil type, crop varieties, sowing dates, and irrigation methods.</li>
              <li><strong>Uploaded Plant Leaf Images:</strong> Photos submitted for computational crop disease detection.</li>
              <li><strong>Conversational Logs:</strong> Queries submitted to the AI Farming Assistant to maintain user thread continuity.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-farm-950 flex items-center gap-2">
              <Database className="h-4 w-4 text-farm-600" />
              2. How Your Data is Used & Protected
            </h2>
            <p>
              Your data is stored securely in PostgreSQL with <strong>Row Level Security (RLS)</strong> enabled. This guarantees that only your authenticated account has access to your farm plots, tasks, and image diagnostic histories.
            </p>
            <p>
              We do not sell, rent, or commercialize your private agricultural data or location to third-party advertisers. Plant images are processed on secure servers to generate pathology diagnostics and are never published publicly.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-farm-950 flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-farm-600" />
              3. Data Ownership & User Deletion Rights
            </h2>
            <p>
              You maintain full ownership of all land records and crop photos entered into Farm AI Assistant. You have the right at any time to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-farm-700">
              <li>Export a complete copy of all your plots, tasks, and settings in structured JSON format via the Profile page.</li>
              <li>Delete individual plots, tasks, or uploaded images at any time.</li>
              <li>Permanently delete your account and all associated records using the Account Deletion workflow in Settings.</li>
            </ul>
          </section>

          <section className="space-y-2 border-t border-farm-100 pt-4">
            <h2 className="text-base font-bold text-farm-950">4. Contacting Us Regarding Privacy</h2>
            <p className="text-xs text-farm-600">
              If you have inquiries or wish to request data revocation, contact our support team at <strong>privacy@farm-ai-assistant.in</strong>.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
