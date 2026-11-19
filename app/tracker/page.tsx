"use client";

import React, { useState } from "react";
import { useSleepStore } from "@/lib/sleepStore";
import { Sle8pBlinkingLogo } from "@/components/Sle8pBlinkingLogo";
import { hapticSelection, hapticLight } from "@/lib/haptics";

export default function TrackerPage() {
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [selectedDayIndex, setSelectedDayIndex] = useState(6); // Default to 'Hoy'
  const { targetHours } = useSleepStore();

  const weeklyData = [
    { day: "Lun", hours: 8.2, rem: 5, score: 94, latency: 12, efficiency: 96, verdict: "👑 Noche legendaria · 8 horas clavadas" },
    { day: "Mar", hours: 7.9, rem: 5, score: 88, latency: 15, efficiency: 92, verdict: "👌 Muy sólido · Rozando la perfección" },
    { day: "Mié", hours: 8.1, rem: 5, score: 92, latency: 11, efficiency: 95, verdict: "🎯 Batería biológica al 100%" },
    { day: "Jue", hours: 6.8, rem: 4, score: 74, latency: 24, efficiency: 83, verdict: "⚠️ Déficit de 72m · Tu cuerpo pedirá siesta" },
    { day: "Vie", hours: 8.5, rem: 6, score: 96, latency: 9, efficiency: 98, verdict: "🔥 ¡Modo bestia! 6 fases REM completadas" },
    { day: "Sáb", hours: 8.0, rem: 5, score: 91, latency: 14, efficiency: 94, verdict: "✨ Equilibrio perfecto · Cero deuda" },
    { day: "Hoy", hours: 7.8, rem: 5, score: 89, latency: 14, efficiency: 94, verdict: "🚀 A 12m de tus 8h · Energía lista" },
  ];

  const selectedData = weeklyData[selectedDayIndex];
  const sleepDebtMin = Math.round((selectedData.hours - targetHours) * 60);

  const getBarColor = (hours: number) => {
    if (hours >= targetHours) return "#00FF66"; // Verde chillón
    if (hours >= targetHours * 0.9) return "#FF7700"; // Naranja
    return "#FF3333"; // Rojo
  };

  const handleSelectDay = (idx: number) => {
    hapticSelection();
    setSelectedDayIndex(idx);
  };

  const handleSwitchView = (mode: "week" | "month") => {
    hapticLight();
    setViewMode(mode);
  };

  return (
    <div className="px-5 pt-safe space-y-4 bg-black text-white min-h-screen pb-28">
      {/* Header */}
      <header className="flex items-center justify-between pt-2">
        <Sle8pBlinkingLogo width={90} height={36} />

        <div className="flex bg-neutral-900 p-1 rounded-2xl border border-white/10">
          <button
            onClick={() => handleSwitchView("week")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all squash-btn ${
              viewMode === "week"
                ? "bg-white text-black"
                : "text-white/50 hover:text-white"
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => handleSwitchView("month")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all squash-btn ${
              viewMode === "month"
                ? "bg-white text-black"
                : "text-white/50 hover:text-white"
            }`}
          >
            Mes
          </button>
        </div>
      </header>

      {/* Dynamic KPI Cards for Selected Night */}
      <section className="grid grid-cols-3 gap-2 text-center">
        <div className="bw-card rounded-2xl p-3">
          <span className="text-[10px] text-white/50 uppercase tracking-wider block font-mono">
            {selectedData.day} · Horas
          </span>
          <div className="font-disruptive text-2xl font-black text-white mt-0.5">
            {selectedData.hours}h
          </div>
          <span
            className="text-[10px] font-mono font-bold"
            style={{ color: getBarColor(selectedData.hours) }}
          >
            {sleepDebtMin >= 0 ? `+${sleepDebtMin}m vs meta` : `${sleepDebtMin}m deuda`}
          </span>
        </div>

        <div className="bw-card rounded-2xl p-3">
          <span className="text-[10px] text-white/50 uppercase tracking-wider block font-mono">
            Score
          </span>
          <div className="font-disruptive text-2xl font-black text-white mt-0.5">
            {selectedData.score}
          </div>
          <span className="text-[10px] text-[#00FF66] font-mono font-bold">
            {selectedData.efficiency}% Efic.
          </span>
        </div>

        <div className="bw-card rounded-2xl p-3">
          <span className="text-[10px] text-white/50 uppercase tracking-wider block font-mono">
            Fases REM
          </span>
          <div className="font-disruptive text-2xl font-black text-white mt-0.5">
            {selectedData.rem}
          </div>
          <span className="text-[10px] text-[#FF7700] font-mono font-bold">
            {selectedData.latency}m latencia
          </span>
        </div>
      </section>

      {/* Sle8p Night Verdict Pill */}
      <section className="bg-neutral-900 border border-white/15 rounded-2xl px-4 py-2.5 flex items-center justify-between">
        <span className="text-[11px] font-medium text-white/90">
          <span className="text-[#00FF66] font-bold font-mono mr-1.5">Sle8p:</span>
          {selectedData.verdict}
        </span>
        <span className="text-[10px] font-mono text-white/40">
          {selectedData.day}
        </span>
      </section>

      {/* 7-Day Interactive Histogram with Stagger and Squash */}
      <section className="bw-card rounded-3xl p-5 space-y-3">
        <div className="flex justify-between items-center text-xs font-mono text-white/50">
          <span>Toca una barra para inspeccionar</span>
          <span className="text-white/80 font-bold">Noche: {selectedData.day}</span>
        </div>

        <div className="flex items-end justify-between gap-2 pt-2">
          {weeklyData.map((d, i) => {
            const barColor = getBarColor(d.hours);
            const isSelected = selectedDayIndex === i;

            return (
              <div
                key={i}
                onClick={() => handleSelectDay(i)}
                className="flex-1 flex flex-col items-center gap-2 cursor-pointer squash-btn"
                style={{
                  transitionDelay: `${i * 30}ms`,
                }}
              >
                <span
                  className={`text-[10px] font-mono font-bold transition-all ${
                    isSelected ? "scale-110" : "opacity-80"
                  }`}
                  style={{ color: barColor }}
                >
                  {d.hours}h
                </span>

                <div
                  className={`w-full h-32 bg-neutral-900 rounded-2xl p-1 flex flex-col justify-end transition-all ${
                    isSelected
                      ? "border-2 border-white ring-2 ring-white/20 bg-neutral-800"
                      : "border border-white/5 hover:border-white/20"
                  }`}
                >
                  <div
                    className="w-full rounded-xl transition-all shadow-[0_0_8px_currentColor]"
                    style={{
                      height: `${Math.min((d.hours / 9.0) * 100, 100)}%`,
                      backgroundColor: barColor,
                      color: barColor,
                    }}
                  />
                </div>

                <span
                  className={`text-xs font-bold transition-colors ${
                    isSelected ? "text-white underline underline-offset-4" : "text-white/60"
                  }`}
                >
                  {d.day}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-around text-[10px] font-mono text-white/60">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00FF66]" /> &ge; 8h Óptimo
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF7700]" /> 7h - 8h Regular
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF3333]" /> &lt; 7h Déficit
          </span>
        </div>
      </section>

      {/* Monthly Constellation Map */}
      {viewMode === "month" && (
        <section className="bw-card rounded-3xl p-5 space-y-3">
          <span className="text-xs font-mono text-white/50 uppercase tracking-wider block">
            Constelación de consistencia (30 días)
          </span>
          <div className="grid grid-cols-7 gap-1.5 pt-1">
            {Array.from({ length: 28 }).map((_, i) => {
              const h = 7.0 + ((i * 13) % 20) / 10;
              const color = getBarColor(h);
              return (
                <div
                  key={i}
                  onClick={() => hapticLight()}
                  className="aspect-square rounded-lg flex items-center justify-center text-[9px] font-mono font-bold cursor-pointer squash-btn"
                  style={{
                    backgroundColor: `${color}25`,
                    color: color,
                    border: `1px solid ${color}60`,
                  }}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
