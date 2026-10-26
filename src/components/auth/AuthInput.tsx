import { Feather } from '@expo/vector-icons';
import { ElementRef, forwardRef } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { brand, light } from '@/theme/colors';
import { duration } from '@/theme/motion';
import { radius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';

interface AuthInputProps extends TextInputProps {
  label: string;
  error?: string;
  rightElement?: React.ReactNode;
}

export const AuthInput = forwardRef<ElementRef<typeof TextInput>, AuthInputProps>(function AuthInput(
  { label,placeholder, error, rightElement, style, onFocus, onBlur, ...rest },
  ref,
) {
  const focused = useSharedValue(0);

  const containerStyle = useAnimatedStyle(() => ({
    borderColor: focused.value === 1
      ? brand.primary
      : error
        ? brand.error
        : light.border,
    // Subtle shadow glow on focus
    shadowOpacity: focused.value * 0.08,
  }));

  const handleFocus = (e: any) => {
    focused.set(withTiming(1, { duration: duration.fast }));
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    focused.set(withTiming(0, { duration: duration.fast }));
    onBlur?.(e);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <Animated.View style={[
        styles.inputContainer,
        containerStyle,
        error ? styles.inputError : null,
      ]}>
        <TextInput
          ref={ref}
          style={[styles.input, style]}
          placeholder={placeholder}
          placeholderTextColor={light.placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
        {rightElement && <View style={styles.rightSlot}>{rightElement}</View>}
      </Animated.View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
});

// ─── Password visibility toggle ───────────────────────────────────────────────
interface PasswordToggleProps {
  visible: boolean;
  onToggle: () => void;
}

export function PasswordToggle({ visible, onToggle }: PasswordToggleProps) {
  return (
    <Pressable
      onPress={onToggle}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={visible ? 'Hide password' : 'Show password'}
      style={({ pressed }) => [toggle.btn, pressed && toggle.pressed]}
    >
      <Feather
        name={visible ? 'eye-off' : 'eye'}
        size={18}
        color={light.icon}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing[1.5],
  },
  label: {
    fontSize:      fontSize.sm,
    fontWeight:    fontWeight.semibold,
    color:         light.textSecondary,
    letterSpacing: 0.2,
  },
  inputContainer: {
    flexDirection:     'row',
    alignItems:        'center',
    backgroundColor:   light.card,
    borderRadius:      radius.md,
    borderWidth:       1.5,
    borderColor:       light.border,
    paddingHorizontal: spacing[4],
    height:            52,
    // Shadow for focus glow
    shadowColor:       brand.primary,
    shadowOffset:      { width: 0, height: 0 },
    shadowRadius:      6,
    elevation:         0,
  },
  inputError: {
    borderColor: brand.error,
  },
  input: {
    flex:            1,
    fontSize:        fontSize.base,
    color:           light.inputText,
    paddingVertical: 0,
  },
  rightSlot: {
    marginLeft: spacing[2],
  },
  errorText: {
    fontSize: fontSize.xs,
    color:    brand.error,
    marginTop: 2,
  },
});

const toggle = StyleSheet.create({
  btn: {
    padding: spacing[1],
  },
  pressed: {
    opacity: 0.5,
  },
});
