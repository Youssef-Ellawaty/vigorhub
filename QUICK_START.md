# VigorHub — Quick Start Guide

## 🚀 Get Started in 60 Seconds

### 1. Start the dev server
```bash
npm run dev
# or
pnpm dev
```

### 2. Open browser
```
http://localhost:3000
```

### 3. You'll see
**OnboardingWizard** (first-time setup)

### 4. Complete the form
- Step 1: Name, username, email, password
- Step 2: Gender, age, height, weight
- Step 3: Choose persona (Independent Athlete)
- Step 4: Select goal (e.g., Muscle Gain)
- Success screen → Click "Enter Platform"

### 5. You're in the dashboard!
- Sidebar on left (desktop) / hamburger (mobile)
- 4 navigation items
- Settings button at bottom
- Click any item to explore

---

## 🗺️ Navigation Map

```
┌─────────────────────────────────────────────────────────┐
│                    VigorHub Dashboard                    │
├──────────────────┬──────────────────────────────────────┤
│                  │                                       │
│  SIDEBAR         │         MAIN CONTENT                 │
│                  │                                       │
│  • Athlete       │  ► Athlete Dashboard                 │
│    Dashboard     │    (Workout splits, live sessions)   │
│                  │                                       │
│  • Calorie       │  ► Calorie Tracker                   │
│    Tracker       │    (Meals, macros, water, AI chat)   │
│                  │                                       │
│  • Progress      │  ► Progress Analytics                │
│    Analytics     │    (Charts, stats, trends)           │
│                  │                                       │
│  • Community     │  ► Community Hub                      │
│                  │    (Feed, leaderboard, messages)     │
│                  │                                       │
│  ---             │                                       │
│  • Settings      │  ► Settings Page                     │
│    (⚙️)          │    └─ Language (EN/AR)               │
│                  │    └─ Theme (Dark/Light)             │
│                  │    └─ About                          │
│                  │                                       │
│  • Logout        │                                       │
│    (🚪)          │                                       │
│                  │                                       │
└──────────────────┴──────────────────────────────────────┘

[Hamburger ≡]  VigorHub                    [User Avatar]
(Mobile only)   (Page Title)                (Desktop)
```

---

## 📱 Mobile View

```
┌─────────────────────────┐
│ ≡  Page Title    👤    │  ← Top Header
├─────────────────────────┤
│                         │
│   Main Content          │
│   (Full width)          │
│                         │
│                         │
│                         │
├─────────────────────────┤
│ [🏠] [🥗] [📈] [👥]   │  ← Bottom nav (alternate design)
└─────────────────────────┘

OR (Hamburger + Sidebar):

┌─────────────────────────┐
│ ≡  Page Title    👤    │
├─────────────────────────┤
│ [SIDEBAR OVERLAY]      │  ← When hamburger clicked
│ • Dashboard            │
│ • Calorie Tracker      │
│ • Progress Analytics   │
│ • Community            │
│ • Settings             │
│ • Logout               │
└─────────────────────────┘
```

---

## 🎮 Interactive Elements

### Hamburger Menu (Mobile)
- **Location:** Top-left corner
- **Icon:** 3 horizontal lines
- **Action:** Tap to open sidebar
- **Closes:** Click item or tap overlay

### Sidebar Navigation
- **Highlight:** Active item has emerald background
- **Icon + Label:** Each item has descriptive text
- **Settings:** Blue button at bottom
- **Logout:** Red-tinted button

### Settings Page
- **Language Toggle:** "عربي" ↔ "EN"
- **Theme Toggle:** "Dark" ↔ "Light"
- **Instant Apply:** Changes reflect immediately

### Top Header
- **Mobile:** Shows hamburger + title + avatar
- **Desktop:** Shows title + avatar only
- **Sticky:** Stays at top when scrolling

---

## 🎯 Common Tasks

### Change Language
1. Click **Settings** in sidebar
2. Click **Language button**
3. Page refreshes in new language (EN ↔ AR)

### Switch Theme
1. Click **Settings** in sidebar
2. Click **Theme button**
3. Colors change instantly (Dark ↔ Light)

### Log Out
1. Click **Logout** button in sidebar
2. Returns to OnboardingWizard
3. LocalStorage cleared

### Access Different Features
1. Click feature name in sidebar
   - **Athlete Dashboard** → Workout splits
   - **Calorie Tracker** → Nutrition tracking
   - **Progress Analytics** → Performance charts
   - **Community** → Social feed

---

## 🔑 Key Differences from Old Design

| Old | New |
|-----|-----|
| Language/Theme in each module | Settings page only |
| Navbar in each feature | Unified top header |
| No consistent navigation | Sidebar navigation |
| No mobile sidebar | Hamburger + sidebar |
| No role gating | Auth flow with role check |
| No onboarding flow | 4-step wizard |

---

## 🧪 Quick Tests

### Test 1: Auth Flow
```
1. Refresh page (you're on dashboard)
2. Open DevTools → Application → LocalStorage
3. See "vigorhub_auth" entry
4. Delete it
5. Refresh → OnboardingWizard appears again
```

### Test 2: Language Change
```
1. Click Settings
2. Click Language toggle
3. All text updates to Arabic
4. Page direction changes to RTL
5. Click again → back to English
```

### Test 3: Theme Change
```
1. Click Settings
2. Click Theme toggle
3. Dark mode → Light mode (background becomes light)
4. All module colors adapt
5. Click again → back to Dark
```

### Test 4: Navigation
```
1. Click "Calorie Tracker"
2. Content area shows tracker
3. Click "Progress Analytics"
4. Content area shows analytics
5. Active item in sidebar highlights
```

### Test 5: Mobile (DevTools)
```
1. Open DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Select mobile device
4. Sidebar becomes hamburger
5. Click hamburger → sidebar slides in
6. Click item → sidebar closes
```

---

## 🎨 Design System

### Colors
- **Primary:** Emerald green (`emerald-500`)
- **Accent:** Cyan blue (`cyan-500`)
- **Background:** Dark (`#0B0F19`) / Light (`slate-50`)
- **Text:** Slate gray

### Typography
- **Logo:** Bold, tracking tight
- **Headings:** Font-bold
- **Body:** Font-normal

### Spacing
- **Padding:** 4-6 units
- **Margins:** 2-4 units
- **Gaps:** 3-4 units

### Border Radius
- **Small:** rounded-lg
- **Medium:** rounded-xl
- **Large:** rounded-2xl

---

## 🔄 State Flow Diagram

```
┌─────────────────┐
│  User Visits    │
│  app/page.tsx   │
└────────┬────────┘
         │
         ▼
    ┌─────────────────┐
    │ Check Auth?     │
    └────┬────────┬───┘
         │ NO     │ YES
         ▼        ▼
    ┌────────┐  ┌──────────────┐
    │Wizard  │  │ Check Role?  │
    └────┬───┘  └┬──────────┬──┘
         │      │ OK       │ DENIED
    [Form] ├─────┬──────┐  ├─────┐
         │      ▼      ▼  ▼ NO  │
         │   Dashboard  Access   │
         │   Loaded     Denied   │
         │      ▲                │
         │      │ User Logout    │
         └──────┴────────────────┘
```

---

## 📂 File Structure

```
app/
└── page.tsx ..................... Main entry (auth gate)

components/
├── layouts/
│   └── DashboardLayout.tsx ....... Main dashboard shell
├── pages/
│   └── SettingsPage.tsx .......... Settings page
└── modules/
    ├── AthleteModule.tsx ......... Athlete Dashboard
    ├── CaloricTrackerModule.tsx .. Calorie Tracker
    ├── ProgressAnalyticsModule.tsx Progress Analytics
    └── CommunityModule.tsx ....... Community Hub
```

---

## 🎯 Next Steps

1. ✅ **Verify it works** - Start dev server, complete onboarding
2. ✅ **Test navigation** - Click through all features
3. ✅ **Test settings** - Change language and theme
4. ✅ **Test mobile** - Use device emulation
5. ⬜ **Connect Supabase** - Replace localStorage with real auth
6. ⬜ **Add API routes** - Persist user preferences
7. ⬜ **Deploy** - Push to Vercel

---

## 🆘 Troubleshooting

### Onboarding not showing after refresh
- Check browser DevTools → Application → LocalStorage
- Look for "vigorhub_auth" key
- If present but doesn't load dashboard, auth state might be corrupted
- **Fix:** Delete entry and refresh

### Sidebar not working on mobile
- Ensure you're viewing in mobile mode
- Click hamburger icon (top-left)
- Should slide in from left
- Click item to close
- Click overlay to close

### Settings not persisting
- Settings currently use React state only
- They persist during session (with localStorage)
- After refresh, defaults reset (because we're using mock auth)
- **Note:** Real Supabase would persist settings to database

### Module not loading
- Check browser console for errors
- Ensure the feature component exists
- Check component imports in module wrapper
- Verify lang/isDark props are passed

---

## 📞 Support

- **Architecture?** → Read `VIGORHUB_ARCHITECTURE.md`
- **Implementation?** → Check `IMPLEMENTATION_CHECKLIST.md`
- **Code Comments?** → Each component has inline docs

---

## ✨ That's It!

You now have:
- ✅ Unified auth flow
- ✅ Sidebar navigation
- ✅ Mobile hamburger menu
- ✅ Settings page
- ✅ Global language/theme
- ✅ All original features integrated

**Enjoy VigorHub! 💪**
