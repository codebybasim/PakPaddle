import { brand } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fontSize, fontFamily } from '@/theme/typography';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, type StyleProp, type ViewStyle } from 'react-native';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function PrimaryButton({ title, onPress, loading, disabled, style }: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: !!(disabled || loading), busy: !!loading }}
      style={ [
        styles.btn,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading
        ? <ActivityIndicator size="small" color={brand.onPrimary} />
        : <Text style={styles.label}>{title}</Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    height:            54,
    borderRadius:      radius.md,
    borderCurve:       'continuous' as any,
    backgroundColor:   brand.primary,
    alignItems:        'center',
    justifyContent:    'center',
    paddingHorizontal: spacing[6],
  },
  label: {
    fontSize:      fontSize.md,
    fontFamily: fontFamily.bold,
    color:         brand.onPrimary,
    letterSpacing: -0.2,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    backgroundColor: brand.primaryDark,
    transform: [{ scale: 0.985 }],
  },
});
