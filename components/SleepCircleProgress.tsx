"use client";

import React from "react";
import { motion } from "framer-motion";
import { hapticLight } from "@/lib/haptics";

interface SleepCircleProgressProps {
  score: number; // 0 to 100
  hours: number; // e.g. 7.8
  targetHours?: number; // default 8.0
  weeklyProgress: number; // 0 to 100%
  size?: number;
  onClick?: () => void;
}

export const SleepCircleProgress: React.FC<SleepCircleProgressProps> = ({
  score,
  hours,
  targetHours = 8.0,
  weeklyProgress,
  size = 260,
  onClick,
}) => {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const dailyProgressRatio = Math.min(hours / targetHours, 1.25);
  const strokeDashoffset = circumference - (dailyProgressRatio * circumference);

  const innerRadius = radius - 16;
  const innerCircumference = 2 * Math.PI * innerRadius;
  const innerStrokeDashoffset =
    innerCircumference - (Math.min(weeklyProgress, 100) / 100) * innerCircumference;

  const hoursInt = Math.floor(hours);
  const minutes = Math.round((hours - hoursInt) * 60);

  // Dynamic Highlight Colors (Verde chillón, Naranja, Rojo)
  const getHighlightColor = () => {
    if (score >= 85 || hours >= targetHours) return "#00FF66"; // Verde chillón
    if (score >= 70 || hours >= targetHours * 0.8) return "#FF7700"; // Naranja
    return "#FF3333"; // Rojo
  };

  const highlightColor = getHighlightColor();

  const handleClick = () => {
    hapticLight();
    if (onClick) onClick();
  };

  return (
    <div
      onClick={handleClick}
      className="relative flex flex-col items-center justify-center select-none cursor-pointer group active:scale-[0.98] transition-transform"
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Track - Dark subtle gray */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Outer Ring - Dynamic Highlight Color (Verde chillón / Naranja / Rojo) */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={highlightColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          strokeLinecap="round"
          fill="transparent"
          filter="url(#glow)"
        />

        {/* Inner Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={innerRadius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={4}
          fill="transparent"
        />

        {/* Inner Ring - Subtle White Weekly Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={innerRadius}
          stroke="rgba(255, 255, 255, 0.6)"
          strokeWidth={4}
          strokeDasharray={innerCircumference}
          initial={{ strokeDashoffset: innerCircumference }}
          animate={{ strokeDashoffset: innerStrokeDashoffset }}
          transition={{ duration: 1.8, ease: "easeOut", delay: 0.2 }}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>

      {/* Center - Disruptive Typography & Highlight Accent */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="font-disruptive text-6xl font-black text-white tracking-tight group-hover:scale-105 transition-transform">
            {score}
          </span>
          <span
            className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]"
            style={{ backgroundColor: highlightColor, color: highlightColor }}
          />
        </div>

        <span className="text-sm font-semibold text-white/90 font-mono mt-0.5">
          {hoursInt}h {minutes}m
        </span>

        <span className="text-xs text-white/50 font-mono mt-0.5">
          {weeklyProgress}% semana
        </span>
      </div>
    </div>
  );
};
