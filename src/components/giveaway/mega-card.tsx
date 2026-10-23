import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { Sunburst } from '@/components/ui/art';
import { Button3D } from '@/components/ui/button-3d';
import { PrizeImage } from '@/components/ui/prize-art';
import { GoldPill } from '@/components/ui/tag';
import { colors, fonts, gradientPoints, headingShadow } from '@/constants/theme';
import { t } from '@/i18n';
import { formatShortDate } from '@/lib/format';
import type { Giveaway, HaazriProgress } from '@/types';

const points = gradientPoints(135);

// Pinned mega draw card on the Giveaways screen. Mega draws are entered by haazri, not a task.
export function MegaDrawCard({ giveaway, progress, onContinue }: { giveaway: Giveaway; progress?: HaazriProgress; onContinue: () => void }) {
  const total = progress?.haazriDays ?? giveaway.haazriDays ?? 0;
  const done = progress?.daysMarked ?? 0;
  return (
    <LinearGradient colors={['#13246B', colors.heroBottom]} {...points} style={styles.card}>
      <Sunburst size={300} opacity={0.07} style={styles.burst} />
      <View style={styles.left}>
        <GoldPill label={t.home.megaDraw} small />
        <Text style={styles.title}>{giveaway.title}</Text>
        <Text style={styles.subtitle}>{t.giveaways.megaSubtitle(total, formatShortDate(new Date(giveaway.resultAt)))}</Text>
        <View style={styles.progressRow} accessible accessibilityLabel={`${done} / ${total}`}>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${total ? (done / total) * 100 : 0}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {done}/{total}
          </Text>
        </View>
        <Button3D variant="goldSmall" label={t.giveaways.continueHaazri} onPress={onContinue} style={styles.button} />
      </View>
      <PrizeImage imageUrl={giveaway.imageUrl} art={giveaway.art} width={104} height={150} />
    </LinearGradient>
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
