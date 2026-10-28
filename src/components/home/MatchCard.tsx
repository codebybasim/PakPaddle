import { Ionicons } from '@expo/vector-icons';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';

import { MATCH_CARD_W, type FeaturedMatch } from '@/constants/home';
import { brand, light, palette } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fontFamily, fontSize } from '@/theme/typography';

interface MatchCardProps {
  item: FeaturedMatch;
  liked: boolean;
  onLike: () => void;
}

export function MatchCard({ item, liked, onLike }: MatchCardProps) {
  return (
    <View style={styles.wrap}>
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.bg}
        imageStyle={styles.bgImage}
      >
        {/* Dark scrim */}
        <View style={styles.scrim} />

        {/* Type badge */}
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Ionicons name="people" size={12} color={light.text} />
            <Text style={styles.badgeText}>{item.type}</Text>
          </View>
        </View>

        {/* Heart */}
        <Pressable onPress={onLike} style={styles.heartBtn} hitSlop={10}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={20}
            color={liked ? brand.error : '#FFFFFF'}
          />
        </Pressable>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.metaRow}>
            <MetaItem icon="calendar-outline" label={item.time} />
            <MetaItem icon="location-outline" label={item.venue} />
            <MetaItem icon="bar-chart-outline" label={item.level} />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

function MetaItem({ icon, label }: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string }) {
  return (
    <View style={styles.metaItem}>
      <Ionicons name={icon} size={12} color="rgba(255,255,255,0.75)" />
      <Text style={styles.metaText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: MATCH_CARD_W,
    marginRight: spacing[4],
    borderRadius: radius.xl,
    overflow: 'hidden',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 6 },
    // shadowOpacity: 0.18,
    // shadowRadius: 12,
    // elevation: 5,
  },
  bg: {
    width: MATCH_CARD_W,
    height: 210,
    justifyContent: 'space-between',
  },
  bgImage: {
    borderRadius: radius.xl,
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.27)',
    borderRadius: radius.xl,
  },
  badgeRow: {
    paddingTop: spacing[4],
    paddingLeft: spacing[4],
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    backgroundColor: palette.lSurface1,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.semibold,
    color: light.text,
  },
  heartBtn: {
    position: 'absolute',
    top: spacing[4],
    right: spacing[4],
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
    gap: spacing[1.5],
  },
  title: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.bold,
    color: '#FFFFFF',
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing[4],
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[0.5],
  },
  metaText: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.regular,
    color: 'rgba(255,255,255,0.85)',
  },
});
