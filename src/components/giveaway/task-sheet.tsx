import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ApiError, completeHaazri, startHaazri } from '@/api';
import { Button3D } from '@/components/ui/button-3d';
import { CheckIcon } from '@/components/ui/icons';
import { colors, fonts } from '@/constants/theme';
import { t } from '@/i18n';
import type { Giveaway, Progress, Task } from '@/types';

// Bottom sheet that runs today's haazri task for one giveaway and reports it to the server.
// Share: counted after the share screen has been opened N times.
// Website: the server times how long the user was away; returning too soon asks them to go back.
// Ad: needs the AdMob build, so it's shown as coming soon.

type Props = {
  giveaway: Giveaway | null;
  onClose: () => void;
  onDone: (giveaway: Giveaway, progress: Progress) => void;
};

type Phase = { kind: 'starting' } | { kind: 'ready'; attemptId: number; task: Task } | { kind: 'error'; message: string };

export function TaskSheet({ giveaway, onClose, onDone }: Props) {
  if (!giveaway) return null;
  return <TaskSheetBody key={giveaway.id} giveaway={giveaway} onClose={onClose} onDone={onDone} />;
}

function TaskSheetBody({ giveaway, onClose, onDone }: Props & { giveaway: Giveaway }) {
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = useState<Phase>({ kind: 'starting' });
  const [shares, setShares] = useState(0);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string>();

  useEffect(() => {
    let cancelled = false;
    startHaazri(giveaway.id)
      .then((r) => !cancelled && setPhase({ kind: 'ready', attemptId: r.attemptId, task: r.task }))
      .catch((e: Error) => !cancelled && setPhase({ kind: 'error', message: e.message }));
    return () => {
      cancelled = true;
    };
  }, [giveaway.id]);

  const finish = async (attemptId: number, sharesOpened?: number) => {
    setBusy(true);
    try {
      const { progress } = await completeHaazri(giveaway.id, attemptId, sharesOpened);
      onDone(giveaway, progress);
    } catch (e) {
      setNote(e instanceof ApiError && e.code === 'too_soon' ? t.task.tooSoon : (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const doShare = async (attemptId: number, task: Task) => {
    const need = task.shareCount ?? 5;
    const result = await Share.share({ message: task.shareMessage || t.task.shareMessage(giveaway.title, t.appName) }).catch(() => null);
    if (!result || result.action === Share.dismissedAction) return;
    const next = shares + 1;
    setShares(next);
    if (next >= need) await finish(attemptId, next);
  };

  const doWebsite = async (attemptId: number, task: Task) => {
    if (!task.url) return;
    setNote(undefined);
    await WebBrowser.openBrowserAsync(task.url).catch(() => null);
    await finish(attemptId);
  };

  let body: React.ReactNode;
  if (phase.kind === 'starting') {
    body = <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />;
  } else if (phase.kind === 'error') {
    body = <Text style={styles.body}>{phase.message}</Text>;
  } else {
    const { task, attemptId } = phase;
    const need = task.shareCount ?? 5;
    body = (
      <>
        <Text style={styles.day}>
          {t.card.dayOf(task.day, giveaway.haazriDays)}
          {t.common.dot}
          {giveaway.title}
        </Text>
        <Text style={styles.title}>{task.type === 'share' ? t.task.title.share(need) : t.task.title[task.type]}</Text>
        <Text style={styles.body}>
          {task.type === 'share' ? t.task.body.share : task.type === 'website' ? t.task.body.website(task.minSeconds ?? 30) : t.task.body.ad}
        </Text>

        {task.type === 'share' ? (
          <>
            <View style={styles.dots} accessible accessibilityLabel={t.task.sharesDone(shares, need)}>
              {Array.from({ length: need }, (_, i) => (
                <View key={i} style={[styles.dot, i < shares && styles.dotOn]}>
                  {i < shares ? <CheckIcon size={14} color="#FFFFFF" strokeWidth={3.2} /> : null}
                </View>
              ))}
            </View>
            <Text style={styles.counter}>{t.task.sharesDone(shares, need)}</Text>
            <Button3D variant="green" label={t.task.shareButton} onPress={() => doShare(attemptId, task)} disabled={busy} />
          </>
        ) : task.type === 'website' ? (
          <Button3D variant="gold" label={note ? t.task.tryAgain : t.task.websiteButton} onPress={() => doWebsite(attemptId, task)} disabled={busy} />
        ) : (
          <Text style={styles.notice}>{t.task.adComingSoon}</Text>
        )}
        {busy ? <Text style={styles.counter}>{t.task.counting}</Text> : null}
        {note ? <Text style={styles.note}>{note}</Text> : null}
      </>
    );
  }

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel={t.task.close} />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.handle} />
        {body}
        <Pressable onPress={onClose} accessibilityRole="button" style={styles.close}>
          <Text style={styles.closeText}>{t.task.close}</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(11,21,80,0.45)' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
    paddingHorizontal: 20,
    gap: 12,
  },
  handle: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: colors.border, marginBottom: 6 },
  spinner: { marginVertical: 40 },
  day: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.textMuted },
  title: { fontFamily: fonts.display, fontSize: 26, lineHeight: 32, color: colors.text },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 22, color: colors.text2 },
  dots: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  dot: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.track, alignItems: 'center', justifyContent: 'center' },
  dotOn: { backgroundColor: colors.success },
  counter: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.textMuted, textAlign: 'center' },
  notice: { fontFamily: fonts.bodySemiBold, fontSize: 15, lineHeight: 21, color: colors.prize, backgroundColor: '#FFF4DB', borderRadius: 14, padding: 14 },
  note: { fontFamily: fonts.bodySemiBold, fontSize: 15, lineHeight: 21, color: colors.liveText, textAlign: 'center' },
  close: { alignSelf: 'center', minHeight: 44, justifyContent: 'center', paddingHorizontal: 20 },
  closeText: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.primary },
});
