import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getHaazri } from '@/api';
import { HaazriPath } from '@/components/giveaway/haazri-path';
import { TaskSheet } from '@/components/giveaway/task-sheet';
import { ConfettiLayer, Medal, Sunburst, type ConfettiPiece } from '@/components/ui/art';
import { Button3D } from '@/components/ui/button-3d';
import { CheckboxRow } from '@/components/ui/checkbox-row';
import { HeroBackground } from '@/components/ui/hero';
import { CheckIcon, ClockIcon } from '@/components/ui/icons';
import { ScreenState } from '@/components/ui/screen-state';
import { colors, fonts, headingShadow } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';
import { t } from '@/i18n';
import { formatDay, formatTime } from '@/lib/format';
import { giveawayAction } from '@/lib/giveaway-state';
import { applyReminder } from '@/lib/reminders';
import { saveProfile, useSession } from '@/store/session';
import type { Giveaway } from '@/types';

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
  const params = useLocalSearchParams<{ id?: string }>();
  const { user } = useSession();
  const { data, error, refreshing, refresh } = useApi(getHaazri);
  const [selectedId, setSelectedId] = useState<string>();
  const [taskFor, setTaskFor] = useState<Giveaway | null>(null);

  if (!data) return <ScreenState error={error} onRetry={refresh} />;

  const list = data.giveaways;
  const g = list.find((x) => x.id === selectedId) ?? list.find((x) => x.id === params.id) ?? list[0];

  const toggleReminder = async (enabled: boolean) => {
    const time = user?.reminderTime ?? '09:00';
    await saveProfile({ reminderEnabled: enabled }).catch(() => {});
    await applyReminder(enabled, time).catch(() => {});
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
          <Text style={styles.title} accessibilityRole="header">
            {t.haazri.title}
          </Text>
          {g ? <HeroStatus giveaway={g} /> : null}
        </HeroBackground>

        <View style={styles.sheet}>
          {!g ? (
            <Text style={styles.empty}>{t.haazri.empty}</Text>
          ) : (
            <>
              {list.length > 1 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.switcher}>
                  {list.map((x) => {
                    const active = x.id === g.id;
                    const doneToday = x.progress?.doneToday;
                    return (
                      <Pressable
                        key={x.id}
                        onPress={() => setSelectedId(x.id)}
                        accessibilityRole="tab"
                        accessibilityState={{ selected: active }}
                        style={[styles.switchCard, active && styles.switchCardActive]}>
                        {doneToday ? <CheckIcon size={14} color={colors.success} strokeWidth={3} /> : null}
                        <Text style={[styles.switchText, active && styles.switchTextActive]} numberOfLines={1}>
                          {t.haazri.switcherLabel(x.title, x.progress?.daysCompleted ?? 0, x.haazriDays)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              ) : null}

              <HaazriPath total={g.haazriDays} done={g.progress?.daysCompleted ?? 0} doneToday={g.progress?.doneToday ?? false} prizeTitle={g.title} />

              <MainAction giveaway={g} onDoTask={() => setTaskFor(g)} onOpen={() => router.push(`/giveaway/${g.id}`)} />
              <View style={styles.lastDate}>
                <ClockIcon size={16} color={colors.textMuted} />
                <Text style={styles.lastDateText}>{g.progress?.doneToday ? t.haazri.doneToday : t.haazri.lastDate(formatDay(g.lastDate))}</Text>
              </View>
            </>
          )}

          {user ? <CheckboxRow title={t.haazri.remind(formatTime(user.reminderTime))} value={user.reminderEnabled} onChange={toggleReminder} /> : null}
        </View>
      </ScrollView>

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

function HeroStatus({ giveaway: g }: { giveaway: Giveaway }) {
  const p = g.progress;
  const action = giveawayAction(g);
  const left = Math.max(0, g.haazriDays - (p?.daysCompleted ?? 0));
  const [headline, body] =
    action === 'inDraw'
      ? [t.haazri.qualified, t.haazri.qualifiedBody(g.title)]
      : action === 'tooLate'
        ? [t.haazri.tooLate, t.haazri.tooLateBody(p?.daysLeft ?? 0, left)]
        : [t.haazri.moreDays(left), t.haazri.unlocks(g.title)];
  return (
    <View style={styles.status}>
      <Medal day={Math.min(p?.currentDay ?? 1, g.haazriDays)} label={t.haazri.day} />
      <View style={styles.statusText}>
        <Text style={styles.moreDays}>{headline}</Text>
        <Text style={styles.unlocks}>{body}</Text>
      </View>
    </View>
  );
}

function MainAction({ giveaway, onDoTask, onOpen }: { giveaway: Giveaway; onDoTask: () => void; onOpen: () => void }) {
  const action = giveawayAction(giveaway);
  if (action === 'start' || action === 'doToday') {
    return <Button3D variant="gold" height={58} label={t.home.doHaazri} textStyle={styles.mainText} icon={<CheckIcon size={24} color={colors.goldInk} />} onPress={onDoTask} />;
  }
  const label = action === 'inDraw' ? t.home.inTheDraw : action === 'tooLate' ? t.haazri.tooLate : t.home.haazriDoneToday;
  return <Button3D variant="done" height={58} label={label} icon={action === 'tooLate' ? undefined : <CheckIcon size={24} color={colors.successText} />} onPress={onOpen} />;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { flexGrow: 1, backgroundColor: colors.surface },
  hero: { paddingHorizontal: 16, paddingBottom: 52 },
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
  empty: { fontFamily: fonts.body, fontSize: 16, lineHeight: 22, color: colors.textMuted, textAlign: 'center', paddingVertical: 24 },
  switcher: { gap: 8 },
  switchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    maxWidth: 240,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: colors.bg,
    borderWidth: 2,
    borderColor: colors.border,
  },
  switchCardActive: { backgroundColor: colors.primaryTint, borderColor: colors.primary },
  switchText: { flexShrink: 1, fontFamily: fonts.bodySemiBold, fontSize: 15, color: colors.textMuted },
  switchTextActive: { fontFamily: fonts.bodyBold, color: colors.primaryEdge },
  mainText: { fontSize: 21 },
  lastDate: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: -4 },
  lastDateText: { fontFamily: fonts.body, fontSize: 14, color: colors.textMuted },
});
