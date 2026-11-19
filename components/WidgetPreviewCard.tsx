"use client";

import React, { useState } from "react";
import { useSleepStore } from "@/lib/sleepStore";

export const WidgetPreviewCard: React.FC = () => {
  const [activeWidgetTab, setActiveWidgetTab] = useState<
    "lockscreen" | "homescreen-small" | "homescreen-medium" | "standby"
  >("lockscreen");

  const { todayScore, accumulatedHours, targetHours } = useSleepStore();

  const totalMin = Math.round(accumulatedHours * 60);
  const hours = Math.floor(totalMin / 60);
  const minutes = totalMin % 60;
  const progressPercent = Math.min(Math.round((accumulatedHours / targetHours) * 100), 100);

  const weeklyMini = [
    { day: "L", h: 8.2 },
    { day: "M", h: 7.9 },
    { day: "X", h: 8.1 },
    { day: "J", h: 7.4 },
    { day: "V", h: 8.5 },
    { day: "S", h: 8.0 },
    { day: "D", h: 7.8 },
  ];

  return (
    <div className="w-full bw-card rounded-3xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-disruptive text-sm font-bold text-white">Widgets iOS 18</h3>
        <span className="text-xs font-mono text-white/50">Preview</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 bg-neutral-900 p-1 rounded-2xl border border-white/10 overflow-x-auto">
        <button
          onClick={() => setActiveWidgetTab("lockscreen")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeWidgetTab === "lockscreen"
              ? "bg-white text-black font-bold"
              : "text-white/50 hover:text-white"
          }`}
        >
          Bloqueo
        </button>
        <button
          onClick={() => setActiveWidgetTab("homescreen-small")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeWidgetTab === "homescreen-small"
              ? "bg-white text-black font-bold"
              : "text-white/50 hover:text-white"
          }`}
        >
          Home 2x2
        </button>
        <button
          onClick={() => setActiveWidgetTab("homescreen-medium")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeWidgetTab === "homescreen-medium"
              ? "bg-white text-black font-bold"
              : "text-white/50 hover:text-white"
          }`}
        >
          Home 4x2
        </button>
        <button
          onClick={() => setActiveWidgetTab("standby")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeWidgetTab === "standby"
              ? "bg-white text-black font-bold"
              : "text-white/50 hover:text-white"
          }`}
        >
          StandBy
        </button>
      </div>

      {/* Canvas */}
      <div className="p-4 rounded-2xl bg-neutral-950 border border-white/10 flex items-center justify-center min-h-[170px]">
        {activeWidgetTab === "lockscreen" && (
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-black border-2 border-white/30 p-2 flex flex-col items-center justify-center relative">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="213"
                  strokeDashoffset={213 - (213 * progressPercent) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="font-disruptive text-xs font-black text-white z-10">
                {hours}h{minutes}m
              </span>
              <span className="text-[8px] text-white/60 font-bold z-10 font-mono">
                8H
              </span>
            </div>

            <div className="text-xs text-white/80 font-mono">
              {hours}h {minutes}m ({progressPercent}%)
            </div>
          </div>
        )}

        {activeWidgetTab === "homescreen-small" && (
          <div className="w-36 h-36 rounded-3xl bg-neutral-900 border border-white/20 p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-disruptive text-xs font-black text-white">8</span>
              <span className="font-disruptive text-xs font-black text-white">
                {todayScore} pts
              </span>
            </div>

            <div>
              <div className="font-disruptive text-2xl font-black text-white">
                {hours}h {minutes}m
              </div>
              <span className="text-[10px] text-white/50 font-mono">
                {progressPercent}% de 8h
              </span>
            </div>

            <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {activeWidgetTab === "homescreen-medium" && (
          <div className="w-full max-w-sm h-32 rounded-3xl bg-neutral-900 border border-white/20 p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-disruptive text-xs font-bold text-white">Sle8p 8h</span>
              <span className="font-disruptive text-xs font-black text-white">
                {hours}h {minutes}m
              </span>
            </div>

            <div className="flex items-end justify-between gap-2 pt-1">
              {weeklyMini.map((r, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full h-10 bg-black rounded-md flex items-end overflow-hidden p-0.5 border border-white/10">
                    <div
                      className="w-full rounded-sm bg-white"
                      style={{ height: `${Math.min((r.h / 9.0) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-white/60 font-mono">
                    {r.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeWidgetTab === "standby" && (
          <div className="w-full max-w-md h-32 rounded-3xl bg-black border border-white/20 p-4 flex items-center justify-around">
            <span className="font-disruptive text-3xl font-black text-white">
              Sle8p
            </span>
            <div className="text-right">
              <div className="font-disruptive text-3xl font-black text-white">
                07:30
              </div>
              <span className="text-xs text-white/60 font-mono">
                Alarma 8h
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
