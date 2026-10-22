import { NextRequest, NextResponse } from "next/server";
import { generateFarmingAssistantResponse } from "@/lib/services/ai-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, history = [], context = {} } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json({ error: "A valid prompt is required." }, { status: 400 });
    }

    if (prompt.length > 2000) {
      return NextResponse.json({ error: "Prompt exceeds maximum allowed length of 2000 characters." }, { status: 400 });
    }

    const response = await generateFarmingAssistantResponse(prompt, history, context);

    return NextResponse.json({
      reply: response.text,
      isDemo: response.isDemo,
      disclaimer: "Agricultural advisory: This guidance is computational decision support based on Indian agronomy. Always verify chemical rates with your local KVK or agricultural extension officer before field application.",
    });
  } catch (error) {
    console.error("AI assistant endpoint error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your farming inquiry. Please try again." },
      { status: 500 }
    );
  }
}
