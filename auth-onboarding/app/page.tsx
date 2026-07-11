import { OnboardingWizard } from "@/auth-onboarding/components/onboarding/OnboardingWizard";

// No event handlers are passed as props here — the wizard manages its own
// submission internally. In a real app, wire Supabase inside the wizard's
// handleFinalSubmit() function directly.
export default function Page() {
  return (
    <main className="min-h-screen bg-[#0B0F19]">
      <OnboardingWizard />
    </main>
  );
}
