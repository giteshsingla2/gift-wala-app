import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getWinners } from '@/api';
import { ConfettiLayer, Spotlights, type ConfettiPiece } from '@/components/ui/art';
import { GlassChip } from '@/components/ui/glass';
import { HeroBackground } from '@/components/ui/hero';
import { ShieldIcon } from '@/components/ui/icons';
import { ScreenState } from '@/components/ui/screen-state';
import { WinnerCard } from '@/components/winners/winner-card';
import { WinnerSpotlight } from '@/components/winners/winner-spotlight';
import { colors, fonts, headingShadow } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';
import { t } from '@/i18n';
import type { WinnersRange } from '@/types';

const RANGES: WinnersRange[] = ['yesterday', 'week', 'mega'];
const LIST_TITLE = { yesterday: t.winners.yesterdayWinners, week: t.winners.weekWinners, mega: t.winners.megaWinners } as const;

const CONFETTI: ConfettiPiece[] = [
  { kind: 'rect', x: 44, y: 150, color: '#FFC233', rotate: 25 },
  { kind: 'rect', x: 336, y: 140, color: '#FF5C8A', rotate: -30, w: 7, h: 13 },
  { kind: 'rect', x: 70, y: 260, color: '#3DDC97', rotate: 40, w: 7, h: 12 },
  { kind: 'rect', x: 312, y: 250, color: '#7CC4FF', rotate: -20, h: 13 },
  { kind: 'dot', x: 96, y: 200, color: '#3DDC97', r: 4 },
  { kind: 'dot', x: 300, y: 196, color: '#FFFFFF', opacity: 0.8 },
  { kind: 'squiggle', x: 300, y: 300, color: '#FFC233' },
  { kind: 'squiggle', x: 50, y: 220, color: '#FF5C8A' },
  { kind: 'sparkle', x: 84, y: 130, color: '#FFFFFF', scale: 0.9 },
  { kind: 'sparkle', x: 320, y: 214, color: '#FFE58A' },
];

export default function WinnersScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [range, setRange] = useState<WinnersRange>('yesterday');
  const { data, error, refreshing, refresh } = useApi(() => getWinners(range), [range]);
  const openVideo = (url: string | null) => url && WebBrowser.openBrowserAsync(url);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#FFFFFF" progressViewOffset={insets.top} />}>
        <HeroBackground style={[styles.hero, { paddingTop: insets.top + 16 }]}>
          <Spotlights width={width} height={400} />
          <ConfettiLayer pieces={CONFETTI} width={width} height={400} style={{ top: insets.top }} />
          <View style={styles.header}>
            <Text style={styles.title} accessibilityRole="header">
              {t.winners.title}
            </Text>
            <GlassChip icon={<ShieldIcon />} label={t.winners.allVerified} />
          </View>

          <View style={styles.segmented} accessibilityRole="tablist">
            {RANGES.map((r) => {
              const active = r === range;
              return (
                <Pressable key={r} onPress={() => setRange(r)} accessibilityRole="tab" accessibilityState={{ selected: active }} style={[styles.segment, active && styles.segmentActive]}>
                  <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{t.winners.ranges[r]}</Text>
                </Pressable>
              );
            })}
          </View>

          {data?.spotlight ? (
            <View style={styles.spotlight}>
              <WinnerSpotlight winner={data.spotlight} onWatchVideo={() => openVideo(data.spotlight!.videoUrl)} />
            </View>
          ) : null}
        </HeroBackground>

        {!data ? (
          <View style={styles.loading}>
            <ScreenState error={error} onRetry={refresh} />
          </View>
        ) : (
          <View style={styles.list}>
            <View style={styles.listHeader}>
              <Text style={styles.h2} accessibilityRole="header">
                {LIST_TITLE[range]}
              </Text>
              <Text style={styles.total}>{t.winners.total(data.total)}</Text>
            </View>
            {data.winners.length === 0 ? <Text style={styles.empty}>{t.winners.empty}</Text> : null}
            {data.winners.map((w) => (
              <WinnerCard key={w.id} winner={w} compact onWatchVideo={() => openVideo(w.videoUrl)} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgAlt },
  content: { paddingBottom: 24, flexGrow: 1 },
  hero: { paddingHorizontal: 16, paddingBottom: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontFamily: fonts.display, fontSize: 28, lineHeight: 34, color: colors.onDark, ...headingShadow },
  segmented: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    borderRadius: 16,
    backgroundColor: 'rgba(5,12,60,0.4)',
    borderWidth: 1,
    borderColor: colors.glassDarkBorder,
  },
  segment: { flex: 1, minHeight: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  segmentActive: { backgroundColor: '#FFFFFF' },
  segmentText: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: colors.onDark },
  segmentTextActive: { fontFamily: fonts.display, color: colors.primaryEdge },
  spotlight: { marginTop: 10 },
  loading: { height: 260 },
  list: { marginTop: -26, paddingHorizontal: 14, gap: 10 },
  listHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: 4 },
  h2: {
    fontFamily: fonts.display,
    fontSize: 19,
    lineHeight: 24,
    color: colors.onDark,
    textShadowColor: colors.primaryEdge,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0,
  },
  total: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.onDark },
  empty: { fontFamily: fonts.body, fontSize: 15, lineHeight: 21, color: colors.textMuted, textAlign: 'center', backgroundColor: colors.surface, borderRadius: 20, padding: 20 },
});
