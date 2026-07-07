// Dashboard types
export interface DailyCalorieLog {
  id: string;
  date: string;
  calories: number;
}

export interface ExerciseProgressLog {
  id: string;
  date: string;
  exercise: string;
  weight: number;
}

export type Language = 'en' | 'ar';
