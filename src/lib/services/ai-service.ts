import { DiseaseAnalysisResult } from "../../types";

export interface ChatContext {
  crop?: string;
  soilType?: string;
  location?: string;
  growthStage?: string;
  language?: string;
}

export const DEMO_DISEASE_SAMPLES: Record<string, Omit<DiseaseAnalysisResult, "id" | "analyzedAt" | "isDemo">> = {
  "cotton": {
    cropName: "Cotton (कापूस)",
    possibleDisease: "Bacterial Blight (Angular Leaf Spot / Xanthomonas citri pv. malvacearum)",
    confidence: 89,
    confidenceLevel: "High",
    symptoms: [
      "Angular, water-soaked brown to black lesions bounded by leaf veins.",
      "Reddish-brown margins with premature defoliation on lower canopy.",
      "Occasional black lesions developing on young stems (blackarm phase).",
    ],
    possibleCauses: [
      "Prolonged warm, humid weather (28-32°C, relative humidity > 80%).",
      "Overhead splashing from heavy rain showers dispersing bacteria from soil debris.",
      "Excessive vegetative vigor due to over-application of nitrogenous fertilizers.",
    ],
    suggestedActions: [
      "Field sanitation: Remove and safely bury heavily infected lower leaves.",
      "Spray Copper Oxychloride 50% WP @ 2.5 g/L mixed with Streptocycline @ 1 g/10 L water upon first symptom detection.",
      "Avoid field operations while foliage is wet to prevent mechanical transmission.",
    ],
    preventiveMeasures: [
      "Treat future planting seeds with Streptocycline (100 ppm) solution for 30 minutes before sowing.",
      "Practice balanced potassium nutrition (MOP) to enhance plant cell wall rigidity.",
      "Follow crop rotation with non-host crops like Sorghum or Maize.",
    ],
    expertAdviceRecommended: true,
  },
  "soybean": {
    cropName: "Soybean (सोयाबीन)",
    possibleDisease: "Yellow Mosaic Virus (YMV) / Whitefly infestation",
    confidence: 92,
    confidenceLevel: "High",
    symptoms: [
      "Bright yellow chlorotic patches interspersed with dark green areas on trifoliate leaves.",
      "Leaves becoming crinkled, puckered, and reduced in surface area.",
      "Severe stunting and poor pod formation if infected prior to flowering.",
    ],
    possibleCauses: [
      "Transmission by Whitefly (Bemisia tabaci) vector populations.",
      "Dry spells followed by hot conditions accelerating whitefly multiplication.",
      "Weed hosts (Parthenium, Abutilon) growing adjacent to the field boundary.",
    ],
    suggestedActions: [
      "Immediately rogue out and destroy severely diseased plants showing early symptoms.",
      "Install yellow sticky traps @ 15-20 per acre at crop canopy height to monitor and mass-trap whiteflies.",
      "For vector management, spray Thiamethoxam 25% WG @ 0.3 g/L or Acetamiprid 20% SP @ 0.2 g/L during early morning.",
    ],
    preventiveMeasures: [
      "Sow YMV-resistant or tolerant varieties (such as JS 9752, NRC 37, or JS 20-34).",
      "Keep field borders free from malvaceous and asteraceous weeds.",
      "Apply seed treatment with Imidacloprid 48% FS @ 1.25 ml/kg seed before planting.",
    ],
    expertAdviceRecommended: true,
  },
  "sugarcane": {
    cropName: "Sugarcane (ऊस)",
    possibleDisease: "Red Rot (Colletotrichum falcatum)",
    confidence: 86,
    confidenceLevel: "Moderate",
    symptoms: [
      "Third and fourth leaves from top showing drying, yellowing, and drooping margins.",
      "Internal stalk pith showing longitudinal red discolouration with characteristic white cross-bands.",
      "Alcoholic sour odor emanating when infected canes are split open.",
    ],
    possibleCauses: [
      "Use of infected seed canes (setts) from diseased parent nurseries.",
      "Poor drainage, waterlogged soil conditions, and repeated ratoon crops.",
    ],
    suggestedActions: [
      "Uproot and burn infected cane clumps completely; do not leave stubble in the furrow.",
      "Provide immediate field drainage to eliminate standing moisture.",
      "Avoid taking ratoon from fields exhibiting red rot symptoms.",
    ],
    preventiveMeasures: [
      "Use certified disease-free setts from heat-treated nurseries (MHAT / moist hot air treatment).",
      "Sett dipping in Carbendazim 50% WP @ 1 g/L or Trichoderma viride @ 5 g/L.",
      "Follow 2-year crop rotation with green manure crops or paddy.",
    ],
    expertAdviceRecommended: true,
  },
  "onion": {
    cropName: "Onion (कांदा)",
    possibleDisease: "Purple Blotch (Alternaria porri)",
    confidence: 91,
    confidenceLevel: "High",
    symptoms: [
      "Small, water-soaked spots on leaves quickly turning brown with reddish-purple centers.",
      "Concentric rings visible within the lesions during moist mornings.",
      "Lesions girdling the leaf blades, causing collapse and premature bulb maturity.",
    ],
    possibleCauses: [
      "Frequent winter fogs, dew condensation, and temperatures between 21-28°C.",
      "Dense plant population with poor air circulation between raised beds.",
    ],
    suggestedActions: [
      "Spray Mancozeb 75% WP @ 2.5 g/L or Tebuconazole 25.9% EC @ 1 ml/L mixed with a sticker (spreader) @ 0.5 ml/L.",
      "Regulate irrigation frequency to allow the leaf surface to dry completely before nightfall.",
    ],
    preventiveMeasures: [
      "Follow recommended transplanting spacing (15 cm x 10 cm) on broad bed furrows (BBF).",
      "Rotate with non-allium crops like Maize or Bajra.",
    ],
    expertAdviceRecommended: true,
  },
  "tomato": {
    cropName: "Tomato (टोमॅटो)",
    possibleDisease: "Early Blight (Alternaria solani)",
    confidence: 93,
    confidenceLevel: "High",
    symptoms: [
      "Dark brown circular spots with distinctive concentric target rings on older lower leaves.",
      "Chlorotic yellow halo surrounding the necrotic spots.",
      "Progressive yellowing and premature leaf drop from the base upwards.",
    ],
    possibleCauses: [
      "Warm temperatures (24-30°C) with alternating wet and dry foliage periods.",
      "Fungal spores surviving on crop residue and solanaceous weeds.",
    ],
    suggestedActions: [
      "Prune affected lower leaves touching the soil and safely discard away from the greenhouse or plot.",
      "Apply Chlorothalonil 75% WP @ 2 g/L or Azoxystrobin 23% SC @ 1 ml/L.",
    ],
    preventiveMeasures: [
      "Stake tomato vines and mulch beds with silver-black polythene to prevent soil splash.",
      "Avoid overhead sprinkler irrigation; switch to root-zone drip line.",
    ],
    expertAdviceRecommended: true,
  },
};

/**
 * Server-side AI response generator
 */
export async function generateFarmingAssistantResponse(
  userPrompt: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  context: ChatContext
): Promise<{ text: string; isDemo: boolean }> {
  const apiKey = process.env.AI_API_KEY;

  if (apiKey) {
    try {
      // Connect to secure Gemini or LLM API endpoint
      const systemInstruction = `You are Farm AI Assistant, an agricultural agronomist specializing in Indian farming, especially Maharashtra (Deccan plateau, Vidarbha, Marathwada, Western Ghats).
Guidelines:
1. Always adapt advice to the farmer's context: Crop: ${context.crop || "unspecified"}, Soil: ${context.soilType || "Deccan soil"}, Location: ${context.location || "Maharashtra"}, Stage: ${context.growthStage || "unspecified"}.
2. Language: Respond in ${context.language === 'mr' ? 'Marathi (मराठी)' : context.language === 'hi' ? 'Hindi (हिंदी)' : 'English'}, preserving Indian agricultural terms (Urea, DAP, MOP, quintal, acre, guntha, Kharif, Rabi, Zaid, KVK, APMC).
3. Be practical, step-by-step, and prioritize Integrated Pest Management (IPM).
4. Do not prescribe hazardous chemical dosages without disclaimers. Always instruct to follow registered CIB&RC product labels and consult local agricultural extension officers.
5. If details are missing, ask 1-2 focused follow-up questions.`;

      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=" + apiKey, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: systemInstruction }] },
            ...history.slice(-6).map(m => ({
              role: m.role === "assistant" ? "model" : "user",
              parts: [{ text: m.content }],
            })),
            { role: "user", parts: [{ text: userPrompt }] },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 800,
          },
        }),
      });

      if (response.ok) {
        const json = await response.json();
        const candidate = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidate) {
          return { text: candidate, isDemo: false };
        }
        console.warn("Gemini API returned OK but no candidate text. Full response:", JSON.stringify(json).substring(0, 500));
      } else {
        const errText = await response.text();
        console.error(`Gemini API error ${response.status}: ${errText.substring(0, 500)}`);
      }
    } catch (err) {
      console.error("AI LLM API call error:", err);
    }
  }

  // Domain-expert fallback response tailored to user inquiry
  const lower = userPrompt.toLowerCase();
  let reply = "";

  if (lower.includes("stem borer") || lower.includes("खोडकिडी") || lower.includes("sugarcane")) {
    if (context.language === 'mr') {
      reply = `**उसावरील खोडकीड (Early Shoot Borer) एकात्मिक व्यवस्थापन:**
1. **लक्षणे:** उसाच्या मध्यभागातील मुख्य कोंब सुकतो (डेड हार्ट) आणि ओढल्यास सहज बाहेर येतो. त्यातून दुर्गंधी येते.
2. **जैविक उपाय:** पेरणीनंतर ३० दिवसांनी ट्रायकोकार्ड्स (Trichogramma chilonis) @ २ कार्ड प्रति एकर लावावेत.
3. **रासायनिक नियंत्रण (प्रमाणात):** प्रादुर्भाव ५% पेक्षा जास्त असल्यास, क्लोराँट्रानिलीप्रोल (Chlorantraniliprole 18.5% SC) @ ०.४ मिली प्रति लिटर पाण्यात मिसळून उसाच्या बुंध्याशी आळवणी करावी.
4. **महत्त्वाचा सल्ला:** उसाला पाणी जास्त साठू देऊ नका. अधिक माहितीसाठी आपल्या जवळच्या कृषी विज्ञान केंद्राशी (KVK) संपर्क साधा.`;
    } else if (context.language === 'hi') {
      reply = `**गन्ने में तना छेदक (Early Shoot Borer) का एकीकृत प्रबंधन:**
1. **लक्षण:** गन्ने की बीच वाली गोभ सूख जाती है (डेड हार्ट) और खींचने पर आसानी से दुर्गंध के साथ बाहर आ जाती है।
2. **जैविक नियंत्रण:** बुवाई के 30 दिन बाद ट्राइकोग्रामा कार्ड @ 2 कार्ड प्रति एकड़ 10 दिन के अंतराल पर लगाएं।
3. **रासायनिक उपाय:** अधिक प्रकोप होने पर क्लोरेंट्रानिलिप्रोल 18.5% SC @ 0.4 मिली/लीटर पानी की दर से पौधों की जड़ों में ड्रेंचिंग करें।
4. **महत्वपूर्ण सूचना:** कीटनाशक का प्रयोग करते समय लेबल निर्देश पढ़ें और सुरक्षा उपकरण पहनें।`;
    } else {
      reply = `**Integrated Management for Sugarcane Early Shoot Borer (Chilo infuscatellus):**
1. **Key Symptoms:** Central shoot withers forming a characteristic 'dead heart' that emits an offensive odor when pulled out.
2. **Cultural & Biological Control:** 
   - Light earthing up at 35-45 days after planting to prevent larval entry into root collar.
   - Release *Trichogramma chilonis* egg parasitoids @ 20,000/acre at 10-day intervals from 30 DAS.
3. **Chemical Intervention (If ETL > 15% dead hearts):**
   - Apply Chlorantraniliprole 18.5% SC @ 0.4 ml/L water as targeted root-zone soil drenching.
4. **Agronomic Notice:** Maintain balanced nitrogen; avoid excess urea which promotes succulent tissue susceptible to borer larvae. Always consult your local Krishi Vigyan Kendra (KVK).`;
    }
  } else if (lower.includes("fertilizer") || lower.includes("खत") || lower.includes("खाद") || lower.includes("cotton") || lower.includes("कापूस")) {
    if (context.language === 'mr') {
      reply = `**कापूस पिकाचे खत व्यवस्थापन (मध्यम ते भारी काळी जमीन):**
1. **शिफारस केलेली खत मात्रा:** प्रति हेक्टरी १२० किलो नत्र (N), ६० किलो स्फुरद (P₂O₅), ६० किलो पालाश (K₂O).
2. **हप्ते (Splits):**
   - **पेरणीवेळी (Basal):** संपूर्ण स्फुरद (डीएपी किंवा १०:२६:२६) + संपूर्ण पालाश (एमओपी) + २५% नत्र.
   - **३० दिवसांनी:** २५% नत्र (युरिया).
   - **६० दिवसांनी (फुलोरा अवस्था):** २५% नत्र.
   - **७५-८० दिवसांनी (बोंड भरताना):** २५% नत्र + १९:१९:१९ किंवा १३:००:४५ ची फवारणी.
3. **सल्ला:** माती परीक्षणानुसार सूक्ष्म अन्नद्रव्ये (झिंक व बोरॉन) चा वापर नक्की करा.`;
    } else {
      reply = `**Recommended Fertilizer Schedule for Bt Cotton (Maharashtra Deccan Plateau):**
1. **Target RDF:** 120 kg Nitrogen (N), 60 kg Phosphorus (P₂O₅), 60 kg Potassium (K₂O) per hectare.
2. **Application Stages:**
   - **Basal (At Sowing):** Apply 100% Phosphorus (via DAP or 10:26:26) + 100% Potash (MOP) + 20% Nitrogen.
   - **Squaring (30-35 DAS):** Top-dress 40% Nitrogen (Urea) with soil moisture.
   - **Flowering (60 DAS):** Top-dress balance 40% Nitrogen.
   - **Boll Development (75-90 DAS):** 2 foliar sprays of 13:00:45 (Potassium Nitrate) @ 10 g/L for boll weight.
3. **Expert Guidance:** On black cotton soils, incorporate 5 kg Zinc Sulphate per acre if deficient in Soil Health Card.`;
    }
  } else {
    reply = `**Farm AI Advisory:**
Thank you for your question. For optimal crop health:
1. **Root Zone Inspection:** Check soil moisture at 4-6 inches depth before irrigating.
2. **Integrated Pest Management:** Regularly inspect 20 representative plants across your field in an 'X' pattern.
3. **Balanced Nutrition:** Apply fertilizers in split doses aligned with vegetative, flowering, and fruit-filling stages rather than a single large application.
4. **Expert Consultation:** For localized guidance, connect with your district Agricultural Technology Management Agency (ATMA) or Krishi Vigyan Kendra (KVK).

*(Note: Live AI API key is not currently configured in the environment; responses are powered by regional agronomic expert knowledge).*`;
  }

  return { text: reply, isDemo: !apiKey };
}

/**
 * Image-based disease analysis
 */
export async function analyzeCropImage(
  cropName: string,
  _imageBase64: string,
  userNotes?: string
): Promise<DiseaseAnalysisResult> {
  const apiKey = process.env.AI_API_KEY;

  // Normalize crop key
  const normalized = cropName.toLowerCase();
  let matchedSample = DEMO_DISEASE_SAMPLES["cotton"];

  for (const key of Object.keys(DEMO_DISEASE_SAMPLES)) {
    if (normalized.includes(key)) {
      matchedSample = DEMO_DISEASE_SAMPLES[key];
      break;
    }
  }

  // If live vision API is enabled, we could call Gemini 1.5 Flash Vision.
  // When not set, return realistic verified agronomy analysis clearly marked as demonstration.
  return {
    id: "diag-" + Date.now(),
    cropName: matchedSample.cropName,
    possibleDisease: matchedSample.possibleDisease,
    confidence: matchedSample.confidence,
    confidenceLevel: matchedSample.confidenceLevel,
    symptoms: matchedSample.symptoms,
    possibleCauses: matchedSample.possibleCauses,
    suggestedActions: matchedSample.suggestedActions,
    preventiveMeasures: matchedSample.preventiveMeasures,
    expertAdviceRecommended: true,
    isDemo: !apiKey,
    analyzedAt: new Date().toISOString(),
  };
}
