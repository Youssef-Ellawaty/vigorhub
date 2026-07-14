// ─────────────────────────────────────────────────────────────────────────────
// VigorHub Onboarding — TypeScript Interfaces & Enums
// Primed for Supabase Auth / profiles table integration.
// ─────────────────────────────────────────────────────────────────────────────

export type Language = "en" | "ar";
export type Theme = "dark" | "light";

// ─── Step routing ─────────────────────────────────────────────────────────────

export type WizardStep =
  | "step1"
  | "step2"
  | "step3"
  | "step4A"
  | "step4B"
  | "step4C"
  | "step5Payment"
  | "success";

export type SlideDirection = "forward" | "backward";

// ─── Domain Enums ─────────────────────────────────────────────────────────────

export enum Gender {
  Male = "male",
  Female = "female",
}

export enum PersonaType {
  IndependentAthlete = "independent_athlete",
  TraineeWithCoach = "trainee_with_coach",
  ProfessionalCoach = "professional_coach",
}

export enum AthleteGoal {
  FatLoss = "fat_loss",
  MuscleGain = "muscle_gain",
  BodyRecomposition = "body_recomposition",
}

// ─── Sub-Step Payload Interfaces ──────────────────────────────────────────────

export interface Step1Payload {
  fullName: string;
  username: string;
  contact: string; // email OR phone number
  password: string;
  confirmPassword: string;
}

export interface Step2Payload {
  gender: Gender | null;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
}

export interface Step3Payload {
  personaType: PersonaType | null;
}

export interface Step4APayload {
  athleteGoal: AthleteGoal | null;
}

export interface Step4BPayload {
  coachInviteCode: string;
}

export interface Step4CPayload {
  coachVerificationToken: string;
}

// ─── Master Onboarding Payload ────────────────────────────────────────────────
// This interface represents the full shape of data collected across all wizard
// steps and is the contract sent to Supabase on final submission.

export interface OnboardingPayload {
  // Step 1 — Account Credentials
  fullName: string;
  username: string;          // lowercase, no spaces, unique community handle
  contact: string;           // email or E.164 phone
  password: string;          // raw — hashed server-side via Supabase Auth

  // Step 2 — Physical Biometrics
  gender: Gender | null;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;

  // Step 3 — Persona Classification
  personaType: PersonaType | null;

  // Step 4A — Athlete Goals (only if personaType === IndependentAthlete)
  athleteGoal: AthleteGoal | null;

  // Step 4B — Coach Connection (only if personaType === TraineeWithCoach)
  coachInviteCode: string | null;

  // Step 4C — Coach Verification (only if personaType === ProfessionalCoach)
  coachVerificationToken: string | null;

  // Meta — populated at submission time
  meta: {
    registeredAt: string;        // ISO 8601 timestamp
    language: Language;          // preferred UI language at sign-up
    onboardingVersion: string;   // wizard version for future migrations, e.g. "1.0"
    // supabase_user_id is injected after auth.signUp() resolves
    supabaseUserId?: string;
  };
}

// ─── Payment / Subscription (add near the other enums) ───────────────────────

export enum PlanTier {
  Basic = "basic",
  Pro = "pro",
  Ultimate = "ultimate",
}

export enum PaymentMethod {
  VodafoneCash = "vodafone_cash",
  PayPal = "paypal",
}

export interface PlanOption {
  tier: PlanTier;
  priceEGP: number;
}

export interface Step5Payload {
  selectedPlan: PlanTier | null;
  billingCycle: "month" | "3months" | "year";
  paymentMethod: PaymentMethod | null;
  vodafoneSenderNumber: string;
  vodafoneWhatsApp: string;
  vodafoneAmount: string;
  vodafoneScreenshot: string; // Base64 image data or file name
}

// ─── Wizard State (internal React state shape) ────────────────────────────────

export interface WizardState {
  step5: Step5Payload;
  currentStep: WizardStep;
  slideDirection: SlideDirection;
  language: Language;
  theme: Theme;
  step1: Step1Payload;
  step2: Step2Payload;
  step3: Step3Payload;
  step4A: Step4APayload;
  step4B: Step4BPayload;
  step4C: Step4CPayload;
}

// ─── Field Validation Helpers ────────────────────────────────────────────────

export interface FieldError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: FieldError[];
}

// ─── Step Metadata ────────────────────────────────────────────────────────────

export interface StepMeta {
  id: WizardStep;
  stepNumber: number;   // display index (1–4)
  totalSteps: number;
}
