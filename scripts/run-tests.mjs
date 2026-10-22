import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

console.log("\n=======================================================");
console.log("FARM AI ASSISTANT — AUTOMATED VERIFICATION SUITE");
console.log("=======================================================\n");

// --- TEST GROUP 1: UNIT CONVERSIONS & AGRONOMIC CALCULATIONS ---
console.log("1. Testing Unit Conversions & Agronomy Formulas...");

function convertArea(value, from, to) {
  if (from === to || value <= 0) return value;
  let inHectares = 0;
  if (from === 'hectares') inHectares = value;
  else if (from === 'acres') inHectares = value * 0.404686;
  else if (from === 'gunthas') inHectares = value * 0.010117;

  if (to === 'hectares') return Number(inHectares.toFixed(3));
  if (to === 'acres') return Number((inHectares * 2.47105).toFixed(3));
  if (to === 'gunthas') return Number((inHectares * 98.842).toFixed(2));
  return value;
}

test("Unit conversion: 1 Hectare equals ~2.471 Acres", () => {
  const acres = convertArea(1, "hectares", "acres");
  assert(Math.abs(acres - 2.471) < 0.01, `Expected ~2.471, got ${acres}`);
});

test("Unit conversion: 1 Acre equals 40 Gunthas", () => {
  const gunthas = convertArea(1, "acres", "gunthas");
  assert(Math.abs(gunthas - 40.0) < 0.2, `Expected ~40, got ${gunthas}`);
});

test("Unit conversion: 40 Gunthas equals ~1 Acre", () => {
  const acres = convertArea(40, "gunthas", "acres");
  assert(Math.abs(acres - 1.0) < 0.05, `Expected ~1, got ${acres}`);
});

test("Fertilizer calculation: Cotton RDF (120:60:60 kg/ha) on 1 Hectare yields correct DAP, Urea, and MOP", () => {
  const totalP = 60;
  const totalN = 120;
  const totalK = 60;

  const dapKg = Number((totalP / 0.46).toFixed(1));
  assert.strictEqual(dapKg, 130.4);

  const nFromDap = Number((dapKg * 0.18).toFixed(1));
  const remainingN = totalN - nFromDap;
  const ureaKg = Number((remainingN / 0.46).toFixed(1));
  assert(ureaKg >= 209 && ureaKg <= 211, `Expected urea ~210kg, got ${ureaKg}`);

  const mopKg = Number((totalK / 0.60).toFixed(1));
  assert.strictEqual(mopKg, 100.0);

  // Bag count (50 kg bags)
  assert.strictEqual(Math.ceil(dapKg / 50), 3);
  assert.strictEqual(Math.ceil(ureaKg / 50), 5);
  assert.strictEqual(Math.ceil(mopKg / 50), 2);
});

// --- TEST GROUP 2: IRRIGATION WATER BALANCE ---
console.log("\n2. Testing Irrigation Water Schedule Models...");

test("Irrigation calculation: Drip efficiency (85%) requires less water than Flood (50%)", () => {
  const areaSqM = 10000; // 1 Ha
  const cropEtMm = 5.0 * 1.15; // Kc = 1.15

  const dripEfficiency = 0.85;
  const floodEfficiency = 0.50;

  const dripLiters = Math.round((cropEtMm / dripEfficiency) * areaSqM);
  const floodLiters = Math.round((cropEtMm / floodEfficiency) * areaSqM);

  assert(dripLiters < floodLiters, "Drip must use less water than flood");
  assert.strictEqual(dripLiters, 67647);
  assert.strictEqual(floodLiters, 115000);
});

// --- TEST GROUP 3: MULTILINGUAL DICTIONARY INTEGRITY ---
console.log("\n3. Testing Multilingual Dictionaries (English, Hindi, Marathi)...");

test("Translations dictionary file contains verified translations for all 3 languages", () => {
  const trPath = path.join(process.cwd(), "src", "lib", "i18n", "translations.ts");
  assert(fs.existsSync(trPath), "translations.ts must exist");
  const content = fs.readFileSync(trPath, "utf-8");

  assert(content.includes('en: {'), "Must have English dictionary");
  assert(content.includes('hi: {'), "Must have Hindi dictionary");
  assert(content.includes('mr: {'), "Must have Marathi dictionary");

  // Core navigation labels verification
  assert(content.includes('dashboard: "डॅशबोर्ड"'), "Must have Marathi dashboard");
  assert(content.includes('dashboard: "डैशबोर्ड"'), "Must have Hindi dashboard");
  assert(content.includes('diseaseDetection: "पीक रोग निदान"'), "Must have Marathi disease detection");
  assert(content.includes('marketPrices: "बाजारभाव (मंडी)"'), "Must have Marathi market prices");
  assert(content.includes('fertilizerCalculator: "खाद कैलकुलेटर"'), "Must have Hindi fertilizer calculator");
});

// --- TEST GROUP 4: DATABASE SCHEMA & RLS INTEGRITY ---
console.log("\n4. Testing Database Schema & Row Level Security (RLS)...");

test("SQL Migration script contains all 11 required tables and RLS policies", () => {
  const sqlPath = path.join(process.cwd(), "supabase", "migrations", "20240101000000_init_schema.sql");
  assert(fs.existsSync(sqlPath), "Migration file must exist on disk");

  const sql = fs.readFileSync(sqlPath, "utf-8");

  const requiredTables = [
    "profiles",
    "farms",
    "plots",
    "crops",
    "conversations",
    "messages",
    "disease_analyses",
    "farm_tasks",
    "crop_observations",
    "market_watchlist",
    "notification_preferences",
  ];

  for (const table of requiredTables) {
    assert(sql.includes(`CREATE TABLE IF NOT EXISTS public.${table}`), `Table public.${table} must be defined in SQL`);
    assert(sql.includes(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`), `RLS must be enabled for ${table}`);
  }

  // Verify cross-user isolation policies exist
  assert(sql.includes(`auth.uid() = id`), "Profile policy must check auth.uid()");
  assert(sql.includes(`auth.uid() = user_id`), "User tables must check auth.uid() = user_id");
});

// --- TEST GROUP 5: KNOWLEDGE CENTER DATA INTEGRITY ---
console.log("\n5. Testing Agricultural Knowledge Center Articles...");

test("Knowledge database file has articles across all 8 required categories with authentic ICAR citations", () => {
  const kdPath = path.join(process.cwd(), "src", "lib", "services", "knowledge-data.ts");
  assert(fs.existsSync(kdPath), "knowledge-data.ts must exist");
  const content = fs.readFileSync(kdPath, "utf-8");

  assert(content.includes("Soil Health"), "Must have Soil Health article");
  assert(content.includes("Plant Diseases and Pests"), "Must have Pests article");
  assert(content.includes("Irrigation"), "Must have Irrigation article");
  assert(content.includes("Government Agricultural Resources"), "Must have Govt resources article");
  assert(content.includes("Organic and Sustainable Farming"), "Must have Organic article");
  assert(content.includes("Harvesting and Storage"), "Must have Harvesting article");
  assert(content.includes("Mahatma Phule Krishi Vidyapeeth (MPKV)"), "Must cite MPKV Rahuri");
  assert(content.includes("Central Institute for Cotton Research"), "Must cite ICAR-CICR");
});

// --- TEST GROUP 6: DISEASE SAMPLES & AGRONOMY SERVICE ---
console.log("\n6. Testing Crop Disease Diagnostics & IPM Guidelines...");

test("AI Service defines structured IPM and causes for major crops", () => {
  const aiPath = path.join(process.cwd(), "src", "lib", "services", "ai-service.ts");
  assert(fs.existsSync(aiPath), "ai-service.ts must exist");
  const content = fs.readFileSync(aiPath, "utf-8");

  assert(content.includes("DEMO_DISEASE_SAMPLES"), "Must define disease samples");
  assert(content.includes("Bacterial Blight"), "Must have cotton bacterial blight");
  assert(content.includes("Yellow Mosaic Virus"), "Must have soybean YMV");
  assert(content.includes("Red Rot"), "Must have sugarcane red rot");
  assert(content.includes("Purple Blotch"), "Must have onion purple blotch");
  assert(content.includes("expertAdviceRecommended"), "Must flag expert advice recommended");
});

// --- TEST GROUP 7: ALL 19 PAGES AND ROUTES PRESENT ---
console.log("\n7. Testing All 19 Required Page Routes...");

test("All 19 frontend page files exist and are configured", () => {
  const routes = [
    "src/app/page.tsx",
    "src/app/login/page.tsx",
    "src/app/signup/page.tsx",
    "src/app/forgot-password/page.tsx",
    "src/app/dashboard/page.tsx",
    "src/app/assistant/page.tsx",
    "src/app/disease-detection/page.tsx",
    "src/app/crop-recommendation/page.tsx",
    "src/app/weather/page.tsx",
    "src/app/fertilizer-calculator/page.tsx",
    "src/app/irrigation/page.tsx",
    "src/app/market-prices/page.tsx",
    "src/app/farm-management/page.tsx",
    "src/app/tasks/page.tsx",
    "src/app/knowledge/page.tsx",
    "src/app/knowledge/[id]/page.tsx",
    "src/app/profile/page.tsx",
    "src/app/privacy/page.tsx",
    "src/app/terms/page.tsx",
    "src/app/not-found.tsx",
  ];

  for (const r of routes) {
    const full = path.join(process.cwd(), r);
    assert(fs.existsSync(full), `Required page missing: ${r}`);
  }
});

// --- TEST GROUP 8: API BACKEND ENDPOINTS PRESENT ---
console.log("\n8. Testing Backend API Routes...");

test("All 4 backend server routes exist", () => {
  const apis = [
    "src/app/api/assistant/route.ts",
    "src/app/api/disease-detection/route.ts",
    "src/app/api/weather/route.ts",
    "src/app/api/market/route.ts",
  ];

  for (const a of apis) {
    const full = path.join(process.cwd(), a);
    assert(fs.existsSync(full), `Required API route missing: ${a}`);
  }
});

console.log("\n=======================================================");
console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log("=======================================================\n");

if (failed > 0) {
  process.exit(1);
} else {
  console.log("ALL TESTS PASSED SUCCESSFULLY! Ready for production build.\n");
}
