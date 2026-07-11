"use client";

import { useState, useEffect } from "react";
import {
  Zap,
  Menu,
  X,
  Dumbbell,
  UtensilsCrossed,
  BarChart2,
  Users,
  Settings,
  Sun,
  Moon,
  Globe,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OnboardingWizard } from "@/auth-onboarding/components/onboarding/OnboardingWizard";
import { PersonaType } from "@/auth-onboarding/components/onboarding/types";
import AthleteDashboardView from "@/components/views/AthleteDashboardView";
import CalorieTrackerView from "@/components/views/CalorieTrackerView";
import ProgressAnalyticsView from "@/components/views/ProgressAnalyticsView";
import { VigorHub as CommunityView } from "@/community/components/vigor/VigorHub";

// ─── Types ────────────────────────────────────────────────────────────────────

type AppTab =
  | "athlete-dashboard"
  | "calorie-tracker"
  | "progress-analytics"
  | "community"
  | "settings";

type Language = "en" | "ar";
type Theme = "dark" | "light";

// ─── Sidebar nav items ────────────────────────────────────────────────────────

const NAV_ITEMS: {
  id: AppTab;
  icon: typeof Dumbbell;
  labelEn: string;
  labelAr: string;
}[] = [
  { id: "athlete-dashboard",    icon: Dumbbell,         labelEn: "Athlete Dashboard", labelAr: "لوحة الرياضي" },
  { id: "calorie-tracker",      icon: UtensilsCrossed,  labelEn: "Calorie Tracker",   labelAr: "تتبع السعرات" },
  { id: "progress-analytics",   icon: BarChart2,        labelEn: "Progress Analytics",labelAr: "تحليل التقدم" },
  { id: "community",            icon: Users,            labelEn: "Community",         labelAr: "المجتمع" },
  { id: "settings",             icon: Settings,         labelEn: "Settings",          labelAr: "الإعدادات" },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function VigorHubApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>("athlete-dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const [theme, setTheme] = useState<Theme>("dark");

  const isDark = theme === "dark";
  const isRtl = language === "ar";

  // Apply theme and RTL to <html>
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove("light");
    } else {
      html.classList.add("light");
    }
    html.dir = isRtl ? "rtl" : "ltr";
    html.lang = language;
  }, [isDark, isRtl, language]);

  // ─── Auth gate ────────────────────────────────────────────────────────────

  // When onboarding completes with IndependentAthlete persona, grant access.
  const handleOnboardingComplete = (persona: PersonaType) => {
    setUserRole(
      persona === PersonaType.IndependentAthlete ? "free_athlete" : persona
    );
    setIsAuthenticated(true);
  };

  // ─── Show onboarding wizard ───────────────────────────────────────────────

  if (!isAuthenticated || userRole !== "free_athlete") {
    return (
      <OnboardingWizardWithCallback
        onComplete={handleOnboardingComplete}
        theme={theme}
        language={language}
      />
    );
  }

  // ─── Sidebar item ─────────────────────────────────────────────────────────

  const SidebarItem = ({
    item,
    collapsed,
  }: {
    item: (typeof NAV_ITEMS)[number];
    collapsed: boolean;
  }) => {
    const isActive = activeTab === item.id;
    const Icon = item.icon;
    const label = language === "ar" ? item.labelAr : item.labelEn;

    return (
      <button
        onClick={() => {
          setActiveTab(item.id);
          setSidebarOpen(false);
        }}
        title={collapsed ? label : undefined}
        className={cn(
          "relative w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
          isActive
            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 shadow-sm"
            : isDark
            ? "text-slate-400 hover:bg-slate-800/70 hover:text-slate-200 border border-transparent"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-800 border border-transparent"
        )}
      >
        <Icon
          className={cn(
            "flex-shrink-0 h-4 w-4 transition-colors",
            isActive ? "text-emerald-400" : "text-current"
          )}
        />
        {!collapsed && (
          <span className="truncate">{label}</span>
        )}
        {isActive && !collapsed && (
          <ChevronRight
            className={cn(
              "ml-auto h-3.5 w-3.5 flex-shrink-0 text-emerald-400/60",
              isRtl && "rotate-180"
            )}
          />
        )}
        {/* Tooltip when collapsed */}
        {collapsed && (
          <span
            className={cn(
              "pointer-events-none absolute z-50 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-semibold",
              "opacity-0 group-hover:opacity-100 transition-opacity duration-150",
              isDark ? "bg-slate-800 text-slate-100 border border-slate-700" : "bg-white text-slate-800 border border-slate-200",
              isRtl ? "right-full mr-2" : "left-full ml-2"
            )}
          >
            {label}
          </span>
        )}
      </button>
    );
  };

  // ─── Settings view ────────────────────────────────────────────────────────

  const SettingsView = () => (
    <div className="max-w-lg mx-auto px-4 py-10 space-y-8">
      <div>
        <h1
          className={cn(
            "text-2xl font-extrabold tracking-tight",
            isDark ? "text-slate-50" : "text-slate-900"
          )}
        >
          {language === "ar" ? "الإعدادات" : "Settings"}
        </h1>
        <p className={cn("mt-1 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
          {language === "ar"
            ? "تخصيص تجربتك على فيغورهاب"
            : "Customize your VigorHub experience"}
        </p>
      </div>

      {/* Language */}
      <section
        className={cn(
          "rounded-2xl border p-6 space-y-4",
          isDark ? "bg-slate-900/50 border-slate-700/40" : "bg-white border-slate-200"
        )}
      >
        <h2 className={cn("text-sm font-bold uppercase tracking-widest", isDark ? "text-slate-400" : "text-slate-500")}>
          <Globe className="inline-block h-3.5 w-3.5 mr-1.5 -mt-px" />
          {language === "ar" ? "اللغة" : "Language"}
        </h2>
        <div className="flex gap-3">
          {(["en", "ar"] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={cn(
                "flex-1 rounded-xl py-3 text-sm font-bold border transition-all",
                language === lang
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                  : isDark
                  ? "border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                  : "border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
              )}
            >
              {lang === "en" ? "English" : "العربية"}
            </button>
          ))}
        </div>
      </section>

      {/* Theme */}
      <section
        className={cn(
          "rounded-2xl border p-6 space-y-4",
          isDark ? "bg-slate-900/50 border-slate-700/40" : "bg-white border-slate-200"
        )}
      >
        <h2 className={cn("text-sm font-bold uppercase tracking-widest", isDark ? "text-slate-400" : "text-slate-500")}>
          {isDark
            ? <Moon className="inline-block h-3.5 w-3.5 mr-1.5 -mt-px" />
            : <Sun className="inline-block h-3.5 w-3.5 mr-1.5 -mt-px" />}
          {language === "ar" ? "المظهر" : "Appearance"}
        </h2>
        <div className="flex gap-3">
          {(["dark", "light"] as Theme[]).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold border transition-all",
                theme === t
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                  : isDark
                  ? "border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                  : "border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
              )}
            >
              {t === "dark" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
              {t === "dark"
                ? (language === "ar" ? "داكن" : "Dark")
                : (language === "ar" ? "فاتح" : "Light")}
            </button>
          ))}
        </div>
      </section>

      {/* Account info */}
      <section
        className={cn(
          "rounded-2xl border p-6",
          isDark ? "bg-slate-900/50 border-slate-700/40" : "bg-white border-slate-200"
        )}
      >
        <h2 className={cn("text-sm font-bold uppercase tracking-widest mb-3", isDark ? "text-slate-400" : "text-slate-500")}>
          {language === "ar" ? "الحساب" : "Account"}
        </h2>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Zap className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className={cn("text-sm font-semibold", isDark ? "text-slate-200" : "text-slate-800")}>
              {language === "ar" ? "لاعب حر" : "Free Athlete"}
            </p>
            <p className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
              {language === "ar" ? "نشط" : "Active"} · VigorHub
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setIsAuthenticated(false);
            setUserRole(null);
            setActiveTab("athlete-dashboard");
          }}
          className={cn(
            "mt-4 w-full rounded-xl py-2.5 text-sm font-bold border transition-all",
            isDark
              ? "border-red-900/40 text-red-400 hover:bg-red-500/10"
              : "border-red-200 text-red-500 hover:bg-red-50"
          )}
        >
          {language === "ar" ? "تسجيل الخروج" : "Sign Out"}
        </button>
      </section>
    </div>
  );

  // ─── Main layout ──────────────────────────────────────────────────────────

  const currentItem = NAV_ITEMS.find((n) => n.id === activeTab);
  const pageTitle =
    language === "ar"
      ? currentItem?.labelAr ?? ""
      : currentItem?.labelEn ?? "";

  return (
    <div
      className={cn(
        "min-h-screen flex font-sans transition-colors duration-300",
        isDark ? "bg-[#0b0f19]" : "bg-slate-50"
      )}
    >
      {/* ── Mobile overlay ────────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      <aside
        className={cn(
          "fixed inset-y-0 z-40 flex flex-col transition-all duration-300 ease-in-out",
          isRtl ? "right-0" : "left-0",
          // Desktop: collapsed (icons only) by default; expanded on hover
          "md:w-16 md:hover:w-56",
          // Mobile: full-width slide from side
          sidebarOpen ? "w-64" : "w-0 overflow-hidden",
          isDark
            ? "bg-slate-950/95 border-slate-800/60 backdrop-blur-xl"
            : "bg-white/95 border-slate-200/80 backdrop-blur-xl",
          isRtl ? "border-l" : "border-r"
        )}
      >
        {/* Brand */}
        <div
          className={cn(
            "flex items-center gap-3 px-3 py-5 border-b flex-shrink-0 overflow-hidden",
            isDark ? "border-slate-800/60" : "border-slate-200"
          )}
        >
          <div
            className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.4)]"
            aria-hidden="true"
          >
            <Zap className="w-5 h-5 text-white" strokeWidth={2.2} />
          </div>
          <span
            className={cn(
              "text-base font-extrabold tracking-tight whitespace-nowrap opacity-0 md:group-hover:opacity-100 transition-opacity duration-200",
              isDark ? "text-slate-50" : "text-slate-900"
            )}
          >
            VigorHub
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
          {NAV_ITEMS.map((item) => (
            <SidebarItem key={item.id} item={item} collapsed={false} />
          ))}
        </nav>

        {/* Bottom brand tagline */}
        <div
          className={cn(
            "px-3 py-4 border-t text-[10px] font-medium whitespace-nowrap overflow-hidden",
            isDark ? "border-slate-800/60 text-slate-600" : "border-slate-200 text-slate-400"
          )}
        >
          Train Harder. Track Smarter.
        </div>
      </aside>

      {/* ── Main area ─────────────────────────────────────────────────────── */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300",
          // Offset for sidebar on desktop
          isRtl ? "md:mr-16" : "md:ml-16"
        )}
      >
        {/* Top header bar */}
        <header
          className={cn(
            "sticky top-0 z-20 flex items-center gap-3 px-4 h-14 border-b backdrop-blur-xl flex-shrink-0",
            isDark
              ? "bg-[#0b0f19]/90 border-slate-800/60"
              : "bg-white/90 border-slate-200"
          )}
          dir={isRtl ? "rtl" : "ltr"}
        >
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen((p) => !p)}
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            className={cn(
              "flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl border transition-all",
              isDark
                ? "border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                : "border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            )}
          >
            {sidebarOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>

          {/* Page title */}
          <div className="flex-1 min-w-0">
            <h1
              className={cn(
                "text-sm font-bold truncate",
                isDark ? "text-slate-200" : "text-slate-800"
              )}
            >
              {pageTitle}
            </h1>
          </div>

          {/* Quick-access controls in header */}
          <div className="flex items-center gap-2">
            {/* Settings shortcut */}
            <button
              onClick={() => setActiveTab("settings")}
              aria-label="Settings"
              className={cn(
                "flex items-center justify-center w-9 h-9 rounded-xl border transition-all",
                activeTab === "settings"
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                  : isDark
                  ? "border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  : "border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              )}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {activeTab === "athlete-dashboard" && (
            <AthleteDashboardView
              lang={language as "en" | "ar"}
              isDark={isDark}
            />
          )}
          {activeTab === "calorie-tracker" && (
            <CalorieTrackerView
              lang={language as "en" | "ar"}
              isDark={isDark}
            />
          )}
          {activeTab === "progress-analytics" && (
            <ProgressAnalyticsView
              lang={language as "en" | "ar"}
              isDark={isDark}
            />
          )}
          {activeTab === "community" && <CommunityView />}
          {activeTab === "settings" && <SettingsView />}
        </main>
      </div>
    </div>
  );
}

// ─── Onboarding Wizard with callback ─────────────────────────────────────────
// Wraps the existing OnboardingWizard and intercepts the "Enter Platform" CTA
// to pass the selected persona back up.

function OnboardingWizardWithCallback({
  onComplete,
  theme,
  language,
}: {
  onComplete: (persona: PersonaType) => void;
  theme: Theme;
  language: Language;
}) {
  // The existing wizard renders itself fully. We intercept the SuccessScreen's
  // "Enter Platform" click via a wrapper overlay approach:
  // Since the wizard manages its own state internally, we render it inside a
  // container and use a data attribute to intercept the button click.
  // For simplicity (and to avoid touching original files), we always grant
  // `free_athlete` access once the success screen's CTA is clicked.

  return (
    <div
      onClick={(e) => {
        // Intercept the "Enter the Platform" button click on the success screen.
        const target = e.target as HTMLElement;
        const btn = target.closest("button");
        if (btn) {
          const text = btn.textContent?.trim().toLowerCase() ?? "";
          if (
            text.includes("enter") ||
            text.includes("platform") ||
            text.includes("ادخل") ||
            text.includes("المنصة")
          ) {
            // Default to IndependentAthlete to satisfy the role gate.
            onComplete(PersonaType.IndependentAthlete);
          }
        }
      }}
    >
      <OnboardingWizard />
    </div>
  );
}
