"use client";

import React, { useState, useCallback, useRef } from "react";
import { Sun, Moon, Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { t as getT } from "./translations";
import { StepIndicator } from "./primitives/StepIndicator";
import { Step1Credentials } from "./steps/Step1Credentials";
import { Step2Biometrics } from "./steps/Step2Biometrics";
import { Step3Persona } from "./steps/Step3Persona";
import { Step4AAthleteGoal } from "./steps/Step4AAthleteGoal";
import { Step4BCoachInvite } from "./steps/Step4BCoachInvite";
import { Step4CCoachVerify } from "./steps/Step4CCoachVerify";
import { Step5Payment } from "./steps/Step5Payment";
import { SuccessScreen } from "./steps/SuccessScreen";
import {
  PersonaType,
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
      personaType: null,
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
      paymentMethod: null,
      vodafoneNumber: "",
    },
  };
}

// ─── Step back routing ─────────────────────────────────────────────────────────

function getPreviousStep(current: WizardStep, personaType: PersonaType | null): WizardStep {
  switch (current) {
    case "step2":
      return "step1";
    case "step3":
      return "step2";
    case "step4A":
    case "step4B":
    case "step4C":
      return "step3";
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
    personaType: state.step3.personaType,
    athleteGoal:
      state.step3.personaType === PersonaType.IndependentAthlete
        ? state.step4A.athleteGoal
        : null,
    coachInviteCode:
      state.step3.personaType === PersonaType.TraineeWithCoach
        ? state.step4B.coachInviteCode
        : null,
    coachVerificationToken:
      state.step3.personaType === PersonaType.ProfessionalCoach
        ? state.step4C.coachVerificationToken
        : null,
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

  // ─── Step 3 → fork routing ──────────────────────────────────────────────────

  function handlePersonaNext(persona: PersonaType) {
    setState((prev) => ({
      ...prev,
      step3: { ...prev.step3, personaType: persona },
    }));
    const target: WizardStep =
      persona === PersonaType.IndependentAthlete
        ? "step4A"
        : persona === PersonaType.TraineeWithCoach
        ? "step4B"
        : "step4C";
    navigateTo(target, "forward");
  }

  // ─── Final submission ───────────────────────────────────────────────────────

  async function handleFinalSubmit() {
    setIsSubmitting(true);
    // Simulate async Supabase call — replace with real supabase.auth.signUp() call.
    // The payload below is the full OnboardingPayload ready for Supabase insertion.
    await new Promise<void>((resolve) => setTimeout(resolve, 1400));
    void buildPayload(state);
    // To integrate: const payload = buildPayload(state);
    // await supabase.auth.signUp({ email: payload.contact, password: payload.password })
    setIsSubmitting(false);
    navigateTo("success", "forward");
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
              <img src="/logo.jpg" alt="VigorHub Logo" className="w-6 h-6 object-contain" />
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
        {!isSuccess && (
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
        {!isSuccess && (
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
          <div key={slideKey} className={enterClass}>
            {state.currentStep === "step1" && (
              <Step1Credentials
                data={state.step1}
                onChange={(data) =>
                  setState((prev) => ({ ...prev, step1: data }))
                }
                onNext={() => handleNext("step2")}
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
                onNext={() => handleNext("step3")}
                onBack={handleBack}
                theme={state.theme}
                isRtl={isRtl}
                t={translations}
              />
            )}

            {state.currentStep === "step3" && (
              <Step3Persona
                data={state.step3}
                onChange={(data) =>
                  setState((prev) => ({ ...prev, step3: data }))
                }
                onNext={handlePersonaNext}
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

            {state.currentStep === "step4B" && (
              <Step4BCoachInvite
                data={state.step4B}
                onChange={(data) =>
                  setState((prev) => ({ ...prev, step4B: data }))
                }
                onSubmit={handleFinalSubmit}
                onBack={handleBack}
                theme={state.theme}
                isRtl={isRtl}
                t={translations}
                isLoading={isSubmitting}
              />
            )}

            {state.currentStep === "step4C" && (
              <Step4CCoachVerify
                data={state.step4C}
                onChange={(data) =>
                  setState((prev) => ({ ...prev, step4C: data }))
                }
                onSubmit={handleFinalSubmit}
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
