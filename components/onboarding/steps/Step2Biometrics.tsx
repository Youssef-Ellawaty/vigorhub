"use client";

import React, { useState } from "react";
import { Mars, Venus, Ruler, Weight, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormField, inputClasses } from "../primitives/FormField";
import { ActionButton } from "../primitives/ActionButton";
import { Gender, type Theme, type Step2Payload, type FieldError } from "../types";
import type { TranslationDict } from "../translations";

interface Step2Props {
  data: Step2Payload;
  onChange: (data: Step2Payload) => void;
  onNext: () => void;
  onBack: () => void;
  theme: Theme;
  isRtl: boolean;
  t: TranslationDict;
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validate(data: Step2Payload, t: TranslationDict): FieldError[] {
  const errors: FieldError[] = [];

  if (!data.gender) {
    errors.push({ field: "gender", message: t.selectGenderError });
  }

  if (data.age === null || data.age === undefined) {
    errors.push({ field: "age", message: t.fieldRequiredError });
  } else if (data.age < 13 || data.age > 100) {
    errors.push({ field: "age", message: t.ageRangeError });
  }

  if (data.heightCm === null || data.heightCm === undefined) {
    errors.push({ field: "heightCm", message: t.fieldRequiredError });
  } else if (data.heightCm < 100 || data.heightCm > 250) {
    errors.push({ field: "heightCm", message: t.heightRangeError });
  }

  if (data.weightKg === null || data.weightKg === undefined) {
    errors.push({ field: "weightKg", message: t.fieldRequiredError });
  } else if (data.weightKg < 30 || data.weightKg > 300) {
    errors.push({ field: "weightKg", message: t.weightRangeError });
  }

  return errors;
}

// ─── Gender Card (extracted to module scope to prevent remount on every render) ─

const GENDER_BASE_DARK =
  "bg-slate-800/50 border-slate-700/50 hover:border-slate-600";
const GENDER_BASE_LIGHT =
  "bg-white border-slate-200 hover:border-slate-300 shadow-sm";
const GENDER_SELECTED_DARK =
  "border-emerald-500/70 bg-emerald-950/30 shadow-[0_0_20px_rgba(16,185,129,0.1)] ring-1 ring-emerald-500/25";
const GENDER_SELECTED_LIGHT =
  "border-emerald-500 bg-emerald-50 shadow-[0_0_12px_rgba(16,185,129,0.08)] ring-1 ring-emerald-500/25";

function GenderCard({
  gender,
  label,
  Icon,
  isSelected,
  isDark,
  onSelect,
}: {
  gender: Gender;
  label: string;
  Icon: React.ElementType;
  isSelected: boolean;
  isDark: boolean;
  onSelect: (g: Gender) => void;
}) {
  const cardClass = cn(
    "flex-1 flex flex-col items-center justify-center gap-3 rounded-2xl border py-6 px-4 transition-all duration-200 outline-none",
    "focus-visible:ring-2 focus-visible:ring-emerald-500",
    isDark ? GENDER_BASE_DARK : GENDER_BASE_LIGHT,
    isSelected && (isDark ? GENDER_SELECTED_DARK : GENDER_SELECTED_LIGHT)
  );
  const iconClass = cn(
    "flex items-center justify-center w-14 h-14 rounded-2xl transition-colors duration-200",
    isSelected
      ? "bg-emerald-500/20 text-emerald-400"
      : isDark
      ? "bg-slate-700/60 text-slate-400"
      : "bg-slate-100 text-slate-500"
  );
  const labelClass = cn(
    "font-semibold text-sm tracking-wide",
    isSelected
      ? "text-emerald-400"
      : isDark
      ? "text-slate-200"
      : "text-slate-700"
  );
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={() => onSelect(gender)}
      className={cardClass}
    >
      <div className={iconClass} aria-hidden="true">
        <Icon className="w-7 h-7" strokeWidth={1.6} />
      </div>
      <span className={labelClass}>{label}</span>
    </button>
  );
}

// ─── Metric Input (extracted to module scope to prevent remount on every render) ─

function MetricInput({
  id,
  label,
  field,
  placeholder,
  icon: InputIcon,
  unit,
  value,
  onChange,
  error,
  theme,
  isRtl,
}: {
  id: string;
  label: string;
  field: "age" | "heightCm" | "weightKg";
  placeholder: string;
  icon: React.ElementType;
  unit?: string;
  value: number | null;
  onChange: (field: "age" | "heightCm" | "weightKg", raw: string) => void;
  error: string | undefined;
  theme: import("../types").Theme;
  isRtl: boolean;
}) {
  const isDark = theme === "dark";
  const hasErr = !!error;
  return (
    <FormField id={id} label={label} error={error} theme={theme} isRtl={isRtl}>
      <div className="relative">
        <InputIcon
          className={cn(
            "absolute top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none",
            isDark ? "text-slate-500" : "text-slate-400",
            isRtl ? "right-4" : "left-4"
          )}
          strokeWidth={1.8}
          aria-hidden="true"
        />
        <input
          id={id}
          type="number"
          inputMode="numeric"
          value={value ?? ""}
          onChange={(e) => onChange(field, e.target.value)}
          placeholder={placeholder}
          className={cn(
            inputClasses(theme, hasErr, isRtl ? "pr-10 pl-14" : "pl-10 pr-14"),
            "appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          )}
          dir="ltr"
        />
        {unit && (
          <span
            className={cn(
              "absolute top-1/2 -translate-y-1/2 text-xs font-semibold tracking-widest pointer-events-none",
              isDark ? "text-slate-500" : "text-slate-400",
              isRtl ? "left-4" : "right-4"
            )}
            aria-hidden="true"
          >
            {unit}
          </span>
        )}
      </div>
    </FormField>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Step2Biometrics({
  data,
  onChange,
  onNext,
  onBack,
  theme,
  isRtl,
  t,
}: Step2Props) {
  const isDark = theme === "dark";
  const [errors, setErrors] = useState<FieldError[]>([]);

  function getError(field: string): string | undefined {
    return errors.find((e) => e.field === field)?.message;
  }

  function handleNext() {
    const validationErrors = validate(data, t);
    setErrors(validationErrors);
    if (validationErrors.length === 0) {
      onNext();
    }
  }

  function handleNumberInput(
    field: "age" | "heightCm" | "weightKg",
    raw: string
  ) {
    const parsed = raw === "" ? null : parseInt(raw, 10);
    onChange({ ...data, [field]: isNaN(parsed as number) ? null : parsed });
  }

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
          {t.step2Title}
        </h2>
        <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-500")}>
          {t.step2Subtitle}
        </p>
      </div>

      {/* Gender selector */}
      <FormField
        id="gender"
        label={t.labelGender}
        error={getError("gender")}
        theme={theme}
        isRtl={isRtl}
      >
        <div
          className={cn(
            "flex gap-3",
            isRtl ? "flex-row-reverse" : "flex-row"
          )}
          role="radiogroup"
          aria-label={t.labelGender}
        >
          <GenderCard
            gender={Gender.Male}
            label={t.genderMale}
            Icon={Mars}
            isSelected={data.gender === Gender.Male}
            isDark={isDark}
            onSelect={(g) => onChange({ ...data, gender: g })}
          />
          <GenderCard
            gender={Gender.Female}
            label={t.genderFemale}
            Icon={Venus}
            isSelected={data.gender === Gender.Female}
            isDark={isDark}
            onSelect={(g) => onChange({ ...data, gender: g })}
          />
        </div>
      </FormField>

      {/* Numeric inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricInput
          id="age"
          label={t.labelAge}
          field="age"
          placeholder={t.placeholderAge}
          icon={CalendarDays}
          value={data.age}
          onChange={handleNumberInput}
          error={getError("age")}
          theme={theme}
          isRtl={isRtl}
        />
        <MetricInput
          id="heightCm"
          label={t.labelHeight}
          field="heightCm"
          placeholder={t.placeholderHeight}
          icon={Ruler}
          unit="cm"
          value={data.heightCm}
          onChange={handleNumberInput}
          error={getError("heightCm")}
          theme={theme}
          isRtl={isRtl}
        />
        <MetricInput
          id="weightKg"
          label={t.labelWeight}
          field="weightKg"
          placeholder={t.placeholderWeight}
          icon={Weight}
          unit="kg"
          value={data.weightKg}
          onChange={handleNumberInput}
          error={getError("weightKg")}
          theme={theme}
          isRtl={isRtl}
        />
      </div>

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
