"use client";

import { useState, useCallback } from "react";
import {
  ArrowLeft,
  RefreshCw,
  Check,
  Dumbbell,
  ChevronRight,
  CheckCircle2,
  Footprints,
  ArrowUp,
  Trophy,
  RotateCcw,
} from "lucide-react";
import { WorkoutSplit, Language, ExerciseLog, SetLog, CardioLog, LiveSessionLogs } from "@/lib/athlete-dashboard/types";
import { getExercisesByMuscle, MUSCLE_LABELS, DAYS_OF_WEEK } from "@/lib/athlete-dashboard/data";
import { translations } from "@/lib/athlete-dashboard/i18n";

interface LiveSessionProps {
  split: WorkoutSplit;
  lang: Language;
  isDark: boolean;
  onBack: () => void;
}

function buildInitialLogs(split: WorkoutSplit, dayIdx: number): ExerciseLog[] {
  return split.days[dayIdx].exercises.map((ex) => ({
    exerciseId: ex.id,
    exerciseName: ex.name.en,
    sets: Array.from({ length: ex.defaultSets }, (_, i) => ({
      setNumber: i + 1,
      weight: "" as const,
      reps: "" as const,
      completed: false,
    })),
  }));
}

export default function LiveSession({ split, lang, isDark, onBack }: LiveSessionProps) {
  const tr = translations[lang];
  const today = new Date();
  const todayDow = today.getDay();

  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>(() =>
    buildInitialLogs(split, 0)
  );
  const [cardioLogs, setCardioLogs] = useState<CardioLog[]>([]);
  const [swapOpen, setSwapOpen] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [sessionLog, setSessionLog] = useState<LiveSessionLogs | null>(null);

  // ── Calendar week ──
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - todayDow + i);
    return d;
  });

  const handleDayChange = (idx: number) => {
    setActiveDayIdx(idx);
    setExerciseLogs(buildInitialLogs(split, idx));
    setSwapOpen(null);
  };

  // ── Set log updates ──
  const updateSet = useCallback(
    (exIdx: number, setIdx: number, field: keyof SetLog, value: SetLog[keyof SetLog]) => {
      setExerciseLogs((prev) =>
        prev.map((ex, ei) =>
          ei === exIdx
            ? {
                ...ex,
                sets: ex.sets.map((s, si) =>
                  si === setIdx ? { ...s, [field]: value } : s
                ),
              }
            : ex
        )
      );
    },
    []
  );

  // ── Add set ──
  const addSet = (exIdx: number) => {
    setExerciseLogs((prev) =>
      prev.map((ex, ei) =>
        ei === exIdx
          ? {
              ...ex,
              sets: [
                ...ex.sets,
                { setNumber: ex.sets.length + 1, weight: "", reps: "", completed: false },
              ],
            }
          : ex
      )
    );
  };

  // ── Swap exercise ──
  const swapExercise = (exIdx: number, newExercise: { id: string; name: { en: string; ar: string }; primaryMuscle: import("@/athlete-dashboard/lib/types").MuscleGroupEnum; secondaryMuscles: import("@/athlete-dashboard/lib/types").MuscleGroupEnum[]; defaultSets: number; defaultReps: string }) => {
    setExerciseLogs((prev) =>
      prev.map((ex, ei) =>
        ei === exIdx
          ? {
              exerciseId: newExercise.id,
              exerciseName: newExercise.name.en,
              swappedFrom: ex.exerciseName,
              sets: Array.from({ length: newExercise.defaultSets }, (_, i) => ({
                setNumber: i + 1,
                weight: "" as const,
                reps: "" as const,
                completed: false,
              })),
            }
          : ex
      )
    );
    setSwapOpen(null);
  };

  // ── Cardio helpers ──
  const addCardio = (type: "treadmill" | "stairmaster") => {
    setCardioLogs((prev) => [
      ...prev,
      type === "treadmill"
        ? { type: "treadmill", speed: "", duration: "", incline: "" }
        : { type: "stairmaster", speed: "", duration: "" },
    ]);
  };

  const updateCardio = (idx: number, field: keyof CardioLog, value: string | number) => {
    setCardioLogs((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c))
    );
  };

  const removeCardio = (idx: number) => {
    setCardioLogs((prev) => prev.filter((_, i) => i !== idx));
  };

  // ── Complete workout ──
  const completeWorkout = () => {
    const log: LiveSessionLogs = {
      splitId: split.id,
      dayIndex: activeDayIdx,
      date: today.toISOString(),
      exercises: exerciseLogs,
      cardio: cardioLogs,
      completed: true,
      completedAt: new Date().toISOString(),
    };
    setSessionLog(log);
    setCompleted(true);
  };

  const totalSets = exerciseLogs.reduce((a, e) => a + e.sets.length, 0);
  const doneSets = exerciseLogs.reduce((a, e) => a + e.sets.filter((s) => s.completed).length, 0);
  const progressPct = totalSets > 0 ? Math.round((doneSets / totalSets) * 100) : 0;

  const activeDay = split.days[activeDayIdx];

  // ── SUCCESS STATE ──
  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-8 text-center">
        <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center btn-glow">
          <Trophy size={40} className="text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-foreground">{tr.workoutComplete}</h2>
          <p className="text-muted-foreground mt-2">{tr.workoutCompleteMsg}</p>
        </div>
        {sessionLog && (
          <div className="glass-card rounded-2xl p-5 w-full max-w-sm text-start">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Session Summary</p>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Day</span>
                <span className="font-semibold text-foreground">{activeDay.label[lang]}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Exercises</span>
                <span className="font-semibold text-foreground">{exerciseLogs.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sets Completed</span>
                <span className="font-semibold text-primary">{doneSets}/{totalSets}</span>
              </div>
              {cardioLogs.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cardio</span>
                  <span className="font-semibold text-cyan-400">{cardioLogs.length} session(s)</span>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="px-6 py-2.5 rounded-xl bg-secondary text-foreground font-semibold text-sm hover:bg-secondary/80 transition-colors"
          >
            {tr.backToSplits}
          </button>
          <button
            onClick={() => { setCompleted(false); setExerciseLogs(buildInitialLogs(split, activeDayIdx)); setCardioLogs([]); }}
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2 btn-glow"
          >
            <RotateCcw size={16} />
            {tr.newSession}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Top bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-foreground text-lg leading-tight">{split.name[lang]}</h2>
          <p className="text-xs text-muted-foreground">{tr.liveSession}</p>
        </div>
        {/* Progress pill */}
        <div className="flex items-center gap-2 bg-secondary/60 rounded-full px-3 py-1.5">
          <div className="relative w-16 h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs font-bold text-primary">{progressPct}%</span>
        </div>
      </div>

      {/* Smart Calendar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col gap-3">
        {/* Recommendation banner */}
        <div className="bg-primary/10 border border-primary/30 rounded-xl px-4 py-2.5 flex items-center gap-2">
          <ChevronRight size={14} className="text-primary flex-shrink-0" />
          <p className="text-xs text-foreground">
            <span className="font-semibold text-primary">
              {tr.recommendedDay} {DAYS_OF_WEEK[lang][todayDow]}.
            </span>{" "}
            {tr.recommendedSuffix}{" "}
            <span className="font-bold text-primary">
              {split.days[activeDayIdx]?.label[lang] ?? split.days[0].label[lang]}
            </span>
          </p>
        </div>

        {/* Week timeline */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {weekDates.map((date, wi) => {
            const isToday = date.toDateString() === today.toDateString();
            return (
              <div
                key={wi}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl flex-shrink-0 w-11 transition-colors ${
                  isToday
                    ? "bg-primary/20 border border-primary/40"
                    : "bg-secondary/40"
                }`}
              >
                <span className={`text-[9px] font-semibold uppercase ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                  {DAYS_OF_WEEK[lang][date.getDay()]}
                </span>
                <span className={`text-sm font-bold ${isToday ? "text-primary" : "text-foreground/60"}`}>
                  {date.getDate()}
                </span>
              </div>
            );
          })}
        </div>

        {/* Split day selector */}
        <div className="flex gap-2 flex-wrap">
          {split.days.map((day, di) => (
            <button
              key={di}
              onClick={() => handleDayChange(di)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeDayIdx === di
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {day.label[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Logger */}
      <div className="flex flex-col gap-4">
        {exerciseLogs.map((exLog, exIdx) => {
          const originalExercise = activeDay.exercises[exIdx] ?? activeDay.exercises[0];
          const alternates = getExercisesByMuscle(originalExercise.primaryMuscle).filter(
            (e) => e.id !== exLog.exerciseId
          );
          const allSetsComplete = exLog.sets.every((s) => s.completed);

          return (
            <div
              key={exIdx}
              className={`glass-card rounded-2xl overflow-hidden transition-all ${
                allSetsComplete ? "border-primary/50 shadow-[0_0_12px_rgba(16,185,129,0.1)]" : ""
              }`}
            >
              {/* Exercise header */}
              <div className="flex items-center justify-between p-4 pb-3">
                <div className="flex items-center gap-2">
                  {allSetsComplete && <CheckCircle2 size={16} className="text-primary flex-shrink-0" />}
                  <div>
                    <p className="font-bold text-foreground text-sm leading-tight">{exLog.exerciseName}</p>
                    {exLog.swappedFrom && (
                      <p className="text-[10px] text-muted-foreground">swapped from {exLog.swappedFrom}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSwapOpen(swapOpen === exLog.exerciseId ? null : exLog.exerciseId)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-cyan-400 transition-colors bg-secondary/60 px-2.5 py-1.5 rounded-lg"
                  title={tr.exerciseSwap}
                >
                  <RefreshCw size={12} />
                  <span className="hidden sm:inline">{tr.exerciseSwap}</span>
                </button>
              </div>

              {/* Swap dropdown */}
              {swapOpen === exLog.exerciseId && (
                <div className="mx-4 mb-3 bg-secondary/80 rounded-xl p-3 border border-cyan-400/20">
                  <p className="text-xs font-semibold text-cyan-400 mb-2">{tr.swapWith}:</p>
                  <div className="flex flex-col gap-1 max-h-36 overflow-y-auto">
                    {alternates.map((alt) => (
                      <button
                        key={alt.id}
                        onClick={() => swapExercise(exIdx, alt)}
                        className="text-start text-xs px-3 py-2 rounded-lg hover:bg-cyan-400/15 hover:text-cyan-400 text-foreground/80 transition-colors"
                      >
                        {alt.name[lang]}
                      </button>
                    ))}
                    {alternates.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-2">No alternatives</p>
                    )}
                  </div>
                </div>
              )}

              {/* Set rows */}
              <div className="px-4 pb-3 flex flex-col gap-2">
                {/* Header */}
                <div className="grid grid-cols-[40px_1fr_1fr_44px] gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide px-1">
                  <span>{tr.set}</span>
                  <span>{tr.weight}</span>
                  <span>{tr.reps}</span>
                  <span className="text-center">{tr.completeSet}</span>
                </div>

                {exLog.sets.map((set, setIdx) => (
                  <div
                    key={setIdx}
                    className={`grid grid-cols-[40px_1fr_1fr_44px] gap-2 items-center rounded-xl px-1 py-1 transition-colors ${
                      set.completed ? "bg-primary/10" : "bg-secondary/30"
                    }`}
                  >
                    <span className={`text-xs font-bold text-center ${set.completed ? "text-primary" : "text-muted-foreground"}`}>
                      {set.setNumber}
                    </span>
                    <input
                      type="number"
                      value={set.weight}
                      onChange={(e) => updateSet(exIdx, setIdx, "weight", e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="0"
                      className="w-full px-2 py-1.5 rounded-lg bg-secondary/60 border border-border text-foreground text-xs text-center focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40"
                      aria-label={`Set ${set.setNumber} weight`}
                    />
                    <input
                      type="text"
                      value={set.reps}
                      onChange={(e) => updateSet(exIdx, setIdx, "reps", e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="0"
                      className="w-full px-2 py-1.5 rounded-lg bg-secondary/60 border border-border text-foreground text-xs text-center focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40"
                      aria-label={`Set ${set.setNumber} reps`}
                    />
                    <button
                      onClick={() => updateSet(exIdx, setIdx, "completed", !set.completed)}
                      className={`w-full flex items-center justify-center h-8 rounded-lg transition-all ${
                        set.completed
                          ? "bg-primary text-primary-foreground shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                          : "bg-secondary/60 border border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
                      }`}
                      aria-label={`Mark set ${set.setNumber} complete`}
                    >
                      <Check size={14} />
                    </button>
                  </div>
                ))}

                {/* Add set button */}
                <button
                  onClick={() => addSet(exIdx)}
                  className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1.5 px-1 py-1 transition-colors mt-1"
                >
                  <Dumbbell size={11} />
                  + Add Set
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cardio Protocol */}
      <div className="glass-card rounded-2xl p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground text-sm">{tr.cardioSection}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => addCardio("treadmill")}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-secondary hover:bg-primary/20 hover:text-primary text-muted-foreground transition-colors"
            >
              <Footprints size={12} />
              {tr.treadmill}
            </button>
            <button
              onClick={() => addCardio("stairmaster")}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-secondary hover:bg-primary/20 hover:text-primary text-muted-foreground transition-colors"
            >
              <ArrowUp size={12} />
              {tr.stairmaster}
            </button>
          </div>
        </div>

        {cardioLogs.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            {lang === "ar" ? "أضف جلسة كارديو من الأزرار أعلاه" : "Add a cardio session using the buttons above"}
          </p>
        )}

        {cardioLogs.map((cardio, ci) => (
          <div key={ci} className="bg-secondary/50 rounded-xl p-3 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {cardio.type === "treadmill" ? <Footprints size={14} className="text-cyan-400" /> : <ArrowUp size={14} className="text-amber-400" />}
                <span className={`text-xs font-semibold ${cardio.type === "treadmill" ? "text-cyan-400" : "text-amber-400"}`}>
                  {cardio.type === "treadmill" ? tr.treadmill : tr.stairmaster}
                </span>
              </div>
              <button
                onClick={() => removeCardio(ci)}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                {tr.remove}
              </button>
            </div>
            <div className={`grid gap-3 ${cardio.type === "treadmill" ? "grid-cols-3" : "grid-cols-2"}`}>
              <div>
                <label className="block text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">
                  {cardio.type === "stairmaster" ? tr.level_cardio : tr.speed}
                </label>
                <input
                  type="number"
                  value={cardio.speed}
                  onChange={(e) => updateCardio(ci, "speed", e.target.value)}
                  placeholder="0"
                  className="w-full px-2 py-2 rounded-lg bg-secondary/80 border border-border text-foreground text-xs text-center focus:outline-none focus:border-primary"
                  aria-label="Speed"
                />
              </div>
              <div>
                <label className="block text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">
                  {tr.duration}
                </label>
                <input
                  type="number"
                  value={cardio.duration}
                  onChange={(e) => updateCardio(ci, "duration", e.target.value)}
                  placeholder="0"
                  className="w-full px-2 py-2 rounded-lg bg-secondary/80 border border-border text-foreground text-xs text-center focus:outline-none focus:border-primary"
                  aria-label="Duration"
                />
              </div>
              {cardio.type === "treadmill" && (
                <div>
                  <label className="block text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">
                    {tr.incline}
                  </label>
                  <input
                    type="number"
                    value={(cardio as { incline?: number | "" }).incline ?? ""}
                    onChange={(e) => updateCardio(ci, "incline", e.target.value)}
                    placeholder="0"
                    className="w-full px-2 py-2 rounded-lg bg-secondary/80 border border-border text-foreground text-xs text-center focus:outline-none focus:border-primary"
                    aria-label="Incline"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Complete Workout Button */}
      <button
        onClick={completeWorkout}
        className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base flex items-center justify-center gap-3 hover:opacity-95 active:scale-[0.98] transition-all btn-glow"
      >
        <Trophy size={22} />
        {tr.completeWorkout}
      </button>
    </div>
  );
}
