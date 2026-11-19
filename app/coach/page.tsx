"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sle8pMascot } from "@/components/Sle8pMascot";
import { Sle8pBlinkingLogo } from "@/components/Sle8pBlinkingLogo";
import { useSleepStore } from "@/lib/sleepStore";
import { hapticMedium, hapticLight } from "@/lib/haptics";

export default function CoachPage() {
  const { targetHours, wakeUpTime, idealBedtime } = useSleepStore();
  const [userQuery, setUserQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<{ role: "ai" | "user"; text: string }[]>([
    {
      role: "ai",
      text: "¡Ey! Soy Sle8p. Mi única misión en esta vida es que hoy cumplas tus 8 horas. Tu hora mágica para irte a la cueva son las " + idealBedtime + ". ¿Cómo sientes tu cuerpo hoy?",
    },
  ]);

  const quickPrompts = [
    "☕ ¿Puedo tomar café ahora?",
    "🛌 ¿A qué hora a la cama?",
    "👀 Me desperté a medianoche",
    "🧠 ¿Por qué 5 fases REM?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const executeQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    hapticMedium();
    setMessages((prev) => [...prev, { role: "user", text: queryText }]);
    setIsTyping(true);

    setTimeout(() => {
      let reply = "Si quieres dormir como un lirón esta noche, suelta pantallas 45 minutos antes de tus " + idealBedtime + ". A las " + wakeUpTime + " te despertarás con la mente afilada.";
      
      const lower = queryText.toLowerCase();
      if (lower.includes("cafe") || lower.includes("café")) {
        reply = "¡Cuidado con la cafeína! Tiene 6 horas de vida media. Si te tomas uno ahora, a las " + idealBedtime + " tus receptores de adenosina van a estar hiperactivos. Mejor agua fresca o infusión sin teína.";
      } else if (lower.includes("medianoche") || lower.includes("desperté") || lower.includes("desperte") || lower.includes("desvelo")) {
        reply = "Cero agobios. Despertarse entre ciclos REM es normal en la biología humana. La regla de oro: no mires la pantalla, no enciendas luces y respira 4-7-8 en la oscuridad. Tu cuerpo volverá al sueño profundo.";
      } else if (lower.includes("rem") || lower.includes("fases") || lower.includes("ciclos")) {
        reply = "Las fases REM más largas ocurren en las últimas 3 horas de sueño. Con tus " + targetHours + " horas aseguras 5 ciclos completos, que es justo donde tu cerebro procesa emociones y consolida memoria.";
      } else if (lower.includes("hora") || lower.includes("cama") || lower.includes("acuesto") || lower.includes("dormir")) {
        reply = "Para abrir los ojos a las " + wakeUpTime + " con tus " + targetHours + " horas completadas, tu hora sagrada de acostarte son las " + idealBedtime + ". ¡Póntelo en el calendario!";
      }

      setIsTyping(false);
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
    }, 450);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    const q = userQuery;
    setUserQuery("");
    executeQuery(q);
  };

  const handleQuickPrompt = (prompt: string) => {
    hapticLight();
    executeQuery(prompt);
  };

  return (
    <div className="px-5 pt-safe space-y-3 bg-black text-white min-h-screen flex flex-col justify-between pb-28">
      {/* Header with Blinking Logo */}
      <header className="pt-2 flex items-center justify-between">
        <Sle8pBlinkingLogo width={95} height={38} />
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-white/10 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-[#00FF66] shadow-[0_0_8px_#00FF66] animate-pulse" />
          <span className="text-white/80">Sle8p Activo</span>
        </div>
      </header>

      {/* Central Blinking Mascot */}
      <div className="py-1 flex flex-col items-center justify-center">
        <Sle8pMascot size={130} autoBlink={true} showSpeech={false} />
      </div>

      {/* Messages Thread */}
      <div className="flex-1 space-y-2 overflow-y-auto max-h-[260px] pr-1 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-3xl px-4 py-3 text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-white text-black font-semibold shadow-md"
                  : "bg-neutral-900/90 text-white border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-neutral-900/90 border border-white/10 rounded-2xl px-4 py-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-bounce [animation-delay:0.3s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel without scrollbar & with Squash */}
      <div className="flex gap-2 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickPrompt(p)}
            className="flex-shrink-0 px-3.5 h-10 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/15 text-[11px] font-semibold text-white/90 squash-btn whitespace-nowrap flex items-center justify-center"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Bar with Squash Button */}
      <form onSubmit={handleSend} className="pt-1 flex gap-2">
        <input
          type="text"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          placeholder="Pregúntale a Sle8p sobre tu descanso..."
          className="flex-1 bg-neutral-900 border border-white/20 rounded-2xl px-4 h-12 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-white transition-colors"
        />
        <button
          type="submit"
          disabled={isTyping}
          className="px-5 h-12 rounded-2xl bg-white text-black font-bold text-xs hover:bg-neutral-200 squash-btn shadow-[0_2px_15px_rgba(255,255,255,0.2)] disabled:opacity-50 flex items-center justify-center"
        >
          Preguntar
        </button>
      </form>
    </div>
  );
}
