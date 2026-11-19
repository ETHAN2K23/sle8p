"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSleepStore } from "@/lib/sleepStore";
import { hapticSuccess, hapticMedium, hapticLight } from "@/lib/haptics";
import { toast } from "sonner";

// Componentes de Renderizado Visual de Dispositivos (100% Offline, estilo PNG/Hardware 3D)
const DeviceVisual: React.FC<{ type: string; className?: string }> = ({
  type,
  className = "w-36 h-36",
}) => {
  if (type === "apple-watch") {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        {/* Apple Watch Ultra Silhouette */}
        <div className="w-28 h-32 rounded-[28px] bg-gradient-to-b from-[#2a2a2e] via-[#1c1c1f] to-[#141416] border-2 border-neutral-600/50 p-2 shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative flex flex-col justify-between">
          {/* Orange Action Button */}
          <div className="absolute -left-1 top-8 w-1 h-7 bg-[#FF7700] rounded-r-sm" />
          {/* Digital Crown */}
          <div className="absolute -right-1.5 top-5 w-1.5 h-8 bg-neutral-400 rounded-l-sm" />
          {/* Screen Content */}
          <div className="w-full h-full rounded-[20px] bg-black border border-white/10 flex flex-col items-center justify-center p-2 text-center">
            <span className="text-[10px] font-mono text-[#00FF66] font-bold">52 BPM</span>
            <div className="w-12 h-1 bg-[#00FF66]/40 rounded-full my-1 overflow-hidden">
              <div className="w-8 h-full bg-[#00FF66] rounded-full animate-pulse" />
            </div>
            <span className="text-[9px] font-mono text-white/50">SLE8P LIVE</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === "oura-ring") {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        {/* Oura Ring Gen 3 Horizon */}
        <div className="w-28 h-28 rounded-full border-[10px] border-[#3a3a40] bg-black shadow-[0_0_25px_rgba(255,255,255,0.1)] flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full border-[2px] border-white/20" />
          {/* Inner Infrared LEDs */}
          <div className="w-2.5 h-2.5 rounded-full bg-[#00FF66] shadow-[0_0_10px_#00FF66] animate-ping" />
        </div>
      </div>
    );
  }

  if (type === "whoop-strap") {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        {/* Whoop 4.0 Pod */}
        <div className="w-24 h-32 rounded-2xl bg-neutral-900 border border-white/20 p-2 shadow-2xl flex flex-col items-center justify-center">
          <div className="w-16 h-20 rounded-xl bg-black border border-white/10 flex flex-col items-center justify-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#00FF66] shadow-[0_0_8px_#00FF66]" />
            <span className="text-[9px] font-mono text-white/60">WHOOP</span>
          </div>
        </div>
      </div>
    );
  }

  // Garmin
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="w-28 h-28 rounded-full bg-gradient-to-b from-neutral-800 to-neutral-950 border-4 border-neutral-600 p-2 shadow-2xl flex items-center justify-center">
        <div className="w-full h-full rounded-full bg-black border border-white/10 flex flex-col items-center justify-center">
          <span className="text-[10px] font-mono text-[#FF7700] font-bold">GARMIN</span>
          <span className="text-[9px] font-mono text-white/60">PULSE OX</span>
        </div>
      </div>
    </div>
  );
};

const AVAILABLE_DEVICES = [
  {
    id: "apple-watch",
    name: "Apple Watch Ultra 2",
    brand: "Apple",
    desc: "Polisomnografía con HealthKit y sensor de temperatura",
  },
  {
    id: "oura-ring",
    name: "Oura Ring Gen 3",
    brand: "Oura",
    desc: "Anillo ultraligero con hipnogramas de alta resolución",
  },
  {
    id: "whoop-strap",
    name: "Whoop 4.0",
    brand: "Whoop",
    desc: "Monitor continuo de recuperación y deformación REM",
  },
  {
    id: "garmin-wearables",
    name: "Garmin Epix Pro",
    brand: "Garmin",
    desc: "Body Battery y oxigenación nocturna Pulse Ox",
  },
];

export default function WearablesPage() {
  const {
    wearables,
    healthKitConnected,
    shortcutsAlarmConnected,
    connectPrimaryDevice,
    disconnectAllWearables,
    triggerManualSync,
    toggleHealthKit,
    toggleShortcutsAlarm,
  } = useSleepStore();

  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPairingModalOpen, setIsPairingModalOpen] = useState(false);

  // Buscar el único dispositivo conectado actualmente
  const connectedDevice = wearables.find((w) => w.connected);

  // Carrusel giratorio automático si no hay dispositivo conectado
  useEffect(() => {
    if (connectedDevice) return;
    const timer = setInterval(() => {
      setActiveCarouselIndex((prev) => (prev + 1) % AVAILABLE_DEVICES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [connectedDevice]);

  const handleSyncCurrent = () => {
    if (!connectedDevice) return;
    hapticLight();
    setIsSyncing(true);
    triggerManualSync(connectedDevice.id);
    setTimeout(() => {
      setIsSyncing(false);
      hapticSuccess();
      toast.success(`${connectedDevice.name} sincronizado en tiempo real`);
    }, 600);
  };

  const handleDisconnect = () => {
    hapticMedium();
    disconnectAllWearables();
    toast("Dispositivo desvinculado. Puedes añadir uno nuevo.");
  };

  const handleConnect = (id: string, name: string) => {
    hapticSuccess();
    connectPrimaryDevice(id);
    setIsPairingModalOpen(false);
    toast.success(`${name} conectado correctamente`);
  };

  const currentCarouselDevice = AVAILABLE_DEVICES[activeCarouselIndex];

  return (
    <div className="px-5 pt-safe space-y-4 bg-black text-white min-h-screen pb-28">
      {/* Header */}
      <header className="flex items-center justify-between pt-2 pb-1 border-b border-white/10">
        <div>
          <h1 className="font-disruptive text-2xl font-black text-white">
            Dispositivos
          </h1>
          <p className="text-xs text-white/50">
            Conexión biométrica e integraciones iOS
          </p>
        </div>

        {connectedDevice && (
          <button
            onClick={handleSyncCurrent}
            disabled={isSyncing}
            className="px-3.5 h-9 rounded-full bg-white text-black font-bold text-xs hover:bg-neutral-200 squash-btn flex items-center gap-1.5"
          >
            <span className={`inline-block text-[11px] ${isSyncing ? "animate-spin" : ""}`}>
              ↻
            </span>
            <span>{isSyncing ? "Sincronizando..." : "Sincronizar"}</span>
          </button>
        )}
      </header>

      {/* CASO 1: SOLO EL DISPOSITIVO CONECTADO (ESTILO PNG + TELEMETRÍA) */}
      {connectedDevice ? (
        <section className="bw-card-elevated rounded-3xl p-5 space-y-4 border border-white/20">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00FF66] shadow-[0_0_8px_#00FF66]" />
                <span className="text-[10px] font-mono font-bold text-[#00FF66] uppercase tracking-wider">
                  Conectado
                </span>
              </div>
              <h2 className="font-disruptive text-2xl font-black text-white mt-1">
                {connectedDevice.name}
              </h2>
              <span className="text-xs font-mono text-white/50">
                Última sincronización: {connectedDevice.lastSync}
              </span>
            </div>

            <button
              onClick={handleDisconnect}
              className="px-3 h-8 rounded-xl bg-neutral-900 border border-white/15 text-white/70 hover:text-white text-xs font-mono transition-colors active:scale-95"
            >
              Cambiar
            </button>
          </div>

          {/* Render Visual PNG/Hardware del Dispositivo */}
          <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-neutral-950 border border-white/10 flex flex-col items-center justify-center p-3">
            <DeviceVisual type={connectedDevice.id} className="w-32 h-32" />

            {/* Batería en superposición */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono bg-neutral-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15">
              <span className="text-white/70">Batería restante</span>
              <span className="font-bold text-[#00FF66]">
                {connectedDevice.battery}%
              </span>
            </div>
          </div>

          {/* Telemetría Biométrica en Tiempo Real */}
          <div className="grid grid-cols-4 gap-2 text-center pt-1">
            <div className="bg-neutral-900/90 rounded-2xl p-2.5 border border-white/10">
              <span className="text-[10px] text-white/40 block font-mono">Pulso</span>
              <span className="font-disruptive text-lg font-bold text-white block mt-0.5">
                {connectedDevice.telemetry.heartRate}
              </span>
              <span className="text-[9px] text-[#00FF66] font-mono">bpm</span>
            </div>

            <div className="bg-neutral-900/90 rounded-2xl p-2.5 border border-white/10">
              <span className="text-[10px] text-white/40 block font-mono">VFC</span>
              <span className="font-disruptive text-lg font-bold text-white block mt-0.5">
                {connectedDevice.telemetry.hrv}
              </span>
              <span className="text-[9px] text-[#00FF66] font-mono">ms</span>
            </div>

            <div className="bg-neutral-900/90 rounded-2xl p-2.5 border border-white/10">
              <span className="text-[10px] text-white/40 block font-mono">Fase</span>
              <span className="font-disruptive text-xs font-bold text-[#FF7700] block mt-1">
                {connectedDevice.telemetry.currentStage}
              </span>
              <span className="text-[9px] text-white/40 font-mono">actual</span>
            </div>

            <div className="bg-neutral-900/90 rounded-2xl p-2.5 border border-white/10">
              <span className="text-[10px] text-white/40 block font-mono">Temp</span>
              <span className="font-disruptive text-xs font-bold text-white block mt-1">
                {connectedDevice.telemetry.skinTempDelta}
              </span>
              <span className="text-[9px] text-white/40 font-mono">delta</span>
            </div>
          </div>
        </section>
      ) : (
        /* CASO 2: NO HAY DISPOSITIVO CONECTADO -> CARRUSEL GIRANDO + BOTÓN AÑADIR */
        <section className="bw-card-elevated rounded-3xl p-6 text-center space-y-4 border border-white/20">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[#00FF66] uppercase tracking-wider block">
              Sin dispositivo vinculado
            </span>
            <h2 className="font-disruptive text-2xl font-black text-white">
              Añadir Dispositivo
            </h2>
            <p className="text-xs text-white/60 max-w-xs mx-auto">
              Empareja tu smartwatch o anillo para medir fases REM precisas y variabilidad cardiaca.
            </p>
          </div>

          {/* Carrusel Girando con Transiciones Suaves */}
          <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-neutral-950 border border-white/15 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCarouselDevice.id}
                initial={{ opacity: 0, scale: 0.9, rotateY: -20 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateY: 20 }}
                transition={{ duration: 0.45 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-4"
              >
                <DeviceVisual type={currentCarouselDevice.id} className="w-24 h-24 mb-1" />
                <span className="font-disruptive text-sm font-bold text-white">
                  {currentCarouselDevice.name}
                </span>
                <span className="text-[10px] text-white/50 font-mono">
                  {currentCarouselDevice.desc}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Indicadores de Puntos del Carrusel */}
            <div className="absolute bottom-2.5 flex items-center gap-1.5 z-10">
              {AVAILABLE_DEVICES.map((dev, idx) => (
                <button
                  key={dev.id}
                  onClick={() => setActiveCarouselIndex(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === activeCarouselIndex
                      ? "w-4 bg-[#00FF66]"
                      : "bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Botón Prominente para Añadir */}
          <button
            onClick={() => {
              hapticMedium();
              setIsPairingModalOpen(true);
            }}
            className="w-full h-13 rounded-2xl bg-white text-black font-disruptive text-base font-black hover:bg-neutral-200 squash-btn shadow-[0_4px_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2"
          >
            <span>+ Añadir Dispositivo</span>
          </button>
        </section>
      )}

      {/* SECCIÓN DE INTEGRACIONES DEL SISTEMA: SALUD Y ATAJO DE ALARMAS */}
      <section className="space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white/50 px-1">
          Integraciones del Sistema
        </h3>

        {/* 1. App de Salud (Apple HealthKit) */}
        <div className="bw-card rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-500/30 flex items-center justify-center text-red-400 font-bold text-lg">
              ♥
            </div>
            <div>
              <h4 className="font-disruptive text-sm font-bold text-white">
                App de Salud (Apple Health)
              </h4>
              <p className="text-[11px] text-white/50">
                Lectura continua de sueño y frecuencia cardíaca
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              hapticLight();
              toggleHealthKit();
              toast(
                healthKitConnected
                  ? "Apple Health desconectado"
                  : "Apple Health sincronizado con HealthKit"
              );
            }}
            className={`px-3.5 h-8 rounded-xl text-xs font-mono font-bold transition-all active:scale-95 ${
              healthKitConnected
                ? "bg-neutral-800 text-[#00FF66] border border-[#00FF66]/30"
                : "bg-white text-black"
            }`}
          >
            {healthKitConnected ? "Conectado" : "Conectar"}
          </button>
        </div>

        {/* 2. Atajo de Alarmas de iOS (Apple Shortcuts) */}
        <div className="bw-card rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-950/60 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold text-sm font-mono">
              ⚡
            </div>
            <div>
              <h4 className="font-disruptive text-sm font-bold text-white">
                Atajo de Alarmas (Siri Shortcuts)
              </h4>
              <p className="text-[11px] text-white/50">
                Sincroniza la alarma calculada con el Reloj de iOS
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              hapticLight();
              toggleShortcutsAlarm();
              toast.success("Abriendo Atajo Sle8p Smart Alarm en iOS...");
            }}
            className={`px-3.5 h-8 rounded-xl text-xs font-mono font-bold transition-all active:scale-95 ${
              shortcutsAlarmConnected
                ? "bg-neutral-800 text-[#00FF66] border border-[#00FF66]/30"
                : "bg-white text-black"
            }`}
          >
            {shortcutsAlarmConnected ? "Instalado" : "Instalar"}
          </button>
        </div>
      </section>

      {/* Modal para Seleccionar Dispositivo al Añadir */}
      {isPairingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="w-full max-w-sm bg-[#161618] border border-white/20 rounded-3xl p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-disruptive text-lg font-bold text-white">
                Selecciona tu dispositivo
              </h3>
              <button
                onClick={() => setIsPairingModalOpen(false)}
                className="text-white/40 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 pt-1">
              {AVAILABLE_DEVICES.map((dev) => (
                <div
                  key={dev.id}
                  onClick={() => handleConnect(dev.id, dev.name)}
                  className="p-3 rounded-2xl bg-black/60 hover:bg-neutral-800 border border-white/10 flex items-center justify-between cursor-pointer active:scale-98 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <DeviceVisual type={dev.id} className="w-10 h-10" />
                    <div>
                      <span className="font-disruptive text-sm font-bold text-white block">
                        {dev.name}
                      </span>
                      <span className="text-[10px] text-white/50 font-mono">
                        {dev.brand}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#00FF66]">Vincular</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
