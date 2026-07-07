'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Settings, LogOut, LayoutDashboard, TrendingUp, UtensilsCrossed, Users, Moon, Sun, Globe } from 'lucide-react'

// Import your feature components
import AthleteModule from '@/components/modules/AthleteModule'
import CaloricTrackerModule from '@/components/modules/CaloricTrackerModule'
import ProgressAnalyticsModule from '@/components/modules/ProgressAnalyticsModule'
import CommunityModule from '@/components/modules/CommunityModule'
import SettingsPage from '@/components/pages/SettingsPage'

import type { Language, Theme } from '@/lib/types'

interface DashboardLayoutProps {
  user: {
    id: string
    username: string
    fullName: string
  }
  userRole: 'free_athlete' | 'coach' | 'premium_athlete'
  onLogout: () => void
}

type ActivePage = 'athlete-dashboard' | 'calorie-tracker' | 'progress-analytics' | 'community' | 'settings'

interface NavItem {
  id: ActivePage
  label: string
  icon: React.ReactNode
  description: string
}

export default function DashboardLayout({ user, userRole, onLogout }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activePage, setActivePage] = useState<ActivePage>('athlete-dashboard')
  const [lang, setLang] = useState<Language>('en')
  const [theme, setTheme] = useState<Theme>('dark')

  const isDark = theme === 'dark'

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [activePage])

  // Apply theme to document
  useEffect(() => {
    const html = document.documentElement
    if (isDark) {
      html.classList.remove('light')
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
      html.classList.add('light')
    }
  }, [isDark])

  // Apply RTL/LTR
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang])

  const navItems: NavItem[] = [
    {
      id: 'athlete-dashboard',
      label: lang === 'ar' ? 'لوحة الرياضي' : 'Athlete Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      description: lang === 'ar' ? 'برامج التمرين' : 'Workout Programs',
    },
    {
      id: 'calorie-tracker',
      label: lang === 'ar' ? 'تتبع السعرات' : 'Calorie Tracker',
      icon: <UtensilsCrossed className="w-5 h-5" />,
      description: lang === 'ar' ? 'تسجيل الطعام والماء' : 'Food & Water Logging',
    },
    {
      id: 'progress-analytics',
      label: lang === 'ar' ? 'تحليل التقدم' : 'Progress Analytics',
      icon: <TrendingUp className="w-5 h-5" />,
      description: lang === 'ar' ? 'الإحصائيات والتقارير' : 'Stats & Charts',
    },
    {
      id: 'community',
      label: lang === 'ar' ? 'المجتمع' : 'Community',
      icon: <Users className="w-5 h-5" />,
      description: lang === 'ar' ? 'الشبكة الاجتماعية' : 'Social Network',
    },
  ]

  return (
    <div
      className={`min-h-screen flex ${isDark ? 'bg-[#0f172a]' : 'bg-white'}`}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Sidebar (Desktop & Mobile) ─── */}
      <aside
        className={`fixed inset-y-0 ${lang === 'ar' ? 'right-0' : 'left-0'} z-50 w-72 transition-transform duration-300 ease-in-out transform ${
          sidebarOpen ? 'translate-x-0' : lang === 'ar' ? 'translate-x-full' : '-translate-x-full'
        } md:translate-x-0 md:relative md:z-auto ${
          isDark ? 'bg-[#1e293b]' : 'bg-white'
        } border-${lang === 'ar' ? 'l' : 'r'} ${isDark ? 'border-[#334155]' : 'border-[#e2e8f0]'} flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className={`h-20 flex items-center justify-between px-6 ${isDark ? 'border-[#334155]' : 'border-[#e2e8f0]'} border-b`}>
          <div>
            <h2 className={`font-black text-xl ${isDark ? 'text-[#6ee7b7]' : 'text-[#10b981]'}`}>VigorHub</h2>
            <p className={`text-xs font-medium ${isDark ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>{user.username}</p>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-[#334155] text-[#94a3b8]' : 'hover:bg-[#f1f5f9] text-[#64748b]'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-start gap-3 group ${
                activePage === item.id
                  ? isDark
                    ? 'bg-[#10b981]/15 border border-[#10b981]/40 text-[#6ee7b7]'
                    : 'bg-[#10b981]/10 border border-[#10b981]/30 text-[#059669]'
                  : isDark
                  ? 'text-[#94a3b8] hover:bg-[#334155]/50 hover:text-[#cbd5e1]'
                  : 'text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#1e293b]'
              }`}
            >
              <span className="flex-shrink-0 mt-1">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{item.label}</p>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-[#64748b]' : 'text-[#94a3b8]'}`}>{item.description}</p>
              </div>
            </button>
          ))}
        </nav>

        {/* Settings & Logout */}
        <div className={`px-4 py-4 space-y-2 ${isDark ? 'border-[#334155]' : 'border-[#e2e8f0]'} border-t`}>
          <button
            onClick={() => setActivePage('settings')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
              activePage === 'settings'
                ? isDark
                  ? 'bg-[#3b82f6]/15 text-[#60a5fa]'
                  : 'bg-[#3b82f6]/10 text-[#1d4ed8]'
                : isDark
                ? 'text-[#94a3b8] hover:bg-[#334155]/50'
                : 'text-[#64748b] hover:bg-[#f1f5f9]'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-semibold text-sm">{lang === 'ar' ? 'الإعدادات' : 'Settings'}</span>
          </button>

          <button
            onClick={() => {
              onLogout()
              setSidebarOpen(false)
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-semibold text-sm ${
              isDark
                ? 'text-[#94a3b8] hover:bg-[#ef4444]/15 hover:text-[#ef4444]'
                : 'text-[#64748b] hover:bg-[#ef4444]/10 hover:text-[#dc2626]'
            }`}
          >
            <LogOut className="w-5 h-5" />
            <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
          </button>
        </div>
      </aside>

      {/* ─── Main Content Area ─── */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className={`sticky top-0 z-40 ${isDark ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'} border-b`}>
          <div className="h-16 px-4 md:px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`md:hidden p-2 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-[#334155] text-[#cbd5e1]' : 'hover:bg-[#f1f5f9] text-[#475569]'
                }`}
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className={`text-lg font-bold hidden md:block ${isDark ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                {navItems.find(n => n.id === activePage)?.label || 'Settings'}
              </h1>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-3">
              {/* Language Toggle */}
              <button
                onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                className={`p-2.5 rounded-lg transition-all ${
                  isDark
                    ? 'bg-[#334155] hover:bg-[#475569] text-[#cbd5e1]'
                    : 'bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569]'
                }`}
                title={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
              >
                <Globe className="w-5 h-5" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`p-2.5 rounded-lg transition-all ${
                  isDark
                    ? 'bg-[#334155] hover:bg-[#475569] text-[#cbd5e1]'
                    : 'bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569]'
                }`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* User Avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${isDark ? 'bg-[#10b981]' : 'bg-[#10b981]'}`}>
                {user.fullName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className={`flex-1 overflow-auto p-4 md:p-6 ${isDark ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
          {activePage === 'athlete-dashboard' && <AthleteModule lang={lang} theme={theme} />}
          {activePage === 'calorie-tracker' && <CaloricTrackerModule lang={lang} theme={theme} />}
          {activePage === 'progress-analytics' && <ProgressAnalyticsModule lang={lang} theme={theme} />}
          {activePage === 'community' && <CommunityModule lang={lang} theme={theme} />}
          {activePage === 'settings' && (
            <SettingsPage
              lang={lang}
              setLang={setLang}
              theme={theme}
              setTheme={setTheme}
            />
          )}
        </div>
      </main>
    </div>
  )
}
