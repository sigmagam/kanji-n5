/**
 * useThemeColor — simple hook returning a color for the current scheme.
 * This app is light-first (washi paper aesthetic).
 */
import { colors } from '../constants/theme';

export function useThemeColor(): { bg: string; surface: string; ink: string } {
  return { bg: colors.bg, surface: colors.surface, ink: colors.ink };
}
