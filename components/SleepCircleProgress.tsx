"use client";

import React from "react";
import { motion } from "framer-motion";
import { hapticLight } from "@/lib/haptics";

interface SleepCircleProgressProps {
  score: number; // 0 to 100
  hours: number; // e.g. 7.8
  targetHours?: number; // default 8.0
  size?: number;
  strokeWidth?: number;
  onClick?: () => void;
}

export const SleepCircleProgress: React.FC<SleepCircleProgressProps> = ({
  score,
  hours,
  targetHours = 8.0,
  size = 180,
  strokeWidth = 18,
  onClick,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progressRatio = Math.min(hours / targetHours, 1.25);
  const strokeDashoffset = circumference - progressRatio * circumference;

  const hoursInt = Math.floor(hours);
  const minutes = Math.round((hours - hoursInt) * 60);

  // Dynamic Highlight Colors: Verde chillón (#00FF66), Naranja (#FF7700), Rojo (#FF3333)
  const getHighlightColor = () => {
    if (score >= 85 || hours >= targetHours) return "#00FF66";
    if (score >= 70 || hours >= targetHours * 0.8) return "#FF7700";
    return "#FF3333";
  };

  const highlightColor = getHighlightColor();

  const handleClick = () => {
    hapticLight();
    if (onClick) onClick();
  };

  return (
    <div
      onClick={handleClick}
      className="relative flex flex-col items-center justify-center select-none cursor-pointer group active:scale-[0.97] transition-transform"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <filter id="progressGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Única Pista de Fondo - Gris oscuro sutil */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Única Barra de Progreso Gorda y Contundente */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={highlightColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          strokeLinecap="round"
          fill="transparent"
          filter="url(#progressGlow)"
        />
      </svg>

      {/* Interior: Puntuación con amplio respiro tipográfico */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
        <div className="flex items-center justify-center gap-1">
          <span className="font-disruptive text-5xl font-black text-white tracking-tight leading-none">
            {score}
          </span>
          <span
            className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor] shrink-0"
            style={{ backgroundColor: highlightColor, color: highlightColor }}
          />
        </div>

        <span className="text-xs font-semibold text-white/90 font-mono mt-1">
          {hoursInt}h {minutes}m
        </span>

        <span className="text-[10px] text-white/50 font-mono uppercase tracking-wider mt-0.5">
          {Math.round((hours / targetHours) * 100)}% meta 8h
        </span>
      </div>
    </div>
  );
};
