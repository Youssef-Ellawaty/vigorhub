'use client'

import { TrendingUp, Weight, Repeat2, Layers } from 'lucide-react'
import type { ExerciseProgressLog, Language } from '@/progress-analytics/lib/dashboard-types'
import { t } from '@/progress-analytics/lib/i18n'

interface StatsBarProps {
  logs: ExerciseProgressLog[]
  lang: Language
}

export default function StatsBar({ logs, lang }: StatsBarProps) {
  if (logs.length === 0) return null

  const maxWeight = Math.max(...logs.map(l => l.maxWeightKg))
  const totalSets = logs.reduce((s, l) => s + l.totalSets, 0)
  const maxReps = Math.max(...logs.map(l => l.maxReps))
  const firstWeight = logs[0]?.maxWeightKg ?? 0
  const lastWeight = logs[logs.length - 1]?.maxWeightKg ?? 0
  const progressPct = firstWeight > 0 ? Math.round(((lastWeight - firstWeight) / firstWeight) * 100) : 0

  const isRtl = lang === 'ar'

  const stats = [
    {
      icon: Weight,
      label: t(lang, 'max') + ' ' + t(lang, 'weightKg'),
      value: `${maxWeight} kg`,
      color: 'text-primary',
      glow: 'shadow-[0_0_12px_rgba(0,229,255,0.2)]',
      bg: 'bg-primary/10 border-primary/20',
    },
    {
      icon: Layers,
      label: t(lang, 'sets'),
      value: totalSets.toString(),
      color: 'text-accent',
      glow: 'shadow-[0_0_12px_rgba(16,185,129,0.2)]',
      bg: 'bg-accent/10 border-accent/20',
    },
    {
      icon: Repeat2,
      label: t(lang, 'max') + ' ' + t(lang, 'reps'),
      value: maxReps.toString(),
      color: 'text-amber-400',
      glow: 'shadow-[0_0_12px_rgba(245,158,11,0.2)]',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      icon: TrendingUp,
      label: lang === 'ar' ? 'التطور الكلي' : 'Overall Progress',
      value: `${progressPct > 0 ? '+' : ''}${progressPct}%`,
      color: progressPct >= 0 ? 'text-emerald-400' : 'text-red-400',
      glow: progressPct >= 0
        ? 'shadow-[0_0_12px_rgba(16,185,129,0.2)]'
        : 'shadow-[0_0_12px_rgba(239,68,68,0.2)]',
      bg: progressPct >= 0
        ? 'bg-emerald-500/10 border-emerald-500/20'
        : 'bg-red-500/10 border-red-500/20',
    },
  ]

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="px-4 md:px-6 pt-2 pb-0"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(stat => (
          <div
            key={stat.label}
            className={`glass-card rounded-xl px-4 py-3.5 flex items-center gap-3 border ${stat.bg} ${stat.glow} transition-all`}
          >
            <div className={`w-8 h-8 rounded-lg bg-background/50 flex items-center justify-center`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className="min-w-0">
              <p className={`text-base font-bold ${stat.color} leading-none`}>{stat.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
