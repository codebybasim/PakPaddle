import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { type NearbyPlayer } from '@/constants/home';
import { brand, light } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fontFamily, fontSize } from '@/theme/typography';

interface PlayerCardProps {
  player: NearbyPlayer;
  onPress?: () => void;
}

export function PlayerCard({ player, onPress }: PlayerCardProps) {
  return (
    <Pressable style={styles.wrap} onPress={onPress}>
      <View style={styles.avatarWrap}>
        <Image source={{ uri: player.avatar }} style={styles.avatar} />
        <View
          style={[
            styles.onlineDot,
            { backgroundColor: player.online ? brand.success : light.border },
          ]}
        />
      </View>
      <Text style={styles.name} numberOfLines={1}>{player.name}</Text>
      <Text style={styles.level}>{player.level}</Text>
      <View style={styles.distRow}>
        <Ionicons name="location-outline" size={10} color={light.textMuted} />
        <Text style={styles.dist}>{player.dist}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 80,
    alignItems: 'center',
    gap: spacing[0.5],
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: spacing[1],
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: light.border,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: light.card,
  },
  name: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.semibold,
    color: light.text,
    textAlign: 'center',
  },
  level: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.regular,
    color: light.textSecondary,
    textAlign: 'center',
  },
  distRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  dist: {
    fontSize: 10,
    fontFamily: fontFamily.regular,
    color: light.textMuted,
  },
});
