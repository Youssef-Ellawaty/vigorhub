"use client";

import { useState } from "react";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { AppShell } from "@/components/shell/AppShell";
import { PersonaType } from "@/components/onboarding/types";

// The role that is allowed into the main dashboard
const ALLOWED_ROLE = PersonaType.IndependentAthlete;

type AppState =
  | { view: "auth" }
  | { view: "role-denied"; role: PersonaType | null }
  | { view: "dashboard"; role: PersonaType };

export default function Page() {
  const [appState, setAppState] = useState<AppState>({ view: "auth" });

  function handleOnboardingComplete(personaType: PersonaType | null) {
    if (personaType === ALLOWED_ROLE) {
      setAppState({ view: "dashboard", role: personaType });
    } else {
      setAppState({ view: "role-denied", role: personaType });
    }
  }

  // ── Auth / Onboarding view ──────────────────────────────────────────────────
  if (appState.view === "auth") {
    return (
      <OnboardingWizard onComplete={handleOnboardingComplete} />
    );
  }

  // ── Role denied view ────────────────────────────────────────────────────────
  if (appState.view === "role-denied") {
    const roleLabel =
      appState.role === PersonaType.TraineeWithCoach
        ? "Trainee (Coach-assigned)"
        : appState.role === PersonaType.ProfessionalCoach
        ? "Professional Coach"
        : "Unknown";

    return (
      <main className="min-h-screen bg-[#0B0F19] flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-3xl border border-slate-700/40 bg-slate-900/70 backdrop-blur-xl p-10 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/30">
            <svg
              className="h-7 w-7 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-50 mb-2">Access Restricted</h1>
          <p className="text-sm text-slate-400 leading-relaxed mb-1">
            The dashboard is currently available for{" "}
            <span className="text-emerald-400 font-semibold">Independent Athletes</span> only.
          </p>
          <p className="text-xs text-slate-500 mb-8">
            Your role: <span className="text-slate-300 font-mono">{roleLabel}</span>
          </p>
          <button
            onClick={() => setAppState({ view: "auth" })}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-400 transition-all"
          >
            Back to Sign-Up
          </button>
        </div>
      </main>
    );
  }

  // ── Authorized dashboard ────────────────────────────────────────────────────
  return <AppShell />;
}
