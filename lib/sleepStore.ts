import { create } from "zustand";
import { syncProfileToSupabase, syncWearableToSupabase } from "./supabase";

export interface RemPhaseInfo {
  cycle: number;
  timeRange: string;
  durationMin: number;
  reachable: boolean;
}

export interface WearableTelemetry {
  heartRate: number; // e.g. 54 bpm
  hrv: number; // e.g. 76 ms
  currentStage: "Profundo" | "REM" | "Ligero" | "Vigilia";
  skinTempDelta: string; // e.g. "-0.3°C"
  respirationRate: number; // e.g. 14 rpm
}

export interface WearableDevice {
  id: string;
  name: string;
  brand: string;
  connected: boolean;
  battery: number;
  lastSync: string;
  telemetry: WearableTelemetry;
}

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

export function computeRemPhases(targetHours: number): RemPhaseInfo[] {
  const totalMin = targetHours * 60;
  const maxCycles = 6;
  const phases: RemPhaseInfo[] = [];

  for (let c = 1; c <= maxCycles; c++) {
    const cycleEndMin = c * 90;
    const reachable = cycleEndMin <= totalMin + 15;
    const startH = Math.floor(((c - 1) * 90) / 60);
    const startM = ((c - 1) * 90) % 60;
    const endH = Math.floor(cycleEndMin / 60);
    const endM = cycleEndMin % 60;

    phases.push({
      cycle: c,
      timeRange: `${startH}h${startM > 0 ? startM + "m" : ""} - ${endH}h${endM > 0 ? endM + "m" : ""}`,
      durationMin: 90,
      reachable,
    });
  }
  return phases;
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

  // Tracking activo
  isTracking: boolean;
  sleepStatus: "idle" | "detecting" | "asleep" | "awake";
  todayScore: number;
  accumulatedHours: number;
  weeklyProgress: number;

  // Wearables Funcionales & Telemetría
  wearables: WearableDevice[];

  // Acciones
  setTargetHours: (hours: number) => void;
  setWakeUpTime: (time: string) => void;
  completeOnboarding: (provider: "google" | "apple" | "email", email?: string) => void;
  startNightTracking: () => void;
  simulateSleepDetected: () => void;
  stopNightTracking: () => void;
  toggleWearable: (id: string) => void;
  triggerManualSync: (id: string) => void;
}

export const useSleepStore = create<SleepState>((set, get) => {
  const initialTarget = 8.0;
  const initialWake = "07:30";

  return {
    isLoggedIn: true,
    userEmail: "ethan@sle8p.app",
    userName: "Ethan",
    loginProvider: "apple",
    hasCompletedOnboarding: true,

    targetHours: initialTarget,
    wakeUpTime: initialWake,
    idealBedtime: computeBedtime(initialWake, initialTarget),

    isTracking: false,
    sleepStatus: "idle",
    todayScore: 92,
    accumulatedHours: 7.9,
    weeklyProgress: 96,

    wearables: [
      {
        id: "apple-watch",
        name: "Apple Watch Ultra 2",
        brand: "Apple",
        connected: true,
        battery: 86,
        lastSync: "Hace 1 min",
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
        connected: true,
        battery: 91,
        lastSync: "Hace 5 min",
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
        lastSync: "Ayer 23:10",
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
        lastSync: "Hace 2 días",
        telemetry: {
          heartRate: 55,
          hrv: 75,
          currentStage: "Ligero",
          skinTempDelta: "-0.1°C",
          respirationRate: 14,
        },
      },
      {
        id: "xiaomi-bands",
        name: "Xiaomi Smart Band 8",
        brand: "Xiaomi",
        connected: false,
        battery: 55,
        lastSync: "Desconectado",
        telemetry: {
          heartRate: 60,
          hrv: 65,
          currentStage: "Vigilia",
          skinTempDelta: "0.0°C",
          respirationRate: 16,
        },
      },
      {
        id: "amazfit-zepp",
        name: "Amazfit Balance",
        brand: "Amazfit",
        connected: false,
        battery: 88,
        lastSync: "Desconectado",
        telemetry: {
          heartRate: 57,
          hrv: 72,
          currentStage: "Ligero",
          skinTempDelta: "-0.2°C",
          respirationRate: 14,
        },
      },
    ],

    setTargetHours: (hours: number) => {
      const bedtime = computeBedtime(get().wakeUpTime, hours);
      set({ targetHours: hours, idealBedtime: bedtime });
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
      set({ wakeUpTime: time, idealBedtime: bedtime });
      syncProfileToSupabase({
        email: get().userEmail,
        targetHours: get().targetHours,
        wakeUpTime: time,
        idealBedtime: bedtime,
        loginProvider: get().loginProvider || "apple",
      });
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

    toggleWearable: (id: string) => {
      const updated = get().wearables.map((w) => {
        if (w.id === id) {
          const nextConnected = !w.connected;
          const updatedDevice = {
            ...w,
            connected: nextConnected,
            lastSync: nextConnected ? "Ahora mismo" : w.lastSync,
            telemetry: nextConnected
              ? {
                  ...w.telemetry,
                  heartRate: 50 + Math.floor(Math.random() * 8),
                  hrv: 78 + Math.floor(Math.random() * 12),
                }
              : w.telemetry,
          };

          // Sincronización en segundo plano con Supabase
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
                  heartRate: 48 + Math.floor(Math.random() * 7),
                  hrv: 82 + Math.floor(Math.random() * 10),
                },
              }
            : w
        ),
      });
    },
  };
});
