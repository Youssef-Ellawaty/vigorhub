"use client";

import { useState, useEffect } from "react";
import { Language, Theme, WorkoutSplit } from "@/lib/athlete-dashboard/types";
import Navbar from "@/athlete-dashboard/components/Navbar";
import SplitExplorer from "@/athlete-dashboard/components/SplitExplorer";
import CustomSplitCreator from "@/athlete-dashboard/components/CustomSplitCreator";
import LiveSession from "@/athlete-dashboard/components/LiveSession";

export default function VigorHubDashboard() {
  const [lang, setLang] = useState<Language>("en");
  const [theme, setTheme] = useState<Theme>("dark");
  const [activeModule, setActiveModule] = useState<"splits" | "live">("splits");
  const [activeSplit, setActiveSplit] = useState<WorkoutSplit | null>(null);
  const [customSplits, setCustomSplits] = useState<WorkoutSplit[]>([]);
  const [showCustomCreator, setShowCustomCreator] = useState(false);

  const isDark = theme === "dark";

  // Apply theme class to <html>
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove("light");
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
      html.classList.add("light");
    }
  }, [isDark]);

  // Apply RTL/LTR direction
  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const handleActivateSplit = (split: WorkoutSplit) => {
    setActiveSplit(split);
    setActiveModule("live");
  };

  const handleBackToSplits = () => {
    setActiveModule("splits");
    setActiveSplit(null);
  };

  const handleSaveCustomSplit = (split: WorkoutSplit) => {
    setCustomSplits((prev) => [...prev, split]);
    setShowCustomCreator(false);
  };

  return (
    <div className={`min-h-screen bg-background text-foreground ${isDark ? "dark" : "light"}`}>
      <Navbar
        lang={lang}
        theme={theme}
        onLangToggle={() => setLang((prev) => (prev === "en" ? "ar" : "en"))}
        onThemeToggle={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
        activeModule={activeModule}
        splitName={activeSplit?.name[lang]}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {activeModule === "splits" && (
          <SplitExplorer
            lang={lang}
            isDark={isDark}
            customSplits={customSplits}
            activeSplitId={null}
            onActivate={handleActivateSplit}
            onCreateCustom={() => setShowCustomCreator(true)}
          />
        )}

        {activeModule === "live" && activeSplit && (
          <LiveSession
            split={activeSplit}
            lang={lang}
            isDark={isDark}
            onBack={handleBackToSplits}
          />
        )}
      </main>

      {showCustomCreator && (
        <CustomSplitCreator
          lang={lang}
          isDark={isDark}
          onSave={handleSaveCustomSplit}
          onCancel={() => setShowCustomCreator(false)}
        />
      )}
    </div>
  );
}
