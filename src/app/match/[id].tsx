import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FEATURED_MATCHES } from '@/constants/home';
import { brand, light } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fontFamily, fontSize } from '@/theme/typography';

// ─── Types ────────────────────────────────────────────────────────────────────
type StatItem = { icon: React.ComponentProps<typeof Ionicons>['name']; value: string; label: string };

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.set(event.contentOffset.y);
  });

  // Header white bg fades in as user scrolls into the card
  const navBgStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.get(), [0, 60], [0, 1], Extrapolation.CLAMP),
  }));

  // Nav button icons: white over hero, dark over white bg
  const navIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.get(), [0, 60], [1, 0], Extrapolation.CLAMP),
  }));
  const navIconDarkStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.get(), [0, 60], [0, 1], Extrapolation.CLAMP),
  }));

  const match = FEATURED_MATCHES.find((m) => m.id === id);
  if (!match) return null;

  const { spotsLeft, totalSpots, players, host, stats } = match;
  const filledCount = totalSpots - spotsLeft;

  const statItems: StatItem[] = [
    { icon: 'bar-chart', value: `${stats.winRate}%`, label: 'Win rate' },
    { icon: 'trophy', value: `${stats.matches}`, label: 'Matches' },
    { icon: 'people', value: `${stats.levelAvg}`, label: 'Level avg.' },
  ];

  return (
    <View style={styles.root}>
      {/* ── Hero image (behind scroll) ──────────────────────────────── */}
      <Image
        source={{ uri: match.image }}
        style={styles.heroBg}
        resizeMode="cover"
      />
      {/* Hero overlay scrim */}
      <View style={styles.heroScrim} />

      {/* ── Sticky nav bar ──────────────────────────────────────────── */}
      <Animated.View
        style={[styles.navBar, { paddingTop: insets.top }]}
        pointerEvents="box-none"
      >
        <Animated.View style={[StyleSheet.absoluteFill, styles.navBarBg, navBgStyle]} />
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.navBtn}
          activeOpacity={0.75}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          {/* White icon on hero, dark icon on white bg */}
          <Animated.View style={[StyleSheet.absoluteFill, styles.navIconCenter, navIconStyle]}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </Animated.View>
          <Animated.View style={[StyleSheet.absoluteFill, styles.navIconCenter, navIconDarkStyle]}>
            <Ionicons name="chevron-back" size={22} color={light.text} />
          </Animated.View>
        </TouchableOpacity>
        <View style={styles.navRight}>
          <TouchableOpacity
            style={styles.navBtn}
            activeOpacity={0.75}
            accessibilityLabel="Save match"
            accessibilityRole="button"
          >
            <Animated.View style={[StyleSheet.absoluteFill, styles.navIconCenter, navIconStyle]}>
              <Ionicons name="heart-outline" size={20} color="#fff" />
            </Animated.View>
            <Animated.View style={[StyleSheet.absoluteFill, styles.navIconCenter, navIconDarkStyle]}>
              <Ionicons name="heart-outline" size={20} color={light.text} />
            </Animated.View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navBtn}
            activeOpacity={0.75}
            accessibilityLabel="More options"
            accessibilityRole="button"
          >
            <Animated.View style={[StyleSheet.absoluteFill, styles.navIconCenter, navIconStyle]}>
              <Ionicons name="ellipsis-horizontal" size={20} color="#fff" />
            </Animated.View>
            <Animated.View style={[StyleSheet.absoluteFill, styles.navIconCenter, navIconDarkStyle]}>
              <Ionicons name="ellipsis-horizontal" size={20} color={light.text} />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ── Scrollable content card ─────────────────────────────────── */}
      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
      >
        {/* Spacer that lets the hero image show through */}
        <View style={styles.heroSpacer} />

        {/* ── White card ──────────────────────────────────────────────── */}
        <View style={styles.card}>

          {/* ── Title + level badge ─────────────────────────────────── */}
          <View style={styles.titleRow}>
            <Text style={styles.matchTitle} numberOfLines={2}>{match.title}</Text>
            <View style={styles.levelBadge}>
              <Ionicons name="bar-chart" size={13} color={brand.primary} />
              <Text style={styles.levelBadgeText}>{match.levelDisplay}</Text>
            </View>
          </View>

          {/* ── Date ───────────────────────────────────────────────────── */}
          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={16} color={brand.primary} />
            <Text style={styles.metaText}>{match.dateRange}</Text>
          </View>

          {/* ── Venue ──────────────────────────────────────────────────── */}
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={16} color={brand.primary} />
            <View style={styles.metaVenueCol}>
              <Text style={styles.metaText}>{match.venue}</Text>
              <Text style={styles.metaSubText}>{match.venueCity}</Text>
            </View>
            <View style={styles.courtPill}>
              <Ionicons name="grid-outline" size={13} color={light.textSecondary} />
              <Text style={styles.courtPillText}>{match.courtName}</Text>
              <Ionicons name="chevron-forward" size={13} color={light.textMuted} />
            </View>
          </View>

          <View style={styles.divider} />

          {/* ── Players ─────────────────────────────────────────────────── */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Players ({filledCount}/{totalSpots})</Text>
            <Text style={styles.spotsLeft}>{spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left</Text>
          </View>

          <View style={styles.playersRow}>
            {players.map((p) => (
              <View key={p.id} style={styles.playerItem}>
                <View style={styles.avatarWrap}>
                  <Image source={{ uri: p.avatar }} style={styles.avatar} />
                  {p.online && <View style={styles.onlineDot} />}
                </View>
                <Text style={styles.playerName}>{p.name}</Text>
              </View>
            ))}
            {/* Empty slots */}
            {Array.from({ length: spotsLeft }).map((_, i) => (
              <View key={`empty-${i}`} style={styles.playerItem}>
                <View style={styles.emptySlot}>
                  <Ionicons name="add" size={22} color={brand.primary} />
                </View>
                <Text style={styles.playerName}>Join</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          {/* ── Host ────────────────────────────────────────────────────── */}
          <TouchableOpacity activeOpacity={0.8} style={styles.hostRow}>
            <Image source={{ uri: host.avatar }} style={styles.hostAvatar} />
            <View style={styles.hostInfo}>
              <View style={styles.hostNameRow}>
                <Text style={styles.hostLabel}>Hosted by </Text>
                <Text style={styles.hostName}>{host.name}</Text>
                {host.verified && (
                  <Ionicons name="checkmark-circle" size={16} color={brand.primary} />
                )}
              </View>
              <Text style={styles.hostMeta}>Level {host.level} · {host.matches} matches</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={light.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* ── Description ─────────────────────────────────────────────── */}
          <Text style={styles.description}>{match.description}</Text>

          <View style={styles.divider} />

          {/* ── Stats row ───────────────────────────────────────────────── */}
          <View style={styles.statsRow}>
            {statItems.map((s, idx) => (
              <View
                key={s.label}
                style={[
                  styles.statItem,
                  idx < statItems.length - 1 && styles.statItemBorder,
                ]}
              >
                <View style={styles.statIconValue}>
                  <Ionicons name={s.icon} size={18} color={brand.primary} />
                  <Text style={styles.statValue}>{s.value}</Text>
                </View>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

        </View>
      </Animated.ScrollView>

      {/* ── Bottom CTAs ─────────────────────────────────────────────── */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing[3] }]}>
        <TouchableOpacity
          style={styles.joinBtn}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Join match"
        >
          <Ionicons name="people" size={20} color="#fff" />
          <Text style={styles.joinBtnText}>Join match</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const HERO_H = 260;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: light.card,
  },

  // ── Hero ─────────────────────────────────────────────────────────────────────
  heroBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HERO_H + 40,
    zIndex: 0,
  },
  heroScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HERO_H + 40,
    backgroundColor: 'rgba(0,0,0,0.38)',
    zIndex: 1,
  },
  heroTextWrap: {
    position: 'absolute',
    left: spacing[6],
    zIndex: 2,
  },
  heroTitle: {
    fontSize: 48,
    fontFamily: fontFamily.black,
    color: '#FFFFFF',
    letterSpacing: 1,
    lineHeight: 50,
  },
  heroSub: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.medium,
    color: 'rgba(255,255,255,0.85)',
    marginTop: spacing[1],
  },

  // ── Nav bar ──────────────────────────────────────────────────────────────────
  navBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[3],
    zIndex: 10,
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBarBg: {
    backgroundColor: light.card,
    borderBottomWidth: 1,
    borderBottomColor: light.border,
  },
  navIconCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navRight: {
    flexDirection: 'row',
    gap: spacing[2],
  },

  // ── Scroll ───────────────────────────────────────────────────────────────────
  scroll: {
    flex: 1,
    zIndex: 3,
  },
  heroSpacer: {
    height: HERO_H - 24,
  },

  // ── Card ─────────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: light.card,
    borderTopLeftRadius: radius['2xl'],
    borderTopRightRadius: radius['2xl'],
    paddingHorizontal: spacing[6],
    paddingTop: spacing[6],
    paddingBottom: spacing[4],
    minHeight: 600,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: -4 },
    // shadowOpacity: 0.06,
    // shadowRadius: 12,
    // elevation: 8,
  },

  // ── Title + level ─────────────────────────────────────────────────────────────
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
    gap: spacing[3],
  },
  matchTitle: {
    flex: 1,
    fontSize: fontSize['2xl'],
    fontFamily: fontFamily.bold,
    color: light.text,
    lineHeight: 32,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    backgroundColor: brand.primaryLight,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
    borderRadius: radius.full,
    flexShrink: 0,
    marginTop: spacing[1],
  },
  levelBadgeText: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.semibold,
    color: brand.primary,
  },

  // ── Meta rows ─────────────────────────────────────────────────────────────────
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  metaVenueCol: {
    flex: 1,
  },
  metaText: {
    flex: 1,
    fontSize: fontSize.base,
    fontFamily: fontFamily.medium,
    color: light.text,
  },
  metaSubText: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: light.textMuted,
    marginTop: 2,
  },
  courtPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    backgroundColor: light.cardElevated,
    borderRadius: radius.md,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
  },
  courtPillText: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.semibold,
    color: light.textSecondary,
  },

  // ── Divider ───────────────────────────────────────────────────────────────────
  divider: {
    height: 1,
    backgroundColor: light.border,
    marginVertical: spacing[4],
  },

  // ── Players ───────────────────────────────────────────────────────────────────
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.bold,
    color: light.text,
  },
  spotsLeft: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.semibold,
    color: brand.primary,
  },
  playersRow: {
    flexDirection: 'row',
    gap: spacing[5],
    alignItems: 'flex-start',
  },
  playerItem: {
    alignItems: 'center',
    gap: spacing[1.5],
  },
  avatarWrap: {
    position: 'relative',
    width: 56,
    height: 56,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2.5,
    borderColor: light.card,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: brand.primaryMid,
    borderWidth: 2,
    borderColor: light.card,
  },
  playerName: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.medium,
    color: light.textSecondary,
  },
  emptySlot: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: light.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: light.cardElevated,
  },

  // ── Host ──────────────────────────────────────────────────────────────────────
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  pressed: {
    opacity: 0.75,
  },
  hostAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: brand.primaryLight,
  },
  hostInfo: {
    flex: 1,
  },
  hostNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  hostLabel: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.regular,
    color: light.textSecondary,
  },
  hostName: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.bold,
    color: light.text,
  },
  hostMeta: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: light.textMuted,
    marginTop: 2,
  },

  // ── Description ───────────────────────────────────────────────────────────────
  description: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.regular,
    color: light.textSecondary,
    lineHeight: 22,
  },

  // ── Stats ─────────────────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    backgroundColor: light.cardElevated,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing[4],
    gap: spacing[1.5],
  },
  statItemBorder: {
    borderRightWidth: 1,
    borderRightColor: light.border,
  },
  statIconValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1.5],
  },
  statValue: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.bold,
    color: light.text,
  },
  statLabel: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.regular,
    color: light.textMuted,
  },

  // ── Bottom bar ────────────────────────────────────────────────────────────────
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: light.card,
    borderTopWidth: 1,
    borderTopColor: light.border,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[4],
    gap: spacing[3],
    zIndex: 20,
  },
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    backgroundColor: brand.primary,
    borderRadius: radius.xl,
    paddingVertical: spacing[4],
  },
  joinBtnText: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.bold,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  messageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingVertical: spacing[2],
  },
  messageBtnText: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.medium,
    color: light.textSecondary,
  },
});
