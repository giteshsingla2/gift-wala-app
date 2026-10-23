import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { Button3D } from '@/components/ui/button-3d';
import { CalendarCheckIcon, CheckIcon } from '@/components/ui/icons';
import { colors, goldGradient, shadows, type as typo } from '@/constants/theme';
import { t } from '@/i18n';
import { giveawayAction } from '@/lib/giveaway-state';
import type { Giveaway } from '@/types';
import { CoinTrack } from './coin-track';

// Home card that overlaps the hero: the user's haazri in the Mega Draw and today's main action.
export function HaazriCard({ giveaway, onDoTask, onOpen }: { giveaway: Giveaway; onDoTask: () => void; onOpen: () => void }) {
  const p = giveaway.progress;
  const done = p?.daysCompleted ?? 0;
  const day = p?.currentDay ?? 1;
  const left = Math.max(0, giveaway.haazriDays - day);
  const action = giveawayAction(giveaway);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <LinearGradient colors={goldGradient} style={styles.iconTile}>
          <CalendarCheckIcon size={24} color={colors.goldInk} strokeWidth={2.4} />
        </LinearGradient>
        <View style={styles.headerText}>
          <Text style={typo.sectionHeading}>{t.home.dailyHaazri}</Text>
          <Text style={typo.secondary}>
            {action === 'tooLate' ? t.haazri.tooLate : t.home.haazriProgress(day, giveaway.haazriDays, left, giveaway.title)}
          </Text>
        </View>
      </View>
      <CoinTrack total={giveaway.haazriDays} done={done} doneToday={p?.doneToday ?? false} />
      {action === 'start' || action === 'doToday' ? (
        <Button3D variant="gold" label={t.home.doHaazri} icon={<CheckIcon size={22} color={colors.goldInk} />} onPress={onDoTask} />
      ) : (
        <Button3D
          variant="done"
          label={action === 'inDraw' ? t.home.inTheDraw : action === 'tooLate' ? t.haazri.tooLate : t.home.haazriDoneToday}
          icon={action === 'tooLate' ? undefined : <CheckIcon size={22} color={colors.successText} />}
          onPress={onOpen}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 24, padding: 18, gap: 14, boxShadow: shadows.raised },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconTile: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 3px 0px ${colors.goldEdge}`,
  },
  headerText: { flex: 1 },
});
