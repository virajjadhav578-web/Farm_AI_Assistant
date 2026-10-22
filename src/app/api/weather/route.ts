import { NextRequest, NextResponse } from "next/server";
import { fetchWeatherData } from "@/lib/services/weather-service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city") || "Pune";

    const data = await fetchWeatherData(city);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Weather route error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve meteorological data for specified location." },
      { status: 500 }
    );
  }
}
