"use client";

import { useState, useEffect } from "react";
import ControlBar from "@/progress-analytics/components/dashboard/ControlBar";
import StatsBar from "@/progress-analytics/components/dashboard/StatsBar";
import WorkoutCharts from "@/progress-analytics/components/dashboard/WorkoutCharts";
import NutritionChart from "@/progress-analytics/components/dashboard/NutritionChart";
import type {
  DashboardFilters,
  ExerciseProgressLog,
  DailyCalorieLog,
  Language,
} from "@/progress-analytics/lib/dashboard-types";
import {
  MOCK_EXERCISES,
  generateMockProgressLogs,
  ALL_CALORIE_LOGS,
} from "@/progress-analytics/lib/dashboard-types";

interface Props {
  lang: Language;
  isDark: boolean;
}

export default function ProgressAnalyticsView({ lang, isDark }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: "last90",
    selectedExerciseId: "bench",
  });

  const [progressLogs, setProgressLogs] = useState<ExerciseProgressLog[]>([]);
  const [calorieLogs, setCalorieLogs] = useState<DailyCalorieLog[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const days =
        filters.dateRange === "last30" ? 30
        : filters.dateRange === "last90" ? 90
        : 180;

      if (filters.selectedExerciseId) {
        setProgressLogs(generateMockProgressLogs(filters.selectedExerciseId, days));
      } else {
        setProgressLogs([]);
      }

      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      setCalorieLogs(ALL_CALORIE_LOGS.filter((l) => new Date(l.date) >= cutoff));

      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [filters]);

  const selectedExercise = MOCK_EXERCISES.find(
    (e) => e.id === filters.selectedExerciseId
  );
  const exerciseName = selectedExercise
    ? lang === "ar"
      ? selectedExercise.nameAr
      : selectedExercise.name
    : null;

  const isRtl = lang === "ar";

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="flex flex-col min-h-0">
      <ControlBar
        filters={filters}
        exercises={MOCK_EXERCISES}
        lang={lang}
        onFiltersChange={setFilters}
      />

      <div className="pt-5">
        <StatsBar logs={progressLogs} lang={lang} />
      </div>

      <WorkoutCharts
        logs={progressLogs}
        lang={lang}
        isLoading={isLoading}
        exerciseName={exerciseName}
      />

      <NutritionChart
        logs={calorieLogs}
        lang={lang}
        isLoading={isLoading}
      />
    </div>
  );
}
