import { NextRequest, NextResponse } from "next/server";
import { analyzeCropImage } from "@/lib/services/ai-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cropName, imageBase64, symptoms } = body;

    if (!cropName || typeof cropName !== "string") {
      return NextResponse.json({ error: "Crop name is required." }, { status: 400 });
    }

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return NextResponse.json({ error: "Plant leaf image data is required." }, { status: 400 });
    }

    // Size limit check (approx 5MB in base64 is ~7M characters)
    if (imageBase64.length > 7 * 1024 * 1024) {
      return NextResponse.json({ error: "Image file exceeds the 5MB size limit. Please upload a smaller photo." }, { status: 400 });
    }

    const result = await analyzeCropImage(cropName, imageBase64, symptoms);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Crop disease detection error:", error);
    return NextResponse.json(
      { error: "Image analysis failed. Please verify your photo and try again." },
      { status: 500 }
    );
  }
}
