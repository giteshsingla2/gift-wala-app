import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getGiveaways } from '@/api';
import { GiveawayListCard } from '@/components/giveaway/list-card';
import { MegaDrawCard } from '@/components/giveaway/mega-card';
import { ConfettiLayer, Sunburst, type ConfettiPiece } from '@/components/ui/art';
import { HeroBackground } from '@/components/ui/hero';
import { ScreenState } from '@/components/ui/screen-state';
import { LiveChip } from '@/components/ui/tag';
import { colors, fonts, headingShadow } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';
import { t } from '@/i18n';
import { refreshConfig, useSession } from '@/store/session';

const CONFETTI: ConfettiPiece[] = [
  { kind: 'rect', x: 250, y: 24, color: '#FFC233', rotate: 25, w: 7, h: 13 },
  { kind: 'rect', x: 356, y: 76, color: '#FF5C8A', rotate: -30, w: 7, h: 12 },
  { kind: 'dot', x: 230, y: 18, color: '#3DDC97' },
  { kind: 'sparkle', x: 318, y: 40, color: '#FFE58A' },
];

export default function GiveawaysScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { config } = useSession();
  const [category, setCategory] = useState<string>();
  const { data, error, refreshing, refresh } = useApi(async () => {
    const [list] = await Promise.all([getGiveaways(category), refreshConfig().catch(() => null)]);
    return list;
  }, [category]);
  const categories = config?.categories ?? [];
  const chips = [{ id: undefined, name: t.giveaways.all }, ...categories];

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#FFFFFF" progressViewOffset={insets.top} />}>
        <HeroBackground midStop={0.7} style={[styles.hero, { paddingTop: insets.top + 18 }]}>
          <Sunburst size={400} style={{ right: -150, top: -160 }} />
          <ConfettiLayer pieces={CONFETTI} width={width} height={160} style={{ top: insets.top }} />
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title} accessibilityRole="header">
                {t.giveaways.title}
              </Text>
              <Text style={styles.subtitle}>{t.giveaways.subtitle}</Text>
            </View>
            {data ? <LiveChip label={t.giveaways.liveCount(data.liveCount)} large /> : null}
          </View>
          {categories.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
              {chips.map((c) => {
                const active = c.id === category;
                return (
                  <Pressable
                    key={c.id ?? 'all'}
                    onPress={() => setCategory(c.id)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    style={[styles.filter, active ? styles.filterActive : styles.filterIdle]}>
                    <Text style={[styles.filterText, active && styles.filterTextActive]}>{c.name}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : null}
        </HeroBackground>

        {!data ? (
          <View style={styles.loading}>
            <ScreenState error={error} onRetry={refresh} />
          </View>
        ) : (
          <>
            {data.featured && !category ? (
              <View style={styles.mega}>
                <MegaDrawCard giveaway={data.featured} onPress={() => router.push(`/giveaway/${data.featured!.id}`)} />
              </View>
            ) : null}

            <View style={styles.list}>
              <View style={styles.listHeader}>
                <Text style={styles.h2} accessibilityRole="header">
                  {t.giveaways.runningNow}
                </Text>
                <Text style={styles.count}>{t.giveaways.doneTodayCount(data.doneTodayCount, data.liveCount)}</Text>
              </View>
              {data.giveaways.length === 0 ? <Text style={styles.empty}>{t.giveaways.empty}</Text> : null}
              {data.giveaways.map((g) => (
                <GiveawayListCard key={g.id} giveaway={g} onPress={() => router.push(`/giveaway/${g.id}`)} />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 24, flexGrow: 1 },
  hero: { paddingBottom: 22 },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, paddingHorizontal: 16 },
  headerText: { flex: 1, gap: 2 },
  title: { fontFamily: fonts.display, fontSize: 30, lineHeight: 34, color: colors.onDark, ...headingShadow },
  subtitle: { fontFamily: fonts.body, fontSize: 15, lineHeight: 20, color: colors.onDarkMuted },
  filters: { gap: 8, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 2 },
  filter: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 16, borderRadius: 999 },
  filterActive: { backgroundColor: '#FFFFFF' },
  filterIdle: { backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  filterText: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: colors.onDark },
  filterTextActive: { fontFamily: fonts.bodyBold, color: colors.primaryEdge },
  loading: { height: 300 },
  mega: { paddingTop: 16, paddingHorizontal: 16 },
  list: { paddingTop: 22, paddingHorizontal: 16, gap: 12 },
  listHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  h2: { fontFamily: fonts.display, fontSize: 21, lineHeight: 27, color: colors.text },
  count: { fontFamily: fonts.body, fontSize: 14, color: colors.textMuted },
  empty: { fontFamily: fonts.body, fontSize: 16, lineHeight: 22, color: colors.textMuted, paddingVertical: 12 },
});
