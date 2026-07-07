import type { Gender, ActivityLevel, FitnessGoal, UserFitnessProfile } from "./types";
import { ACTIVITY_MULTIPLIERS } from "./food-data";

/**
 * Mifflin-St Jeor Equation for BMR
 * Male:   BMR = 10w + 6.25h − 5a + 5
 * Female: BMR = 10w + 6.25h − 5a − 161
 */
export function calculateBMR(weightKg: number, heightCm: number, age: number, gender: Gender): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === "male" ? base + 5 : base - 161;
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

export function calculateTargetCalories(tdee: number, goal: FitnessGoal): number {
  if (goal === "bulk") return tdee + 400;
  if (goal === "cut") return tdee - 400;
  return tdee;
}

/**
 * Macro split:
 * - Protein: 2g per kg body weight (high-protein approach)
 * - Fat: 25% of total calories → 1g fat = 9 kcal
 * - Carbs: remaining calories → 1g carb = 4 kcal
 */
export function calculateMacros(
  targetCalories: number,
  weightKg: number
): { protein: number; carbs: number; fats: number } {
  const protein = Math.round(weightKg * 2);
  const fatCalories = targetCalories * 0.25;
  const fats = Math.round(fatCalories / 9);
  const carbCalories = targetCalories - protein * 4 - fats * 9;
  const carbs = Math.round(carbCalories / 4);
  return { protein, carbs, fats };
}

/**
 * Water intake recommendation: ~35ml per kg body weight
 */
export function calculateWater(weightKg: number): number {
  return Math.round((weightKg * 35) / 1000 * 10) / 10;
}

export function buildProfile(
  age: number,
  gender: Gender,
  weightKg: number,
  heightCm: number,
  activityLevel: ActivityLevel,
  fitnessGoal: FitnessGoal
): UserFitnessProfile {
  const bmr = calculateBMR(weightKg, heightCm, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);
  const targetCalories = calculateTargetCalories(tdee, fitnessGoal);
  const { protein, carbs, fats } = calculateMacros(targetCalories, weightKg);
  const targetWaterL = calculateWater(weightKg);

  return {
    age,
    gender,
    weightKg,
    heightCm,
    activityLevel,
    fitnessGoal,
    tdee,
    targetCalories,
    targetProteinG: protein,
    targetCarbsG: carbs,
    targetFatsG: fats,
    targetWaterL,
  };
}
