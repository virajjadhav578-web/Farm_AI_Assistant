"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { DemoStore } from "@/lib/supabase/demo-store";
import { ChatMessage, UserProfile, FarmPlot } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Bot, Send, User, Sparkles, AlertCircle, RefreshCw, Info } from "lucide-react";

export default function AssistantPage() {
  const { language, t } = useLanguage();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plots, setPlots] = useState<FarmPlot[]>([]);
  const [selectedPlotId, setSelectedPlotId] = useState<string>("all");

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const p = DemoStore.getProfile();
    const pl = DemoStore.getPlots();
    setProfile(p);
    setPlots(pl);

    // Initial greeting in appropriate language
    const initialGreeting: ChatMessage = {
      id: "greet-1",
      role: "assistant",
      content:
        language === "mr"
          ? "नमस्कार शेतकरी मित्रा! मी तुमचा फार्म एआय सल्लागार आहे. कापूस, सोयाबीन, ऊस, कांदा किंवा कोणत्याही पिकाच्या रोगांबद्दल, खतांबद्दल किंवा सिंचनाबद्दल मराठीत काहीही विचारा."
          : language === "hi"
          ? "नमस्ते किसान भाई! मैं आपका फार्म एआई कृषि मित्र हूँ। कपास, सोयाबीन, गन्ना, गेहूं या प्याज की फसल में कीट, खाद या सिंचाई से संबंधित कोई भी सवाल पूछें।"
          : "Hello! I am your Farm AI Agricultural Assistant. Ask me any question regarding crop pests, fertilizer scheduling, irrigation planning, or organic preparations suited to Maharashtra and Indian farming conditions.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([initialGreeting]);
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (questionText?: string) => {
    const query = questionText || input;
    if (!query.trim() || loading) return;

    setError(null);
    setInput("");

    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setLoading(true);

    try {
      // Build context from farmer's active plots
      const activePlot = plots.find((p) => p.id === selectedPlotId);
      const context = {
        crop: activePlot ? activePlot.current_crop : plots[0]?.current_crop || "Sugarcane / Cotton",
        soilType: activePlot ? activePlot.soil_type : profile?.soil_type || "Black Cotton Soil",
        location: profile ? `${profile.district}, ${profile.state}` : "Pune, Maharashtra",
        growthStage: activePlot ? activePlot.growth_stage : "Flowering",
        language,
      };

      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query,
          history: newHistory.map((m) => ({ role: m.role, content: m.content })),
          context,
        }),
      });

      if (!res.ok) {
        throw new Error("Unable to reach AI agronomy service");
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: "ai-" + Date.now(),
        role: "assistant",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      setError("Service is temporarily unreachable. Please check your network or try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "greet-new",
        role: "assistant",
        content:
          language === "mr"
            ? "नवीन संवाद सुरू झाला आहे. तुम्ही कोणता शेतीविषयक प्रश्न विचारू इच्छिता?"
            : "New consultation started. How can I assist with your crops today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const starterQuestions = [
    t.assistant.q1,
    t.assistant.q2,
    t.assistant.q3,
    t.assistant.q4,
  ];

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Top Title & Context Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-farm-200/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-farm-950 flex items-center gap-2">
              <Bot className="h-5 w-5 text-farm-700" />
              {t.assistant.title}
            </h1>
            <Badge variant="amber" className="text-[10px]">
              Grounded in Indian Agronomy
            </Badge>
          </div>
          <p className="text-xs text-farm-600 mt-0.5">{t.assistant.subtitle}</p>
        </div>

        {/* Plot Context Selector */}
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-semibold text-farm-700">Context:</label>
          <select
            value={selectedPlotId}
            onChange={(e) => setSelectedPlotId(e.target.value)}
            className="rounded-lg border border-farm-200 bg-white px-2.5 py-1 text-xs text-farm-900 focus:outline-none"
          >
            <option value="all">Entire Farm (All Plots)</option>
            {plots.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.current_crop})
              </option>
            ))}
          </select>
          <Button variant="ghost" size="sm" onClick={clearChat} title="Clear conversation" className="h-7 px-2">
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Chat Container Card */}
      <Card className="flex flex-col h-[650px] shadow-sm border-farm-200/90 overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-farm-50/20">
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-farm-700 text-white shadow-xs">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs ${
                    isUser
                      ? "bg-farm-700 text-white rounded-tr-none font-medium"
                      : "bg-white text-farm-900 border border-farm-200/80 rounded-tl-none prose-neutral"
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.content}</div>
                  <span
                    className={`block mt-1 text-[10px] text-right ${
                      isUser ? "text-farm-200" : "text-farm-400"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-farm-900 text-white shadow-xs">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-farm-700 text-white animate-pulse">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl rounded-tl-none bg-white border border-farm-200 px-4 py-2.5 text-xs text-farm-600 shadow-xs flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-farm-600 animate-bounce" />
                <div className="h-2 w-2 rounded-full bg-farm-600 animate-bounce [animation-delay:0.2s]" />
                <div className="h-2 w-2 rounded-full bg-farm-600 animate-bounce [animation-delay:0.4s]" />
                <span>Consulting agricultural guidelines...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Starter Chips */}
        {messages.length <= 2 && (
          <div className="border-t border-farm-100 bg-white px-4 py-2.5 flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-bold text-farm-700 shrink-0 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-farm-600" />
              Quick:
            </span>
            {starterQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="shrink-0 rounded-full border border-farm-200 bg-farm-50/60 px-3 py-1 text-[11px] font-medium text-farm-800 hover:bg-farm-100 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Bottom Input Field */}
        <div className="border-t border-farm-200 bg-white p-3 sm:p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.assistant.placeholder}
              disabled={loading}
              className="flex-1 rounded-xl border border-farm-300 bg-white px-4 py-2.5 text-xs text-farm-900 placeholder:text-farm-400 focus:border-farm-600 focus:outline-none focus:ring-1 focus:ring-farm-600"
            />
            <Button
              type="submit"
              size="md"
              disabled={!input.trim() || loading}
              className="gap-1.5 shrink-0 px-4"
            >
              <span>{t.assistant.send}</span>
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>

          <p className="mt-2 text-[10px] text-center text-farm-500 flex items-center justify-center gap-1">
            <Info className="h-3 w-3" />
            {t.assistant.disclaimer}
          </p>
        </div>
      </Card>
    </div>
  );
}
