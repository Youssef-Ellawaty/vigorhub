# VigorHub — Unified Architecture & Routing Guide

## 📋 Overview

This document describes the unified layout and routing structure for VigorHub. The app follows a **three-stage authentication flow** with a **sidebar-based navigation system** and a **dedicated settings page**.

---

## 🏗️ Architecture Stack

```
app/
├── page.tsx                          # Main entry point (Auth Gate)
├── layout.tsx                        # Root layout
└── api/                              # API routes (future)

components/
├── layouts/
│   └── DashboardLayout.tsx           # Main dashboard shell (sidebar + header)
├── pages/
│   └── SettingsPage.tsx              # Dedicated settings page
├── modules/
│   ├── AthleteModule.tsx             # Athlete Dashboard wrapper
│   ├── CaloricTrackerModule.tsx      # Calorie Tracker wrapper
│   ├── ProgressAnalyticsModule.tsx   # Progress Analytics wrapper
│   └── CommunityModule.tsx           # Community Hub wrapper
└── onboarding/
    └── OnboardingWizard.tsx          # Auth/Signup flow

[Feature Folders - Untouched]
├── athlete-dashboard/                # ✓ Your existing components
├── calorie-tracker/                  # ✓ Your existing components
├── progress-analytics/               # ✓ Your existing components
└── community/                        # ✓ Your existing components
```

---

## 🔐 Authentication Flow (3 Stages)

### **Stage 1: Entry Point Check**
**File:** `app/page.tsx`

```
START
  ↓
[Check localStorage / Auth Session]
  ↓
Is Authenticated? 
  ├─ NO  → Show OnboardingWizard
  │       (User fills out 4-step form)
  │       ↓
  │       [Save to Supabase]
  │       [Store in localStorage]
  │       ↓
  │       → Proceed to Stage 2
  │
  └─ YES → Proceed to Stage 2
```

### **Stage 2: Role Gate**
**File:** `app/page.tsx`

```
Check userRole:
  ├─ 'free_athlete' ✓ → Grant access
  ├─ 'premium_athlete' ✓ → Grant access
  ├─ 'coach' ✓ → Grant access
  └─ Other ✗ → Show "Access Denied"
  
  ↓ (if approved)
  
→ Proceed to Stage 3
```

### **Stage 3: Dashboard Render**
**File:** `components/layouts/DashboardLayout.tsx`

```
Show DashboardLayout with:
  • Sidebar (Desktop + Mobile)
  • Top Header (Hamburger + User Info)
  • Content Area (Dynamic module loading)
```

---

## 📱 Navigation Structure

### **Sidebar Navigation Items**
Located in `components/layouts/DashboardLayout.tsx`:

```typescript
const navItems: NavItem[] = [
  {
    id: 'athlete-dashboard',
    label: 'Athlete Dashboard',
    icon: <LayoutDashboard />,
    description: 'Workout Programs'
  },
  {
    id: 'calorie-tracker',
    label: 'Calorie Tracker',
    icon: <UtensilsCrossed />,
    description: 'Food & Water Logging'
  },
  {
    id: 'progress-analytics',
    label: 'Progress Analytics',
    icon: <TrendingUp />,
    description: 'Stats & Charts'
  },
  {
    id: 'community',
    label: 'Community',
    icon: <Users />,
    description: 'Social Network'
  }
]
```

### **Settings Link**
- Located at the **bottom of navigation menu**
- Separate button with **Settings icon** and **blue accent**
- Takes user to the dedicated Settings page

### **Hamburger Menu (Mobile)**
- **Icon:** 3-line hamburger icon
- **Position:** Top-left of header
- **Behavior:** Toggles sidebar visibility on mobile
- **Overlay:** Semi-transparent dark overlay when sidebar is open

---

## 🎨 Settings Page

**File:** `components/pages/SettingsPage.tsx`

The Settings page is **dedicated and clean**, containing only:

### **Language Setting**
- Icon: Globe 🌐
- Toggle: "عربي" / "EN"
- Current language display

### **Theme Setting**
- Icon: Sun/Moon ☀️/🌙
- Toggle: "Light" / "Dark"
- Current theme display

### **About Section**
- App name: VigorHub
- Version: 1.0.0
- Description

---

## 🔄 Module Wrappers

Each feature has a **wrapper component** that integrates your existing code:

### **1. AthleteModule** (`components/modules/AthleteModule.tsx`)
- Imports: `SplitExplorer`, `LiveSession`, `CustomSplitCreator`
- Props: `lang`, `isDark`
- State: Split selection, custom splits

### **2. CaloricTrackerModule** (`components/modules/CaloricTrackerModule.tsx`)
- Imports: `MacroDashboard`, `MealLogger`, `WaterTracker`, `AIChat`, `TDEECalculator`
- Props: `lang`, `isDark`
- State: Active tab, profile, meals, water

### **3. ProgressAnalyticsModule** (`components/modules/ProgressAnalyticsModule.tsx`)
- Imports: `DashboardHeader`, `ControlBar`, `StatsBar`, `WorkoutCharts`, `NutritionChart`
- Props: `lang`, `isDark`
- State: Filters, logs, loading

### **4. CommunityModule** (`components/modules/CommunityModule.tsx`)
- Imports: `VigorHub` (main community component)
- Props: `lang`, `isDark`

---

## 🎭 Global State Management

### **DashboardLayout State**
```typescript
const [sidebarOpen, setSidebarOpen] = useState(false)      // Mobile sidebar
const [activePage, setActivePage] = useState('athlete-dashboard')
const [lang, setLang] = useState<Language>('en')          // Global language
const [theme, setTheme] = useState<Theme>('dark')         // Global theme
```

### **app/page.tsx State**
```typescript
const [authState, setAuthState] = useState<AuthState>({
  isAuthenticated: boolean
  userRole: 'free_athlete' | 'coach' | 'premium_athlete' | null
  user: { id, username, fullName }
})
```

---

## 🎯 User Flows

### **New User Flow**
```
1. app/page.tsx → Redirect to OnboardingWizard
2. User completes 4-step form
3. OnboardingWizard.handleFinalSubmit() → 
   - Builds OnboardingPayload
   - Calls onOnboardingComplete callback
   - Main page receives payload → 
   - Creates auth state + saves to localStorage
   - Redirects to DashboardLayout
```

### **Returning User Flow**
```
1. app/page.tsx → Check localStorage for auth
2. If found → Load authState
3. Show DashboardLayout with saved preferences
```

### **Navigation Within Dashboard**
```
1. User clicks sidebar item → setActivePage(id)
2. DashboardLayout renders corresponding module
3. Module loads with current lang/theme
4. User interacts with feature (all state isolated within module)
```

### **Settings Navigation**
```
1. User clicks Settings button in sidebar → setActivePage('settings')
2. SettingsPage renders
3. User toggles language → onLangChange(lang) → state updates in DashboardLayout
4. All modules re-render with new language
5. User toggles theme → onThemeChange(theme) → state updates in DashboardLayout
6. All modules re-render with new theme
```

---

## 🌍 Internationalization (i18n)

- **Supported Languages:** English (`en`) and Arabic (`ar`)
- **Storage:** React state + localStorage
- **RTL Support:** Applied via `document.documentElement.dir`
- **Language Toggle:** In Settings page (removed from individual modules)

---

## 🎨 Theming

- **Supported Themes:** Dark (`dark`) and Light (`light`)
- **Storage:** React state + localStorage
- **Theme Toggle:** In Settings page (removed from individual modules)
- **CSS Classes:** `isDark` boolean controls Tailwind classes throughout
- **HTML Class:** Dark mode adds `dark` class to `<html>` element

---

## 📂 File Structure Summary

```
✓ KEPT (No Changes)
├── athlete-dashboard/**
├── auth-onboarding/** (minor: OnboardingWizard callback)
├── calorie-tracker/**
├── community/**
└── progress-analytics/**

✨ NEW (Created)
├── app/page.tsx                          # Auth entry point
├── components/layouts/DashboardLayout.tsx # Main shell
├── components/pages/SettingsPage.tsx      # Settings
├── components/modules/AthleteModule.tsx
├── components/modules/CaloricTrackerModule.tsx
├── components/modules/ProgressAnalyticsModule.tsx
├── components/modules/CommunityModule.tsx
└── VIGORHUB_ARCHITECTURE.md             # This file
```

---

## 🚀 Next Steps

### **To Implement with Real Auth (Supabase)**

1. **Update `app/page.tsx`:**
   ```typescript
   // Replace mock auth check with:
   const { data: { session } } = await supabase.auth.getSession()
   const { data: profile } = await supabase
     .from('profiles')
     .select('*')
     .eq('user_id', session.user.id)
   ```

2. **Update `OnboardingWizard.handleFinalSubmit()`:**
   ```typescript
   const { data, error } = await supabase.auth.signUp({
     email: payload.contact,
     password: payload.password
   })
   ```

3. **Update localStorage → database:**
   - Replace `localStorage.setItem('vigorhub_auth', ...)` with database saves
   - Update auth checks to query Supabase instead

4. **Add environment variables:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

---

## 🎬 Component Render Order

```
app/page.tsx (Main entry)
  ├─ Not Authenticated?
  │  └─ OnboardingWizard ✓
  │
  ├─ Authentication failed (stage 2 check)
  │  └─ "Access Denied" message
  │
  └─ Authenticated + Role approved?
     └─ DashboardLayout.tsx
        ├─ Header (sticky)
        │  ├─ Hamburger menu (mobile)
        │  ├─ Page title
        │  └─ User avatar
        │
        ├─ Sidebar (fixed)
        │  ├─ Logo + username
        │  ├─ Nav items (4 features)
        │  ├─ Settings button
        │  └─ Logout button
        │
        └─ Main content
           └─ One of:
              ├─ AthleteModule
              ├─ CaloricTrackerModule
              ├─ ProgressAnalyticsModule
              ├─ CommunityModule
              └─ SettingsPage
```

---

## ✅ Key Features Implemented

- ✓ **Auth Entry Point** - Three-stage gating
- ✓ **Sidebar Navigation** - Desktop + Mobile
- ✓ **Hamburger Menu** - Mobile-first toggle
- ✓ **Settings Page** - Dedicated, clean design
- ✓ **Language Toggle** - Moved to Settings
- ✓ **Theme Toggle** - Moved to Settings
- ✓ **Module Integration** - All 4 features wrapped
- ✓ **Global State** - Language + Theme shared across all modules
- ✓ **RTL Support** - Arabic language with proper direction
- ✓ **Responsive Design** - Mobile, tablet, desktop
- ✓ **Component Styles Preserved** - All original styling maintained

---

## 🔗 Integration Points

The original feature components remain **100% intact**. New files act as **bridge layers**:

```
New Bridge Layers:
  DashboardLayout.tsx
    └─ Manages: sidebar, header, page state, language, theme

Modules (Wrappers):
  AthleteModule.tsx → imports SplitExplorer, LiveSession, CustomSplitCreator
  CaloricTrackerModule.tsx → imports MacroDashboard, MealLogger, etc.
  ProgressAnalyticsModule.tsx → imports DashboardHeader, ControlBar, etc.
  CommunityModule.tsx → imports VigorHub

Your Original Components:
  ✓ Fully preserved
  ✓ Styling unchanged
  ✓ Logic unchanged
  ✓ Receive lang/isDark props
```

---

## 📞 Support

For questions about this architecture:
1. Check the flow diagrams above
2. Review `app/page.tsx` for auth logic
3. Review `DashboardLayout.tsx` for sidebar + navigation
4. Check individual module files for feature integration
