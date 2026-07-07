'use client'

import { Sun, Moon, Globe } from 'lucide-react'
import type { Language, Theme } from '@/lib/types'

interface SettingsPageProps {
  lang: Language
  theme: Theme
  onLangChange: (lang: Language) => void
  onThemeChange: (theme: Theme) => void
  isDark: boolean
}

export default function SettingsPage({ lang, theme, onLangChange, onThemeChange, isDark }: SettingsPageProps) {
  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0B0F19]' : 'bg-slate-50'}`}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className={`text-2xl font-black ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
            {lang === 'ar' ? 'الإعدادات' : 'Settings'}
          </h2>
          <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {lang === 'ar' ? 'تخصيص تجربة التطبيق الخاصة بك' : 'Customize your app experience'}
          </p>
        </div>

        {/* Settings Cards */}
        <div className="space-y-4">
          {/* Language Setting */}
          <div
            className={`rounded-2xl border p-6 ${
              isDark ? 'bg-slate-900/50 border-slate-700/40' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isDark ? 'bg-blue-500/10' : 'bg-blue-50'
                  }`}
                >
                  <Globe className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                    {lang === 'ar' ? 'اللغة' : 'Language'}
                  </h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {lang === 'ar' ? 'اختر لغة الواجهة المفضلة' : 'Choose your preferred interface language'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onLangChange(lang === 'en' ? 'ar' : 'en')}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                  isDark
                    ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                }`}
              >
                {lang === 'en' ? 'عربي' : 'EN'}
              </button>
            </div>
            <div className={`mt-4 pt-4 border-t ${isDark ? 'border-slate-700/20' : 'border-slate-200'}`}>
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                {lang === 'ar'
                  ? `اللغة الحالية: ${lang === 'ar' ? 'العربية' : 'الإنجليزية'}`
                  : `Current language: ${lang === 'en' ? 'English' : 'Arabic'}`}
              </p>
            </div>
          </div>

          {/* Theme Setting */}
          <div
            className={`rounded-2xl border p-6 ${
              isDark ? 'bg-slate-900/50 border-slate-700/40' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isDark ? 'bg-purple-500/10' : 'bg-purple-50'
                  }`}
                >
                  {isDark ? (
                    <Sun className="w-6 h-6 text-purple-400" />
                  ) : (
                    <Moon className="w-6 h-6 text-purple-600" />
                  )}
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                    {lang === 'ar' ? 'المظهر' : 'Theme'}
                  </h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {lang === 'ar' ? 'اختر بين المظهر الفاتح والداكن' : 'Toggle between light and dark mode'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                  isDark
                    ? 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20'
                    : 'bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-200'
                }`}
              >
                {theme === 'dark' ? (lang === 'ar' ? 'فاتح' : 'Light') : lang === 'ar' ? 'داكن' : 'Dark'}
              </button>
            </div>
            <div className={`mt-4 pt-4 border-t ${isDark ? 'border-slate-700/20' : 'border-slate-200'}`}>
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                {lang === 'ar'
                  ? `المظهر الحالي: ${theme === 'dark' ? 'داكن' : 'فاتح'}`
                  : `Current theme: ${theme === 'dark' ? 'Dark' : 'Light'}`}
              </p>
            </div>
          </div>

          {/* About Section */}
          <div
            className={`rounded-2xl border p-6 ${
              isDark ? 'bg-slate-900/50 border-slate-700/40' : 'bg-white border-slate-200'
            }`}
          >
            <h3 className={`font-bold text-sm mb-3 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              {lang === 'ar' ? 'عن التطبيق' : 'About'}
            </h3>
            <div className={`space-y-2 text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <p>
                <span className="font-semibold">{lang === 'ar' ? 'الاسم: ' : 'Name: '}</span>
                VigorHub
              </p>
              <p>
                <span className="font-semibold">{lang === 'ar' ? 'الإصدار: ' : 'Version: '}</span>
                1.0.0
              </p>
              <p>
                <span className="font-semibold">{lang === 'ar' ? 'الوصف: ' : 'Description: '}</span>
                {lang === 'ar'
                  ? 'منصة شاملة لتتبع التمارين والتغذية والأداء الرياضي'
                  : 'Comprehensive platform for workout tracking, nutrition, and athletic performance'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
