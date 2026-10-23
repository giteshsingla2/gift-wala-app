import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ChevronRightIcon, PlayIcon } from '@/components/ui/icons';
import { PrizeImage } from '@/components/ui/prize-image';
import { colors, fonts, shadows } from '@/constants/theme';
import { t } from '@/i18n';
import { formatWonAt } from '@/lib/format';
import type { Winner } from '@/types';

// "₹20 recharge won by / Pooja Yadav / Azamgarh · Yesterday" with the prize on the right.
// We never show a winner's phone number, masked or not.
export function WinnerCard({ winner, compact, onWatchVideo }: { winner: Winner; compact?: boolean; onWatchVideo?: () => void }) {
  const meta = [winner.town, formatWonAt(winner.wonAt)].filter(Boolean).join(t.common.dot);
  const size = compact ? 64 : 88;
  return (
    <View style={[styles.card, compact && styles.compact]}>
      <View style={styles.text}>
        <Text style={[styles.label, compact && styles.labelCompact]}>{t.home.wonBy(winner.prizeLabel)}</Text>
        <Text style={[styles.name, compact && styles.nameCompact]}>{winner.name}</Text>
        <Text style={[styles.meta, compact && styles.metaCompact]}>{meta}</Text>
        {winner.videoUrl && onWatchVideo ? (
          <Pressable onPress={onWatchVideo} accessibilityRole="button" style={({ pressed }) => [styles.video, pressed && { opacity: 0.7 }]}>
            <PlayIcon size={16} />
            <Text style={styles.videoText}>{t.home.watchVideo}</Text>
          </Pressable>
        ) : null}
      </View>
      <PrizeImage uri={winner.prizeImageUrl} width={size} />
    </View>
  );
}

// "180 people / won prizes yesterday" summary row.
export function WinnerSummaryRow({ count, label, onPress }: { count: number; label: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} accessibilityRole={onPress ? 'button' : undefined} style={({ pressed }) => [styles.card, styles.summary, pressed && { opacity: 0.85 }]}>
      <View style={styles.text}>
        <Text style={styles.summaryCount}>{t.home.peopleCount(count)}</Text>
        <Text style={styles.summaryLabel}>{label}</Text>
      </View>
      {onPress ? <ChevronRightIcon size={24} color={colors.primary} /> : null}
    </Pressable>
  );
}

export function MoreWinnersDivider() {
  return (
    <View style={styles.divider}>
      <View style={styles.line} />
      <Text style={styles.dividerText}>{t.home.moreWinners}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: 20,
    boxShadow: shadows.card,
    paddingVertical: 16,
    paddingLeft: 18,
    paddingRight: 12,
  },
  compact: { paddingVertical: 12, paddingLeft: 16, paddingRight: 10, boxShadow: '0px 6px 16px rgba(20,40,120,0.10)' },
  text: { flex: 1, gap: 1 },
  label: { fontFamily: fonts.displayBold, fontSize: 17, lineHeight: 21, color: colors.prize },
  labelCompact: { fontSize: 15, lineHeight: 19 },
  name: { fontFamily: fonts.display, fontSize: 22, lineHeight: 27, color: colors.text },
  nameCompact: { fontSize: 20, lineHeight: 24 },
  meta: { fontFamily: fonts.body, fontSize: 14, lineHeight: 19, color: colors.textMuted },
  metaCompact: { fontSize: 13, lineHeight: 17 },
  video: {
    alignSelf: 'flex-start',
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: colors.bgAlt,
  },
  videoText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.primary },
  summary: { paddingVertical: 14, paddingRight: 16, gap: 10 },
  summaryCount: { fontFamily: fonts.display, fontSize: 19, lineHeight: 23, color: colors.text },
  summaryLabel: { fontFamily: fonts.displayBold, fontSize: 16, lineHeight: 20, color: colors.prize },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 8 },
  line: { flex: 1, height: 1, backgroundColor: colors.divider },
  dividerText: { fontFamily: fonts.bodyBold, fontSize: 13, letterSpacing: 1.6, color: colors.textMuted2 },
});
