-- =========================================================
-- SUPABASE DATABASE SCHEMA: waste_logs
-- Run this script in your Supabase SQL Editor
-- =========================================================

CREATE TABLE IF NOT EXISTS public.waste_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Organik', 'Plastik', 'Kertas', 'Logam', 'B3')),
    weight_gram INT NOT NULL DEFAULT 200,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast user statistics query
CREATE INDEX IF NOT EXISTS idx_waste_logs_user_id ON public.waste_logs(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.waste_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can select their own waste logs"
    ON public.waste_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own waste logs"
    ON public.waste_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);
