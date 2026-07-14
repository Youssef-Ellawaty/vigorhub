"use client";

import React, { useState } from "react";
import { User, AtSign, Mail, Eye, EyeOff, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormField, inputClasses } from "../primitives/FormField";
import { ActionButton } from "../primitives/ActionButton";
import type { Theme, Step1Payload, FieldError } from "../types";
import type { TranslationDict } from "../translations";

interface Step1Props {
  data: Step1Payload;
  onChange: (data: Step1Payload) => void;
  onNext: () => void;
  onToggleLogin?: () => void;
  theme: Theme;
  isRtl: boolean;
  t: TranslationDict;
}

// ─── Validation ───────────────────────────────────────────────────────────────

const USERNAME_REGEX = /^[a-z0-9_]+$/;

function validate(data: Step1Payload, t: TranslationDict): FieldError[] {
  const errors: FieldError[] = [];

  if (!data.fullName.trim()) {
    errors.push({ field: "fullName", message: t.fieldRequiredError });
  }

  if (!data.username.trim()) {
    errors.push({ field: "username", message: t.fieldRequiredError });
  } else if (!USERNAME_REGEX.test(data.username)) {
    errors.push({ field: "username", message: t.usernameError });
  }

  if (!data.contact.trim()) {
    errors.push({ field: "contact", message: t.fieldRequiredError });
  }

  if (!data.password) {
    errors.push({ field: "password", message: t.fieldRequiredError });
  } else if (data.password.length < 8) {
    errors.push({ field: "password", message: t.passwordTooShortError });
  }

  if (!data.confirmPassword) {
    errors.push({ field: "confirmPassword", message: t.fieldRequiredError });
  } else if (data.password !== data.confirmPassword) {
    errors.push({ field: "confirmPassword", message: t.passwordMismatchError });
  }

  return errors;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Step1Credentials({
  data,
  onChange,
  onNext,
  onToggleLogin,
  theme,
  isRtl,
  t,
}: Step1Props) {
  const isDark = theme === "dark";
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [usernameRealtime, setUsernameRealtime] = useState<string | null>(null);

  function getError(field: string): string | undefined {
    return errors.find((e) => e.field === field)?.message;
  }

  function handleUsernameChange(raw: string) {
    // Force lowercase, strip spaces in real time
    const cleaned = raw.toLowerCase().replace(/\s/g, "");
    onChange({ ...data, username: cleaned });

    if (cleaned.length > 0 && !USERNAME_REGEX.test(cleaned)) {
      setUsernameRealtime(t.usernameError);
    } else {
      setUsernameRealtime(null);
    }
  }

  function handleNext() {
    const validationErrors = validate(data, t);
    setErrors(validationErrors);
    if (validationErrors.length === 0) {
      onNext();
    }
  }

  const iconClass = cn(
    "absolute top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none",
    isDark ? "text-slate-500" : "text-slate-400",
    isRtl ? "right-4" : "left-4"
  );

  const inputWithIconClass = (field: string) =>
    inputClasses(theme, !!getError(field), isRtl ? "pr-10 pl-4" : "pl-10 pr-4");

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
          {t.step1Title}
        </h2>
        <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-500")}>
          {t.step1Subtitle}
        </p>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-4">
        {/* Full Name */}
        <FormField
          id="fullName"
          label={t.labelFullName}
          error={getError("fullName")}
          theme={theme}
          isRtl={isRtl}
        >
          <div className="relative">
            <User className={iconClass} strokeWidth={1.8} aria-hidden="true" />
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              value={data.fullName}
              onChange={(e) => onChange({ ...data, fullName: e.target.value })}
              placeholder={t.placeholderFullName}
              className={inputWithIconClass("fullName")}
              dir={isRtl ? "rtl" : "ltr"}
            />
          </div>
        </FormField>

        {/* Username */}
        <FormField
          id="username"
          label={t.labelUsername}
          error={usernameRealtime ?? getError("username")}
          hint={!usernameRealtime && !getError("username") ? t.usernameHint : undefined}
          theme={theme}
          isRtl={isRtl}
        >
          <div className="relative">
            <AtSign
              className={iconClass}
              strokeWidth={1.8}
              aria-hidden="true"
            />
            <input
              id="username"
              type="text"
              autoComplete="username"
              spellCheck={false}
              value={data.username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              placeholder={t.placeholderUsername}
              className={cn(
                inputClasses(
                  theme,
                  !!(usernameRealtime ?? getError("username")),
                  isRtl ? "pr-10 pl-4" : "pl-10 pr-4"
                ),
                "font-mono tracking-wide"
              )}
              dir="ltr" // usernames are always LTR
            />
          </div>
        </FormField>

        {/* Contact — Email or Phone */}
        <FormField
          id="contact"
          label={t.labelContact}
          error={getError("contact")}
          theme={theme}
          isRtl={isRtl}
        >
          <div className="relative">
            <Mail className={iconClass} strokeWidth={1.8} aria-hidden="true" />
            <input
              id="contact"
              type="text"
              autoComplete="email"
              inputMode="email"
              value={data.contact}
              onChange={(e) => onChange({ ...data, contact: e.target.value })}
              placeholder={t.placeholderContact}
              className={inputWithIconClass("contact")}
              dir="ltr"
            />
          </div>
        </FormField>

        {/* Password + Confirm — side by side on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Password */}
          <FormField
            id="password"
            label={t.labelPassword}
            error={getError("password")}
            theme={theme}
            isRtl={isRtl}
          >
            <div className="relative">
              <Lock className={iconClass} strokeWidth={1.8} aria-hidden="true" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={data.password}
                onChange={(e) => onChange({ ...data, password: e.target.value })}
                placeholder={t.placeholderPassword}
                className={cn(
                  inputClasses(
                    theme,
                    !!getError("password"),
                    isRtl ? "pr-10 pl-10" : "pl-10 pr-10"
                  )
                )}
                dir="ltr"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 transition-colors",
                  isDark
                    ? "text-slate-500 hover:text-slate-300"
                    : "text-slate-400 hover:text-slate-600",
                  isRtl ? "left-3" : "right-3"
                )}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </FormField>

          {/* Confirm Password */}
          <FormField
            id="confirmPassword"
            label={t.labelConfirmPassword}
            error={getError("confirmPassword")}
            theme={theme}
            isRtl={isRtl}
          >
            <div className="relative">
              <Lock className={iconClass} strokeWidth={1.8} aria-hidden="true" />
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                value={data.confirmPassword}
                onChange={(e) =>
                  onChange({ ...data, confirmPassword: e.target.value })
                }
                placeholder={t.placeholderConfirmPassword}
                className={cn(
                  inputClasses(
                    theme,
                    !!getError("confirmPassword"),
                    isRtl ? "pr-10 pl-10" : "pl-10 pr-10"
                  )
                )}
                dir="ltr"
              />
              <button
                type="button"
                aria-label={showConfirm ? "Hide password" : "Show password"}
                onClick={() => setShowConfirm((v) => !v)}
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 transition-colors",
                  isDark
                    ? "text-slate-500 hover:text-slate-300"
                    : "text-slate-400 hover:text-slate-600",
                  isRtl ? "left-3" : "right-3"
                )}
              >
                {showConfirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </FormField>
        </div>
      </div>

      {/* CTA */}
      <ActionButton
        variant="primary"
        theme={theme}
        isRtl={isRtl}
        fullWidth
        onClick={handleNext}
      >
        {t.next}
      </ActionButton>

      {onToggleLogin && (
        <div className="text-center">
          <button
            type="button"
            onClick={onToggleLogin}
            className={cn(
              "text-xs font-semibold hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 rounded px-2 py-1",
              isDark ? "text-slate-400 hover:text-emerald-400" : "text-slate-500 hover:text-emerald-600"
            )}
          >
            {isRtl ? "لديك حساب بالفعل؟ تسجيل الدخول" : "Already have an account? Log In"}
          </button>
        </div>
      )}
    </div>
  );
}
