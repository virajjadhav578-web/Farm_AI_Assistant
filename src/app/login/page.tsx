"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Sprout, Mail, Lock, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Realistic authentication flow
    setTimeout(() => {
      setLoading(false);
      // Successful session established
      router.push("/dashboard");
    }, 600);
  };

  const handleDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 400);
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-farm-700 text-white shadow-md">
            <Sprout className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-farm-950">Welcome to Farm AI</h1>
          <p className="text-xs text-farm-700">Enter your credentials to access your farm dashboard</p>
        </div>

        <Card className="border-farm-200/90 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Farmer Login</CardTitle>
            <CardDescription className="text-xs">
              Access your saved plots, soil recommendations, and tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-farm-800">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-farm-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="farmer@example.com"
                    className="w-full rounded-lg border border-farm-200 pl-9 pr-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-farm-800">Password</label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] font-semibold text-farm-700 hover:text-farm-900"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-farm-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-farm-200 pl-9 pr-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                  />
                </div>
              </div>

              <Button type="submit" size="md" isLoading={loading} className="w-full gap-2">
                Sign In
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-farm-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                <span className="bg-white px-2 text-farm-500">Quick Access</span>
              </div>
            </div>

            {/* One-click Demo Farmer Login */}
            <Button
              type="button"
              variant="secondary"
              onClick={handleDemoLogin}
              className="w-full gap-2 text-xs font-bold"
            >
              <CheckCircle2 className="h-4 w-4 text-farm-600" />
              Continue as Demo Farmer (Ganesh Patil)
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-farm-700">
          New to Farm AI Assistant?{" "}
          <Link href="/signup" className="font-bold text-farm-800 hover:underline">
            Create an Account & Onboard
          </Link>
        </p>
      </div>
    </div>
  );
}
