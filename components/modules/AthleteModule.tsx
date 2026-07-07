'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import type { Language, Theme } from '@/lib/types'

// Dynamically import the athlete dashboard components to avoid SSR issues
const SplitExplorer = dynamic(() => import('@/athlete-dashboard/components/SplitExplorer'), { ssr: false })
const CustomSplitCreator = dynamic(() => import('@/athlete-dashboard/components/CustomSplitCreator'), { ssr: false })
const LiveSession = dynamic(() => import('@/athlete-dashboard/components/LiveSession'), { ssr: false })

import type { WorkoutSplit } from '@/athlete-dashboard/lib/types'

interface AthleteModuleProps {
  lang: Language
  isDark: boolean
}

export default function AthleteModule({ lang, isDark }: AthleteModuleProps) {
  const [activeModule, setActiveModule] = useState<'splits' | 'live'>('splits')
  const [activeSplit, setActiveSplit] = useState<WorkoutSplit | null>(null)
  const [customSplits, setCustomSplits] = useState<WorkoutSplit[]>([])
  const [showCustomCreator, setShowCustomCreator] = useState(false)

  const handleActivateSplit = (split: WorkoutSplit) => {
    setActiveSplit(split)
    setActiveModule('live')
  }

  const handleBackToSplits = () => {
    setActiveModule('splits')
    setActiveSplit(null)
  }

  const handleSaveCustomSplit = (split: WorkoutSplit) => {
    setCustomSplits((prev) => [...prev, split])
    setShowCustomCreator(false)
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-background' : 'bg-slate-50'} text-foreground`}>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {activeModule === 'splits' && (
          <SplitExplorer
            lang={lang}
            isDark={isDark}
            customSplits={customSplits}
            onActivate={handleActivateSplit}
            onCreateCustom={() => setShowCustomCreator(true)}
          />
        )}

        {activeModule === 'live' && activeSplit && (
          <LiveSession split={activeSplit} lang={lang} isDark={isDark} onBack={handleBackToSplits} />
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
  )
}
