import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppAssets } from '@/assets/images/AppAssets';
import { light } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';

type Provider = 'google' | 'apple';

interface SocialButtonProps {
  provider: Provider;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function SocialButton({ provider, onPress, loading, disabled }: SocialButtonProps) {
  const isGoogle = provider === 'google';
  const label = isGoogle ? 'Continue with Google' : 'Continue with Apple';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!(disabled || loading), busy: !!loading }}
      style={[
        styles.btn,
        (disabled || loading) && styles.disabled,
      ]}
    >
      {/* Fixed-width icon slot — keeps label truly centered */}
      <View style={styles.iconSlot}>
        {!loading && (
          isGoogle
            ? <Image source={AppAssets.google} style={styles.icon} resizeMode='contain' />
            : <Image source={AppAssets.apple} style={styles.icon} resizeMode='contain' />
        )}
      </View>

      {loading
        ? <ActivityIndicator size="small" color={light.textSecondary} style={styles.loader} />
        : <Text style={styles.label}>{label}</Text>
      }

      {/* Mirror slot on the right to keep text truly centred */}
      <View style={styles.iconSlot} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'center',
    height:            52,
    borderRadius:      radius.md,
    borderCurve:       'continuous' as any,
    backgroundColor:   light.card,
    borderWidth:       1.5,
    borderColor:       light.border,
    paddingHorizontal: spacing[4],
  },
  iconSlot: {
    width:          28,
    alignItems:     'center',
    justifyContent: 'center',
  },
  label: {
    flex:       1,
    textAlign:  'center',
    fontSize:   fontSize.base,
    fontWeight: fontWeight.semibold,
    color:      light.text,
  },
  loader: {
    flex: 1,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    backgroundColor: light.cardElevated,
    transform: [{ scale: 0.985 }],
  },
  icon:{
    width:24,
    height:24
  }
});
