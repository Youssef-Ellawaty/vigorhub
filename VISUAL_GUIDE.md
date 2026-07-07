# VigorHub — Visual User Journey & Component Maps

## 🎬 User Journey Flowchart

```
                          START
                           │
                           ▼
                    ┌─────────────────┐
                    │  User Opens     │
                    │  vigorhub.com   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────────────┐
                    │  app/page.tsx Check:    │
                    │  Is localStorage auth? │
                    └────────┬────────────────┘
                             │
                  ┌──────────┴──────────┐
                  │ NO                  │ YES
                  ▼                     ▼
          ┌───────────────┐    ┌──────────────────┐
          │  OnBoarding   │    │  Role Check?     │
          │  Wizard Page  │    │  free_athlete?   │
          └───────┬───────┘    └────┬─────────┬───┘
                  │               YES│       NO│
            ┌─────┴─────┐            │         │
            │  4 Steps: │    ┌───────▼──┐  ┌──▼──────────┐
            │ 1. Login  │    │Dashboard │  │"Access      │
            │ 2. Bio    │    │Layout    │  │ Denied"     │
            │ 3. Persona│    │Loaded ✓  │  │ Message     │
            │ 4. Goal   │    └───────┬──┘  └─────────────┘
            └─────┬─────┘            │
                  │            [Sidebar Nav]
            ┌─────▼──────┐           │
            │Submit Form │     ┌─────┴─────────────┐
            │to Supabase │     │ ┌───────────────┐ │
            │(mock)      │     │ │ ✓ Athlete     │ │
            └─────┬──────┘     │ │ ✓ Calorie     │ │
                  │            │ │ ✓ Progress    │ │
            ┌─────▼──────┐     │ │ ✓ Community   │ │
            │Save to     │     │ │ ⚙ Settings    │ │
            │localStorage│     │ │ 🚪 Logout     │ │
            └─────┬──────┘     │ └───────────────┘ │
                  │            └───────────────────┘
            ┌─────▼──────┐
            │"Platform   │◄─── Click any item
            │Created ✓"  │     loads that module
            │            │
            │[Enter →]   │
            └─────┬──────┘
                  │
                  ▼
          ✅ DASHBOARD READY
```

---

## 🏠 Dashboard Layout (Desktop)

```
┌──────────────────────────────────────────────────────────────────────┐
│                         TOP HEADER (Sticky)                          │
│ [≡ Logo]                                                   [👤 Name] │
│ (Hidden on desktop)                                                  │
├─────────────────────────────┬──────────────────────────────────────┤
│                             │                                       │
│        SIDEBAR              │          MAIN CONTENT AREA           │
│     (Fixed, 256px)          │          (Dynamic Module)            │
│                             │                                       │
│ VigorHub                    │  ┌────────────────────────────────┐  │
│ @username                   │  │  Module Component             │  │
│                             │  │  (AthleteModule, etc.)        │  │
│ ┌──────────────────────┐    │  │                               │  │
│ │ 🏃 Athlete Dashboard │    │  │                               │  │
│ │ (Active - emerald)   │    │  │                               │  │
│ └──────────────────────┘    │  │                               │  │
│                             │  │                               │  │
│ ┌──────────────────────┐    │  │                               │  │
│ │ 🥗 Calorie Tracker   │    │  │                               │  │
│ │ Food & Water Logging │    │  │                               │  │
│ └──────────────────────┘    │  │                               │  │
│                             │  │                               │  │
│ ┌──────────────────────┐    │  │                               │  │
│ │ 📈 Progress Analytics│    │  │                               │  │
│ │ Stats & Charts       │    │  │                               │  │
│ └──────────────────────┘    │  │                               │  │
│                             │  │                               │  │
│ ┌──────────────────────┐    │  │                               │  │
│ │ 👥 Community         │    │  │                               │  │
│ │ Social Network       │    │  │                               │  │
│ └──────────────────────┘    │  └────────────────────────────────┘  │
│                             │                                       │
│ ─────────────────────────   │                                       │
│                             │                                       │
│ ┌──────────────────────┐    │                                       │
│ │ ⚙ Settings (blue)    │    │                                       │
│ │ Language & Theme     │    │                                       │
│ └──────────────────────┘    │                                       │
│                             │                                       │
│ ┌──────────────────────┐    │                                       │
│ │ 🚪 Logout            │    │                                       │
│ │ (red hover)          │    │                                       │
│ └──────────────────────┘    │                                       │
│                             │                                       │
└─────────────────────────────┴──────────────────────────────────────┘
```

---

## 📱 Dashboard Layout (Mobile)

```
┌────────────────────────┐
│ [≡] Page Title    [👤] │  ← Header (Sticky)
├────────────────────────┤
│                        │
│   Main Content         │  ← Full width on mobile
│   (Dynamic Module)     │
│                        │
│                        │
│                        │
│                        │
│                        │
│                        │
└────────────────────────┘

[When hamburger clicked]

┌────────────────────────────────────────┐
│ [✕] Logout                         [👤]│  ← Header
├────────────────────────────────────────┤
│ ┌──────────────────────────────────┐  │
│ │ SIDEBAR OVERLAY                  │  │  ← Slides from left
│ │                                  │  │
│ │ VigorHub                         │  │
│ │ @username                        │  │
│ │                                  │  │
│ │ 🏃 Athlete Dashboard ────────┐   │  │
│ │ 🥗 Calorie Tracker           │   │  │
│ │ 📈 Progress Analytics        │   │  │
│ │ 👥 Community                 │   │  │
│ │ ⚙ Settings                   │   │  │
│ │ 🚪 Logout                    │   │  │
│ │                              │   │  │
│ └──────────────────────────────┘   │  │
│                                      │  │
└──────────────────────────────────────┘  │
      │ Semi-transparent overlay
      └─ Click to close sidebar
```

---

## ⚙️ Settings Page Layout

```
┌──────────────────────────────────────┐
│            SETTINGS PAGE             │
├──────────────────────────────────────┤
│                                      │
│ Heading                              │
│ "Settings"                           │
│ "Customize your app experience"      │
│                                      │
├──────────────────────────────────────┤
│                                      │
│ ┌────────────────────────────────┐  │
│ │ 🌐  LANGUAGE                   │  │
│ │ ┌──────────────────┐           │  │
│ │ │ Choose language  │ [EN/عربي] │  │
│ │ │ Current: English │ [Toggle]  │  │
│ │ └──────────────────┘           │  │
│ └────────────────────────────────┘  │
│                                      │
│ ┌────────────────────────────────┐  │
│ │ ☀️  THEME                       │  │
│ │ ┌──────────────────┐           │  │
│ │ │ Dark / Light     │ [Dark]    │  │
│ │ │ Current: Dark    │ [Toggle]  │  │
│ │ └──────────────────┘           │  │
│ │ ┌─ Progress bar ─────────────┐ │  │
│ │ └──────────────────────────────┘ │
│ └────────────────────────────────────┘
│                                      │
│ ┌────────────────────────────────┐  │
│ │ ℹ ABOUT                         │  │
│ │ • Name: VigorHub               │  │
│ │ • Version: 1.0.0               │  │
│ │ • Desc: Comprehensive platform │  │
│ │         for fitness tracking   │  │
│ └────────────────────────────────┘  │
│                                      │
└──────────────────────────────────────┘
```

---

## 🔗 Navigation State Machine

```
                    START
                     │
                     ▼
          [athlete-dashboard]◄───┐
                │ │               │
        Click ──┘ └─ Auto-select  │
                     │            │
              ┌──────┴──────┬─────┴──────┬──────────┐
              ▼             ▼            ▼          ▼
        [calorie]    [progress]   [community]  [settings]
              │             │            │          │
              └─────────────┴────────────┴──────────┘
                     │
                [Logo Clicked]
                     │
                (Stay on current page
                 or return to dashboard)
```

---

## 🎨 Color System

### Dark Mode
```
┌────────────────────────────────────┐
│ Background: #0B0F19 (Darkest)      │
│                                    │
│ Primary Text: #E2E8F0 (Light)      │
│ Secondary Text: #94A3B8 (Gray)     │
│                                    │
│ Accent 1: #10B981 (Emerald)        │
│ Accent 2: #06B6D4 (Cyan)           │
│                                    │
│ Card BG: #0F172A (Slightly lighter)│
│ Border: #1E293B (Subtle)           │
│                                    │
│ Sidebar Active: Emerald 10% bg     │
│ Settings Active: Blue 10% bg       │
└────────────────────────────────────┘
```

### Light Mode
```
┌────────────────────────────────────┐
│ Background: #F8FAFC (Light)        │
│                                    │
│ Primary Text: #0F172A (Dark)       │
│ Secondary Text: #475569 (Gray)     │
│                                    │
│ Accent 1: #10B981 (Emerald)        │
│ Accent 2: #06B6D4 (Cyan)           │
│                                    │
│ Card BG: #FFFFFF (White)           │
│ Border: #E2E8F0 (Subtle)           │
│                                    │
│ Sidebar Active: Emerald 50 bg      │
│ Settings Active: Blue 50 bg        │
└────────────────────────────────────┘
```

---

## 📊 State Diagram (Sidebar State)

```
┌──────────────────────────────────────────────────────┐
│              SIDEBAR VISIBILITY STATE                │
└──────────────────────────────────────────────────────┘

DESKTOP (≥768px):
    ┌─────────────────────┐
    │ Sidebar always      │
    │ visible & fixed     │
    │ width: 16rem        │
    └─────────────────────┘

MOBILE (<768px):
    ┌─────────────────────────┐
    │ sidebarOpen = false     │
    │ ↓ [Hamburger Clicked]   │
    │ sidebarOpen = true      │
    │ (Sidebar slides in)     │
    │ ↓ [Item Clicked]        │
    │ sidebarOpen = false     │
    │ (Sidebar slides out)    │
    └─────────────────────────┘
```

---

## 🔐 Authentication State Diagram

```
┌────────────────────────────────────────────┐
│          AUTHENTICATION STATE               │
└────────────────────────────────────────────┘

Cycle 1: New User

  app/page.tsx
      ↓
  localStorage.getItem('vigorhub_auth')
      ↓ (Not found)
  isAuthenticated = false
      ↓
  <OnboardingWizard />
      ↓
  User fills form + submit
      ↓
  onOnboardingComplete(payload)
      ↓
  Create authState {
    isAuthenticated: true
    userRole: 'free_athlete'
    user: { id, username, fullName }
  }
      ↓
  localStorage.setItem('vigorhub_auth', authState)
      ↓
  <DashboardLayout />
      ↓
  USER IN APP ✓


Cycle 2: Returning User

  app/page.tsx
      ↓
  localStorage.getItem('vigorhub_auth')
      ↓ (Found)
  authState = JSON.parse(stored)
      ↓
  isAuthenticated = true
      ↓
  Role check: 'free_athlete' ✓
      ↓
  <DashboardLayout />
      ↓
  USER IN APP ✓


Cycle 3: Logout

  User clicks logout
      ↓
  onLogout() called
      ↓
  Clear authState
      ↓
  localStorage.removeItem('vigorhub_auth')
      ↓
  isAuthenticated = false
      ↓
  <OnboardingWizard />
      ↓
  (Back to Cycle 1)
```

---

## 📱 Responsive Breakpoints

```
┌────────────────────────────────────────────────────────┐
│            TAILWIND BREAKPOINTS                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│ Mobile        sm:       md:        lg:        xl:      │
│ <640px       640px     768px      1024px     1280px    │
│                                                        │
│ [xs] Mobile ─────────────────── [sm] Tablet          │
│                                                        │
│                         [md] Desktop ─────────────    │
│                                    [lg][xl] Large     │
│                                                        │
├────────────────────────────────────────────────────────┤
│ Hamburger visibility                                   │
│ • Visible: <md (mobile & tablet)                      │
│ • Hidden: ≥md (desktop)                               │
│                                                        │
│ Sidebar visibility                                     │
│ • Mobile: Hidden, shown via hamburger toggle          │
│ • Desktop: Always visible, fixed position             │
│                                                        │
│ Header adjustments                                     │
│ • Mobile: Compact, full-width content area           │
│ • Desktop: Standard, with sidebar beside content      │
└────────────────────────────────────────────────────────┘
```

---

## 🌍 Language Toggle Flow

```
┌─────────────────────────────────────────────┐
│      LANGUAGE STATE & PROPAGATION           │
└─────────────────────────────────────────────┘

Initial State:
  lang = 'en'
      ↓
Settings Page: User clicks "عربي" button
      ↓
onLangChange('ar') called
      ↓
DashboardLayout: setState({ lang: 'ar' })
      ↓
document.documentElement.lang = 'ar'
document.documentElement.dir = 'rtl'
      ↓
Re-render with new lang passed to all modules:
  • AthleteModule receives lang='ar'
  • CaloricTrackerModule receives lang='ar'
  • ProgressAnalyticsModule receives lang='ar'
  • CommunityModule receives lang='ar'
      ↓
All components update text via translations
      ↓
All icons flip for RTL (flex-row-reverse)
      ↓
Layout adjusts (sidebars become right-aligned, etc)
      ↓
localStorage auto-saves (future Supabase)
      ↓
✓ ENTIRE APP NOW IN ARABIC
```

---

## 🎭 Theme Toggle Flow

```
┌─────────────────────────────────────────────┐
│       THEME STATE & PROPAGATION             │
└─────────────────────────────────────────────┘

Initial State:
  theme = 'dark'
  isDark = true
      ↓
Settings Page: User clicks "Light" button
      ↓
onThemeChange('light') called
      ↓
DashboardLayout: setState({ theme: 'light' })
      ↓
isDark = false
      ↓
document.documentElement.classList.remove('dark')
      ↓
Re-render with isDark=false passed to all modules:
  • Tailwind classes switch:
    - bg-[#0B0F19] → bg-slate-50
    - text-slate-200 → text-slate-900
    - border-slate-800 → border-slate-200
      ↓
All components apply light-mode colors
      ↓
localStorage auto-saves (future Supabase)
      ↓
✓ ENTIRE APP NOW IN LIGHT MODE
```

---

## 🗂️ File Organization Tree

```
project/
│
├── app/
│   └── page.tsx ........................ Auth entry & role gate
│
├── components/
│   ├── layouts/
│   │   └── DashboardLayout.tsx ........ Main dashboard shell
│   │
│   ├── pages/
│   │   └── SettingsPage.tsx ........... Settings (lang/theme)
│   │
│   ├── modules/
│   │   ├── AthleteModule.tsx ......... Athlete wrapper
│   │   ├── CaloricTrackerModule.tsx .. Calorie wrapper
│   │   ├── ProgressAnalyticsModule.tsx Progress wrapper
│   │   └── CommunityModule.tsx ....... Community wrapper
│   │
│   └── onboarding/
│       └── OnboardingWizard.tsx ...... Auth form (modified)
│
├── athlete-dashboard/ ................. ✓ UNCHANGED
│   ├── components/
│   ├── lib/
│   └── app/
│
├── calorie-tracker/ ................... ✓ UNCHANGED
│   ├── components/
│   ├── lib/
│   └── app/
│
├── progress-analytics/ ................ ✓ UNCHANGED
│   ├── components/
│   ├── lib/
│   └── app/
│
└── community/ ......................... ✓ UNCHANGED
    ├── components/
    ├── lib/
    └── app/
```

---

## ✨ Quick Visual Reference

### Sidebar Button States

```
┌─────────────────────────────────────────────┐
│           BUTTON STATES                     │
├─────────────────────────────────────────────┤
│                                             │
│ Inactive (Gray):                           │
│ ┌──────────────────────────────────────┐  │
│ │ Icon    Label                        │  │
│ │ Description text                     │  │
│ └──────────────────────────────────────┘  │
│                                             │
│ Active (Emerald - green accent):           │
│ ┌──────────────────────────────────────┐  │
│ │ Icon    Label ◄─ Green              │  │
│ │ Description text ◄─ Green           │  │
│ │ Background: emerald/10              │  │
│ └──────────────────────────────────────┘  │
│                                             │
│ Settings Button (Blue accent):             │
│ ┌──────────────────────────────────────┐  │
│ │ ⚙ Settings                          │  │
│ │ Language & Theme                     │  │
│ │ Background: blue/10 when active      │  │
│ └──────────────────────────────────────┘  │
│                                             │
│ Logout Button (Red on hover):              │
│ ┌──────────────────────────────────────┐  │
│ │ 🚪 Logout                           │  │
│ │ On hover: Red background/text       │  │
│ └──────────────────────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🎬 Transition Animation

```
When switching modules:

1. Sidebar item clicked
2. activePage state updates (e.g., 'athlete-dashboard' → 'calorie-tracker')
3. React re-renders
4. Old module component unmounts
5. New module component mounts
6. Page title in header updates
7. Content area shows new module

Animation timing:
├─ Instant state update
├─ React reconciliation: ~16ms
├─ DOM mount/unmount: ~0ms (instant)
└─ Visual render: ~60fps (smooth)

Result: Instant navigation (no transition delay)
```

---

## 📌 Key Measurements

```
┌──────────────────────────────────────────────────────┐
│          COMPONENT DIMENSIONS                        │
├──────────────────────────────────────────────────────┤
│                                                      │
│ Sidebar width (desktop):    16rem (256px)           │
│ Sidebar width (mobile):     16rem (256px)           │
│ Header height:              4rem (64px)             │
│                                                      │
│ Mobile breakpoint:          768px (md:)             │
│ Desktop breakpoint:         1024px (lg:)            │
│                                                      │
│ Max content width:          1280px (5xl:)           │
│ Content padding:            1rem / 1.5rem / 2rem    │
│                                                      │
│ Border radius:                                       │
│ • Small (buttons):         0.5rem (rounded-lg)      │
│ • Medium (cards):          0.75rem (rounded-xl)     │
│ • Large (panels):          1rem (rounded-2xl)       │
│                                                      │
│ Spacing scale:                                       │
│ • xs: 0.25rem  (1px)                                │
│ • sm: 0.5rem   (2px)                                │
│ • md: 1rem     (4px)                                │
│ • lg: 1.5rem   (6px)                                │
│ • xl: 2rem     (8px)                                │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

**End of Visual Guide** 🎨

Use this as a reference for understanding the UI layout and flow!
