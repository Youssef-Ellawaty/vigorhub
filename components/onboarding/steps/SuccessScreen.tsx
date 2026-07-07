"use client";

import React from "react";
import { CheckCircle2, Mail, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ActionButton } from "../primitives/ActionButton";
import type { Theme, PersonaType } from "../types";
import type { TranslationDict } from "../translations";

interface SuccessScreenProps {
  theme: Theme;
  isRtl: boolean;
  t: TranslationDict;
  personaType: PersonaType | null;
  username: string;
  onEnterPlatform: () => void;
}

// ─── Static class constants — no dynamic interpolation ────────────────────────

const PING_DARK = "bg-emerald-500/20";
const PING_LIGHT = "bg-emerald-400/20";

const MIDDLE_RING_DARK =
  "bg-emerald-500/10 ring-1 ring-emerald-500/30";
const MIDDLE_RING_LIGHT =
  "bg-emerald-100 ring-1 ring-emerald-400/40";

const ICON_WRAP_DARK =
  "bg-emerald-950/60 ring-2 ring-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.3)]";
const ICON_WRAP_LIGHT =
  "bg-emerald-50 ring-2 ring-emerald-400/60 shadow-[0_0_24px_rgba(16,185,129,0.15)]";

const HEADING_DARK = "text-slate-50";
const HEADING_LIGHT = "text-slate-900";

const HANDLE_DARK = "text-emerald-400";
const HANDLE_LIGHT = "text-emerald-600";

const SUBTITLE_DARK = "text-slate-400";
const SUBTITLE_LIGHT = "text-slate-500";

const NOTE_DARK = "bg-slate-800/50 border-slate-700/50";
const NOTE_LIGHT = "bg-slate-50 border-slate-200";

const NOTE_ICON_DARK = "text-cyan-400";
const NOTE_ICON_LIGHT = "text-cyan-500";

const NOTE_TEXT_DARK = "text-slate-400";
const NOTE_TEXT_LIGHT = "text-slate-500";

// ─────────────────────────────────────────────────────────────────────────────

export function SuccessScreen({
  theme,
  isRtl,
  t,
  username,
  onEnterPlatform,
}: SuccessScreenProps) {
  const isDark = theme === "dark";

  return (
    <div className="flex flex-col items-center gap-8 py-6 text-center">
      {/* Animated success badge */}
      <div className="relative flex items-center justify-center w-32 h-32">
        {/* Outer glow ring */}
        <div
          className={cn("absolute inset-0 rounded-full animate-ping", isDark ? PING_DARK : PING_LIGHT)}
          style={{ animationDuration: "2.2s" }}
          aria-hidden="true"
        />
        {/* Middle ring */}
        <div
          className={cn(
            "absolute w-28 h-28 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            isDark ? MIDDLE_RING_DARK : MIDDLE_RING_LIGHT
          )}
          aria-hidden="true"
        />
        {/* Icon container */}
        <div
          className={cn(
            "relative flex items-center justify-center w-24 h-24 rounded-full",
            isDark ? ICON_WRAP_DARK : ICON_WRAP_LIGHT
          )}
        >
          <CheckCircle2
            className="w-12 h-12 text-emerald-400"
            strokeWidth={1.6}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Text content */}
      <div className="flex flex-col gap-3 max-w-sm mx-auto">
        <h2
          className={cn(
            "text-3xl font-bold tracking-tight text-balance",
            isDark ? HEADING_DARK : HEADING_LIGHT
          )}
        >
          {t.successTitle}
        </h2>
        {username && (
          <p className={cn("text-sm font-mono tracking-widest", isDark ? HANDLE_DARK : HANDLE_LIGHT)}>
            @{username}
          </p>
        )}
        <p className={cn("text-sm leading-relaxed", isDark ? SUBTITLE_DARK : SUBTITLE_LIGHT)}>
          {t.successSubtitle}
        </p>
      </div>

      {/* Verification note */}
      <div
        className={cn(
          "flex items-start gap-3 rounded-2xl border px-5 py-4 max-w-sm w-full",
          isRtl ? "flex-row-reverse text-right" : "flex-row text-left",
          isDark ? NOTE_DARK : NOTE_LIGHT
        )}
        role="note"
      >
        <Mail
          className={cn("w-5 h-5 shrink-0 mt-0.5", isDark ? NOTE_ICON_DARK : NOTE_ICON_LIGHT)}
          strokeWidth={1.8}
          aria-hidden="true"
        />
        <p className={cn("text-xs leading-relaxed", isDark ? NOTE_TEXT_DARK : NOTE_TEXT_LIGHT)}>
          {t.successNote}
        </p>
      </div>

      {/* CTA button */}
      <ActionButton
        variant="primary"
        theme={theme}
        isRtl={isRtl}
        onClick={onEnterPlatform}
        trailingIcon={isRtl ? undefined : ArrowRight}
        className="px-10 py-4 text-base"
      >
        {t.successCta}
      </ActionButton>
    </div>
  );
}
