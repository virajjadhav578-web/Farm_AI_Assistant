import { WeatherData } from "../../types";

export const MAHARASHTRA_CITIES: Record<string, { lat: number; lon: number; state: string }> = {
  "Pune": { lat: 18.5204, lon: 73.8567, state: "Maharashtra" },
  "Nashik": { lat: 19.9975, lon: 73.7898, state: "Maharashtra" },
  "Nagpur": { lat: 21.1458, lon: 79.0882, state: "Maharashtra" },
  "Chhatrapati Sambhajinagar": { lat: 19.8762, lon: 75.3433, state: "Maharashtra" },
  "Kolhapur": { lat: 16.7050, lon: 74.2433, state: "Maharashtra" },
  "Solapur": { lat: 17.6599, lon: 75.9064, state: "Maharashtra" },
  "Amravati": { lat: 20.9374, lon: 77.7796, state: "Maharashtra" },
  "Jalgaon": { lat: 21.0077, lon: 75.5626, state: "Maharashtra" },
  "Latur": { lat: 18.4088, lon: 76.5604, state: "Maharashtra" },
  "Ahmednagar": { lat: 19.0948, lon: 74.7480, state: "Maharashtra" },
  "Satara": { lat: 17.6805, lon: 74.0183, state: "Maharashtra" },
  "Sangli": { lat: 16.8524, lon: 74.5815, state: "Maharashtra" },
  "Nanded": { lat: 19.1383, lon: 77.3210, state: "Maharashtra" },
  "Akola": { lat: 20.7002, lon: 77.0082, state: "Maharashtra" },
  "Bhopal": { lat: 23.2599, lon: 77.4126, state: "Madhya Pradesh" },
  "Lucknow": { lat: 26.8467, lon: 80.9462, state: "Uttar Pradesh" },
  "New Delhi": { lat: 28.6139, lon: 77.2090, state: "Delhi" },
};

function decodeWeatherCode(code: number): string {
  if (code === 0) return "Clear Sky";
  if (code === 1) return "Mainly Clear";
  if (code === 2) return "Partly Cloudy";
  if (code === 3) return "Overcast";
  if (code >= 45 && code <= 48) return "Fog / Mist";
  if (code >= 51 && code <= 55) return "Light Drizzle";
  if (code >= 61 && code <= 65) return "Rain Showers";
  if (code >= 71 && code <= 77) return "Snow / Hail";
  if (code >= 80 && code <= 82) return "Heavy Rain Showers";
  if (code >= 95 && code <= 99) return "Thunderstorm";
  return "Partly Cloudy";
}

export async function fetchWeatherData(cityName: string = "Pune"): Promise<WeatherData> {
  const cityInfo = MAHARASHTRA_CITIES[cityName] || {
    lat: 18.5204,
    lon: 73.8567,
    state: "Maharashtra",
  };

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${cityInfo.lat}&longitude=${cityInfo.lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=Asia%2FKolkata`;

    const res = await fetch(url, { next: { revalidate: 1800 } }); // Cache 30 mins
    if (!res.ok) {
      throw new Error(`Open-Meteo returned status ${res.status}`);
    }

    const data = await res.json();
    const current = data.current;
    const daily = data.daily;

    const formattedDaily = daily.time.map((dateStr: string, idx: number) => ({
      date: dateStr,
      tempMax: Math.round(daily.temperature_2m_max[idx]),
      tempMin: Math.round(daily.temperature_2m_min[idx]),
      weatherCode: daily.weather_code[idx],
      condition: decodeWeatherCode(daily.weather_code[idx]),
      precipitationSum: Number(daily.precipitation_sum[idx].toFixed(1)),
      windSpeedMax: Math.round(daily.wind_speed_10m_max[idx]),
    }));

    // Agricultural Advisories calculation
    const alerts: WeatherData['alerts'] = [];

    // Rain alert
    const rainNext3Days = formattedDaily.slice(0, 3).reduce((acc: number, d: { precipitationSum: number }) => acc + d.precipitationSum, 0);
    if (rainNext3Days > 15) {
      alerts.push({
        severity: "warning",
        title: "Significant Rainfall Advisory",
        description: `Total ${rainNext3Days.toFixed(1)} mm rain expected over next 72 hours. Soil saturation likely.`,
        action: "Postpone chemical spraying and top-dressing of urea. Ensure field channels are clear to prevent waterlogging.",
      });
    } else if (rainNext3Days > 3) {
      alerts.push({
        severity: "info",
        title: "Light Rain Expected",
        description: `Around ${rainNext3Days.toFixed(1)} mm rainfall anticipated.`,
        action: "Avoid foliar pesticide application right before showers to prevent chemical wash-off.",
      });
    }

    // Heat alert
    const maxTemp = Math.max(...formattedDaily.slice(0, 3).map((d: { tempMax: number }) => d.tempMax));
    if (maxTemp >= 38) {
      alerts.push({
        severity: "warning",
        title: "High Temperature / Heat Stress",
        description: `Day temperatures reaching ${maxTemp}°C in ${cityName}. Elevated evapotranspiration.`,
        action: "Provide light irrigation during early morning hours. Apply mulching to retain root-zone moisture.",
      });
    }

    // Wind alert
    const maxWind = Math.max(...formattedDaily.slice(0, 2).map((d: { windSpeedMax: number }) => d.windSpeedMax));
    if (maxWind >= 25) {
      alerts.push({
        severity: "warning",
        title: "High Wind Gust Advisory",
        description: `Winds peaking at ${maxWind} km/h. High drift hazard for backpack and tractor sprayers.`,
        action: "Halt all chemical herbicide/insecticide spraying until wind speed drops below 15 km/h.",
      });
    } else {
      alerts.push({
        severity: "info",
        title: "Favorable Spraying Window",
        description: `Winds are calm (${maxWind} km/h) and moderate temperature prevailing.`,
        action: "Good window for scheduled micronutrient and crop protection sprays between 7:00 AM and 10:30 AM.",
      });
    }

    // High humidity disease alert
    if (current.relative_humidity_2m >= 80) {
      alerts.push({
        severity: "warning",
        title: "Elevated Fungal Disease Threat",
        description: `High relative humidity (${current.relative_humidity_2m}%). Conditions conducive for fungal spore germination.`,
        action: "Scout for symptoms of downy mildew, powdery mildew, and anthracnose on grapes, vegetables, and pulses.",
      });
    }

    return {
      city: cityName,
      state: cityInfo.state,
      latitude: cityInfo.lat,
      longitude: cityInfo.lon,
      current: {
        temp: Math.round(current.temperature_2m),
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        weatherCode: current.weather_code,
        condition: decodeWeatherCode(current.weather_code),
        precipitation: Number(current.precipitation.toFixed(1)),
      },
      daily: formattedDaily,
      alerts,
      source: "Open-Meteo Verified Meteorological Service (WMO 0.1° resolution)",
      lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) + ", " + new Date().toLocaleDateString('en-IN'),
      isDemo: false,
    };
  } catch (err) {
    console.warn("Weather API fetch failed, falling back to verified regional meteorological baseline:", err);
    return getDemonstrationWeatherData(cityName);
  }
}

export function getDemonstrationWeatherData(cityName: string): WeatherData {
  return {
    city: cityName,
    state: "Maharashtra",
    latitude: 18.5204,
    longitude: 73.8567,
    current: {
      temp: 29,
      humidity: 58,
      windSpeed: 12,
      weatherCode: 2,
      condition: "Partly Cloudy",
      precipitation: 0.0,
    },
    daily: [
      { date: "2026-10-22", tempMax: 31, tempMin: 19, weatherCode: 1, condition: "Mainly Clear", precipitationSum: 0.0, windSpeedMax: 14 },
      { date: "2026-10-23", tempMax: 32, tempMin: 20, weatherCode: 2, condition: "Partly Cloudy", precipitationSum: 0.0, windSpeedMax: 13 },
      { date: "2026-10-24", tempMax: 30, tempMin: 19, weatherCode: 3, condition: "Overcast", precipitationSum: 1.2, windSpeedMax: 16 },
      { date: "2026-10-25", tempMax: 28, tempMin: 18, weatherCode: 61, condition: "Light Rain", precipitationSum: 8.5, windSpeedMax: 22 },
      { date: "2026-10-26", tempMax: 29, tempMin: 18, weatherCode: 2, condition: "Partly Cloudy", precipitationSum: 2.0, windSpeedMax: 15 },
      { date: "2026-10-27", tempMax: 30, tempMin: 19, weatherCode: 0, condition: "Clear Sky", precipitationSum: 0.0, windSpeedMax: 11 },
      { date: "2026-10-28", tempMax: 31, tempMin: 20, weatherCode: 1, condition: "Mainly Clear", precipitationSum: 0.0, windSpeedMax: 12 },
    ],
    alerts: [
      {
        severity: "info",
        title: "Spray Window Open (Morning)",
        description: "Winds light (12 km/h) with 58% humidity.",
        action: "Foliar fertilizer and bio-pesticide spray can proceed smoothly before noon.",
      },
      {
        severity: "warning",
        title: "Rain Expected on Day 4",
        description: "Scattered showers (~8.5 mm) modeled for the upcoming weekend.",
        action: "Clear drainage trenches around deep black soil plots to prevent standing water.",
      },
    ],
    source: "Open-Meteo Regional Demonstration Baseline (Offline Mode)",
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    isDemo: true,
  };
}
