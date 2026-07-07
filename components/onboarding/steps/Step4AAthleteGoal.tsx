"use client";

import React, { useState } from "react";
import { Flame, TrendingUp, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { SelectionCard } from "../primitives/SelectionCard";
import { ActionButton } from "../primitives/ActionButton";
import {
  AthleteGoal,
  type Theme,
  type Step4APayload,
  type FieldError,
} from "../types";
import type { TranslationDict } from "../translations";

interface Step4AProps {
  data: Step4APayload;
  onChange: (data: Step4APayload) => void;
  onSubmit: () => void;
  onBack: () => void;
  theme: Theme;
  isRtl: boolean;
  t: TranslationDict;
  isLoading?: boolean;
}

function validate(data: Step4APayload, t: TranslationDict): FieldError[] {
  if (!data.athleteGoal) {
    return [{ field: "athleteGoal", message: t.selectGoalError }];
  }
  return [];
}

export function Step4AAthleteGoal({
  data,
  onChange,
  onSubmit,
  onBack,
  theme,
  isRtl,
  t,
  isLoading = false,
}: Step4AProps) {
  const isDark = theme === "dark";
  const [errors, setErrors] = useState<FieldError[]>([]);

  const goalError = errors.find((e) => e.field === "athleteGoal")?.message;

  function handleSubmit() {
    const validationErrors = validate(data, t);
    setErrors(validationErrors);
    if (validationErrors.length === 0) {
      onSubmit();
    }
  }

  const goals: Array<{
    goal: AthleteGoal;
    title: string;
    description: string;
    icon: React.ElementType;
    accentColor: "emerald" | "cyan";
  }> = [
    {
      goal: AthleteGoal.FatLoss,
      title: t.goalFatLossTitle,
      description: t.goalFatLossDesc,
      icon: Flame,
      accentColor: "emerald",
    },
    {
      goal: AthleteGoal.MuscleGain,
      title: t.goalMuscleGainTitle,
      description: t.goalMuscleGainDesc,
      icon: TrendingUp,
      accentColor: "cyan",
    },
    {
      goal: AthleteGoal.BodyRecomposition,
      title: t.goalRecompTitle,
      description: t.goalRecompDesc,
      icon: RefreshCw,
      accentColor: "emerald",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Step header */}
      <div className={cn("flex flex-col gap-1", isRtl ? "text-right" : "text-left")}>
        <h2
          className={cn(
            "text-2xl font-bold tracking-tight",
            isDark ? "text-slate-50" : "text-slate-900"
          )}
        >
          {t.step4ATitle}
        </h2>
        <p
          className={cn(
            "text-sm leading-relaxed",
            isDark ? "text-slate-400" : "text-slate-500"
          )}
        >
          {t.step4ASubtitle}
        </p>
      </div>

      {/* Goal cards */}
      <div
        className="flex flex-col gap-3"
        role="radiogroup"
        aria-label={isRtl ? "الهدف التدريبي" : "Training goal"}
      >
        {goals.map((item) => (
          <SelectionCard
            key={item.goal}
            id={`goal-${item.goal}`}
            title={item.title}
            description={item.description}
            icon={item.icon as any}
            isSelected={data.athleteGoal === item.goal}
            onSelect={() => onChange({ ...data, athleteGoal: item.goal })}
            theme={theme}
            isRtl={isRtl}
            accentColor={item.accentColor}
          />
        ))}
      </div>

      {/* Validation error */}
      {goalError && (
        <p
          role="alert"
          className={cn(
            "text-xs font-medium text-red-400",
            isRtl ? "text-right" : "text-left"
          )}
        >
          {goalError}
        </p>
      )}

      {/* Navigation */}
      <div className={cn("flex gap-3", isRtl ? "flex-row-reverse" : "flex-row")}>
        <ActionButton
          variant="secondary"
          theme={theme}
          isRtl={isRtl}
          onClick={onBack}
          className="flex-1"
          disabled={isLoading}
        >
          {t.back}
        </ActionButton>
        <ActionButton
          variant="primary"
          theme={theme}
          isRtl={isRtl}
          onClick={handleSubmit}
          className="flex-[2]"
          isLoading={isLoading}
          loadingText={isRtl ? "جاري التسجيل..." : "Registering..."}
        >
          {t.submit}
        </ActionButton>
      </div>
    </div>
  );
}
