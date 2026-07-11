'use client'

import { Dumbbell, TrendingUp } from 'lucide-react'
import type { Language } from '@/progress-analytics/lib/dashboard-types'
import { t } from '@/progress-analytics/lib/i18n'

export function ChartSkeleton() {
  return (
    <div className="w-full h-full flex flex-col gap-3 animate-pulse p-4">
      <div className="h-4 w-1/3 rounded-md bg-muted" />
      <div className="h-3 w-1/2 rounded-md bg-muted/60" />
      <div className="flex-1 rounded-xl bg-muted/40 mt-2" />
      <div className="flex gap-4 justify-end">
        {[1, 2].map(i => (
          <div key={i} className="h-3 w-16 rounded bg-muted/50" />
        ))}
      </div>
    </div>
  )
}

export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`glass-card rounded-2xl overflow-hidden ${className}`}>
      <ChartSkeleton />
    </div>
  )
}

interface EmptyStateProps {
  lang: Language
  title?: string
  message?: string
  motivation?: string
  icon?: 'dumbbell' | 'trend'
}

export function EmptyState({ lang, title, message, motivation, icon = 'dumbbell' }: EmptyStateProps) {
  const Icon = icon === 'dumbbell' ? Dumbbell : TrendingUp
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[180px] gap-3 text-center p-6">
      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary/60" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">
          {title ?? t(lang, 'noDataTitle')}
        </p>
        <p className="text-xs text-muted-foreground max-w-[240px] leading-relaxed">
          {message ?? t(lang, 'noDataMsg')}
        </p>
      </div>
      {(motivation ?? t(lang, 'noDataMotivation')) && (
        <p className="text-[11px] font-medium text-primary/70 italic max-w-[200px]">
          &ldquo;{motivation ?? t(lang, 'noDataMotivation')}&rdquo;
        </p>
      )}
    </div>
  )
}
