import { Redirect } from 'expo-router';
import { useAppSelector } from '../store/hooks';

/**
 * Root index — redirect based on auth state.
 * The splash overlay in _layout.tsx covers this during initialization,
 * so there's no flicker of unprotected content.
 */
export default function Index() {
  const { user, isInitialized } = useAppSelector((state) => state.auth);

  // Not yet rehydrated — splash is still showing, render nothing
  if (!isInitialized) return null;

  return user
    ? <Redirect href={'/(tabs)' as any} />
    : <Redirect href="/(auth)/login" />;
}
