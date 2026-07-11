"use client";

import React, { useState } from "react";
import { Dumbbell, Users, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { SelectionCard } from "../primitives/SelectionCard";
import { ActionButton } from "../primitives/ActionButton";
import { PersonaType, type Theme, type Step3Payload, type FieldError } from "../types";
import type { TranslationDict } from "../translations";

interface Step3Props {
  data: Step3Payload;
  onChange: (data: Step3Payload) => void;
  onNext: (persona: PersonaType) => void;
  onBack: () => void;
  theme: Theme;
  isRtl: boolean;
  t: TranslationDict;
}

function validate(data: Step3Payload, t: TranslationDict): FieldError[] {
  if (!data.personaType) {
    return [{ field: "personaType", message: t.selectPersonaError }];
  }
  return [];
}

export function Step3Persona({
  data,
  onChange,
  onNext,
  onBack,
  theme,
  isRtl,
  t,
}: Step3Props) {
  const isDark = theme === "dark";
  const [errors, setErrors] = useState<FieldError[]>([]);

  const personaError = errors.find((e) => e.field === "personaType")?.message;

  function handleNext() {
    const validationErrors = validate(data, t);
    setErrors(validationErrors);
    if (validationErrors.length === 0 && data.personaType) {
      onNext(data.personaType);
    }
  }

  const personas: Array<{
    type: PersonaType;
    title: string;
    description: string;
    icon: React.ElementType;
    accentColor: "emerald" | "cyan";
    badge?: string;
  }> = [
    {
      type: PersonaType.IndependentAthlete,
      title: t.personaAthleteTitle,
      description: t.personaAthleteDesc,
      icon: Dumbbell,
      accentColor: "emerald",
    },
    {
      type: PersonaType.TraineeWithCoach,
      title: t.personaTraineeTitle,
      description: t.personaTraineeDesc,
      icon: Users,
      accentColor: "cyan",
    },
    {
      type: PersonaType.ProfessionalCoach,
      title: t.personaCoachTitle,
      description: t.personaCoachDesc,
      icon: BadgeCheck,
      accentColor: "emerald",
      badge: "PRO",
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
          {t.step3Title}
        </h2>
        <p
          className={cn(
            "text-sm leading-relaxed",
            isDark ? "text-slate-400" : "text-slate-500"
          )}
        >
          {t.step3Subtitle}
        </p>
      </div>

      {/* Persona cards */}
      <div
        className="flex flex-col gap-3"
        role="radiogroup"
        aria-label={isRtl ? "نوع الحساب" : "Account type"}
      >
        {personas.map((persona) => (
          <SelectionCard
            key={persona.type}
            id={`persona-${persona.type}`}
            title={persona.title}
            description={persona.description}
            icon={persona.icon as any}
            isSelected={data.personaType === persona.type}
            onSelect={() =>
              onChange({ ...data, personaType: persona.type })
            }
            theme={theme}
            isRtl={isRtl}
            accentColor={persona.accentColor}
            badge={persona.badge}
          />
        ))}
      </div>

      {/* Validation error */}
      {personaError && (
        <p
          role="alert"
          className={cn(
            "text-xs font-medium text-red-400",
            isRtl ? "text-right" : "text-left"
          )}
        >
          {personaError}
        </p>
      )}

      {/* Navigation */}
      <div
        className={cn(
          "flex gap-3",
          isRtl ? "flex-row-reverse" : "flex-row"
        )}
      >
        <ActionButton
          variant="secondary"
          theme={theme}
          isRtl={isRtl}
          onClick={onBack}
          className="flex-1"
        >
          {t.back}
        </ActionButton>
        <ActionButton
          variant="primary"
          theme={theme}
          isRtl={isRtl}
          onClick={handleNext}
          className="flex-[2]"
        >
          {t.next}
        </ActionButton>
      </div>
    </div>
  );
}
