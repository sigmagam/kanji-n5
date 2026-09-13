/**
 * Design system for KANJI N5.
 * Minimal, elegant, Japanese-inspired. High contrast. No neon.
 */

export const colors = {
  // Backgrounds — warm off-white (washi) and ink-black.
  bg: '#f7f4ef',
  bgDark: '#1a1a1a',
  surface: '#ffffff',
  surfaceAlt: '#f0ece5',
  surfaceDark: '#242424',
  // Ink (text)
  ink: '#1a1a1a',
  inkSoft: '#4a4a4a',
  inkMuted: '#8a8a8a',
  inkInverted: '#f7f4ef',
  // Accents — sumi-ink red (hanko) and matcha green.
  accent: '#9c2b2b', // hanko red
  accentSoft: '#c25555',
  matcha: '#5a7a4a',
  matchaSoft: '#7a9a6a',
  gold: '#b08d3a',
  // Status
  success: '#3a7a4a',
  danger: '#9c2b2b',
  // Borders
  border: '#e0d9cd',
  borderDark: '#3a3a3a',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 6,
  md: 12,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

export const typography = {
  title: { fontFamily: 'System', fontWeight: '700' as const, fontSize: 28, lineHeight: 34 },
  heading: { fontFamily: 'System', fontWeight: '600' as const, fontSize: 22, lineHeight: 28 },
  subheading: { fontFamily: 'System', fontWeight: '600' as const, fontSize: 17, lineHeight: 22 },
  body: { fontFamily: 'System', fontWeight: '400' as const, fontSize: 16, lineHeight: 22 },
  caption: { fontFamily: 'System', fontWeight: '400' as const, fontSize: 13, lineHeight: 17 },
  kanji: { fontFamily: 'System', fontWeight: '500' as const, fontSize: 120, lineHeight: 130 },
  kanjiSmall: { fontFamily: 'System', fontWeight: '500' as const, fontSize: 64, lineHeight: 72 },
  reading: { fontFamily: 'System', fontWeight: '400' as const, fontSize: 20, lineHeight: 26 },
} as const;

export const layout = {
  maxWidth: 480,
  cardPadding: 20,
  gutter: 16,
} as const;

export const animation = {
  spring: { damping: 18, stiffness: 200, mass: 0.9 },
  flip: { duration: 350 },
} as const;
