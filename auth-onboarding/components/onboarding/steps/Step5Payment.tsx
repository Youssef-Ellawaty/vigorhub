"use client";

import React, { useState } from "react";
import { Check, Smartphone, CreditCard, Sparkles, Crown, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormField, inputClasses } from "../primitives/FormField";
import { ActionButton } from "../primitives/ActionButton";
import { PlanTier, PaymentMethod, type Theme, type Step5Payload, type FieldError } from "../types";
import type { TranslationDict } from "../translations";

interface Step5Props {
  data: Step5Payload;
  onChange: (data: Step5Payload) => void;
  onSubmit: () => void;
  onBack: () => void;
  theme: Theme;
  isRtl: boolean;
  t: TranslationDict;
  isLoading?: boolean;
}

const VODAFONE_REGEX = /^01[0125][0-9]{8}$/;

const PLANS: {
  tier: PlanTier;
  price: number;
  icon: React.ElementType;
  popular?: boolean;
}[] = [
  { tier: PlanTier.Basic, price: 20, icon: Layers },
  { tier: PlanTier.Pro, price: 50, icon: Sparkles, popular: true },
  { tier: PlanTier.Ultimate, price: 120, icon: Crown },
];

function validate(data: Step5Payload, t: TranslationDict): FieldError[] {
  const errors: FieldError[] = [];
  if (!data.selectedPlan) {
    errors.push({ field: "selectedPlan", message: t.selectPlanError });
  }
  if (!data.paymentMethod) {
    errors.push({ field: "paymentMethod", message: t.selectPaymentMethodError });
  } else if (data.paymentMethod === PaymentMethod.VodafoneCash) {
    if (!VODAFONE_REGEX.test(data.vodafoneNumber.trim())) {
      errors.push({ field: "vodafoneNumber", message: t.vodafoneNumberError });
    }
  }
  return errors;
}

// ─── Static class maps — literal strings so Turbopack can scan at build time

const CARD_BASE_DARK = "bg-slate-800/50 border-slate-700/50 hover:border-slate-600";
const CARD_BASE_LIGHT = "bg-white border-slate-200 hover:border-slate-300 shadow-sm";
const CARD_SELECTED_DARK =
  "border-emerald-500/70 bg-emerald-950/30 shadow-[0_0_20px_rgba(16,185,129,0.12)] ring-1 ring-emerald-500/30";
const CARD_SELECTED_LIGHT =
  "border-emerald-500 bg-emerald-50 shadow-[0_0_14px_rgba(16,185,129,0.1)] ring-1 ring-emerald-500/30";

function PlanCard({
  tier,
  price,
  Icon,
  popular,
  isSelected,
  onSelect,
  theme,
  isRtl,
  t,
}: {
  tier: PlanTier;
  price: number;
  Icon: React.ElementType;
  popular?: boolean;
  isSelected: boolean;
  onSelect: () => void;
  theme: Theme;
  isRtl: boolean;
  t: TranslationDict;
}) {
  const isDark = theme === "dark";
  const title =
    tier === PlanTier.Basic ? t.planBasicTitle : tier === PlanTier.Pro ? t.planProTitle : t.planUltimateTitle;
  const desc =
    tier === PlanTier.Basic ? t.planBasicDesc : tier === PlanTier.Pro ? t.planProDesc : t.planUltimateDesc;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={onSelect}
      className={cn(
        "relative w-full rounded-2xl border p-5 transition-all duration-200 outline-none",
        "focus-visible:ring-2 focus-visible:ring-emerald-500",
        isRtl ? "text-right" : "text-left",
        isDark ? CARD_BASE_DARK : CARD_BASE_LIGHT,
        isSelected && (isDark ? CARD_SELECTED_DARK : CARD_SELECTED_LIGHT),
        popular && !isSelected && "border-emerald-500/40"
      )}
    >
      {popular && (
        <span
          className={cn(
            "absolute -top-3 text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide uppercase",
            "bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]",
            isRtl ? "right-4" : "left-4"
          )}
        >
          {t.mostPopularBadge}
        </span>
      )}

      <div className={cn("flex items-start gap-3", isRtl ? "flex-row-reverse" : "flex-row")}>
        <div
          className={cn(
            "flex items-center justify-center shrink-0 rounded-xl w-11 h-11",
            isSelected
              ? "bg-emerald-500/20 text-emerald-400"
              : isDark
              ? "bg-slate-700/60 text-slate-400"
              : "bg-slate-100 text-slate-500"
          )}
        >
          <Icon className="w-5 h-5" strokeWidth={1.8} />
        </div>

        <div className="flex-1 min-w-0">
          <div className={cn("flex items-baseline gap-2 flex-wrap", isRtl ? "flex-row-reverse justify-end" : "flex-row")}>
            <span
              className={cn(
                "font-bold text-sm",
                isSelected ? "text-emerald-400" : isDark ? "text-slate-100" : "text-slate-800"
              )}
            >
              {title}
            </span>
            <span className={cn("font-mono text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
              {price} {isRtl ? "ج.م" : "EGP"} {t.perMonth}
            </span>
          </div>
          <p className={cn("text-xs leading-relaxed mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
            {desc}
          </p>
        </div>

        <div
          className={cn(
            "shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
            isSelected ? "border-emerald-500 bg-emerald-500" : isDark ? "border-slate-600" : "border-slate-300"
          )}
        >
          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
      </div>
    </button>
  );
}

export function Step5Payment({
  data,
  onChange,
  onSubmit,
  onBack,
  theme,
  isRtl,
  t,
  isLoading = false,
}: Step5Props) {
  const isDark = theme === "dark";
  const [errors, setErrors] = useState<FieldError[]>([]);

  function getError(field: string) {
    return errors.find((e) => e.field === field)?.message;
  }

  function handleSubmit() {
    const validationErrors = validate(data, t);
    setErrors(validationErrors);
    if (validationErrors.length === 0) {
      onSubmit();
    }
  }

  const selectedPlanInfo = PLANS.find((p) => p.tier === data.selectedPlan);

  return (
    <div className="flex flex-col gap-6">
      {/* Step header */}
      <div className={cn("flex flex-col gap-1", isRtl ? "text-right" : "text-left")}>
        <h2 className={cn("text-2xl font-bold tracking-tight", isDark ? "text-slate-50" : "text-slate-900")}>
          {t.step5Title}
        </h2>
        <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-500")}>
          {t.step5Subtitle}
        </p>
      </div>

      {/* Plan cards */}
      <div className="flex flex-col gap-3" role="radiogroup" aria-label={t.step5Title}>
        {PLANS.map((p) => (
          <PlanCard
            key={p.tier}
            tier={p.tier}
            price={p.price}
            Icon={p.icon}
            popular={p.popular}
            isSelected={data.selectedPlan === p.tier}
            onSelect={() => onChange({ ...data, selectedPlan: p.tier })}
            theme={theme}
            isRtl={isRtl}
            t={t}
          />
        ))}
      </div>
      {getError("selectedPlan") && (
        <p className={cn("text-xs font-medium text-red-400 -mt-3", isRtl ? "text-right" : "text-left")}>
          {getError("selectedPlan")}
        </p>
      )}

      {/* Payment method */}
      <FormField id="paymentMethod" label={t.paymentMethodLabel} error={getError("paymentMethod")} theme={theme} isRtl={isRtl}>
        <div className={cn("grid grid-cols-2 gap-3")} role="radiogroup" aria-label={t.paymentMethodLabel}>
          {[
            { method: PaymentMethod.VodafoneCash, label: t.vodafoneCashLabel, Icon: Smartphone },
            { method: PaymentMethod.PayPal, label: t.paypalLabel, Icon: CreditCard },
          ].map(({ method, label, Icon }) => {
            const isSelected = data.paymentMethod === method;
            return (
              <button
                key={method}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onChange({ ...data, paymentMethod: method })}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 rounded-2xl border py-5 px-3 transition-all duration-200",
                  isDark ? CARD_BASE_DARK : CARD_BASE_LIGHT,
                  isSelected && (isDark ? CARD_SELECTED_DARK : CARD_SELECTED_LIGHT)
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-11 h-11 rounded-xl",
                    isSelected
                      ? "bg-emerald-500/20 text-emerald-400"
                      : isDark
                      ? "bg-slate-700/60 text-slate-400"
                      : "bg-slate-100 text-slate-500"
                  )}
                >
                  <Icon className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <span
                  className={cn(
                    "font-semibold text-sm",
                    isSelected ? "text-emerald-400" : isDark ? "text-slate-200" : "text-slate-700"
                  )}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </FormField>

      {/* Vodafone Cash number input — only shown when selected */}
      {data.paymentMethod === PaymentMethod.VodafoneCash && (
        <FormField
          id="vodafoneNumber"
          label={t.vodafoneNumberLabel}
          error={getError("vodafoneNumber")}
          theme={theme}
          isRtl={isRtl}
        >
          <input
            id="vodafoneNumber"
            type="tel"
            inputMode="numeric"
            value={data.vodafoneNumber}
            onChange={(e) =>
              onChange({ ...data, vodafoneNumber: e.target.value.replace(/[^0-9]/g, "").slice(0, 11) })
            }
            placeholder={t.vodafoneNumberPlaceholder}
            maxLength={11}
            className={cn(inputClasses(theme, !!getError("vodafoneNumber")), "text-center tracking-widest font-mono")}
            dir="ltr"
          />
        </FormField>
      )}

      {/* Order summary */}
      {selectedPlanInfo && data.paymentMethod && (
        <div
          className={cn(
            "rounded-2xl border px-4 py-3.5 flex items-center justify-between gap-3",
            isDark ? "bg-slate-800/40 border-slate-700/40" : "bg-slate-50 border-slate-200"
          )}
        >
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
              {t.payingWith}{" "}
              <span className={cn("font-semibold", isDark ? "text-slate-200" : "text-slate-800")}>
                {data.paymentMethod === PaymentMethod.VodafoneCash ? t.vodafoneCashLabel : t.paypalLabel}
              </span>
            </span>
          </div>
          <span className="font-mono font-bold text-sm text-emerald-400">
            {selectedPlanInfo.price} {isRtl ? "ج.م" : "EGP"}
          </span>
        </div>
      )}

      {/* Navigation */}
      <div className={cn("flex gap-3", isRtl ? "flex-row-reverse" : "flex-row")}>
        <ActionButton variant="secondary" theme={theme} isRtl={isRtl} onClick={onBack} className="flex-1" disabled={isLoading}>
          {t.back}
        </ActionButton>
        <ActionButton
          variant="primary"
          theme={theme}
          isRtl={isRtl}
          onClick={handleSubmit}
          className="flex-[2]"
          isLoading={isLoading}
          loadingText={isRtl ? "جاري التأكيد..." : "Confirming..."}
        >
          {t.confirmAndPay}
        </ActionButton>
      </div>
    </div>
  );
}