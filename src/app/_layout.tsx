import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { UpdateRequired } from '@/components/ui/update-required';
import { config } from '@/constants/config';
import { colors, fontFiles } from '@/constants/theme';
import { isOlderVersion } from '@/lib/version';
import { initSession, useSession } from '@/store/session';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontFiles);
  const session = useSession();
  const fontsReady = fontsLoaded || !!fontError;

  useEffect(() => {
    initSession();
  }, []);

  useEffect(() => {
    if (fontsReady && session.ready) SplashScreen.hideAsync();
  }, [fontsReady, session.ready]);

  if (!fontsReady || !session.ready) return null;
  if (session.config && isOlderVersion(config.appVersion, session.config.minAppVersion)) return <UpdateRequired />;

  const loggedIn = !!session.token;
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      <Stack.Protected guard={loggedIn}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="giveaway/[id]/index" />
        <Stack.Screen name="giveaway/[id]/rules" options={{ presentation: 'modal' }} />
        <Stack.Screen name="haazri-done" options={{ animation: 'fade' }} />
        <Stack.Screen name="info/[page]" />
      </Stack.Protected>
      <Stack.Protected guard={!loggedIn}>
        <Stack.Screen name="login" />
      </Stack.Protected>
    </Stack>
  );
}
