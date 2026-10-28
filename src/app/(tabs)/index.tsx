import { useState } from 'react';
import { FlatList, Keyboard, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CourtCard } from '@/components/home/CourtCard';
import { MatchCard } from '@/components/home/MatchCard';
import { SearchableTopBar } from '@/components/home/SearchableTopBar';
import { SectionHeader } from '@/components/home/SectionHeader';
import {
  FEATURED_COURTS,
  FEATURED_MATCHES,
  FILTER_CHIPS,
  MATCH_CARD_W
} from '@/constants/home';
import { useAppSelector } from '@/store/hooks';
import { brand, light } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fontFamily, fontSize, letterSpacing } from '@/theme/typography';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const user = useAppSelector((s) => s.auth.user);
  const firstName = user?.fullName?.split(' ')[0] ?? 'Padeler';

  const [activeFilter, setActiveFilter] = useState('All');
  const [activeSlide, setActiveSlide] = useState(0);
  const [likedCards, setLikedCards] = useState<Record<string, boolean>>({});
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const bottomPad = (insets.bottom || 16) + 88;

  function handleOpenSearch() {
    setSearchOpen(true);
  }

  function handleCloseSearch() {
    Keyboard.dismiss();
    setSearchOpen(false);
    setSearchQuery('');
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{ paddingBottom: bottomPad }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* ── Top bar (animated search) ────────────────────────────────── */}
      <Animated.View entering={FadeInDown.duration(380).delay(0)}>
        <SearchableTopBar
          paddingTop={insets.top + spacing[3]}
          searchOpen={searchOpen}
          searchQuery={searchQuery}
          onOpenSearch={handleOpenSearch}
          onCloseSearch={handleCloseSearch}
          onQueryChange={setSearchQuery}
          onFilterPress={() => { /* TODO: open filter sheet */ }}
        />
      </Animated.View>

      {/* ── Headline ───────────────────────────────────────────────────── */}
      <Animated.View entering={FadeInDown.duration(380).delay(60)} style={styles.headlineWrap}>
        <Text style={styles.greeting}>Hello, {firstName} 👋</Text>
        <Text style={styles.headline}>FIND YOUR{'\n'}NEXT MATCH</Text>
        <Text style={styles.subheadline}>Players, courts and games near you</Text>
      </Animated.View>

      {/* ── Filter chips ───────────────────────────────────────────────── */}
      <Animated.View entering={FadeInDown.duration(380).delay(120)}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {FILTER_CHIPS.map((chip) => {
            const active = activeFilter === chip;
            return (
              <Pressable
                key={chip}
                onPress={() => setActiveFilter(chip)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {chip}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </Animated.View>

      {/* ── Featured match carousel ─────────────────────────────────────── */}
      <Animated.View entering={FadeInDown.duration(380).delay(180)}>
        <FlatList
          data={FEATURED_MATCHES}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToAlignment="center"
          decelerationRate="fast"
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.carouselContent}
          onMomentumScrollEnd={(e) => {
            setActiveSlide(Math.round(e.nativeEvent.contentOffset.x / MATCH_CARD_W));
          }}
          renderItem={({ item }) => (
            <MatchCard
              item={item}
              liked={!!likedCards[item.id]}
              onLike={() => setLikedCards((p) => ({ ...p, [item.id]: !p[item.id] }))}
            />
          )}
        />
        <View style={styles.dots}>
          {FEATURED_MATCHES.map((_, i) => (
            <View key={i} style={[styles.dot, i === activeSlide && styles.dotActive]} />
          ))}
        </View>
      </Animated.View>

      {/* ── Nearby Players ──────────────────────────────────────────────── */}
      {/* <Animated.View entering={FadeInDown.duration(380).delay(240)}>
        <SectionHeader title="Nearby Players" onSeeAll={() => { }} />
        <FlatList
          data={NEARBY_PLAYERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.playerRow}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInRight.duration(320).delay(index * 60)}>
              <PlayerCard player={item} />
            </Animated.View>
          )}
        />
      </Animated.View> */}

      {/* ── Featured Courts ─────────────────────────────────────────────── */}
      <Animated.View entering={FadeInDown.duration(380).delay(300)}>
        <SectionHeader title="Featured Courts" onSeeAll={() => { }} />
        {FEATURED_COURTS.map((court) => (
          <CourtCard key={court.id} court={court} />
        ))}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: light.background,
  },

  // ── Headline ─────────────────────────────────────────────────────────────────
  headlineWrap: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[4],
    gap: spacing[1],
  },
  greeting: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.medium,
    color: light.textSecondary,
    marginBottom: spacing[1],
  },
  headline: {
    fontSize: fontSize.hero,
    fontFamily: fontFamily.extraBold,
    color: light.text,
    lineHeight: fontSize['4xl'],
    letterSpacing: letterSpacing.tight,
  },
  subheadline: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.regular,
    color: light.textSecondary,
    marginTop: spacing[1],
  },

  // ── Filter chips ─────────────────────────────────────────────────────────────
  chipRow: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[4],
    gap: spacing[2],
  },
  chip: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[1.5],
    borderRadius: radius.full,
    backgroundColor: light.card,
    borderWidth: 1.5,
    borderColor: light.border,
  },
  chipActive: {
    backgroundColor: brand.primary,
    borderColor: brand.primary,
  },
  chipText: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.semibold,
    color: light.textSecondary,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },

  // ── Carousel ─────────────────────────────────────────────────────────────────
  carouselContent: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[2],
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[1],
    marginBottom: spacing[5],
    marginTop: spacing[2],
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: light.border,
  },
  dotActive: {
    width: 18,
    backgroundColor: brand.primary,
  },

  // ── Players ──────────────────────────────────────────────────────────────────
  playerRow: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[5],
    gap: spacing[4],
  },
});
