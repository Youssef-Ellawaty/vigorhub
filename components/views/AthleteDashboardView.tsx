"use client";

import { useState } from "react";
import type { Language, Theme, WorkoutSplit } from "@/lib/athlete-dashboard/types";
import SplitExplorer from "@/components/athlete-dashboard/SplitExplorer";
import CustomSplitCreator from "@/components/athlete-dashboard/CustomSplitCreator";
import LiveSession from "@/components/athlete-dashboard/LiveSession";

interface Props {
  lang: Language;
  isDark: boolean;
}

export default function AthleteDashboardView({ lang, isDark }: Props) {
  const [activeModule, setActiveModule] = useState<"splits" | "live">("splits");
  const [activeSplit, setActiveSplit] = useState<WorkoutSplit | null>(null);
  const [customSplits, setCustomSplits] = useState<WorkoutSplit[]>([]);
  const [showCustomCreator, setShowCustomCreator] = useState(false);

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
    <div className="relative">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {activeModule === "splits" && (
          <SplitExplorer
            lang={lang}
            isDark={isDark}
            customSplits={customSplits}
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
