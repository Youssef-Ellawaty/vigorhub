'use client'

import { useState, useEffect } from 'react'
import DashboardHeader from '@/progress-analytics/components/dashboard/DashboardHeader'
import ControlBar from '@/progress-analytics/components/dashboard/ControlBar'
import StatsBar from '@/progress-analytics/components/dashboard/StatsBar'
import WorkoutCharts from '@/progress-analytics/components/dashboard/WorkoutCharts'
import NutritionChart from '@/progress-analytics/components/dashboard/NutritionChart'
import type {
  DashboardFilters,
  ExerciseProgressLog,
  DailyCalorieLog,
  Language,
  Theme,
} from '@/progress-analytics/lib/dashboard-types'
import {
  MOCK_EXERCISES,
  generateMockProgressLogs,
  ALL_CALORIE_LOGS,
} from '@/progress-analytics/lib/dashboard-types'

export default function DashboardPage() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [lang, setLang] = useState<Language>('en')
  const [isLoading, setIsLoading] = useState(false)

  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: 'last90',
    selectedExerciseId: 'bench',
  })

  const [progressLogs, setProgressLogs] = useState<ExerciseProgressLog[]>([])
  const [calorieLogs, setCalorieLogs] = useState<DailyCalorieLog[]>([])

  // Apply theme class to html element
  useEffect(() => {
    const html = document.documentElement
    if (theme === 'dark') {
      html.classList.remove('light')
    } else {
      html.classList.add('light')
    }
  }, [theme])

  // Simulate async data fetch when filters change
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      const days =
        filters.dateRange === 'last30' ? 30
        : filters.dateRange === 'last90' ? 90
        : 180

      if (filters.selectedExerciseId) {
        setProgressLogs(generateMockProgressLogs(filters.selectedExerciseId, days))
      } else {
        setProgressLogs([])
      }

      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - days)
      setCalorieLogs(ALL_CALORIE_LOGS.filter(l => new Date(l.date) >= cutoff))

      setIsLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [filters])

  const selectedExercise = MOCK_EXERCISES.find(e => e.id === filters.selectedExerciseId)
  const exerciseName = selectedExercise
    ? (lang === 'ar' ? selectedExercise.nameAr : selectedExercise.name)
    : null

  const isRtl = lang === 'ar'

  return (
    <main dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-background flex flex-col">

      <DashboardHeader
        theme={theme}
        lang={lang}
        onToggleTheme={() => setTheme(p => (p === 'dark' ? 'light' : 'dark'))}
        onToggleLang={() => setLang(p => (p === 'en' ? 'ar' : 'en'))}
      />

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

      <footer
        dir={isRtl ? 'rtl' : 'ltr'}
        className="mt-auto px-6 py-4 border-t border-border/30 flex items-center justify-between"
      >
        <p className="text-[11px] text-muted-foreground">
          {lang === 'ar'
            ? 'فيغور هاب — بيانات التطور الرياضي'
            : 'VigorHub — Athlete Performance Analytics'}
        </p>
        <p className="text-[11px] text-muted-foreground">
          {lang === 'ar' ? 'جاهز للاتصال بقاعدة البيانات' : 'Database-ready architecture'}
        </p>
      </footer>
    </main>
  )
}
