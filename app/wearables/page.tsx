"use client";

import React, { useState } from "react";
import { useSleepStore } from "@/lib/sleepStore";
import { isSupabaseConfigured } from "@/lib/supabase";
import { hapticSuccess, hapticMedium, hapticLight } from "@/lib/haptics";
import { toast } from "sonner";
import { WEARABLES_CATALOG } from "@/lib/wearablesData";

export default function WearablesPage() {
  const { wearables, toggleWearable, triggerManualSync } = useSleepStore();
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [selectedSnippetId, setSelectedSnippetId] = useState<string | null>(null);

  const handleToggle = (id: string, name: string, isConnected: boolean) => {
    hapticMedium();
    toggleWearable(id);
    toast.success(!isConnected ? `${name} conectado y sincronizado` : `${name} desconectado`);
  };

  const handleSync = (id: string, name: string) => {
    hapticLight();
    setSyncingId(id);
    triggerManualSync(id);
    setTimeout(() => {
      setSyncingId(null);
      hapticSuccess();
      toast.success(`${name}: Telemetría biométrica actualizada`);
    }, 600);
  };

  const handleSyncAll = () => {
    hapticMedium();
    setIsSyncingAll(true);
    wearables.forEach((w) => {
      if (w.connected) triggerManualSync(w.id);
    });
    setTimeout(() => {
      setIsSyncingAll(false);
      hapticSuccess();
      toast.success("Todos los dispositivos sincronizados con Supabase");
    }, 800);
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 50) return "#00FF66"; // Verde chillón
    if (battery >= 20) return "#FF7700"; // Naranja
    return "#FF3333"; // Rojo
  };

  return (
    <div className="px-5 pt-safe space-y-4 bg-black text-white min-h-screen pb-28">
      {/* Header */}
      <header className="flex items-center justify-between pt-2">
        <div>
          <h1 className="font-disruptive text-2xl font-black text-white">
            Wearables
          </h1>
          <p className="text-xs text-white/50">
            Sincronización biométrica en tiempo real
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sync All Button with Squash */}
          <button
            onClick={handleSyncAll}
            disabled={isSyncingAll}
            className="px-3.5 h-9 rounded-full bg-white text-black font-bold text-xs hover:bg-neutral-200 squash-btn flex items-center gap-1.5"
          >
            <span className={`inline-block text-[11px] ${isSyncingAll ? "animate-spin" : ""}`}>
              ↻
            </span>
            <span>{isSyncingAll ? "Sincronizando..." : "Sincronizar"}</span>
          </button>

          {/* Database Status Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 h-9 rounded-full bg-neutral-900 border border-white/10 text-[10px] font-mono">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: "#00FF66" }}
            />
            <span className="text-white/80">
              {isSupabaseConfigured ? "Cloud" : "DB"}
            </span>
          </div>
        </div>
      </header>

      {/* Wearables List with Staggered Visual Rhythm (Principle 3) */}
      <section className="space-y-3">
        {wearables.map((device, idx) => {
          const catalogItem = WEARABLES_CATALOG.find((c) => c.id === device.id);
          const isConnected = device.connected;
          const batteryColor = getBatteryColor(device.battery);
          const isSnippetOpen = selectedSnippetId === device.id;
          const isSyncing = syncingId === device.id;

          return (
            <div
              key={device.id}
              style={{ transitionDelay: `${idx * 40}ms` }}
              className={`rounded-3xl p-5 border transition-all ${
                isConnected
                  ? "bg-[#141416] border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.8)]"
                  : "bg-[#0d0d0f] border-white/10 opacity-70"
              }`}
            >
              {/* Device Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-disruptive text-base font-bold text-white">
                    {device.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider">
                      {device.brand}
                    </span>
                    {isConnected && (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-white/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] shadow-[0_0_6px_#00FF66]" />
                        {device.lastSync}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isConnected && (
                    <button
                      onClick={() => handleSync(device.id, device.name)}
                      disabled={isSyncing}
                      className="px-3.5 h-9 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold squash-btn border border-white/10 flex items-center justify-center"
                    >
                      {isSyncing ? "..." : "Sync"}
                    </button>
                  )}

                  <button
                    onClick={() => handleToggle(device.id, device.name, isConnected)}
                    className={`px-4 h-9 rounded-xl text-xs font-bold squash-btn flex items-center justify-center ${
                      isConnected
                        ? "bg-white text-black hover:bg-neutral-200"
                        : "bg-neutral-800 text-white/70 hover:text-white border border-white/10"
                    }`}
                  >
                    {isConnected ? "Conectado" : "Conectar"}
                  </button>
                </div>
              </div>

              {/* Live Telemetry Panel (When Connected) */}
              {isConnected && (
                <div className="mt-4 pt-3 border-t border-white/10 space-y-3">
                  {/* Battery Bar with Highlights */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white/60">Batería</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-neutral-800 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${device.battery}%`,
                            backgroundColor: batteryColor,
                          }}
                        />
                      </div>
                      <span className="font-bold" style={{ color: batteryColor }}>
                        {device.battery}%
                      </span>
                    </div>
                  </div>

                  {/* 4-Metric Biometric Grid */}
                  <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                    <div className="bg-neutral-900/80 rounded-2xl p-2.5 border border-white/5">
                      <span className="text-[10px] text-white/40 block">Pulso</span>
                      <span className="font-disruptive text-base font-bold text-white block mt-0.5">
                        {device.telemetry.heartRate}
                      </span>
                      <span className="text-[9px] text-[#00FF66] font-mono">bpm</span>
                    </div>

                    <div className="bg-neutral-900/80 rounded-2xl p-2.5 border border-white/5">
                      <span className="text-[10px] text-white/40 block">VFC</span>
                      <span className="font-disruptive text-base font-bold text-white block mt-0.5">
                        {device.telemetry.hrv}
                      </span>
                      <span className="text-[9px] text-[#00FF66] font-mono">ms</span>
                    </div>

                    <div className="bg-neutral-900/80 rounded-2xl p-2.5 border border-white/5">
                      <span className="text-[10px] text-white/40 block">Fase</span>
                      <span className="font-disruptive text-xs font-bold text-[#FF7700] block mt-1">
                        {device.telemetry.currentStage}
                      </span>
                      <span className="text-[9px] text-white/40 font-mono">actual</span>
                    </div>

                    <div className="bg-neutral-900/80 rounded-2xl p-2.5 border border-white/5">
                      <span className="text-[10px] text-white/40 block">Temp</span>
                      <span className="font-disruptive text-xs font-bold text-white block mt-1">
                        {device.telemetry.skinTempDelta}
                      </span>
                      <span className="text-[9px] text-white/40 font-mono">delta</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Developer SDK Snippet Drawer (Origin Awareness) */}
              {catalogItem && (
                <div className="mt-3 pt-2 border-t border-white/5">
                  <button
                    onClick={() => {
                      hapticLight();
                      setSelectedSnippetId(isSnippetOpen ? null : device.id);
                    }}
                    className="text-[11px] text-white/50 hover:text-white transition-colors flex items-center justify-between w-full h-8"
                  >
                    <span>API / SDK Payload</span>
                    <span>{isSnippetOpen ? "− Cerrar" : "+ Ver código"}</span>
                  </button>

                  {isSnippetOpen && (
                    <div
                      style={{ transformOrigin: "top center" }}
                      className="mt-2 space-y-2 transition-all duration-150"
                    >
                      <pre className="p-3 rounded-2xl bg-black border border-white/10 text-[10px] font-mono text-white/80 overflow-x-auto leading-relaxed">
                        <code>{catalogItem.samplePayloadSnippet}</code>
                      </pre>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {catalogItem.githubRepos.map((repo, rIdx) => (
                          <a
                            key={rIdx}
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 h-8 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-[10px] font-mono text-white/80 transition-colors flex items-center gap-1 squash-btn"
                          >
                            {repo.name} ★ {repo.stars}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
