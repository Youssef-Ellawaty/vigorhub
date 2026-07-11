"use client";

import { Flame, Target, TrendingUp, Settings } from "lucide-react";
import { t } from "@/lib/calorie-tracker/i18n";
import type { UserFitnessProfile, DailyTotals, Language } from "@/lib/calorie-tracker/types";
import { cn } from "@/lib/utils";

interface MacroDashboardProps {
  profile: UserFitnessProfile;
  totals: DailyTotals;
  waterMl: number;
  lang: Language;
  isDark: boolean;
  onEditProfile: () => void;
}

interface RadialRingProps {
  size: number;
  strokeWidth: number;
  progress: number; // 0–1
  color: string;
  trailColor: string;
  children?: React.ReactNode;
}

function RadialRing({ size, strokeWidth, progress, color, trailColor, children }: RadialRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const dashOffset = circumference * (1 - clampedProgress);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)" }}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Trail */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trailColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

interface MacroRingCardProps {
  label: string;
  consumed: number;
  target: number;
  unit: string;
  ringColor: string;
  trailColor: string;
  textColor: string;
  isDark: boolean;
}

function MacroRingCard({
  label,
  consumed,
  target,
  unit,
  ringColor,
  trailColor,
  textColor,
  isDark,
}: MacroRingCardProps) {
  const progress = target > 0 ? consumed / target : 0;
  const remaining = Math.max(target - consumed, 0);
  const isOver = consumed > target;

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-2xl p-4 border transition-all duration-300",
        isDark
          ? "bg-slate-900/50 border-slate-700/40 hover:border-slate-600/60 backdrop-blur-md"
          : "bg-white/70 border-slate-200 hover:border-slate-300 backdrop-blur-md"
      )}
    >
      <RadialRing
        size={80}
        strokeWidth={7}
        progress={progress}
        color={ringColor}
        trailColor={trailColor}
      >
        <div className="text-center">
          <div className={cn("text-base font-black", textColor)}>
            {Math.round(consumed)}
          </div>
          <div className={cn("text-[9px] font-medium", isDark ? "text-slate-500" : "text-slate-400")}>
            {unit}
          </div>
        </div>
      </RadialRing>

      <div className="text-center space-y-0.5 w-full">
        <p className={cn("text-xs font-semibold", isDark ? "text-slate-300" : "text-slate-700")}>
          {label}
        </p>
        <p className={cn("text-[11px]", isOver ? "text-rose-400" : isDark ? "text-slate-500" : "text-slate-400")}>
          {isOver ? `+${Math.round(consumed - target)}${unit} over` : `${Math.round(remaining)}${unit} left`}
        </p>
        <div className="w-full mt-1">
          <div
            className={cn(
              "h-1 rounded-full overflow-hidden",
              isDark ? "bg-slate-800" : "bg-slate-100"
            )}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(progress * 100, 100)}%`,
                background: ringColor,
              }}
            />
          </div>
        </div>
        <p className={cn("text-[10px]", isDark ? "text-slate-600" : "text-slate-400")}>
          /{target}{unit}
        </p>
      </div>
    </div>
  );
}

export function MacroDashboard({ profile, totals, waterMl, lang, isDark, onEditProfile }: MacroDashboardProps) {
  const calorieProgress = profile.targetCalories > 0 ? totals.calories / profile.targetCalories : 0;
  const waterProgress = profile.targetWaterL > 0 ? waterMl / 1000 / profile.targetWaterL : 0;

  const goalLabel =
    profile.fitnessGoal === "bulk"
      ? t(lang, "bulk")
      : profile.fitnessGoal === "cut"
      ? t(lang, "cut")
      : t(lang, "maintain");

  return (
    <div className="space-y-4">
      {/* Hero calorie ring */}
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl border p-6",
          isDark
            ? "bg-slate-900/50 border-slate-700/40 backdrop-blur-md"
            : "bg-white/80 border-slate-200 backdrop-blur-md"
        )}
      >
        {/* Glow effect */}
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #10b981, transparent)",
          }}
        />

        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Calorie Ring */}
          <div className="relative flex-shrink-0">
            <RadialRing
              size={160}
              strokeWidth={12}
              progress={calorieProgress}
              color="#10b981"
              trailColor={isDark ? "rgba(16,185,129,0.1)" : "rgba(16,185,129,0.15)"}
            >
              <div className="text-center px-2">
                <Flame className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
                <div className={cn("text-2xl font-black leading-none", isDark ? "text-slate-50" : "text-slate-900")}>
                  {Math.round(totals.calories)}
                </div>
                <div className={cn("text-xs font-medium mt-0.5", isDark ? "text-slate-400" : "text-slate-500")}>
                  {t(lang, "kcal")}
                </div>
              </div>
            </RadialRing>
            {/* Goal badge */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border",
                  profile.fitnessGoal === "bulk"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : profile.fitnessGoal === "cut"
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                )}
              >
                {goalLabel}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 w-full space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h2 className={cn("text-xl font-black", isDark ? "text-slate-50" : "text-slate-900")}>
                  {t(lang, "dailyTargets")}
                </h2>
                <p className={cn("text-sm", isDark ? "text-slate-500" : "text-slate-500")}>
                  {profile.targetCalories} {t(lang, "kcal")} target
                </p>
              </div>
              <button
                onClick={onEditProfile}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl border transition-colors",
                  isDark
                    ? "border-slate-700/50 hover:bg-slate-800 text-slate-400"
                    : "border-slate-200 hover:bg-slate-50 text-slate-500"
                )}
              >
                <Settings className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Linear progress bars */}
            <div className="space-y-2.5">
              <LinearBar
                label={t(lang, "calories")}
                consumed={totals.calories}
                target={profile.targetCalories}
                unit={t(lang, "kcal")}
                color="#10b981"
                isDark={isDark}
              />
              <LinearBar
                label={t(lang, "protein")}
                consumed={totals.protein}
                target={profile.targetProteinG}
                unit="g"
                color="#06b6d4"
                isDark={isDark}
              />
              <LinearBar
                label={t(lang, "carbs")}
                consumed={totals.carbs}
                target={profile.targetCarbsG}
                unit="g"
                color="#eab308"
                isDark={isDark}
              />
              <LinearBar
                label={t(lang, "fats")}
                consumed={totals.fat}
                target={profile.targetFatsG}
                unit="g"
                color="#f97316"
                isDark={isDark}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Macro detail cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MacroRingCard
          label={t(lang, "protein")}
          consumed={totals.protein}
          target={profile.targetProteinG}
          unit="g"
          ringColor="#06b6d4"
          trailColor={isDark ? "rgba(6,182,212,0.1)" : "rgba(6,182,212,0.15)"}
          textColor="text-cyan-400"
          isDark={isDark}
        />
        <MacroRingCard
          label={t(lang, "carbs")}
          consumed={totals.carbs}
          target={profile.targetCarbsG}
          unit="g"
          ringColor="#eab308"
          trailColor={isDark ? "rgba(234,179,8,0.1)" : "rgba(234,179,8,0.15)"}
          textColor="text-yellow-400"
          isDark={isDark}
        />
        <MacroRingCard
          label={t(lang, "fats")}
          consumed={totals.fat}
          target={profile.targetFatsG}
          unit="g"
          ringColor="#f97316"
          trailColor={isDark ? "rgba(249,115,22,0.1)" : "rgba(249,115,22,0.15)"}
          textColor="text-orange-400"
          isDark={isDark}
        />
        <MacroRingCard
          label={t(lang, "water")}
          consumed={Math.round(waterMl / 100) / 10}
          target={profile.targetWaterL}
          unit="L"
          ringColor="#3b82f6"
          trailColor={isDark ? "rgba(59,130,246,0.1)" : "rgba(59,130,246,0.15)"}
          textColor="text-blue-400"
          isDark={isDark}
        />
      </div>
    </div>
  );
}

function LinearBar({
  label,
  consumed,
  target,
  unit,
  color,
  isDark,
}: {
  label: string;
  consumed: number;
  target: number;
  unit: string;
  color: string;
  isDark: boolean;
}) {
  const progress = target > 0 ? Math.min((consumed / target) * 100, 100) : 0;
  const isOver = consumed > target;

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className={cn("text-xs font-medium", isDark ? "text-slate-400" : "text-slate-600")}>{label}</span>
        <span className={cn("text-xs font-semibold", isOver ? "text-rose-400" : isDark ? "text-slate-300" : "text-slate-700")}>
          {Math.round(consumed)}/{target}{unit}
        </span>
      </div>
      <div className={cn("h-1.5 rounded-full overflow-hidden", isDark ? "bg-slate-800" : "bg-slate-100")}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${progress}%`, background: color }}
        />
      </div>
    </div>
  );
}
