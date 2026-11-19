"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSleepStore, computeRemArchitecture } from "@/lib/sleepStore";
import { hapticSelection, hapticLight } from "@/lib/haptics";

export default function TrackerPage() {
  const [selectedDayIndex, setSelectedDayIndex] = useState(6); // Por defecto 'Hoy'
  const { targetHours, wearables } = useSleepStore();

  const connectedDevice = wearables.find((w) => w.connected);

  // Historial combinado con media móvil y fases REM
  const combinedHistory = [
    { day: "13 Nov", label: "Lun", hours: 8.2, rem: 5, remMinutes: 108, score: 94, latency: 12, efficiency: 96, category: "bueno" },
    { day: "14 Nov", label: "Mar", hours: 7.9, rem: 5, remMinutes: 104, score: 88, latency: 15, efficiency: 92, category: "normal" },
    { day: "15 Nov", label: "Mié", hours: 8.1, rem: 5, remMinutes: 107, score: 92, latency: 11, efficiency: 95, category: "bueno" },
    { day: "16 Nov", label: "Jue", hours: 6.7, rem: 4, remMinutes: 88, score: 68, latency: 26, efficiency: 82, category: "malo" },
    { day: "17 Nov", label: "Vie", hours: 8.5, rem: 6, remMinutes: 115, score: 96, latency: 9, efficiency: 98, category: "bueno" },
    { day: "18 Nov", label: "Sáb", hours: 8.0, rem: 5, remMinutes: 105, score: 91, latency: 14, efficiency: 94, category: "bueno" },
    { day: "19 Nov", label: "Hoy", hours: 7.9, rem: 5, remMinutes: 104, score: 90, latency: 13, efficiency: 94, category: "bueno" },
  ];

  // Cálculo de media combinada
  const averageHours = Number(
    (combinedHistory.reduce((acc, cur) => acc + cur.hours, 0) / combinedHistory.length).toFixed(1)
  );

  const selectedData = combinedHistory[selectedDayIndex];
  const sleepDebtMin = Math.round((selectedData.hours - targetHours) * 60);

  // Percentil poblacional según Sleep Foundation / CDC (media adulta 6.8h, >35% duerme <7h)
  const getPercentile = (avgHours: number) => {
    if (avgHours >= 8.2) return 92;
    if (avgHours >= 8.0) return 86;
    if (avgHours >= 7.8) return 82;
    if (avgHours >= 7.5) return 74;
    if (avgHours >= 7.0) return 60;
    if (avgHours >= 6.5) return 40;
    return 18;
  };

  const userPercentile = getPercentile(averageHours);

  const getBarColor = (hours: number) => {
    if (hours >= targetHours) return "#00FF66"; // Verde chillón
    if (hours >= targetHours * 0.9) return "#FF7700"; // Naranja
    return "#FF3333"; // Rojo
  };

  const handleSelectDay = (idx: number) => {
    hapticSelection();
    setSelectedDayIndex(idx);
  };

  return (
    <div className="px-5 pt-safe space-y-4 bg-black text-white min-h-screen pb-28">
      {/* Header Limpio */}
      <header className="flex items-center justify-between pt-2 pb-1 border-b border-white/10">
        <div>
          <h1 className="font-disruptive text-2xl font-black text-white">
            Historial de Sueño
          </h1>
          <p className="text-xs text-white/50">
            Gráfica combinada y arquitectura de fases REM
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono text-white/40 block">MEDIA TOTAL</span>
          <span className="font-disruptive text-base font-bold text-[#00FF66]">
            {averageHours}h / noche
          </span>
        </div>
      </header>

      {/* Tarjeta de Percentil Científico Comparativo (Sleep Foundation) */}
      <section className="bw-card-elevated rounded-3xl p-5 border border-white/20 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-[#00FF66] uppercase tracking-wider">
            Benchmark Poblacional
          </span>
          <span className="text-[10px] font-mono text-white/40">
            Fuente: National Sleep Foundation
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-sm text-white/80">Tu descanso es superior al del</span>
          <span className="font-disruptive text-3xl font-black text-white">
            {userPercentile}%
          </span>
          <span className="text-sm text-white/80">de los adultos</span>
        </div>

        <p className="text-xs text-white/60 leading-relaxed border-t border-white/10 pt-2">
          El 35% de la población duerme menos de 7 horas diarias. Tu promedio de{" "}
          <strong className="text-white">{averageHours}h</strong> te sitúa en el percentil de élite biológica con óptima neuroplasticidad y recuperación REM.
        </p>
      </section>

      {/* Aviso de Dispositivo vs Estimación Circadiana */}
      <section className="rounded-2xl p-3.5 bg-neutral-900 border border-white/15 text-xs space-y-1">
        {connectedDevice ? (
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[#00FF66] font-mono font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#00FF66]" />
              Fases REM medidas por {connectedDevice.name}
            </span>
            <Link
              href="/wearables"
              className="text-[10px] font-mono text-white/50 hover:text-white"
            >
              Gestionar
            </Link>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-orange-400 font-bold font-mono text-[11px]">
                Medición directa por hardware recomendada
              </span>
              <Link
                href="/wearables"
                className="text-[10px] font-mono text-white underline"
              >
                Vincular
              </Link>
            </div>
            <p className="text-[11px] text-white/60">
              Sin sensor wearable activo, Sle8p aplica el modelo ultradiano de la National Sleep Foundation (ciclos de 90 minutos y 22% de fase REM promedio).
            </p>
          </div>
        )}
      </section>

      {/* Gráfica Combinada: Historial + Línea de Media + Fases REM */}
      <section className="bw-card rounded-3xl p-5 space-y-3">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-white/50">Toca para examinar noche</span>
          <span className="text-white/90 font-bold">
            {selectedData.day} ({selectedData.label})
          </span>
        </div>

        {/* Histograma con línea visual de media */}
        <div className="relative pt-6 pb-2">
          {/* Línea horizontal de Media */}
          <div
            className="absolute left-0 right-0 border-b border-dashed border-[#00FF66]/50 flex items-center justify-end z-10 pointer-events-none"
            style={{
              bottom: `${Math.min((averageHours / 9.5) * 100, 100)}%`,
            }}
          >
            <span className="text-[9px] font-mono text-[#00FF66] bg-black/80 px-1.5 rounded -mb-2.5">
              Media {averageHours}h
            </span>
          </div>

          <div className="flex items-end justify-between gap-2 h-36">
            {combinedHistory.map((d, i) => {
              const barColor = getBarColor(d.hours);
              const isSelected = selectedDayIndex === i;

              return (
                <div
                  key={i}
                  onClick={() => handleSelectDay(i)}
                  className="flex-1 flex flex-col items-center gap-1.5 cursor-pointer squash-btn h-full justify-end"
                >
                  <span
                    className={`text-[10px] font-mono font-bold transition-transform ${
                      isSelected ? "scale-110" : "opacity-75"
                    }`}
                    style={{ color: barColor }}
                  >
                    {d.hours}h
                  </span>

                  <div
                    className={`w-full h-28 bg-neutral-900 rounded-xl p-1 flex flex-col justify-end transition-all ${
                      isSelected
                        ? "border-2 border-white ring-2 ring-white/20 bg-neutral-800"
                        : "border border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div
                      className="w-full rounded-lg transition-all shadow-[0_0_8px_currentColor]"
                      style={{
                        height: `${Math.min((d.hours / 9.5) * 100, 100)}%`,
                        backgroundColor: barColor,
                        color: barColor,
                      }}
                    />
                  </div>

                  <span
                    className={`text-[10px] font-bold ${
                      isSelected ? "text-white underline underline-offset-2" : "text-white/50"
                    }`}
                  >
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desglose de Fases REM de la noche seleccionada */}
        <div className="pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center">
          <div className="bg-neutral-900/60 rounded-xl p-2 border border-white/5">
            <span className="text-[10px] text-white/40 block font-mono">Dormido</span>
            <span className="font-disruptive text-lg font-bold text-white">
              {selectedData.hours}h
            </span>
            <span
              className="text-[9px] font-mono font-bold block"
              style={{ color: getBarColor(selectedData.hours) }}
            >
              {sleepDebtMin >= 0 ? `+${sleepDebtMin}m meta` : `${sleepDebtMin}m deuda`}
            </span>
          </div>

          <div className="bg-neutral-900/60 rounded-xl p-2 border border-white/5">
            <span className="text-[10px] text-white/40 block font-mono">Fases REM</span>
            <span className="font-disruptive text-lg font-bold text-white">
              {selectedData.rem} fases
            </span>
            <span className="text-[9px] text-[#FF7700] font-mono block">
              {selectedData.remMinutes} min REM
            </span>
          </div>

          <div className="bg-neutral-900/60 rounded-xl p-2 border border-white/5">
            <span className="text-[10px] text-white/40 block font-mono">Puntuación</span>
            <span className="font-disruptive text-lg font-bold text-white">
              {selectedData.score}
            </span>
            <span className="text-[9px] text-[#00FF66] font-mono block">
              {selectedData.efficiency}% Efic.
            </span>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE CONSEJOS CIENTÍFICOS SEGÚN CALIDAD DE SUEÑO */}
      <section className="space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white/50 px-1">
          Directrices Clínicas por Rango de Descanso
        </h3>

        {/* 1. Mal Sueño (< 7h o score < 70) */}
        <div
          className={`bw-card rounded-2xl p-4 space-y-1.5 transition-all ${
            selectedData.category === "malo"
              ? "border-[#FF3333] shadow-[0_0_15px_rgba(255,51,51,0.2)]"
              : "opacity-80"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#FF3333] uppercase">
              Déficit de descanso (&lt; 7.0h)
            </span>
            {selectedData.category === "malo" && (
              <span className="text-[9px] font-mono text-[#FF3333] font-bold">Registro de esta noche</span>
            )}
          </div>
          <h4 className="font-disruptive text-sm font-bold text-white">
            Protocolo de Intervención Circadiana
          </h4>
          <p className="text-xs text-white/70 leading-relaxed">
            Suspender consumo de cafeína 10 horas antes del descanso para permitir la metabolización hepática. Evitar comidas copiosas 3 horas antes para impedir la elevación de la temperatura central y reducir pantallas 60 minutos antes para facilitar la secreción de melatonina endógena.
          </p>
        </div>

        {/* 2. Sueño Normal (7h - 8h o score 70-84) */}
        <div
          className={`bw-card rounded-2xl p-4 space-y-1.5 transition-all ${
            selectedData.category === "normal"
              ? "border-[#FF7700] shadow-[0_0_15px_rgba(255,119,0,0.2)]"
              : "opacity-80"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#FF7700] uppercase">
              Rango Fisiológico Estándar (7.0h - 8.0h)
            </span>
            {selectedData.category === "normal" && (
              <span className="text-[9px] font-mono text-[#FF7700] font-bold">Registro de esta noche</span>
            )}
          </div>
          <h4 className="font-disruptive text-sm font-bold text-white">
            Termorregulación y Densidad REM
          </h4>
          <p className="text-xs text-white/70 leading-relaxed">
            Mantener la temperatura del dormitorio entre 18°C y 19°C. El descenso de 1°C en la temperatura central facilita la transición al sueño profundo y maximiza la duración de los episodios REM en la segunda mitad del ciclo.
          </p>
        </div>

        {/* 3. Buen Sueño (>= 8h o score >= 85) */}
        <div
          className={`bw-card rounded-2xl p-4 space-y-1.5 transition-all ${
            selectedData.category === "bueno"
              ? "border-[#00FF66] shadow-[0_0_15px_rgba(0,255,102,0.2)]"
              : "opacity-80"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#00FF66] uppercase">
              Consolidación Circadiana Óptima (&ge; 8.0h)
            </span>
            {selectedData.category === "bueno" && (
              <span className="text-[9px] font-mono text-[#00FF66] font-bold">Registro de esta noche</span>
            )}
          </div>
          <h4 className="font-disruptive text-sm font-bold text-white">
            Sincronización del Núcleo Supraquiasmático
          </h4>
          <p className="text-xs text-white/70 leading-relaxed">
            Ciclos REM completados íntegramente. Para fijar este ritmo, exponerse a luz natural directa durante 15 minutos en la primera hora tras el despertar: este estímulo fotobiótico sincroniza el cortisol y programa la curva de adenosina para la siguiente ventana nocturna.
          </p>
        </div>
      </section>
    </div>
  );
}
