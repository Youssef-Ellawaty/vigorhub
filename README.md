# VigorHub - Comprehensive Fitness & Health Management Platform

A modern, full-featured fitness and health management platform with athlete dashboards, calorie tracking, progress analytics, and community features.

## Features

- **Athlete Dashboard** - Personalized workout programs and fitness tracking
- **Calorie Tracker** - Track nutrition intake, water consumption, and dietary goals
- **Progress Analytics** - Visualize fitness progress with detailed charts and statistics
- **Community Hub** - Connect with other athletes and share achievements
- **Settings Management** - Language preferences (English/Arabic) and theme customization
- **Role-Based Access** - Different access levels for free athletes, premium athletes, and coaches

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **UI Components**: [Lucide React](https://lucide.dev) for icons
- **Authentication**: Mock auth (ready for Supabase integration)
- **State Management**: React Context API + localStorage
- **Package Manager**: npm, yarn, pnpm, or bun

## Prerequisites

- Node.js 18.17.0 or later
- npm, yarn, pnpm, or bun (choose one)

## Quick Start

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 2. Set Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration (currently uses mock auth, ready for Supabase).

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The app will auto-reload on code changes thanks to Next.js Hot Module Replacement (HMR).

## Available Scripts

```bash
# Development
npm run dev           # Start dev server on http://localhost:3000

# Production
npm run build         # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking

# Both lint and type-check
npm run lint && npm run type-check
```

## Project Structure

```
vigorhub/
├── app/
│   ├── page.tsx              # Main entry point (Auth → Dashboard)
│   ├── layout.tsx            # Root layout with metadata
│   └── globals.css           # Global styles & Tailwind setup
├── components/
│   ├── layouts/
│   │   └── DashboardLayout.tsx    # Main dashboard shell with sidebar
│   ├── pages/
│   │   └── SettingsPage.tsx       # Settings (Language & Theme)
│   └── modules/
│       ├── AthleteModule.tsx      # Athlete Dashboard wrapper
│       ├── CaloricTrackerModule.tsx   # Calorie Tracker wrapper
│       ├── ProgressAnalyticsModule.tsx # Analytics wrapper
│       └── CommunityModule.tsx     # Community Hub wrapper
├── athlete-dashboard/        # Feature: Athlete Dashboard
├── calorie-tracker/          # Feature: Calorie Tracker
├── progress-analytics/       # Feature: Progress Analytics
├── community/                # Feature: Community Hub
├── auth-onboarding/          # Feature: Authentication & Onboarding
├── public/                   # Static assets
├── package.json              # Dependencies & scripts
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── next.config.ts            # Next.js configuration
├── postcss.config.mjs        # PostCSS configuration
└── .eslintrc.json            # ESLint configuration
```

## Architecture Overview

### Authentication Flow

1. **Unauthenticated** → Onboarding Wizard (4 steps)
2. **Authenticated** → Role Check
3. **free_athlete role** → Dashboard Layout
4. **Other roles** → Access Denied

### Navigation Structure

```
Dashboard Layout
├── Header (Hamburger Menu + Title + Avatar)
├── Sidebar (Mobile: toggleable, Desktop: always visible)
│   ├── Athlete Dashboard
│   ├── Calorie Tracker
│   ├── Progress Analytics
│   ├── Community Hub
│   ├── Settings
│   └── Logout
└── Main Content Area (Dynamic module loading)
    ├── Athlete Module
    ├── Calorie Tracker Module
    ├── Progress Analytics Module
    ├── Community Module
    └── Settings Page
```

### Global State Management

- **Language**: English (en) / Arabic (ar)
- **Theme**: Light / Dark (with system preference detection)
- **Authentication**: Mock user object (localStorage-based)
- **UI State**: Sidebar visibility, current module, etc.

## Configuration Files

### `package.json`
Defines all dependencies, scripts, and metadata for the project.
- **Next.js 16** - Latest stable version with App Router
- **React 19** - Latest React version
- **Tailwind CSS 4** - Utility-first CSS framework
- **TypeScript 5.7** - Type safety
- **Lucide React** - Icon library (hamburger, settings icons)

### `tsconfig.json`
TypeScript configuration with:
- Strict mode enabled for type safety
- Path aliases for clean imports (`@/*`)
- Module resolution configured for bundling
- Source maps for debugging

### `tailwind.config.ts`
Tailwind CSS configuration with:
- Custom color palette (primary, secondary, accent, etc.)
- Extended spacing and animations
- Responsive design utilities
- Dark mode support ready

### `next.config.ts`
Next.js configuration with:
- React Compiler enabled for optimization
- TypeScript strict mode
- Security headers configured
- Image optimization enabled

### `postcss.config.mjs`
PostCSS configuration for:
- Tailwind CSS processing
- Autoprefixer for browser compatibility

## Customization

### Colors
Edit the `theme.colors` in `tailwind.config.ts` to change the color scheme. All components use semantic color names (primary, secondary, etc.) rather than hard-coded colors.

### Typography
Fonts are defined in `tailwind.config.ts` under `theme.fontFamily`. Update to use custom fonts or web fonts.

### Layout
The sidebar width, header height, and spacing can be adjusted in `components/layouts/DashboardLayout.tsx`.

### Language & Theme
Settings are managed in `components/pages/SettingsPage.tsx` and stored in React Context.

## Debugging

### Development Mode
Enable detailed logging by adding console statements:
```typescript
console.log("[v0] Variable state:", variableName);
```

### Type Checking
Run type checking without building:
```bash
npm run type-check
```

### Linting
Check for code quality issues:
```bash
npm run lint
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimization

- **Next.js Turbopack** - Lightning-fast builds
- **React Compiler** - Automatic optimization
- **Image Optimization** - Automatic WebP conversion
- **Code Splitting** - Automatic route-based splitting
- **CSS Optimization** - Tailwind CSS purging

## Deployment

### Vercel (Recommended)

```bash
# Push to GitHub
git push

# Vercel automatically deploys from your repository
```

### Other Platforms

```bash
# Build
npm run build

# Start
npm start
```

## Documentation

- **Architecture**: See `VIGORHUB_ARCHITECTURE.md`
- **Quick Start**: See `QUICK_START.md`
- **Implementation**: See `IMPLEMENTATION_CHECKLIST.md`
- **Visual Guide**: See `VISUAL_GUIDE.md`

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm run dev
```

### TypeScript Errors
```bash
# Run type check to see all errors
npm run type-check
```

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Push and create a Pull Request

## License

VigorHub is licensed under the MIT License. See LICENSE file for details.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check documentation files in the project root
- Review the inline code comments

## Future Enhancements

- [ ] Supabase authentication integration
- [ ] Real-time notifications
- [ ] Video content for workout programs
- [ ] AI-powered recommendations
- [ ] Social features (likes, comments, shares)
- [ ] Export data functionality
- [ ] Mobile app (React Native)
- [ ] Progressive Web App (PWA)

---

**Made with ❤️ by the VigorHub Team**
