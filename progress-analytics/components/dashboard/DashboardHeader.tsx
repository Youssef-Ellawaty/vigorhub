'use client'

import { Sun, Moon, Globe } from 'lucide-react'
import type { Language, Theme } from '@/progress-analytics/lib/dashboard-types'
import { t } from '@/progress-analytics/lib/i18n'

interface DashboardHeaderProps {
  theme: Theme
  lang: Language
  onToggleTheme: () => void
  onToggleLang: () => void
}

export default function DashboardHeader({
  theme,
  lang,
  onToggleTheme,
  onToggleLang,
}: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-border/50 glass-card sticky top-0 z-30">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center overflow-hidden">
          <img src="/logo.jpg" alt="VigorHub Logo" className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-foreground tracking-wider uppercase">
            {t(lang, 'appName')}
          </h1>
          <p className="text-[10px] text-muted-foreground tracking-widest uppercase hidden sm:block">
            {t(lang, 'tagline')}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleLang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 bg-muted hover:bg-muted/80 text-xs font-medium text-foreground transition-colors"
          aria-label="Toggle Language"
        >
          <Globe className="w-3.5 h-3.5 text-primary" />
          <span className="hidden sm:inline">{t(lang, 'toggleLang')}</span>
        </button>
        <button
          onClick={onToggleTheme}
          className="w-9 h-9 rounded-lg border border-border/60 bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
          aria-label={t(lang, 'toggleTheme')}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-primary" />
          )}
        </button>
      </div>
    </header>
  )
}
