# VigorHub Setup Guide

This guide walks you through setting up VigorHub on your local machine for the first time.

## 1. Prerequisites

Before you begin, ensure you have:
- **Node.js** version 18.17.0 or later ([Download](https://nodejs.org/))
- **Git** installed ([Download](https://git-scm.com/))
- A code editor (VS Code recommended)
- A terminal/command prompt

## 2. Verify Node.js Installation

Open your terminal and verify Node.js and npm are installed:

```bash
node --version
npm --version
```

You should see version numbers (e.g., v20.11.0 and 10.2.4).

## 3. Clone or Extract the Repository

If you have the project as a ZIP file:
```bash
# Extract the ZIP file
unzip vigorhub.zip
cd vigorhub
```

If you have a Git repository:
```bash
git clone https://github.com/Youssef-Ellawaty/vigorhub.git
cd vigorhub
```

## 4. Install Dependencies

This is the critical step. Run one of these commands based on your package manager:

```bash
# Using npm (most common)
npm install

# OR using yarn
yarn install

# OR using pnpm
pnpm install

# OR using bun
bun install
```

**What happens:** This command reads `package.json` and downloads all dependencies into a `node_modules` folder. This may take 2-5 minutes.

**What should you see:**
```
added 156 packages, and audited 157 packages
up to date
```

**If it fails:** 
- Check your internet connection
- Try deleting `node_modules` and `package-lock.json`, then run install again
- Try clearing npm cache: `npm cache clean --force`

## 5. Set Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

This creates a `.env.local` file with default settings. Currently, the app uses mock authentication and doesn't require any external API keys to run.

**Current settings in `.env.local`:**
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_MOCK_AUTH=true
```

These settings are perfect for local development.

## 6. Run the Development Server

Start the app with:

```bash
npm run dev
```

**What you should see:**
```
  ▲ Next.js 16.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Ready in 2.5s
```

## 7. Open the App in Your Browser

Click this link or paste it into your browser:
```
http://localhost:3000
```

You should see the VigorHub onboarding form.

## 8. Test the Onboarding Flow

1. Fill in the onboarding form:
   - Personal info (name, age, gender)
   - Fitness goals
   - Contact & password
   - Review & confirm

2. Click "Complete Setup"

3. You should be redirected to the main Dashboard

## 9. Test the Navigation

Once in the Dashboard:
1. Click the **hamburger menu** (three lines) at the top left
2. Navigate through the features:
   - Athlete Dashboard
   - Calorie Tracker
   - Progress Analytics
   - Community Hub
3. Click **Settings** to test Language and Theme toggles

## 10. Development Workflow

### Making Changes

1. Edit any file in the project
2. Save the file (Ctrl+S or Cmd+S)
3. The browser automatically refreshes (Hot Module Replacement)

### Adding New Dependencies

```bash
npm install package-name
```

Then restart the dev server with Ctrl+C and `npm run dev`.

### Running Type Checks

Verify your TypeScript code:
```bash
npm run type-check
```

### Running Linting

Check code quality:
```bash
npm run lint
```

## 11. Folder Structure Quick Guide

```
vigorhub/
├── app/                    ← Main app entry point
│   ├── page.tsx           ← Entry point component
│   ├── layout.tsx         ← Root layout
│   └── globals.css        ← Global styles
├── components/            ← Reusable components
│   ├── layouts/           ← Layout components
│   ├── pages/             ← Page components
│   └── modules/           ← Feature modules
├── athlete-dashboard/     ← Feature: Workouts
├── calorie-tracker/       ← Feature: Nutrition
├── progress-analytics/    ← Feature: Analytics
├── community/             ← Feature: Social
├── auth-onboarding/       ← Feature: Auth
├── public/                ← Static files
├── package.json           ← Dependencies
├── tailwind.config.ts     ← Tailwind config
├── tsconfig.json          ← TypeScript config
└── next.config.ts         ← Next.js config
```

## 12. Configuration Files Overview

### `package.json`
Lists all dependencies and scripts. Edit to add new packages.

### `tsconfig.json`
TypeScript settings. Enables strict type checking.

### `tailwind.config.ts`
Tailwind CSS configuration. Customize colors, fonts, animations here.

### `next.config.ts`
Next.js settings. Configure React Compiler, image optimization, etc.

### `postcss.config.mjs`
PostCSS plugins configuration. Tailwind and Autoprefixer.

### `.env.local`
Environment variables for your local machine (NOT committed to Git).

### `.gitignore`
Files to ignore when pushing to GitHub (node_modules, .env, etc).

## 13. Troubleshooting

### Error: "Cannot find module 'next'"
**Solution:** Run `npm install` again

### Port 3000 already in use
**Solution:** 
```bash
# Kill the process (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Blank page or "Module not found" errors
**Solution:**
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run dev
```

### TypeScript errors appear everywhere
**Solution:** Make sure you're in the project directory and `tsconfig.json` is present

### Changes not reflecting in browser
**Solution:** Try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## 14. Next Steps

1. **Explore the code** - Open `app/page.tsx` to understand the entry point
2. **Read documentation** - Check `VIGORHUB_ARCHITECTURE.md`
3. **Customize styling** - Edit `tailwind.config.ts`
4. **Add features** - Create new components in `components/`
5. **Connect to Supabase** - When ready for real authentication

## 15. Building for Production

When you're ready to deploy:

```bash
npm run build
```

This creates an optimized production build. Then deploy to:
- **Vercel** (recommended for Next.js) - Connect your GitHub repo
- **Netlify** - Build command: `npm run build`
- **Any Node.js host** - Use `npm start` to run production server

## 16. Getting Help

If you get stuck:
1. Check the project's documentation files
2. Review the inline code comments
3. Check Next.js docs: https://nextjs.org/docs
4. Check Tailwind docs: https://tailwindcss.com/docs

## 17. Common Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run type-check       # Check TypeScript errors
npm run lint            # Check code quality

# Production
npm run build           # Build for production
npm start              # Start production server

# Maintenance
npm install            # Install dependencies
npm update            # Update packages
npm outdated          # Check for outdated packages
```

## Success!

If you can see the VigorHub app running at http://localhost:3000, you've successfully set up the project. You're ready to start developing!

Next: Read `README.md` or `VIGORHUB_ARCHITECTURE.md` for more details.
