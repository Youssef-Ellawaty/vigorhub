"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Zap, Target, Calendar, Play } from "lucide-react";
import { WorkoutSplit, Exercise, MuscleGroupEnum, Language } from "@/lib/athlete-dashboard/types";
import { MUSCLE_LABELS, WORKOUT_SPLITS } from "@/lib/athlete-dashboard/data";
import { translations } from "@/lib/athlete-dashboard/i18n";
import BodyMap from "./BodyMap";

interface SplitExplorerProps {
  lang: Language;
  isDark: boolean;
  customSplits: WorkoutSplit[];
  onActivate: (split: WorkoutSplit) => void;
  onCreateCustom: () => void;
}

const LEVEL_COLORS = {
  beginner: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  intermediate: "text-cyan-400 bg-cyan-400/10 border-cyan-400/30",
  advanced: "text-amber-400 bg-amber-400/10 border-amber-400/30",
};
const LEVEL_COLORS_LIGHT = {
  beginner: "text-emerald-700 bg-emerald-50 border-emerald-300",
  intermediate: "text-cyan-700 bg-cyan-50 border-cyan-300",
  advanced: "text-amber-700 bg-amber-50 border-amber-300",
};

export default function SplitExplorer({
  lang,
  isDark,
  customSplits,
  onActivate,
  onCreateCustom,
}: SplitExplorerProps) {
  const tr = translations[lang];
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredExercise, setHoveredExercise] = useState<Exercise | null>(null);

  const allSplits = [...WORKOUT_SPLITS, ...customSplits];
  const levelColors = isDark ? LEVEL_COLORS : LEVEL_COLORS_LIGHT;

  return (
    <div className="flex flex-col gap-6">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{tr.availableSplits}</h2>
          <p className="text-sm text-muted-foreground mt-1">{tr.hoverHint}</p>
        </div>
        <button
          onClick={onCreateCustom}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/40 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
        >
          <Zap size={16} />
          {tr.createCustom}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* LEFT: Split cards */}
        <div className="flex flex-col gap-3">
          {allSplits.map((split) => {
            const isExpanded = expandedId === split.id;
            return (
              <div
                key={split.id}
                className="glass-card rounded-2xl overflow-hidden transition-all duration-300"
              >
                {/* Card header */}
                <button
                  className="w-full text-start p-4 flex items-start justify-between gap-3 hover:bg-white/5 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : split.id)}
                  aria-expanded={isExpanded}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-foreground text-base leading-tight">
                        {split.name[lang]}
                      </span>
                      {split.isCustom && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-medium">
                          {tr.customBadge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar size={12} />
                        {split.daysPerWeek} {tr.daysPerWeek}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${levelColors[split.level]}`}>
                        {tr.levels[split.level]}
                      </span>
                    </div>
                    {!isExpanded && (
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-2">
                        {split.description[lang]}
                      </p>
                    )}
                  </div>
                  <div className="text-muted-foreground mt-1 flex-shrink-0">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mt-3 mb-4 leading-relaxed">
                      {split.description[lang]}
                    </p>
                    <div className="flex flex-col gap-3">
                      {split.days.map((day) => (
                        <div key={day.dayNumber} className="rounded-xl bg-secondary/50 p-3">
                          <p className="text-xs font-bold text-primary mb-2 uppercase tracking-wide">
                            {day.dayNumber}. {day.label[lang]}
                          </p>
                          <div className="flex flex-col gap-1.5">
                            {day.exercises.map((exercise) => (
                              <div
                                key={exercise.id}
                                className="flex items-center justify-between gap-2 text-xs px-2 py-1.5 rounded-lg cursor-default transition-colors hover:bg-white/5"
                                onMouseEnter={() => setHoveredExercise(exercise)}
                                onMouseLeave={() => setHoveredExercise(null)}
                              >
                                <span className="text-foreground/90">{exercise.name[lang]}</span>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  <span className="text-muted-foreground">
                                    {exercise.defaultSets}×{exercise.defaultReps}
                                  </span>
                                  <Target size={10} className="text-muted-foreground" />
                                  <span className="text-cyan-400 text-[10px]">
                                    {MUSCLE_LABELS[exercise.primaryMuscle][lang]}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Activate button */}
                    <button
                      onClick={() => onActivate(split)}
                      className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity btn-glow"
                    >
                      <Play size={16} fill="currentColor" />
                      {tr.activateWorkout}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* RIGHT: Body Map */}
        <div className="glass-card rounded-2xl p-4 flex flex-col gap-4 sticky top-4 self-start">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground text-sm">Muscle Map</h3>
            {hoveredExercise && (
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-semibold text-foreground">{hoveredExercise.name[lang]}</span>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <span className="flex items-center gap-1 text-[10px]">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                    <span className="text-cyan-400">{tr.primaryMuscle}: {MUSCLE_LABELS[hoveredExercise.primaryMuscle][lang]}</span>
                  </span>
                  {hoveredExercise.secondaryMuscles.length > 0 && (
                    <span className="flex items-center gap-1 text-[10px]">
                      <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                      <span className="text-amber-400">{tr.secondaryMuscle}: {hoveredExercise.secondaryMuscles.map(m => MUSCLE_LABELS[m][lang]).join(", ")}</span>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          {!hoveredExercise && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-cyan-400/80" />
                {tr.primaryMuscle}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-400/80" />
                {tr.secondaryMuscle}
              </span>
            </div>
          )}

          <div className="flex gap-2 text-[10px] text-muted-foreground font-medium px-2">
            <span className="flex-1 text-center">{tr.bodyMapFront}</span>
            <span className="flex-1 text-center">{tr.bodyMapBack}</span>
          </div>

          <BodyMap
            primaryMuscle={hoveredExercise?.primaryMuscle ?? null}
            secondaryMuscles={hoveredExercise?.secondaryMuscles ?? []}
            isDark={isDark}
          />

          {/* Muscle legend list */}
          <div className="grid grid-cols-2 gap-1 mt-1">
            {(Object.values(MuscleGroupEnum) as MuscleGroupEnum[]).map((muscle) => {
              const isPrimary = hoveredExercise?.primaryMuscle === muscle;
              const isSecondary = hoveredExercise?.secondaryMuscles.includes(muscle);
              return (
                <div
                  key={muscle}
                  className={`text-[10px] px-2 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
                    isPrimary
                      ? "bg-cyan-400/15 text-cyan-400 font-semibold"
                      : isSecondary
                      ? "bg-amber-400/15 text-amber-400 font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  {isPrimary && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />}
                  {isSecondary && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />}
                  {!isPrimary && !isSecondary && <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 flex-shrink-0" />}
                  {MUSCLE_LABELS[muscle][lang]}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
