-- =========================================================
-- SUPABASE DATABASE SCHEMA: user_badges (Sistem Reward Gamifikasi)
-- Jalankan skrip ini di SQL Editor Supabase Anda
-- =========================================================

-- 1. Buat Tabel user_badges
CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id VARCHAR(100) NOT NULL,
    badge_name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('badge', 'certificate', 'frame')),
    points_spent INT NOT NULL DEFAULT 0,
    claimed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    CONSTRAINT unique_user_badge UNIQUE (user_id, badge_id)
);

-- 2. Index untuk kueri cepat berdasarkan user_id
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON public.user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_category ON public.user_badges(category);

-- 3. Aktifkan Row Level Security (RLS)
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- 4. Kebijakan RLS (Security Policies)
-- Pengguna hanya dapat melihat badge/pencapaian milik sendiri
CREATE POLICY "Users can select their own badges"
    ON public.user_badges FOR SELECT
    USING (auth.uid() = user_id);

-- Pengguna dapat menambahkan/mengklaim badge milik sendiri
CREATE POLICY "Users can insert their own badges"
    ON public.user_badges FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Pengguna dapat mengupdate badge milik sendiri (misal: equip frame)
CREATE POLICY "Users can update their own badges"
    ON public.user_badges FOR UPDATE
    USING (auth.uid() = user_id);

-- =========================================================
-- CATATAN:
-- Tabel profiles sudah memiliki kolom:
--   points INT DEFAULT 0
--   total_scan INT DEFAULT 0
--
-- Tabel scan_history mencatat transaksi penukaran:
--   category: 'Reward'
--   points_earned: -points_spent (bernilai negatif)
-- =========================================================
