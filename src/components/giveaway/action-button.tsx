import { StyleSheet, Text, View } from 'react-native';

import { Button3D } from '@/components/ui/button-3d';
import { CheckIcon } from '@/components/ui/icons';
import { colors, fonts } from '@/constants/theme';
import { t } from '@/i18n';
import { giveawayAction } from '@/lib/giveaway-state';
import type { Giveaway } from '@/types';

const LABELS = { start: t.card.start, doToday: t.card.doToday, doneToday: t.card.doneToday, inDraw: t.card.inDraw, tooLate: t.card.tooLate } as const;

// The small action on a giveaway card: a blue button when there's something to do today,
// otherwise a status badge. Drawn as visuals; the card itself owns the tap.
export function CardAction({ giveaway, pressed, festival, full }: { giveaway: Giveaway; pressed?: boolean; festival?: boolean; full?: boolean }) {
  const action = giveawayAction(giveaway);
  if (action === 'start' || action === 'doToday') {
    return (
      <Button3D
        variant={festival ? 'goldSmall' : 'blue'}
        height={44}
        label={LABELS[action]}
        textStyle={styles.buttonText}
        faceStyle={styles.buttonFace}
        asStatic
        pressed={pressed}
        style={full ? styles.full : undefined}
      />
    );
  }
  const positive = action !== 'tooLate';
  return (
    <View style={[styles.badge, positive ? styles.badgeDone : styles.badgeClosed, full && styles.full]}>
      {positive ? <CheckIcon size={16} color={colors.successText} strokeWidth={3} /> : null}
      <Text style={[styles.badgeText, !positive && styles.badgeTextClosed]}>{LABELS[action]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonText: { fontFamily: fonts.bodyBold, fontSize: 15 },
  buttonFace: { paddingHorizontal: 16 },
  full: { alignSelf: 'stretch' },
  badge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, minHeight: 44, paddingHorizontal: 12, borderRadius: 12 },
  badgeDone: { backgroundColor: colors.successBg },
  badgeClosed: { backgroundColor: colors.bg },
  badgeText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.successText },
  badgeTextClosed: { color: colors.textMuted },
});
