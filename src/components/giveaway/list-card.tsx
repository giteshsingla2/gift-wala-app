import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button3D } from '@/components/ui/button-3d';
import { CheckIcon } from '@/components/ui/icons';
import { Tag } from '@/components/ui/tag';
import { colors, fonts, shadows, tagColors } from '@/constants/theme';
import { t } from '@/i18n';
import { formatEnds } from '@/lib/format';
import type { Giveaway } from '@/types';
import { PrizeTile } from './prize-tile';

// Giveaways screen row: prize tile, tag + title + meta, Enter button or "Entered" badge.
// Festival giveaways get the warm card and a gold Enter button.
export function GiveawayListCard({ giveaway, onPress }: { giveaway: Giveaway; onPress: () => void }) {
  const festival = giveaway.tagStyle === 'festival';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${giveaway.entered ? t.giveaways.entered : t.giveaways.enter}: ${giveaway.title}. ${t.giveaways.meta(giveaway.winnersCount, formatEnds(giveaway.endsAt))}`}
      style={[styles.card, festival && styles.festival]}>
      {({ pressed }) => (
        <>
          <PrizeTile giveaway={giveaway} size={88} imageSize={80} />
          <View style={styles.text}>
            <Tag label={giveaway.tag} tagStyle={giveaway.tagStyle} />
            <Text style={styles.title} numberOfLines={2}>
              {giveaway.title}
            </Text>
            <Text style={styles.meta}>{t.giveaways.meta(giveaway.winnersCount, formatEnds(giveaway.endsAt))}</Text>
          </View>
          {giveaway.entered ? (
            <View style={styles.entered}>
              <CheckIcon size={16} color={colors.successText} strokeWidth={3} />
              <Text style={styles.enteredText}>{t.giveaways.entered}</Text>
            </View>
          ) : (
            <Button3D
              variant={festival ? 'goldSmall' : 'blue'}
              height={44}
              label={t.giveaways.enter}
              textStyle={styles.enterText}
              faceStyle={styles.enterFace}
              asStatic
              pressed={pressed}
            />
          )}
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
  entered: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.successBg,
  },
  enteredText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.successText },
  enterFace: { paddingHorizontal: 16 },
  enterText: { fontFamily: fonts.bodyBold, fontSize: 15 },
});
