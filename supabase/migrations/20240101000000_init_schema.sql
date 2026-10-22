-- ==============================================================================
-- FARM AI ASSISTANT - DATABASE SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'hi', 'mr')),
    state TEXT DEFAULT 'Maharashtra',
    district TEXT DEFAULT 'Pune',
    village TEXT,
    farming_experience_years INTEGER,
    farm_area NUMERIC(10, 2),
    area_unit TEXT DEFAULT 'acres' CHECK (area_unit IN ('acres', 'hectares', 'gunthas')),
    soil_type TEXT,
    water_availability TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FARMS
CREATE TABLE IF NOT EXISTS public.farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    total_area NUMERIC(10, 2),
    area_unit TEXT DEFAULT 'acres',
    location TEXT,
    state TEXT DEFAULT 'Maharashtra',
    district TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PLOTS
CREATE TABLE IF NOT EXISTS public.plots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    area NUMERIC(10, 2) NOT NULL,
    area_unit TEXT DEFAULT 'acres',
    soil_type TEXT,
    current_crop TEXT,
    sowing_date DATE,
    irrigation_method TEXT,
    growth_stage TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CROPS / CROP CYCLES
CREATE TABLE IF NOT EXISTS public.crops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plot_id UUID REFERENCES public.plots(id) ON DELETE CASCADE,
    crop_name TEXT NOT NULL,
    variety TEXT,
    season TEXT,
    sowing_date DATE,
    expected_harvest DATE,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CONVERSATIONS
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MESSAGES
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. DISEASE ANALYSES
CREATE TABLE IF NOT EXISTS public.disease_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    crop_name TEXT NOT NULL,
    symptoms TEXT,
    image_url TEXT,
    diagnosis TEXT NOT NULL,
    confidence NUMERIC(5, 2),
    confidence_level TEXT,
    causes JSONB DEFAULT '[]'::jsonb,
    treatments JSONB DEFAULT '[]'::jsonb,
    prevention JSONB DEFAULT '[]'::jsonb,
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. FARM TASKS
CREATE TABLE IF NOT EXISTS public.farm_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plot_id UUID REFERENCES public.plots(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    reminder_type TEXT DEFAULT 'in_app',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CROP OBSERVATIONS
CREATE TABLE IF NOT EXISTS public.crop_observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plot_id UUID REFERENCES public.plots(id) ON DELETE CASCADE,
    observation_type TEXT NOT NULL,
    notes TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. MARKET WATCHLIST
CREATE TABLE IF NOT EXISTS public.market_watchlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    crop_name TEXT NOT NULL,
    mandi_name TEXT NOT NULL,
    state TEXT DEFAULT 'Maharashtra',
    district TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. NOTIFICATION PREFERENCES
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    weather_alerts BOOLEAN DEFAULT TRUE,
    task_reminders BOOLEAN DEFAULT TRUE,
    market_price_alerts BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_plots_user_id ON public.plots(user_id);
CREATE INDEX IF NOT EXISTS idx_farms_user_id ON public.farms(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.farm_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.farm_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_messages_conv_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_disease_analyses_user ON public.disease_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_market_watchlist_user ON public.market_watchlist(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Profiles: users can select, insert, and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Farms: users can manage their own farms
CREATE POLICY "Users can view own farms" ON public.farms FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own farms" ON public.farms FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own farms" ON public.farms FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own farms" ON public.farms FOR DELETE USING (auth.uid() = user_id);

-- Plots: users can manage their own plots
CREATE POLICY "Users can view own plots" ON public.plots FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own plots" ON public.plots FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own plots" ON public.plots FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own plots" ON public.plots FOR DELETE USING (auth.uid() = user_id);

-- Crops: users can manage their own crop cycles
CREATE POLICY "Users can view own crops" ON public.crops FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own crops" ON public.crops FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own crops" ON public.crops FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own crops" ON public.crops FOR DELETE USING (auth.uid() = user_id);

-- Conversations
CREATE POLICY "Users can view own conversations" ON public.conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own conversations" ON public.conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own conversations" ON public.conversations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own conversations" ON public.conversations FOR DELETE USING (auth.uid() = user_id);

-- Messages
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own messages" ON public.messages FOR DELETE USING (auth.uid() = user_id);

-- Disease Analyses
CREATE POLICY "Users can view own disease analyses" ON public.disease_analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own disease analyses" ON public.disease_analyses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own disease analyses" ON public.disease_analyses FOR DELETE USING (auth.uid() = user_id);

-- Farm Tasks
CREATE POLICY "Users can view own farm tasks" ON public.farm_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own farm tasks" ON public.farm_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own farm tasks" ON public.farm_tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own farm tasks" ON public.farm_tasks FOR DELETE USING (auth.uid() = user_id);

-- Crop Observations
CREATE POLICY "Users can view own crop observations" ON public.crop_observations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own crop observations" ON public.crop_observations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own crop observations" ON public.crop_observations FOR DELETE USING (auth.uid() = user_id);

-- Market Watchlist
CREATE POLICY "Users can view own market watchlist" ON public.market_watchlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own market watchlist" ON public.market_watchlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own market watchlist" ON public.market_watchlist FOR DELETE USING (auth.uid() = user_id);

-- Notification Preferences
CREATE POLICY "Users can view own notification preferences" ON public.notification_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notification preferences" ON public.notification_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notification preferences" ON public.notification_preferences FOR UPDATE USING (auth.uid() = user_id);

-- ==============================================================================
-- PROFILE TRIGGER ON USER SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, preferred_language, state, district)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Farmer'),
    COALESCE(new.raw_user_meta_data->>'preferred_language', 'en'),
    COALESCE(new.raw_user_meta_data->>'state', 'Maharashtra'),
    COALESCE(new.raw_user_meta_data->>'district', 'Pune')
  );
  INSERT INTO public.notification_preferences (user_id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- STORAGE BUCKET CONFIGURATION (for Supabase Storage)
-- ==============================================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('crop-images', 'crop-images', false);
-- CREATE POLICY "Users can upload crop images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'crop-images' AND auth.uid()::text = (storage.foldername(name))[1]);
-- CREATE POLICY "Users can read own crop images" ON storage.objects FOR SELECT USING (bucket_id = 'crop-images' AND auth.uid()::text = (storage.foldername(name))[1]);
-- CREATE POLICY "Users can delete own crop images" ON storage.objects FOR DELETE USING (bucket_id = 'crop-images' AND auth.uid()::text = (storage.foldername(name))[1]);
