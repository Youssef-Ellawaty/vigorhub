'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Settings, LogOut, LayoutDashboard, TrendingUp, UtensilsCrossed, Users } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

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
      className={`min-h-screen flex ${isDark ? 'bg-[#0B0F19]' : 'bg-slate-50'}`}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* ─── Sidebar (Desktop & Mobile) ─── */}
      <aside
        className={`fixed inset-y-0 ${lang === 'ar' ? 'right-0' : 'left-0'} z-50 w-64 transition-transform duration-300 ease-in-out transform ${
          sidebarOpen ? 'translate-x-0' : lang === 'ar' ? 'translate-x-full' : '-translate-x-full'
        } md:translate-x-0 md:translate-y-0 md:relative md:z-auto ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } border-${lang === 'ar' ? 'l' : 'r'} border-${isDark ? 'slate-800' : 'slate-200'}`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-700/40">
          <div>
            <h2 className={`font-black text-sm ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>VigorHub</h2>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{user.username}</p>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-start gap-3 ${
                activePage === item.id
                  ? isDark
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                    : 'bg-emerald-50 border border-emerald-200 text-emerald-600'
                  : isDark
                  ? 'text-slate-400 hover:bg-slate-700/30'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="flex-shrink-0 mt-0.5">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{item.label}</p>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{item.description}</p>
              </div>
            </button>
          ))}

          {/* Settings Link */}
          <button
            onClick={() => setActivePage('settings')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-start gap-3 border ${
              activePage === 'settings'
                ? isDark
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                  : 'bg-blue-50 border-blue-200 text-blue-600'
                : isDark
                ? 'text-slate-400 hover:bg-slate-700/30 border-slate-700/30'
                : 'text-slate-600 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <Settings className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{lang === 'ar' ? 'الإعدادات' : 'Settings'}</p>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                {lang === 'ar' ? 'اللغة والمظهر' : 'Language & Theme'}
              </p>
            </div>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="px-4 py-4 border-t border-slate-700/40">
          <button
            onClick={() => {
              onLogout()
              setSidebarOpen(false)
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isDark
                ? 'text-slate-400 hover:bg-red-500/10 hover:text-red-400'
                : 'text-slate-600 hover:bg-red-50 hover:text-red-600'
            }`}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-semibold text-sm">{lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
          </button>
        </div>
      </aside>

      {/* ─── Main Content Area ─── */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header
          className={`sticky top-0 z-40 h-16 border-b ${
            isDark ? 'bg-[#0B0F19]/80 border-slate-800/60' : 'bg-white/80 border-slate-200'
          } backdrop-blur-xl flex items-center justify-between px-6`}
        >
          {/* Hamburger Menu (Mobile) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-slate-400" />
          </button>

          {/* Page Title */}
          <div className="flex-1 text-center md:text-left md:ml-0">
            <h1 className={`text-lg font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              {navItems.find((item) => item.id === activePage)?.label || (activePage === 'settings' ? (lang === 'ar' ? 'الإعدادات' : 'Settings') : 'Dashboard')}
            </h1>
          </div>

          {/* User Info */}
          <div className={`hidden sm:flex items-center gap-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <span className="text-sm font-medium">{user.fullName}</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <span className="text-xs font-bold text-white">{user.fullName.charAt(0).toUpperCase()}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {activePage === 'athlete-dashboard' && <AthleteModule lang={lang} isDark={isDark} />}
          {activePage === 'calorie-tracker' && <CaloricTrackerModule lang={lang} isDark={isDark} />}
          {activePage === 'progress-analytics' && <ProgressAnalyticsModule lang={lang} isDark={isDark} />}
          {activePage === 'community' && <CommunityModule lang={lang} isDark={isDark} />}
          {activePage === 'settings' && (
            <SettingsPage lang={lang} theme={theme} onLangChange={setLang} onThemeChange={setTheme} isDark={isDark} />
          )}
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}
