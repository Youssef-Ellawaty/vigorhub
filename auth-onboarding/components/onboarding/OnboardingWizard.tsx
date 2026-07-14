"use client";

import React, { useState, useCallback, useRef } from "react";
import { Sun, Moon, Languages, AtSign, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { t as getT } from "./translations";
import { StepIndicator } from "./primitives/StepIndicator";
import { Step1Credentials } from "./steps/Step1Credentials";
import { Step2Biometrics } from "./steps/Step2Biometrics";
import { Step4AAthleteGoal } from "./steps/Step4AAthleteGoal";
import { Step5Payment } from "./steps/Step5Payment";
import { SuccessScreen } from "./steps/SuccessScreen";
import {
  PersonaType,
  PaymentMethod,
  PlanTier,
  type Language,
  type Theme,
  type WizardStep,
  type SlideDirection,
  type WizardState,
  type OnboardingPayload,
} from "./types";

// ─── Initial State ─────────────────────────────────────────────────────────────

function buildInitialState(): WizardState {
  return {
    currentStep: "step1",
    slideDirection: "forward",
    language: "en",
    theme: "dark",
    step1: {
      fullName: "",
      username: "",
      contact: "",
      password: "",
      confirmPassword: "",
    },
    step2: {
      gender: null,
      age: null,
      heightCm: null,
      weightKg: null,
    },
    step3: {
      personaType: PersonaType.IndependentAthlete,
    },
    step4A: {
      athleteGoal: null,
    },
    step4B: {
      coachInviteCode: "",
    },
    step4C: {
      coachVerificationToken: "",
    },
    step5: {
      selectedPlan: null,
      billingCycle: "month",
      paymentMethod: null,
      vodafoneSenderNumber: "",
      vodafoneWhatsApp: "",
      vodafoneAmount: "",
      vodafoneScreenshot: "",
    },
  };
}

// ─── Step back routing ─────────────────────────────────────────────────────────

function getPreviousStep(current: WizardStep, personaType: PersonaType | null): WizardStep {
  switch (current) {
    case "step2":
      return "step1";
    case "step4A":
      return "step2";
    case "step5Payment":
      return "step4A";
    default:
      return "step1";
  }
}

// ─── Payload builder ───────────────────────────────────────────────────────────

function buildPayload(state: WizardState): OnboardingPayload {
  return {
    fullName: state.step1.fullName.trim(),
    username: state.step1.username.trim(),
    contact: state.step1.contact.trim(),
    password: state.step1.password,
    gender: state.step2.gender,
    age: state.step2.age,
    heightCm: state.step2.heightCm,
    weightKg: state.step2.weightKg,
    personaType: PersonaType.IndependentAthlete,
    athleteGoal: state.step4A.athleteGoal,
    coachInviteCode: null,
    coachVerificationToken: null,
    meta: {
      registeredAt: new Date().toISOString(),
      language: state.language,
      onboardingVersion: "1.0",
    },
  };
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function OnboardingWizard() {
  const [state, setState] = useState<WizardState>(buildInitialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Database Auth states
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const animationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const translations = getT(state.language);
  const isDark = state.theme === "dark";
  const isRtl = state.language === "ar";

  // ─── Navigation helpers ─────────────────────────────────────────────────────

  const navigateTo = useCallback(
    (nextStep: WizardStep, direction: SlideDirection) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setState((prev) => ({
        ...prev,
        currentStep: nextStep,
        slideDirection: direction,
      }));
      animationTimer.current = setTimeout(() => setIsAnimating(false), 350);
    },
    [isAnimating]
  );

  function handleNext(nextStep: WizardStep) {
    navigateTo(nextStep, "forward");
  }

  function handleBack() {
    const prev = getPreviousStep(state.currentStep, state.step3.personaType);
    navigateTo(prev, "backward");
  }



  // ─── Final submission ───────────────────────────────────────────────────────

  async function handleFinalSubmit() {
    setIsSubmitting(true);
    
    try {
      const contactVal = state.step1.contact.trim();
      const isEmail = contactVal.includes("@");
      
      const email = isEmail ? contactVal : "";
      const phone = !isEmail ? contactVal : "";

      // Calculate paid EGP amount based on the selected plan & billing cycle
      let paidAmount = 0;
      const plan = state.step5.selectedPlan;
      const cycle = state.step5.billingCycle;

      if (plan === PlanTier.Basic) {
        paidAmount = cycle === "month" ? 99 : (cycle === "3months" ? 249 : 699);
      } else if (plan === PlanTier.Pro) {
        paidAmount = cycle === "month" ? 199 : (cycle === "3months" ? 499 : 1399);
      } else if (plan === PlanTier.Ultimate) {
        paidAmount = cycle === "month" ? 399 : (cycle === "3months" ? 999 : 2799);
      }

      const payload = {
        fullName: state.step1.fullName.trim(),
        username: state.step1.username.trim(),
        email: email || null,
        phone: phone || null,
        password: state.step1.password,
        gender: state.step2.gender || "Male",
        height: state.step2.heightCm ? parseFloat(state.step2.heightCm.toString()) : 175,
        weight: state.step2.weightKg ? parseFloat(state.step2.weightKg.toString()) : 70,
        age: state.step2.age ? parseInt(state.step2.age.toString()) : 24,
        primaryGoal: state.step4A.athleteGoal || "MuscleGain",
        accountType: plan === PlanTier.Basic ? "basic_athlete" : (plan === PlanTier.Pro ? "pro_athlete" : (plan === PlanTier.Ultimate ? "vip_athlete" : "free_athlete")),
        subscriptionStatus: state.step5.paymentMethod === PaymentMethod.VodafoneCash ? "PENDING" : (!plan ? "INACTIVE" : "ACTIVE"),
        subscriptionPlan: plan || "free",
        billingCycle: !plan ? null : cycle,
        paymentStatus: state.step5.paymentMethod === PaymentMethod.VodafoneCash ? "PENDING" : (!plan ? "UNPAID" : "PAID"),
        paymentMethod: state.step5.paymentMethod,
        paidAmount: paidAmount,
        paidCurrency: "EGP",
        paypalOrderId: state.step5.paymentMethod === PaymentMethod.PayPal ? "SIMULATED_ORDER_ID" : null,
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(isRtl ? resData.error : resData.errorEn || "Registration failed.");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("vigorhub_current_user", JSON.stringify(resData.user));
      }

      setIsSubmitting(false);
      navigateTo("success", "forward");
    } catch (err: any) {
      console.error("[Registration DB Error]", err);
      alert(err.message || "An error occurred during registration. Please verify details.");
      setIsSubmitting(false);
    }
  }

  // ─── Login handler ──────────────────────────────────────────────────────────

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword) {
      setLoginError(isRtl ? "برجاء إدخال اسم المستخدم/البريد وكلمة المرور." : "Please enter your username/email and password.");
      return;
    }

    setIsLoggingIn(true);
    setLoginError(null);

    const identifierClean = loginIdentifier.trim();

    try {
      // 1. Try standard DB Login first
      let res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usernameOrEmail: identifierClean,
          password: loginPassword,
        }),
      });

      let resData = await res.json();

      // 2. If DB login failed (e.g. 401 or user not found), let's check localStorage for fallback migration
      if (!res.ok) {
        if (typeof window !== "undefined") {
          try {
            const localUsers = JSON.parse(localStorage.getItem("vigorhub_users") || "[]");
            const foundLocal = localUsers.find((u: any) => 
              (u.username === identifierClean || u.email === identifierClean || u.phone === identifierClean) &&
              u.password === loginPassword
            );

            if (foundLocal) {
              console.log("[Migration] Found matching local user in localStorage. Registering on DB on-the-fly...");
              const contactVal = foundLocal.email || foundLocal.phone || foundLocal.contact || "";
              const isEmail = contactVal.includes("@");
              const email = isEmail ? contactVal : "";
              const phone = !isEmail ? contactVal : "";

              // Determine plan & billing cycle
              const plan = foundLocal.plan;
              const cycle = foundLocal.billingCycle || "month";

              let paidAmount = 0;
              if (plan === PlanTier.Basic) {
                paidAmount = cycle === "month" ? 99 : (cycle === "3months" ? 249 : 699);
              } else if (plan === PlanTier.Pro) {
                paidAmount = cycle === "month" ? 199 : (cycle === "3months" ? 499 : 1399);
              } else if (plan === PlanTier.Ultimate) {
                paidAmount = cycle === "month" ? 399 : (cycle === "3months" ? 999 : 2799);
              }

              const payload = {
                fullName: foundLocal.fullName || "Athlete",
                username: foundLocal.username,
                email: email || null,
                phone: phone || null,
                password: foundLocal.password,
                gender: foundLocal.gender || "Male",
                height: foundLocal.height || foundLocal.heightCm ? parseFloat((foundLocal.height || foundLocal.heightCm).toString()) : 175,
                weight: foundLocal.weight || foundLocal.weightKg ? parseFloat((foundLocal.weight || foundLocal.weightKg).toString()) : 70,
                age: foundLocal.age ? parseInt(foundLocal.age.toString()) : 24,
                primaryGoal: foundLocal.goal || foundLocal.primaryGoal || "MuscleGain",
                accountType: plan === PlanTier.Basic ? "basic_athlete" : (plan === PlanTier.Pro ? "pro_athlete" : (plan === PlanTier.Ultimate ? "vip_athlete" : "free_athlete")),
                subscriptionStatus: foundLocal.status === "pending" ? "PENDING" : (!plan ? "INACTIVE" : "ACTIVE"),
                subscriptionPlan: plan || "free",
                billingCycle: !plan ? null : cycle,
                paymentStatus: foundLocal.status === "pending" ? "PENDING" : (!plan ? "UNPAID" : "PAID"),
                paymentMethod: foundLocal.paymentMethod || "PayPal",
                paidAmount: paidAmount,
                paidCurrency: "EGP",
              };

              const regRes = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
              });

              if (regRes.ok) {
                const regData = await regRes.json();
                localStorage.setItem("vigorhub_current_user", JSON.stringify(regData.user));
                window.location.reload();
                return;
              } else {
                const regErrData = await regRes.json();
                console.warn("[Migration Error] Auto-registration failed:", regErrData);
              }
            }
          } catch (migrateErr) {
            console.error("[Migration Exception]", migrateErr);
          }
        }

        // If local migration didn't run or succeed, throw the original error
        throw new Error(isRtl ? resData.error : resData.errorEn || "Login failed.");
      }

      // 3. Success login from standard DB
      if (typeof window !== "undefined") {
        localStorage.setItem("vigorhub_current_user", JSON.stringify(resData.user));
        // Force fully reloading/triggering parent auth state
        window.location.reload();
      }
    } catch (err: any) {
      console.error("[Login DB Error]", err);
      setLoginError(err.message || "Invalid login credentials.");
    } finally {
      setIsLoggingIn(false);
    }
  }

  // ─── Theme toggle ───────────────────────────────────────────────────────────

  function toggleTheme() {
    setState((prev) => ({
      ...prev,
      theme: prev.theme === "dark" ? "light" : "dark",
    }));
  }

  // ─── Language toggle ────────────────────────────────────────────────────────

  function toggleLanguage() {
    setState((prev) => ({
      ...prev,
      language: prev.language === "en" ? "ar" : "en",
    }));
  }

  // ─── Slide animation classes ────────────────────────────────────────────────
  // Static string literals so Turbopack can scan all class names at build time.

  const SLIDE_FORWARD = "animate-in slide-in-from-right-8 fade-in duration-300";
  const SLIDE_BACKWARD = "animate-in slide-in-from-left-8 fade-in duration-300";

  const slideKey = state.currentStep;
  const enterClass = state.slideDirection === "forward" ? SLIDE_FORWARD : SLIDE_BACKWARD;

  // ─── Is success ─────────────────────────────────────────────────────────────

  const isSuccess = state.currentStep === "success";

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={cn(
        "min-h-screen flex items-center justify-center transition-colors duration-300",
        "px-4 py-10 sm:py-14",
        isDark ? "bg-[#0B0F19]" : "bg-slate-50"
      )}
    >
      {/* Card */}
      <div
        className={cn(
          "relative w-full max-w-lg rounded-3xl border overflow-hidden",
          "transition-all duration-300",
          isDark
            ? "bg-slate-900/70 border-slate-700/40 shadow-[0_0_80px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            : "bg-white border-slate-200/80 shadow-[0_8px_48px_rgba(0,0,0,0.08)]"
        )}
      >
        {/* ── Top accent line */}
        <div
          className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent"
          aria-hidden="true"
        />

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <header
          className="flex items-center justify-between px-6 pt-6 pb-5"
        >
          {/* Brand */}
          <div
            className={cn(
              "flex items-center gap-2",
              isRtl ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div
              className={cn(
                "flex items-center justify-center w-9 h-9 rounded-xl overflow-hidden",
                "bg-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.4)]"
              )}
              aria-hidden="true"
            >
              <img src="/logo.jpg" alt="VigorHub Logo" className="w-full h-full object-cover" />
            </div>
            <span
              className={cn(
                "text-lg font-extrabold tracking-tight",
                isDark ? "text-slate-50" : "text-slate-900"
              )}
            >
              {translations.brandName}
            </span>
          </div>

          {/* Header actions */}
          <div
            className={cn(
              "flex items-center gap-2",
              isRtl ? "flex-row-reverse" : "flex-row"
            )}
          >
            {/* Language toggle */}
            <button
              type="button"
              onClick={toggleLanguage}
              aria-label={
                state.language === "en"
                  ? "Switch to Arabic"
                  : "Switch to English"
              }
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold tracking-wide transition-all duration-200",
                isDark
                  ? "border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200 hover:bg-slate-800/60"
                  : "border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 hover:bg-slate-50"
              )}
            >
              <Languages className="w-3.5 h-3.5" aria-hidden="true" />
              {translations.toggleLanguage}
            </button>

            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
              className={cn(
                "flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200",
                isDark
                  ? "border-slate-700 text-slate-400 hover:border-slate-600 hover:text-amber-300 hover:bg-slate-800/60"
                  : "border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 hover:bg-slate-50"
              )}
            >
              {isDark ? (
                <Sun className="w-4 h-4" strokeWidth={1.8} aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4" strokeWidth={1.8} aria-hidden="true" />
              )}
            </button>
          </div>
        </header>

        {/* ── Step indicator ─────────────────────────────────────────────────── */}
        {!isSuccess && !isLoginMode && (
          <div className="px-6 pb-5">
            <StepIndicator
              currentStep={state.currentStep}
              theme={state.theme}
              isRtl={isRtl}
              t={translations}
            />
          </div>
        )}

        {/* ── Divider */}
        {!isSuccess && !isLoginMode && (
          <div
            className={cn(
              "h-px mx-6",
              isDark ? "bg-slate-700/50" : "bg-slate-100"
            )}
            aria-hidden="true"
          />
        )}

        {/* ── Step content area ──────────────────────────────────────────────── */}
        <main
          className="px-6 py-7"
          aria-live="polite"
          aria-atomic="false"
        >
          <div key={isLoginMode ? "login" : slideKey} className={enterClass}>
            {isLoginMode ? (
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-6">
                {/* Step header */}
                <div className={cn("flex flex-col gap-1", isRtl ? "text-right" : "text-left")}>
                  <h2
                    className={cn(
                      "text-2xl font-bold tracking-tight",
                      isDark ? "text-slate-50" : "text-slate-900"
                    )}
                  >
                    {isRtl ? "تسجيل الدخول" : "Athlete Login"}
                  </h2>
                  <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-500")}>
                    {isRtl ? "أدخل اسم المستخدم أو البريد الإلكتروني لمتابعة تدريبك" : "Enter your username or email to continue your training"}
                  </p>
                </div>

                {/* Error Banner */}
                {loginError && (
                  <div className={cn(
                    "p-3.5 rounded-xl border flex items-start gap-2.5 text-xs animate-in fade-in duration-200",
                    isDark
                      ? "bg-red-500/10 border-red-500/30 text-red-400"
                      : "bg-red-50 border-red-200 text-red-700"
                  )}>
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                {/* Input Fields */}
                <div className="flex flex-col gap-4">
                  {/* Identifier */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="loginIdentifier"
                      className={cn(
                        "text-xs font-bold uppercase tracking-wider",
                        isDark ? "text-slate-400" : "text-slate-600",
                        isRtl ? "text-right" : "text-left"
                      )}
                    >
                      {isRtl ? "اسم المستخدم أو البريد الإلكتروني" : "Username or Email"}
                    </label>
                    <div className="relative">
                      <AtSign className={cn(
                        "absolute top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none",
                        isDark ? "text-slate-500" : "text-slate-400",
                        isRtl ? "right-4" : "left-4"
                      )} />
                      <input
                        id="loginIdentifier"
                        type="text"
                        required
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder={isRtl ? "أدخل اسم المستخدم أو البريد" : "e.g. athlete_1 or email@domain.com"}
                        className={cn(
                          "w-full rounded-xl py-3 px-4 text-sm font-medium border transition-all duration-200 outline-none",
                          isDark
                            ? "bg-slate-900 border-slate-700/60 text-slate-100 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30"
                            : "bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20",
                          isRtl ? "pr-10 pl-4" : "pl-10 pr-4"
                        )}
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="loginPassword"
                      className={cn(
                        "text-xs font-bold uppercase tracking-wider",
                        isDark ? "text-slate-400" : "text-slate-600",
                        isRtl ? "text-right" : "text-left"
                      )}
                    >
                      {isRtl ? "كلمة المرور" : "Password"}
                    </label>
                    <div className="relative">
                      <Lock className={cn(
                        "absolute top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none",
                        isDark ? "text-slate-500" : "text-slate-400",
                        isRtl ? "right-4" : "left-4"
                      )} />
                      <input
                        id="loginPassword"
                        type={showLoginPassword ? "text" : "password"}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder={isRtl ? "••••••••" : "••••••••"}
                        className={cn(
                          "w-full rounded-xl py-3 px-4 text-sm font-medium border transition-all duration-200 outline-none",
                          isDark
                            ? "bg-slate-900 border-slate-700/60 text-slate-100 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30"
                            : "bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20",
                          isRtl ? "pr-10 pl-10" : "pl-10 pr-10"
                        )}
                        dir="ltr"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword((v) => !v)}
                        className={cn(
                          "absolute top-1/2 -translate-y-1/2 transition-colors",
                          isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600",
                          isRtl ? "left-3" : "right-3"
                        )}
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className={cn(
                    "w-full py-3 px-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-200",
                    "flex items-center justify-center gap-2 text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_16px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)] active:scale-[0.98]"
                  )}
                >
                  {isLoggingIn ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{isRtl ? "جاري تسجيل الدخول..." : "Logging in..."}</span>
                    </>
                  ) : (
                    <span>{isRtl ? "تسجيل الدخول" : "Log In"}</span>
                  )}
                </button>

                {/* Back to registration toggle */}
                <div className="text-center mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoginMode(false);
                      setLoginError(null);
                      setLoginIdentifier("");
                      setLoginPassword("");
                    }}
                    className={cn(
                      "text-xs font-semibold hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 rounded px-2 py-1",
                      isDark ? "text-slate-400 hover:text-emerald-400" : "text-slate-500 hover:text-emerald-600"
                    )}
                  >
                    {isRtl ? "ليس لديك حساب؟ سجل اشتراك جديد" : "Don't have an account? Sign up"}
                  </button>
                </div>
              </form>
            ) : (
              <>
                {state.currentStep === "step1" && (
                  <Step1Credentials
                    data={state.step1}
                    onChange={(data) =>
                      setState((prev) => ({ ...prev, step1: data }))
                    }
                    onNext={() => handleNext("step2")}
                    onToggleLogin={() => setIsLoginMode(true)}
                    theme={state.theme}
                    isRtl={isRtl}
                    t={translations}
                  />
                )}

                {state.currentStep === "step2" && (
                  <Step2Biometrics
                    data={state.step2}
                    onChange={(data) =>
                      setState((prev) => ({ ...prev, step2: data }))
                    }
                    onNext={() => handleNext("step4A")}
                    onBack={handleBack}
                    theme={state.theme}
                    isRtl={isRtl}
                    t={translations}
                  />
                )}

                {state.currentStep === "step4A" && (
                  <Step4AAthleteGoal
                    data={state.step4A}
                    onChange={(data) =>
                      setState((prev) => ({ ...prev, step4A: data }))
                    }
                    onSubmit={() => handleNext("step5Payment")}
                    onBack={handleBack}
                    theme={state.theme}
                    isRtl={isRtl}
                    t={translations}
                    isLoading={isSubmitting}
                  />
                )}

                {state.currentStep === "step5Payment" && (
                  <Step5Payment
                    data={state.step5}
                    onChange={(data) =>
                      setState((prev) => ({ ...prev, step5: data }))
                    }
                    onSubmit={handleFinalSubmit}
                    onBack={handleBack}
                    theme={state.theme}
                    isRtl={isRtl}
                    t={translations}
                    isLoading={isSubmitting}
                  />
                )}

                {state.currentStep === "success" && (
                  <SuccessScreen
                    theme={state.theme}
                    isRtl={isRtl}
                    t={translations}
                    personaType={state.step3.personaType}
                    username={state.step1.username}
                    onEnterPlatform={() => {
                      // In a real app, redirect to the dashboard
                      setState(buildInitialState);
                    }}
                  />
                )}
              </>
            )}
          </div>
        </main>

        {/* ── Bottom tagline / legal ─────────────────────────────────────────── */}
        {!isSuccess && (
          <footer
            className={cn(
              "px-6 pb-6 text-center text-xs",
              isDark ? "text-slate-600" : "text-slate-400"
            )}
          >
            {isRtl
              ? "بالتسجيل، أنت توافق على شروط الاستخدام وسياسة الخصوصية."
              : "By registering, you agree to our Terms of Service and Privacy Policy."}
          </footer>
        )}
      </div>
    </div>
  );
}
