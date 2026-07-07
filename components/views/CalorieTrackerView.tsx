"use client";

import { useState, useCallback } from "react";
import {
  Activity,
  LayoutDashboard,
  UtensilsCrossed,
  Droplets,
  MessageSquare,
  Settings,
} from "lucide-react";
import { TDEECalculator } from "@/components/calorie-tracker/tdee-calculator";
import { MacroDashboard } from "@/components/calorie-tracker/macro-dashboard";
import { MealLogger } from "@/components/calorie-tracker/meal-logger";
import { AIChat } from "@/components/calorie-tracker/ai-chat";
import { WaterTracker } from "@/components/calorie-tracker/water-tracker";
import type {
  UserFitnessProfile,
  LoggedMealEntry,
  DailyTotals,
  Language,
} from "@/lib/calorie-tracker/types";
import { t } from "@/lib/calorie-tracker/i18n";
import { cn } from "@/lib/utils";

type Tab = "dashboard" | "meals" | "water" | "ai";

interface Props {
  lang: Language;
  isDark: boolean;
}

export default function CalorieTrackerView({ lang, isDark }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [showCalculator, setShowCalculator] = useState(false);
  const [profile, setProfile] = useState<UserFitnessProfile | null>(null);
  const [mealEntries, setMealEntries] = useState<LoggedMealEntry[]>([]);
  const [waterMl, setWaterMl] = useState(0);

  const isRTL = lang === "ar";

  const dailyTotals: DailyTotals = mealEntries.reduce(
    (acc, e) => ({
      calories: acc.calories + e.totalCalories,
      protein: acc.protein + e.totalProtein,
      carbs: acc.carbs + e.totalCarbs,
      fat: acc.fat + e.totalFat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const handleAddEntry = useCallback(
    (entry: Omit<LoggedMealEntry, "id" | "addedAt">) => {
      setMealEntries((prev) => [
        ...prev,
        { ...entry, id: crypto.randomUUID(), addedAt: new Date() },
      ]);
    },
    []
  );

  const handleDeleteEntry = useCallback((id: string) => {
    setMealEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const handleAddWater = useCallback((ml: number) => {
    setWaterMl((prev) => prev + ml);
  }, []);

  const TABS: {
    id: Tab;
    labelKey: "dashboard" | "meals" | "waterNav" | "aiAssistant";
    icon: typeof Activity;
  }[] = [
    { id: "dashboard", labelKey: "dashboard", icon: LayoutDashboard },
    { id: "meals", labelKey: "meals", icon: UtensilsCrossed },
    { id: "water", labelKey: "waterNav", icon: Droplets },
    { id: "ai", labelKey: "aiAssistant", icon: MessageSquare },
  ];

  const textPrimary = isDark ? "text-slate-50" : "text-slate-900";
  const textMuted = isDark ? "text-slate-400" : "text-slate-500";

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {/* Inner Tab Nav */}
      <div
        className={cn(
          "sticky top-0 z-30 border-b backdrop-blur-xl",
          isDark
            ? "bg-[#0b0f19]/80 border-slate-800/60"
            : "bg-white/80 border-slate-200"
        )}
      >
        <div className="mx-auto max-w-6xl px-4 py-2 flex items-center gap-1">
          {TABS.map(({ id, labelKey, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all",
                activeTab === id
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : isDark
                  ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t(lang, labelKey)}</span>
            </button>
          ))}

          <div className="ml-auto">
            <button
              onClick={() => setShowCalculator(true)}
              className={cn(
                "flex h-8 items-center gap-1.5 rounded-xl px-3 text-xs font-bold transition-all",
                profile
                  ? isDark
                    ? "border border-slate-700/60 text-slate-400 hover:bg-slate-800"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-100"
                  : "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20"
              )}
            >
              <Settings className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                {profile ? t(lang, "editProfile") : t(lang, "setupProfile")}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* Welcome banner */}
        {!profile && (
          <div
            className={cn(
              "mb-6 rounded-2xl border p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4",
              isDark
                ? "bg-emerald-500/5 border-emerald-500/15"
                : "bg-emerald-50 border-emerald-200"
            )}
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Activity className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-bold", isDark ? "text-slate-200" : "text-slate-800")}>
                {lang === "ar" ? "أهلاً بك في فيجور هاب!" : "Welcome to VigorHub!"}
              </p>
              <p className={cn("text-xs mt-0.5", textMuted)}>
                {t(lang, "noProfile")}
              </p>
            </div>
            <button
              onClick={() => setShowCalculator(true)}
              className="flex-shrink-0 rounded-xl px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all whitespace-nowrap"
            >
              {t(lang, "setupProfile")}
            </button>
          </div>
        )}

        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {profile ? (
              <MacroDashboard
                profile={profile}
                totals={dailyTotals}
                waterMl={waterMl}
                lang={lang}
                isDark={isDark}
                onEditProfile={() => setShowCalculator(true)}
              />
            ) : (
              <div
                className={cn(
                  "flex flex-col items-center justify-center rounded-2xl border p-12 gap-4",
                  isDark ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-slate-50"
                )}
              >
                <LayoutDashboard className={cn("h-12 w-12", isDark ? "text-slate-700" : "text-slate-300")} />
                <p className={cn("text-sm", textMuted)}>
                  {lang === "ar" ? "أنشئ ملفك الرياضي لعرض لوحة التحكم" : "Set up your profile to view your dashboard"}
                </p>
                <button
                  onClick={() => setShowCalculator(true)}
                  className="rounded-xl px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-bold"
                >
                  {t(lang, "setupProfile")}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "meals" && (
          <MealLogger
            lang={lang}
            isDark={isDark}
            entries={mealEntries}
            onAdd={handleAddEntry}
            onDelete={handleDeleteEntry}
          />
        )}

        {activeTab === "water" && (
          <div className="max-w-sm mx-auto">
            <WaterTracker
              lang={lang}
              isDark={isDark}
              waterMl={waterMl}
              targetL={profile?.targetWaterL ?? 2.5}
              onAdd={handleAddWater}
              onReset={() => setWaterMl(0)}
            />
          </div>
        )}

        {activeTab === "ai" && (
          <AIChat
            lang={lang}
            isDark={isDark}
            onAddToLog={handleAddEntry}
          />
        )}
      </main>

      {showCalculator && (
        <TDEECalculator
          lang={lang}
          isDark={isDark}
          initialProfile={profile}
          onSave={(p) => {
            setProfile(p);
            setShowCalculator(false);
          }}
          onClose={() => setShowCalculator(false)}
        />
      )}
    </div>
  );
}
