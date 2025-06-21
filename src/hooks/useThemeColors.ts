import { useTheme } from '@/contexts/ThemeContext';

export function useThemeColors() {
  const { isDark } = useTheme();

  return {
    // Background colors
    bg: {
      primary: isDark ? 'bg-gray-900' : 'bg-white',
      secondary: isDark ? 'bg-gray-800' : 'bg-gray-50',
      tertiary: isDark ? 'bg-gray-700' : 'bg-gray-100',
      card: isDark ? 'bg-gray-800' : 'bg-white',
      overlay: isDark ? 'bg-gray-900/80' : 'bg-black/40',
    },
    // Text colors
    text: {
      primary: isDark ? 'text-white' : 'text-gray-900',
      secondary: isDark ? 'text-gray-300' : 'text-gray-600',
      tertiary: isDark ? 'text-gray-400' : 'text-gray-500',
      muted: isDark ? 'text-gray-500' : 'text-gray-400',
      accent: isDark ? 'text-blue-400' : 'text-blue-600',
    },
    // Border colors
    border: {
      primary: isDark ? 'border-gray-700' : 'border-gray-200',
      secondary: isDark ? 'border-gray-600' : 'border-gray-300',
      accent: isDark ? 'border-blue-500' : 'border-blue-500',
    },
    // Interactive states
    interactive: {
      hover: isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
      focus: isDark ? 'focus:ring-blue-500' : 'focus:ring-blue-500',
      active: isDark ? 'active:bg-gray-600' : 'active:bg-gray-100',
    },
    // Form elements
    form: {
      input: isDark
        ? 'bg-gray-700 border-gray-600 text-white'
        : 'bg-white border-gray-300 text-gray-900',
      inputDisabled: isDark
        ? 'bg-gray-800 text-gray-400'
        : 'bg-gray-100 text-gray-500',
      select: isDark
        ? 'bg-gray-700 border-gray-600 text-white'
        : 'bg-white border-gray-300 text-gray-900',
    },
    // Status colors
    status: {
      success: isDark ? 'text-green-400' : 'text-green-600',
      warning: isDark ? 'text-yellow-400' : 'text-yellow-600',
      error: isDark ? 'text-red-400' : 'text-red-600',
      info: isDark ? 'text-blue-400' : 'text-blue-600',
    },
  };
}
