"use client";

import React, { useState } from "react";
import { ShieldCheck, AlertCircle, CheckCircle2, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormField, inputClasses } from "../primitives/FormField";
import { ActionButton } from "../primitives/ActionButton";
import type { Theme, Step4CPayload, FieldError } from "../types";
import type { TranslationDict } from "../translations";

interface Step4CProps {
  data: Step4CPayload;
  onChange: (data: Step4CPayload) => void;
  onSubmit: () => void;
  onBack: () => void;
  theme: Theme;
  isRtl: boolean;
  t: TranslationDict;
  isLoading?: boolean;
}

// Coach tokens: VH-COACH- prefix followed by 8 uppercase alphanumeric chars
// Accept both the prefixed format and raw 8-char tokens for UX flexibility
const TOKEN_REGEX_PREFIXED = /^VH-COACH-[A-Z0-9]{8}$/;
const TOKEN_REGEX_RAW = /^[A-Z0-9]{8,16}$/;

function isValidToken(token: string): boolean {
  const upper = token.trim().toUpperCase();
  return TOKEN_REGEX_PREFIXED.test(upper) || TOKEN_REGEX_RAW.test(upper);
}

function validate(data: Step4CPayload, t: TranslationDict): FieldError[] {
  const errors: FieldError[] = [];
  const trimmed = data.coachVerificationToken.trim();

  if (!trimmed) {
    errors.push({
      field: "coachVerificationToken",
      message: t.coachTokenRequiredError,
    });
  } else if (!isValidToken(trimmed)) {
    errors.push({
      field: "coachVerificationToken",
      message: t.coachTokenInvalidError,
    });
  }
  return errors;
}

export function Step4CCoachVerify({
  data,
  onChange,
  onSubmit,
  onBack,
  theme,
  isRtl,
  t,
  isLoading = false,
}: Step4CProps) {
  const isDark = theme === "dark";
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [validationAttempted, setValidationAttempted] = useState(false);

  const tokenError = errors.find(
    (e) => e.field === "coachVerificationToken"
  )?.message;

  const upperToken = data.coachVerificationToken.trim().toUpperCase();
  const isFormatValid = upperToken.length > 0 && isValidToken(upperToken);

  function handleTokenChange(raw: string) {
    // Allow alphanumeric + hyphens (for VH-COACH- prefix), uppercase, max 20 chars
    const cleaned = raw
      .replace(/[^A-Za-z0-9-]/g, "")
      .toUpperCase()
      .slice(0, 20);
    onChange({ ...data, coachVerificationToken: cleaned });

    if (validationAttempted) {
      setErrors(validate({ coachVerificationToken: cleaned }, t));
    }
  }

  function handleSubmit() {
    setValidationAttempted(true);
    const validationErrors = validate(data, t);
    setErrors(validationErrors);
    if (validationErrors.length === 0) {
      onSubmit();
    }
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
          {t.step4CTitle}
        </h2>
        <p
          className={cn(
            "text-sm leading-relaxed",
            isDark ? "text-slate-400" : "text-slate-500"
          )}
        >
          {t.step4CSubtitle}
        </p>
      </div>

      {/* Admin token security notice */}
      <div
        className={cn(
          "flex items-start gap-3 rounded-xl border px-4 py-3.5",
          isRtl ? "flex-row-reverse text-right" : "flex-row text-left",
          isDark
            ? "bg-cyan-950/30 border-cyan-500/30 text-cyan-300"
            : "bg-cyan-50 border-cyan-200 text-cyan-700"
        )}
        role="note"
        aria-label={
          isRtl ? "ملاحظة أمنية" : "Security notice"
        }
      >
        <ShieldCheck
          className="w-5 h-5 shrink-0 mt-0.5"
          strokeWidth={1.8}
          aria-hidden="true"
        />
        <p className="text-xs leading-relaxed">
          {isRtl
            ? "هذا الرمز سري وفريد لك. لا تشاركه مع أي شخص آخر. تُصدر الرموز من إدارة فيغورهاب فقط."
            : "This token is confidential and unique to you. Never share it with anyone. Tokens are issued exclusively by VigorHub administration."}
        </p>
      </div>

      {/* Token input */}
      <FormField
        id="coachVerificationToken"
        label={t.labelCoachToken}
        error={tokenError}
        hint={!tokenError ? t.coachTokenHint : undefined}
        theme={theme}
        isRtl={isRtl}
      >
        <div className="relative">
          <KeyRound
            className={cn(
              "absolute top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none",
              isDark ? "text-slate-500" : "text-slate-400",
              isRtl ? "right-4" : "left-4"
            )}
            strokeWidth={1.8}
            aria-hidden="true"
          />
          <input
            id="coachVerificationToken"
            type="text"
            spellCheck={false}
            autoComplete="off"
            value={data.coachVerificationToken}
            onChange={(e) => handleTokenChange(e.target.value)}
            placeholder={t.placeholderCoachToken}
            maxLength={20}
            className={cn(
              inputClasses(
                theme,
                !!tokenError,
                isRtl ? "pr-10 pl-12" : "pl-10 pr-12"
              ),
              "text-center tracking-[0.25em] uppercase font-mono text-sm font-semibold"
            )}
            dir="ltr"
          />

          {/* Trailing validation indicator */}
          {data.coachVerificationToken.length > 0 && (
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2",
                isRtl ? "left-4" : "right-4"
              )}
              aria-hidden="true"
            >
              {isFormatValid ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              )}
            </div>
          )}
        </div>
      </FormField>

      {/* Token format reminder */}
      <div
        className={cn(
          "flex items-center gap-2 -mt-3 text-xs",
          isDark ? "text-slate-600" : "text-slate-400",
          isRtl ? "flex-row-reverse" : "flex-row"
        )}
      >
        <span
          className={cn(
            "font-mono px-2 py-0.5 rounded text-[10px] tracking-widest border",
            isDark
              ? "bg-slate-800 border-slate-700 text-slate-500"
              : "bg-slate-100 border-slate-200 text-slate-400"
          )}
        >
          VH-COACH-XXXXXXXX
        </span>
        <span>{isRtl ? "الصيغة المتوقعة" : "Expected format"}</span>
      </div>

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
          loadingText={isRtl ? "جاري التحقق..." : "Verifying..."}
        >
          {t.submit}
        </ActionButton>
      </div>
    </div>
  );
}
