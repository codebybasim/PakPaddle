import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  FEATURED_COURTS,
  type CourtAmenity,
  type CourtSurface,
  type FeaturedCourt,
} from '@/constants/home';
import { brand, light, palette } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fontFamily, fontSize } from '@/theme/typography';

// ─── Constants ────────────────────────────────────────────────────────────────
type SortKey = 'distance' | 'rating' | 'price_low' | 'price_high';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'distance', label: 'Nearest' },
  { key: 'rating', label: 'Top rated' },
  { key: 'price_low', label: 'Price: Low' },
  { key: 'price_high', label: 'Price: High' },
];

const SURFACE_FILTERS: { key: CourtSurface | 'All'; label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { key: 'All', label: 'All', icon: 'apps-outline' },
  { key: 'Outdoor', label: 'Outdoor', icon: 'sunny-outline' },
  { key: 'Indoor', label: 'Indoor', icon: 'home-outline' },
  { key: 'Covered', label: 'Covered', icon: 'umbrella-outline' },
];

const CITY_FILTERS = ['All', 'Islamabad', 'Lahore', 'Karachi', 'Rawalpindi'] as const;

const SURFACE_COLOR: Record<CourtSurface, { bg: string; text: string }> = {
  Outdoor: { bg: '#D6EFE0', text: '#01411C' },
  Indoor: { bg: '#E0EDF7', text: '#1A3F60' },
  Covered: { bg: '#F5EDD6', text: '#7A4800' },
};

const AMENITY_ICON: Record<CourtAmenity, React.ComponentProps<typeof Ionicons>['name']> = {
  Parking: 'car-outline',
  Café: 'cafe-outline',
  'Changing Rooms': 'shirt-outline',
  Floodlights: 'flashlight-outline',
  'Pro Shop': 'bag-outline',
  Coaching: 'school-outline',
  Showers: 'water-outline',
};

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function CourtsScreen() {
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState('');
  const [surface, setSurface] = useState<CourtSurface | 'All'>('All');
  const [city, setCity] = useState<string>('All');
  const [sort, setSort] = useState<SortKey>('distance');
  const [openOnly, setOpenOnly] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // Sort dropdown height — only interactively-triggered animation, correct
  const sortDropH = useSharedValue(0);
  const sortDropStyle = useAnimatedStyle(() => ({
    height: sortDropH.get(),
    overflow: 'hidden',
  }));

  function toggleSort() {
    const next = !sortOpen;
    setSortOpen(next);
    sortDropH.set(withTiming(next ? SORT_OPTIONS.length * 48 : 0, { duration: 180 }));
  }

  const filtered = useMemo(() => {
    let list: FeaturedCourt[] = [...FEATURED_COURTS];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q),
      );
    }

    if (surface !== 'All') list = list.filter((c) => c.surface === surface);
    if (city !== 'All') list = list.filter((c) => c.city === city);
    if (openOnly) list = list.filter((c) => c.openNow);

    list.sort((a, b) => {
      switch (sort) {
        case 'distance': return a.distKm - b.distKm;
        case 'rating': return b.rating - a.rating;
        case 'price_low': return a.pricePerHour - b.pricePerHour;
        case 'price_high': return b.pricePerHour - a.pricePerHour;
      }
    });

    return list;
  }, [query, surface, city, sort, openOnly]);

  const activeFilterCount =
    (surface !== 'All' ? 1 : 0) +
    (city !== 'All' ? 1 : 0) +
    (openOnly ? 1 : 0);

  const renderItem = useCallback(
    ({ item }: { item: FeaturedCourt }) => <CourtListCard court={item} />,
    [],
  );

  const currentSortLabel = SORT_OPTIONS.find((o) => o.key === sort)?.label ?? 'Sort';

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={20} color={light.text} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Featured Courts</Text>
          <Text style={styles.headerSub}>
            {filtered.length} venue{filtered.length !== 1 ? 's' : ''} found
          </Text>
        </View>
      </View>

      {/* ── Search + Open toggle ────────────────────────────────────── */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={light.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search courts or cities…"
            placeholderTextColor={light.placeholder}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            onSubmitEditing={Keyboard.dismiss}
            accessibilityLabel="Search courts"
          />
          {query.length > 0 && (
            <Pressable
              onPress={() => setQuery('')}
              hitSlop={10}
              accessibilityLabel="Clear search"
            >
              <Ionicons name="close-circle" size={18} color={light.textMuted} />
            </Pressable>
          )}
        </View>
      </View>

      {/* ── Surface chips ───────────────────────────────────────────── */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {SURFACE_FILTERS.map((chip) => {
            const active = surface === chip.key;
            return (
              <Pressable
                key={chip.key}
                onPress={() => setSurface(chip.key)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {chip.key}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
      {/* ── Court list ─────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <EmptyState
          onClear={() => {
            setQuery('');
            setSurface('All');
            setCity('All');
            setOpenOnly(false);
          }}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: (insets.bottom || 0) + 100 },
          ]}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

// ─── Court card ───────────────────────────────────────────────────────────────
function CourtListCard({ court }: { court: FeaturedCourt }) {
  const sc = SURFACE_COLOR[court.surface];
  const visibleAmenities = court.amenities.slice(0, 4);
  const extraAmenities = court.amenities.length - 4;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={`View ${court.name}`}
    >
      {/* Image */}
      <View style={styles.cardImgWrap}>
        <Image source={{ uri: court.image }} style={styles.cardImg} resizeMode="cover" />

        {/* Open/Closed pill */}
        <View style={[styles.openPill, !court.openNow && styles.closedPill]}>
          <View style={[styles.openDot, !court.openNow && styles.closedDot]} />
          <Text style={[styles.openPillText, !court.openNow && styles.closedPillText]}>
            {court.openNow ? 'Open now' : 'Closed'}
          </Text>
        </View>

        {/* Featured star */}
        {court.featured && (
          <View style={styles.starBadge}>
            <Ionicons name="star" size={12} color="#F59E0B" />
          </View>
        )}
      </View>

      {/* Body */}
      <View style={styles.cardBody}>
        {/* Name + price */}
        <View style={styles.cardRow}>
          <Text style={styles.cardName} numberOfLines={1}>{court.name}</Text>
          <View style={styles.pricePill}>
            <Text style={styles.cardPrice}>
              PKR {court.pricePerHour.toLocaleString()}
            </Text>
            <Text style={styles.cardPriceUnit}> /hr</Text>
          </View>
        </View>

        {/* Location + rating */}
        <View style={styles.cardRow}>
          <View style={styles.metaGroup}>
            <Ionicons name="location-outline" size={13} color={light.textMuted} />
            <Text style={styles.metaText} numberOfLines={1}>
              {court.city}  ·  {court.dist}
            </Text>
          </View>
          <View style={styles.ratingPill}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={styles.ratingValue}>{court.rating}</Text>
            <Text style={styles.ratingCount}>({court.reviews})</Text>
          </View>
        </View>

        {/* Tags row */}
        <View style={styles.tagRow}>
          <View style={[styles.surfaceTag, { backgroundColor: sc.bg }]}>
            <Text style={[styles.surfaceTagText, { color: sc.text }]}>{court.surface}</Text>
          </View>
          <View style={styles.countTag}>
            <Ionicons name="grid-outline" size={12} color={light.textSecondary} />
            <Text style={styles.countTagText}>{court.courts} courts</Text>
          </View>
          <View style={styles.hoursTag}>
            <Ionicons name="time-outline" size={12} color={light.textMuted} />
            <Text style={styles.hoursTagText}>{court.openHours}</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.cardDivider} />

        {/* Amenities + book */}
        <View style={styles.amenityRow}>
          {visibleAmenities.map((a) => (
            <View key={a} style={styles.amenityChip}>
              <Ionicons name={AMENITY_ICON[a]} size={13} color={light.textSecondary} />
            </View>
          ))}
          {extraAmenities > 0 && (
            <View style={styles.amenityChip}>
              <Text style={styles.amenityMore}>+{extraAmenities}</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.bookBtn}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`Book ${court.name}`}
          >
            <Text style={styles.bookBtnText}>Book</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyIconWrap}>
        <Ionicons name="search-outline" size={30} color={brand.primaryMid} />
      </View>
      <Text style={styles.emptyTitle}>No courts found</Text>
      <Text style={styles.emptySub}>Try adjusting your search or filters</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
// All horizontal padding uses spacing[6] = 24px to match the home screen.
const H_PAD = spacing[6];

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: light.background,
  },

  // ── Header ───────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: H_PAD,
    paddingTop: spacing[4],
    paddingBottom: spacing[4],
    gap: spacing[3],
    backgroundColor: light.background,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: light.card,
    borderWidth: 1,
    borderColor: light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontFamily: fontFamily.bold,
    color: light.text,
    lineHeight: 26,
  },
  headerSub: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.regular,
    color: light.textMuted,
    marginTop: 1,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: brand.primary,
  },
  sortBtnActive: {
    backgroundColor: brand.primary,
    borderColor: brand.primary,
  },
  sortBtnText: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.semibold,
    color: brand.primary,
  },
  sortBtnTextActive: {
    color: '#fff',
  },

  // ── Sort dropdown ─────────────────────────────────────────────────────────────
  sortDropdown: {
    marginHorizontal: H_PAD,
    marginBottom: spacing[2],
    backgroundColor: light.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingHorizontal: H_PAD,
  },
  sortOptionDivider: {
    borderBottomWidth: 1,
    borderBottomColor: light.border,
  },
  sortOptionActive: {
    backgroundColor: brand.primaryLight,
  },
  sortOptionPressed: {
    backgroundColor: light.cardElevated,
  },
  sortOptionText: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.medium,
    color: light.text,
  },
  sortOptionTextActive: {
    fontFamily: fontFamily.semibold,
    color: brand.primary,
  },

  // ── Search ───────────────────────────────────────────────────────────────────
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: H_PAD,
    paddingBottom: spacing[3],
    gap: spacing[2],
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: light.card,
    borderRadius: radius.full,
    paddingHorizontal: spacing[4],
    height: 48,
    borderWidth: 1.5,
    borderColor: light.border,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.base,
    fontFamily: fontFamily.regular,
    color: light.text,
    paddingVertical: 0,
  },
  openToggle: {
    width: 48,
    height: 48,
    borderRadius: radius.xl,
    backgroundColor: brand.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  openToggleActive: {
    backgroundColor: brand.primary,
  },

  // ── Surface chips ─────────────────────────────────────────────────────────────
  chipRow: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[4],
    gap: spacing[2],
  },
  chip: {
    height: 35,
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
    color: '#fff',
  },

  // ── City chips ────────────────────────────────────────────────────────────────
  cityChipRow: {
    paddingHorizontal: H_PAD,
    paddingBottom: spacing[3],
    gap: spacing[1],
  },
  cityChip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
    borderRadius: radius.full,
  },
  cityChipActive: {
    backgroundColor: light.cardElevated,
  },
  cityChipText: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.medium,
    color: light.textMuted,
  },
  cityChipTextActive: {
    fontFamily: fontFamily.semibold,
    color: light.text,
  },

  // ── Filter banner ─────────────────────────────────────────────────────────────
  filterBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1.5],
    marginHorizontal: H_PAD,
    marginBottom: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    backgroundColor: brand.primaryLight,
    borderRadius: radius.lg,
  },
  filterBannerText: {
    flex: 1,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.medium,
    color: brand.primary,
  },
  filterBannerClear: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.semibold,
    color: brand.primary,
    textDecorationLine: 'underline',
  },

  // ── List ─────────────────────────────────────────────────────────────────────
  listContent: {
    paddingHorizontal: H_PAD,
    paddingTop: spacing[1],
  },
  separator: {
    height: spacing[4],
  },

  // ── Court card ────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: light.card,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: light.border,
  },
  cardImgWrap: {
    position: 'relative',
  },
  cardImg: {
    width: '100%',
    height: 156,
  },
  openPill: {
    position: 'absolute',
    top: spacing[3],
    left: spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    backgroundColor: 'rgba(255,255,255,0.93)',
    borderRadius: radius.full,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  closedPill: {
    backgroundColor: 'rgba(20,20,20,0.70)',
  },
  openDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: brand.primaryMid,
  },
  closedDot: {
    backgroundColor: palette.error,
  },
  openPillText: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.semibold,
    color: brand.primary,
  },
  closedPillText: {
    color: '#fff',
  },
  starBadge: {
    position: 'absolute',
    top: spacing[3],
    right: spacing[3],
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.93)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Card body
  cardBody: {
    padding: spacing[4],
    gap: spacing[2],
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[2],
  },
  cardName: {
    flex: 1,
    fontSize: fontSize.md,
    fontFamily: fontFamily.bold,
    color: light.text,
  },
  pricePill: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexShrink: 0,
  },
  cardPrice: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.bold,
    color: brand.primary,
  },
  cardPriceUnit: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.regular,
    color: light.textMuted,
  },
  metaGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  metaText: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: light.textMuted,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF9EE',
    paddingHorizontal: spacing[2],
    paddingVertical: 3,
    borderRadius: radius.full,
    flexShrink: 0,
  },
  ratingValue: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bold,
    color: '#92400E',
  },
  ratingCount: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.regular,
    color: '#B45309',
  },

  // Tags
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    flexWrap: 'wrap',
  },
  surfaceTag: {
    paddingHorizontal: spacing[2],
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  surfaceTagText: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.semibold,
  },
  countTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: light.cardElevated,
    paddingHorizontal: spacing[2],
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  countTagText: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.medium,
    color: light.textSecondary,
  },
  hoursTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  hoursTagText: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.regular,
    color: light.textMuted,
  },

  // Amenities
  cardDivider: {
    height: 1,
    backgroundColor: light.border,
    marginVertical: spacing[1],
  },
  amenityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  amenityChip: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: light.cardElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amenityMore: {
    fontSize: 11,
    fontFamily: fontFamily.semibold,
    color: light.textSecondary,
  },
  bookBtn: {
    marginLeft: 'auto',
    backgroundColor: brand.primary,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[2],
    borderRadius: radius.full,
  },
  bookBtnText: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bold,
    color: '#fff',
  },

  // ── Empty state ───────────────────────────────────────────────────────────────
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[10],
    gap: spacing[3],
  },
  emptyIconWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: brand.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.bold,
    color: light.text,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.regular,
    color: light.textMuted,
    textAlign: 'center',
  },
  emptyBtn: {
    marginTop: spacing[2],
    backgroundColor: brand.primary,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: radius.full,
  },
  emptyBtnText: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.semibold,
    color: '#fff',
  },
});
