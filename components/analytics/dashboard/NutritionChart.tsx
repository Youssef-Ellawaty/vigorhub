'use client'

import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
  Cell,
} from 'recharts'
import { Apple } from 'lucide-react'
import type { DailyCalorieLog, Language } from '@/lib/dashboard-types'
import { t } from '@/lib/i18n'
import { EmptyState, ChartSkeleton } from './ChartStates'

interface NutritionChartProps {
  logs: DailyCalorieLog[]
  lang: Language
  isLoading: boolean
}

function formatDate(dateStr: string, lang: Language) {
  const d = new Date(dateStr)
  return d.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { month: 'short', day: 'numeric' })
}

// Custom legend
function CustomLegend({ lang }: { lang: Language }) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-[11px]">
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-1.5 rounded-full bg-[#00E5FF] inline-block" />
        <span className="text-muted-foreground">{t(lang, 'consumed')}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-0.5 rounded-full border-t-2 border-dashed border-[#F59E0B] inline-block" />
        <span className="text-muted-foreground">{t(lang, 'targetLine')}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-1.5 rounded bg-[#EF4444]/70 inline-block" />
        <span className="text-muted-foreground">{t(lang, 'aboveTarget')}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-1.5 rounded bg-[#10B981]/70 inline-block" />
        <span className="text-muted-foreground">{t(lang, 'belowTarget')}</span>
      </div>
    </div>
  )
}

// Custom Tooltip
function NutritionTooltip({ active, payload, label, lang }: {
  active?: boolean
  payload?: Array<{ name: string; value: number; payload: {
    caloriesConsumed: number
    calorieTarget: number
    goalType: string
    date: string
  }}>
  label?: string
  lang: Language
}) {
  if (!active || !payload?.length) return null
  const data = payload[0]?.payload
  if (!data) return null
  const diff = data.caloriesConsumed - data.calorieTarget
  const isOver = diff > 0
  const goalLabel = t(lang, data.goalType as 'bulking' | 'cutting' | 'maintenance')

  return (
    <div className="glass-card rounded-xl px-3.5 py-3 border border-border/80 shadow-xl min-w-[160px]">
      <p className="text-[10px] text-muted-foreground mb-2">{label}</p>
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span className="text-[11px] text-muted-foreground">{t(lang, 'consumed')}</span>
          <span className="text-[11px] font-bold text-foreground">{data.caloriesConsumed.toLocaleString()} kcal</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-[11px] text-muted-foreground">{t(lang, 'target')}</span>
          <span className="text-[11px] font-semibold text-amber-400">{data.calorieTarget.toLocaleString()} kcal</span>
        </div>
        <div className="flex justify-between gap-4 pt-1 border-t border-border/40">
          <span className="text-[11px] text-muted-foreground">{t(lang, 'phase')}</span>
          <span className="text-[11px] font-medium text-primary">{goalLabel}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-[11px] text-muted-foreground">{isOver ? t(lang, 'aboveTarget') : t(lang, 'belowTarget')}</span>
          <span className={`text-[11px] font-bold ${isOver ? 'text-red-400' : 'text-emerald-400'}`}>
            {isOver ? '+' : ''}{diff.toLocaleString()} kcal
          </span>
        </div>
      </div>
    </div>
  )
}

export default function NutritionChart({ logs, lang, isLoading }: NutritionChartProps) {
  const isRtl = lang === 'ar'

  const chartData = logs.map(l => ({
    date: formatDate(l.date, lang),
    rawDate: l.date,
    caloriesConsumed: l.caloriesConsumed,
    calorieTarget: l.calorieTarget,
    goalType: l.goalType,
    // For coloring bars
    overTarget: l.caloriesConsumed > l.calorieTarget ? l.caloriesConsumed : null,
    underTarget: l.caloriesConsumed <= l.calorieTarget ? l.caloriesConsumed : null,
  }))

  // Compute average target for reference line
  const avgTarget = logs.length
    ? Math.round(logs.reduce((s, l) => s + l.calorieTarget, 0) / logs.length)
    : 2500

  // Stats
  const overCount = logs.filter(l => l.caloriesConsumed > l.calorieTarget).length
  const underCount = logs.length - overCount
  const compliance = logs.length ? Math.round((underCount / logs.length) * 100) : 0

  return (
    <section dir={isRtl ? 'rtl' : 'ltr'} className="px-4 md:px-6 py-6 pb-8">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="h-5 w-1 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />
        <h2 className="text-base font-bold text-foreground tracking-wide">
          {t(lang, 'nutritionTitle')}
        </h2>
        {logs.length > 0 && (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-accent/15 text-accent border border-accent/30">
            {logs.length} {t(lang, 'sessions')}
          </span>
        )}
      </div>

      {/* Card */}
      <div className="glass-card rounded-2xl p-5 flex flex-col gap-4">
        {/* Stats Row */}
        {logs.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {[
              { label: t(lang, 'aboveTarget'), value: overCount, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
              { label: t(lang, 'belowTarget'), value: underCount, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
              { label: t(lang, 'target'), value: `${avgTarget.toLocaleString()} kcal`, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
              {
                label: 'Compliance',
                value: `${compliance}%`,
                color: compliance >= 60 ? 'text-emerald-400' : 'text-red-400',
                bg: compliance >= 60
                  ? 'bg-emerald-500/10 border-emerald-500/20'
                  : 'bg-red-500/10 border-red-500/20',
              },
            ].map(stat => (
              <div key={stat.label} className={`px-3 py-2 rounded-xl border ${stat.bg} flex items-center gap-2`}>
                <span className={`text-base font-bold ${stat.color}`}>{stat.value}</span>
                <span className="text-[10px] text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Legend */}
        {logs.length > 0 && <CustomLegend lang={lang} />}

        {/* Chart */}
        <div className="min-h-[220px]">
          {isLoading ? (
            <ChartSkeleton />
          ) : chartData.length === 0 ? (
            <EmptyState lang={lang} message={t(lang, 'noCalorieData')} icon="trend" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="calGradOver" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient id="calGradUnder" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 9, fill: '#6B7A96' }}
                  tickLine={false}
                  axisLine={false}
                  interval={Math.max(0, Math.floor(chartData.length / 8) - 1)}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: '#6B7A96' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={v => `${(v / 1000).toFixed(1)}k`}
                />
                <Tooltip
                  content={<NutritionTooltip lang={lang} />}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                />
                {/* Above-target bars */}
                <Bar dataKey="overTarget" fill="url(#calGradOver)" radius={[3, 3, 0, 0]} name={t(lang, 'aboveTarget')} />
                {/* Below-target bars */}
                <Bar dataKey="underTarget" fill="url(#calGradUnder)" radius={[3, 3, 0, 0]} name={t(lang, 'belowTarget')} />
                {/* Target Reference Line */}
                <ReferenceLine
                  y={avgTarget}
                  stroke="#F59E0B"
                  strokeDasharray="6 4"
                  strokeWidth={1.5}
                  label={{
                    value: `${t(lang, 'targetLine')}: ${avgTarget.toLocaleString()}`,
                    position: 'insideTopRight',
                    fill: '#F59E0B',
                    fontSize: 9,
                    fontWeight: 600,
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </section>
  )
}
