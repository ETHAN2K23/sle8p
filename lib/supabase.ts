import { SupabaseClient } from "@supabase/supabase-js";
import { createClient as createBrowserClient } from "@/utils/supabase/client";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

// Cliente de Supabase con fallback seguro cuando no hay claves configuradas
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl !== "https://tu-proyecto.supabase.co" &&
  !supabaseUrl.includes("placeholder")
);

export const supabase: SupabaseClient = isSupabaseConfigured
  ? createBrowserClient()
  : (null as unknown as SupabaseClient);

// API Helpers para operaciones con Supabase y persistencia local
export async function syncProfileToSupabase(profile: {
  email: string;
  targetHours: number;
  wakeUpTime: string;
  idealBedtime: string;
  loginProvider: string;
}) {
  if (!isSupabaseConfigured) {
    try {
      localStorage.setItem("sle8p_profile", JSON.stringify(profile));
    } catch {}
    return { success: true, localOnly: true };
  }

  try {
    const { data, error } = await supabase
      .from("profiles")
      .upsert(
        {
          email: profile.email,
          target_hours: profile.targetHours,
          wake_up_time: profile.wakeUpTime,
          ideal_bedtime: profile.idealBedtime,
          login_provider: profile.loginProvider,
        },
        { onConflict: "email" }
      )
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.warn("Supabase Sync Fallback:", err);
    return { success: false, error: err };
  }
}

export async function syncWearableToSupabase(wearable: {
  deviceId: string;
  deviceName: string;
  brand: string;
  connected: boolean;
  battery: number;
  liveHrBpm?: number;
  liveHrvMs?: number;
  currentSleepStage?: string;
}) {
  if (!isSupabaseConfigured) {
    try {
      const stored = JSON.parse(localStorage.getItem("sle8p_wearables") || "{}");
      stored[wearable.deviceId] = wearable;
      localStorage.setItem("sle8p_wearables", JSON.stringify(stored));
    } catch {}
    return { success: true, localOnly: true };
  }

  try {
    const { data, error } = await supabase
      .from("wearable_connections")
      .upsert(
        {
          device_id: wearable.deviceId,
          device_name: wearable.deviceName,
          brand: wearable.brand,
          connected: wearable.connected,
          battery: wearable.battery,
          live_hr_bpm: wearable.liveHrBpm,
          live_hrv_ms: wearable.liveHrvMs,
          current_sleep_stage: wearable.currentSleepStage,
          last_sync: new Date().toISOString(),
        },
        { onConflict: "device_id" }
      )
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.warn("Supabase Wearable Sync Fallback:", err);
    return { success: false, error: err };
  }
}
