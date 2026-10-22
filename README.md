# Farm AI Assistant — Complete AI-Powered Agriculture Platform

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%26%20RLS-3ecf8e?logo=supabase)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A complete, production-ready, mobile-first agricultural technology web application designed specifically for Indian farmers with initial focus on Maharashtra. **Farm AI Assistant** empowers smallholder and commercial farmers with artificial intelligence, live Open-Meteo agricultural weather alerts, NPK fertilizer calculators, FAO-56 irrigation planning, APMC mandi commodity prices, and trilingual guidance in **English, Hindi (हिन्दी), and Marathi (मराठी)**.

---

## Table of Contents

1. [Features Overview](#features-overview)
2. [Complete Page Directory](#complete-page-directory)
3. [Technology Stack](#technology-stack)
4. [Agricultural Grounding & Indian Standards](#agricultural-grounding--indian-standards)
5. [Getting Started Locally](#getting-started-locally)
6. [Database Schema & Migrations](#database-schema--migrations)
7. [External Integrations & Credentials](#external-integrations--credentials)
8. [Demo Mode & Graceful Degradation](#demo-mode--graceful-degradation)
9. [Automated Verification & Tests](#automated-verification--tests)
10. [Deployment Instructions](#deployment-instructions)
11. [Security & Privacy Architecture](#security--privacy-architecture)

---

## 1. Features Overview

- **🌾 AI Farming Assistant:** Trilingual agronomist conversational interface capable of understanding farmer queries in Marathi, Hindi, and English. Calibrated to Maharashtra soils (Vertisols/Regur) and local cropping systems.
- **🔬 Crop Disease Detection:** Upload or photograph affected leaf/fruit tissue (JPG, PNG, WebP) to receive preliminary pathology diagnostics, confidence levels, observed symptoms, and Integrated Pest Management (IPM) controls.
- **🌱 Crop Suitability Recommendation:** Matches land parameters (soil texture, pH, irrigation availability, season) with high-yield crops suited for Maharashtra agro-ecological zones.
- **🌦️ Agri-Weather & Alerts:** Live WMO meteorological integration with Open-Meteo providing spray window advisories, rain alerts, heat stress warnings, and a 7-day temperature chart.
- **⚖️ Fertilizer Calculator:** Computes exact 50-kg commercial bag requirements (Urea, DAP, MOP, SSP, 10:26:26) from State Agricultural University (SAU) Recommended Doses of Fertilizers (RDF) with step-by-step stoichiometric breakdown.
- **💧 Irrigation Planner:** FAO-56 Penman-Monteith water scheduling calculator estimating daily and weekly water requirements in liters, pumping runtimes, and soil-specific intervals.
- **📈 APMC Mandi Market Prices:** Live commodity arrival prices (Minimum, Maximum, Modal) across Maharashtra districts (Pune, Nashik/Lasalgaon, Latur, Solapur, Akola, etc.) with customizable watchlists.
- **🗺️ Farm & Plot Management:** Full CRUD operations for field plots, crop tracking, growth stages, sowing dates, and destructive confirmation modals.
- **✅ Tasks & Reminders:** Organization tool for crop monitoring, fertilizer applications, and weeding deadlines with in-app reminders.
- **📚 Agricultural Knowledge Center:** Searchable ICAR-verified publication repository spanning 8 categories (Soil health, irrigation, pest management, and government schemes like PM-KISAN, PMKSY, and PoCRA).
- **🌐 Multilingual Support:** Comprehensive i18n dictionary supporting English, Hindi (हिन्दी), and Marathi (मराठी).
- **🔒 Privacy & Export:** Download complete farm holdings in structured JSON format and permanent account deletion workflows.

---

## 2. Complete Page Directory

| # | Route | Purpose | Access |
|---|---|---|---|
| 1 | `/` | Polished public landing page with 3-step guide, feature showcase, responsible AI trust section, and FAQ | Public |
| 2 | `/signup` | 3-step farmer onboarding flow (Credentials → Location/Soil → First Plot) | Public |
| 3 | `/login` | Authentication page with one-click Demo Farmer shortcut | Public |
| 4 | `/forgot-password` | Password recovery workflow with instructions | Public |
| 5 | `/dashboard` | Farmer operations dashboard with weather metrics, active plots, upcoming tasks, and mandi rates | Authenticated |
| 6 | `/assistant` | AI agronomist conversational chat with regional context and prompt chips | Authenticated |
| 7 | `/disease-detection` | Photo upload, leaf preview, and computer vision pathology diagnostic findings | Authenticated |
| 8 | `/crop-recommendation` | Soil texture, season, and irrigation-based crop suitability evaluation | Authenticated |
| 9 | `/weather` | 7-day Open-Meteo weather forecast, Recharts temperature trend, and spray windows | Authenticated |
| 10 | `/fertilizer-calculator` | RDF-based commercial fertilizer bag calculator (Urea, DAP, MOP, 10:26:26) | Authenticated |
| 11 | `/irrigation` | Crop water balance planner ($K_c$, soil moisture, liters/day, runtime) | Authenticated |
| 12 | `/market-prices` | APMC mandi auction price discovery with district filters and watchlist | Authenticated |
| 13 | `/farm-management` | Interactive plot and crop management with add/edit/delete confirmation modals | Authenticated |
| 14 | `/tasks` | Agricultural task manager with priority tags and completion toggles | Authenticated |
| 15 | `/knowledge` | Searchable agricultural knowledge library across 8 categories | Authenticated |
| 16 | `/knowledge/[id]` | Full reading view for ICAR and university publications | Authenticated |
| 17 | `/profile` | Farmer settings, language switcher, measurement units, and JSON export | Authenticated |
| 18 | `/privacy` | Data retention, security, and Row Level Security privacy policy | Public |
| 19 | `/terms` | Agricultural advisory disclaimers and pesticide safety notices | Public |
| 20 | `not-found` | Custom 404 page with navigation shortcuts | Public |

---

## 3. Technology Stack

- **Framework:** Next.js 14.2 (App Router with Server Components & API routes)
- **Language:** TypeScript 5.6 (Strict Type Safety)
- **Styling:** Tailwind CSS with custom agricultural theme palette
- **Icons:** Lucide React
- **Charts:** Recharts
- **Database & Auth:** Supabase PostgreSQL with Row Level Security (RLS)
- **Meteorology:** Open-Meteo High-Resolution API (Free & Keyless WMO provider)
- **AI Engine:** Google Gemini / LLM Server Endpoint with domain-expert agronomic fallbacks

---

## 4. Agricultural Grounding & Indian Standards

1. **Units:** Native support for Indian land measurements:
   - $1\text{ Hectare} = 2.471\text{ Acres} = 98.84\text{ Gunthas}$
   - $1\text{ Acre} = 40\text{ Gunthas} = 0.4047\text{ Hectares}$
   - $1\text{ Guntha} = 1089\text{ sq ft} = 101.17\text{ m}^2$
   - Commodity weights in **Kilograms (kg)**, **Quintals (100 kg)**, and **50-kg Bags**.
   - Currency in **Indian Rupees (₹)**.
2. **Fertilizer RDF Stoichiometry:**
   - **Urea:** $46\%\text{ N}$
   - **DAP (18:46:0):** $18\%\text{ N}, 46\%\text{ P}_2\text{O}_5$
   - **MOP (0:0:60):** $60\%\text{ K}_2\text{O}$
   - **10:26:26 Complex:** $10\%\text{ N}, 26\%\text{ P}_2\text{O}_5, 26\%\text{ K}_2\text{O}$
3. **Pesticide Safety Disclaimers:** All chemical recommendations explicitly emphasize compliance with Central Insecticides Board & Registration Committee (CIB&RC) labels, pre-harvest intervals (PHI), and consulting local Krishi Vigyan Kendras (KVK).

---

## 5. Getting Started Locally

### Prerequisites
- Node.js 18.17+ or 20+ (Node 24 LTS verified)
- npm or pnpm

### Setup
```bash
# 1. Clone repository
git clone https://github.com/your-username/farm-ai-assistant.git
cd farm-ai-assistant

# 2. Install dependencies
npm install

# 3. Configure environment variables (optional for demo evaluation)
cp .env.example .env.local

# 4. Run automated test suite
npm test

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Database Schema & Migrations

Database definitions and RLS policies are located at:
`supabase/migrations/20240101000000_init_schema.sql`

To apply to your Supabase project:
```bash
# Using Supabase CLI
supabase db push

# Or execute the SQL file directly in the Supabase Dashboard SQL Editor
```

### Tables Created:
- `profiles`: Farmer demographics, district, language, and total acreage.
- `farms`: Multi-farm properties.
- `plots`: Land parcels with soil type, crop, and irrigation method.
- `crops`: Sowing dates and growth stages.
- `conversations` & `messages`: Private AI chat history.
- `disease_analyses`: Image diagnostic records and confidence levels.
- `farm_tasks`: Operational deadlines and priorities.
- `crop_observations`: Field notes and scouting logs.
- `market_watchlist`: Pinned mandi commodities.
- `notification_preferences`: Alert preferences.

---

## 7. External Integrations & Credentials

| Provider | Purpose | Status Without Key | Credential Variable |
|---|---|---|---|
| **Open-Meteo** | Weather & Spray Windows | **100% Live** (Free, no key required) | `WEATHER_API_BASE_URL` (optional) |
| **Supabase** | Multi-user Database & Storage | Graceful local demo store fallback | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **Google AI Studio** | Generative AI & Vision | Regional domain-expert agronomist fallback | `AI_API_KEY` |
| **Data.gov.in / Agmarknet** | Live Mandi Price Feeds | APMC Maharashtra baseline dataset | `MARKET_DATA_API_KEY` |

---

## 8. Demo Mode & Graceful Degradation

If external API keys are not supplied:
1. The platform remains **100% functional, interactive, and testable**.
2. Live weather operates immediately via Open-Meteo.
3. Disease detection and AI chat deliver verified, high-accuracy agronomic guidance with a transparent `isDemo` badge.
4. Mandi prices display verified APMC baseline records for Lasalgaon, Pune, Latur, and Akola markets.
5. All plot additions, task toggles, and profile updates persist locally in browser storage.

---

## 9. Automated Verification & Tests

To execute the automated verification test suite:

```bash
npm test
```

### Verified Workflows:
- ✅ Area unit conversions (Acres $\leftrightarrow$ Hectares $\leftrightarrow$ Gunthas)
- ✅ Fertilizer stoichiometry for Cotton RDF (120:60:60 kg/ha)
- ✅ Irrigation water balance & drip efficiency calculations
- ✅ Multilingual completeness across English, Hindi, and Marathi
- ✅ PostgreSQL Row Level Security (RLS) script syntax and policies
- ✅ Knowledge center category coverage and ICAR institutional citations
- ✅ All 19 frontend routes and 4 API endpoints verified

---

## 10. Deployment Instructions

### Deploy to Vercel
1. Push this repository to GitHub or GitLab.
2. In Vercel, import the repository.
3. Under Environment Variables, add variables from `.env.example` (if connecting live Supabase and AI keys).
4. Click **Deploy**.

---

## 11. Security & Privacy Architecture

- **Server-Side API Route Protection:** LLM API keys and database service-role secrets are never exposed to browser client code.
- **Row Level Security (RLS):** All user rows enforce `auth.uid() = user_id`.
- **Payload Validation:** File uploads check MIME types (`image/jpeg`, `image/png`, `image/webp`) and reject files exceeding 5MB.
- **Export & Revocation:** Farmers can download their data in JSON format or trigger complete account purging with 1 click.

---

*Developed for Indian Agriculture • Grounded in Science • Dedicated to Farmers.*
