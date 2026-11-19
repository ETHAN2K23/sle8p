"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useSleepStore } from "@/lib/sleepStore";
import { hapticLight } from "@/lib/haptics";

export const DynamicIslandLiveActivity: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const { accumulatedHours, targetHours, wakeUpTime, sleepStatus } = useSleepStore();

  const totalMin = Math.round(accumulatedHours * 60);
  const hours = Math.floor(totalMin / 60);
  const minutes = totalMin % 60;
  const targetTotalMin = Math.round(targetHours * 60);

  const toggleExpand = () => {
    hapticLight();
    setExpanded(!expanded);
  };

  return (
    <div className="w-full flex flex-col items-center select-none pt-1">
      <div
        onClick={toggleExpand}
        style={{ transformOrigin: "top center" }}
        className={`bg-black border border-white/20 text-white transition-all duration-200 ease-out cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.9)] overflow-hidden squash-btn ${
          expanded
            ? "w-full max-w-sm rounded-[28px] p-4 border-white/30"
            : "w-[210px] h-10 rounded-full px-3.5 flex items-center justify-between hover:border-white/40"
        }`}
      >
        {!expanded ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 relative">
                <Image
                  src="/brand/mascot_white_closed.png"
                  alt="Sle8p Eye"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-disruptive text-xs font-bold text-white">
                Sle8p
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] shadow-[0_0_6px_#00FF66] animate-pulse" />
              <span className="text-white/90 font-bold">
                {hours}h {minutes}m
              </span>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-4 relative">
                  <Image
                    src="/brand/mascot_white_closed.png"
                    alt="Sle8p Sleeping"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="font-disruptive text-sm font-bold text-white block">
                    Garantía 8h Activa
                  </span>
                  <span className="text-[10px] font-mono text-white/50">
                    Fase: {sleepStatus === "asleep" ? "Sueño Profundo" : "Detectando inicio"}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-disruptive text-base font-black text-white block">
                  {hours}h {minutes}m
                </span>
                <span className="text-[10px] font-mono text-[#00FF66]">
                  +94% eficiencia
                </span>
              </div>
            </div>

            {/* Target 8h Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-white/60">
                <span>Progreso hacia 8h</span>
                <span>{Math.round((totalMin / targetTotalMin) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-[#00FF66] rounded-full transition-all shadow-[0_0_8px_#00FF66]"
                  style={{ width: `${Math.min((totalMin / targetTotalMin) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/50 font-mono pt-0.5">
              <span>Meta: {targetHours}h de descanso</span>
              <span>Despertar: {wakeUpTime}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
