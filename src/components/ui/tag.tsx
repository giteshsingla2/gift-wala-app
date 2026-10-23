import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts, goldGradient, tagColors, type as typo } from '@/constants/theme';
import type { TagStyle } from '@/types';

export function Tag({ label, tagStyle }: { label: string; tagStyle: TagStyle }) {
  const c = tagColors[tagStyle];
  return (
    <View style={[styles.tag, { backgroundColor: c.bg }]}>
      <Text style={[typo.tag, { color: c.text }]}>{label}</Text>
    </View>
  );
}

export function LiveChip({ label, large, style }: { label: string; large?: boolean; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.live, large && styles.liveLarge, style]}>
      <View style={[styles.liveDot, large && styles.liveDotLarge]} />
      <Text style={[styles.liveText, large && styles.liveTextLarge]}>{label}</Text>
    </View>
  );
}

// Gold "MEGA DRAW" pill.
export function GoldPill({ label, small }: { label: string; small?: boolean }) {
  return (
    <LinearGradient colors={goldGradient} style={[styles.goldPill, small && styles.goldPillSmall]}>
      <Text style={[styles.goldPillText, small && styles.goldPillTextSmall]}>{label}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  tag: { alignSelf: 'flex-start', paddingHorizontal: 8, borderRadius: 6 },
  live: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 1,
    borderRadius: 999,
    backgroundColor: colors.liveBg,
  },
  liveLarge: { paddingHorizontal: 12, paddingVertical: 6, gap: 6 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.live },
  liveDotLarge: { width: 8, height: 8 },
  liveText: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.liveText },
  liveTextLarge: { fontSize: 14 },
  goldPill: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 2,
    borderRadius: 999,
    boxShadow: `0px 3px 0px ${colors.goldEdge}`,
  },
  goldPillSmall: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 0, boxShadow: `0px 2px 0px ${colors.goldEdge}` },
  goldPillText: { fontFamily: fonts.display, fontSize: 14, lineHeight: 22, letterSpacing: 1.1, color: colors.goldInk },
  goldPillTextSmall: { fontSize: 13, lineHeight: 21, letterSpacing: 1 },
});
