"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { RemPhaseSlider } from "@/components/RemPhaseSlider";
import { useSleepStore, computeBedtime } from "@/lib/sleepStore";
import { hapticSuccess, hapticMedium, hapticLight, hapticSelection } from "@/lib/haptics";
import { toast } from "sonner";

export default function OnboardingPage() {
  const router = useRouter();
  const { targetHours, setTargetHours, wakeUpTime, setWakeUpTime, completeOnboarding } =
    useSleepStore();

  const [step, setStep] = useState<"auth" | "hours">("auth");
  const [emailInput, setEmailInput] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);

  const calculatedBedtime = computeBedtime(wakeUpTime, targetHours);

  const handleProviderLogin = (provider: "apple" | "google") => {
    hapticSuccess();
    completeOnboarding(provider, `${provider}-user@sle8p.app`);
    toast.success(`Sesión iniciada con ${provider === "apple" ? "Apple" : "Google"}`);
    setStep("hours");
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    hapticSuccess();
    completeOnboarding("email", emailInput);
    toast.success("Bienvenido a Sle8p");
    setStep("hours");
  };

  const handleFinish = () => {
    hapticSuccess();
    toast.success("Tu descanso ideal está configurado");
    router.push("/");
  };

  return (
    <div className="min-h-screen px-6 pt-safe pb-10 flex flex-col justify-between max-w-md mx-auto bg-black text-white">
      {/* Top Brand Logo */}
      <div className="pt-6 text-center space-y-2">
        <div className="flex justify-center">
          <Image
            src="/mascot/sle8p_logo_white.png"
            alt="Sle8p Logo"
            width={180}
            height={80}
            className="object-contain"
            priority
          />
        </div>
        <p className="text-xs text-white/60">
          Tu compañero para alcanzar tus 8 horas de descanso
        </p>
      </div>

      {/* STEP 1: AUTHENTICATION */}
      {step === "auth" && (
        <div className="space-y-6 my-auto">
          <div className="text-center space-y-1">
            <h1 className="font-disruptive text-2xl font-black text-white">
              Entra a tu descanso
            </h1>
            <p className="text-xs text-white/60">
              Guarda tus ciclos y sincroniza tus dispositivos
            </p>
          </div>

          <div className="space-y-3">
            {/* Apple Login */}
            <button
              onClick={() => handleProviderLogin("apple")}
              className="w-full py-3.5 px-4 rounded-2xl bg-white text-black font-bold text-sm flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors active:scale-95 shadow-md"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.69-7.85-11.96-14.43-5.77-8.91-10.28-19.14-13.54-30.68-3.26-11.55-4.89-22.39-4.89-32.53 0-14.36 3.65-26.04 10.96-35.04 7.31-9 16.36-13.57 27.15-13.72 4.35 0 9.29 1.15 14.83 3.44 5.54 2.29 9.38 3.51 11.53 3.66 1.96-.15 6.01-1.48 12.14-3.99 6.13-2.5 11.47-3.6 16.03-3.3 11.97.87 21.64 5.37 29.01 13.5-10.45 6.32-15.6 15.01-15.45 26.08.15 8.7 3.48 16.01 9.99 21.94 6.51 5.92 14.28 9.32 23.3 10.19-2.39 7.4-5.29 14.92-8.71 22.56zM119.22 31.84c0-7.18 2.61-13.9 7.83-20.17 5.23-6.26 11.75-10.28 19.57-12.05.22 1.3.33 2.5.33 3.59 0 7.18-2.67 14-8.01 20.47-5.33 6.46-11.83 10.36-19.49 11.7-.1-.97-.23-2.15-.23-3.54z"/>
              </svg>
              Continuar con Apple
            </button>

            {/* Google Login */}
            <button
              onClick={() => handleProviderLogin("google")}
              className="w-full py-3.5 px-4 rounded-2xl bg-neutral-900 border border-white/20 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"/>
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
              </svg>
              Continuar con Google
            </button>

            {/* Email Form Toggle */}
            {!showEmailInput ? (
              <button
                onClick={() => {
                  hapticLight();
                  setShowEmailInput(true);
                }}
                className="w-full py-3 text-xs text-white/70 hover:text-white transition-colors"
              >
                O usar correo electrónico
              </button>
            ) : (
              <form onSubmit={handleEmailLogin} className="space-y-2 pt-1">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full bg-neutral-900 border border-white/20 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-white text-black font-bold text-xs active:scale-95"
                >
                  Continuar
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* STEP 2: SLEEP PREFERENCES & REM PHASES */}
      {step === "hours" && (
        <div className="space-y-6 my-auto">
          <div className="text-center space-y-1">
            <h2 className="font-disruptive text-2xl font-black text-white">
              Tu objetivo de descanso
            </h2>
            <p className="text-xs text-white/60">
              Ajusta tus horas para maximizar tus fases REM
            </p>
          </div>

          {/* Wake-up time picker */}
          <div className="bg-neutral-900 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-white block">
                ¿A qué hora te despiertas?
              </span>
              <span className="text-[11px] text-white/50">
                Calcularemos tu hora ideal para dormir
              </span>
            </div>

            <input
              type="time"
              value={wakeUpTime}
              onChange={(e) => {
                hapticSelection();
                setWakeUpTime(e.target.value);
              }}
              className="bg-black border border-white/20 rounded-xl px-3 py-1.5 text-white font-mono font-bold text-sm focus:outline-none"
            />
          </div>

          {/* Interactive Hours Slider with Reachable REM Phases */}
          <div className="bg-neutral-900 border border-white/10 rounded-3xl p-5">
            <RemPhaseSlider
              hours={targetHours}
              onChange={(newHours) => setTargetHours(newHours)}
            />
          </div>

          {/* Calculated Bedtime Advice */}
          <div className="bg-neutral-950 border border-white/20 rounded-2xl p-4 text-center space-y-1">
            <span className="text-xs text-white/60 block">
              Hora ideal para acostarte
            </span>
            <div className="font-disruptive text-3xl font-black text-white">
              {calculatedBedtime}
            </div>
            <span className="text-[11px] text-white/70 block">
              Para despertar a las {wakeUpTime} con {targetHours}h completas
            </span>
          </div>

          <button
            onClick={handleFinish}
            className="w-full py-4 rounded-2xl bg-white text-black font-bold text-sm hover:bg-neutral-200 transition-colors shadow-lg active:scale-95"
          >
            Comenzar mi descanso
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-[11px] text-white/40">
        Sle8p · Simple, inteligente, 8 horas
      </footer>
    </div>
  );
}
