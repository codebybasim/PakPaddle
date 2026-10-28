import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { type FeaturedCourt } from '@/constants/home';
import { brand, light } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fontFamily, fontSize } from '@/theme/typography';

interface CourtCardProps {
  court: FeaturedCourt;
  onPress?: () => void;
}

export function CourtCard({ court, onPress }: CourtCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.wrap}
    >
      <Image source={{ uri: court.image }} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{court.name}</Text>

        <View style={styles.row}>
          <Ionicons name="location-outline" size={13} color={light.textMuted} />
          <Text style={styles.dist}>{court.dist}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="star" size={13} color="#F59E0B" />
          <Text style={styles.ratingBold}>{court.rating}</Text>
          <Text style={styles.ratingMuted}>({court.reviews})</Text>
        </View>
      </View>

      <View style={styles.viewBtn}>
        <Text style={styles.viewBtnText}>View</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: light.card,
    borderRadius: radius.xl,
    padding: spacing[3],
    gap: spacing[3],
    marginHorizontal: spacing[3],
    marginBottom: spacing[1],
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.07,
    // shadowRadius: 8,
    // elevation: 3,
  },
  wrapPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.985 }],
  },
  image: {
    width: 90,
    height: 60,
    borderRadius: radius.lg,
    flexShrink: 0,
  },
  info: {
    flex: 1,
    gap: spacing[1.5],
  },
  name: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.bold,
    color: light.text,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  dist: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.regular,
    color: light.textMuted,
  },
  ratingBold: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.semibold,
    color: light.text,
  },
  ratingMuted: {
    fontSize: fontSize.xs,
    color: light.textMuted,
  },
  viewBtn: {
    backgroundColor: brand.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[2],
    alignSelf: 'center',
    flexShrink: 0,
  },
  viewBtnText: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.semibold,
    color: brand.primary,
  },
});
