"use client";

import { useState } from "react";
import { X, Calculator, Flame, Dumbbell, Droplets, Target } from "lucide-react";
import { buildProfile } from "@/lib/tdee";
import { t } from "@/lib/i18n";
import type { Gender, ActivityLevel, FitnessGoal, UserFitnessProfile, Language } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TDEECalculatorProps {
  lang: Language;
  isDark: boolean;
  onSave: (profile: UserFitnessProfile) => void;
  onClose: () => void;
  initialProfile?: UserFitnessProfile | null;
}

export function TDEECalculator({ lang, isDark, onSave, onClose, initialProfile }: TDEECalculatorProps) {
  const isRTL = lang === "ar";

  const [age, setAge] = useState(initialProfile?.age.toString() ?? "25");
  const [gender, setGender] = useState<Gender>(initialProfile?.gender ?? "male");
  const [weight, setWeight] = useState(initialProfile?.weightKg.toString() ?? "75");
  const [height, setHeight] = useState(initialProfile?.heightCm.toString() ?? "175");
  const [activity, setActivity] = useState<ActivityLevel>(initialProfile?.activityLevel ?? "moderate");
  const [goal, setGoal] = useState<FitnessGoal>(initialProfile?.fitnessGoal ?? "maintain");
  const [preview, setPreview] = useState<UserFitnessProfile | null>(null);
  const [step, setStep] = useState<"form" | "result">(initialProfile ? "result" : "form");

  function handleCalculate() {
    const a = parseInt(age);
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!a || !w || !h || a < 10 || w < 30 || h < 100) return;
    const profile = buildProfile(a, gender, w, h, activity, goal);
    setPreview(profile);
    setStep("result");
  }

  function handleSave() {
    if (preview) {
      onSave(preview);
      onClose();
    }
  }

  const inputClass = cn(
    "w-full rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
    "border focus:outline-none focus:ring-2 focus:ring-emerald-500/50",
    isDark
      ? "bg-slate-800/60 border-slate-700/50 text-slate-100 placeholder-slate-500"
      : "bg-white/80 border-slate-200 text-slate-800 placeholder-slate-400"
  );

  const labelClass = cn(
    "block text-xs font-semibold tracking-wider uppercase mb-2",
    isDark ? "text-slate-400" : "text-slate-500"
  );

  const goals: { value: FitnessGoal; label: string; desc: string; color: string }[] = [
    { value: "bulk", label: t(lang, "bulk"), desc: t(lang, "bulkDesc"), color: "emerald" },
    { value: "maintain", label: t(lang, "maintain"), desc: t(lang, "maintainDesc"), color: "cyan" },
    { value: "cut", label: t(lang, "cut"), desc: t(lang, "cutDesc"), color: "rose" },
  ];

  const activities: { value: ActivityLevel; label: string }[] = [
    { value: "sedentary", label: t(lang, "sedentary") },
    { value: "light", label: t(lang, "light") },
    { value: "moderate", label: t(lang, "moderate") },
    { value: "very_active", label: t(lang, "veryActive") },
    { value: "extra_active", label: t(lang, "extraActive") },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir={isRTL ? "rtl" : "ltr"}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl",
          isDark
            ? "bg-[#0B0F19]/95 border-slate-700/50 shadow-emerald-500/10"
            : "bg-white/95 border-slate-200 shadow-slate-200/50"
        )}
        style={{ scrollbarWidth: "thin" }}
      >
        {/* Header */}
        <div
          className={cn(
            "sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b backdrop-blur-md",
            isDark ? "border-slate-700/50 bg-[#0B0F19]/90" : "border-slate-200 bg-white/90"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Calculator className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <h2 className={cn("text-base font-bold", isDark ? "text-slate-50" : "text-slate-900")}>
                {t(lang, "calculateMyPlan")}
              </h2>
              <p className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-500")}>
                Mifflin-St Jeor Equation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
              isDark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"
            )}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {step === "form" ? (
            <>
              {/* Gender */}
              <div>
                <label className={labelClass}>{t(lang, "gender")}</label>
                <div className="grid grid-cols-2 gap-3">
                  {(["male", "female"] as Gender[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={cn(
                        "rounded-xl px-4 py-3 text-sm font-semibold border transition-all duration-200",
                        gender === g
                          ? "bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/25"
                          : isDark
                          ? "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-emerald-500/30"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:border-emerald-400"
                      )}
                    >
                      {t(lang, g === "male" ? "male" : "female")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age / Weight / Height */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>{t(lang, "age")}</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className={inputClass}
                    min={10}
                    max={100}
                    placeholder="25"
                  />
                </div>
                <div>
                  <label className={labelClass}>{t(lang, "weight")}</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className={inputClass}
                    placeholder="75"
                  />
                </div>
                <div>
                  <label className={labelClass}>{t(lang, "height")}</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className={inputClass}
                    placeholder="175"
                  />
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <label className={labelClass}>{t(lang, "activityLevel")}</label>
                <div className="space-y-2">
                  {activities.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setActivity(value)}
                      className={cn(
                        "w-full rounded-xl px-4 py-2.5 text-sm font-medium border transition-all duration-200 text-start",
                        activity === value
                          ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400"
                          : isDark
                          ? "bg-slate-800/40 border-slate-700/40 text-slate-400 hover:border-cyan-500/20"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:border-cyan-400"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fitness Goal */}
              <div>
                <label className={labelClass}>{t(lang, "fitnessGoal")}</label>
                <div className="grid grid-cols-3 gap-3">
                  {goals.map(({ value, label, desc, color }) => (
                    <button
                      key={value}
                      onClick={() => setGoal(value)}
                      className={cn(
                        "rounded-xl p-3 text-center border transition-all duration-200",
                        goal === value
                          ? color === "emerald"
                            ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                            : color === "cyan"
                            ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400"
                            : "bg-rose-500/10 border-rose-500/50 text-rose-400"
                          : isDark
                          ? "bg-slate-800/40 border-slate-700/40 text-slate-400 hover:border-slate-600"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                      )}
                    >
                      <div className="text-sm font-bold">{label}</div>
                      <div className="text-xs mt-0.5 opacity-70">{desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCalculate}
                className="w-full rounded-xl py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-bold tracking-wide shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 hover:scale-[1.01] active:scale-100"
              >
                {t(lang, "calculateMyPlan")}
              </button>
            </>
          ) : preview ? (
            <>
              {/* Result Cards */}
              <div className="grid grid-cols-2 gap-4">
                <ResultCard
                  label={t(lang, "bmr")}
                  value={Math.round(
                    preview.tdee / (preview.activityLevel === "sedentary"
                      ? 1.2 : preview.activityLevel === "light"
                      ? 1.375 : preview.activityLevel === "moderate"
                      ? 1.55 : preview.activityLevel === "very_active"
                      ? 1.725 : 1.9)
                  ).toString()}
                  unit="kcal"
                  icon={<Flame className="h-4 w-4" />}
                  color="orange"
                  isDark={isDark}
                />
                <ResultCard
                  label={t(lang, "tdee")}
                  value={preview.tdee.toString()}
                  unit="kcal"
                  icon={<Target className="h-4 w-4" />}
                  color="yellow"
                  isDark={isDark}
                />
              </div>

              <div
                className={cn(
                  "rounded-2xl p-5 border",
                  isDark
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : "bg-emerald-50 border-emerald-200"
                )}
              >
                <p className={cn("text-xs font-semibold uppercase tracking-wider mb-4", isDark ? "text-emerald-400" : "text-emerald-600")}>
                  Daily Targets — {goal === "bulk" ? t(lang, "bulk") : goal === "cut" ? t(lang, "cut") : t(lang, "maintain")}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <MacroResult label={t(lang, "calories")} value={preview.targetCalories} unit="kcal" color="text-emerald-400" isDark={isDark} />
                  <MacroResult label={t(lang, "protein")} value={preview.targetProteinG} unit="g" color="text-cyan-400" isDark={isDark} />
                  <MacroResult label={t(lang, "carbs")} value={preview.targetCarbsG} unit="g" color="text-yellow-400" isDark={isDark} />
                  <MacroResult label={t(lang, "fats")} value={preview.targetFatsG} unit="g" color="text-orange-400" isDark={isDark} />
                </div>
                <div
                  className={cn(
                    "mt-3 pt-3 border-t flex items-center gap-3",
                    isDark ? "border-emerald-500/20" : "border-emerald-200"
                  )}
                >
                  <Droplets className="h-4 w-4 text-blue-400" />
                  <span className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
                    {t(lang, "water")}: <span className="font-bold text-blue-400">{preview.targetWaterL}L</span>
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("form")}
                  className={cn(
                    "flex-1 rounded-xl py-3 text-sm font-semibold border transition-all duration-200",
                    isDark
                      ? "border-slate-700 text-slate-400 hover:bg-slate-800"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  )}
                >
                  Back
                </button>
                <button
                  onClick={handleSave}
                  className="flex-[2] rounded-xl py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-bold tracking-wide shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200"
                >
                  {t(lang, "saveAndContinue")}
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ResultCard({
  label,
  value,
  unit,
  icon,
  color,
  isDark,
}: {
  label: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  color: string;
  isDark: boolean;
}) {
  const colorMap: Record<string, string> = {
    orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    yellow: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  };
  return (
    <div
      className={cn(
        "rounded-xl p-4 border",
        isDark ? "bg-slate-900/40" : "bg-slate-50",
        isDark ? "border-slate-700/50" : "border-slate-200"
      )}
    >
      <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg mb-2", colorMap[color])}>
        {icon}
      </div>
      <div className={cn("text-xs mb-1", isDark ? "text-slate-400" : "text-slate-500")}>{label}</div>
      <div className={cn("text-xl font-bold", isDark ? "text-slate-50" : "text-slate-900")}>
        {value} <span className="text-sm font-normal opacity-60">{unit}</span>
      </div>
    </div>
  );
}

function MacroResult({
  label,
  value,
  unit,
  color,
  isDark,
}: {
  label: string;
  value: number;
  unit: string;
  color: string;
  isDark: boolean;
}) {
  return (
    <div>
      <p className={cn("text-xs mb-0.5", isDark ? "text-slate-500" : "text-slate-500")}>{label}</p>
      <p className={cn("text-lg font-bold", color)}>
        {value} <span className="text-xs font-normal opacity-70">{unit}</span>
      </p>
    </div>
  );
}
