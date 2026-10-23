import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, shadows, type as typo } from '@/constants/theme';
import { t } from '@/i18n';
import { formatDay } from '@/lib/format';
import type { Giveaway } from '@/types';
import { CardAction } from './action-button';
import { PrizeTile, tileColorsOf } from './prize-tile';

// Home carousel card: 172 wide, prize tile on top, the user's progress and today's action.
export function GiveawayCarouselCard({ giveaway, onPress }: { giveaway: Giveaway; onPress: () => void }) {
  const done = giveaway.progress?.daysCompleted ?? 0;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={giveaway.title} style={styles.card}>
      {({ pressed }) => (
        <>
          <PrizeTile colors={tileColorsOf(giveaway)} imageUrl={giveaway.imageUrl} size={172} height={112} imageSize={100} radius={0} />
          <View style={styles.body}>
            <Text style={typo.cardTitle} numberOfLines={1}>
              {giveaway.title}
            </Text>
            <Text style={styles.meta} numberOfLines={1}>
              {giveaway.haazriDays > 1 ? t.card.dayOf(done, giveaway.haazriDays) : t.common.winners(giveaway.winnersCount)}
              {t.common.dot}
              {formatDay(giveaway.lastDate)}
            </Text>
            <View style={styles.action}>
              <CardAction giveaway={giveaway} pressed={pressed} full />
            </View>
          </View>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: 172, backgroundColor: colors.surface, borderRadius: 22, boxShadow: shadows.giveawayCard, overflow: 'hidden' },
  body: { paddingTop: 12, paddingHorizontal: 14, paddingBottom: 14, gap: 4 },
  meta: { fontFamily: fonts.body, fontSize: 13, lineHeight: 17, color: colors.textMuted },
  action: { marginTop: 6 },
});
