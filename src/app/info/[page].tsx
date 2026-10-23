import { useLocalSearchParams, useRouter } from 'expo-router';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button3D } from '@/components/ui/button-3d';
import { GlassIconButton } from '@/components/ui/glass';
import { BackIcon, ShieldCheckIcon } from '@/components/ui/icons';
import { colors, fonts } from '@/constants/theme';
import { t } from '@/i18n';
import { useSession } from '@/store/session';

const PAGES = ['rules', 'funding', 'safety', 'help'] as const;
type Page = (typeof PAGES)[number];

// Fixed information pages built into the app.
export default function InfoPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { config } = useSession();
  const param = useLocalSearchParams<{ page: string }>().page;
  const page: Page = PAGES.find((p) => p === param) ?? 'help';
  const content = t.info[page];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + 14, paddingBottom: insets.bottom + 32 }]}>
      <View style={styles.header}>
        <GlassIconButton label={t.a11y.back} style={styles.back} onPress={() => router.back()}>
          <BackIcon size={22} color={colors.text} />
        </GlassIconButton>
        <Text style={styles.title} accessibilityRole="header">
          {content.title}
        </Text>
      </View>
      {content.body.map((p) => (
        <Text key={p} style={styles.body}>
          {p}
        </Text>
      ))}
      {page === 'help' && config?.whatsappChannelUrl ? (
        <Button3D variant="green" label={t.info.openChannel} onPress={() => Linking.openURL(config.whatsappChannelUrl)} />
      ) : null}
      <View style={styles.free}>
        <ShieldCheckIcon size={24} />
        <Text style={styles.freeText}>{t.trust.adsPayForPrizes}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { paddingHorizontal: 20, gap: 14 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  back: { backgroundColor: colors.bg, borderColor: colors.border },
  title: { flex: 1, fontFamily: fonts.display, fontSize: 26, lineHeight: 32, color: colors.text },
  body: { fontFamily: fonts.body, fontSize: 17, lineHeight: 25, color: colors.text2 },
  free: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 16, backgroundColor: colors.successBg, marginTop: 8 },
  freeText: { flex: 1, fontFamily: fonts.bodyBold, fontSize: 15, lineHeight: 20, color: colors.successText },
});
