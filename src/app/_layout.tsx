import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import '../../global.css';

import { PadelSplashOverlay } from '@/components/padel-splash';
import { supabase } from '../../lib/supabase';
import { persistor, store } from '../store';
import { setInitialized, setUser } from '../store/slices/authSlice';

SplashScreen.preventAutoHideAsync();

// ─── Inner layout — needs Redux context ──────────────────────────────────────
function RootNavigator() {
  const [splashDone, setSplashDone] = useState(false);

  // Sync Supabase session → Redux on mount and auth state changes
  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        store.dispatch(
          setUser({
            id: session.user.id,
            email: session.user.email ?? null,
            fullName: session.user.user_metadata?.full_name ?? null,
            avatarUrl: session.user.user_metadata?.avatar_url ?? null,
            provider: (session.user.app_metadata?.provider as any) ?? 'email',
          }),
        );
      } else {
        store.dispatch(setInitialized());
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        store.dispatch(
          setUser({
            id: session.user.id,
            email: session.user.email ?? null,
            fullName: session.user.user_metadata?.full_name ?? null,
            avatarUrl: session.user.user_metadata?.avatar_url ?? null,
            provider: (session.user.app_metadata?.provider as any) ?? 'email',
          }),
        );
      } else {
        store.dispatch(setUser(null));
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="courts/index"
          options={{
            animation: 'slide_from_right',
            animationDuration: 220,
          }}
        />
        <Stack.Screen
          name="match/[id]"
          options={{
            animation: 'slide_from_right',
            animationDuration: 220,
          }}
        />
      </Stack>

      {/* Splash stays on top until its animation sequence completes */}
      {!splashDone && (
        <PadelSplashOverlay
          onDone={() => setSplashDone(true)}
        />
      )}
    </>
  );
}

// ─── Root layout — provides Redux, Persist, Gesture ──────────────────────────
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RootNavigator />
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
