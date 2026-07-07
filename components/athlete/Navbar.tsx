"use client";

import { Sun, Moon, Dumbbell } from "lucide-react";
import { Language, Theme } from "@/lib/types";
import { translations } from "@/lib/i18n";

interface NavbarProps {
  lang: Language;
  theme: Theme;
  onLangToggle: () => void;
  onThemeToggle: () => void;
  activeModule: "splits" | "live";
  splitName?: string;
}

export default function Navbar({
  lang,
  theme,
  onLangToggle,
  onThemeToggle,
  activeModule,
  splitName,
}: NavbarProps) {
  const tr = translations[lang];

  return (
    <header className="sticky top-0 z-40 w-full glass-card border-b border-border/60 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Dumbbell size={16} className="text-primary" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-black text-foreground text-sm tracking-tight">{tr.appName}</span>
            <span className="text-[9px] text-muted-foreground uppercase tracking-widest hidden sm:block">
              {tr.appSubtitle}
            </span>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground flex-1 justify-center">
          <span className={activeModule === "splits" ? "text-primary font-semibold" : ""}>{tr.moduleOne}</span>
          {activeModule === "live" && (
            <>
              <span>/</span>
              <span className="text-foreground font-semibold">{splitName ?? tr.moduleTwo}</span>
            </>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={onLangToggle}
            className="px-3 py-1.5 rounded-lg bg-secondary/80 border border-border text-xs font-bold text-foreground hover:border-primary/50 hover:text-primary transition-colors min-w-[52px] text-center"
            aria-label="Toggle language"
          >
            {lang === "en" ? "عربي" : "EN"}
          </button>

          {/* Theme toggle */}
          <button
            onClick={onThemeToggle}
            className="w-8 h-8 rounded-lg bg-secondary/80 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>
    </header>
  );
}
