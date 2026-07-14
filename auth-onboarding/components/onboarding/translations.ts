// ─────────────────────────────────────────────────────────────────────────────
// VigorHub Onboarding — Full Bilingual Translation Dictionary (EN / AR)
// Egyptian/Arabic fitness terminology throughout.
// ─────────────────────────────────────────────────────────────────────────────

import type { Language } from "./types";

export interface TranslationDict {
  // ── Brand ───────────────────────────────────────────────────────────────────
  brandName: string;
  brandTagline: string;

  // ── Global UI ───────────────────────────────────────────────────────────────
  toggleLanguage: string;
  toggleThemeDark: string;
  toggleThemeLight: string;
  next: string;
  back: string;
  submit: string;
  or: string;
  required: string;
  optional: string;
  stepOf: (current: number, total: number) => string;

  // ── Step Labels (progress indicator) ────────────────────────────────────────
  stepLabels: [string, string, string, string];

  // ── Step 1 — Account Credentials ────────────────────────────────────────────
  step1Title: string;
  step1Subtitle: string;
  labelFullName: string;
  placeholderFullName: string;
  labelUsername: string;
  placeholderUsername: string;
  usernameHint: string;
  usernameError: string;
  labelContact: string;
  placeholderContact: string;
  labelPassword: string;
  placeholderPassword: string;
  labelConfirmPassword: string;
  placeholderConfirmPassword: string;
  passwordMismatchError: string;
  passwordTooShortError: string;
  fieldRequiredError: string;

  // ── Step 2 — Physical Biometrics ────────────────────────────────────────────
  step2Title: string;
  step2Subtitle: string;
  labelGender: string;
  genderMale: string;
  genderFemale: string;
  labelAge: string;
  placeholderAge: string;
  labelHeight: string;
  placeholderHeight: string;
  labelWeight: string;
  placeholderWeight: string;
  ageRangeError: string;
  heightRangeError: string;
  weightRangeError: string;
  selectGenderError: string;

  // ── Step 3 — Persona Classification ─────────────────────────────────────────
  step3Title: string;
  step3Subtitle: string;
  personaAthleteTitle: string;
  personaAthleteDesc: string;
  personaTraineeTitle: string;
  personaTraineeDesc: string;
  personaCoachTitle: string;
  personaCoachDesc: string;
  selectPersonaError: string;

  // ── Step 4A — Athlete Goal ───────────────────────────────────────────────────
  step4ATitle: string;
  step4ASubtitle: string;
  goalFatLossTitle: string;
  goalFatLossDesc: string;
  goalMuscleGainTitle: string;
  goalMuscleGainDesc: string;
  goalRecompTitle: string;
  goalRecompDesc: string;
  selectGoalError: string;

  // ── Step 4B — Coach Connection ───────────────────────────────────────────────
  step4BTitle: string;
  step4BSubtitle: string;
  labelInviteCode: string;
  placeholderInviteCode: string;
  inviteCodeHint: string;
  inviteCodeInvalidError: string;
  inviteCodeRequiredError: string;

  // ── Step 4C — Coach Verification ────────────────────────────────────────────
  step4CTitle: string;
  step4CSubtitle: string;
  labelCoachToken: string;
  placeholderCoachToken: string;
  coachTokenHint: string;
  coachTokenInvalidError: string;
  coachTokenRequiredError: string;

  // ── Step 5 — Payment / Subscription ─────────────────────────────────────────
  step5Title: string;
  step5Subtitle: string;
  planBasicTitle: string;
  planBasicDesc: string;
  planProTitle: string;
  planProDesc: string;
  planUltimateTitle: string;
  planUltimateDesc: string;
  perMonth: string;
  mostPopularBadge: string;
  paymentMethodLabel: string;
  vodafoneCashLabel: string;
  paypalLabel: string;
  vodafoneNumberLabel: string;
  vodafoneNumberPlaceholder: string;
  vodafoneNumberError: string;
  selectPlanError: string;
  selectPaymentMethodError: string;
  confirmAndPay: string;
  payingWith: string;

  // ── Success Screen ────────────────────────────────────────────────────────────
  successTitle: string;
  successSubtitle: string;
  successCta: string;
  successNote: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// ENGLISH DICTIONARY
// ─────────────────────────────────────────────────────────────────────────────

const en: TranslationDict = {
  brandName: "VigorHub",
  brandTagline: "Train Harder. Track Smarter.",

  toggleLanguage: "عربي",
  toggleThemeDark: "Dark",
  toggleThemeLight: "Light",
  next: "Next",
  back: "Back",
  submit: "Complete Registration",
  or: "or",
  required: "Required",
  optional: "Optional",
  stepOf: (current, total) => `Step ${current} of ${total}`,

  stepLabels: ["Account", "Biometrics", "Persona", "Finish"],

  step1Title: "Create Your Account",
  step1Subtitle: "Set up your VigorHub identity to get started.",
  labelFullName: "Full Name",
  placeholderFullName: "e.g. Ahmed El-Sayed",
  labelUsername: "Username",
  placeholderUsername: "@username",
  usernameHint: "Lowercase only, no spaces. This is your Community Feed handle.",
  usernameError: "Username must be lowercase, with no spaces or special characters (underscores allowed).",
  labelContact: "Email or Phone Number",
  placeholderContact: "email@example.com or +20XXXXXXXXXX",
  labelPassword: "Password",
  placeholderPassword: "At least 8 characters",
  labelConfirmPassword: "Confirm Password",
  placeholderConfirmPassword: "Re-enter your password",
  passwordMismatchError: "Passwords do not match.",
  passwordTooShortError: "Password must be at least 8 characters.",
  fieldRequiredError: "This field is required.",

  step2Title: "Physical Profile",
  step2Subtitle: "Help us personalise your experience with your biometric data.",
  labelGender: "Gender",
  genderMale: "Male",
  genderFemale: "Female",
  labelAge: "Age",
  placeholderAge: "e.g. 24",
  labelHeight: "Height (cm)",
  placeholderHeight: "e.g. 178",
  labelWeight: "Weight (kg)",
  placeholderWeight: "e.g. 82",
  ageRangeError: "Please enter a valid age between 13 and 100.",
  heightRangeError: "Please enter a valid height between 100 and 250 cm.",
  weightRangeError: "Please enter a valid weight between 30 and 300 kg.",
  selectGenderError: "Please select your gender.",

  step3Title: "How Will You Use VigorHub?",
  step3Subtitle: "Choose the path that best describes you — this shapes your entire experience.",
  personaAthleteTitle: "Independent Athlete",
  personaAthleteDesc: "Train on your own terms. Log workouts, track progress, and hit your personal goals with full autonomy.",
  personaTraineeTitle: "Trainee with a Coach",
  personaTraineeDesc: "Already working with a coach? Connect using their invite code and sync your training plan seamlessly.",
  personaCoachTitle: "Professional Coach",
  personaCoachDesc: "Manage clients, create programs, and grow your coaching business — all in one platform.",
  selectPersonaError: "Please select your account type to continue.",

  step4ATitle: "What Is Your Primary Goal?",
  step4ASubtitle: "Select the athletic objective that drives your training.",
  goalFatLossTitle: "Fat Loss",
  goalFatLossDesc: "Torch calories, sharpen definition, and reveal the athlete underneath.",
  goalMuscleGainTitle: "Muscle Gain",
  goalMuscleGainDesc: "Build raw strength and pack on lean mass with progressive overload.",
  goalRecompTitle: "Body Recomposition",
  goalRecompDesc: "Simultaneously build muscle and shed fat — the advanced approach.",
  selectGoalError: "Please select your primary training goal.",

  step4BTitle: "Enter Your Coach Invite Code",
  step4BSubtitle: "Your coach will provide a unique alphanumeric code to connect you to their roster.",
  labelInviteCode: "Coach Invite Code",
  placeholderInviteCode: "e.g. VIGOR-XXXXX",
  inviteCodeHint: "Codes are case-insensitive, 5–10 alphanumeric characters.",
  inviteCodeInvalidError: "Invalid code format. Codes contain only letters and numbers (5–10 characters).",
  inviteCodeRequiredError: "Please enter the invite code provided by your coach.",

  step4CTitle: "Coach Verification",
  step4CSubtitle: "Enter the pre-generated system token to verify your professional coaching profile.",
  labelCoachToken: "Coach Verification Token",
  placeholderCoachToken: "e.g. VH-COACH-XXXXXXXX",
  coachTokenHint: "Tokens are issued by VigorHub administration and are unique to each verified coach.",
  coachTokenInvalidError: "Invalid token format. Please use the exact token issued to you by VigorHub.",
  coachTokenRequiredError: "Please enter your coach verification token.",

  step5Title: "Choose Your Plan",
  step5Subtitle: "Pick a subscription that fits your goals, then confirm your payment.",
  planBasicTitle: "Basic",
  planBasicDesc: "Workout tracking and meal logging.",
  planProTitle: "Pro",
  planProDesc: "Everything in Basic, plus AI coach (limited questions), progress analytics, and community access.",
  planUltimateTitle: "Ultimate",
  planUltimateDesc: "Everything in Pro, plus unlimited AI coach, full community access, and more workout splits.",
  perMonth: "/ month",
  mostPopularBadge: "Most Popular",
  paymentMethodLabel: "Payment Method",
  vodafoneCashLabel: "Vodafone Cash",
  paypalLabel: "PayPal",
  vodafoneNumberLabel: "Vodafone Cash Number",
  vodafoneNumberPlaceholder: "01XXXXXXXXX",
  vodafoneNumberError: "Enter a valid Egyptian mobile number.",
  selectPlanError: "Please select a subscription plan.",
  selectPaymentMethodError: "Please select a payment method.",
  confirmAndPay: "Confirm & Pay",
  payingWith: "Paying with",

  successTitle: "Welcome to VigorHub!",
  successSubtitle: "Your account has been created successfully. You are now part of the VigorHub community.",
  successCta: "Enter the Platform",
  successNote: "A verification link has been sent to your contact. Please confirm your account to unlock all features.",
};

// ─────────────────────────────────────────────────────────────────────────────
// ARABIC DICTIONARY — Egyptian / Levantine Fitness Terminology
// ─────────────────────────────────────────────────────────────────────────────

const ar: TranslationDict = {
  brandName: "فيغورهاب",
  brandTagline: "تدرّب بقوة. تتبّع بذكاء.",

  toggleLanguage: "EN",
  toggleThemeDark: "داكن",
  toggleThemeLight: "فاتح",
  next: "التالي",
  back: "رجوع",
  submit: "إتمام التسجيل",
  or: "أو",
  required: "مطلوب",
  optional: "اختياري",
  stepOf: (current, total) => `الخطوة ${current} من ${total}`,

  stepLabels: ["الحساب", "البيانات الجسدية", "نوع الحساب", "الإنهاء"],

  step1Title: "أنشئ حسابك",
  step1Subtitle: "سجّل هويتك على فيغورهاب للبدء في رحلتك التدريبية.",
  labelFullName: "الاسم الكامل",
  placeholderFullName: "مثال: أحمد السيد",
  labelUsername: "اسم المستخدم",
  placeholderUsername: "@اسم_المستخدم",
  usernameHint: "حروف صغيرة فقط بدون مسافات. هذا هو معرّفك في تغذية المجتمع.",
  usernameError: "اسم المستخدم يجب أن يكون بحروف صغيرة بدون مسافات أو رموز خاصة (الشرطة السفلية مسموحة).",
  labelContact: "البريد الإلكتروني أو رقم الهاتف",
  placeholderContact: "email@example.com أو +20XXXXXXXXXX",
  labelPassword: "كلمة المرور",
  placeholderPassword: "8 أحرف على الأقل",
  labelConfirmPassword: "تأكيد كلمة المرور",
  placeholderConfirmPassword: "أعد إدخال كلمة المرور",
  passwordMismatchError: "كلمتا المرور غير متطابقتين.",
  passwordTooShortError: "كلمة المرور يجب أن تكون 8 أحرف على الأقل.",
  fieldRequiredError: "هذا الحقل مطلوب.",

  step2Title: "ملفك الجسدي",
  step2Subtitle: "ساعدنا في تخصيص تجربتك بإدخال بياناتك الحيوية.",
  labelGender: "الجنس",
  genderMale: "ذكر",
  genderFemale: "أنثى",
  labelAge: "العمر",
  placeholderAge: "مثال: 24",
  labelHeight: "الطول (سم)",
  placeholderHeight: "مثال: 178",
  labelWeight: "الوزن (كجم)",
  placeholderWeight: "مثال: 82",
  ageRangeError: "يرجى إدخال عمر صحيح بين 13 و100 سنة.",
  heightRangeError: "يرجى إدخال طول صحيح بين 100 و250 سم.",
  weightRangeError: "يرجى إدخال وزن صحيح بين 30 و300 كجم.",
  selectGenderError: "يرجى اختيار جنسك.",

  step3Title: "كيف ستستخدم فيغورهاب؟",
  step3Subtitle: "اختر المسار الأنسب لك — هذا سيشكّل تجربتك بالكامل.",
  personaAthleteTitle: "لاعب حر",
  personaAthleteDesc: "تدرّب على مزاجك. سجّل التمارين، تابع تقدمك، واحقق أهدافك الشخصية باستقلالية تامة.",
  personaTraineeTitle: "لاعب مع مدرب",
  personaTraineeDesc: "تتدرب مع مدرب بالفعل؟ تواصل معه باستخدام كود الدعوة الخاص به وزامن خطة تدريبك بسلاسة.",
  personaCoachTitle: "مدرب محترف",
  personaCoachDesc: "أدر عملاءك، أنشئ البرامج التدريبية، وطوّر أعمالك التدريبية — كل ذلك في منصة واحدة.",
  selectPersonaError: "يرجى اختيار نوع حسابك للمتابعة.",

  step4ATitle: "ما هو هدفك الرئيسي؟",
  step4ASubtitle: "اختر الهدف الرياضي الذي يحرّك تدريبك.",
  goalFatLossTitle: "تقليل الدهون",
  goalFatLossDesc: "أحرق السعرات، حدّد العضلات، وأظهر الرياضي الذي بداخلك.",
  goalMuscleGainTitle: "زيادة العضلات",
  goalMuscleGainDesc: "ابنِ قوة حقيقية وأضف كتلة عضلية نقية من خلال التحميل التصاعدي.",
  goalRecompTitle: "توازن وثبات الجسم",
  goalRecompDesc: "ابنِ العضلات وأحرق الدهون في نفس الوقت — الأسلوب المتقدم.",
  selectGoalError: "يرجى اختيار هدفك التدريبي الرئيسي.",

  step4BTitle: "أدخل كود دعوة مدربك",
  step4BSubtitle: "سيزودك مدربك بكود رقمي فريد لربطك بقائمته التدريبية.",
  labelInviteCode: "كود دعوة المدرب",
  placeholderInviteCode: "مثال: VIGOR-XXXXX",
  inviteCodeHint: "الأكواد غير حساسة لحالة الأحرف، من 5 إلى 10 أحرف وأرقام.",
  inviteCodeInvalidError: "صيغة الكود غير صحيحة. يجب أن يحتوي الكود على حروف وأرقام فقط (5–10 أحرف).",
  inviteCodeRequiredError: "يرجى إدخال كود الدعوة الذي أرسله إليك مدربك.",

  step4CTitle: "التحقق من هوية المدرب",
  step4CSubtitle: "أدخل رمز النظام المُولَّد مسبقاً للتحقق من ملفك المهني كمدرب.",
  labelCoachToken: "رمز تحقق المدرب",
  placeholderCoachToken: "مثال: VH-COACH-XXXXXXXX",
  coachTokenHint: "تُصدر الرموز من إدارة فيغورهاب وهي فريدة لكل مدرب معتمد.",
  coachTokenInvalidError: "صيغة الرمز غير صحيحة. يرجى استخدام الرمز الذي أصدرته لك فيغورهاب.",
  coachTokenRequiredError: "يرجى إدخال رمز تحقق المدرب الخاص بك.",

  step5Title: "اختر باقتك",
  step5Subtitle: "اختار الباقة المناسبة لهدفك، وبعدين أكّد طريقة الدفع.",
  planBasicTitle: "الأساسية",
  planBasicDesc: "متابعة التمارين وتسجيل الوجبات فقط.",
  planProTitle: "برو",
  planProDesc: "كل مميزات الأساسية، بالإضافة إلى مساعد الذكاء الاصطناعي (عدد أسئلة محدود)، تحليل الإحصائيات، والدخول إلى المجتمع.",
  planUltimateTitle: "الألتيميت",
  planUltimateDesc: "كل مميزات برو، بالإضافة إلى ذكاء اصطناعي غير محدود، دخول كامل للمجتمع، وعدد أكبر من أنظمة التمارين.",
  perMonth: "/ شهريًا",
  mostPopularBadge: "الأكثر طلبًا",
  paymentMethodLabel: "طريقة الدفع",
  vodafoneCashLabel: "فودافون كاش",
  paypalLabel: "باي بال",
  vodafoneNumberLabel: "رقم فودافون كاش",
  vodafoneNumberPlaceholder: "01XXXXXXXXX",
  vodafoneNumberError: "أدخل رقم موبايل مصري صحيح.",
  selectPlanError: "يرجى اختيار باقة الاشتراك.",
  selectPaymentMethodError: "يرجى اختيار طريقة الدفع.",
  confirmAndPay: "تأكيد الدفع",
  payingWith: "الدفع عن طريق",

  successTitle: "أهلاً بك في فيغورهاب!",
  successSubtitle: "تم إنشاء حسابك بنجاح. أنت الآن جزء من مجتمع فيغورهاب.",
  successCta: "ادخل المنصة",
  successNote: "تم إرسال رابط التحقق إلى بريدك أو هاتفك. يرجى تأكيد حسابك لفتح جميع المميزات.",
};

// ─────────────────────────────────────────────────────────────────────────────
// Export helper
// ─────────────────────────────────────────────────────────────────────────────

export const translations: Record<Language, TranslationDict> = { en, ar };

export function t(lang: Language): TranslationDict {
  return translations[lang];
}
