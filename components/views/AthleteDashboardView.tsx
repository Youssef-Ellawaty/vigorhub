"use client";

import { useState, useEffect } from "react";
import type { Language, Theme, WorkoutSplit } from "@/lib/athlete-dashboard/types";
import SplitExplorer from "@/athlete-dashboard/components/SplitExplorer";
import CustomSplitCreator from "@/athlete-dashboard/components/CustomSplitCreator";
import LiveSession from "@/athlete-dashboard/components/LiveSession";
import { WORKOUT_SPLITS } from "@/lib/athlete-dashboard/data";

interface Props {
  lang: Language;
  isDark: boolean;
  activeUser: any;
  onUpdateUser: (newUser: any) => void;
}

export default function AthleteDashboardView({ lang, isDark, activeUser, onUpdateUser }: Props) {
  const [activeModule, setActiveModule] = useState<"splits" | "live">("splits");
  const [activeSplit, setActiveSplit] = useState<WorkoutSplit | null>(null);
  const [customSplits, setCustomSplits] = useState<WorkoutSplit[]>([]);
  const [showCustomCreator, setShowCustomCreator] = useState(false);
  const [activeSplitId, setActiveSplitId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load custom splits & active split from DB and localStorage
  useEffect(() => {
    if (!activeUser?.id) return;

    // Load from localStorage first (for instant responsive UI)
    const localActiveId = localStorage.getItem(`vigorhub_active_split_id_${activeUser.id}`);
    if (localActiveId) {
      setActiveSplitId(localActiveId);
      const allSplits = [...WORKOUT_SPLITS, ...customSplits];
      const found = allSplits.find(s => s.id === localActiveId);
      if (found) {
        setActiveSplit(found);
      }
    }

    const fetchWorkoutState = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/workout-state?userId=${activeUser.id}`);
        const data = await res.json();
        
        if (data.success) {
          // Parse database splits
          const dbCustomSplits: WorkoutSplit[] = (data.customSplits || []).map((cs: any) => {
            try {
              return {
                id: cs.id,
                name: { en: cs.name, ar: cs.name },
                daysPerWeek: 0, // calculated from days
                level: "intermediate" as const,
                description: { en: cs.description || "", ar: cs.description || "" },
                days: JSON.parse(cs.days),
                isCustom: true,
              };
            } catch (err) {
              return null;
            }
          }).filter(Boolean) as WorkoutSplit[];

          setCustomSplits(dbCustomSplits);

          if (data.activeSplitId) {
            setActiveSplitId(data.activeSplitId);
            localStorage.setItem(`vigorhub_active_split_id_${activeUser.id}`, data.activeSplitId);
            
            const allSplits = [...WORKOUT_SPLITS, ...dbCustomSplits];
            const found = allSplits.find(s => s.id === data.activeSplitId);
            if (found) {
              setActiveSplit(found);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch workout state:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutState();
  }, [activeUser?.id]);

  const handleActivateSplit = async (split: WorkoutSplit) => {
    setActiveSplit(split);
    setActiveSplitId(split.id);
    setActiveModule("live");

    if (activeUser?.id) {
      localStorage.setItem(`vigorhub_active_split_id_${activeUser.id}`, split.id);
      try {
        await fetch("/api/user/workout-state", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "set_active_split",
            userId: activeUser.id,
            activeSplitId: split.id,
          }),
        });
      } catch (err) {
        console.error("Failed to save active split:", err);
      }
    }
  };

  const handleBackToSplits = () => {
    setActiveModule("splits");
  };

  const handleSaveCustomSplit = async (split: WorkoutSplit) => {
    // Save to local state
    setCustomSplits((prev) => [...prev, split]);
    setShowCustomCreator(false);

    // Save to database
    if (activeUser?.id) {
      try {
        const res = await fetch("/api/user/workout-state", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "save_custom_split",
            userId: activeUser.id,
            split: {
              name: split.name.en,
              description: split.description.en,
              days: split.days,
            }
          }),
        });
        const data = await res.json();
        if (data.success && data.split) {
          // Update local splits list with database ID
          const parsedSplit: WorkoutSplit = {
            id: data.split.id,
            name: { en: data.split.name, ar: data.split.name },
            daysPerWeek: split.days.length,
            level: "intermediate" as const,
            description: { en: data.split.description || "", ar: data.split.description || "" },
            days: split.days,
            isCustom: true,
          };
          setCustomSplits(prev => prev.map(s => s.id === split.id ? parsedSplit : s));
        }
      } catch (err) {
        console.error("Failed to save custom split:", err);
      }
    }
  };

  return (
    <div className="relative">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {activeModule === "splits" && (
          <SplitExplorer
            lang={lang}
            isDark={isDark}
            customSplits={customSplits}
            activeSplitId={activeSplitId}
            onActivate={handleActivateSplit}
            onCreateCustom={() => setShowCustomCreator(true)}
          />
        )}
        {activeModule === "live" && activeSplit && (
          <LiveSession
            split={activeSplit}
            lang={lang}
            isDark={isDark}
            activeUser={activeUser}
            onUpdateUser={onUpdateUser}
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
