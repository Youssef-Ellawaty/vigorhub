'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts'
import type { ExerciseProgressLog, Language } from '@/progress-analytics/lib/dashboard-types'
import { t } from '@/progress-analytics/lib/i18n'
import { EmptyState, ChartSkeleton } from './ChartStates'
import { cn } from '@/lib/utils'

interface ChartCardProps {
  title: string
  subtitle: string
  accentColor: string
  children: React.ReactNode
  className?: string
}

function ChartCard({ title, subtitle, accentColor, children, className }: ChartCardProps) {
  return (
    <div className={cn('glass-card rounded-2xl p-5 flex flex-col gap-3 overflow-hidden', className)}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
        <span
          className="w-2 h-2 rounded-full mt-1 flex-shrink-0"
          style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}` }}
        />
      </div>
      <div className="flex-1 min-h-[180px]">{children}</div>
    </div>
  )
}

// Custom Tooltip
function CustomTooltip({ active, payload, label, unit, lang }: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
  unit?: string
  lang: Language
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card rounded-xl px-3 py-2.5 border border-border/80 shadow-xl min-w-[120px]">
      <p className="text-[10px] text-muted-foreground mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-xs font-semibold text-foreground">
            {p.value}{unit ?? ''}
          </span>
        </div>
      ))}
    </div>
  )
}

interface WorkoutChartsProps {
  logs: ExerciseProgressLog[]
  lang: Language
  isLoading: boolean
  exerciseName: string | null
}

function formatDate(dateStr: string, lang: Language) {
  const d = new Date(dateStr)
  return d.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { month: 'short', day: 'numeric' })
}

export default function WorkoutCharts({ logs, lang, isLoading, exerciseName }: WorkoutChartsProps) {
  const isRtl = lang === 'ar'

  const chartData = logs.map(l => ({
    date: formatDate(l.date, lang),
    rawDate: l.date,
    maxWeight: l.maxWeightKg,
    avgWeight: l.avgWeightKg,
    sets: l.totalSets,
    maxReps: l.maxReps,
  }))

  const CYAN = 'var(--color-chart-1, #00E5FF)'
  const EMERALD = 'var(--color-chart-2, #10B981)'
  const AMBER = 'var(--color-chart-3, #F59E0B)'

  return (
    <section dir={isRtl ? 'rtl' : 'ltr'} className="px-4 md:px-6 py-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="h-5 w-1 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]" />
        <h2 className="text-base font-bold text-foreground tracking-wide">
          {t(lang, 'workoutAnalytics')}
        </h2>
        {exerciseName && (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/15 text-primary border border-primary/30">
            {exerciseName}
          </span>
        )}
      </div>

      {/* 3-Column Chart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* ── 1. Weight Progress ── */}
        <ChartCard
          title={t(lang, 'weightProgress')}
          subtitle={t(lang, 'weightProgressSub')}
          accentColor="#00E5FF"
        >
          {isLoading ? (
            <ChartSkeleton />
          ) : chartData.length === 0 ? (
            <EmptyState lang={lang} />
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <filter id="glow-cyan">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 9, fill: '#6B7A96' }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 9, fill: '#6B7A96' }}
                  tickLine={false}
                  axisLine={false}
                  unit="kg"
                />
                <Tooltip
                  content={<CustomTooltip unit=" kg" lang={lang} />}
                  cursor={{ stroke: 'rgba(0,229,255,0.2)', strokeWidth: 1 }}
                />
                <Line
                  type="monotone"
                  dataKey="maxWeight"
                  stroke="#00E5FF"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#00E5FF', filter: 'url(#glow-cyan)' }}
                  name={t(lang, 'max')}
                  filter="url(#glow-cyan)"
                />
                <Line
                  type="monotone"
                  dataKey="avgWeight"
                  stroke="#00E5FF"
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                  dot={false}
                  activeDot={{ r: 3, fill: '#00E5FF' }}
                  name={t(lang, 'avg')}
                  opacity={0.5}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* ── 2. Sets Volume ── */}
        <ChartCard
          title={t(lang, 'setsVolume')}
          subtitle={t(lang, 'setsVolumeSub')}
          accentColor="#10B981"
        >
          {isLoading ? (
            <ChartSkeleton />
          ) : chartData.length === 0 ? (
            <EmptyState lang={lang} />
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="setsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 9, fill: '#6B7A96' }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 9, fill: '#6B7A96' }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  content={<CustomTooltip unit={` ${t(lang, 'sets')}`} lang={lang} />}
                  cursor={{ fill: 'rgba(16,185,129,0.05)' }}
                />
                <Bar
                  dataKey="sets"
                  fill="url(#setsGrad)"
                  radius={[3, 3, 0, 0]}
                  name={t(lang, 'sets')}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* ── 3. Reps Progress ── */}
        <ChartCard
          title={t(lang, 'repsProgress')}
          subtitle={t(lang, 'repsProgressSub')}
          accentColor="#F59E0B"
        >
          {isLoading ? (
            <ChartSkeleton />
          ) : chartData.length === 0 ? (
            <EmptyState lang={lang} />
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <filter id="glow-amber">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 9, fill: '#6B7A96' }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 9, fill: '#6B7A96' }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  content={<CustomTooltip unit={` ${t(lang, 'reps')}`} lang={lang} />}
                  cursor={{ stroke: 'rgba(245,158,11,0.2)', strokeWidth: 1 }}
                />
                <Line
                  type="monotone"
                  dataKey="maxReps"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#F59E0B', filter: 'url(#glow-amber)' }}
                  name={t(lang, 'max')}
                  filter="url(#glow-amber)"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </section>
  )
}
