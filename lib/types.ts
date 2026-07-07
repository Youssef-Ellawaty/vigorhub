// ============================================================
// VigorHub — TypeScript Interface Contracts
// Fully engineered for downstream database integration
// ============================================================

export enum MuscleGroupEnum {
  CHEST = "chest",
  LATS = "lats",
  SHOULDERS = "shoulders",
  BICEPS = "biceps",
  TRICEPS = "triceps",
  FOREARMS = "forearms",
  QUADS = "quads",
  HAMSTRINGS = "hamstrings",
  GLUTES = "glutes",
  CALVES = "calves",
  CORE = "core",
  TRAPS = "traps",
  LOWER_BACK = "lower_back",
}

export type Language = "en" | "ar";
export type Theme = "dark" | "light";
export type DifficultyLevel = "beginner" | "intermediate" | "advanced";
export type CardioType = "treadmill" | "stairmaster";
export type SessionView = "splits" | "live";

export interface Exercise {
  id: string;
  name: { en: string; ar: string };
  primaryMuscle: MuscleGroupEnum;
  secondaryMuscles: MuscleGroupEnum[];
  defaultSets: number;
  defaultReps: string; // e.g., "8-12"
}

export interface SplitDay {
  dayNumber: number;
  label: { en: string; ar: string };
  exercises: Exercise[];
}

export interface WorkoutSplit {
  id: string;
  name: { en: string; ar: string };
  daysPerWeek: number;
  level: DifficultyLevel;
  description: { en: string; ar: string };
  days: SplitDay[];
  isCustom?: boolean;
}

export interface CustomSplitPayload {
  name: string;
  days: {
    dayNumber: number;
    label: string;
    exercises: Array<{
      exerciseId: string;
      sets: number;
      reps: string;
    }>;
  }[];
  createdAt: string;
}

export interface SetLog {
  setNumber: number;
  weight: number | "";
  reps: number | "";
  completed: boolean;
}

export interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  sets: SetLog[];
  swappedFrom?: string;
}

export interface CardioLog {
  type: CardioType;
  speed: number | "";
  duration: number | "";
  incline?: number | ""; // treadmill only
}

export interface LiveSessionLogs {
  splitId: string
  dayIndex: number
  date: string
  exercises: ExerciseLog[]
  cardio: CardioLog[]
  completed: boolean
  completedAt?: string
}

// ============================================================
// Global App Types
// ============================================================

export interface User {
  id: string
  username: string
  fullName: string
}

export interface AuthState {
  isAuthenticated: boolean
  userRole: 'free_athlete' | 'coach' | 'premium_athlete' | null
  user: User | null
}
