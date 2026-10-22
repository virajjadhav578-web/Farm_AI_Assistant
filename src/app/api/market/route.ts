import { NextRequest, NextResponse } from "next/server";
import { fetchMandiPrices } from "@/lib/services/market-service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const crop = searchParams.get("crop") || undefined;
    const district = searchParams.get("district") || undefined;
    const mandi = searchParams.get("mandi") || undefined;

    const result = await fetchMandiPrices({ crop, district, mandi });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Market API error:", error);
    return NextResponse.json(
      { error: "Unable to retrieve mandi price records at this time." },
      { status: 500 }
    );
  }
}
