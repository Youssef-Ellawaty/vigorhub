"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { Theme } from "../types";
import type { LucideIcon } from "lucide-react";

interface SelectionCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accentIcon?: LucideIcon;
  isSelected: boolean;
  onSelect: () => void;
  theme: Theme;
  isRtl: boolean;
  accentColor?: "emerald" | "cyan";
  disabled?: boolean;
  badge?: string;
}

// ─── Static lookup maps — Turbopack can scan every class at build time ────────

const CARD_BASE_DARK =
  "bg-slate-800/50 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/80 focus-visible:ring-emerald-500 focus-visible:ring-offset-slate-900";
const CARD_BASE_LIGHT =
  "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md focus-visible:ring-emerald-500 focus-visible:ring-offset-white shadow-sm";

const CARD_SELECTED: Record<"emerald" | "cyan", Record<"dark" | "light", string>> = {
  emerald: {
    dark: "border-emerald-500/70 bg-emerald-950/30 shadow-[0_0_24px_rgba(16,185,129,0.12)] ring-1 ring-emerald-500/30",
    light: "border-emerald-500 bg-emerald-50 shadow-[0_0_16px_rgba(16,185,129,0.1)] ring-1 ring-emerald-500/30",
  },
  cyan: {
    dark: "border-cyan-500/70 bg-cyan-950/30 shadow-[0_0_24px_rgba(6,182,212,0.12)] ring-1 ring-cyan-500/30",
    light: "border-cyan-500 bg-cyan-50 shadow-[0_0_16px_rgba(6,182,212,0.1)] ring-1 ring-cyan-500/30",
  },
};

const ICON_SELECTED: Record<"emerald" | "cyan", string> = {
  emerald: "bg-emerald-500/20 text-emerald-400",
  cyan: "bg-cyan-500/20 text-cyan-400",
};

const TITLE_SELECTED: Record<"emerald" | "cyan", string> = {
  emerald: "text-emerald-400",
  cyan: "text-cyan-400",
};

const BADGE_ACCENT: Record<"emerald" | "cyan", string> = {
  emerald: "bg-emerald-500/20 text-emerald-400",
  cyan: "bg-cyan-500/20 text-cyan-400",
};

const RADIO_SELECTED: Record<"emerald" | "cyan", string> = {
  emerald: "border-emerald-500 bg-emerald-500",
  cyan: "border-cyan-500 bg-cyan-500",
};

// ─────────────────────────────────────────────────────────────────────────────

export function SelectionCard({
  id,
  title,
  description,
  icon: Icon,
  isSelected,
  onSelect,
  theme,
  isRtl,
  accentColor = "emerald",
  disabled = false,
  badge,
}: SelectionCardProps) {
  const isDark = theme === "dark";
  const themeKey = isDark ? "dark" : "light";

  return (
    <button
      type="button"
      id={id}
      role="radio"
      aria-checked={isSelected}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "relative w-full rounded-2xl border p-5 transition-all duration-200 outline-none",
        "focus-visible:ring-2 focus-visible:ring-offset-2",
        isRtl ? "text-right" : "text-left",
        isDark ? CARD_BASE_DARK : CARD_BASE_LIGHT,
        isSelected && CARD_SELECTED[accentColor][themeKey],
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <div
        className={cn(
          "flex items-start gap-4",
          isRtl ? "flex-row-reverse" : "flex-row"
        )}
      >
        {/* Icon container */}
        <div
          className={cn(
            "flex items-center justify-center shrink-0 rounded-xl w-12 h-12 transition-colors duration-200",
            isSelected
              ? ICON_SELECTED[accentColor]
              : isDark
              ? "bg-slate-700/60 text-slate-400"
              : "bg-slate-100 text-slate-500"
          )}
          aria-hidden="true"
        >
          <Icon className="w-6 h-6" strokeWidth={1.8} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div
            className={cn(
              "flex items-center gap-2 mb-1",
              isRtl ? "flex-row-reverse" : "flex-row"
            )}
          >
            <span
              className={cn(
                "font-semibold text-sm tracking-wide",
                isSelected
                  ? TITLE_SELECTED[accentColor]
                  : isDark
                  ? "text-slate-100"
                  : "text-slate-800"
              )}
            >
              {title}
            </span>
            {badge && (
              <span
                className={cn(
                  "text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-widest uppercase",
                  BADGE_ACCENT[accentColor]
                )}
              >
                {badge}
              </span>
            )}
          </div>
          <p
            className={cn(
              "text-xs leading-relaxed",
              isDark ? "text-slate-400" : "text-slate-500"
            )}
          >
            {description}
          </p>
        </div>

        {/* Selection indicator */}
        <div
          className={cn(
            "shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
            isSelected
              ? RADIO_SELECTED[accentColor]
              : isDark
              ? "border-slate-600"
              : "border-slate-300"
          )}
          aria-hidden="true"
        >
          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
      </div>
    </button>
  );
}
