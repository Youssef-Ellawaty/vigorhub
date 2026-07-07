"use client";

import { MuscleGroupEnum } from "@/lib/types";

interface BodyMapProps {
  primaryMuscle?: MuscleGroupEnum | null;
  secondaryMuscles?: MuscleGroupEnum[];
  onMuscleClick?: (muscle: MuscleGroupEnum) => void;
  interactive?: boolean;
  isDark?: boolean;
}

export default function BodyMap({
  primaryMuscle,
  secondaryMuscles = [],
  onMuscleClick,
  interactive = false,
  isDark = true,
}: BodyMapProps) {
  const neutralClass = isDark ? "muscle-neutral-dark" : "muscle-neutral-light";

  const getMuscleClass = (muscle: MuscleGroupEnum) => {
    if (muscle === primaryMuscle) return "muscle-primary";
    if (secondaryMuscles.includes(muscle)) return "muscle-secondary";
    return neutralClass;
  };

  const clickProps = (muscle: MuscleGroupEnum) =>
    interactive && onMuscleClick
      ? {
          onClick: () => onMuscleClick(muscle),
          className: `${getMuscleClass(muscle)} muscle-clickable`,
          role: "button" as const,
          tabIndex: 0,
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") onMuscleClick(muscle);
          },
        }
      : { className: getMuscleClass(muscle) };

  return (
    <div className="flex gap-3 w-full justify-center items-start">
      {/* FRONT VIEW */}
      <div className="flex-1 min-w-0">
        <svg viewBox="0 0 120 260" className="w-full h-auto" aria-label="Front body view">
          {/* Body outline */}
          <ellipse cx="60" cy="22" rx="14" ry="16" {...clickProps(MuscleGroupEnum.SHOULDERS)} />
          {/* Neck */}
          <rect x="55" y="36" width="10" height="10" rx="3" className={isDark ? "fill-slate-700" : "fill-slate-300"} />
          {/* Chest */}
          <path d="M35 50 Q40 46 55 48 L55 72 Q46 74 38 68 Z" {...clickProps(MuscleGroupEnum.CHEST)} />
          <path d="M65 48 Q80 46 85 50 L82 68 Q74 74 65 72 Z" {...clickProps(MuscleGroupEnum.CHEST)} />
          {/* Shoulders front */}
          <ellipse cx="33" cy="55" rx="9" ry="11" {...clickProps(MuscleGroupEnum.SHOULDERS)} />
          <ellipse cx="87" cy="55" rx="9" ry="11" {...clickProps(MuscleGroupEnum.SHOULDERS)} />
          {/* Core */}
          <rect x="44" y="72" width="32" height="38" rx="5" {...clickProps(MuscleGroupEnum.CORE)} />
          {/* Hips */}
          <path d="M38 110 Q38 118 44 120 L44 110 Z" className={isDark ? "fill-slate-700" : "fill-slate-300"} />
          <path d="M76 110 Q82 118 76 120 L76 110 Z" className={isDark ? "fill-slate-700" : "fill-slate-300"} />
          {/* Biceps */}
          <ellipse cx="24" cy="72" rx="7" ry="14" {...clickProps(MuscleGroupEnum.BICEPS)} />
          <ellipse cx="96" cy="72" rx="7" ry="14" {...clickProps(MuscleGroupEnum.BICEPS)} />
          {/* Forearms */}
          <ellipse cx="20" cy="98" rx="6" ry="13" {...clickProps(MuscleGroupEnum.FOREARMS)} />
          <ellipse cx="100" cy="98" rx="6" ry="13" {...clickProps(MuscleGroupEnum.FOREARMS)} />
          {/* Quads */}
          <ellipse cx="47" cy="148" rx="12" ry="26" {...clickProps(MuscleGroupEnum.QUADS)} />
          <ellipse cx="73" cy="148" rx="12" ry="26" {...clickProps(MuscleGroupEnum.QUADS)} />
          {/* Calves front */}
          <ellipse cx="47" cy="210" rx="9" ry="20" {...clickProps(MuscleGroupEnum.CALVES)} />
          <ellipse cx="73" cy="210" rx="9" ry="20" {...clickProps(MuscleGroupEnum.CALVES)} />
          {/* Feet */}
          <ellipse cx="47" cy="238" rx="10" ry="5" className={isDark ? "fill-slate-700" : "fill-slate-300"} />
          <ellipse cx="73" cy="238" rx="10" ry="5" className={isDark ? "fill-slate-700" : "fill-slate-300"} />
          {/* Glutes front peek */}
          <path d="M38 110 Q38 128 47 130 Q60 134 73 130 Q82 128 82 110" fill="none" stroke="currentColor" strokeWidth="0" />
        </svg>
      </div>

      {/* BACK VIEW */}
      <div className="flex-1 min-w-0">
        <svg viewBox="0 0 120 260" className="w-full h-auto" aria-label="Back body view">
          {/* Head */}
          <ellipse cx="60" cy="22" rx="14" ry="16" className={isDark ? "fill-slate-700" : "fill-slate-300"} />
          {/* Neck */}
          <rect x="55" y="36" width="10" height="10" rx="3" className={isDark ? "fill-slate-700" : "fill-slate-300"} />
          {/* Traps */}
          <path d="M40 46 Q60 36 80 46 Q74 58 60 56 Q46 58 40 46Z" {...clickProps(MuscleGroupEnum.TRAPS)} />
          {/* Rear Shoulders */}
          <ellipse cx="33" cy="55" rx="9" ry="11" {...clickProps(MuscleGroupEnum.SHOULDERS)} />
          <ellipse cx="87" cy="55" rx="9" ry="11" {...clickProps(MuscleGroupEnum.SHOULDERS)} />
          {/* Lats */}
          <path d="M35 56 Q30 68 34 88 Q40 96 50 94 L50 56Z" {...clickProps(MuscleGroupEnum.LATS)} />
          <path d="M85 56 Q90 68 86 88 Q80 96 70 94 L70 56Z" {...clickProps(MuscleGroupEnum.LATS)} />
          {/* Lower Back */}
          <rect x="44" y="90" width="32" height="26" rx="5" {...clickProps(MuscleGroupEnum.LOWER_BACK)} />
          {/* Triceps */}
          <ellipse cx="24" cy="72" rx="7" ry="14" {...clickProps(MuscleGroupEnum.TRICEPS)} />
          <ellipse cx="96" cy="72" rx="7" ry="14" {...clickProps(MuscleGroupEnum.TRICEPS)} />
          {/* Forearms back */}
          <ellipse cx="20" cy="98" rx="6" ry="13" {...clickProps(MuscleGroupEnum.FOREARMS)} />
          <ellipse cx="100" cy="98" rx="6" ry="13" {...clickProps(MuscleGroupEnum.FOREARMS)} />
          {/* Glutes */}
          <ellipse cx="47" cy="126" rx="13" ry="14" {...clickProps(MuscleGroupEnum.GLUTES)} />
          <ellipse cx="73" cy="126" rx="13" ry="14" {...clickProps(MuscleGroupEnum.GLUTES)} />
          {/* Hamstrings */}
          <ellipse cx="47" cy="162" rx="12" ry="24" {...clickProps(MuscleGroupEnum.HAMSTRINGS)} />
          <ellipse cx="73" cy="162" rx="12" ry="24" {...clickProps(MuscleGroupEnum.HAMSTRINGS)} />
          {/* Calves back */}
          <ellipse cx="47" cy="210" rx="9" ry="20" {...clickProps(MuscleGroupEnum.CALVES)} />
          <ellipse cx="73" cy="210" rx="9" ry="20" {...clickProps(MuscleGroupEnum.CALVES)} />
          {/* Feet */}
          <ellipse cx="47" cy="238" rx="10" ry="5" className={isDark ? "fill-slate-700" : "fill-slate-300"} />
          <ellipse cx="73" cy="238" rx="10" ry="5" className={isDark ? "fill-slate-700" : "fill-slate-300"} />
        </svg>
      </div>
    </div>
  );
}
