"use client";

import React from "react";
import { computeRemPhases } from "@/lib/sleepStore";
import { hapticSelection } from "@/lib/haptics";

interface RemPhaseSliderProps {
  hours: number;
  onChange: (hours: number) => void;
}

export const RemPhaseSlider: React.FC<RemPhaseSliderProps> = ({
  hours,
  onChange,
}) => {
  const remPhases = computeRemPhases(hours);
  const reachableCount = remPhases.filter((p) => p.reachable).length;

  const handleSliderChange = (newVal: number) => {
    if (newVal !== hours) {
      hapticSelection();
      onChange(newVal);
    }
  };

  const isOptimal = hours >= 8.0;

  return (
    <div className="w-full space-y-4 select-none">
      {/* Slider Header */}
      <div className="flex items-baseline justify-between">
        <div>
          <span className="font-disruptive text-2xl font-black text-white">
            {hours.toFixed(1)} Horas
          </span>
          <span className="text-xs text-white/60 block mt-0.5">
            {hours === 8 ? "Objetivo ideal fisiológico (5 fases)" : "Meta personalizada"}
          </span>
        </div>

        <div className="text-right">
          <span
            className="font-disruptive text-2xl font-black block"
            style={{ color: isOptimal ? "#00FF66" : "#FF7700" }}
          >
            {reachableCount}
          </span>
          <span className="text-xs text-white/70 block">
            Fases REM alcanzables
          </span>
        </div>
      </div>

      {/* Interactive Range Input */}
      <div className="space-y-1.5">
        <input
          type="range"
          min="6.0"
          max="9.5"
          step="0.5"
          value={hours}
          onChange={(e) => handleSliderChange(Number(e.target.value))}
          className="w-full h-2.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#00FF66]"
        />

        <div className="flex justify-between text-[11px] font-mono text-white/40">
          <span>6.0h</span>
          <span className={hours === 8 ? "text-[#00FF66] font-bold" : ""}>
            8.0h (Ideal)
          </span>
          <span>9.5h</span>
        </div>
      </div>

      {/* Interactive REM Phase Visualizer Bars */}
      <div className="space-y-2 pt-1">
        <div className="grid grid-cols-6 gap-1.5">
          {remPhases.map((phase) => (
            <div
              key={phase.cycle}
              className={`h-12 rounded-xl flex flex-col items-center justify-center transition-all ${
                phase.reachable
                  ? isOptimal
                    ? "bg-[#00FF66] text-black font-bold shadow-[0_0_12px_rgba(0,255,102,0.3)]"
                    : "bg-white text-black font-bold shadow-md"
                  : "bg-neutral-900 border border-white/10 text-white/30"
              }`}
            >
              <span className="text-xs font-mono font-black">
                R{phase.cycle}
              </span>
              <span className="text-[9px] uppercase tracking-wider">
                {phase.reachable ? "Activa" : "—"}
              </span>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-white/60 text-center leading-relaxed">
          {reachableCount >= 5
            ? "Con 8h aseguras 5 ciclos completos, consolidando memoria y recuperación neurobiológica."
            : "Menos de 5 ciclos reduce la fase de consolidación REM matutina."}
        </p>
      </div>
    </div>
  );
};
