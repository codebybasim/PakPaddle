import { Feather } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import { router } from 'expo-router';
import { ElementRef, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthInput, PasswordToggle } from '@/components/auth/AuthInput';
import { OrDivider } from '@/components/auth/OrDivider';
import { PrimaryButton } from '@/components/auth/PrimaryButton';
import { SocialButton } from '@/components/auth/SocialButton';
import { brand, light, palette } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fontSize, fontFamily, letterSpacing } from '@/theme/typography';
import { supabase } from '../../../lib/supabase';

export default function SignupScreen() {
  const insets = useSafeAreaInsets();

  const [fullName,      setFullName]      = useState('');
  const [email,         setEmail]         = useState('');
  const [password,      setPassword]      = useState('');
  const [confirmPass,   setConfirmPass]   = useState('');
  const [showPass,      setShowPass]      = useState(false);
  const [showConfirm,   setShowConfirm]   = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading,  setAppleLoading]  = useState(false);
  const [errors,        setErrors]        = useState<{
    fullName?: string; email?: string; password?: string; confirmPass?: string;
  }>({});

  const emailRef   = useRef<ElementRef<typeof TextInput>>(null);
  const passRef    = useRef<ElementRef<typeof TextInput>>(null);
  const confirmRef = useRef<ElementRef<typeof TextInput>>(null);

  // ── Validation ──────────────────────────────────────────────────────────────
  function validate(): boolean {
    const e: typeof errors = {};
    if (!fullName.trim())                      e.fullName    = 'Full name is required';
    if (!email.trim())                         e.email       = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email))      e.email       = 'Enter a valid email';
    if (!password)                             e.password    = 'Password is required';
    else if (password.length < 8)             e.password    = 'At least 8 characters';
    if (!confirmPass)                          e.confirmPass = 'Please confirm your password';
    else if (confirmPass !== password)         e.confirmPass = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ── Email signup ────────────────────────────────────────────────────────────
  async function handleEmailSignup() {
    if (!validate()) return;
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email:   email.trim(),
      password,
      options: { data: { full_name: fullName.trim() } },
    });
    setLoading(false);
    if (error) {
      setErrors({ email: error.message });
    } else {
      Alert.alert(
        'Check your email',
        'We sent you a confirmation link. Please verify your email before signing in.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }],
      );
    }
  }

  // ── Google signup ───────────────────────────────────────────────────────────
  async function handleGoogleSignup() {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options:  { redirectTo: 'pakpadel://auth/callback' },
      });
      if (error) throw error;
    } catch (err: any) {
      Alert.alert('Google Sign-In failed', err.message ?? 'Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  }

  // ── Apple signup ────────────────────────────────────────────────────────────
  async function handleAppleSignup() {
    setAppleLoading(true);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token:    credential.identityToken!,
      });
      if (error) throw error;
    } catch (err: any) {
      if (err.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert('Apple Sign-In failed', err.message ?? 'Please try again.');
      }
    } finally {
      setAppleLoading(false);
    }
  }

  const isAppleAvailable = Platform.OS === 'ios';

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + spacing[6], paddingBottom: insets.bottom + spacing[8] },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.duration(400).delay(60)} style={styles.header}>
          {/* Back button */}
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            style={styles.backBtn}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Feather name="arrow-left" size={22} color={light.textSecondary} />
          </Pressable>

          <Text style={styles.brandName}>PakPadel</Text>
          <Text style={styles.headline}>Create account</Text>
          <Text style={styles.subheadline}>Start booking courts today</Text>
        </Animated.View>

        {/* ── Social buttons ──────────────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.socialGroup}>
          <SocialButton provider="google" onPress={handleGoogleSignup} loading={googleLoading} />
          {!isAppleAvailable && (
            <SocialButton provider="apple" onPress={handleAppleSignup} loading={appleLoading} />
          )}
        </Animated.View>

        {/* ── Divider ─────────────────────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.duration(400).delay(160)}>
          <OrDivider />
        </Animated.View>

        {/* ── Form ────────────────────────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.form}>
          <AuthInput
            label="Full Name"
            placeholder='Enter your full-name'
            value={fullName}
            onChangeText={(t) => { setFullName(t); setErrors((e) => ({ ...e, fullName: undefined })); }}
            error={errors.fullName}
            autoCapitalize="words"
            autoComplete="name"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
          />

          <AuthInput
            ref={emailRef}
            label="Email"
            placeholder='Enter your email address'
            value={email}
            onChangeText={(t) => { setEmail(t); setErrors((e) => ({ ...e, email: undefined })); }}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            returnKeyType="next"
            onSubmitEditing={() => passRef.current?.focus()}
          />

          <AuthInput
            ref={passRef}
            label="Password"
            placeholder='Enter your password'
            value={password}
            onChangeText={(t) => { setPassword(t); setErrors((e) => ({ ...e, password: undefined })); }}
            error={errors.password}
            secureTextEntry={!showPass}
            autoComplete="new-password"
            returnKeyType="next"
            onSubmitEditing={() => confirmRef.current?.focus()}
            rightElement={
              <PasswordToggle visible={showPass} onToggle={() => setShowPass((v) => !v)} />
            }
          />

          {password.length > 0 && <PasswordStrength password={password} />}

          <AuthInput
            ref={confirmRef}
            label="Confirm Password"
            placeholder='Re-enter your password'
            value={confirmPass}
            onChangeText={(t) => { setConfirmPass(t); setErrors((e) => ({ ...e, confirmPass: undefined })); }}
            error={errors.confirmPass}
            secureTextEntry={!showConfirm}
            autoComplete="new-password"
            returnKeyType="done"
            onSubmitEditing={handleEmailSignup}
            rightElement={
              <PasswordToggle visible={showConfirm} onToggle={() => setShowConfirm((v) => !v)} />
            }
          />

          <PrimaryButton title="Create Account" onPress={handleEmailSignup} loading={loading} />

          <Text style={styles.terms}>
            By signing up you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>.
          </Text>
        </Animated.View>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.duration(400).delay(260)} style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Pressable onPress={() => router.push('/(auth)/login')} hitSlop={6}>
            <Text style={styles.footerLink}> Sign in</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Password strength bar ────────────────────────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  const score = getStrengthScore(password);
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  const colors = [brand.error, brand.warning, brand.courtGreen, brand.success];
  const label  = labels[score - 1] ?? 'Weak';
  const color  = colors[score - 1] ?? colors[0];

  return (
    <View style={strength.wrap}>
      <View style={strength.bars}>
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={[
              strength.bar,
              { backgroundColor: i <= score ? color : light.cardElevated },
            ]}
          />
        ))}
      </View>
      <Text style={[strength.label, { color }]}>{label}</Text>
    </View>
  );
}

function getStrengthScore(p: string): number {
  let s = 0;
  if (p.length >= 8)           s++;
  if (/[A-Z]/.test(p))         s++;
  if (/[0-9]/.test(p))         s++;
  if (/[^A-Za-z0-9]/.test(p))  s++;
  return Math.max(1, s);
}

const strength = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           spacing[3],
    marginTop:     -spacing[3],
  },
  bars: {
    flexDirection: 'row',
    gap:           spacing[1],
    flex:          1,
  },
  bar: {
    flex:         1,
    height:       3,
    borderRadius: 2,
  },
  label: {
    fontSize:   fontSize.xs,
    fontFamily: fontFamily.semibold,
    width:      42,
    textAlign:  'right',
  },
});

const styles = StyleSheet.create({
  root: {
    flex:            1,
    backgroundColor: light.background,
  },
  scroll: {
    paddingHorizontal: spacing[6],
    gap:               spacing[5],
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    alignItems: 'center',
    gap:        spacing[1.5],
    paddingTop: spacing[2],
  },
  backBtn: {
    position: 'absolute',
    left:     0,
    top:      spacing[1],
    padding:  spacing[2],
  },
  brandName: {
    fontSize:      fontSize.xl,
    fontFamily: fontFamily.extraBold,
    color:         palette.green,
    letterSpacing: letterSpacing.tight,
  },
  headline: {
    fontSize:   fontSize.xl,
    fontFamily: fontFamily.bold,
    color:      light.text,
    marginTop:  spacing[1],
  },
  subheadline: {
    fontSize: fontSize.base,
    color:    light.textSecondary,
  },

  // ── Social ───────────────────────────────────────────────────────────────────
  socialGroup: {
    gap: spacing[3],
  },

  // ── Form ─────────────────────────────────────────────────────────────────────
  form: {
    gap: spacing[4],
  },
  terms: {
    fontSize:   fontSize.sm,
    color:      light.textMuted,
    textAlign:  'center',
    lineHeight: 18,
    marginTop:  spacing[1],
  },
  termsLink: {
    color:      brand.primary,
    fontFamily: fontFamily.medium,
  },

  // ── Footer ───────────────────────────────────────────────────────────────────
  footer: {
    flexDirection:  'row',
    justifyContent: 'center',
    alignItems:     'center',
    paddingTop:     spacing[2],
  },
  footerText: {
    fontSize: fontSize.base,
    color:    light.textSecondary,
  },
  footerLink: {
    fontSize:   fontSize.base,
    color:      brand.primary,
    fontFamily: fontFamily.semibold,
  },
});
