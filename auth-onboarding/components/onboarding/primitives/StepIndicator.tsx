"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Theme, WizardStep } from "../types";
import type { TranslationDict } from "../translations";

// Map each wizard step to a visual step index (0-based)
const STEP_INDEX: Record<WizardStep, number> = {
  step1: 0,
  step2: 1,
  step3: 2,
  step4A: 2,
  step4B: 2,
  step4C: 2,
  step5Payment: 3,
  success: 3,
};

interface StepIndicatorProps {
  currentStep: WizardStep;
  theme: Theme;
  isRtl: boolean;
  t: TranslationDict;
}

// ─── Static class constants — fully literal so Turbopack can scan at build time

const CIRCLE_ACTIVE =
  "bg-emerald-500 text-white shadow-[0_0_16px_rgba(16,185,129,0.5)] ring-2 ring-emerald-500/30";
const CIRCLE_COMPLETED =
  "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40";
const CIRCLE_IDLE_DARK = "bg-slate-800 text-slate-500 border border-slate-700/60";
const CIRCLE_IDLE_LIGHT = "bg-slate-100 text-slate-400 border border-slate-200";

const LABEL_ACTIVE = "text-emerald-400";
const LABEL_COMPLETED_DARK = "text-slate-400";
const LABEL_COMPLETED_LIGHT = "text-slate-500";
const LABEL_IDLE_DARK = "text-slate-600";
const LABEL_IDLE_LIGHT = "text-slate-400";

const CONNECTOR_DONE = "bg-emerald-500/60";
const CONNECTOR_IDLE_DARK = "bg-slate-700/60";
const CONNECTOR_IDLE_LIGHT = "bg-slate-200";

export function StepIndicator({
  currentStep,
  theme,
  isRtl,
  t,
}: StepIndicatorProps) {
  const isDark = theme === "dark";
  const activeIndex = STEP_INDEX[currentStep];
  const totalSteps = 4;

  return (
    <div
      className={cn("flex w-full", isRtl ? "flex-row-reverse" : "flex-row")}
      role="list"
      aria-label={isRtl ? "خطوات التسجيل" : "Registration steps"}
    >
      {t.stepLabels.map((label, index) => {
        const isCompleted = index < activeIndex;
        const isActive = index === activeIndex;
        const isLast = index === totalSteps - 1;

        const circleClass = isActive
          ? CIRCLE_ACTIVE
          : isCompleted
          ? CIRCLE_COMPLETED
          : isDark
          ? CIRCLE_IDLE_DARK
          : CIRCLE_IDLE_LIGHT;

        const labelClass = isActive
          ? LABEL_ACTIVE
          : isCompleted
          ? isDark
            ? LABEL_COMPLETED_DARK
            : LABEL_COMPLETED_LIGHT
          : isDark
          ? LABEL_IDLE_DARK
          : LABEL_IDLE_LIGHT;

        const connectorClass =
          index < activeIndex
            ? CONNECTOR_DONE
            : isDark
            ? CONNECTOR_IDLE_DARK
            : CONNECTOR_IDLE_LIGHT;

        return (
          <React.Fragment key={label}>
            <div
              className="flex flex-col items-center gap-1.5 shrink-0"
              role="listitem"
              aria-current={isActive ? "step" : undefined}
            >
              <div
                className={cn(
                  "w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 font-semibold text-xs",
                  circleClass
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              <span
                className={cn(
                  "text-[10px] font-medium whitespace-nowrap tracking-wide transition-colors duration-300",
                  labelClass
                )}
              >
                {label}
              </span>
            </div>

            {!isLast && (
              <div className="flex-1 flex items-start pt-[18px] mx-2" aria-hidden="true">
                <div
                  className={cn("w-full h-px transition-all duration-500", connectorClass)}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
