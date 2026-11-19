"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { hapticMedium, hapticSelection } from "@/lib/haptics";

interface Sle8pMascotProps {
  status?: "idle" | "detecting" | "asleep" | "awake";
  size?: number;
  autoBlink?: boolean;
  showSpeech?: boolean;
  customQuote?: string;
}

const SLE8P_QUOTES = [
  "8 horas o barbarie. Esta noche no se negocia.",
  "Tus fases REM valen oro. Yo te las protejo.",
  "A las 23:15 a la cueva. Ni se te ocurra abrir redes.",
  "Tu cerebro se repara mientras duermes. Déjame hacer mi magia.",
  "Toca mis ojitos si necesitas un empujón de energía.",
  "Dormir 8 horas es el verdadero superpoder de los humanos.",
];

export const Sle8pMascot: React.FC<Sle8pMascotProps> = ({
  status = "idle",
  size = 145,
  autoBlink = true,
  showSpeech = true,
  customQuote,
}) => {
  const [blinkStage, setBlinkStage] = useState<"open" | "half" | "closed">("open");
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isWobbling, setIsWobbling] = useState(false);

  // Playful organic blink every 3.6s: Open -> Half -> Closed -> Half -> Open
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
        }, 120);
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

    // Cycle quote
    setQuoteIndex((prev) => (prev + 1) % SLE8P_QUOTES.length);
  };

  // Determine which asset to display
  let currentSrc = "/brand/mascot_white_open.png";
  if (status === "asleep") {
    currentSrc = "/brand/mascot_white_closed.png";
  } else if (status === "detecting") {
    currentSrc = blinkStage === "closed" ? "/brand/mascot_white_closed.png" : "/brand/mascot_white_half.png";
  } else {
    if (blinkStage === "half") currentSrc = "/brand/mascot_white_half.png";
    else if (blinkStage === "closed") currentSrc = "/brand/mascot_white_closed.png";
    else currentSrc = "/brand/mascot_white_open.png";
  }

  const isAsleep = status === "asleep";
  const isDetecting = status === "detecting";

  // Select speech bubble text
  let activeQuote = customQuote || SLE8P_QUOTES[quoteIndex];
  if (isDetecting) {
    activeQuote = "Shhh... Respira despacio. Estoy atento para detectar tu inicio de sueño.";
  } else if (isAsleep) {
    activeQuote = "Zzz... 8 horas en marcha. Te despertaré en tu fase más ligera.";
  }

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-1 w-full max-w-xs mx-auto">
      {/* Speech Bubble with Arrow */}
      {showSpeech && (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeQuote}
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={handleTapMascot}
            className="mb-2 relative cursor-pointer group"
          >
            <div className="bg-[#18181B] border border-white/20 text-white px-4 py-2 rounded-2xl text-xs font-medium text-center shadow-[0_4px_20px_rgba(0,0,0,0.8)] leading-snug group-hover:border-white/40 transition-colors">
              <span className="text-[#00FF66] font-bold mr-1.5 font-mono">
                Sle8p:
              </span>
              <span>{activeQuote}</span>
            </div>

            {/* Bubble Tail */}
            <div className="w-2.5 h-2.5 bg-[#18181B] border-r border-b border-white/20 rotate-45 mx-auto -mt-1.5" />
          </motion.div>
        </AnimatePresence>
      )}

      {/* Floating ZZZ Particles when Sleeping or Detecting */}
      {(isAsleep || isDetecting) && (
        <div className="absolute -top-4 right-10 pointer-events-none flex flex-col items-center">
          <motion.span
            animate={{ y: [-5, -28], opacity: [0, 1, 0], scale: [0.7, 1.2] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
            className="font-disruptive text-xs text-[#00FF66] font-bold"
          >
            z
          </motion.span>
          <motion.span
            animate={{ y: [-2, -22], opacity: [0, 0.8, 0], scale: [0.6, 1.0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.8, ease: "easeOut" }}
            className="font-disruptive text-sm text-white font-bold"
          >
            Z
          </motion.span>
        </div>
      )}

      {/* Mascot Eyes with Squash & Stretch Wobble */}
      <motion.div
        animate={
          isWobbling
            ? {
                scale: [1, 1.15, 0.9, 1.05, 1],
                rotate: [0, -3, 3, -1, 0],
              }
            : {
                scale: isAsleep ? [1, 1.025, 1] : [1, 1.03, 1],
                y: isAsleep ? [0, 2, 0] : [0, -1, 0],
              }
        }
        transition={{
          duration: isWobbling ? 0.35 : isAsleep ? 4.2 : 3.0,
          repeat: isWobbling ? 0 : Infinity,
          ease: "easeInOut",
        }}
        className="relative cursor-pointer transition-transform active:scale-95 group"
        onClick={handleTapMascot}
        style={{ width: size, height: Math.round(size * 0.72) }}
      >
        <Image
          src={currentSrc}
          alt="Sle8p Mascot Eyes"
          width={size}
          height={Math.round(size * 0.72)}
          priority
          className="w-full h-full object-contain filter drop-shadow-[0_6px_22px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform"
        />
      </motion.div>
    </div>
  );
};
