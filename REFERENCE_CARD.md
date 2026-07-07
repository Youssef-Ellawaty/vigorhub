# VigorHub Configuration Reference Card

**Quick reference for all configuration, commands, and setup.**

---

## ⚡ Quick Start (Copy & Paste)

```bash
# Step 1: Install (one time)
npm install

# Step 2: Setup environment (one time)
cp .env.example .env.local

# Step 3: Run development (always)
npm run dev

# Step 4: Open browser
# Visit http://localhost:3000
```

---

## 📋 Essential Commands

| Command | Purpose | Output |
|---------|---------|--------|
| `npm run dev` | Start dev server | http://localhost:3000 |
| `npm run build` | Build for production | `.next/` folder created |
| `npm start` | Run production build | Production server |
| `npm run lint` | Check code quality | Linting results |
| `npm run type-check` | Check TypeScript | Type errors/success |

---

## 📁 Configuration Files (In Order of Importance)

### 1. `package.json`
```json
{
  "dependencies": {
    "react": "^19.0.0",
    "next": "^16.0.0",
    "tailwindcss": "^4.0.0"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```
**Edit when:** Adding packages
**Run after:** `npm install`

### 2. `tsconfig.json`
**Key features:**
- Strict mode: `"strict": true`
- Path aliases: `"@/*": ["*"]`
- Target: `"ES2020"`

**Edit when:** Adding path aliases
**Never edit:** Compiler flags

### 3. `tailwind.config.ts`
**Key sections:**
- `content:` - Paths to scan for classes
- `theme.colors:` - Custom colors
- `theme.extend:` - Additional utilities

**Edit when:** Changing colors, fonts, spacing

### 4. `next.config.ts`
**Key settings:**
- `reactCompiler: true` - Auto optimization
- `typescript.tsconfigPath` - TypeScript config
- `headers()` - Security settings

**Edit when:** Need security headers, redirects

### 5. `postcss.config.mjs`
**Plugins:**
- `tailwindcss` - CSS framework
- `autoprefixer` - Browser prefixes

**Usually don't edit** (already configured)

---

## 🎨 Customization Cheat Sheet

### Change Primary Color
```typescript
// In tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: '#your-color'  // Change this
    }
  }
}
```
Then use: `bg-primary`, `text-primary`, `border-primary`

### Change Font
```typescript
// In tailwind.config.ts
theme: {
  fontFamily: {
    sans: ['Your Font', 'fallback']
  }
}
```
Then use: `font-sans` class

### Add Custom Animation
```typescript
// In tailwind.config.ts
animation: {
  'my-animation': 'myKeyframe 0.3s ease-out'
},
keyframes: {
  myKeyframe: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' }
  }
}
```

### Add Environment Variable
```bash
# In .env.local
NEXT_PUBLIC_MY_VAR=my_value
```
Then in code:
```typescript
const myVar = process.env.NEXT_PUBLIC_MY_VAR
```

---

## 📂 Project Structure Map

```
vigorhub/
│
├── Configuration (5 core files)
│   ├── package.json .................. Dependencies
│   ├── tsconfig.json ................. TypeScript
│   ├── tailwind.config.ts ............ Styling
│   ├── next.config.ts ................ Next.js
│   └── postcss.config.mjs ............ CSS Processing
│
├── App (Entry Point)
│   ├── app/page.tsx .................. Main page
│   ├── app/layout.tsx ................ Root layout
│   └── app/globals.css ............... Global styles
│
├── Components (Reusable)
│   ├── components/layouts/ ........... Layout components
│   ├── components/pages/ ............. Page components
│   └── components/modules/ ........... Feature modules
│
├── Features (Existing)
│   ├── athlete-dashboard/ ............ Workouts
│   ├── calorie-tracker/ .............. Nutrition
│   ├── progress-analytics/ ........... Charts
│   ├── community/ .................... Social
│   └── auth-onboarding/ .............. Auth
│
├── Static
│   └── public/ ....................... Images, icons
│
└── Documentation (Guides)
    ├── README.md ..................... Main guide
    ├── SETUP_GUIDE.md ................ Setup steps
    ├── CONFIG_SUMMARY.md ............. Config details
    └── FIRST_RUN_CHECKLIST.md ........ Checklist
```

---

## 🔧 Troubleshooting Fixes

### Issue: "Cannot find module"
```bash
npm install
npm run dev
```

### Issue: Port 3000 in use
```bash
npm run dev -- -p 3001
```

### Issue: Changes not showing
```bash
# Hard refresh
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

### Issue: Build fails
```bash
npm run type-check    # Check for type errors
npm run lint          # Check for code issues
npm run build         # Try building again
```

### Issue: Strange errors
```bash
rm -rf .next node_modules
npm install
npm run dev
```

---

## 🎯 Important Paths

| Path | Purpose |
|------|---------|
| `app/page.tsx` | Entry point component |
| `app/layout.tsx` | Root layout (all pages) |
| `app/globals.css` | Global styles |
| `components/layouts/` | Layout components |
| `components/pages/` | Page components |
| `components/modules/` | Feature modules |
| `tailwind.config.ts` | Styling config |
| `next.config.ts` | Build config |
| `.env.local` | Environment variables |
| `public/` | Static files |

---

## 📊 Key Dependencies

```
Runtime (Production)
├── react ..................... UI library
├── next ...................... Framework
├── tailwindcss ............... Styling
└── lucide-react .............. Icons

Development (Local)
├── typescript ................ Type checking
├── eslint .................... Code quality
└── postcss ................... CSS processing
```

---

## 🚀 Deployment Commands

### Build for Production
```bash
npm run build        # Creates optimized build
npm start            # Runs production server
```

### Deploy to Vercel
```bash
git push              # Push to GitHub
# Vercel auto-deploys
```

### Deploy to other hosts
```bash
npm run build
# Upload `.next` folder
# Set environment variables
# Run: npm start
```

---

## ✅ Verification Checklist

Run this script to verify setup:
```bash
node verify-setup.mjs
```

Expected output:
```
✓ package.json
✓ tsconfig.json
✓ tailwind.config.ts
✓ next.config.ts
✓ postcss.config.mjs
✓ app/
✓ components/
✓ node_modules/
✓ All checks passed!
```

---

## 🎓 Learning Path

**Start here:**
1. `FIRST_RUN_CHECKLIST.md` (verify setup)
2. `SETUP_GUIDE.md` (understand setup)
3. `CONFIG_SUMMARY.md` (learn config)

**Then explore:**
4. `README.md` (overview)
5. `VIGORHUB_ARCHITECTURE.md` (deep dive)

**For reference:**
6. This file (quick reference)

---

## 💡 Pro Tips

1. **Use path aliases:** `@/components` instead of `../../../components`
2. **Use semantic colors:** `bg-primary` instead of `bg-blue-500`
3. **Keep dependencies updated:** `npm outdated` to check
4. **Use type checking:** `npm run type-check` before committing
5. **Use hot reload:** Save file and see changes instantly
6. **Use console.log:** Add `console.log("[v0] ...")` for debugging

---

## 🔐 Security Notes

- ✅ `.env.local` is in `.gitignore` (safe)
- ✅ Never commit `.env` files
- ✅ Use `NEXT_PUBLIC_` prefix only for public variables
- ✅ Security headers configured in `next.config.ts`
- ✅ TypeScript strict mode catches type errors

---

## 📞 Get Help

**Setup Issues:** See `SETUP_GUIDE.md`
**Config Questions:** See `CONFIG_SUMMARY.md`
**Can't run?** Try `node verify-setup.mjs`
**Still stuck?** Check inline code comments

---

## 📈 Performance Tips

- Next.js Turbopack ✅ Enabled (fastest builds)
- React Compiler ✅ Enabled (auto optimization)
- Image optimization ✅ Enabled (WebP/Avif)
- Code splitting ✅ Automatic (by route)

---

**Bookmark this file for quick reference!**

Last updated: 2026-07-07
