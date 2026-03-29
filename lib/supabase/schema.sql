-- ============================================================
-- REBOOT — Schema de Supabase
-- ============================================================
-- Ejecutar este SQL en el SQL Editor de tu dashboard de Supabase:
-- https://supabase.com/dashboard → SQL Editor → New Query
-- ============================================================

-- ╔══════════════════════════════════════════════════════════╗
-- ║ TABLA: profiles                                          ║
-- ║ Almacena datos del perfil público del jugador            ║
-- ╚══════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT 'Superviviente',
  avatar_url TEXT,
  provider TEXT NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para buscar por id (ya es PK, pero explícito)
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);

-- ╔══════════════════════════════════════════════════════════╗
-- ║ TABLA: game_saves                                        ║
-- ║ Almacena el progreso del jugador en columnas individuales║
-- ╚══════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS public.game_saves (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  version INTEGER NOT NULL DEFAULT 1,
  player_name TEXT NOT NULL DEFAULT 'Superviviente',
  player_gender TEXT NOT NULL DEFAULT 'él',
  progress JSONB NOT NULL DEFAULT '{}'::jsonb,
  cards TEXT[] NOT NULL DEFAULT '{}'::text[],
  objects TEXT[] NOT NULL DEFAULT '{}'::text[],
  frag_used_total INTEGER NOT NULL DEFAULT 0,
  current_level_id TEXT NOT NULL DEFAULT 'P-00',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para buscar por user_id (ya es PK, pero explícito)
CREATE INDEX IF NOT EXISTS idx_game_saves_user_id ON public.game_saves(user_id);

-- ╔══════════════════════════════════════════════════════════╗
-- ║ ROW LEVEL SECURITY (RLS)                                 ║
-- ║ Cada usuario solo puede leer/escribir SUS propios datos  ║
-- ╚══════════════════════════════════════════════════════════╝

-- Habilitar RLS en ambas tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_saves ENABLE ROW LEVEL SECURITY;

-- ── PROFILES ──

-- SELECT: un usuario puede leer su propio perfil
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- INSERT: un usuario puede crear su propio perfil
CREATE POLICY "Users can create own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- UPDATE: un usuario puede actualizar su propio perfil
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ── GAME_SAVES ──

-- SELECT: un usuario puede leer su propio save
CREATE POLICY "Users can read own save"
  ON public.game_saves
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: un usuario puede crear su propio save
CREATE POLICY "Users can create own save"
  ON public.game_saves
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: un usuario puede actualizar su propio save
CREATE POLICY "Users can update own save"
  ON public.game_saves
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- ¡Listo! Ahora configura los providers de OAuth:
-- Dashboard → Authentication → Providers → Google / GitHub
-- ============================================================
