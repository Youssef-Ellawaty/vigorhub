'use client'

import { Sun, Moon, Globe, CheckCircle2 } from 'lucide-react'
import type { Language, Theme } from '@/lib/types'

interface SettingsPageProps {
  lang: Language
  setLang: (lang: Language) => void
  theme: Theme
  setTheme: (theme: Theme) => void
}

export default function SettingsPage({ lang, setLang, theme, setTheme }: SettingsPageProps) {
  const isDark = theme === 'dark'

  return (
    <div className={`max-w-4xl mx-auto`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
          {lang === 'ar' ? 'الإعدادات' : 'Settings'}
        </h1>
        <p className={`text-sm mt-2 ${isDark ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>
          {lang === 'ar' ? 'تخصيص تجربة التطبيق الخاصة بك' : 'Customize your app experience'}
        </p>
      </div>

      {/* Settings Grid */}
      <div className="space-y-6">
        {/* Language Setting */}
        <div className={`rounded-xl border p-6 ${isDark ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${isDark ? 'bg-[#3b82f6]/15' : 'bg-[#3b82f6]/10'}`}>
                <Globe className={`w-6 h-6 ${isDark ? 'text-[#60a5fa]' : 'text-[#3b82f6]'}`} />
              </div>
              <div>
                <h3 className={`font-bold text-base ${isDark ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  {lang === 'ar' ? 'اللغة' : 'Language'}
                </h3>
                <p className={`text-sm mt-1 ${isDark ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>
                  {lang === 'ar' ? 'اختر لغة الواجهة المفضلة' : 'Choose your preferred interface language'}
                </p>
              </div>
            </div>

            {/* Language Buttons */}
            <div className="flex gap-3">
              {['en', 'ar'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l as Language)}
                  className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                    lang === l
                      ? isDark
                        ? 'bg-[#10b981] text-white'
                        : 'bg-[#10b981] text-white'
                      : isDark
                      ? 'bg-[#334155] text-[#94a3b8] hover:bg-[#475569]'
                      : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]'
                  }`}
                >
                  {lang === l && <CheckCircle2 className="w-4 h-4" />}
                  {l === 'en' ? 'English' : 'العربية'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Theme Setting */}
        <div className={`rounded-xl border p-6 ${isDark ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${isDark ? 'bg-[#f59e0b]/15' : 'bg-[#f59e0b]/10'}`}>
                {theme === 'dark' ? (
                  <Moon className={`w-6 h-6 ${isDark ? 'text-[#fbbf24]' : 'text-[#f59e0b]'}`} />
                ) : (
                  <Sun className={`w-6 h-6 ${isDark ? 'text-[#fbbf24]' : 'text-[#f59e0b]'}`} />
                )}
              </div>
              <div>
                <h3 className={`font-bold text-base ${isDark ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  {lang === 'ar' ? 'المظهر' : 'Theme'}
                </h3>
                <p className={`text-sm mt-1 ${isDark ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>
                  {lang === 'ar' ? 'اختر المظهر المفضل لديك (فاتح/غامق)' : 'Choose your preferred appearance'}
                </p>
              </div>
            </div>

            {/* Theme Buttons */}
            <div className="flex gap-3">
              {['light', 'dark'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t as Theme)}
                  className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                    theme === t
                      ? isDark
                        ? 'bg-[#10b981] text-white'
                        : 'bg-[#10b981] text-white'
                      : isDark
                      ? 'bg-[#334155] text-[#94a3b8] hover:bg-[#475569]'
                      : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]'
                  }`}
                >
                  {theme === t && <CheckCircle2 className="w-4 h-4" />}
                  {t === 'light' ? (
                    <>
                      <Sun className="w-4 h-4" />
                      {lang === 'ar' ? 'فاتح' : 'Light'}
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4" />
                      {lang === 'ar' ? 'غامق' : 'Dark'}
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className={`rounded-xl border p-6 ${isDark ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}>
          <h3 className={`font-bold text-base mb-4 ${isDark ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
            {lang === 'ar' ? 'عن التطبيق' : 'About'}
          </h3>
          <div className={`space-y-3 text-sm ${isDark ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>
            <div className="flex items-center justify-between">
              <span>{lang === 'ar' ? 'اسم التطبيق:' : 'App Name:'}</span>
              <span className={`font-semibold ${isDark ? 'text-[#6ee7b7]' : 'text-[#10b981]'}`}>VigorHub</span>
            </div>
            <div className="flex items-center justify-between">
              <span>{lang === 'ar' ? 'الإصدار:' : 'Version:'}</span>
              <span className={`font-semibold ${isDark ? 'text-[#60a5fa]' : 'text-[#3b82f6]'}`}>1.0.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span>{lang === 'ar' ? 'الحالة:' : 'Status:'}</span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10b981]/15 text-[#10b981] font-semibold">
                <div className="w-2 h-2 rounded-full bg-[#10b981]" />
                {lang === 'ar' ? 'نشط' : 'Active'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
