'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, CalendarDays } from 'lucide-react'
import type { DateRange, DashboardFilters, Exercise, Language } from '@/lib/progress-analytics/dashboard-types'
import { t } from '@/lib/progress-analytics/i18n'
import { cn } from '@/lib/utils'

interface ControlBarProps {
  filters: DashboardFilters
  exercises: Exercise[]
  lang: Language
  onFiltersChange: (f: DashboardFilters) => void
}

const DATE_RANGES: { value: DateRange; labelKey: 'allTime' | 'last30' | 'last90' }[] = [
  { value: 'all', labelKey: 'allTime' },
  { value: 'last30', labelKey: 'last30' },
  { value: 'last90', labelKey: 'last90' },
]

export default function ControlBar({ filters, exercises, lang, onFiltersChange }: ControlBarProps) {
  const [dateOpen, setDateOpen] = useState(false)
  const [exerciseOpen, setExerciseOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dateRef = useRef<HTMLDivElement>(null)
  const exRef = useRef<HTMLDivElement>(null)

  const isRtl = lang === 'ar'

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) setDateOpen(false)
      if (exRef.current && !exRef.current.contains(e.target as Node)) setExerciseOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selectedExercise = exercises.find(e => e.id === filters.selectedExerciseId)
  const filteredExercises = exercises.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.nameAr.includes(search)
  )

  const currentDateLabel = DATE_RANGES.find(r => r.value === filters.dateRange)?.labelKey ?? 'last30'

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="flex flex-wrap items-center gap-3 px-4 md:px-6 py-4 border-b border-border/40"
    >
      {/* Date Range Dropdown */}
      <div ref={dateRef} className="relative">
        <button
          onClick={() => { setDateOpen(p => !p); setExerciseOpen(false) }}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 bg-muted',
            'hover:border-primary/50 hover:bg-muted/80 transition-all text-sm font-medium',
            dateOpen && 'border-primary/70 shadow-[0_0_12px_rgba(0,229,255,0.15)]'
          )}
        >
          <CalendarDays className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="text-foreground max-w-[160px] truncate">{t(lang, currentDateLabel)}</span>
          <ChevronDown className={cn('w-3.5 h-3.5 text-muted-foreground transition-transform', dateOpen && 'rotate-180')} />
        </button>

        {dateOpen && (
          <div className="absolute top-full mt-2 w-64 rounded-xl border border-border/60 bg-popover shadow-2xl z-50 overflow-hidden">
            {DATE_RANGES.map(r => (
              <button
                key={r.value}
                onClick={() => { onFiltersChange({ ...filters, dateRange: r.value }); setDateOpen(false) }}
                className={cn(
                  'w-full text-start px-4 py-3 text-sm hover:bg-muted/80 transition-colors',
                  filters.dateRange === r.value
                    ? 'text-primary bg-primary/10 font-medium'
                    : 'text-foreground'
                )}
              >
                {t(lang, r.labelKey)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Exercise Selector */}
      <div ref={exRef} className="relative">
        <button
          onClick={() => { setExerciseOpen(p => !p); setDateOpen(false) }}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 bg-muted min-w-[200px]',
            'hover:border-accent/50 hover:bg-muted/80 transition-all text-sm font-medium',
            exerciseOpen && 'border-accent/70 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
          )}
        >
          <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
          <span className={cn('flex-1 text-start truncate', !selectedExercise && 'text-muted-foreground')}>
            {selectedExercise
              ? (lang === 'ar' ? selectedExercise.nameAr : selectedExercise.name)
              : t(lang, 'selectExercise')}
          </span>
          <ChevronDown className={cn('w-3.5 h-3.5 text-muted-foreground transition-transform', exerciseOpen && 'rotate-180')} />
        </button>

        {exerciseOpen && (
          <div className="absolute top-full mt-2 w-64 rounded-xl border border-border/60 bg-popover shadow-2xl z-50 overflow-hidden">
            {/* Search */}
            <div className="p-2 border-b border-border/40">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted">
                <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <input
                  type="text"
                  placeholder={t(lang, 'searchExercise')}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-52 overflow-y-auto">
              {filteredExercises.length === 0 ? (
                <p className="px-4 py-3 text-sm text-muted-foreground text-center">—</p>
              ) : (
                filteredExercises.map(ex => (
                  <button
                    key={ex.id}
                    onClick={() => {
                      onFiltersChange({ ...filters, selectedExerciseId: ex.id })
                      setExerciseOpen(false)
                      setSearch('')
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted/80 transition-colors text-start',
                      filters.selectedExerciseId === ex.id
                        ? 'text-accent bg-accent/10 font-medium'
                        : 'text-foreground'
                    )}
                  >
                    <span className="flex-1">{lang === 'ar' ? ex.nameAr : ex.name}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{ex.category}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
