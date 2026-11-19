"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { hapticLight } from "@/lib/haptics";

interface ScoreBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  hours: number;
  targetHours: number;
}

export const ScoreBreakdownModal: React.FC<ScoreBreakdownModalProps> = ({
  isOpen,
  onClose,
  score,
  hours,
  targetHours,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center select-none">
        {/* Backdrop - Fast fade */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          onClick={() => {
            hapticLight();
            onClose();
          }}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Sheet Content - Origin Bottom & Fast Closing (Principle 11 & 18) */}
        <motion.div
          initial={{ y: "100%", opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{
            y: "100%",
            opacity: 0,
            transition: { duration: 0.12, ease: [0.7, 0, 0.84, 0] },
          }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 340,
          }}
          style={{ transformOrigin: "bottom center" }}
          className="relative w-full max-w-md bg-[#121214] border-t border-white/20 rounded-t-[32px] p-6 pb-safe space-y-4 shadow-[0_-12px_45px_rgba(0,0,0,0.95)] z-10"
        >
          {/* iOS Grabber Handle */}
          <div className="w-10 h-1 bg-white/25 rounded-full mx-auto" />

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-disruptive text-2xl font-black text-white block">
                Sle8p Score
              </span>
              <span className="text-xs font-mono text-white/50">
                Desglose algorítmico del descanso
              </span>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-disruptive text-3xl font-black text-white">
                {score}
              </span>
              <span className="text-xs text-white/40 font-mono">/100</span>
            </div>
          </div>

          {/* 3 Pillars - Staggered perception */}
          <div className="space-y-2.5">
            {/* Pillar 1: Proximidad a 8h */}
            <div className="bg-black/70 border border-white/10 rounded-2xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">
                  Proximidad a 8 horas
                </span>
                <span className="text-[11px] font-mono text-white/50">
                  {hours}h de {targetHours}h meta
                </span>
              </div>
              <span className="font-disruptive text-lg font-bold text-[#00FF66]">
                96%
              </span>
            </div>

            {/* Pillar 2: Latencia de Inicio */}
            <div className="bg-black/70 border border-white/10 rounded-2xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">
                  Latencia de inicio
                </span>
                <span className="text-[11px] font-mono text-white/50">
                  14 min hasta dormirte
                </span>
              </div>
              <span className="font-disruptive text-lg font-bold text-[#00FF66]">
                92%
              </span>
            </div>

            {/* Pillar 3: Fases REM & Ciclos */}
            <div className="bg-black/70 border border-white/10 rounded-2xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">
                  Arquitectura REM y Profundo
                </span>
                <span className="text-[11px] font-mono text-white/50">
                  5 ciclos de 90 min
                </span>
              </div>
              <span className="font-disruptive text-lg font-bold text-[#FF7700]">
                89%
              </span>
            </div>
          </div>

          {/* Action Close with Squash and Stretch (Principle 1) */}
          <button
            onClick={() => {
              hapticLight();
              onClose();
            }}
            className="w-full py-4 rounded-2xl bg-white text-black font-disruptive text-sm font-black squash-btn shadow-md"
          >
            Entendido
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
