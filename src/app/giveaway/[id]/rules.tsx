import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getGiveaway } from '@/api';
import { GlassIconButton } from '@/components/ui/glass';
import { BackIcon, ShieldCheckIcon } from '@/components/ui/icons';
import { ScreenState } from '@/components/ui/screen-state';
import { colors, fonts } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';
import { t } from '@/i18n';

export default function RulesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, error, refresh } = useApi(() => getGiveaway(id), [id]);

  if (!data) return <ScreenState error={error} onRetry={refresh} />;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + 14, paddingBottom: insets.bottom + 24 }]}>
      <View style={styles.header}>
        <GlassIconButton label={t.a11y.back} style={styles.back} onPress={() => router.back()}>
          <BackIcon size={22} color={colors.text} />
        </GlassIconButton>
        <Text style={styles.title} accessibilityRole="header">
          {t.detail.rulesTitle}
        </Text>
      </View>
      <Text style={styles.giveaway}>{data.title}</Text>
      <Text style={styles.body}>{data.rulesText}</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  back: { backgroundColor: colors.bg, borderColor: colors.border },
  title: { fontFamily: fonts.display, fontSize: 28, lineHeight: 34, color: colors.text },
  giveaway: { fontFamily: fonts.display, fontSize: 20, lineHeight: 26, color: colors.text },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24, color: colors.text2 },
  free: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 16, backgroundColor: colors.successBg },
  freeText: { flex: 1, fontFamily: fonts.bodyBold, fontSize: 15, lineHeight: 20, color: colors.successText },
});
