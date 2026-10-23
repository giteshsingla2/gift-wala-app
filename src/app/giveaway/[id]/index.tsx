import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getGiveaway } from '@/api';
import { CoinTrack } from '@/components/giveaway/coin-track';
import { DetailHeroArt } from '@/components/giveaway/hero-art';
import { TaskSheet } from '@/components/giveaway/task-sheet';
import { Sunburst } from '@/components/ui/art';
import { Button3D } from '@/components/ui/button-3d';
import { GlassIconButton } from '@/components/ui/glass';
import { BackIcon, CalendarCheckIcon, CheckIcon, ClockIcon, ShareIcon, ShieldCheckIcon, SmallTrophyIcon } from '@/components/ui/icons';
import { ScreenState } from '@/components/ui/screen-state';
import { WinnerCard } from '@/components/winners/winner-card';
import { colors, fonts, goldGradient, gradientPoints, isLightColor, shadows } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';
import { t } from '@/i18n';
import { formatDay, formatMoment } from '@/lib/format';
import { giveawayAction } from '@/lib/giveaway-state';
import type { Giveaway, Task } from '@/types';

const heroPoints = gradientPoints(170);

function taskTitle(task: Task) {
  return task.type === 'share' ? t.task.title.share(task.shareCount ?? 5) : t.task.title[task.type];
}

export default function GiveawayDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { data, error, refresh } = useApi(() => getGiveaway(id), [id]);
  const [taskFor, setTaskFor] = useState<Giveaway | null>(null);

  if (!data) return <ScreenState error={error} onRetry={refresh} />;
  const { giveaway: g, winners } = data;
  const light = isLightColor(g.tileColorFrom);
  const ink = light ? colors.goldInk : '#FFFFFF';
  const heroHeight = Math.round(330 * Math.min(1, width / 390));
  const p = g.progress;
  const action = g.running === false ? 'closed' : giveawayAction(g);
  const task = g.todayTask;

  return (
    <View style={styles.screen}>
      <StatusBar style={light ? 'dark' : 'light'} />
      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        <LinearGradient colors={[g.tileColorFrom, g.tileColorTo]} {...heroPoints} style={[styles.hero, { height: heroHeight + insets.top }]}>
          <Sunburst size={420} opacity={light ? 0.16 : 0.08} style={{ left: width / 2 - 210, top: insets.top - 40 }} />
          <View style={[StyleSheet.absoluteFill, { top: insets.top }]}>
            <DetailHeroArt imageUrl={g.imageUrl} width={width} />
          </View>
          <View style={[styles.heroBar, { paddingTop: insets.top + 14 }]}>
            <GlassIconButton label={t.a11y.back} tone={light ? 'warm' : 'light'} onPress={() => router.back()}>
              <BackIcon size={22} color={ink} />
            </GlassIconButton>
            <GlassIconButton label={t.a11y.share} tone={light ? 'warm' : 'light'} onPress={() => Share.share({ message: t.detail.shareMessage(g.title, t.appName) })}>
              <ShareIcon size={20} color={ink} />
            </GlassIconButton>
          </View>
          <View style={styles.heroChips}>
            <View style={styles.heroChip}>
              <SmallTrophyIcon size={16} color="#FFFFFF" />
              <Text style={styles.heroChipText}>{t.common.winners(g.winnersCount)}</Text>
            </View>
            <View style={styles.heroChip}>
              <ClockIcon size={16} color="#FFFFFF" strokeWidth={2.2} />
              <Text style={styles.heroChipText}>{t.detail.lastDate(formatDay(g.lastDate))}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.sheet}>
          <View style={styles.titleBlock}>
            <Text style={styles.title} accessibilityRole="header">
              {g.title}
            </Text>
            {g.subtitle ? <Text style={styles.subtitle}>{g.subtitle}</Text> : null}
          </View>

          {g.haazriDays > 1 ? (
            <View style={styles.progress}>
              <Text style={styles.progressText}>{t.detail.progress(p?.daysCompleted ?? 0, g.haazriDays)}</Text>
              <CoinTrack total={g.haazriDays} done={p?.daysCompleted ?? 0} doneToday={p?.doneToday ?? false} />
            </View>
          ) : null}

          <View style={styles.steps}>
            <Text style={styles.h2} accessibilityRole="header">
              {t.detail.howToEnter}
            </Text>
            <View style={styles.stepList}>
              <View style={styles.stepLine} />
              <Step badge={<Text style={styles.stepNumber}>1</Text>} title={t.detail.stepDays(g.haazriDays)} body={t.detail.stepDaysBody} />
              <Step
                badge={p?.doneToday ? <CheckIcon size={22} color="#FFFFFF" /> : <CalendarCheckIcon size={22} color="#FFFFFF" />}
                title={p?.doneToday ? t.detail.stepTodayDone : task ? t.detail.stepToday(taskTitle(task)) : t.detail.stepTodayDone}
                body={t.detail.stepTodayBody(p?.currentDay ?? 1, g.haazriDays)}
              />
              <Step gold badge={<SmallTrophyIcon size={22} color={colors.goldInk} strokeWidth={2.4} />} title={t.detail.stepResult} body={t.detail.stepResultBody(g.resultAt ? formatMoment(g.resultAt) : null)} />
            </View>
          </View>

          <View style={styles.free}>
            <ShieldCheckIcon size={24} />
            <Text style={styles.freeText}>{t.detail.freeBanner}</Text>
          </View>

          {winners.length > 0 ? (
            <View style={styles.steps}>
              <Text style={styles.h2} accessibilityRole="header">
                {t.detail.pastWinners}
              </Text>
              {winners.map((w) => (
                <WinnerCard key={w.id} winner={w} compact onWatchVideo={() => w.videoUrl && WebBrowser.openBrowserAsync(w.videoUrl)} />
              ))}
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable onPress={() => router.push(`/giveaway/${g.id}/rules`)} accessibilityRole="link" hitSlop={12}>
          <Text style={styles.rules}>{t.detail.rules}</Text>
        </Pressable>
        <View style={styles.flex}>
          {action === 'start' || action === 'doToday' ? (
            <>
              <Button3D variant="gold" height={58} label={t.home.doHaazri} textStyle={styles.ctaText} onPress={() => setTaskFor(g)} />
              <View style={styles.freeBadge} pointerEvents="none">
                <Text style={styles.freeBadgeText}>{t.detail.free}</Text>
              </View>
            </>
          ) : (
            <Button3D
              variant="done"
              height={58}
              label={action === 'inDraw' ? t.detail.inDraw : action === 'doneToday' ? t.detail.doneToday : action === 'tooLate' ? t.haazri.tooLate : t.detail.closed}
              icon={action === 'inDraw' || action === 'doneToday' ? <CheckIcon size={22} color={colors.successText} /> : undefined}
              disabled
            />
          )}
        </View>
      </View>

      <TaskSheet
        giveaway={taskFor}
        onClose={() => setTaskFor(null)}
        onDone={(x) => {
          setTaskFor(null);
          router.push({ pathname: '/haazri-done', params: { id: x.id } });
        }}
      />
    </View>
  );
}

function Step({ badge, title, body, gold }: { badge: React.ReactNode; title: string; body: string; gold?: boolean }) {
  return (
    <View style={styles.step}>
      <LinearGradient colors={gold ? goldGradient : [colors.ribbonTop, colors.ribbonBottom]} style={[styles.stepBadge, gold && styles.stepBadgeGold]}>
        {badge}
      </LinearGradient>
      <View style={styles.flex}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepBody}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { flexGrow: 1 },
  flex: { flex: 1 },
  hero: { overflow: 'hidden' },
  heroBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16 },
  heroChips: { position: 'absolute', left: 16, right: 16, bottom: 42, flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  heroChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(58,31,0,0.62)',
  },
  heroChipText: { fontFamily: fonts.bodyBold, fontSize: 14, color: '#FFFFFF' },
  sheet: {
    marginTop: -28,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 22,
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 18,
  },
  titleBlock: { gap: 2 },
  title: { fontFamily: fonts.display, fontSize: 30, lineHeight: 34, color: colors.text },
  subtitle: { fontFamily: fonts.body, fontSize: 16, lineHeight: 22, color: colors.textMuted },
  progress: { gap: 8, padding: 14, borderRadius: 18, backgroundColor: colors.bg },
  progressText: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.text },
  steps: { gap: 10 },
  h2: { fontFamily: fonts.display, fontSize: 20, lineHeight: 26, color: colors.text },
  stepList: { gap: 14 },
  stepLine: { position: 'absolute', left: 21, top: 22, bottom: 22, width: 3, borderRadius: 3, backgroundColor: colors.primaryTint },
  step: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  stepBadge: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', boxShadow: `0px 3px 0px ${colors.primaryEdge}` },
  stepBadgeGold: { boxShadow: `0px 3px 0px ${colors.goldEdge}` },
  stepNumber: { fontFamily: fonts.display, fontSize: 20, lineHeight: 26, color: '#FFFFFF' },
  stepTitle: { fontFamily: fonts.bodyBold, fontSize: 16, lineHeight: 21, color: colors.text },
  stepBody: { fontFamily: fonts.body, fontSize: 14, lineHeight: 19, color: colors.textMuted },
  free: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 16, backgroundColor: colors.successBg },
  freeText: { flex: 1, fontFamily: fonts.bodyBold, fontSize: 15, color: colors.successText },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingTop: 14,
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    boxShadow: shadows.nav,
  },
  rules: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.primary, textDecorationLine: 'underline' },
  ctaText: { fontSize: 20 },
  freeBadge: {
    position: 'absolute',
    top: -10,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 1,
    borderRadius: 999,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  freeBadgeText: { fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 0.7, color: '#FFFFFF' },
});
