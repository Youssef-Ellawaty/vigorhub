// ─── Core Types ──────────────────────────────────────────────────────────────

export type Gender = "male" | "female";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "very_active" | "extra_active";
export type FitnessGoal = "bulk" | "cut" | "maintain";
export type MealSlot = "breakfast" | "lunch" | "dinner" | "snacks";
export type FoodType = "raw" | "packaged";
export type Language = "en" | "ar";
export type Theme = "dark" | "light";

// ─── User Fitness Profile ─────────────────────────────────────────────────────

export interface UserFitnessProfile {
  age: number;
  gender: Gender;
  weightKg: number;
  heightCm: number;
  activityLevel: ActivityLevel;
  fitnessGoal: FitnessGoal;
  tdee: number;
  targetCalories: number;
  targetProteinG: number;
  targetCarbsG: number;
  targetFatsG: number;
  targetWaterL: number;
}

// ─── Food Database ────────────────────────────────────────────────────────────

export interface FoodItem {
  id: string;
  nameEn: string;
  nameAr: string;
  type: FoodType;
  // For raw foods: values per 100g
  // For packaged foods: values per unit/pack
  caloriesPer: number;
  proteinPer: number; // grams
  carbsPer: number;   // grams
  fatPer: number;     // grams
  servingLabel: string; // "per 100g" or "per pack"
}

// ─── Meal Logging ─────────────────────────────────────────────────────────────

export interface LoggedMealEntry {
  id: string;
  foodItem: FoodItem;
  meal: MealSlot;
  quantity: number; // grams (raw) or units (packaged)
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  addedAt: Date;
}

// ─── AI Chat ──────────────────────────────────────────────────────────────────

export type ChatRole = "user" | "assistant";

export interface SuggestedFood {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: string;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  suggestedFoods?: SuggestedFood[];
}

// ─── Daily Totals ─────────────────────────────────────────────────────────────

export interface DailyTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
