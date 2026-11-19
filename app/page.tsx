"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sle8pMascot } from "@/components/Sle8pMascot";
import { SleepCircleProgress } from "@/components/SleepCircleProgress";
import { ScoreBreakdownModal } from "@/components/ScoreBreakdownModal";
import { DynamicIslandLiveActivity } from "@/components/DynamicIslandLiveActivity";
import { useSleepStore } from "@/lib/sleepStore";
import { hapticSuccess, hapticMedium, hapticLight } from "@/lib/haptics";
import { toast } from "sonner";

const QUICK_BEDTIMES = ["22:30", "23:00", "23:15", "23:30", "00:00"];

export default function HomePage() {
  const {
    sleepStatus,
    todayScore,
    accumulatedHours,
    targetHours,
    wakeUpTime,
    todayPlannedBedtime,
    reminderTime,
    isBedtimeReminderEnabled,
    isSleepFocusEnabled,
    setTodayPlannedBedtime,
    toggleBedtimeReminder,
    toggleSleepFocus,
    startNightTracking,
    stopNightTracking,
    simulateSleepDetected,
  } = useSleepStore();

  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);

  const handleStartNight = () => {
    hapticSuccess();
    startNightTracking();
    toast.success("Sesión de descanso iniciada.");
  };

  const handleSimulateSleep = () => {
    hapticMedium();
    simulateSleepDetected();
    toast.info("Inicio de sueño registrado.");
  };

  const handleStopNight = () => {
    hapticSuccess();
    stopNightTracking();
    toast.success("Sesión finalizada. Despertar en fase ligera.");
  };

  const handleCancelNight = () => {
    hapticLight();
    stopNightTracking();
  };

  const handleSelectBedtime = (time: string) => {
    hapticLight();
    setTodayPlannedBedtime(time);
    toast.success(`Hora prevista: ${time}. Despertador: ${wakeUpTime}`);
  };

  return (
    <div className="px-5 pt-safe space-y-4 bg-black text-white min-h-screen pb-28">
      {/* Encabezado */}
      <header className="flex items-center justify-between pt-2 pb-1 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-white/50">
            HOY · 19 NOVIEMBRE
          </span>
        </div>

        <Link
          href="/profile"
          className="text-xs font-mono text-white/60 hover:text-white transition-colors"
        >
          {todayPlannedBedtime} → {wakeUpTime}
        </Link>
      </header>

      {/* Dynamic Island / Live Activity durante el descanso */}
      {(sleepStatus === "detecting" || sleepStatus === "asleep") && (
        <DynamicIslandLiveActivity />
      )}

      {/* Hero Section: Barra de Progreso y Mascota Oficial Sle8p */}
      <section className="bw-card rounded-3xl p-4 flex items-center justify-between gap-3">
        {/* Lado Izquierdo: Barra Continua Ancha */}
        <div className="shrink-0">
          <SleepCircleProgress
            score={todayScore}
            hours={accumulatedHours}
            targetHours={targetHours}
            size={168}
            strokeWidth={18}
            onClick={() => setIsScoreModalOpen(true)}
          />
        </div>

        {/* Lado Derecho: Mascota Oficial Sle8p */}
        <div className="flex-1 flex flex-col items-center justify-center pl-1">
          <Sle8pMascot
            status={sleepStatus}
            size={110}
            autoBlink={true}
            showSpeech={true}
            compactSpeech={true}
          />
        </div>
      </section>

      {/* Programación diaria de descanso */}
      <section className="bw-card rounded-3xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-white/50 block uppercase tracking-wider font-mono">
            Hora prevista de descanso
          </span>
          <span className="text-[10px] text-[#00FF66] font-mono font-bold">
            Meta 8.0h
          </span>
        </div>

        {/* Hora y métricas calculadas */}
        <div className="flex items-baseline justify-between">
          <div className="font-disruptive text-5xl font-black text-white tracking-tight">
            {todayPlannedBedtime}
          </div>
          <div className="text-right">
            <span className="text-xs text-white/80 font-mono block">
              Despertador: <span className="text-[#00FF66] font-bold">{wakeUpTime}</span>
            </span>
            <span className="text-[10px] text-white/50 font-mono">
              5 fases REM calculadas
            </span>
          </div>
        </div>

        {/* Selector horario */}
        <div className="flex items-center justify-between gap-1.5 pt-1">
          {QUICK_BEDTIMES.map((time) => {
            const isSelected = todayPlannedBedtime === time;
            return (
              <button
                key={time}
                onClick={() => handleSelectBedtime(time)}
                className={`flex-1 h-9 rounded-xl text-xs font-mono font-bold transition-all active:scale-95 ${
                  isSelected
                    ? "bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {time}
              </button>
            );
          })}
        </div>

        {/* Ajustes de notificación y modo descanso */}
        <div className="pt-2 border-t border-white/10 space-y-2">
          {/* Recordatorio previo de 30 minutos */}
          <div
            onClick={() => {
              hapticLight();
              toggleBedtimeReminder();
              toast(
                isBedtimeReminderEnabled
                  ? "Recordatorio desactivado"
                  : `Recordatorio programado a las ${reminderTime}`
              );
            }}
            className="flex items-center justify-between text-xs cursor-pointer select-none py-1 group"
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isBedtimeReminderEnabled ? "bg-[#00FF66]" : "bg-white/20"
                }`}
              />
              <span className="text-white/80 group-hover:text-white transition-colors">
                Aviso 30 minutos antes ({reminderTime})
              </span>
            </div>
            <span className="font-mono text-[11px] text-white/50">
              {isBedtimeReminderEnabled ? "Activo" : "Pausa"}
            </span>
          </div>

          {/* Sincronización con Enfoque de Sueño iOS */}
          <div
            onClick={() => {
              hapticLight();
              toggleSleepFocus();
              toast(
                isSleepFocusEnabled
                  ? "Modo Descanso desactivado"
                  : "Modo Descanso programado a las " + reminderTime
              );
            }}
            className="flex items-center justify-between text-xs cursor-pointer select-none py-1 group"
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isSleepFocusEnabled ? "bg-[#00FF66]" : "bg-white/20"
                }`}
              />
              <span className="text-white/80 group-hover:text-white transition-colors">
                Descanso Programado iPhone
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#00FF66]">
              {isSleepFocusEnabled ? "Auto" : "Off"}
            </span>
          </div>
        </div>
      </section>

      {/* Control de sesión */}
      <section className="w-full">
        {sleepStatus === "idle" && (
          <button
            onClick={handleStartNight}
            className="w-full h-14 rounded-3xl bg-white text-black font-disruptive text-lg font-black hover:bg-neutral-200 squash-btn shadow-[0_4px_25px_rgba(255,255,255,0.18)] flex items-center justify-center gap-2"
          >
            <span>Iniciar descanso</span>
          </button>
        )}

        {sleepStatus === "detecting" && (
          <div className="bw-card-elevated rounded-3xl p-5 text-center space-y-3 border border-white/20">
            <div className="flex items-center justify-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00FF66] animate-ping" />
              <span className="font-disruptive text-base text-white">
                Monitorizando inicio de sueño...
              </span>
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleSimulateSleep}
                className="px-5 h-11 rounded-2xl bg-white text-black font-bold text-xs hover:bg-neutral-200 squash-btn"
              >
                Confirmar inicio
              </button>
              <button
                onClick={handleCancelNight}
                className="px-4 h-11 rounded-2xl bg-neutral-900 border border-white/20 text-white text-xs font-semibold squash-btn"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {sleepStatus === "asleep" && (
          <div className="bw-card-elevated rounded-3xl p-5 space-y-3 border border-white/20">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-white">
              <span className="flex items-center gap-1.5 text-[#00FF66]">
                <span className="w-2 h-2 rounded-full bg-[#00FF66] shadow-[0_0_8px_#00FF66]" />
                Monitorización activa · 8h en curso
              </span>
              <span>Despertador en fase ligera ({wakeUpTime})</span>
            </div>
            <button
              onClick={handleStopNight}
              className="w-full h-12 rounded-2xl bg-white text-black font-bold text-xs hover:bg-neutral-200 squash-btn flex items-center justify-center"
            >
              Finalizar descanso
            </button>
          </div>
        )}
      </section>

      {/* Métricas fisiológicas clave */}
      <section className="grid grid-cols-3 gap-2 text-center">
        <div
          onClick={() => {
            hapticLight();
            setIsScoreModalOpen(true);
          }}
          className="bw-card rounded-2xl p-3 cursor-pointer hover:border-white/25 squash-btn"
        >
          <span className="text-[10px] text-white/40 uppercase tracking-wider block font-mono">
            Latencia
          </span>
          <span className="font-disruptive text-xl font-bold text-white mt-0.5 block">
            14m
          </span>
          <span className="text-[9px] text-[#00FF66] font-mono font-semibold">
            Rango óptimo
          </span>
        </div>

        <div
          onClick={() => {
            hapticLight();
            setIsScoreModalOpen(true);
          }}
          className="bw-card rounded-2xl p-3 cursor-pointer hover:border-white/25 squash-btn"
        >
          <span className="text-[10px] text-white/40 uppercase tracking-wider block font-mono">
            Fases REM
          </span>
          <span className="font-disruptive text-xl font-bold text-white mt-0.5 block">
            5
          </span>
          <span className="text-[9px] text-[#FF7700] font-mono font-semibold">
            Arquitectura completa
          </span>
        </div>

        <div
          onClick={() => {
            hapticLight();
            setIsScoreModalOpen(true);
          }}
          className="bw-card rounded-2xl p-3 cursor-pointer hover:border-white/25 squash-btn"
        >
          <span className="text-[10px] text-white/40 uppercase tracking-wider block font-mono">
            Eficiencia
          </span>
          <span className="font-disruptive text-xl font-bold text-white mt-0.5 block">
            94%
          </span>
          <span className="text-[9px] text-[#00FF66] font-mono font-semibold">
            Consolidación alta
          </span>
        </div>
      </section>

      {/* Modal Desglose Sle8p Score */}
      <ScoreBreakdownModal
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
        score={todayScore}
        hours={accumulatedHours}
        targetHours={targetHours}
      />
    </div>
  );
}
