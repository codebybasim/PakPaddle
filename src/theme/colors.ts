/**
 * PakPadel brand color tokens.
 * Pakistan-inspired premium sports palette.
 * Primary scheme: clean white light mode.
 * Brand: deep Pakistan green (#01411C) with emerald accent (#228B4E).
 */

export const palette = {
  // ── Brand ──────────────────────────────────────────────────────────────────
  green: '#01411C',   // Pakistan green — primary CTA, accents
  greenMid: '#228B4E',   // emerald — hover/active states
  greenLight: '#D6EFE0',   // tint — chip backgrounds, light fills
  greenDark: '#003014',   // deep green — pressed states

  // ── Light-mode surfaces (default) ──────────────────────────────────────────
  white: '#FFFFFF',
  lSurface0: '#F7FAF8',   // page background
  lSurface1: '#FFFFFF',   // card / input
  lSurface2: '#EEF5F0',   // elevated card
  lSurface3: '#DDEAE1',   // pressed / selected

  // ── Dark-mode surfaces ─────────────────────────────────────────────────────
  black: '#050B07',
  dSurface0: '#080F0A',
  dSurface1: '#101A13',
  dSurface2: '#18271C',
  dSurface3: '#22382A',

  // ── Text — light mode ──────────────────────────────────────────────────────
  lTextPrimary: '#102117',
  lTextSecondary: '#46594B',
  lTextMuted: '#748579',
  lTextOnGreen: '#FFFFFF',

  // ── Text — dark mode ───────────────────────────────────────────────────────
  dTextPrimary: '#F5FFF7',
  dTextSecondary: '#A7B8AB',
  dTextMuted: '#718276',

  // ── Borders ────────────────────────────────────────────────────────────────
  borderLight: '#D7E3D9',
  borderDark: '#293A2E',

  // ── Semantic ───────────────────────────────────────────────────────────────
  success: '#16A34A',
  error: '#DC2626',
  warning: '#D97706',
  errorLight: '#FEE2E2',

  transparent: 'transparent',
} as const;

// ── Brand (scheme-independent) ────────────────────────────────────────────────
export const brand = {
  // Primary CTA / accent
  primary: palette.green,
  primaryMid: palette.greenMid,
  primaryLight: palette.greenLight,
  primaryDark: palette.greenDark,
  onPrimary: '#FFFFFF',

  // Kept as "amber" alias so existing code doesn't break
  amber: palette.green,
  amberLight: palette.greenMid,
  amberDark: palette.greenDark,
  onAmber: '#FFFFFF',

  // Semantic
  error: palette.error,
  errorLight: palette.errorLight,
  success: palette.success,
  warning: palette.warning,
  courtGreen: palette.greenMid,
} as const;

// ── Light scheme (default) ────────────────────────────────────────────────────
export const light = {
  background: palette.lSurface0,
  card: palette.lSurface1,
  cardElevated: palette.lSurface2,
  pressed: palette.lSurface3,
  border: palette.borderLight,
  borderFocus: palette.green,
  text: palette.lTextPrimary,
  textSecondary: palette.lTextSecondary,
  textMuted: palette.lTextMuted,
  icon: palette.lTextSecondary,
  tabBar: palette.lSurface1,
  inputBg: palette.lSurface1,
  inputText: palette.lTextPrimary,
  placeholder: palette.lTextMuted,
} as const;

// ── Dark scheme ───────────────────────────────────────────────────────────────
export const dark = {
  background: palette.dSurface0,
  card: palette.dSurface1,
  cardElevated: palette.dSurface2,
  pressed: palette.dSurface3,
  border: palette.borderDark,
  borderFocus: palette.greenMid,
  text: palette.dTextPrimary,
  textSecondary: palette.dTextSecondary,
  textMuted: palette.dTextMuted,
  icon: palette.dTextSecondary,
  tabBar: palette.dSurface1,
  inputBg: palette.dSurface1,
  inputText: palette.dTextPrimary,
  placeholder: palette.dTextMuted,
} as const;

// Legacy alias used by the old starter components
export const Colors = {
  light: {
    text: light.text,
    background: light.background,
    backgroundElement: light.cardElevated,
    backgroundSelected: light.pressed,
    textSecondary: light.textSecondary,
  },
  dark: {
    text: dark.text,
    background: dark.background,
    backgroundElement: dark.cardElevated,
    backgroundSelected: dark.pressed,
    textSecondary: dark.textSecondary,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;
