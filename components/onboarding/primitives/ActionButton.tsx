"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { Theme } from "../types";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  theme: Theme;
  isRtl?: boolean;
  leadingIcon?: LucideIcon;
  trailingIcon?: LucideIcon;
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
}

// ─── Static variant maps — all class strings are literal so Turbopack can
//     scan them at build time. No dynamic string interpolation. ────────────────

const PRIMARY_CLASSES =
  "bg-emerald-500 text-white hover:bg-emerald-400 active:bg-emerald-600 shadow-[0_4px_16px_rgba(16,185,129,0.35)] hover:shadow-[0_4px_24px_rgba(16,185,129,0.5)]";

const PRIMARY_RING_DARK = "focus-visible:ring-emerald-500 focus-visible:ring-offset-slate-900";
const PRIMARY_RING_LIGHT = "focus-visible:ring-emerald-500 focus-visible:ring-offset-white";

const SECONDARY_DARK =
  "bg-slate-800/60 text-slate-300 border border-slate-700/70 hover:bg-slate-700/60 hover:text-slate-100 hover:border-slate-600 focus-visible:ring-slate-500 focus-visible:ring-offset-slate-900";
const SECONDARY_LIGHT =
  "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 shadow-sm focus-visible:ring-slate-400 focus-visible:ring-offset-white";

const GHOST_DARK =
  "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 focus-visible:ring-slate-500 focus-visible:ring-offset-slate-900";
const GHOST_LIGHT =
  "text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400 focus-visible:ring-offset-white";

// ─────────────────────────────────────────────────────────────────────────────

export function ActionButton({
  variant = "primary",
  theme,
  isRtl = false,
  leadingIcon: LeadingIcon,
  trailingIcon: TrailingIcon,
  isLoading = false,
  loadingText,
  fullWidth = false,
  children,
  className,
  disabled,
  ...rest
}: ActionButtonProps) {
  const isDark = theme === "dark";
  const isDisabled = disabled || isLoading;

  const variantClasses =
    variant === "primary"
      ? cn(PRIMARY_CLASSES, isDark ? PRIMARY_RING_DARK : PRIMARY_RING_LIGHT)
      : variant === "secondary"
      ? isDark
        ? SECONDARY_DARK
        : SECONDARY_LIGHT
      : isDark
      ? GHOST_DARK
      : GHOST_LIGHT;

  return (
    <button
      disabled={isDisabled}
      className={cn(
        "inline-flex items-center justify-center gap-2.5 rounded-xl px-6 py-3.5",
        "text-sm font-semibold tracking-wide transition-all duration-200 outline-none",
        "focus-visible:ring-2 focus-visible:ring-offset-2",
        isRtl ? "flex-row-reverse" : "flex-row",
        fullWidth && "w-full",
        variantClasses,
        isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      {...rest}
    >
      {isLoading ? (
        <>
          <span
            className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"
            aria-hidden="true"
          />
          <span>{loadingText ?? children}</span>
        </>
      ) : (
        <>
          {LeadingIcon && (
            <LeadingIcon
              className="w-4 h-4 shrink-0"
              strokeWidth={2}
              aria-hidden="true"
            />
          )}
          <span>{children}</span>
          {TrailingIcon && (
            <TrailingIcon
              className="w-4 h-4 shrink-0"
              strokeWidth={2}
              aria-hidden="true"
            />
          )}
        </>
      )}
    </button>
  );
}
