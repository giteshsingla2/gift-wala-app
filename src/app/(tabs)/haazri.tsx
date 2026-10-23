import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getHaazri, markHaazri } from '@/api';
import { HaazriPath } from '@/components/giveaway/haazri-path';
import { ConfettiLayer, Medal, Sunburst, type ConfettiPiece } from '@/components/ui/art';
import { Button3D } from '@/components/ui/button-3d';
import { CheckboxRow } from '@/components/ui/checkbox-row';
import { GlassChip, GlassIconButton } from '@/components/ui/glass';
import { HeroBackground } from '@/components/ui/hero';
import { BackIcon, CheckIcon, ClockIcon, ShieldIcon } from '@/components/ui/icons';
import { ScreenState } from '@/components/ui/screen-state';
import { colors, fonts, headingShadow } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';
import { t } from '@/i18n';
import { setPref, usePrefs } from '@/store/preferences';

const CONFETTI: ConfettiPiece[] = [
  { kind: 'rect', x: 250, y: 80, color: '#FFC233', rotate: 25, w: 7, h: 13 },
  { kind: 'rect', x: 356, y: 120, color: '#FF5C8A', rotate: -30, w: 7, h: 12 },
  { kind: 'dot', x: 230, y: 150, color: '#3DDC97' },
  { kind: 'dot', x: 372, y: 70, color: '#FFFFFF', r: 3, opacity: 0.8 },
  { kind: 'sparkle', x: 340, y: 168, color: '#FFE58A', scale: 0.7 },
];

export default function HaazriScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const prefs = usePrefs();
  const { data, error, refreshing, refresh, setData } = useApi(getHaazri);
  const [selectedId, setSelectedId] = useState<string>();
  const [marking, setMarking] = useState(false);

  if (!data) return <ScreenState error={error} onRetry={refresh} />;

  const progress = data.find((h) => h.giveawayId === selectedId) ?? data[0];
  if (!progress) return <ScreenState />;

  const day = progress.markedToday ? progress.daysMarked : progress.daysMarked + 1;
  const left = progress.haazriDays - progress.daysMarked - (progress.markedToday ? 0 : 1);
  const skipsLeft = progress.freeSkips - progress.skipsUsed;
  const qualified = progress.daysMarked >= progress.haazriDays;

  const onMark = async () => {
    setMarking(true);
    try {
      const updated = await markHaazri();
      setData(updated);
      router.push('/haazri-done');
    } catch {
      Alert.alert(t.haazri.markFailed);
    } finally {
      setMarking(false);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#FFFFFF" progressViewOffset={insets.top} />}>
        <HeroBackground midStop={0.7} style={[styles.hero, { paddingTop: insets.top + 14 }]}>
          <Sunburst size={400} style={{ left: -110, top: -90 }} />
          <ConfettiLayer pieces={CONFETTI} width={width} height={220} style={{ top: insets.top }} />

          <View style={styles.topBar}>
            <View style={styles.titleRow}>
              <GlassIconButton label={t.a11y.back} onPress={() => router.navigate('/')}>
                <BackIcon size={22} color="#FFFFFF" />
              </GlassIconButton>
              <Text style={styles.title} accessibilityRole="header">
                {t.haazri.title}
              </Text>
            </View>
            <GlassChip icon={<ShieldIcon />} label={skipsLeft > 0 ? t.haazri.freeSkips(skipsLeft) : t.haazri.noSkips} />
          </View>

          <View style={styles.status}>
            <Medal day={Math.min(day, progress.haazriDays)} label={t.haazri.day} />
            <View style={styles.statusText}>
              <Text style={styles.moreDays}>{qualified ? t.haazri.qualified : t.haazri.moreDays(Math.max(0, left))}</Text>
              <Text style={styles.unlocks}>{qualified ? t.haazri.qualifiedBody(progress.title) : t.haazri.unlocks(progress.title)}</Text>
            </View>
          </View>
        </HeroBackground>

        <View style={styles.sheet}>
          {data.length > 1 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.switcher}>
              {data.map((h) => {
                const active = h.giveawayId === progress.giveawayId;
                return (
                  <Pressable
                    key={h.giveawayId}
                    onPress={() => setSelectedId(h.giveawayId)}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: active }}
                    style={[styles.switchCard, active && styles.switchCardActive]}>
                    <Text style={[styles.switchText, active && styles.switchTextActive]}>{t.haazri.switcherLabel(h.title, h.daysMarked, h.haazriDays)}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

          <HaazriPath progress={progress} />

          {progress.markedToday || qualified ? (
            <Button3D variant="done" label={t.home.haazriDoneToday} icon={<CheckIcon size={24} color={colors.successText} />} height={58} disabled />
          ) : (
            <Button3D
              variant="gold"
              height={58}
              label={t.home.markHaazri}
              textStyle={styles.markText}
              icon={<CheckIcon size={24} color={colors.goldInk} />}
              onPress={onMark}
              disabled={marking}
            />
          )}
          <View style={styles.openTill}>
            <ClockIcon size={16} color={colors.textMuted} />
            <Text style={styles.openTillText}>{progress.markedToday ? t.haazri.doneToday : t.haazri.openTill}</Text>
          </View>

          <CheckboxRow title={t.haazri.remind} value={prefs.haazriReminder} onChange={(v) => setPref('haazriReminder', v)} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { flexGrow: 1, backgroundColor: colors.surface },
  hero: { paddingHorizontal: 16, paddingBottom: 52 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { fontFamily: fonts.display, fontSize: 24, lineHeight: 30, color: colors.onDark, ...headingShadow },
  status: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 18 },
  statusText: { flex: 1, gap: 2 },
  moreDays: { fontFamily: fonts.display, fontSize: 26, lineHeight: 30, color: colors.onDark },
  unlocks: { fontFamily: fonts.body, fontSize: 16, lineHeight: 21, color: colors.onDarkMuted },
  sheet: {
    marginTop: -30,
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 14,
    boxShadow: '0px -6px 20px rgba(11,26,102,0.12)',
  },
  switcher: { gap: 8 },
  switchCard: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 14, borderRadius: 14, backgroundColor: colors.bg, borderWidth: 2, borderColor: colors.border },
  switchCardActive: { backgroundColor: colors.primaryTint, borderColor: colors.primary },
  switchText: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: colors.textMuted },
  switchTextActive: { fontFamily: fonts.bodyBold, color: colors.primaryEdge },
  markText: { fontSize: 21 },
  openTill: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: -4 },
  openTillText: { fontFamily: fonts.body, fontSize: 14, color: colors.textMuted },
});
