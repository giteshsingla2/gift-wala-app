import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { colors, fonts } from '@/constants/theme';
import { t } from '@/i18n';
import { initials, minutesSince } from '@/lib/format';
import type { Winner } from '@/types';

// Light-glass pill on the Home hero that rotates through recent verified winners.
export function WinnerTicker({ winners, intervalMs = 4000 }: { winners: Winner[]; intervalMs?: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (winners.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % winners.length), intervalMs);
    return () => clearInterval(id);
  }, [winners.length, intervalMs]);

  const w = winners[index % Math.max(1, winners.length)];
  if (!w) return null;
  const line = t.home.ticker(w.firstName, w.town, w.prizeLabel);

  return (
    <View style={styles.pill} accessibilityLiveRegion="polite">
      <Animated.View key={w.id} entering={FadeIn.duration(300)} style={styles.row}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials(w.firstName, w.lastName)}</Text>
        </View>
        <Text style={styles.text} numberOfLines={1}>
          <Text style={styles.name}>{line.name}</Text>
          {line.rest}
        </Text>
        <Text style={styles.time}>{t.home.minutesAgo(minutesSince(w.wonAt))}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'center',
    maxWidth: '100%',
    padding: 5,
    paddingRight: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.coinMid, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.display, fontSize: 13, lineHeight: 18, color: colors.goldInk },
  text: { flexShrink: 1, fontFamily: fonts.body, fontSize: 14, color: colors.onDark },
  name: { fontFamily: fonts.bodyBold },
  time: { fontFamily: fonts.body, fontSize: 13, color: colors.onDarkFaint },
});
