export type Language = 'en' | 'hi' | 'mr';

export type AreaUnit = 'acres' | 'hectares' | 'gunthas';

export type SoilType =
  | 'Black Cotton Soil (Regur)'
  | 'Red Soil'
  | 'Alluvial Soil'
  | 'Laterite Soil'
  | 'Sandy Loam'
  | 'Clay Loam';

export type IrrigationMethod = 'Drip' | 'Sprinkler' | 'Flood' | 'Rainfed';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface UserProfile {
  id: string;
  full_name: string;
  preferred_language: Language;
  state: string;
  district: string;
  village?: string;
  farming_experience_years?: number;
  farm_area?: number;
  area_unit: AreaUnit;
  soil_type?: SoilType;
  water_availability?: string;
  created_at?: string;
}

export interface FarmPlot {
  id: string;
  user_id: string;
  farm_id?: string;
  name: string;
  area: number;
  area_unit: AreaUnit;
  soil_type: SoilType;
  current_crop: string;
  sowing_date: string;
  irrigation_method: IrrigationMethod;
  growth_stage: string;
  created_at?: string;
}

export interface FarmTask {
  id: string;
  user_id: string;
  plot_id?: string;
  plot_name?: string;
  title: string;
  description?: string;
  due_date: string;
  priority: TaskPriority;
  status: TaskStatus;
  reminder_type: 'in_app' | 'none';
  created_at?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  timestamp: string;
}

export interface DiseaseAnalysisResult {
  id: string;
  cropName: string;
  imageUrl?: string;
  possibleDisease: string;
  confidence: number;
  confidenceLevel: 'High' | 'Moderate' | 'Preliminary';
  symptoms: string[];
  possibleCauses: string[];
  suggestedActions: string[];
  preventiveMeasures: string[];
  expertAdviceRecommended: boolean;
  isDemo: boolean;
  analyzedAt: string;
}

export interface CropRecommendationInput {
  state: string;
  district: string;
  soilType: SoilType;
  soilPh?: number;
  nLevel?: number;
  pLevel?: number;
  kLevel?: number;
  farmArea: number;
  areaUnit: AreaUnit;
  irrigationAvailable: IrrigationMethod;
  season: 'Kharif' | 'Rabi' | 'Zaid' | 'Whole Year';
  preferredCategory?: string;
}

export interface CropRecommendationItem {
  cropName: string;
  scientificName?: string;
  suitabilityScore: number;
  suitabilityExplanation: string;
  waterRequirement: string;
  expectedDuration: string;
  plantingWindow: string;
  soilSuitability: string;
  risksAndLimitations: string[];
  recommendedNextActions: string[];
}

export interface WeatherData {
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  current: {
    temp: number;
    humidity: number;
    windSpeed: number;
    weatherCode: number;
    condition: string;
    precipitation: number;
  };
  daily: Array<{
    date: string;
    tempMax: number;
    tempMin: number;
    weatherCode: number;
    condition: string;
    precipitationSum: number;
    windSpeedMax: number;
  }>;
  alerts: Array<{
    severity: 'warning' | 'info' | 'critical';
    title: string;
    description: string;
    action: string;
  }>;
  source: string;
  lastUpdated: string;
  isDemo?: boolean;
}

export interface MandiPriceRecord {
  id: string;
  crop: string;
  variety: string;
  market: string;
  district: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: string;
  arrivalDate: string;
  source: string;
}

export interface FertilizerCalculationInput {
  crop: string;
  area: number;
  areaUnit: AreaUnit;
  growthStage: string;
  nitrogenRequiredKgHa: number;
  phosphorusRequiredKgHa: number;
  potassiumRequiredKgHa: number;
  selectedFertilizers: {
    urea?: boolean;
    dap?: boolean;
    mop?: boolean;
    ssp?: boolean;
    npk_10_26_26?: boolean;
  };
}

export interface FertilizerCalculationResult {
  totalAreaHa: number;
  totalNRequiredKg: number;
  totalPRequiredKg: number;
  totalKRequiredKg: number;
  recommendedProducts: Array<{
    name: string;
    nutrientGrade: string;
    quantityKg: number;
    numberOfBags50kg: number;
    notes: string;
  }>;
  stepsExplanation: string[];
  disclaimer: string;
}

export interface IrrigationPlanInput {
  crop: string;
  area: number;
  areaUnit: AreaUnit;
  soilType: SoilType;
  growthStage: 'Initial' | 'Development' | 'Mid-season' | 'Late season';
  irrigationMethod: IrrigationMethod;
  soilMoistureLevel?: 'High' | 'Adequate' | 'Low' | 'Critical';
  expectedRainfallMm?: number;
}

export interface IrrigationPlanResult {
  dailyWaterRequirementLiters: number;
  totalWeeklyWaterLiters: number;
  recommendedFrequency: string;
  durationPerSessionHours: number;
  guidance: string[];
  weatherAdjustment: string;
  waterSavingTips: string[];
  assumptions: string[];
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  source: string;
  publishedDate: string;
  readTime: string;
}
