import { useAppSelector } from '@/store/hooks';
import { light } from '@/theme/colors';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function AuthLayout() {
  const router = useRouter();
  const { user, isInitialized } = useAppSelector((state) => state.auth);

  // When the user becomes authenticated (email login, Google, Apple,
  // or session restore), leave the auth group and go to the main app.
  useEffect(() => {
    if (isInitialized && user) {
      // replace so the user can't swipe back to the login screen
      router.replace('/(tabs)' as any);
    }
  }, [user, isInitialized, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: light.background },
        animation: 'fade',
      }}
    />
  );
}
