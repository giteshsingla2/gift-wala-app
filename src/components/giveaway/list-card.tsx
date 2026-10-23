import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Tag } from '@/components/ui/tag';
import { colors, fonts, shadows, tagColors } from '@/constants/theme';
import { t } from '@/i18n';
import { formatDay } from '@/lib/format';
import type { Giveaway } from '@/types';
import { CardAction } from './action-button';
import { PrizeTile, tileColorsOf } from './prize-tile';

// Giveaways screen row: prize tile, tag + title + meta + progress, today's action.
// Festival giveaways get the warm card and a gold button.
export function GiveawayListCard({ giveaway, onPress }: { giveaway: Giveaway; onPress: () => void }) {
  const festival = giveaway.tagStyle === 'festival';
  const done = giveaway.progress?.daysCompleted ?? 0;
  const meta = t.giveaways.meta(giveaway.winnersCount, formatDay(giveaway.lastDate));
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${giveaway.title}. ${meta}`}
      style={[styles.card, festival && styles.festival]}>
      {({ pressed }) => (
        <>
          <PrizeTile colors={tileColorsOf(giveaway)} imageUrl={giveaway.imageUrl} size={88} imageSize={80} />
          <View style={styles.text}>
            <Tag label={giveaway.tag} tagStyle={giveaway.tagStyle} />
            <Text style={styles.title} numberOfLines={2}>
              {giveaway.title}
            </Text>
            <Text style={styles.meta}>{meta}</Text>
            {giveaway.haazriDays > 1 ? (
              <View style={styles.progressRow}>
                <View style={styles.track}>
                  <View style={[styles.fill, { width: `${(done / giveaway.haazriDays) * 100}%` }]} />
                </View>
                <Text style={styles.progressText}>
                  {done}/{giveaway.haazriDays}
                </Text>
              </View>
            ) : null}
          </View>
          <CardAction giveaway={giveaway} pressed={pressed} festival={festival} />
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 22,
    boxShadow: shadows.card,
  },
  festival: {
    backgroundColor: tagColors.festival.cardBg,
    borderWidth: 2,
    borderColor: tagColors.festival.cardBorder,
    boxShadow: '0px 6px 16px rgba(194,65,12,0.12)',
  },
  text: { flex: 1, minWidth: 0, gap: 2 },
  title: { fontFamily: fonts.display, fontSize: 19, lineHeight: 23, color: colors.text },
  meta: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, color: colors.textMuted },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  track: { flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.track, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3, backgroundColor: colors.coinMid },
  progressText: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.textMuted },
});
