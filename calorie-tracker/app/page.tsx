"use client";

import { useState, useCallback } from "react";
import {
  Activity,
  LayoutDashboard,
  UtensilsCrossed,
  Droplets,
  MessageSquare,
  Settings,
  Sun,
  Moon,
  Globe,
  Zap,
} from "lucide-react";
import { TDEECalculator } from "@/calorie-tracker/components/tdee-calculator";
import { MacroDashboard } from "@/calorie-tracker/components/macro-dashboard";
import { MealLogger } from "@/calorie-tracker/components/meal-logger";
import { AIChat } from "@/calorie-tracker/components/ai-chat";
import { WaterTracker } from "@/calorie-tracker/components/water-tracker";
import type {
  UserFitnessProfile,
  LoggedMealEntry,
  DailyTotals,
  Language,
} from "@/lib/calorie-tracker/types";
import { t } from "@/lib/calorie-tracker/i18n";
import { cn } from "@/lib/utils";

type Tab = "dashboard" | "meals" | "water" | "ai";

export default function VigorHub() {
  const [lang, setLang] = useState<Language>("en");
  const [isDark, setIsDark] = useState(true);
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

  const bg = isDark ? "bg-[#0B0F19]" : "bg-slate-50";
  const textPrimary = isDark ? "text-slate-50" : "text-slate-900";
  const textMuted = isDark ? "text-slate-400" : "text-slate-500";

  return (
    <div
      className={cn("min-h-screen font-sans transition-colors duration-300", bg)}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Background ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -left-40 h-96 w-96 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #10b981, transparent)" }}
        />
        <div
          className="absolute top-1/2 -right-20 h-96 w-96 rounded-full opacity-4"
          style={{ background: "radial-gradient(circle, #06b6d4, transparent)" }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full opacity-3"
          style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }}
        />
      </div>

      {/* ── Navbar ──────────────────────────────────────────── */}
      <header
        className={cn(
          "sticky top-0 z-40 border-b backdrop-blur-xl",
          isDark
            ? "bg-[#0B0F19]/80 border-slate-800/60"
            : "bg-white/80 border-slate-200"
        )}
      >
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/25">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className={cn("text-base font-black tracking-tight", textPrimary)}>
                {t(lang, "appName")}
              </span>
              <p className={cn("hidden sm:block text-[10px] font-medium leading-none mt-0.5", textMuted)}>
                {t(lang, "appTagline")}
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
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
                {t(lang, labelKey)}
              </button>
            ))}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Live kcal preview */}
            {profile && (
              <div
                className={cn(
                  "hidden lg:flex items-center gap-1.5 rounded-xl px-3 py-1.5 border text-xs",
                  isDark
                    ? "bg-slate-800/50 border-slate-700/50"
                    : "bg-slate-50 border-slate-200"
                )}
              >
                <span className="text-emerald-400 font-bold">
                  {Math.round(dailyTotals.calories)}
                </span>
                <span className={cn("font-normal", textMuted)}>/</span>
                <span className={cn("font-semibold", isDark ? "text-slate-300" : "text-slate-600")}>
                  {profile.targetCalories}
                </span>
                <span className={cn("text-[10px]", textMuted)}>kcal</span>
              </div>
            )}

            {/* Language toggle */}
            <button
              onClick={() => setLang((l) => (l === "en" ? "ar" : "en"))}
              className={cn(
                "flex h-8 items-center gap-1.5 rounded-xl px-2.5 text-xs font-semibold border transition-all",
                isDark
                  ? "border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  : "border-slate-200 text-slate-600 hover:bg-slate-100"
              )}
            >
              <Globe className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                {lang === "en" ? "عربي" : "EN"}
              </span>
            </button>

            {/* Theme toggle */}
            <button
              onClick={() => setIsDark((d) => !d)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-xl border transition-all",
                isDark
                  ? "border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  : "border-slate-200 text-slate-600 hover:bg-slate-100"
              )}
            >
              {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>

            {/* Setup / edit profile */}
            <button
              onClick={() => setShowCalculator(true)}
              className={cn(
                "flex h-8 items-center gap-1.5 rounded-xl px-3 text-xs font-bold transition-all",
                profile
                  ? isDark
                    ? "border border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-100"
                  : "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35"
              )}
            >
              <Settings className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                {profile ? t(lang, "editProfile") : t(lang, "setupProfile")}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ────────────────────────────────────── */}
      <main className="mx-auto max-w-6xl px-4 py-6">

        {/* Welcome banner — no profile */}
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

        {/* ── Dashboard Tab ── */}
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
              <EmptyProfileCard lang={lang} isDark={isDark} onSetup={() => setShowCalculator(true)} />
            )}

            {/* Lower summary grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Recent meals */}
              <div
                className={cn(
                  "lg:col-span-2 rounded-2xl border p-5",
                  isDark
                    ? "bg-slate-900/50 border-slate-700/40 backdrop-blur-md"
                    : "bg-white/80 border-slate-200 backdrop-blur-md"
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className={cn("text-sm font-bold", textPrimary)}>
                    {lang === "ar" ? "ملخص اليوم" : "Today's Meals"}
                  </h3>
                  <button
                    onClick={() => setActiveTab("meals")}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    {lang === "ar" ? "إضافة وجبة ←" : "Log food →"}
                  </button>
                </div>
                {mealEntries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <UtensilsCrossed className={cn("h-8 w-8", isDark ? "text-slate-700" : "text-slate-300")} />
                    <p className={cn("text-sm", textMuted)}>
                      {lang === "ar" ? "لا توجد وجبات مسجلة اليوم" : "No meals logged today"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {mealEntries.slice(-6).map((entry) => (
                      <div
                        key={entry.id}
                        className={cn(
                          "flex items-center justify-between rounded-xl px-3 py-2.5 border",
                          isDark
                            ? "bg-slate-800/30 border-slate-700/30"
                            : "bg-slate-50 border-slate-100"
                        )}
                      >
                        <div>
                          <span className={cn("text-xs font-semibold", isDark ? "text-slate-300" : "text-slate-700")}>
                            {lang === "ar" ? entry.foodItem.nameAr : entry.foodItem.nameEn}
                          </span>
                          <span className={cn("ml-2 text-[11px]", textMuted)}>
                            {entry.quantity}{entry.foodItem.type === "raw" ? "g" : " unit(s)"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={cn("text-[11px]", textMuted)}>
                            P:{entry.totalProtein}g C:{entry.totalCarbs}g
                          </span>
                          <span className="text-xs font-bold text-emerald-400">
                            {entry.totalCalories} kcal
                          </span>
                        </div>
                      </div>
                    ))}
                    {mealEntries.length > 6 && (
                      <p className={cn("text-xs text-center pt-1", textMuted)}>
                        +{mealEntries.length - 6} {lang === "ar" ? "عناصر أخرى" : "more items"}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Water mini card */}
              <div
                className={cn(
                  "rounded-2xl border p-5 flex flex-col gap-4",
                  isDark
                    ? "bg-slate-900/50 border-slate-700/40 backdrop-blur-md"
                    : "bg-white/80 border-slate-200 backdrop-blur-md"
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className={cn("text-sm font-bold", textPrimary)}>
                    {t(lang, "waterIntake")}
                  </h3>
                  <button
                    onClick={() => setActiveTab("water")}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {lang === "ar" ? "إضافة ←" : "Log →"}
                  </button>
                </div>

                {/* Mini water visual */}
                <div className="flex items-end gap-3">
                  <div className={cn("relative h-20 w-12 rounded-xl border overflow-hidden", isDark ? "border-slate-700/50 bg-slate-800/50" : "border-blue-200 bg-blue-50/50")}>
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500/40 to-cyan-400/20 transition-all duration-700"
                      style={{
                        height: `${Math.min(
                          (waterMl / ((profile?.targetWaterL ?? 2.5) * 1000)) * 100,
                          100
                        )}%`,
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Droplets className={cn("h-4 w-4", waterMl > 0 ? "text-blue-400" : isDark ? "text-slate-600" : "text-slate-300")} />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-blue-400">
                      {(waterMl / 1000).toFixed(1)}
                      <span className={cn("text-sm font-normal ml-0.5", textMuted)}>L</span>
                    </p>
                    <p className={cn("text-xs", textMuted)}>
                      {lang === "ar" ? "من" : "of"} {profile?.targetWaterL ?? "—"}L {lang === "ar" ? "يومياً" : "daily"}
                    </p>
                    <div className={cn("mt-2 h-1.5 w-32 rounded-full overflow-hidden", isDark ? "bg-slate-800" : "bg-slate-100")}>
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-700"
                        style={{ width: `${Math.min((waterMl / ((profile?.targetWaterL ?? 2.5) * 1000)) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAddWater(250)}
                    className={cn(
                      "rounded-xl py-2 text-xs font-bold border transition-all hover:scale-[1.02] active:scale-100",
                      isDark
                        ? "bg-blue-500/8 border-blue-500/20 text-blue-300 hover:bg-blue-500/15"
                        : "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
                    )}
                  >
                    +250ml
                  </button>
                  <button
                    onClick={() => handleAddWater(500)}
                    className={cn(
                      "rounded-xl py-2 text-xs font-bold border transition-all hover:scale-[1.02] active:scale-100",
                      isDark
                        ? "bg-cyan-500/8 border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/15"
                        : "bg-cyan-50 border-cyan-200 text-cyan-600 hover:bg-cyan-100"
                    )}
                  >
                    +500ml
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Meals Tab ── */}
        {activeTab === "meals" && (
          <MealLogger
            lang={lang}
            isDark={isDark}
            entries={mealEntries}
            onAdd={handleAddEntry}
            onDelete={handleDeleteEntry}
          />
        )}

        {/* ── Water Tab ── */}
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

        {/* ── AI Tab ── */}
        {activeTab === "ai" && (
          <AIChat
            lang={lang}
            isDark={isDark}
            onAddToLog={handleAddEntry}
          />
        )}
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <nav
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 md:hidden border-t backdrop-blur-xl",
          isDark
            ? "bg-[#0B0F19]/90 border-slate-800/60"
            : "bg-white/90 border-slate-200"
        )}
      >
        <div className="flex items-center justify-around px-2 py-2 pb-safe" dir={isRTL ? "rtl" : "ltr"}>
          {TABS.map(({ id, labelKey, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all",
                activeTab === id
                  ? "text-emerald-400"
                  : isDark
                  ? "text-slate-500 hover:text-slate-400"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-transform",
                  activeTab === id && "scale-110"
                )}
              />
              <span className="text-[10px] font-semibold">{t(lang, labelKey)}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Bottom padding for mobile nav */}
      <div className="h-20 md:h-6" />

      {/* ── TDEE Calculator Modal ── */}
      {showCalculator && (
        <TDEECalculator
          lang={lang}
          isDark={isDark}
          onSave={setProfile}
          onClose={() => setShowCalculator(false)}
          initialProfile={profile}
        />
      )}
    </div>
  );
}

function EmptyProfileCard({
  lang,
  isDark,
  onSetup,
}: {
  lang: Language;
  isDark: boolean;
  onSetup: () => void;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border-2 border-dashed p-12 flex flex-col items-center gap-5 text-center",
        isDark ? "border-slate-800 bg-slate-900/20" : "border-slate-200 bg-slate-50/50"
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
        <Activity className="h-7 w-7 text-emerald-400" />
      </div>
      <div>
        <p className={cn("text-base font-bold mb-1.5", isDark ? "text-slate-200" : "text-slate-800")}>
          {lang === "ar" ? "ابدأ بإعداد ملفك الشخصي" : "Set up your fitness profile"}
        </p>
        <p className={cn("text-sm max-w-xs leading-relaxed", isDark ? "text-slate-500" : "text-slate-500")}>
          {lang === "ar"
            ? "أدخل معلوماتك لحساب احتياجاتك اليومية من السعرات والماكروز والمياه"
            : "Enter your details to calculate your personalized daily calorie, macro & water targets using the Mifflin-St Jeor equation."}
        </p>
      </div>
      <button
        onClick={onSetup}
        className="rounded-xl px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all hover:scale-[1.02] active:scale-100"
      >
        {t(lang, "calculateMyPlan")}
      </button>
    </div>
  );
}
