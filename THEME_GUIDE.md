# Theme System Guide

This guide explains how to use the comprehensive theme system implemented in the TalentHub application.

## Overview

The theme system supports three modes:

- **Light**: Traditional light theme
- **Dark**: Dark theme for better eye comfort in low-light environments
- **Auto**: Automatically switches between light and dark based on system preferences

## Features

- ✅ Persistent theme selection (saved in localStorage)
- ✅ System preference detection for auto mode
- ✅ Smooth transitions between themes
- ✅ Comprehensive dark mode styling
- ✅ Theme toggle component for easy switching
- ✅ Custom hook for theme-aware colors

## How to Use

### 1. Theme Context

The theme system is powered by the `ThemeContext` which provides:

```typescript
const { theme, setTheme, isDark } = useTheme();
```

- `theme`: Current theme ('light' | 'dark' | 'auto')
- `setTheme`: Function to change the theme
- `isDark`: Boolean indicating if dark mode is currently active

### 2. Theme Toggle Component

Use the `ThemeToggle` component for quick theme switching:

```tsx
import { ThemeToggle } from '@/components/ui/ThemeToggle';

// Simple button that cycles through themes
<ThemeToggle />

// Dropdown with all theme options
<ThemeToggle variant="dropdown" />
```

### 3. Theme-Aware Colors Hook

Use the `useThemeColors` hook for consistent theming:

```tsx
import { useThemeColors } from '@/hooks/useThemeColors';

function MyComponent() {
  const colors = useThemeColors();

  return (
    <div className={`${colors.bg.primary} ${colors.text.primary}`}>
      <h1 className={colors.text.primary}>Title</h1>
      <p className={colors.text.secondary}>Description</p>
    </div>
  );
}
```

### 4. Tailwind Dark Mode Classes

Use Tailwind's dark mode classes directly:

```tsx
<div className='bg-white dark:bg-gray-900 text-gray-900 dark:text-white'>
  <h1 className='text-2xl font-bold'>Title</h1>
  <p className='text-gray-600 dark:text-gray-300'>Description</p>
</div>
```

## Styling Guidelines

### Background Colors

- Primary: `bg-white dark:bg-gray-900`
- Secondary: `bg-gray-50 dark:bg-gray-800`
- Tertiary: `bg-gray-100 dark:bg-gray-700`
- Cards: `bg-white dark:bg-gray-800`

### Text Colors

- Primary: `text-gray-900 dark:text-white`
- Secondary: `text-gray-600 dark:text-gray-300`
- Tertiary: `text-gray-500 dark:text-gray-400`
- Muted: `text-gray-400 dark:text-gray-500`

### Border Colors

- Primary: `border-gray-200 dark:border-gray-700`
- Secondary: `border-gray-300 dark:border-gray-600`
- Accent: `border-blue-500` (same for both themes)

### Interactive States

- Hover: `hover:bg-gray-50 dark:hover:bg-gray-700`
- Focus: `focus:ring-blue-500` (same for both themes)
- Active: `active:bg-gray-100 dark:active:bg-gray-600`

### Form Elements

- Input: `bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white`
- Disabled: `bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400`

## Implementation Details

### Theme Context (`src/contexts/ThemeContext.tsx`)

- Manages theme state and persistence
- Handles system preference detection
- Applies theme classes to document root

### Theme Toggle (`src/components/ui/ThemeToggle.tsx`)

- Provides button and dropdown variants
- Cycles through themes or shows all options
- Includes proper icons for each theme

### Theme Colors Hook (`src/hooks/useThemeColors.ts`)

- Provides consistent color utilities
- Makes it easy to maintain theme consistency
- Reduces repetition in component styling

### Global Styles (`src/styles/globals.css`)

- Smooth transitions between themes
- Custom scrollbar styling for both themes
- SimpleBar component theming

## Best Practices

1. **Always use dark mode variants** for new components
2. **Use the theme colors hook** for consistent styling
3. **Test both themes** during development
4. **Use semantic color names** (primary, secondary, etc.)
5. **Avoid hardcoded colors** that don't adapt to themes

## Example Component

```tsx
import { useTheme } from '@/contexts/ThemeContext';
import { useThemeColors } from '@/hooks/useThemeColors';

export function ExampleCard() {
  const { theme } = useTheme();
  const colors = useThemeColors();

  return (
    <div
      className={`${colors.bg.card} ${colors.border.primary} border rounded-lg p-6 shadow-sm`}
    >
      <h2 className={`${colors.text.primary} text-xl font-semibold mb-2`}>
        Card Title
      </h2>
      <p className={`${colors.text.secondary} mb-4`}>
        This is an example card that adapts to the current theme.
      </p>
      <button
        className={`${colors.bg.accent} ${colors.text.primary} px-4 py-2 rounded-md ${colors.interactive.hover}`}
      >
        Action Button
      </button>
    </div>
  );
}
```

## Migration Guide

To add dark mode support to existing components:

1. Add `dark:` variants to existing Tailwind classes
2. Replace hardcoded colors with theme-aware alternatives
3. Test the component in both light and dark modes
4. Use the theme colors hook for new components

## Troubleshooting

### Theme not persisting

- Check if localStorage is available
- Verify the ThemeProvider is wrapping your app

### Dark mode not working

- Ensure `darkMode: 'class'` is set in Tailwind config
- Check that the `dark` class is being applied to the HTML element

### Styling inconsistencies

- Use the theme colors hook for consistency
- Follow the styling guidelines above
- Test components in both themes
