"use client";

import { Droplets, RotateCcw, GlassWater, Waves } from "lucide-react";
import { t } from "@/lib/i18n";
import type { Language } from "@/lib/types";
import { cn } from "@/lib/utils";

interface WaterTrackerProps {
  lang: Language;
  isDark: boolean;
  waterMl: number;
  targetL: number;
  onAdd: (ml: number) => void;
  onReset: () => void;
}

export function WaterTracker({ lang, isDark, waterMl, targetL, onAdd, onReset }: WaterTrackerProps) {
  const isRTL = lang === "ar";
  const targetMl = targetL * 1000;
  const progress = Math.min(waterMl / targetMl, 1);
  const progressPercent = Math.round(progress * 100);
  const litersConsumed = (waterMl / 1000).toFixed(2);
  const isGoalMet = waterMl >= targetMl;

  // Generate water drop log
  const cupSize = 250;
  const totalCups = Math.ceil(targetMl / cupSize);
  const filledCups = Math.floor(waterMl / cupSize);

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 space-y-5",
        isDark
          ? "bg-slate-900/50 border-slate-700/40 backdrop-blur-md"
          : "bg-white/80 border-slate-200 backdrop-blur-md"
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20">
            <Droplets className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <h3 className={cn("text-sm font-bold", isDark ? "text-slate-100" : "text-slate-900")}>
              {t(lang, "waterIntake")}
            </h3>
            <p className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
              {t(lang, "dailyGoal")}: {targetL}L
            </p>
          </div>
        </div>
        <button
          onClick={onReset}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-xl border transition-colors",
            isDark
              ? "border-slate-700/50 text-slate-500 hover:text-slate-300 hover:bg-slate-800"
              : "border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          )}
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Animated Glass / Wave Visual */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {/* Glass SVG */}
          <div className="relative w-28 h-40">
            {/* Glass body */}
            <svg
              viewBox="0 0 112 160"
              className="absolute inset-0 w-full h-full"
            >
              {/* Glass outline */}
              <path
                d="M14 8 L98 8 L88 152 L24 152 Z"
                fill="none"
                stroke={isDark ? "rgba(148,163,184,0.2)" : "rgba(100,116,139,0.15)"}
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Water fill with clipping */}
              <defs>
                <clipPath id="glass-clip">
                  <path d="M15 9 L97 9 L87 151 L25 151 Z" />
                </clipPath>
              </defs>

              {/* Water fill */}
              <g clipPath="url(#glass-clip)">
                {/* Water background */}
                <rect
                  x="14"
                  y={9 + (142 * (1 - progress))}
                  width="84"
                  height={142 * progress}
                  fill={isDark ? "rgba(59,130,246,0.25)" : "rgba(59,130,246,0.15)"}
                  style={{ transition: "y 0.8s cubic-bezier(0.4, 0, 0.2, 1), height 0.8s cubic-bezier(0.4, 0, 0.2, 1)" }}
                />

                {/* Wave */}
                {progress > 0 && (
                  <g style={{ transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)" }}>
                    <WavePath progress={progress} isDark={isDark} />
                  </g>
                )}
              </g>

              {/* Glass sheen */}
              <path
                d="M20 12 L30 145"
                stroke={isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.5)"}
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>

            {/* Percentage badge */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div
                  className={cn(
                    "text-xl font-black transition-colors",
                    isGoalMet ? "text-emerald-400" : isDark ? "text-blue-300" : "text-blue-600"
                  )}
                >
                  {progressPercent}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="text-center space-y-0.5">
          <div className={cn("text-3xl font-black", isGoalMet ? "text-emerald-400" : isDark ? "text-blue-300" : "text-blue-600")}>
            {litersConsumed}
            <span className={cn("text-base font-medium ml-1", isDark ? "text-slate-400" : "text-slate-500")}>L</span>
          </div>
          <p className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
            {isGoalMet
              ? lang === "ar" ? "أحسنت! وصلت لهدفك" : "Goal reached! Great job"
              : `${((targetMl - waterMl) / 1000).toFixed(2)}L ${lang === "ar" ? "متبقي" : "remaining"}`}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className={cn("h-2.5 rounded-full overflow-hidden", isDark ? "bg-slate-800" : "bg-slate-100")}>
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700",
              isGoalMet ? "bg-gradient-to-r from-emerald-400 to-teal-400" : "bg-gradient-to-r from-blue-400 to-cyan-400"
            )}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className={cn("text-[10px]", isDark ? "text-slate-500" : "text-slate-400")}>0L</span>
          <span className={cn("text-[10px]", isDark ? "text-slate-500" : "text-slate-400")}>{targetL}L</span>
        </div>
      </div>

      {/* Cup visualizer */}
      <div>
        <p className={cn("text-[11px] font-semibold mb-2", isDark ? "text-slate-500" : "text-slate-400")}>
          {lang === "ar" ? "الأكواب" : "Cups"} (250ml each)
        </p>
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: Math.min(totalCups, 16) }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-5 w-5 rounded-md border transition-all duration-300",
                i < filledCups
                  ? "bg-blue-500/30 border-blue-500/40"
                  : isDark
                  ? "bg-slate-800/60 border-slate-700/40"
                  : "bg-slate-100 border-slate-200"
              )}
            >
              {i < filledCups && (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-blue-400 opacity-70" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onAdd(250)}
          className={cn(
            "flex flex-col items-center gap-1.5 rounded-xl py-3 border transition-all duration-200 hover:scale-[1.02] active:scale-100",
            isDark
              ? "bg-blue-500/8 border-blue-500/20 hover:bg-blue-500/15 hover:border-blue-500/30"
              : "bg-blue-50 border-blue-200 hover:bg-blue-100"
          )}
        >
          <GlassWater className="h-5 w-5 text-blue-400" />
          <span className={cn("text-xs font-bold", isDark ? "text-blue-300" : "text-blue-600")}>
            {t(lang, "addCup")}
          </span>
        </button>

        <button
          onClick={() => onAdd(500)}
          className={cn(
            "flex flex-col items-center gap-1.5 rounded-xl py-3 border transition-all duration-200 hover:scale-[1.02] active:scale-100",
            isDark
              ? "bg-cyan-500/8 border-cyan-500/20 hover:bg-cyan-500/15 hover:border-cyan-500/30"
              : "bg-cyan-50 border-cyan-200 hover:bg-cyan-100"
          )}
        >
          <Waves className="h-5 w-5 text-cyan-400" />
          <span className={cn("text-xs font-bold", isDark ? "text-cyan-300" : "text-cyan-600")}>
            {t(lang, "addBottle")}
          </span>
        </button>
      </div>

      {/* Custom amount */}
      <div className="flex gap-2">
        <CustomWaterInput lang={lang} isDark={isDark} onAdd={onAdd} />
      </div>
    </div>
  );
}

function WavePath({ progress, isDark }: { progress: number; isDark: boolean }) {
  const yBase = 9 + 142 * (1 - progress);

  return (
    <>
      {/* Animated wave */}
      <path
        d={`M14 ${yBase} Q35 ${yBase - 5} 56 ${yBase} Q77 ${yBase + 5} 98 ${yBase} L98 151 L14 151 Z`}
        fill={isDark ? "rgba(59,130,246,0.4)" : "rgba(59,130,246,0.3)"}
        style={{
          animation: "wave 3s ease-in-out infinite",
        }}
      />
      <style>{`
        @keyframes wave {
          0%, 100% { d: path("M14 ${yBase} Q35 ${yBase - 5} 56 ${yBase} Q77 ${yBase + 5} 98 ${yBase} L98 151 L14 151 Z"); }
          50% { d: path("M14 ${yBase} Q35 ${yBase + 5} 56 ${yBase} Q77 ${yBase - 5} 98 ${yBase} L98 151 L14 151 Z"); }
        }
      `}</style>
    </>
  );
}

function CustomWaterInput({
  lang,
  isDark,
  onAdd,
}: {
  lang: Language;
  isDark: boolean;
  onAdd: (ml: number) => void;
}) {
  return (
    <div className={cn("flex-1 flex gap-2")}>
      <input
        type="number"
        id="custom-water"
        defaultValue=""
        placeholder={lang === "ar" ? "كمية مخصصة (مل)" : "Custom amount (ml)"}
        min={50}
        max={2000}
        step={50}
        className={cn(
          "flex-1 rounded-xl px-3 py-2 text-sm border transition-all",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/40",
          isDark
            ? "bg-slate-800/60 border-slate-700/50 text-slate-100 placeholder-slate-500"
            : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"
        )}
      />
      <button
        onClick={() => {
          const inp = document.getElementById("custom-water") as HTMLInputElement;
          const val = parseInt(inp.value);
          if (val && val > 0) {
            onAdd(val);
            inp.value = "";
          }
        }}
        className={cn(
          "rounded-xl px-4 py-2 text-sm font-bold border transition-all",
          isDark
            ? "bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20"
            : "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
        )}
      >
        {lang === "ar" ? "أضف" : "Add"}
      </button>
    </div>
  );
}
