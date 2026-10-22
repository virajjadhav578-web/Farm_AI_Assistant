"use client";

import React from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { KNOWLEDGE_ARTICLES } from "@/lib/services/knowledge-data";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Building2,
  ShieldCheck,
  Share2,
} from "lucide-react";

export default function KnowledgeArticleDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const article = KNOWLEDGE_ARTICLES.find((a) => a.id === id);

  if (!article) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-farm-900">Article Not Found</h2>
        <p className="text-xs text-farm-600">The requested agricultural publication does not exist.</p>
        <Link href="/knowledge">
          <Button size="sm">Back to Knowledge Center</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Back Button */}
      <div>
        <Link href="/knowledge">
          <Button variant="ghost" size="sm" className="gap-1 text-xs text-farm-700">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Articles
          </Button>
        </Link>
      </div>

      <Card className="border-farm-200/90 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-farm-50 via-white to-farm-50/50 p-6 md:p-8 border-b border-farm-100 space-y-3">
          <Badge variant="success" className="text-xs">
            {article.category}
          </Badge>

          <h1 className="text-xl sm:text-2xl font-extrabold text-farm-950 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-farm-600 pt-1">
            <span className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-farm-500" />
              {article.source}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-farm-500" />
              {article.publishedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-farm-500" />
              {article.readTime}
            </span>
          </div>
        </div>

        <CardContent className="p-6 md:p-8 space-y-6 text-sm text-farm-900 leading-relaxed">
          {/* Summary Callout */}
          <div className="rounded-xl bg-farm-50/80 p-4 border border-farm-200/80 font-medium text-xs text-farm-800">
            {article.summary}
          </div>

          {/* Body Content with formatted paragraphs and lists */}
          <div className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-farm-950 prose-p:text-farm-800 whitespace-pre-line text-xs sm:text-sm leading-relaxed">
            {article.content}
          </div>

          {/* Institutional Citation Footer */}
          <div className="mt-8 pt-4 border-t border-farm-100 flex items-center justify-between text-xs text-farm-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-farm-600" />
              Verified Agricultural Research Publication
            </span>
            <span>Source: {article.source}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
