import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Sunburst } from '@/components/ui/art';
import { Button3D } from '@/components/ui/button-3d';
import { PrizeImage } from '@/components/ui/prize-image';
import { GoldPill } from '@/components/ui/tag';
import { colors, fonts, gradientPoints, headingShadow } from '@/constants/theme';
import { t } from '@/i18n';
import { formatDay } from '@/lib/format';
import type { Giveaway } from '@/types';

const points = gradientPoints(135);

// Pinned Mega Draw card on the Giveaways screen.
export function MegaDrawCard({ giveaway, onPress }: { giveaway: Giveaway; onPress: () => void }) {
  const total = giveaway.haazriDays;
  const done = giveaway.progress?.daysCompleted ?? 0;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${t.home.megaDraw}: ${giveaway.title}`}>
      {({ pressed }) => (
        <LinearGradient colors={[giveaway.tileColorFrom, giveaway.tileColorTo]} {...points} style={styles.card}>
          <Sunburst size={300} opacity={0.07} style={styles.burst} />
          <View style={styles.left}>
            <GoldPill label={giveaway.tag || t.home.megaDraw} small />
            <Text style={styles.title} numberOfLines={2}>
              {giveaway.title}
            </Text>
            <Text style={styles.subtitle}>{t.giveaways.megaSubtitle(total, formatDay(giveaway.lastDate))}</Text>
            <View style={styles.progressRow} accessible accessibilityLabel={`${done} / ${total}`}>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${total ? (done / total) * 100 : 0}%` }]} />
              </View>
              <Text style={styles.progressText}>
                {done}/{total}
              </Text>
            </View>
            <Button3D variant="goldSmall" label={t.giveaways.continueHaazri} asStatic pressed={pressed} style={styles.button} />
          </View>
          <PrizeImage uri={giveaway.imageUrl} width={110} height={150} />
        </LinearGradient>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 18,
    borderRadius: 24,
    overflow: 'hidden',
    boxShadow: '0px 10px 24px rgba(11,26,102,0.25)',
  },
  burst: { right: -90, top: -70 },
  left: { flex: 1, gap: 6, alignItems: 'flex-start' },
  title: { fontFamily: fonts.display, fontSize: 28, lineHeight: 32, color: colors.onDark, ...headingShadow },
  subtitle: { fontFamily: fonts.body, fontSize: 14, lineHeight: 19, color: colors.onDarkMuted },
  progressRow: { alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  track: { flex: 1, height: 8, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.2)', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 8, backgroundColor: colors.coinMid },
  progressText: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.goldOnDark },
  button: { marginTop: 4 },
});
