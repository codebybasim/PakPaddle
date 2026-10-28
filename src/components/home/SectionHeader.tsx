import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { brand, light } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fontSize, fontFamily } from '@/theme/typography';

interface SectionHeaderProps {
  title: string;
  onSeeAll: () => void;
}

export function SectionHeader({ title, onSeeAll }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      <Pressable onPress={onSeeAll} hitSlop={8} style={styles.seeAllBtn}>
        <Text style={styles.seeAll}>See all</Text>
        <Ionicons name="chevron-forward" size={14} color={brand.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:     'row',
    justifyContent:    'space-between',
    alignItems:        'center',
    paddingHorizontal: spacing[6],
    marginBottom:      spacing[3],
  },
  title: {
    fontSize:   fontSize.lg,
    fontFamily: fontFamily.bold,
    color:      light.text,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           2,
  },
  seeAll: {
    fontSize:   fontSize.sm,
    fontFamily: fontFamily.medium,
    color:      brand.primary,
  },
});
