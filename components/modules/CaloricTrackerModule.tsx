'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import type { Language, Theme } from '@/lib/types'
import type { LoggedMealEntry, UserFitnessProfile, DailyTotals } from '@/calorie-tracker/lib/types'

// Dynamically import calorie tracker components
const MacroDashboard = dynamic(() => import('@/calorie-tracker/components/macro-dashboard'), { ssr: false })
const MealLogger = dynamic(() => import('@/calorie-tracker/components/meal-logger'), { ssr: false })
const WaterTracker = dynamic(() => import('@/calorie-tracker/components/water-tracker'), { ssr: false })
const AIChat = dynamic(() => import('@/calorie-tracker/components/ai-chat'), { ssr: false })
const TDEECalculator = dynamic(() => import('@/calorie-tracker/components/tdee-calculator'), { ssr: false })

interface CaloricTrackerModuleProps {
  lang: Language
  theme: Theme
}

type Tab = 'dashboard' | 'meals' | 'water' | 'ai'

export default function CaloricTrackerModule({ lang, theme }: CaloricTrackerModuleProps) {
  const isDark = theme === 'dark'
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [showCalculator, setShowCalculator] = useState(false)
  const [profile, setProfile] = useState<UserFitnessProfile | null>(null)
  const [mealEntries, setMealEntries] = useState<LoggedMealEntry[]>([])
  const [waterMl, setWaterMl] = useState(0)

  const isRTL = lang === 'ar'

  const dailyTotals: DailyTotals = mealEntries.reduce(
    (acc, e) => ({
      calories: acc.calories + e.totalCalories,
      protein: acc.protein + e.totalProtein,
      carbs: acc.carbs + e.totalCarbs,
      fat: acc.fat + e.totalFat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  const handleAddEntry = useCallback((entry: Omit<LoggedMealEntry, 'id' | 'addedAt'>) => {
    setMealEntries((prev) => [...prev, { ...entry, id: crypto.randomUUID(), addedAt: new Date() }])
  }, [])

  const handleDeleteEntry = useCallback((id: string) => {
    setMealEntries((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const handleAddWater = useCallback((ml: number) => {
    setWaterMl((prev) => prev + ml)
  }, [])

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0B0F19]' : 'bg-slate-50'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Tab Navigation */}
        <div className={`mb-6 flex gap-2 overflow-x-auto pb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {(['dashboard', 'meals', 'water', 'ai'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${
                activeTab === tab
                  ? isDark
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : isDark
                  ? 'bg-slate-800/50 text-slate-400 hover:text-slate-200'
                  : 'bg-white text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'dashboard' && (lang === 'ar' ? 'لوحة التحكم' : 'Dashboard')}
              {tab === 'meals' && (lang === 'ar' ? 'الوجبات' : 'Meals')}
              {tab === 'water' && (lang === 'ar' ? 'الماء' : 'Water')}
              {tab === 'ai' && (lang === 'ar' ? 'مساعد ذكي' : 'AI Assistant')}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <MacroDashboard
            profile={profile}
            totals={dailyTotals}
            waterMl={waterMl}
            lang={lang}
            isDark={isDark}
            onEditProfile={() => setShowCalculator(true)}
          />
        )}

        {activeTab === 'meals' && <MealLogger lang={lang} isDark={isDark} entries={mealEntries} onAdd={handleAddEntry} onDelete={handleDeleteEntry} />}

        {activeTab === 'water' && (
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

        {activeTab === 'ai' && <AIChat lang={lang} isDark={isDark} onAddToLog={handleAddEntry} />}
      </div>

      {showCalculator && <TDEECalculator isDark={isDark} onSave={(p) => { setProfile(p); setShowCalculator(false) }} onClose={() => setShowCalculator(false)} />}
    </div>
  )
}
