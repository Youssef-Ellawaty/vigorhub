# VigorHub - First Run Checklist

Follow this checklist to get VigorHub running on your machine for the first time.

## Pre-Flight Checks

- [ ] Node.js 18.17.0+ installed (`node --version` in terminal)
- [ ] npm installed (`npm --version` in terminal)
- [ ] Code editor ready (VS Code recommended)
- [ ] Terminal/Command Prompt open
- [ ] Project folder extracted or cloned

## Step 1: Install Dependencies

- [ ] Navigate to project folder: `cd vigorhub`
- [ ] Run: `npm install`
- [ ] Wait for installation to complete (2-5 minutes)
- [ ] See "up to date" message at the end

**If installation fails:**
- [ ] Check internet connection
- [ ] Run: `npm cache clean --force`
- [ ] Run: `npm install` again

## Step 2: Environment Setup

- [ ] Run: `cp .env.example .env.local`
- [ ] Verify `.env.local` file was created
- [ ] Leave default values (mock auth is enabled)
- [ ] Do NOT commit `.env.local` to Git

## Step 3: Start Development Server

- [ ] Run: `npm run dev`
- [ ] Wait for "Ready in X.Xs" message
- [ ] See "Local: http://localhost:3000" in terminal
- [ ] Keep this terminal window open

## Step 4: Open in Browser

- [ ] Open http://localhost:3000
- [ ] You should see the VigorHub onboarding form
- [ ] Form should have 4 steps visible

**If you see a blank page:**
- [ ] Wait 5 seconds and refresh (browser)
- [ ] Check terminal for errors
- [ ] Try: Ctrl+Shift+R (hard refresh)

## Step 5: Test Onboarding

- [ ] Fill in Step 1: Personal Information
  - [ ] Enter name (e.g., "John Doe")
  - [ ] Select age (e.g., 25)
  - [ ] Select gender
  - [ ] Click "Next"

- [ ] Fill in Step 2: Fitness Goals
  - [ ] Select at least one goal
  - [ ] Click "Next"

- [ ] Fill in Step 3: Contact & Password
  - [ ] Enter email (e.g., "test@example.com")
  - [ ] Enter password (min 8 characters)
  - [ ] Confirm password
  - [ ] Click "Next"

- [ ] Step 4: Review
  - [ ] Review all information
  - [ ] Click "Complete Setup"

**Expected:** You should see the Dashboard with sidebar and main content area

## Step 6: Test Navigation

- [ ] Click hamburger menu (☰) at top-left
- [ ] Sidebar should slide in from left
- [ ] Click "Athlete Dashboard" - content should change
- [ ] Click "Calorie Tracker" - content should change
- [ ] Click "Progress Analytics" - content should change
- [ ] Click "Community Hub" - content should change
- [ ] Click "Settings" - settings page should appear

## Step 7: Test Settings

In the Settings page:
- [ ] Click Language toggle (English ↔ Arabic)
- [ ] Text should change direction (RTL for Arabic)
- [ ] Click Language toggle again (Arabic → English)
- [ ] Text should be normal (LTR)

- [ ] Click Theme toggle (Light ↔ Dark)
- [ ] Page colors should invert
- [ ] Click Theme toggle again
- [ ] Colors should return to normal

## Step 8: Test Sidebar Toggle

- [ ] Resize browser to mobile width (< 768px)
- [ ] Hamburger menu should appear at top-left
- [ ] Click hamburger to open sidebar
- [ ] Click again to close sidebar
- [ ] Navigate to different pages - sidebar should reset

## Step 9: Test Logout

- [ ] Click "Logout" in sidebar
- [ ] You should return to the onboarding form
- [ ] Verify you're back at Step 1

## Step 10: Test Code Hot Reload

- [ ] Keep browser open at http://localhost:3000
- [ ] Open `components/layouts/DashboardLayout.tsx` in editor
- [ ] Find the line with "Dashboard" title
- [ ] Change text to something else (e.g., "My Dashboard")
- [ ] Save file (Ctrl+S)
- [ ] Look at browser - it should update automatically
- [ ] No manual refresh needed!

**Revert the change:**
- [ ] Change text back to original
- [ ] Save file

## Step 11: Verify File Structure

- [ ] Check these files exist:
  - [ ] `package.json`
  - [ ] `tsconfig.json`
  - [ ] `tailwind.config.ts`
  - [ ] `next.config.ts`
  - [ ] `postcss.config.mjs`
  - [ ] `app/page.tsx`
  - [ ] `app/layout.tsx`
  - [ ] `app/globals.css`
  - [ ] `components/layouts/DashboardLayout.tsx`
  - [ ] `components/pages/SettingsPage.tsx`
  - [ ] `components/modules/AthleteModule.tsx`
  - [ ] `components/modules/CaloricTrackerModule.tsx`
  - [ ] `components/modules/ProgressAnalyticsModule.tsx`
  - [ ] `components/modules/CommunityModule.tsx`

## Step 12: Check Node Modules

- [ ] Verify `node_modules/` folder exists
- [ ] It should be fairly large (200+ MB)
- [ ] Contains `next/`, `react/`, `tailwindcss/`, etc.

## Step 13: Test Type Checking

- [ ] Open new terminal (keep dev server running)
- [ ] Run: `npm run type-check`
- [ ] Should see "Successfully compiled" or similar
- [ ] No type errors should appear

**If errors appear:**
- [ ] Read the error messages carefully
- [ ] Most are due to missing types
- [ ] Fix by adding explicit types to variables

## Step 14: Test Building

- [ ] In terminal, run: `npm run build`
- [ ] Should show "✓ Compiled successfully"
- [ ] Should create `.next` folder
- [ ] Build should complete in under 30 seconds

**If build fails:**
- [ ] Check terminal error messages
- [ ] Run: `npm run type-check` to find issues
- [ ] Fix any TypeScript errors first

## Step 15: Verify Configuration

- [ ] Run: `node verify-setup.mjs`
- [ ] Should show green checkmarks for all items
- [ ] Should say "All checks passed"

## Success Checklist

If you've completed all steps above, you have:

- [ ] ✅ Dependencies installed
- [ ] ✅ Environment configured
- [ ] ✅ Dev server running
- [ ] ✅ App visible in browser
- [ ] ✅ Onboarding working
- [ ] ✅ Navigation working
- [ ] ✅ Settings working
- [ ] ✅ Theme/Language toggling
- [ ] ✅ Hot reload working
- [ ] ✅ Type checking passing
- [ ] ✅ Production build working

## Troubleshooting Quick Fixes

### Dev server won't start
```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9

# Try again
npm run dev
```

### Blank page or errors
```bash
# Clear Next.js cache
rm -rf .next

# Restart dev server
npm run dev
```

### Module errors
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
npm run dev
```

### Port 3000 in use
```bash
# Use different port
npm run dev -- -p 3001

# Open browser at http://localhost:3001
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Cannot find module 'next'" | Run `npm install` |
| Blank white page | Wait 5s, press F5, or Ctrl+Shift+R |
| Sidebar not showing | Check browser width, resize to desktop |
| Settings not saving | Check browser console for errors |
| Colors not changing | Try hard refresh (Ctrl+Shift+R) |
| Dev server crashes | Check terminal for error, restart |
| Type errors everywhere | Run `npm run type-check` for details |
| Build fails | Check Node.js version (needs 18.17+) |

## Next: What to Do Now

1. **Explore the code:**
   - Open `app/page.tsx` - See the entry point
   - Open `components/layouts/DashboardLayout.tsx` - See the layout
   - Open `components/modules/` - See the feature modules

2. **Read documentation:**
   - `SETUP_GUIDE.md` - Detailed setup walkthrough
   - `CONFIG_SUMMARY.md` - Configuration file details
   - `VIGORHUB_ARCHITECTURE.md` - Full architecture
   - `README.md` - Project overview

3. **Make changes:**
   - Edit any file and save to see hot reload
   - Changes appear instantly in browser
   - No manual refresh needed

4. **Add features:**
   - Create new components in `components/`
   - Add new pages/routes
   - Customize styling in `tailwind.config.ts`

## Getting Help

If you get stuck:

1. **Check terminal output** - Most errors are printed there
2. **Read error messages carefully** - They usually indicate the fix
3. **Check documentation** - See list above
4. **Run type check** - `npm run type-check` shows TypeScript errors
5. **Check Next.js docs** - https://nextjs.org/docs

## Success!

If you see the VigorHub app running and all features working, **congratulations!**

You're now ready to:
- Develop new features
- Customize the design
- Connect to Supabase
- Deploy to Vercel

**Happy coding! 🚀**

---

**Questions?** Check the documentation files or inline code comments.
