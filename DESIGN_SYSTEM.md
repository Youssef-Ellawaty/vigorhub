# VigorHub Design System

A modern, professional fitness dashboard with bilingual support (English/Arabic) and comprehensive theme customization.

## Color Palette

### Primary Colors
- **Green (Fitness/Health)**: `#10b981` - Main CTA and active states
- **Dark Green**: `#059669` - Hover states
- **Light Green**: `#a7f3d0` - Light backgrounds, gentle accents

### Secondary Colors
- **Blue (Professional)**: `#3b82f6` - Secondary CTAs, links
- **Dark Blue**: `#1d4ed8` - Hover states
- **Light Blue**: `#dbeafe` - Light backgrounds

### Accent Colors
- **Amber (Energy)**: `#f59e0b` - Warnings, highlights
- **Yellow-Green (Vibrancy)**: `#ccff00` - Bright accents

### Semantic Colors
- **Success**: `#10b981` (green)
- **Error**: `#ef4444` (red)
- **Warning**: `#f59e0b` (amber)
- **Info**: `#3b82f6` (blue)

### Neutral Colors - Light Theme
```css
--background: #ffffff
--background-secondary: #f8fafc
--background-tertiary: #f1f5f9
--foreground: #1e293b
--foreground-secondary: #475569
--foreground-tertiary: #64748b
--border: #e2e8f0
--border-light: #f1f5f9
--muted: #f1f5f9
--muted-foreground: #64748b
```

### Neutral Colors - Dark Theme
```css
--background: #0f172a
--background-secondary: #1e293b
--background-tertiary: #334155
--foreground: #f1f5f9
--foreground-secondary: #cbd5e1
--foreground-tertiary: #94a3b8
--border: #475569
--border-light: #334155
--muted: #1e293b
--muted-foreground: #94a3b8
```

## Typography

- **Font Family**: System stack (-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif)
- **Font Smoothing**: Antialiased with grayscale optimization
- **Feature Settings**: CSS rounding enabled

### Text Styles
- **H1**: 28-32px, font-weight 700
- **H2**: 24-28px, font-weight 700
- **H3**: 20-24px, font-weight 700
- **Body**: 14-16px, font-weight 400
- **Small**: 12-14px, font-weight 400
- **Label**: 12px, font-weight 600

## Components

### Sidebar
- Fixed positioning on desktop
- Hamburger toggle on mobile
- Smooth transitions and animations
- Active state indicators with green highlights
- Organized navigation items with descriptions
- User info header with profile display
- Settings and logout sections

### Header
- Sticky positioning for scrolling
- Language toggle (English/Arabic)
- Theme toggle (Light/Dark)
- User avatar with initials
- Responsive hamburger menu

### Navigation Items
- 4 main features: Athlete Dashboard, Calorie Tracker, Progress Analytics, Community
- Icon + label + description format
- Active state shows green background with border
- Hover states for better UX
- Smooth transitions on all interactions

### Settings Page
- Modern card-based layout
- Language selector buttons with visual feedback
- Theme selector with icons
- About section with version info
- All settings with instant apply

### Content Area
- Responsive grid layout
- Proper padding and spacing
- Mobile-first design approach
- Clear visual hierarchy

## Responsive Design

### Breakpoints
- **Mobile**: < 768px - Full-width, hamburger menu
- **Tablet**: 768px-1024px - Adjusted sidebar, touch-friendly
- **Desktop**: > 1024px - Full sidebar visible, optimal spacing

### Mobile Optimizations
- Hamburger menu with overlay
- Touch-friendly button sizes (44px minimum)
- Stack layout for narrow screens
- Optimized font sizes for readability

## Internationalization

### Language Support
- **English (en)**: Left-to-right (LTR)
- **Arabic (ar)**: Right-to-left (RTL)

### Implementation
- `document.documentElement.dir` set based on language
- `document.documentElement.lang` for accessibility
- All text content translated
- Icons flip/reverse for RTL where appropriate

## Theme Support

### Dark Mode
- Complete dark color palette
- Automatic application via `html.dark` class
- Smooth transitions between themes
- Reduced eye strain for nighttime use

### Light Mode
- Clean, professional appearance
- High contrast for readability
- Optimized for daylight viewing

## Accessibility

### Color Contrast
- All text meets WCAG AA standards (4.5:1 for normal text)
- Icons paired with text labels
- Color not the only indicator of state

### Keyboard Navigation
- Focusable elements receive visible focus rings
- Tab order follows logical flow
- Escape key closes modals/menus

### Semantic HTML
- Proper heading hierarchy
- Button elements for actions
- Link elements for navigation
- Form elements properly labeled

## Animations

### Transitions
- Sidebar toggle: 300ms ease-in-out
- Button hovers: 200ms ease-in
- Theme change: Instant with fade effect
- Page navigation: Smooth without flash

### Performance
- GPU-accelerated transforms
- Reduced motion respected (prefers-reduced-motion)
- No animations on low-end devices

## Spacing System

Using consistent spacing scale (4px base):
- `4px` - Tight spacing
- `8px` - Default padding
- `12px` - Medium spacing
- `16px` - Standard padding
- `24px` - Large sections
- `32px` - Page margins

## Border & Radius

- **Border Width**: 1px standard, 2px for focus states
- **Border Radius**: 8px for components, 12px for cards
- **Border Color**: Uses semantic border tokens

## Component States

### Interactive States
- **Default**: Base colors
- **Hover**: Slightly darker/lighter shade
- **Active**: Primary color with border
- **Disabled**: Muted colors with reduced opacity
- **Focus**: Outline or highlight ring

## File Locations

- **Colors & Tokens**: `app/globals.css`
- **Layout Components**: `components/layouts/DashboardLayout.tsx`
- **Settings Page**: `components/pages/SettingsPage.tsx`
- **Feature Modules**: `components/modules/*.tsx`

## Design Principles

1. **Clarity** - Clear visual hierarchy and communication
2. **Consistency** - Unified design language throughout
3. **Accessibility** - Inclusive design for all users
4. **Performance** - Optimized rendering and animations
5. **Responsiveness** - Works seamlessly on all devices
6. **Localization** - Full support for multiple languages
7. **Modern** - Current design trends and best practices

## Usage Examples

### Using Color Tokens
```tsx
<div className={`${isDark ? 'bg-[#1e293b]' : 'bg-white'} text-foreground`}>
  {/* Content */}
</div>
```

### Creating New Components
1. Use semantic color tokens
2. Follow spacing scale
3. Ensure accessibility
4. Support dark/light modes
5. Consider RTL layouts
6. Add translations

## Future Enhancements

- [ ] Additional color themes (high contrast, colorblind-friendly)
- [ ] Animation preferences
- [ ] Custom font sizes
- [ ] Additional languages
- [ ] Theming API for user customization
