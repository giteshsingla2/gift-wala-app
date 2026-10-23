import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { Button3D } from '@/components/ui/button-3d';
import { CalendarCheckIcon, CheckIcon } from '@/components/ui/icons';
import { colors, goldGradient, shadows, type as typo } from '@/constants/theme';
import { t } from '@/i18n';
import type { HaazriProgress } from '@/types';
import { CoinTrack } from './coin-track';

// Home card that overlaps the hero: today's haazri status, the coin track and the main action.
export function HaazriCard({ progress, onPress }: { progress: HaazriProgress; onPress: () => void }) {
  const day = progress.markedToday ? progress.daysMarked : progress.daysMarked + 1;
  const left = Math.max(0, progress.haazriDays - day);
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <LinearGradient colors={goldGradient} style={styles.iconTile}>
          <CalendarCheckIcon size={24} color={colors.goldInk} strokeWidth={2.4} />
        </LinearGradient>
        <View style={styles.headerText}>
          <Text style={typo.sectionHeading}>{t.home.dailyHaazri}</Text>
          <Text style={typo.secondary}>{t.home.haazriProgress(day, progress.haazriDays, left, progress.prizeShortName)}</Text>
        </View>
      </View>
      <CoinTrack progress={progress} />
      {progress.markedToday ? (
        <Button3D variant="done" label={t.home.haazriDoneToday} icon={<CheckIcon size={22} color={colors.successText} />} onPress={onPress} />
      ) : (
        <Button3D variant="gold" label={t.home.markHaazri} icon={<CheckIcon size={22} color={colors.goldInk} />} onPress={onPress} />
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
