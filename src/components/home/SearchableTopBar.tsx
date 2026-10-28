/**
 * SearchableTopBar
 *
 * Idle:    [📍 Islamabad, PK ▾]              [🔍] [⚙]
 * Search:  [🔍 Search courts, players... ──────────] [✕]
 *
 * The search input is **absolutely positioned** over the entire row so it can
 * grow edge-to-edge. It slides in from the right with translateX, giving the
 * "expanding from the icon" feel. The close button sits outside the absolute
 * layer so it stays tappable at all times.
 *
 * All animation on the UI thread via Reanimated shared values.
 */

import { Ionicons } from '@expo/vector-icons';
import { ElementRef, useRef } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { brand, light } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fontFamily, fontSize } from '@/theme/typography';

const DURATION = 280;
const EASE = Easing.bezier(0.23, 1, 0.32, 1);

// Width of the close button so the input doesn't overlap it
const CLOSE_BTN_W = 38 + spacing[2]; // button + gap

interface SearchableTopBarProps {
  paddingTop: number;
  searchOpen: boolean;
  searchQuery: string;
  onOpenSearch: () => void;
  onCloseSearch: () => void;
  onQueryChange: (q: string) => void;
  onFilterPress: () => void;
}

export function SearchableTopBar({
  paddingTop,
  searchOpen,
  searchQuery,
  onOpenSearch,
  onCloseSearch,
  onQueryChange,
  onFilterPress,
}: SearchableTopBarProps) {
  const inputRef = useRef<ElementRef<typeof TextInput>>(null);
  const progress = useSharedValue(0);

  // Drive animation from render (safe — no setState, purely worklet-driven)
  if (searchOpen && progress.value < 1) {
    progress.set(withTiming(1, { duration: DURATION, easing: EASE }));
    setTimeout(() => inputRef.current?.focus(), 100);
  } else if (!searchOpen && progress.value > 0) {
    progress.set(withTiming(0, { duration: DURATION, easing: EASE }));
  }

  // ── Idle layer (location + filter) ────────────────────────────────────────
  const idleStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [{ translateX: -20 * progress.value }],
    pointerEvents: progress.value > 0.5 ? ('none' as const) : ('auto' as const),
  }));

  // ── Search overlay — slides from right edge to cover the full row ──────────
  // Starts at translateX = full-row-width (off-screen right), ends at 0
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    // Slide in from the right: start fully off-right, end at left=0
    transform: [{ translateX: (1 - progress.value) * 200 }],
    pointerEvents: progress.value < 0.4 ? ('none' as const) : ('auto' as const),
  }));

  // ── Icon morph: search → close ─────────────────────────────────────────────
  const searchIconAnim = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    position: 'absolute' as const,
  }));
  const closeIconAnim = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ rotate: `${progress.value * 90}deg` }],
    position: 'absolute' as const,
  }));

  return (
    <View style={[styles.container, { paddingTop }]}>
      <View style={styles.row}>

        {/* ── Idle layer: location + filter icon ──────────────────────── */}
        <Animated.View style={[StyleSheet.absoluteFill, styles.idleLayer, idleStyle]}>
          <Pressable style={styles.locationBtn} hitSlop={8}>
            <Ionicons name="location-sharp" size={16} color={brand.primary} />
            <Text style={styles.locationText}>Islamabad, PK</Text>
            <Ionicons name="chevron-down" size={14} color={light.textSecondary} />
          </Pressable>

          <View style={styles.idleActions}>
            <Pressable style={styles.iconBtn} onPress={onFilterPress} hitSlop={8}>
              <Ionicons name="options-outline" size={20} color={light.text} />
            </Pressable>
            {/* placeholder so layout matches — real search btn is below */}
            <View style={styles.iconBtn} />
          </View>
        </Animated.View>

        {/* ── Search overlay: full-width input ────────────────────────── */}
        <Animated.View style={[styles.searchOverlay, overlayStyle]}>
          <View style={styles.searchInputWrap}>
            <Ionicons name="search" size={16} color={light.textMuted} />
            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={onQueryChange}
              placeholder="Search courts, players..."
              placeholderTextColor={light.placeholder}
              returnKeyType="search"
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
        </Animated.View>

        {/* ── Spacer so the row has height even when idle layer is absolute */}
        <View style={styles.rowSpacer} />

        {/* ── Search / Close button — always on top ───────────────────── */}
        <Pressable
          style={styles.iconBtn}
          hitSlop={8}
          onPress={searchOpen ? onCloseSearch : onOpenSearch}
          accessibilityLabel={searchOpen ? 'Close search' : 'Open search'}
        >
          <Animated.View style={styles.iconStack}>
            <Animated.View style={searchIconAnim}>
              <Ionicons name="search" size={20} color={light.text} />
            </Animated.View>
            <Animated.View style={closeIconAnim}>
              <Ionicons name="close" size={22} color={light.text} />
            </Animated.View>
          </Animated.View>
        </Pressable>

      </View>
    </View>
  );
}

const ROW_H = 44;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[3],
  },

  // The row is the positioning context for the absolute layers
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ROW_H,
  },

  // Spacer fills the space left of the close button so the row has width
  rowSpacer: {
    flex: 1,
  },

  // ── Idle layer ────────────────────────────────────────────────────────────
  idleLayer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  locationText: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.semibold,
    color: light.text,
  },
  idleActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },

  // ── Search overlay ────────────────────────────────────────────────────────
  // Absolutely fills the row minus the close button on the right
  searchOverlay: {
    position: 'absolute',
    left: 0,
    right: CLOSE_BTN_W,  // leave room for the close button
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  searchInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: light.card,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: light.border,
    paddingHorizontal: spacing[4],
    height: ROW_H,
    gap: spacing[2],
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.base,
    fontFamily: fontFamily.regular,
    color: light.inputText,
    paddingVertical: 0,
  },

  // ── Shared icon button ────────────────────────────────────────────────────
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: light.card,
    borderWidth: 1,
    borderColor: light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStack: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
