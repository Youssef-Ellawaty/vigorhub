import { Exercise, MuscleGroupEnum, WorkoutSplit } from "./types";

// ============================================================
// All exercises — indexed by ID
// ============================================================
export const EXERCISES: Exercise[] = [
  // CHEST
  { id: "bench-press", name: { en: "Bench Press", ar: "بنش بريس" }, primaryMuscle: MuscleGroupEnum.CHEST, secondaryMuscles: [MuscleGroupEnum.TRICEPS, MuscleGroupEnum.SHOULDERS], defaultSets: 4, defaultReps: "8-10" },
  { id: "incline-press", name: { en: "Incline Dumbbell Press", ar: "بنش مائل" }, primaryMuscle: MuscleGroupEnum.CHEST, secondaryMuscles: [MuscleGroupEnum.TRICEPS, MuscleGroupEnum.SHOULDERS], defaultSets: 3, defaultReps: "10-12" },
  { id: "cable-fly", name: { en: "Cable Fly", ar: "فتحة كيبل" }, primaryMuscle: MuscleGroupEnum.CHEST, secondaryMuscles: [MuscleGroupEnum.SHOULDERS], defaultSets: 3, defaultReps: "12-15" },
  { id: "chest-dip", name: { en: "Chest Dip", ar: "دبز صدر" }, primaryMuscle: MuscleGroupEnum.CHEST, secondaryMuscles: [MuscleGroupEnum.TRICEPS], defaultSets: 3, defaultReps: "10-12" },
  { id: "pushup", name: { en: "Push-Up", ar: "ضغط أرضي" }, primaryMuscle: MuscleGroupEnum.CHEST, secondaryMuscles: [MuscleGroupEnum.TRICEPS, MuscleGroupEnum.SHOULDERS], defaultSets: 3, defaultReps: "15-20" },

  // LATS / BACK
  { id: "pullup", name: { en: "Pull-Up", ar: "عقلة" }, primaryMuscle: MuscleGroupEnum.LATS, secondaryMuscles: [MuscleGroupEnum.BICEPS, MuscleGroupEnum.TRAPS], defaultSets: 4, defaultReps: "6-10" },
  { id: "lat-pulldown", name: { en: "Lat Pulldown", ar: "سحب علوي" }, primaryMuscle: MuscleGroupEnum.LATS, secondaryMuscles: [MuscleGroupEnum.BICEPS], defaultSets: 4, defaultReps: "10-12" },
  { id: "seated-row", name: { en: "Seated Cable Row", ar: "سحب جلوس" }, primaryMuscle: MuscleGroupEnum.LATS, secondaryMuscles: [MuscleGroupEnum.BICEPS, MuscleGroupEnum.LOWER_BACK], defaultSets: 3, defaultReps: "10-12" },
  { id: "bent-row", name: { en: "Barbell Bent Over Row", ar: "سحب بنت" }, primaryMuscle: MuscleGroupEnum.LATS, secondaryMuscles: [MuscleGroupEnum.BICEPS, MuscleGroupEnum.TRAPS, MuscleGroupEnum.LOWER_BACK], defaultSets: 4, defaultReps: "8-10" },
  { id: "db-row", name: { en: "Dumbbell Row", ar: "سحب دمبل" }, primaryMuscle: MuscleGroupEnum.LATS, secondaryMuscles: [MuscleGroupEnum.BICEPS], defaultSets: 3, defaultReps: "10-12" },

  // SHOULDERS
  { id: "ohp", name: { en: "Overhead Press", ar: "ضغط علوي" }, primaryMuscle: MuscleGroupEnum.SHOULDERS, secondaryMuscles: [MuscleGroupEnum.TRICEPS, MuscleGroupEnum.TRAPS], defaultSets: 4, defaultReps: "8-10" },
  { id: "lateral-raise", name: { en: "Lateral Raise", ar: "رفع جانبي" }, primaryMuscle: MuscleGroupEnum.SHOULDERS, secondaryMuscles: [], defaultSets: 4, defaultReps: "12-15" },
  { id: "front-raise", name: { en: "Front Raise", ar: "رفع أمامي" }, primaryMuscle: MuscleGroupEnum.SHOULDERS, secondaryMuscles: [MuscleGroupEnum.CHEST], defaultSets: 3, defaultReps: "12-15" },
  { id: "face-pull", name: { en: "Face Pull", ar: "سحب وجه" }, primaryMuscle: MuscleGroupEnum.SHOULDERS, secondaryMuscles: [MuscleGroupEnum.TRAPS], defaultSets: 3, defaultReps: "15-20" },

  // BICEPS
  { id: "barbell-curl", name: { en: "Barbell Curl", ar: "كيرل بار" }, primaryMuscle: MuscleGroupEnum.BICEPS, secondaryMuscles: [MuscleGroupEnum.FOREARMS], defaultSets: 4, defaultReps: "10-12" },
  { id: "hammer-curl", name: { en: "Hammer Curl", ar: "كيرل مطرقة" }, primaryMuscle: MuscleGroupEnum.BICEPS, secondaryMuscles: [MuscleGroupEnum.FOREARMS], defaultSets: 3, defaultReps: "12-15" },
  { id: "incline-curl", name: { en: "Incline Dumbbell Curl", ar: "كيرل مائل" }, primaryMuscle: MuscleGroupEnum.BICEPS, secondaryMuscles: [], defaultSets: 3, defaultReps: "10-12" },

  // TRICEPS
  { id: "tricep-pushdown", name: { en: "Tricep Pushdown", ar: "ضغط ترايسبس" }, primaryMuscle: MuscleGroupEnum.TRICEPS, secondaryMuscles: [], defaultSets: 4, defaultReps: "12-15" },
  { id: "skullcrusher", name: { en: "Skull Crusher", ar: "سكل كراشر" }, primaryMuscle: MuscleGroupEnum.TRICEPS, secondaryMuscles: [], defaultSets: 3, defaultReps: "10-12" },
  { id: "overhead-extension", name: { en: "Overhead Tricep Extension", ar: "مد ترايسبس علوي" }, primaryMuscle: MuscleGroupEnum.TRICEPS, secondaryMuscles: [], defaultSets: 3, defaultReps: "12-15" },

  // QUADS
  { id: "squat", name: { en: "Barbell Squat", ar: "سكوات" }, primaryMuscle: MuscleGroupEnum.QUADS, secondaryMuscles: [MuscleGroupEnum.GLUTES, MuscleGroupEnum.HAMSTRINGS, MuscleGroupEnum.CORE], defaultSets: 4, defaultReps: "6-8" },
  { id: "leg-press", name: { en: "Leg Press", ar: "ليق بريس" }, primaryMuscle: MuscleGroupEnum.QUADS, secondaryMuscles: [MuscleGroupEnum.GLUTES, MuscleGroupEnum.HAMSTRINGS], defaultSets: 4, defaultReps: "10-12" },
  { id: "leg-extension", name: { en: "Leg Extension", ar: "بسط رجل" }, primaryMuscle: MuscleGroupEnum.QUADS, secondaryMuscles: [], defaultSets: 3, defaultReps: "12-15" },
  { id: "hack-squat", name: { en: "Hack Squat", ar: "هاك سكوات" }, primaryMuscle: MuscleGroupEnum.QUADS, secondaryMuscles: [MuscleGroupEnum.GLUTES], defaultSets: 3, defaultReps: "10-12" },

  // HAMSTRINGS
  { id: "rdl", name: { en: "Romanian Deadlift", ar: "رومانيان ديدليفت" }, primaryMuscle: MuscleGroupEnum.HAMSTRINGS, secondaryMuscles: [MuscleGroupEnum.GLUTES, MuscleGroupEnum.LOWER_BACK], defaultSets: 4, defaultReps: "8-10" },
  { id: "leg-curl", name: { en: "Lying Leg Curl", ar: "ثني رجل" }, primaryMuscle: MuscleGroupEnum.HAMSTRINGS, secondaryMuscles: [], defaultSets: 3, defaultReps: "10-12" },
  { id: "seated-leg-curl", name: { en: "Seated Leg Curl", ar: "ثني رجل جلوس" }, primaryMuscle: MuscleGroupEnum.HAMSTRINGS, secondaryMuscles: [], defaultSets: 3, defaultReps: "12-15" },

  // GLUTES
  { id: "hip-thrust", name: { en: "Hip Thrust", ar: "هيب ثراست" }, primaryMuscle: MuscleGroupEnum.GLUTES, secondaryMuscles: [MuscleGroupEnum.HAMSTRINGS], defaultSets: 4, defaultReps: "10-12" },
  { id: "sumo-squat", name: { en: "Sumo Squat", ar: "سومو سكوات" }, primaryMuscle: MuscleGroupEnum.GLUTES, secondaryMuscles: [MuscleGroupEnum.QUADS, MuscleGroupEnum.HAMSTRINGS], defaultSets: 3, defaultReps: "12-15" },

  // CALVES
  { id: "standing-calf", name: { en: "Standing Calf Raise", ar: "رفع أصابع واقف" }, primaryMuscle: MuscleGroupEnum.CALVES, secondaryMuscles: [], defaultSets: 4, defaultReps: "15-20" },
  { id: "seated-calf", name: { en: "Seated Calf Raise", ar: "رفع أصابع جلوس" }, primaryMuscle: MuscleGroupEnum.CALVES, secondaryMuscles: [], defaultSets: 3, defaultReps: "15-20" },

  // CORE
  { id: "plank", name: { en: "Plank", ar: "بلانك" }, primaryMuscle: MuscleGroupEnum.CORE, secondaryMuscles: [MuscleGroupEnum.LOWER_BACK], defaultSets: 3, defaultReps: "60s" },
  { id: "cable-crunch", name: { en: "Cable Crunch", ar: "عضلة بطن كيبل" }, primaryMuscle: MuscleGroupEnum.CORE, secondaryMuscles: [], defaultSets: 3, defaultReps: "15-20" },
  { id: "hanging-leg-raise", name: { en: "Hanging Leg Raise", ar: "رفع رجلين معلق" }, primaryMuscle: MuscleGroupEnum.CORE, secondaryMuscles: [], defaultSets: 3, defaultReps: "12-15" },

  // TRAPS
  { id: "shrug", name: { en: "Barbell Shrug", ar: "شراق" }, primaryMuscle: MuscleGroupEnum.TRAPS, secondaryMuscles: [], defaultSets: 4, defaultReps: "12-15" },

  // LOWER BACK
  { id: "deadlift", name: { en: "Deadlift", ar: "ديدليفت" }, primaryMuscle: MuscleGroupEnum.LOWER_BACK, secondaryMuscles: [MuscleGroupEnum.HAMSTRINGS, MuscleGroupEnum.GLUTES, MuscleGroupEnum.TRAPS], defaultSets: 4, defaultReps: "5-6" },
  { id: "hyperextension", name: { en: "Hyperextension", ar: "هايبر إكستنشن" }, primaryMuscle: MuscleGroupEnum.LOWER_BACK, secondaryMuscles: [MuscleGroupEnum.GLUTES], defaultSets: 3, defaultReps: "12-15" },
];

export const getExerciseById = (id: string) => EXERCISES.find((e) => e.id === id);
export const getExercisesByMuscle = (muscle: MuscleGroupEnum) =>
  EXERCISES.filter((e) => e.primaryMuscle === muscle);

// ============================================================
// Preset Workout Splits
// ============================================================
const e = (id: string) => getExerciseById(id)!;

export const WORKOUT_SPLITS: WorkoutSplit[] = [
  {
    id: "ppl",
    name: { en: "Push / Pull / Legs", ar: "دفع / سحب / أرجل" },
    daysPerWeek: 6,
    level: "intermediate",
    description: {
      en: "Classic 6-day split targeting each muscle group twice per week. Ideal for intermediate athletes seeking maximum volume.",
      ar: "نظام 6 أيام كلاسيكي يستهدف كل مجموعة عضلية مرتين أسبوعياً. مثالي للرياضيين المتوسطين الباحثين عن أقصى حجم.",
    },
    days: [
      { dayNumber: 1, label: { en: "Push A", ar: "دفع أ" }, exercises: [e("bench-press"), e("incline-press"), e("cable-fly"), e("ohp"), e("lateral-raise"), e("tricep-pushdown")] },
      { dayNumber: 2, label: { en: "Pull A", ar: "سحب أ" }, exercises: [e("pullup"), e("bent-row"), e("seated-row"), e("barbell-curl"), e("hammer-curl"), e("face-pull")] },
      { dayNumber: 3, label: { en: "Legs A", ar: "أرجل أ" }, exercises: [e("squat"), e("leg-press"), e("leg-extension"), e("rdl"), e("standing-calf")] },
      { dayNumber: 4, label: { en: "Push B", ar: "دفع ب" }, exercises: [e("incline-press"), e("chest-dip"), e("cable-fly"), e("lateral-raise"), e("front-raise"), e("skullcrusher")] },
      { dayNumber: 5, label: { en: "Pull B", ar: "سحب ب" }, exercises: [e("lat-pulldown"), e("db-row"), e("deadlift"), e("incline-curl"), e("shrug"), e("face-pull")] },
      { dayNumber: 6, label: { en: "Legs B", ar: "أرجل ب" }, exercises: [e("hack-squat"), e("leg-curl"), e("hip-thrust"), e("seated-calf"), e("hanging-leg-raise")] },
    ],
  },
  {
    id: "upper-lower",
    name: { en: "Upper / Lower", ar: "جسم علوي / سفلي" },
    daysPerWeek: 4,
    level: "beginner",
    description: {
      en: "4-day split alternating upper body and lower body sessions. Perfect for beginners building a strength foundation.",
      ar: "نظام 4 أيام يتناوب بين الجسم العلوي والسفلي. مثالي للمبتدئين لبناء قاعدة قوة.",
    },
    days: [
      { dayNumber: 1, label: { en: "Upper A", ar: "علوي أ" }, exercises: [e("bench-press"), e("bent-row"), e("ohp"), e("lat-pulldown"), e("barbell-curl"), e("tricep-pushdown")] },
      { dayNumber: 2, label: { en: "Lower A", ar: "سفلي أ" }, exercises: [e("squat"), e("rdl"), e("leg-press"), e("leg-curl"), e("standing-calf")] },
      { dayNumber: 3, label: { en: "Upper B", ar: "علوي ب" }, exercises: [e("incline-press"), e("db-row"), e("lateral-raise"), e("seated-row"), e("hammer-curl"), e("overhead-extension")] },
      { dayNumber: 4, label: { en: "Lower B", ar: "سفلي ب" }, exercises: [e("hack-squat"), e("hip-thrust"), e("leg-extension"), e("seated-leg-curl"), e("seated-calf"), e("plank")] },
    ],
  },
  {
    id: "full-body",
    name: { en: "Full Body", ar: "جسم كامل" },
    daysPerWeek: 3,
    level: "beginner",
    description: {
      en: "3-day full body workout hitting all major muscle groups each session. Best for beginners and those with limited schedule.",
      ar: "تمرين جسم كامل 3 أيام يستهدف جميع المجموعات العضلية الرئيسية في كل جلسة. الأفضل للمبتدئين.",
    },
    days: [
      { dayNumber: 1, label: { en: "Day 1", ar: "يوم 1" }, exercises: [e("squat"), e("bench-press"), e("bent-row"), e("ohp"), e("barbell-curl"), e("tricep-pushdown"), e("plank")] },
      { dayNumber: 2, label: { en: "Day 2", ar: "يوم 2" }, exercises: [e("deadlift"), e("incline-press"), e("pullup"), e("lateral-raise"), e("hammer-curl"), e("overhead-extension"), e("cable-crunch")] },
      { dayNumber: 3, label: { en: "Day 3", ar: "يوم 3" }, exercises: [e("leg-press"), e("cable-fly"), e("lat-pulldown"), e("face-pull"), e("incline-curl"), e("skullcrusher"), e("hanging-leg-raise")] },
    ],
  },
  {
    id: "arnold",
    name: { en: "Arnold Split", ar: "نظام أرنولد" },
    daysPerWeek: 6,
    level: "advanced",
    description: {
      en: "The legendary 6-day Arnold Schwarzenegger split. Advanced program combining chest+back and shoulders+arms on alternating days.",
      ar: "نظام أرنولد شوارزنيغر الأسطوري لـ 6 أيام. برنامج متقدم يجمع الصدر+الظهر والكتفين+الأذرع بالتناوب.",
    },
    days: [
      { dayNumber: 1, label: { en: "Chest & Back A", ar: "صدر وظهر أ" }, exercises: [e("bench-press"), e("pullup"), e("incline-press"), e("bent-row"), e("cable-fly"), e("seated-row")] },
      { dayNumber: 2, label: { en: "Shoulders & Arms A", ar: "كتف وأذرع أ" }, exercises: [e("ohp"), e("barbell-curl"), e("lateral-raise"), e("tricep-pushdown"), e("front-raise"), e("hammer-curl"), e("skullcrusher")] },
      { dayNumber: 3, label: { en: "Legs A", ar: "أرجل أ" }, exercises: [e("squat"), e("rdl"), e("leg-press"), e("leg-curl"), e("standing-calf"), e("plank")] },
      { dayNumber: 4, label: { en: "Chest & Back B", ar: "صدر وظهر ب" }, exercises: [e("chest-dip"), e("lat-pulldown"), e("cable-fly"), e("db-row"), e("pushup"), e("shrug")] },
      { dayNumber: 5, label: { en: "Shoulders & Arms B", ar: "كتف وأذرع ب" }, exercises: [e("lateral-raise"), e("incline-curl"), e("face-pull"), e("overhead-extension"), e("front-raise"), e("hammer-curl")] },
      { dayNumber: 6, label: { en: "Legs B", ar: "أرجل ب" }, exercises: [e("hack-squat"), e("hip-thrust"), e("leg-extension"), e("seated-leg-curl"), e("seated-calf"), e("hanging-leg-raise")] },
    ],
  },
];

export const DAYS_OF_WEEK = {
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  ar: ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
};

export const MUSCLE_LABELS: Record<MuscleGroupEnum, { en: string; ar: string }> = {
  [MuscleGroupEnum.CHEST]: { en: "Chest", ar: "صدر" },
  [MuscleGroupEnum.LATS]: { en: "Back / Lats", ar: "ظهر / عريضة" },
  [MuscleGroupEnum.SHOULDERS]: { en: "Shoulders", ar: "كتفين" },
  [MuscleGroupEnum.BICEPS]: { en: "Biceps", ar: "بايسبس" },
  [MuscleGroupEnum.TRICEPS]: { en: "Triceps", ar: "ترايسبس" },
  [MuscleGroupEnum.FOREARMS]: { en: "Forearms", ar: "ساعد" },
  [MuscleGroupEnum.QUADS]: { en: "Quads", ar: "رباعية فخذ" },
  [MuscleGroupEnum.HAMSTRINGS]: { en: "Hamstrings", ar: "ثنائية فخذ" },
  [MuscleGroupEnum.GLUTES]: { en: "Glutes", ar: "مؤخرة" },
  [MuscleGroupEnum.CALVES]: { en: "Calves", ar: "ربلة ساق" },
  [MuscleGroupEnum.CORE]: { en: "Core / Abs", ar: "بطن / كور" },
  [MuscleGroupEnum.TRAPS]: { en: "Traps", ar: "شبكية" },
  [MuscleGroupEnum.LOWER_BACK]: { en: "Lower Back", ar: "أسفل ظهر" },
};
