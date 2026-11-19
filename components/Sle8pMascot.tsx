"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { hapticMedium } from "@/lib/haptics";

interface Sle8pMascotProps {
  status?: "idle" | "detecting" | "asleep" | "awake";
  size?: number;
  autoBlink?: boolean;
  showSpeech?: boolean;
  customQuote?: string;
  className?: string;
  compactSpeech?: boolean;
}

const SLE8P_CLINICAL_INSIGHTS = [
  "Meta de 8 horas: 5 ciclos ultradianos de 90 minutos.",
  "Ventana circadiana alineada con tu hora de despertar.",
  "La latencia normal de sueño oscila entre 10 y 20 minutos.",
  "El sueño REM consolida la memoria y la recuperación neuronal.",
  "El despertar en fase ligera previene la inercia del sueño.",
];

export const Sle8pMascot: React.FC<Sle8pMascotProps> = ({
  status = "idle",
  size = 120,
  autoBlink = true,
  showSpeech = true,
  customQuote,
  className = "",
  compactSpeech = false,
}) => {
  const [blinkStage, setBlinkStage] = useState<"open" | "half" | "closed">("open");
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isWobbling, setIsWobbling] = useState(false);

  // Parpadeo orgánico cada 3.6s: Abierto -> Medio -> Cerrado -> Medio -> Abierto
  useEffect(() => {
    if (!autoBlink || status === "asleep") return;

    const interval = setInterval(() => {
      setBlinkStage("half");
      setTimeout(() => {
        setBlinkStage("closed");
        setTimeout(() => {
          setBlinkStage("half");
          setTimeout(() => {
            setBlinkStage("open");
          }, 60);
        }, 110);
      }, 50);
    }, 3600);

    return () => clearInterval(interval);
  }, [autoBlink, status]);

  const handleTapMascot = () => {
    hapticMedium();
    setIsWobbling(true);
    setBlinkStage("half");

    setTimeout(() => {
      setBlinkStage("closed");
      setTimeout(() => {
        setBlinkStage("open");
        setIsWobbling(false);
      }, 140);
    }, 60);

    setQuoteIndex((prev) => (prev + 1) % SLE8P_CLINICAL_INSIGHTS.length);
  };

  // Activos oficiales transparentes de Sle8p
  let currentSrc = "/brand/sle8p_real_open.png";
  if (status === "asleep") {
    currentSrc = "/brand/sle8p_real_closed.png";
  } else if (status === "detecting") {
    currentSrc =
      blinkStage === "closed"
        ? "/brand/sle8p_real_closed.png"
        : "/brand/sle8p_real_half.png";
  } else {
    if (blinkStage === "half") currentSrc = "/brand/sle8p_real_half.png";
    else if (blinkStage === "closed") currentSrc = "/brand/sle8p_real_closed.png";
    else currentSrc = "/brand/sle8p_real_open.png";
  }

  const isAsleep = status === "asleep";
  const isDetecting = status === "detecting";

  let activeQuote = customQuote || SLE8P_CLINICAL_INSIGHTS[quoteIndex];
  if (isDetecting) {
    activeQuote = "Monitorización de latencia activa.";
  } else if (isAsleep) {
    activeQuote = "Registro de descanso activo. Despertador calibrado.";
  }

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
    >
      {/* Speech Bubble interactivo sobrio */}
      {showSpeech && (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeQuote}
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            onClick={handleTapMascot}
            className={`mb-2 relative cursor-pointer group ${
              compactSpeech ? "max-w-[160px]" : "w-full"
            }`}
          >
            <div className="bg-[#18181B] border border-white/20 text-white px-3 py-1.5 rounded-xl text-[11px] font-medium text-center shadow-[0_4px_16px_rgba(0,0,0,0.8)] leading-tight group-hover:border-white/40 transition-colors">
              <span className="text-[#00FF66] font-mono font-bold mr-1">
                Sle8p:
              </span>
              <span>{activeQuote}</span>
            </div>

            <div className="w-2 h-2 bg-[#18181B] border-r border-b border-white/20 rotate-45 mx-auto -mt-1" />
          </motion.div>
        </AnimatePresence>
      )}

      {/* Ojitos Oficiales Sle8p */}
      <motion.div
        animate={
          isWobbling
            ? {
                scale: [1, 1.12, 0.92, 1.04, 1],
                rotate: [0, -3, 3, -1, 0],
              }
            : {
                scale: isAsleep ? [1, 1.02, 1] : [1, 1.03, 1],
                y: isAsleep ? [0, 2, 0] : [0, -1, 0],
              }
        }
        transition={{
          duration: isWobbling ? 0.35 : isAsleep ? 4.2 : 3.0,
          repeat: isWobbling ? 0 : Infinity,
          ease: "easeInOut",
        }}
        className="relative cursor-pointer transition-transform active:scale-95 group flex items-center justify-center"
        onClick={handleTapMascot}
        style={{ width: size, height: Math.round(size * 0.65) }}
      >
        <Image
          src={currentSrc}
          alt="Sle8p"
          width={size}
          height={Math.round(size * 0.65)}
          priority
          className="w-full h-full object-contain filter drop-shadow-[0_4px_18px_rgba(255,255,255,0.25)] group-hover:scale-105 transition-transform"
        />
      </motion.div>
    </div>
  );
};
