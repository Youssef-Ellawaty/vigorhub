'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import type { Language, Theme } from '@/progress-analytics/lib/dashboard-types'
import {
  MOCK_EXERCISES,
  generateMockProgressLogs,
  ALL_CALORIE_LOGS,
  type DashboardFilters,
  type ExerciseProgressLog,
  type DailyCalorieLog,
} from '@/progress-analytics/lib/dashboard-types'

// Dynamically import analytics components
const DashboardHeader = dynamic(() => import('@/progress-analytics/components/dashboard/DashboardHeader'), { ssr: false })
const ControlBar = dynamic(() => import('@/progress-analytics/components/dashboard/ControlBar'), { ssr: false })
const StatsBar = dynamic(() => import('@/progress-analytics/components/dashboard/StatsBar'), { ssr: false })
const WorkoutCharts = dynamic(() => import('@/progress-analytics/components/dashboard/WorkoutCharts'), { ssr: false })
const NutritionChart = dynamic(() => import('@/progress-analytics/components/dashboard/NutritionChart'), { ssr: false })

interface ProgressAnalyticsModuleProps {
  lang: Language
  isDark: boolean
}

export default function ProgressAnalyticsModule({ lang, isDark }: ProgressAnalyticsModuleProps) {
  const [theme] = useState<Theme>(isDark ? 'dark' : 'light')
  const [isLoading, setIsLoading] = useState(false)

  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: 'last90',
    selectedExerciseId: 'bench',
  })

  const [progressLogs, setProgressLogs] = useState<ExerciseProgressLog[]>([])
  const [calorieLogs, setCalorieLogs] = useState<DailyCalorieLog[]>([])

  // Simulate async data fetch when filters change
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      const days =
        filters.dateRange === 'last30' ? 30 : filters.dateRange === 'last90' ? 90 : 180

      if (filters.selectedExerciseId) {
        setProgressLogs(generateMockProgressLogs(filters.selectedExerciseId, days))
      } else {
        setProgressLogs([])
      }

      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - days)
      setCalorieLogs(ALL_CALORIE_LOGS.filter((l) => new Date(l.date) >= cutoff))

      setIsLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [filters])

  const selectedExercise = MOCK_EXERCISES.find((e) => e.id === filters.selectedExerciseId)
  const exerciseName = selectedExercise ? (lang === 'ar' ? selectedExercise.nameAr : selectedExercise.name) : null

  const isRtl = lang === 'ar'

  return (
    <main dir={isRtl ? 'rtl' : 'ltr'} className={`min-h-screen ${isDark ? 'bg-background' : 'bg-background'} flex flex-col`}>
      <div className="pt-5 px-4 sm:px-6">
        <ControlBar filters={filters} exercises={MOCK_EXERCISES} lang={lang} onFiltersChange={setFilters} />
      </div>

      <div className="pt-5 px-4 sm:px-6">
        <StatsBar logs={progressLogs} lang={lang} />
      </div>

      <div className="px-4 sm:px-6">
        <WorkoutCharts
          logs={progressLogs}
          lang={lang}
          isLoading={isLoading}
          exerciseName={exerciseName}
        />
      </div>

      <div className="px-4 sm:px-6">
        <NutritionChart logs={calorieLogs} lang={lang} isLoading={isLoading} />
      </div>

      <footer dir={isRtl ? 'rtl' : 'ltr'} className="mt-auto px-6 py-4 border-t border-border/30 flex items-center justify-between">
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
