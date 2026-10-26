/** 4-point grid spacing scale */
export const spacing = {
  px:   1,
  0.5:  2,
  1:    4,
  1.5:  6,
  2:    8,
  3:    12,
  4:    16,
  5:    20,
  6:    24,
  7:    28,
  8:    32,
  10:   40,
  12:   48,
  16:   64,
  20:   80,
  24:   96,
} as const;

export const radius = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  '2xl':24,
  full: 9999,
} as const;

export const shadow = {
  sm:   '0 1px 2px rgba(0,0,0,0.18)',
  md:   '0 4px 12px rgba(0,0,0,0.28)',
  lg:   '0 8px 24px rgba(0,0,0,0.40)',
} as const;
