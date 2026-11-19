"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sle8pMascot } from "@/components/Sle8pMascot";
import { Sle8pBlinkingLogo } from "@/components/Sle8pBlinkingLogo";
import { SleepCircleProgress } from "@/components/SleepCircleProgress";
import { ScoreBreakdownModal } from "@/components/ScoreBreakdownModal";
import { DynamicIslandLiveActivity } from "@/components/DynamicIslandLiveActivity";
import { useSleepStore } from "@/lib/sleepStore";
import { hapticSuccess, hapticMedium, hapticLight } from "@/lib/haptics";
import { toast } from "sonner";

export default function HomePage() {
  const {
    sleepStatus,
    todayScore,
    accumulatedHours,
    weeklyProgress,
    targetHours,
    wakeUpTime,
    idealBedtime,
    startNightTracking,
    stopNightTracking,
    simulateSleepDetected,
  } = useSleepStore();

  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);

  const handleStartNight = () => {
    hapticSuccess();
    startNightTracking();
    toast.success("¡A dormir! Sle8p vigila tu descanso.");
  };

  const handleSimulateSleep = () => {
    hapticMedium();
    simulateSleepDetected();
    toast.info("¡Te has dormido! Calculando 8 horas efectivas.");
  };

  const handleStopNight = () => {
    hapticSuccess();
    stopNightTracking();
    toast.success("¡Buenos días! 8 horas de energía listas.");
  };

  const handleCancelNight = () => {
    hapticLight();
    stopNightTracking();
  };

  return (
    <div className="px-5 pt-safe space-y-4 bg-black text-white min-h-screen pb-28">
      {/* Top Header - Blinking Sle8p Brand Logo */}
      <header className="flex items-center justify-between pt-2">
        <Link href="/onboarding" className="flex items-center group">
          <Sle8pBlinkingLogo width={105} height={42} />
        </Link>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-white/10 text-xs font-mono font-semibold text-white/80">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] shadow-[0_0_8px_#00FF66]" />
          Modo Noche
        </div>
      </header>

      {/* Dynamic Island / Live Activity Simulation on Active Tracking */}
      {(sleepStatus === "detecting" || sleepStatus === "asleep") && (
        <DynamicIslandLiveActivity />
      )}

      {/* Hero Circular Progress & Sle8p Living Mascot */}
      <section className="relative flex flex-col items-center justify-center py-1">
        <SleepCircleProgress
          score={todayScore}
          hours={accumulatedHours}
          targetHours={targetHours}
          weeklyProgress={weeklyProgress}
          size={255}
          onClick={() => setIsScoreModalOpen(true)}
        />

        <div className="mt-2 w-full">
          <Sle8pMascot status={sleepStatus} size={145} autoBlink={true} showSpeech={true} />
        </div>
      </section>

      {/* Bedtime Destination Card with Personality */}
      <section className="bw-card rounded-3xl p-5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-white/50 block uppercase tracking-wider font-mono">
            Tu cita con la almohada
          </span>
          <span className="text-[10px] text-[#00FF66] font-mono font-bold">
            Garantía 8h
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="font-disruptive text-5xl font-black text-white tracking-tight">
            {idealBedtime}
          </div>
          <span className="text-xs text-white/80 font-mono">
            Meta: <span className="text-[#00FF66] font-bold">{targetHours}h</span> ({Math.floor((targetHours * 60) / 90)} fases REM)
          </span>
        </div>

        <p className="text-xs text-white/70 leading-relaxed pt-1.5 border-t border-white/10">
          Para abrir los ojos a las {wakeUpTime} como nuevo, métete a la cueva a las {idealBedtime}.
        </p>
      </section>

      {/* Sleep Night Action Button with UX Motion Squash & Stretch */}
      <section className="w-full">
        {sleepStatus === "idle" && (
          <button
            onClick={handleStartNight}
            className="w-full h-14 rounded-3xl bg-white text-black font-disruptive text-lg font-black hover:bg-neutral-200 squash-btn shadow-[0_4px_25px_rgba(255,255,255,0.18)] flex items-center justify-center gap-2"
          >
            <span>Iniciar noche Sle8p</span>
          </button>
        )}

        {sleepStatus === "detecting" && (
          <div className="bw-card-elevated rounded-3xl p-5 text-center space-y-3 border border-white/20">
            <div className="flex items-center justify-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00FF66] animate-ping" />
              <span className="font-disruptive text-base text-white">
                Detectando cuándo te duermas...
              </span>
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleSimulateSleep}
                className="px-5 h-11 rounded-2xl bg-white text-black font-bold text-xs hover:bg-neutral-200 squash-btn"
              >
                Ya me he dormido
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
                Sueño blindado · 8h en curso
              </span>
              <span>Despertar en fase ligera ({wakeUpTime})</span>
            </div>
            <button
              onClick={handleStopNight}
              className="w-full h-12 rounded-2xl bg-white text-black font-bold text-xs hover:bg-neutral-200 squash-btn flex items-center justify-center"
            >
              He despertado
            </button>
          </div>
        )}
      </section>

      {/* Metrics Row - Touch Targets >= 44pt */}
      <section className="grid grid-cols-3 gap-2 text-center">
        <div
          onClick={() => {
            hapticLight();
            setIsScoreModalOpen(true);
          }}
          className="bw-card rounded-2xl p-3 cursor-pointer hover:border-white/25 squash-btn"
        >
          <span className="text-[10px] text-white/40 uppercase tracking-wider block font-mono">Latencia</span>
          <span className="font-disruptive text-xl font-bold text-white mt-0.5 block">14m</span>
          <span className="text-[9px] text-[#00FF66] font-mono font-semibold">Como un lirón</span>
        </div>

        <div
          onClick={() => {
            hapticLight();
            setIsScoreModalOpen(true);
          }}
          className="bw-card rounded-2xl p-3 cursor-pointer hover:border-white/25 squash-btn"
        >
          <span className="text-[10px] text-white/40 uppercase tracking-wider block font-mono">Fases REM</span>
          <span className="font-disruptive text-xl font-bold text-white mt-0.5 block">5</span>
          <span className="text-[9px] text-[#FF7700] font-mono font-semibold">Mente limpia</span>
        </div>

        <div
          onClick={() => {
            hapticLight();
            setIsScoreModalOpen(true);
          }}
          className="bw-card rounded-2xl p-3 cursor-pointer hover:border-white/25 squash-btn"
        >
          <span className="text-[10px] text-white/40 uppercase tracking-wider block font-mono">Eficiencia</span>
          <span className="font-disruptive text-xl font-bold text-white mt-0.5 block">94%</span>
          <span className="text-[9px] text-[#00FF66] font-mono font-semibold">Modo bestia</span>
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
