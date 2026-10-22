"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Sprout, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-farm-700 text-white shadow-md">
            <Sprout className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-farm-950">Reset Password</h1>
          <p className="text-xs text-farm-700">Receive a secure link to reset your account password</p>
        </div>

        <Card className="border-farm-200/90 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Account Recovery</CardTitle>
            <CardDescription className="text-xs">
              Enter your registered farmer email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="space-y-4 text-center py-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-farm-900">Recovery Instructions Sent</h4>
                  <p className="text-xs text-farm-700 leading-relaxed">
                    If an account is associated with <strong>{email}</strong>, you will receive a secure password reset link shortly.
                  </p>
                </div>
                <div className="pt-2">
                  <Link href="/login">
                    <Button variant="outline" size="sm" className="w-full">
                      Return to Login
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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

                <Button type="submit" size="md" isLoading={loading} className="w-full text-xs">
                  Send Recovery Link
                </Button>

                <div className="text-center pt-2">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-farm-700 hover:text-farm-900"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
