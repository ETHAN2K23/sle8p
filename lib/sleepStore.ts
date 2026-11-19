import { create } from "zustand";
import { syncProfileToSupabase, syncWearableToSupabase } from "./supabase";

export interface RemPhaseInfo {
  cycle: number;
  timeRange: string;
  durationMin: number;
  remMin: number;
  reachable: boolean;
}

export interface WearableTelemetry {
  heartRate: number; // e.g. 52 bpm
  hrv: number; // e.g. 82 ms
  currentStage: "Profundo" | "REM" | "Ligero" | "Vigilia";
  skinTempDelta: string; // e.g. "-0.3°C"
  respirationRate: number; // e.g. 13 rpm
}

export interface WearableDevice {
  id: string;
  name: string;
  brand: string;
  connected: boolean;
  battery: number;
  lastSync: string;
  image: string;
  telemetry: WearableTelemetry;
}

// Cálculo de hora de acostarse para 8h exactas (con 15m de latencia fisiológica)
export function computeBedtime(wakeTime: string, targetHours: number): string {
  const [wH, wM] = wakeTime.split(":").map(Number);
  const wakeTotalMin = wH * 60 + wM;
  const sleepTotalMin = Math.round(targetHours * 60) + 15;
  let bedTotalMin = wakeTotalMin - sleepTotalMin;
  if (bedTotalMin < 0) bedTotalMin += 24 * 60;

  const bH = Math.floor(bedTotalMin / 60);
  const bM = bedTotalMin % 60;
  return `${bH.toString().padStart(2, "0")}:${bM.toString().padStart(2, "0")}`;
}

// Cálculo de hora de despertar garantizada desde la hora planeada de acostarse
export function computeWakeTimeFromBedtime(bedtime: string, targetHours: number): string {
  const [bH, bM] = bedtime.split(":").map(Number);
  const bedTotalMin = bH * 60 + bM;
  const sleepTotalMin = Math.round(targetHours * 60) + 15;
  const wakeTotalMin = (bedTotalMin + sleepTotalMin) % (24 * 60);

  const wH = Math.floor(wakeTotalMin / 60);
  const wM = wakeTotalMin % 60;
  return `${wH.toString().padStart(2, "0")}:${wM.toString().padStart(2, "0")}`;
}

// Recordatorio de 30 minutos antes de la hora de dormir
export function computeReminderTime(bedtime: string): string {
  const [bH, bM] = bedtime.split(":").map(Number);
  let remMin = bH * 60 + bM - 30;
  if (remMin < 0) remMin += 24 * 60;
  const rH = Math.floor(remMin / 60);
  const rM = remMin % 60;
  return `${rH.toString().padStart(2, "0")}:${rM.toString().padStart(2, "0")}`;
}

// Estimación científica de fases REM según estándares de la National Sleep Foundation (20-25% de sueño total en ciclos de 90m)
export function computeRemArchitecture(hours: number): {
  totalRemMinutes: number;
  remPercentage: number;
  cyclesCompleted: number;
  phases: RemPhaseInfo[];
} {
  const totalMin = Math.round(hours * 60);
  const cyclesCompleted = Math.max(1, Math.min(6, Math.floor(totalMin / 90)));
  const totalRemMinutes = Math.round(totalMin * 0.22);
  const remPercentage = 22;

  const phases: RemPhaseInfo[] = [];
  for (let c = 1; c <= 6; c++) {
    const cycleEndMin = c * 90;
    const reachable = cycleEndMin <= totalMin + 15;
    const startH = Math.floor(((c - 1) * 90) / 60);
    const startM = ((c - 1) * 90) % 60;
    const endH = Math.floor(cycleEndMin / 60);
    const endM = cycleEndMin % 60;

    const cycleRem = c <= 2 ? 12 : c <= 4 ? 24 : 32;

    phases.push({
      cycle: c,
      timeRange: `${startH}h${startM > 0 ? startM + "m" : ""} - ${endH}h${endM > 0 ? endM + "m" : ""}`,
      durationMin: 90,
      remMin: cycleRem,
      reachable,
    });
  }

  return { totalRemMinutes, remPercentage, cyclesCompleted, phases };
}

export function computeRemPhases(targetHours: number): RemPhaseInfo[] {
  return computeRemArchitecture(targetHours).phases;
}

interface SleepState {
  // Onboarding & Usuario
  isLoggedIn: boolean;
  userEmail: string;
  userName: string;
  loginProvider: "google" | "apple" | "email" | null;
  hasCompletedOnboarding: boolean;

  // Preferencias de descanso
  targetHours: number;
  wakeUpTime: string;
  idealBedtime: string;
  todayPlannedBedtime: string;
  reminderTime: string;
  isBedtimeReminderEnabled: boolean;
  isSleepFocusEnabled: boolean;

  // Tracking activo
  isTracking: boolean;
  sleepStatus: "idle" | "detecting" | "asleep" | "awake";
  todayScore: number;
  accumulatedHours: number;
  weeklyProgress: number;

  // Wearables & Integraciones del Sistema
  wearables: WearableDevice[];
  healthKitConnected: boolean;
  shortcutsAlarmConnected: boolean;

  // Acciones
  setTargetHours: (hours: number) => void;
  setWakeUpTime: (time: string) => void;
  setTodayPlannedBedtime: (time: string) => void;
  toggleBedtimeReminder: () => void;
  toggleSleepFocus: () => void;
  toggleHealthKit: () => void;
  toggleShortcutsAlarm: () => void;
  completeOnboarding: (provider: "google" | "apple" | "email", email?: string) => void;
  startNightTracking: () => void;
  simulateSleepDetected: () => void;
  stopNightTracking: () => void;
  toggleWearable: (id: string) => void;
  connectPrimaryDevice: (id: string) => void;
  disconnectAllWearables: () => void;
  triggerManualSync: (id: string) => void;
}

export const useSleepStore = create<SleepState>((set, get) => {
  const initialTarget = 8.0;
  const initialWake = "07:30";
  const initialBed = computeBedtime(initialWake, initialTarget);

  return {
    isLoggedIn: true,
    userEmail: "ethan@sle8p.app",
    userName: "Ethan",
    loginProvider: "apple",
    hasCompletedOnboarding: true,

    targetHours: initialTarget,
    wakeUpTime: initialWake,
    idealBedtime: initialBed,
    todayPlannedBedtime: initialBed,
    reminderTime: computeReminderTime(initialBed),
    isBedtimeReminderEnabled: true,
    isSleepFocusEnabled: true,

    isTracking: false,
    sleepStatus: "idle",
    todayScore: 92,
    accumulatedHours: 7.9,
    weeklyProgress: 96,

    healthKitConnected: true,
    shortcutsAlarmConnected: true,

    // Colección de dispositivos con fotos PNG de calidad
    wearables: [
      {
        id: "apple-watch",
        name: "Apple Watch Ultra 2",
        brand: "Apple",
        connected: true, // Por defecto 1 dispositivo conectado como solicitó el usuario
        battery: 86,
        lastSync: "Hace 1 min",
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80",
        telemetry: {
          heartRate: 52,
          hrv: 82,
          currentStage: "Profundo",
          skinTempDelta: "-0.3°C",
          respirationRate: 13,
        },
      },
      {
        id: "oura-ring",
        name: "Oura Ring Gen 3",
        brand: "Oura",
        connected: false,
        battery: 91,
        lastSync: "Hace 2 horas",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=80",
        telemetry: {
          heartRate: 51,
          hrv: 86,
          currentStage: "REM",
          skinTempDelta: "-0.4°C",
          respirationRate: 14,
        },
      },
      {
        id: "whoop-strap",
        name: "Whoop 4.0",
        brand: "Whoop",
        connected: false,
        battery: 68,
        lastSync: "Ayer",
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&auto=format&fit=crop&q=80",
        telemetry: {
          heartRate: 58,
          hrv: 71,
          currentStage: "Ligero",
          skinTempDelta: "0.0°C",
          respirationRate: 15,
        },
      },
      {
        id: "garmin-wearables",
        name: "Garmin Epix Pro",
        brand: "Garmin",
        connected: false,
        battery: 79,
        lastSync: "Hace 3 días",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
        telemetry: {
          heartRate: 55,
          hrv: 75,
          currentStage: "Ligero",
          skinTempDelta: "-0.1°C",
          respirationRate: 14,
        },
      },
    ],

    setTargetHours: (hours: number) => {
      const bedtime = computeBedtime(get().wakeUpTime, hours);
      set({
        targetHours: hours,
        idealBedtime: bedtime,
        todayPlannedBedtime: bedtime,
        reminderTime: computeReminderTime(bedtime),
      });
      syncProfileToSupabase({
        email: get().userEmail,
        targetHours: hours,
        wakeUpTime: get().wakeUpTime,
        idealBedtime: bedtime,
        loginProvider: get().loginProvider || "apple",
      });
    },

    setWakeUpTime: (time: string) => {
      const bedtime = computeBedtime(time, get().targetHours);
      set({
        wakeUpTime: time,
        idealBedtime: bedtime,
        todayPlannedBedtime: bedtime,
        reminderTime: computeReminderTime(bedtime),
      });
      syncProfileToSupabase({
        email: get().userEmail,
        targetHours: get().targetHours,
        wakeUpTime: time,
        idealBedtime: bedtime,
        loginProvider: get().loginProvider || "apple",
      });
    },

    setTodayPlannedBedtime: (time: string) => {
      const wake = computeWakeTimeFromBedtime(time, get().targetHours);
      const reminder = computeReminderTime(time);
      set({
        todayPlannedBedtime: time,
        wakeUpTime: wake,
        reminderTime: reminder,
      });
    },

    toggleBedtimeReminder: () => {
      set((s) => ({ isBedtimeReminderEnabled: !s.isBedtimeReminderEnabled }));
    },

    toggleSleepFocus: () => {
      set((s) => ({ isSleepFocusEnabled: !s.isSleepFocusEnabled }));
    },

    toggleHealthKit: () => {
      set((s) => ({ healthKitConnected: !s.healthKitConnected }));
    },

    toggleShortcutsAlarm: () => {
      set((s) => ({ shortcutsAlarmConnected: !s.shortcutsAlarmConnected }));
    },

    completeOnboarding: (provider, email) => {
      const userMail = email || "usuario@sle8p.app";
      set({
        isLoggedIn: true,
        loginProvider: provider,
        userEmail: userMail,
        hasCompletedOnboarding: true,
      });
      syncProfileToSupabase({
        email: userMail,
        targetHours: get().targetHours,
        wakeUpTime: get().wakeUpTime,
        idealBedtime: get().idealBedtime,
        loginProvider: provider,
      });
    },

    startNightTracking: () => {
      set({ isTracking: true, sleepStatus: "detecting" });
    },

    simulateSleepDetected: () => {
      set({ sleepStatus: "asleep" });
    },

    stopNightTracking: () => {
      set({ isTracking: false, sleepStatus: "idle" });
    },

    // Activar un dispositivo como primario conectado (exclusivo)
    connectPrimaryDevice: (id: string) => {
      const updated = get().wearables.map((w) => ({
        ...w,
        connected: w.id === id,
        lastSync: w.id === id ? "Ahora mismo" : w.lastSync,
      }));
      set({ wearables: updated });
    },

    disconnectAllWearables: () => {
      const updated = get().wearables.map((w) => ({
        ...w,
        connected: false,
      }));
      set({ wearables: updated });
    },

    toggleWearable: (id: string) => {
      const updated = get().wearables.map((w) => {
        if (w.id === id) {
          const nextConnected = !w.connected;
          const updatedDevice = {
            ...w,
            connected: nextConnected,
            lastSync: nextConnected ? "Ahora mismo" : w.lastSync,
          };
          syncWearableToSupabase({
            deviceId: updatedDevice.id,
            deviceName: updatedDevice.name,
            brand: updatedDevice.brand,
            connected: updatedDevice.connected,
            battery: updatedDevice.battery,
            liveHrBpm: updatedDevice.telemetry.heartRate,
            liveHrvMs: updatedDevice.telemetry.hrv,
            currentSleepStage: updatedDevice.telemetry.currentStage,
          });
          return updatedDevice;
        }
        return w;
      });
      set({ wearables: updated });
    },

    triggerManualSync: (id: string) => {
      set({
        wearables: get().wearables.map((w) =>
          w.id === id
            ? {
                ...w,
                lastSync: "Ahora mismo",
                telemetry: {
                  ...w.telemetry,
                  heartRate: 49 + Math.floor(Math.random() * 6),
                  hrv: 83 + Math.floor(Math.random() * 8),
                },
              }
            : w
        ),
      });
    },
  };
});
