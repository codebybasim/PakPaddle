import { Platform } from 'react-native';

/**
 * PakPadel typography scale.
 * Display headings use system-ui rounded on iOS for the sporty condensed feel.
 * Body uses the default system sans at every weight.
 */
export const fontFamily = Platform.select({
  ios: {
    display:  'ui-rounded',  // SF Pro Rounded — bold, sporty
    body:     'system-ui',
    mono:     'ui-monospace',
  },
  android: {
    display:  'normal',
    body:     'normal',
    mono:     'monospace',
  },
  default: {
    display:  'system-ui',
    body:     'system-ui',
    mono:     'monospace',
  },
});

export const fontSize = {
  xs:    11,
  sm:    13,
  base:  15,
  md:    17,
  lg:    20,
  xl:    24,
  '2xl': 28,
  '3xl': 34,
  '4xl': 42,
  hero:  52,
} as const;

export const fontWeight = {
  regular:   '400' as const,
  medium:    '500' as const,
  semibold:  '600' as const,
  bold:      '700' as const,
  heavy:     '800' as const,
} as const;

export const lineHeight = {
  tight:   1.1,
  snug:    1.25,
  normal:  1.45,
  relaxed: 1.6,
} as const;

export const letterSpacing = {
  tight:   -0.5,
  normal:   0,
  wide:     0.5,
  wider:    1,
} as const;
