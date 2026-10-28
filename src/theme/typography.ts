/**
 * PakPadel typography — Barlow font family throughout.
 *
 * Barlow is a slightly condensed, athletic sans-serif that suits the padel
 * sports context. Loaded via the expo-font config plugin (app.json), so all
 * weights are available on native immediately with no useFonts() hook needed.
 *
 * Font family name on native = filename without extension.
 * On web we fall back to the CSS stack in global.css.
 */

import { Platform } from 'react-native';

// ── Font family map ───────────────────────────────────────────────────────────
// React Native matches these strings to the embedded font files by name.
export const fontFamily = {
  regular: Platform.select({ web: 'Barlow, system-ui, sans-serif', default: 'Barlow-Regular' }),
  medium: Platform.select({ web: 'Barlow, system-ui, sans-serif', default: 'Barlow-Medium' }),
  semibold: Platform.select({ web: 'Barlow, system-ui, sans-serif', default: 'Barlow-SemiBold' }),
  bold: Platform.select({ web: 'Barlow, system-ui, sans-serif', default: 'Barlow-Bold' }),
  extraBold: Platform.select({ web: 'Barlow, system-ui, sans-serif', default: 'Barlow-ExtraBold' }),
  black: Platform.select({ web: 'Barlow, system-ui, sans-serif', default: 'Barlow-Black' }),
  light: Platform.select({ web: 'Barlow, system-ui, sans-serif', default: 'Barlow-Light' }),
  italic: Platform.select({ web: 'Barlow, system-ui, sans-serif', default: 'Barlow-Italic' }),
  // Legacy alias used by padel-splash and a few older components
  display: Platform.select({ web: 'Barlow, system-ui, sans-serif', default: 'Barlow-Black' }),
  body: Platform.select({ web: 'Barlow, system-ui, sans-serif', default: 'Barlow-Regular' }),
  Fancy: Platform.select({ web: 'Barlow, system-ui, sans-serif', default: 'CevicheOne-Regular' }),
} as const;

// ── Font size scale ───────────────────────────────────────────────────────────
export const fontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  '2xl': 28,
  '3xl': 34,
  '4xl': 42,
  hero: 52,
  xhero: 60,
} as const;

/**
 * fontWeight values for when a component uses system fonts (web) or cannot
 * use a specific Barlow variant. On native, always prefer fontFamily instead
 * of fontWeight — mixing named Barlow families with fontWeight on native gives
 * unexpected results because RN picks a different font file.
 */
export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  heavy: '800' as const,
} as const;

// ── Line height & letter spacing ──────────────────────────────────────────────
export const lineHeight = {
  tight: 1.1,
  snug: 1.25,
  normal: 1.45,
  relaxed: 1.6,
} as const;

export const letterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
} as const;
