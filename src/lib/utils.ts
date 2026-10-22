import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AreaUnit } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 1 Hectare = 2.47105 Acres = 98.842 Gunthas
// 1 Acre = 40 Gunthas = 0.404686 Hectares
// 1 Guntha = 1089 sq ft = 0.025 Acres = 0.010117 Hectares
export function convertArea(value: number, from: AreaUnit, to: AreaUnit): number {
  if (from === to || value <= 0) return value;

  // First convert from whatever into Hectares
  let inHectares = 0;
  if (from === 'hectares') inHectares = value;
  else if (from === 'acres') inHectares = value * 0.404686;
  else if (from === 'gunthas') inHectares = value * 0.010117;

  // Then convert from Hectares to target
  if (to === 'hectares') return Number(inHectares.toFixed(3));
  if (to === 'acres') return Number((inHectares * 2.47105).toFixed(3));
  if (to === 'gunthas') return Number((inHectares * 98.842).toFixed(2));

  return value;
}

export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateString(dateStr: string, locale: string = 'en'): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const loc = locale === 'mr' ? 'mr-IN' : locale === 'hi' ? 'hi-IN' : 'en-IN';
    return d.toLocaleDateString(loc, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function getGrowthStages(): string[] {
  return [
    'Sowing / Germination',
    'Vegetative / Tillering',
    'Flowering / Booting',
    'Grain Filling / Pod Formation',
    'Maturity / Ripening',
    'Ready for Harvest',
  ];
}
