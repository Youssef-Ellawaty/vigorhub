"use client";

import React, { useState } from "react";
import { Hash, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormField, inputClasses } from "../primitives/FormField";
import { ActionButton } from "../primitives/ActionButton";
import type { Theme, Step4BPayload, FieldError } from "../types";
import type { TranslationDict } from "../translations";

interface Step4BProps {
  data: Step4BPayload;
  onChange: (data: Step4BPayload) => void;
  onSubmit: () => void;
  onBack: () => void;
  theme: Theme;
  isRtl: boolean;
  t: TranslationDict;
  isLoading?: boolean;
}

// Invite codes: letters and numbers only, 5–10 chars
const INVITE_CODE_REGEX = /^[A-Z0-9]{5,10}$/;

function validate(data: Step4BPayload, t: TranslationDict): FieldError[] {
  const errors: FieldError[] = [];
  const trimmed = data.coachInviteCode.trim().toUpperCase();

  if (!trimmed) {
    errors.push({ field: "coachInviteCode", message: t.inviteCodeRequiredError });
  } else if (!INVITE_CODE_REGEX.test(trimmed)) {
    errors.push({ field: "coachInviteCode", message: t.inviteCodeInvalidError });
  }
  return errors;
}

export function Step4BCoachInvite({
  data,
  onChange,
  onSubmit,
  onBack,
  theme,
  isRtl,
  t,
  isLoading = false,
}: Step4BProps) {
  const isDark = theme === "dark";
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [validationAttempted, setValidationAttempted] = useState(false);

  const codeError = errors.find((e) => e.field === "coachInviteCode")?.message;

  // Real-time format preview
  const upperCode = data.coachInviteCode.toUpperCase();
  const isFormatValid =
    upperCode.length >= 5 && INVITE_CODE_REGEX.test(upperCode);

  function handleCodeChange(raw: string) {
    // Strip non-alphanumeric, uppercase, max 10 chars
    const cleaned = raw.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 10);
    onChange({ ...data, coachInviteCode: cleaned });
    // Clear errors while user types
    if (validationAttempted) {
      setErrors(validate({ coachInviteCode: cleaned }, t));
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
          {t.step4BTitle}
        </h2>
        <p
          className={cn(
            "text-sm leading-relaxed",
            isDark ? "text-slate-400" : "text-slate-500"
          )}
        >
          {t.step4BSubtitle}
        </p>
      </div>

      {/* Invite code input */}
      <FormField
        id="coachInviteCode"
        label={t.labelInviteCode}
        error={codeError}
        hint={!codeError ? t.inviteCodeHint : undefined}
        theme={theme}
        isRtl={isRtl}
      >
        <div className="relative">
          {/* Leading icon */}
          <Hash
            className={cn(
              "absolute top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none",
              isDark ? "text-slate-500" : "text-slate-400",
              isRtl ? "right-4" : "left-4"
            )}
            strokeWidth={1.8}
            aria-hidden="true"
          />

          {/* Input */}
          <input
            id="coachInviteCode"
            type="text"
            spellCheck={false}
            autoComplete="off"
            value={data.coachInviteCode}
            onChange={(e) => handleCodeChange(e.target.value)}
            placeholder={t.placeholderInviteCode}
            maxLength={10}
            className={cn(
              inputClasses(
                theme,
                !!codeError,
                isRtl ? "pr-10 pl-12" : "pl-10 pr-12"
              ),
              "text-center tracking-[0.35em] uppercase font-mono text-base font-semibold"
            )}
            dir="ltr"
            aria-describedby={codeError ? "invite-code-error" : "invite-code-hint"}
          />

          {/* Trailing validation indicator */}
          {data.coachInviteCode.length > 0 && (
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

      {/* Live character counter */}
      <div
        className={cn(
          "flex items-center gap-2 -mt-3",
          isRtl ? "flex-row-reverse" : "flex-row"
        )}
      >
        <div className="flex gap-1" aria-hidden="true">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-1.5 rounded-full transition-all duration-150",
                i < data.coachInviteCode.length
                  ? isFormatValid
                    ? "bg-emerald-500"
                    : "bg-amber-400"
                  : isDark
                  ? "bg-slate-700"
                  : "bg-slate-200"
              )}
            />
          ))}
        </div>
        <span
          className={cn(
            "text-xs tabular-nums",
            isDark ? "text-slate-600" : "text-slate-400"
          )}
        >
          {data.coachInviteCode.length}/10
        </span>
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
          loadingText={isRtl ? "جاري التسجيل..." : "Registering..."}
        >
          {t.submit}
        </ActionButton>
      </div>
    </div>
  );
}
