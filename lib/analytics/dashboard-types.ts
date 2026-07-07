// ─── Core Data Interfaces ───────────────────────────────────────────────────

export interface ExerciseProgressLog {
  id: string
  date: string            // ISO date string e.g. "2024-03-15"
  exerciseId: string
  exerciseName: string
  maxWeightKg: number     // heaviest set weight
  avgWeightKg: number     // average weight across sets
  totalSets: number       // total sets performed
  maxReps: number         // highest rep count in any set
  totalReps: number       // sum of all reps
  sessionDurationMin?: number
}

export interface DailyCalorieLog {
  id: string
  date: string            // ISO date string e.g. "2024-03-15"
  caloriesConsumed: number
  calorieTarget: number   // user's scientific goal for that day
  protein?: number        // grams
  carbs?: number          // grams
  fat?: number            // grams
  goalType: 'bulking' | 'cutting' | 'maintenance'
}

export interface Exercise {
  id: string
  name: string
  nameAr: string
  category: string
}

// ─── Filter & UI Types ──────────────────────────────────────────────────────

export type DateRange = 'all' | 'last30' | 'last90'
export type Language = 'en' | 'ar'
export type Theme = 'dark' | 'light'

export interface DashboardFilters {
  dateRange: DateRange
  selectedExerciseId: string | null
}

// ─── Mock data generators (database-ready shape) ────────────────────────────

function generateDates(days: number): string[] {
  const dates: string[] = []
  const now = new Date()
  for (let i = days; i >= 0; i -= Math.ceil(days / 24)) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    dates.push(d.toISOString().split('T')[0])
  }
  return dates
}

export const MOCK_EXERCISES: Exercise[] = [
  { id: 'bench', name: 'Bench Press', nameAr: 'ضغط المقعد', category: 'Chest' },
  { id: 'squat', name: 'Back Squat', nameAr: 'القرفصاء', category: 'Legs' },
  { id: 'deadlift', name: 'Deadlift', nameAr: 'الرفعة الميتة', category: 'Back' },
  { id: 'ohp', name: 'Overhead Press', nameAr: 'الضغط فوق الرأس', category: 'Shoulders' },
  { id: 'row', name: 'Barbell Row', nameAr: 'التجديف بالبار', category: 'Back' },
]

export function generateMockProgressLogs(exerciseId: string, days = 90): ExerciseProgressLog[] {
  const dates = generateDates(days)
  const ex = MOCK_EXERCISES.find(e => e.id === exerciseId) ?? MOCK_EXERCISES[0]
  const baseWeights: Record<string, number> = {
    bench: 80, squat: 100, deadlift: 120, ohp: 55, row: 75,
  }
  const base = baseWeights[exerciseId] ?? 80

  return dates.map((date, i) => {
    const trend = i * 0.4
    const noise = (Math.random() - 0.5) * 6
    const maxW = Math.round((base + trend + noise) * 2) / 2
    const sets = Math.floor(Math.random() * 2) + 3
    const maxReps = Math.floor(Math.random() * 4) + 6
    return {
      id: `${exerciseId}-${date}`,
      date,
      exerciseId,
      exerciseName: ex.name,
      maxWeightKg: maxW,
      avgWeightKg: Math.round((maxW - Math.random() * 5) * 2) / 2,
      totalSets: sets,
      maxReps,
      totalReps: sets * maxReps - Math.floor(Math.random() * 4),
    }
  })
}

export function generateMockCalorieLogs(days = 90): DailyCalorieLog[] {
  const dates: string[] = []
  const now = new Date()
  for (let i = days; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    dates.push(d.toISOString().split('T')[0])
  }

  const target = 2500
  return dates.map((date, i) => {
    const phase = i < 30 ? 'cutting' : i < 60 ? 'maintenance' : 'bulking'
    const phaseTarget = phase === 'cutting' ? 2000 : phase === 'maintenance' ? 2500 : 3000
    const noise = (Math.random() - 0.45) * 400
    const consumed = Math.round(phaseTarget + noise)
    return {
      id: `cal-${date}`,
      date,
      caloriesConsumed: Math.max(800, consumed),
      calorieTarget: phaseTarget,
      protein: Math.round(consumed * 0.3 / 4),
      carbs: Math.round(consumed * 0.45 / 4),
      fat: Math.round(consumed * 0.25 / 9),
      goalType: phase,
    }
  })
}

export const ALL_CALORIE_LOGS = generateMockCalorieLogs(90)
