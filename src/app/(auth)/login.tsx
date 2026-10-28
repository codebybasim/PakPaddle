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
import { radius, spacing } from '@/theme/spacing';
import { fontSize, fontFamily, letterSpacing } from '@/theme/typography';
import { supabase } from '../../../lib/supabase';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();

  const [email,         setEmail]         = useState('');
  const [password,      setPassword]      = useState('');
  const [showPass,      setShowPass]      = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading,  setAppleLoading]  = useState(false);
  const [errors,        setErrors]        = useState<{ email?: string; password?: string }>({});

  const passRef = useRef<ElementRef<typeof TextInput>>(null);

  // ── Validation ──────────────────────────────────────────────────────────────
  function validate(): boolean {
    const e: typeof errors = {};
    if (!email.trim())                    e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email    = 'Enter a valid email';
    if (!password)                        e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ── Email login ─────────────────────────────────────────────────────────────
  async function handleEmailLogin() {
    if (!validate()) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) setErrors({ password: error.message });
  }

  // ── Google login ────────────────────────────────────────────────────────────
  async function handleGoogleLogin() {
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

  // ── Apple login ─────────────────────────────────────────────────────────────
  async function handleAppleLogin() {
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
          { paddingTop: insets.top + spacing[8], paddingBottom: insets.bottom + spacing[8] },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.duration(400).delay(60)} style={styles.header}>
          {/* Logo mark — padel court shape */}
          <View style={styles.logoMark}>
            {/* Court net line */}
            <View style={styles.logoNet} />
            {/* Ball dot */}
            <View style={styles.logoBall} />
          </View>
          <Text style={styles.brandName}>PakPadel</Text>
          <Text style={styles.headline}>Welcome back</Text>
          <Text style={styles.subheadline}>Sign in to book your court</Text>
        </Animated.View>

        {/* ── Social buttons ──────────────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.duration(400).delay(120)} style={styles.socialGroup}>
          <SocialButton provider="google" onPress={handleGoogleLogin} loading={googleLoading} />
          {!isAppleAvailable && (
            <SocialButton provider="apple" onPress={handleAppleLogin} loading={appleLoading} />
          )}
        </Animated.View>

        {/* ── Divider ─────────────────────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.duration(400).delay(180)}>
          <OrDivider />
        </Animated.View>

        {/* ── Form ────────────────────────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.duration(400).delay(240)} style={styles.form}>
          <AuthInput
            label="Email"
            value={email}
            placeholder='Enter email address'
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
            autoComplete="current-password"
            returnKeyType="done"
            onSubmitEditing={handleEmailLogin}
            rightElement={
              <PasswordToggle visible={showPass} onToggle={() => setShowPass((v) => !v)} />
            }
          />

          {/* Forgot password */}
          <Pressable
            onPress={() => router.push('/(auth)/forgot-password' as any)}
            hitSlop={8}
            style={styles.forgotWrap}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>

          <PrimaryButton title="Sign In" onPress={handleEmailLogin} loading={loading} />
        </Animated.View>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.duration(400).delay(300)} style={styles.footer}>
          <Text style={styles.footerText}>{"Don't have an account?"}</Text>
          <Pressable onPress={() => router.push('/(auth)/signup')} hitSlop={6}>
            <Text style={styles.footerLink}> Sign up</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex:            1,
    backgroundColor: light.background,
  },
  scroll: {
    paddingHorizontal: spacing[6],
    gap:               spacing[6],
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    alignItems: 'center',
    gap:        spacing[2],
  },
  logoMark: {
    width:           56,
    height:          56,
    borderRadius:    radius.md,
    borderCurve:     'continuous' as any,
    backgroundColor: brand.primaryLight,
    borderWidth:     2,
    borderColor:     brand.primary,
    alignItems:      'center',
    justifyContent:  'center',
    marginBottom:    spacing[2],
  },
  logoNet: {
    position:        'absolute',
    left:            8,
    right:           8,
    top:             '50%',
    height:          2,
    backgroundColor: brand.primary,
    marginTop:       -1,
  },
  logoBall: {
    width:           10,
    height:          10,
    borderRadius:    5,
    backgroundColor: brand.primary,
  },
  brandName: {
    fontSize:      fontSize['2xl'],
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
    gap: spacing[5],
  },
  forgotWrap: {
    alignSelf:  'flex-end',
    marginTop:  -spacing[3],
  },
  forgotText: {
    fontSize:   fontSize.sm,
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
