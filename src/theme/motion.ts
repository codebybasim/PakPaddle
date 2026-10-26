import { Easing } from 'react-native-reanimated';

export const duration = {
  press:  120,   // press feedback
  fast:   180,   // small state changes
  base:   260,   // standard enter/exit
  slow:   420,   // large surfaces, sheets
} as const;

// Strong ease-out — elements entering the screen
export const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);
// On-screen movement
export const EASE_IN_OUT = Easing.bezier(0.77, 0, 0.175, 1);

export const spring = {
  // Default settle — no overshoot
  default: { duration: 400, dampingRatio: 1 } as const,
  // Bouncy — gestures, snap-back after drag
  bouncy:  { duration: 400, dampingRatio: 0.8 } as const,
  // Sheet / modal
  sheet:   { duration: 300, dampingRatio: 0.8 } as const,
} as const;
