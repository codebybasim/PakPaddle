/**
 * PakPadel splash screen animation.
 *
 * Sequence (total ~1 800 ms after native splash hides):
 *  0 ms  — court lines draw in from center (scale + opacity)
 *  300ms — paddle enters from bottom-right, rotates to rest angle
 *  600ms — ball bounces in from top, elastic settle
 *  900ms — "PakPadel" wordmark fades + slides up
 * 1 100ms — tagline fades in
 * 1 600ms — everything fades out → overlay unmounts
 *
 * All animations run on the UI thread via Reanimated CSS keyframes /
 * useSharedValue. No setState from gestures or scroll handlers.
 */

import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  cubicBezier,
  Easing,
  Keyframe,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { brand, light } from '@/theme/colors';
import { fontFamily, fontSize, letterSpacing } from '@/theme/typography';

const { width: SW, height: SH } = Dimensions.get('screen');

// ─── timing constants ────────────────────────────────────────────────────────
const T_COURT = 0;
const T_PADDLE = 300;
const T_BALL = 550;
const T_WORDMARK = 850;
const T_TAGLINE = 1050;
const T_FADEOUT = 1650;
const D_FADEOUT = 350;

// Cubic bezier instances (Reanimated CSS-style)
const EASE_OUT = cubicBezier(0.23, 1, 0.32, 1);

// ─── keyframes (defined outside component — stable references) ───────────────

// Court lines: scale X from 0 → 1 + fade in
const courtKeyframe = new Keyframe({
  0: { opacity: 0, transform: [{ scaleX: 0 }] },
  100: { opacity: 1, transform: [{ scaleX: 1 }], easing: Easing.bezier(0.23, 1, 0.32, 1) },
});

// Paddle: slides in from bottom-right + rotates to -35°
const paddleKeyframe = new Keyframe({
  0: { opacity: 0, transform: [{ translateX: 60 }, { translateY: 60 }, { rotate: '0deg' }] },
  60: { opacity: 1 },
  100: {
    opacity: 1, transform: [{ translateX: 0 }, { translateY: 0 }, { rotate: '-35deg' }],
    easing: Easing.bezier(0.23, 1, 0.32, 1)
  },
});

// Wordmark: slides up + fades in
const wordmarkKeyframe = new Keyframe({
  0: { opacity: 0, transform: [{ translateY: 18 }] },
  100: { opacity: 1, transform: [{ translateY: 0 }], easing: Easing.bezier(0.23, 1, 0.32, 1) },
});

// Tagline: fade only
const taglineKeyframe = new Keyframe({
  0: { opacity: 0 },
  100: { opacity: 1, easing: Easing.bezier(0.23, 1, 0.32, 1) },
});

// Full overlay fade-out
const fadeOutKeyframe = new Keyframe({
  0: { opacity: 1 },
  100: { opacity: 0, easing: Easing.bezier(0.77, 0, 0.175, 1) },
});

// ─── ball: driven by useSharedValue for the spring bounce ────────────────────

interface SplashOverlayProps {
  onDone: () => void;
}

export function PadelSplashOverlay({ onDone }: SplashOverlayProps) {
  // Ball position — spring bounce from off-screen top
  const ballY = useSharedValue(-120);
  const ballOpacity = useSharedValue(0);
  const hiddenNativeSplash = useRef(false);

  const ballStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: ballY.value }],
    opacity: ballOpacity.value,
  }));

  // Hide the native splash screen on first layout
  const handleLayout = useCallback(() => {
    if (hiddenNativeSplash.current) return;
    hiddenNativeSplash.current = true;
    SplashScreen.hideAsync().catch(() => { });
  }, []);

  const startBall = useCallback(() => {
    ballOpacity.set(withTiming(1, { duration: 80 }));
    ballY.set(
      withSequence(
        withSpring(0, { duration: 500, dampingRatio: 0.55, velocity: 8 }),
        withSpring(-14, { duration: 220, dampingRatio: 0.6 }),
        withSpring(0, { duration: 300, dampingRatio: 1 }),
      ),
    );
  }, [ballY, ballOpacity]);

  useEffect(() => {
    const t = setTimeout(startBall, T_BALL);
    return () => clearTimeout(t);
  }, [startBall]);

  return (
    <Animated.View
      style={styles.overlay}
      onLayout={handleLayout}
    >
      {/* ── inner content — animated as one block fading out ─────────────── */}
      <Animated.View
        style={styles.content}
        entering={fadeOutKeyframe
          .delay(T_FADEOUT)
          .duration(D_FADEOUT)
          .withCallback((finished) => {
            'worklet';
            if (finished) scheduleOnRN(onDone);
          })}
      >
        {/* Court grid */}
        <Animated.View
          style={styles.courtWrap}
          entering={courtKeyframe.delay(T_COURT).duration(380)}
        >
          <CourtLines />
        </Animated.View>

        {/* Paddle + ball stack */}
        <View style={styles.paddleAndBallWrap}>
          {/* Ball */}
          <Animated.View style={[styles.ball, ballStyle]} />

          {/* Paddle */}
          <Animated.View
            style={styles.paddle}
            entering={paddleKeyframe.delay(T_PADDLE).duration(420)}
          >
            <PaddleShape />
          </Animated.View>
        </View>

        {/* Wordmark */}
        <Animated.Text
          style={styles.wordmark}
          entering={wordmarkKeyframe.delay(T_WORDMARK).duration(320)}
        >
          PakPadel
        </Animated.Text>

        {/* Tagline */}
        <Animated.Text
          style={styles.tagline}
          entering={taglineKeyframe.delay(T_TAGLINE).duration(280)}
        >
          Book. Play. Win.
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
}

// ─── CourtLines — pure SVG-like View composition ─────────────────────────────
function CourtLines() {
  return (
    <View style={court.container}>
      {/* Outer boundary */}
      <View style={court.outerRect} />
      {/* Center service line */}
      <View style={court.centerV} />
      {/* Net line */}
      <View style={court.netH} />
      {/* Service boxes left */}
      <View style={[court.serviceH, { top: '25%' }]} />
      {/* Service boxes right */}
      <View style={[court.serviceH, { top: '75%' }]} />
    </View>
  );
}

// ─── PaddleShape — geometric paddle silhouette ───────────────────────────────
function PaddleShape() {
  return (
    <View style={paddle.wrap}>
      {/* Head */}
      <View style={paddle.head} />
      {/* Neck */}
      <View style={paddle.neck} />
      {/* Handle */}
      <View style={paddle.handle} />
      {/* Grip wrap */}
      <View style={paddle.grip} />
    </View>
  );
}

// ─── StyleSheet ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: light.background,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  content: {
    alignItems: 'center',
    gap: 20,
  },
  courtWrap: {
    // pivot from center for the scaleX entrance
    transformOrigin: 'center',
  },
  paddleAndBallWrap: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 130,
  },
  ball: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: brand.amberLight,
    position: 'absolute',
    top: 0,
    // slight yellow-green tint for padel ball authenticity
    shadowColor: brand.amberLight,
    shadowOpacity: 0.6,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  paddle: {
    // entering animation applies rotate — base style is neutral
  },
  wordmark: {
    fontSize: fontSize['3xl'],
    fontFamily: fontFamily.extraBold,
    color: brand.amber,
    letterSpacing: letterSpacing.tight,
    includeFontPadding: false,
  },
  tagline: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.medium,
    color: brand.amber,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase' as const,
  },
});

// Court geometry
const COURT_W = SW * 0.68;
const COURT_H = COURT_W * 0.55;
const LINE_W = 1.5;
const LINE_C = brand.amberLight; // amber, dimmed

const court = StyleSheet.create({
  container: {
    width: COURT_W,
    height: COURT_H,
  },
  outerRect: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderWidth: LINE_W,
    borderColor: LINE_C,
    borderRadius: 4,
  },
  centerV: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: LINE_W,
    backgroundColor: LINE_C,
    marginLeft: -LINE_W / 2,
  },
  netH: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: LINE_W * 2,
    backgroundColor: brand.amber,
    opacity: 0.9,
    marginTop: -LINE_W,
  },
  serviceH: {
    position: 'absolute',
    left: '10%',
    right: '10%',
    height: LINE_W,
    backgroundColor: LINE_C,
  },
});

// Paddle geometry
const paddle = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  head: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: brand.amberLight,
    // perforated look via slight transparency at edges isn't possible in pure Views,
    // but the solid amber circle reads clearly as a padel head
  },
  neck: {
    width: 14,
    height: 12,
    backgroundColor: '#1A1A1A',  // darker amber
  },
  handle: {
    width: 10,
    height: 36,
    borderRadius: 5,
    backgroundColor: '#1A1A1A',
    borderWidth: 1.5,
    borderColor: 'rgba(11, 245, 19, 0.4)',
  },
  grip: {
    width: 12,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: brand.amber,
  },
});
