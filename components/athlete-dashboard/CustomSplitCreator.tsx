"use client";

import { useState } from "react";
import { X, Plus, Trash2, Save } from "lucide-react";
import { Language, MuscleGroupEnum, WorkoutSplit, Exercise } from "@/lib/athlete-dashboard/types";
import { EXERCISES, MUSCLE_LABELS, getExercisesByMuscle } from "@/lib/athlete-dashboard/data";
import { translations } from "@/lib/athlete-dashboard/i18n";
import BodyMap from "./BodyMap";

interface CustomDay {
  dayNumber: number;
  label: string;
  exercises: Array<{ exercise: Exercise; sets: string; reps: string }>;
}

interface CustomSplitCreatorProps {
  lang: Language;
  isDark: boolean;
  onSave: (split: WorkoutSplit) => void;
  onCancel: () => void;
}

export default function CustomSplitCreator({ lang, isDark, onSave, onCancel }: CustomSplitCreatorProps) {
  const tr = translations[lang];

  const [splitName, setSplitName] = useState("");
  const [days, setDays] = useState<CustomDay[]>([
    { dayNumber: 1, label: lang === "ar" ? "يوم 1" : "Day 1", exercises: [] },
  ]);
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroupEnum | null>(null);
  const [showMuscleExercises, setShowMuscleExercises] = useState(false);

  const handleMuscleClick = (muscle: MuscleGroupEnum) => {
    setSelectedMuscle(muscle);
    setShowMuscleExercises(true);
  };

  const addExerciseToDay = (exercise: Exercise) => {
    setDays((prev) =>
      prev.map((d, i) =>
        i === activeDayIdx
          ? { ...d, exercises: [...d.exercises, { exercise, sets: "3", reps: "10-12" }] }
          : d
      )
    );
    setShowMuscleExercises(false);
    setSelectedMuscle(null);
  };

  const removeExercise = (dayIdx: number, exIdx: number) => {
    setDays((prev) =>
      prev.map((d, i) =>
        i === dayIdx ? { ...d, exercises: d.exercises.filter((_, j) => j !== exIdx) } : d
      )
    );
  };

  const updateExField = (dayIdx: number, exIdx: number, field: "sets" | "reps", value: string) => {
    setDays((prev) =>
      prev.map((d, i) =>
        i === dayIdx
          ? {
              ...d,
              exercises: d.exercises.map((e, j) =>
                j === exIdx ? { ...e, [field]: value } : e
              ),
            }
          : d
      )
    );
  };

  const addDay = () => {
    const n = days.length + 1;
    setDays((prev) => [
      ...prev,
      { dayNumber: n, label: lang === "ar" ? `يوم ${n}` : `Day ${n}`, exercises: [] },
    ]);
    setActiveDayIdx(n - 1);
  };

  const removeDay = (idx: number) => {
    if (days.length === 1) return;
    setDays((prev) => prev.filter((_, i) => i !== idx).map((d, i) => ({ ...d, dayNumber: i + 1 })));
    setActiveDayIdx((prev) => Math.min(prev, days.length - 2));
  };

  const handleSave = () => {
    if (!splitName.trim()) return;
    const newSplit: WorkoutSplit = {
      id: `custom-${Date.now()}`,
      name: { en: splitName, ar: splitName },
      daysPerWeek: days.length,
      level: "intermediate",
      description: {
        en: `Custom split: ${splitName}`,
        ar: `نظام مخصص: ${splitName}`,
      },
      days: days.map((d) => ({
        dayNumber: d.dayNumber,
        label: { en: d.label, ar: d.label },
        exercises: d.exercises.map((e) => e.exercise),
      })),
      isCustom: true,
    };
    onSave(newSplit);
  };

  const muscleExercises = selectedMuscle ? getExercisesByMuscle(selectedMuscle) : [];
  const activeDay = days[activeDayIdx];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-8 px-4">
      <div className="glass-card rounded-2xl w-full max-w-4xl border border-border shadow-2xl">
        {/* Modal header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">{tr.customSplitTitle}</h2>
          <button onClick={onCancel} className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT panel */}
          <div className="flex flex-col gap-4">
            {/* Split name */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                {tr.splitName}
              </label>
              <input
                type="text"
                value={splitName}
                onChange={(e) => setSplitName(e.target.value)}
                placeholder={lang === "ar" ? "مثال: نظام قوتي" : "e.g. My Strength Plan"}
                className="w-full px-3 py-2.5 rounded-xl bg-secondary/60 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Day tabs */}
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {days.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveDayIdx(i)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      activeDayIdx === i
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
                <button
                  onClick={addDay}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary/60 text-muted-foreground hover:text-primary border border-dashed border-border hover:border-primary transition-colors flex items-center gap-1"
                >
                  <Plus size={12} /> {tr.addDay}
                </button>
              </div>
            </div>

            {/* Active day config */}
            {activeDay && (
              <div className="glass-card rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={activeDay.label}
                    onChange={(e) =>
                      setDays((prev) =>
                        prev.map((d, i) => (i === activeDayIdx ? { ...d, label: e.target.value } : d))
                      )
                    }
                    className="text-sm font-bold text-foreground bg-transparent border-b border-border/50 focus:outline-none focus:border-primary px-1 py-0.5 w-32"
                  />
                  {days.length > 1 && (
                    <button
                      onClick={() => removeDay(activeDayIdx)}
                      className="p-1 rounded text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {/* Exercises list */}
                {activeDay.exercises.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">{tr.clickMuscleHint}</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {activeDay.exercises.map((ex, exIdx) => (
                      <div key={exIdx} className="flex items-center gap-2 bg-secondary/50 rounded-lg p-2">
                        <span className="text-xs text-foreground flex-1 min-w-0 truncate">{ex.exercise.name[lang]}</span>
                        <input
                          type="text"
                          value={ex.sets}
                          onChange={(e) => updateExField(activeDayIdx, exIdx, "sets", e.target.value)}
                          className="w-10 text-xs text-center bg-secondary rounded px-1 py-1 border border-border focus:outline-none focus:border-primary text-foreground"
                          placeholder="Sets"
                          aria-label="Sets"
                        />
                        <span className="text-muted-foreground text-xs">×</span>
                        <input
                          type="text"
                          value={ex.reps}
                          onChange={(e) => updateExField(activeDayIdx, exIdx, "reps", e.target.value)}
                          className="w-14 text-xs text-center bg-secondary rounded px-1 py-1 border border-border focus:outline-none focus:border-primary text-foreground"
                          placeholder="Reps"
                          aria-label="Reps"
                        />
                        <button
                          onClick={() => removeExercise(activeDayIdx, exIdx)}
                          className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Muscle exercise picker */}
                {showMuscleExercises && selectedMuscle && (
                  <div className="bg-secondary/80 rounded-xl p-3 border border-primary/30">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-primary">
                        {tr.exercisesFor} {MUSCLE_LABELS[selectedMuscle][lang]}
                      </p>
                      <button onClick={() => setShowMuscleExercises(false)} className="text-muted-foreground hover:text-foreground">
                        <X size={12} />
                      </button>
                    </div>
                    <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
                      {muscleExercises.map((ex) => {
                        const alreadyAdded = activeDay.exercises.some((e) => e.exercise.id === ex.id);
                        return (
                          <button
                            key={ex.id}
                            disabled={alreadyAdded}
                            onClick={() => addExerciseToDay(ex)}
                            className={`text-start text-xs px-3 py-2 rounded-lg transition-colors ${
                              alreadyAdded
                                ? "text-muted-foreground/50 cursor-not-allowed"
                                : "text-foreground hover:bg-primary/20 hover:text-primary"
                            }`}
                          >
                            {ex.name[lang]}
                            {alreadyAdded && <span className="text-[10px] text-muted-foreground ms-2">(added)</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT panel — interactive body map */}
          <div className="flex flex-col gap-3">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">{tr.clickMuscleHint}</p>
            <div className="glass-card rounded-xl p-4">
              <BodyMap
                primaryMuscle={selectedMuscle}
                secondaryMuscles={[]}
                onMuscleClick={handleMuscleClick}
                interactive
                isDark={isDark}
              />
            </div>
            {/* Muscle group quick buttons */}
            <div className="grid grid-cols-3 gap-1.5">
              {(Object.values(MuscleGroupEnum) as MuscleGroupEnum[]).map((muscle) => (
                <button
                  key={muscle}
                  onClick={() => handleMuscleClick(muscle)}
                  className={`text-[10px] px-2 py-1.5 rounded-lg font-medium transition-colors text-start ${
                    selectedMuscle === muscle
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-primary hover:bg-primary/10"
                  }`}
                >
                  {MUSCLE_LABELS[muscle][lang]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-border">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground bg-secondary/60 hover:bg-secondary transition-colors"
          >
            {tr.cancel}
          </button>
          <button
            onClick={handleSave}
            disabled={!splitName.trim()}
            className="px-5 py-2.5 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity flex items-center gap-2 btn-glow"
          >
            <Save size={16} />
            {tr.saveSplit}
          </button>
        </div>
      </div>
    </div>
  );
}
