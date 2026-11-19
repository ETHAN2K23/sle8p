"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sle8pMascot } from "@/components/Sle8pMascot";
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
      text: `Asistente fisiológico de descanso. Análisis de ritmo circadiano y arquitectura ultradiana activo. Para abrir los ojos a las ${wakeUpTime} con tus 8.0 horas cubiertas, la hora prevista de descanso se sitúa a las ${idealBedtime}.`,
    },
  ]);

  const quickPrompts = [
    "Límite de cafeína según semivida",
    "Ventana de inicio de sueño",
    "Manejo de despertares nocturnos",
    "Arquitectura de fases REM",
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
      let reply = `Para sincronizar tu despertar a las ${wakeUpTime} con una latencia fisiológica normal, apaga pantallas 45 minutos antes de las ${idealBedtime}.`;

      const lower = queryText.toLowerCase();
      if (lower.includes("cafe") || lower.includes("café")) {
        reply = `La semivida de la cafeína en adultos sanos oscila entre 5 y 7 horas, bloqueando competitivamente los receptores de adenosina en el prosencéfalo basal. Para proteger el sueño profundo antes de las ${idealBedtime}, se aconseja cesar el consumo 10 horas antes.`;
      } else if (
        lower.includes("medianoche") ||
        lower.includes("desperté") ||
        lower.includes("desperte") ||
        lower.includes("desvelo")
      ) {
        reply =
          "Los microdespertares al finalizar cada ciclo ultradiano de 90 minutos forman parte de la arquitectura fisiológica normal. Mantén la estancia en oscuridad absoluta, evita activar la pantalla del teléfono y realiza respiraciones diafragmáticas lentas para mantener la activación parasimpática.";
      } else if (
        lower.includes("rem") ||
        lower.includes("fases") ||
        lower.includes("ciclos")
      ) {
        reply = `Las fases REM de mayor densidad neurofisiológica ocurren durante las últimas 3 horas del descanso. Una duración de ${targetHours} horas asegura entre 5 y 6 ciclos ultradianos completos, optimizando la consolidación sináptica y la regulación emocional.`;
      } else if (
        lower.includes("hora") ||
        lower.includes("cama") ||
        lower.includes("acuesto") ||
        lower.includes("dormir")
      ) {
        reply = `Para despertar a las ${wakeUpTime} con ${targetHours} horas efectivas y un intervalo de latencia de 15 minutos, el inicio del descanso debe programarse para las ${idealBedtime}.`;
      }

      setIsTyping(false);
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
    }, 400);
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
      {/* Encabezado */}
      <header className="pt-2 pb-1 border-b border-white/10 flex items-center justify-between">
        <div>
          <h1 className="font-disruptive text-2xl font-black text-white">
            Sle8p IA
          </h1>
          <p className="text-xs text-white/50">
            Neurociencia y ritmos circadianos
          </p>
        </div>
        <span className="text-[10px] font-mono text-[#00FF66] font-bold">
          En línea
        </span>
      </header>

      {/* Mascota Oficial Sle8p */}
      <div className="py-2 flex flex-col items-center justify-center">
        <Sle8pMascot size={115} autoBlink={true} showSpeech={false} />
      </div>

      {/* Hilo de Mensajes */}
      <div className="flex-1 space-y-2 overflow-y-auto max-h-[260px] pr-1 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-3xl px-4 py-3 text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "bg-neutral-900 border border-white/15 text-white/90"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-neutral-900 border border-white/10 rounded-2xl px-4 py-2.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-pulse" />
              <span className="text-[11px] font-mono text-white/60">
                Analizando parámetros fisiológicos...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Carrusel de Consultas Rápidas (Sin Emojis) */}
      <div className="pt-2">
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickPrompt(p)}
              className="whitespace-nowrap px-3.5 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-[11px] font-mono text-white/80 active:scale-95 transition-all shrink-0"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input de Consulta */}
        <form onSubmit={handleSend} className="relative mt-2">
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Consulta parámetros de descanso o ritmos circadianos..."
            className="w-full h-12 bg-neutral-900 border border-white/15 rounded-2xl px-4 pr-12 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
          />
          <button
            type="submit"
            disabled={!userQuery.trim()}
            className="absolute right-2 top-2 w-8 h-8 rounded-xl bg-white text-black font-bold flex items-center justify-center hover:bg-neutral-200 transition-colors disabled:opacity-30 disabled:hover:bg-white"
          >
            →
          </button>
        </form>
      </div>
    </div>
  );
}
