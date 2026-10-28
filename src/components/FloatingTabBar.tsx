/**
 * FloatingTabBar — floating pill-shaped custom tab bar.
 *
 * Visual:  dark pill (#1A1B1E) floating above safe area with shadow.
 * Active:  Pakistan-green capsule that expands to show icon + label.
 * Inactive: icon only, muted white.
 * Motion:  spring-animated width expansion on tab switch (UI thread).
 */

import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs/index';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { palette } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fontFamily, fontSize } from '@/theme/typography';

// ── Tab config ────────────────────────────────────────────────────────────────
type TabCfg = {
  name: string;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
};

const TABS: TabCfg[] = [
  { name: 'index', label: 'Home', icon: 'home-outline' },
  { name: 'bookings', label: 'Bookings', icon: 'calendar-outline' },
  // { name: 'messages', label: 'Messages', icon: 'message-circle' },
  { name: 'profile', label: 'Profile', icon: 'person-outline' },
];

// ── Design tokens ─────────────────────────────────────────────────────────────
const BAR_BG = '#1A1B1E';
const ACTIVE_BG = palette.greenMid;          // Pakistan green #01411C
const ACTIVE_ICON = '#FFFFFF';
const INACTIVE_ICON = 'rgba(255, 255, 255, 0.56)';
const BAR_H = 52;
const PILL_H = 44;
const ICON_SIZE = 18;

// ── FloatingTabBar ────────────────────────────────────────────────────────────
export function FloatingTabBar({ state, navigateToTab, emitter }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.wrapper, { bottom: Math.max(insets.bottom, spacing[4]) + spacing[2] }]}
      pointerEvents="box-none"
    >
      <View style={styles.bar}>
        {TABS.map((tab) => {
          const route = state.routes.find((r: { name: string }) => r.name === tab.name);
          const isFocused = route ? state.index === state.routes.indexOf(route) : false;

          const onPress = () => {
            if (!route) return;
            const event = emitter.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigateToTab(route.key);
            }
          };

          return (
            <TabItem
              key={tab.name}
              tab={tab}
              isFocused={isFocused}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
}

// ── TabItem ───────────────────────────────────────────────────────────────────
function TabItem({
  tab,
  isFocused,
  onPress,
}: {
  tab: TabCfg;
  isFocused: boolean;
  onPress: () => void;
}) {
  const expanded = useSharedValue(isFocused ? 1 : 0);

  if (isFocused && expanded.value === 0) {
    expanded.set(withSpring(1, { duration: 380, dampingRatio: 0.75 }));
  } else if (!isFocused && expanded.value === 1) {
    expanded.set(withSpring(0, { duration: 280, dampingRatio: 1 }));
  }

  const pillStyle = useAnimatedStyle(() => ({
    paddingHorizontal: 10 + expanded.value * 8,
    paddingLeft: isFocused ? 12 + expanded.value * 8 : 0,
    backgroundColor: isFocused ? ACTIVE_BG : 'transparent',
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: expanded.value,
    width: expanded.value * 66,
    marginLeft: expanded.value * 15,
  }));

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={tab.label}
      accessibilityState={{ selected: isFocused }}
      hitSlop={6}
      style={[styles.pressable, { width: isFocused ? "40%" : "20%", }]}
    >
      <Animated.View style={[styles.pill, pillStyle]}>
        <View style={styles.iconView}>
          <Ionicons
            name={tab.icon}
            size={ICON_SIZE}
            color={isFocused ? ACTIVE_ICON : INACTIVE_ICON}
          />
        </View>
        <Animated.Text numberOfLines={1} style={[styles.label, labelStyle]}>
          {tab.label}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: spacing[5],
    right: spacing[5],
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BAR_BG,
    borderRadius: BAR_H / 2,
    height: BAR_H,
    paddingHorizontal: spacing[1],
    gap: spacing[1],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.32,
    shadowRadius: 18,
    elevation: 16,
  },
  pressable: {
    // flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
    height: BAR_H,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: PILL_H,
    borderRadius: PILL_H / 2,
    overflow: 'hidden',
  },
  iconView: {
    width: 36,
    height: 36,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: BAR_BG
  },
  label: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bold,
    color: ACTIVE_ICON,
    includeFontPadding: false,
  },
});
