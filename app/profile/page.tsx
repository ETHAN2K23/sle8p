"use client";

import React from "react";
import Link from "next/link";
import { useSleepStore } from "@/lib/sleepStore";
import { Sle8pBlinkingLogo } from "@/components/Sle8pBlinkingLogo";

export default function ProfilePage() {
  const { userEmail, targetHours, wakeUpTime, idealBedtime, loginProvider } = useSleepStore();

  return (
    <div className="px-5 pt-safe space-y-4 bg-black text-white min-h-screen pb-28">
      {/* Header */}
      <header className="pt-2 pb-1 border-b border-white/10 flex items-center justify-between">
        <div>
          <h1 className="font-disruptive text-2xl font-black text-white">
            Perfil
          </h1>
          <p className="text-xs text-white/50">
            Ajustes y sincronización de cuenta
          </p>
        </div>
        <span className="text-xs font-mono text-white/50">Sle8p Pro</span>
      </header>

      {/* User Info Card */}
      <section className="bw-card rounded-3xl p-5 space-y-1">
        <span className="text-[11px] font-mono text-white/50 block uppercase tracking-wider">
          Sesión activa ({loginProvider || "Apple ID"})
        </span>
        <h2 className="font-disruptive text-xl font-bold text-white">{userEmail}</h2>
        <span className="inline-flex items-center gap-1.5 text-xs text-[#00FF66] font-mono pt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66]" /> Sincronizado con Supabase
        </span>
      </section>

      {/* Sleep Goals Summary */}
      <section className="bw-card rounded-3xl p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="text-xs text-white/70">Meta de sueño óptimo</span>
          <span className="font-disruptive text-lg font-black text-[#00FF66]">{targetHours} Horas</span>
        </div>

        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="text-xs text-white/70">Hora habitual de despertar</span>
          <span className="font-mono font-bold text-white">{wakeUpTime}</span>
        </div>

        <div className="flex items-center justify-between pb-1">
          <span className="text-xs text-white/70">Hora ideal de acostarse</span>
          <span className="font-disruptive text-xl font-black text-white">{idealBedtime}</span>
        </div>
      </section>

      {/* Onboarding Adjustments Link */}
      <section>
        <Link
          href="/onboarding"
          className="w-full py-4 rounded-3xl bg-white text-black font-disruptive font-bold text-sm text-center block hover:bg-neutral-200 transition-colors shadow-[0_4px_20px_rgba(255,255,255,0.15)] active:scale-95"
        >
          Reajustar objetivo de horas y fases REM
        </Link>
      </section>
    </div>
  );
}
