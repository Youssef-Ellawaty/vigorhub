"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { Theme } from "../types";

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  theme: Theme;
  isRtl: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  id,
  label,
  error,
  hint,
  theme,
  isRtl,
  children,
  className,
}: FormFieldProps) {
  const isDark = theme === "dark";

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={id}
        className={cn(
          "text-sm font-medium tracking-wide",
          isDark ? "text-slate-300" : "text-slate-700"
        )}
      >
        {label}
      </label>

      {children}

      {hint && !error && (
        <p
          className={cn(
            "text-xs leading-relaxed",
            isDark ? "text-slate-500" : "text-slate-400",
            isRtl ? "text-right" : "text-left"
          )}
        >
          {hint}
        </p>
      )}

      {error && (
        <p
          role="alert"
          className={cn(
            "text-xs leading-relaxed font-medium text-red-400",
            isRtl ? "text-right" : "text-left"
          )}
        >
          {error}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared input class builder.
// All class strings are fully static literals — no interpolation — so
// Turbopack can extract every token at build time and avoid HMR chunk errors.
// ─────────────────────────────────────────────────────────────────────────────

const INPUT_BASE =
  "w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-slate-500 focus:ring-2";

const INPUT_DARK_NORMAL =
  "bg-slate-800/60 text-slate-100 border-slate-700/60 focus:border-emerald-500/70 focus:ring-emerald-500/20 hover:border-slate-600";
const INPUT_DARK_ERROR =
  "bg-slate-800/60 text-slate-100 border-red-500/60 focus:border-red-500 focus:ring-red-500/20 hover:border-red-500/70";

const INPUT_LIGHT_NORMAL =
  "bg-white text-slate-900 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 hover:border-slate-300 shadow-sm";
const INPUT_LIGHT_ERROR =
  "bg-white text-slate-900 border-red-400 focus:border-red-500 focus:ring-red-400/20 hover:border-red-400 shadow-sm";

export function inputClasses(
  theme: Theme,
  hasError: boolean,
  extraClasses?: string
): string {
  const isDark = theme === "dark";
  const themeClass = isDark
    ? hasError
      ? INPUT_DARK_ERROR
      : INPUT_DARK_NORMAL
    : hasError
    ? INPUT_LIGHT_ERROR
    : INPUT_LIGHT_NORMAL;

  return cn(INPUT_BASE, themeClass, extraClasses);
}
