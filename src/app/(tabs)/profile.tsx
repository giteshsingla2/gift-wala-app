import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HeroBackground } from '@/components/ui/hero';
import { ShieldCheckIcon, UserIcon } from '@/components/ui/icons';
import { colors, fonts, headingShadow } from '@/constants/theme';
import { t } from '@/i18n';

// Not designed yet. Holds the tab so navigation is complete.
export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <HeroBackground style={[styles.hero, { paddingTop: insets.top + 18 }]}>
        <Text style={styles.title} accessibilityRole="header">
          {t.profile.title}
        </Text>
      </HeroBackground>
      <View style={styles.body}>
        <View style={styles.avatar}>
          <UserIcon size={40} color={colors.primary} />
        </View>
        <Text style={styles.text}>{t.profile.comingSoon}</Text>
        <View style={styles.free}>
          <ShieldCheckIcon size={24} />
          <Text style={styles.freeText}>{t.trust.adsPayForPrizes}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  hero: { paddingHorizontal: 16, paddingBottom: 24 },
  title: { fontFamily: fonts.display, fontSize: 28, lineHeight: 34, color: colors.onDark, ...headingShadow },
  body: { flex: 1, alignItems: 'center', padding: 24, gap: 16 },
  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' },
  text: { fontFamily: fonts.body, fontSize: 16, lineHeight: 22, color: colors.textMuted, textAlign: 'center' },
  free: { alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 16, backgroundColor: colors.successBg },
  freeText: { flex: 1, fontFamily: fonts.bodyBold, fontSize: 15, lineHeight: 20, color: colors.successText },
});
