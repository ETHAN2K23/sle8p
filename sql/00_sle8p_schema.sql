-- ========================================================
-- SLE8P SUPABASE DATABASE SCHEMA (PRODUCTION IDEMPOTENT)
-- ========================================================

-- 1. TABLA: PROFILES (Preferencias de Descanso y Perfil de Usuario)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    user_name TEXT DEFAULT 'Usuario Sle8p',
    login_provider TEXT DEFAULT 'apple', -- 'apple', 'google', 'email'
    target_hours NUMERIC(3, 1) DEFAULT 8.0, -- Meta habitual (ej. 8.0h)
    wake_up_time TEXT DEFAULT '07:30', -- Hora de despertar prevista
    ideal_bedtime TEXT DEFAULT '23:15', -- Hora recomendada calculada
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS en profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON public.profiles;
CREATE POLICY "Los usuarios pueden ver su propio perfil"
    ON public.profiles FOR SELECT
    USING (auth.uid() = user_id OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON public.profiles;
CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = user_id OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Permitir insercion de perfil" ON public.profiles;
CREATE POLICY "Permitir insercion de perfil"
    ON public.profiles FOR INSERT
    WITH CHECK (true);

-- 2. TABLA: SLEEP_SESSIONS (Registros Diarios de Sueño y Fases REM)
CREATE TABLE IF NOT EXISTS public.sleep_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    hours_slept NUMERIC(3, 1) NOT NULL, -- ej. 7.8
    target_hours NUMERIC(3, 1) DEFAULT 8.0,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    sleep_onset TEXT NOT NULL, -- ej. '23:35'
    wake_time TEXT NOT NULL, -- ej. '07:23'
    rem_phases_count INTEGER DEFAULT 5, -- Fases REM alcanzadas
    latency_minutes INTEGER DEFAULT 14, -- Tiempo hasta dormirse
    efficiency_percentage INTEGER DEFAULT 94,
    debt_minutes INTEGER DEFAULT -12, -- Deuda respecto a 8h
    deep_min INTEGER DEFAULT 105,
    rem_min INTEGER DEFAULT 110,
    light_min INTEGER DEFAULT 230,
    awake_min INTEGER DEFAULT 25,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sleep_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuarios acceden a sus sesiones de sueno" ON public.sleep_sessions;
CREATE POLICY "Usuarios acceden a sus sesiones de sueno"
    ON public.sleep_sessions FOR ALL
    USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- 3. TABLA: WEARABLE_CONNECTIONS (Dispositivos Conectados y Telemetria en Vivo)
CREATE TABLE IF NOT EXISTS public.wearable_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL, -- 'apple-watch', 'oura-ring', 'whoop-strap', etc.
    device_name TEXT NOT NULL,
    brand TEXT NOT NULL,
    connected BOOLEAN DEFAULT false,
    battery INTEGER DEFAULT 85,
    last_sync TIMESTAMPTZ DEFAULT NOW(),
    -- Telemetria biometrica en vivo
    live_hr_bpm INTEGER DEFAULT 56, -- Frecuencia cardiaca en reposo
    live_hrv_ms INTEGER DEFAULT 74, -- Variabilidad cardiaca (HRV)
    current_sleep_stage TEXT DEFAULT 'Profundo', -- 'Profundo', 'REM', 'Ligero', 'Vigilia'
    skin_temp_delta TEXT DEFAULT '-0.2°C',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, device_id)
);

ALTER TABLE public.wearable_connections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuarios gestionan sus wearables" ON public.wearable_connections;
CREATE POLICY "Usuarios gestionan sus wearables"
    ON public.wearable_connections FOR ALL
    USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- 4. TRIGGER: ACTUALIZACION AUTOMATICA DE updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_timestamp ON public.profiles;
CREATE TRIGGER update_profiles_timestamp
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

DROP TRIGGER IF EXISTS update_wearables_timestamp ON public.wearable_connections;
CREATE TRIGGER update_wearables_timestamp
BEFORE UPDATE ON public.wearable_connections
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
