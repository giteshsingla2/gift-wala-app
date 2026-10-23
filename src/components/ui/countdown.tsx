import { Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/constants/theme';
import { useNow } from '@/hooks/use-now';
import { t } from '@/i18n';
import { pad2, splitDuration } from '@/lib/format';

// Dark glass tiles that tick live towards `endsAt`.
export function Countdown({ endsAt, label }: { endsAt: string; label?: string }) {
  const now = useNow(1000);
  const { days, hours, minutes } = splitDuration(new Date(endsAt).getTime() - now);
  const tiles = [
    { value: pad2(days), unit: t.countdown.days },
    { value: pad2(hours), unit: t.countdown.hrs },
    { value: pad2(minutes), unit: t.countdown.min },
  ];
  return (
    <View style={styles.row} accessible accessibilityLabel={`${label ?? ''} ${days} ${t.countdown.days} ${hours} ${t.countdown.hrs} ${minutes} ${t.countdown.min}`}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      {tiles.map((tile, i) => (
        <Fragment key={tile.unit}>
          {i > 0 && <Text style={styles.colon}>:</Text>}
          <View style={styles.tile}>
            <Text style={styles.value}>{tile.value}</Text>
            <Text style={styles.unit}>{tile.unit}</Text>
          </View>
        </Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  label: { fontFamily: fonts.body, fontSize: 14, color: colors.onDarkMuted, marginRight: 4 },
  tile: {
    minWidth: 54,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: 'rgba(5,12,60,0.45)',
    borderWidth: 1,
    borderColor: colors.glassDarkBorder,
    alignItems: 'center',
  },
  value: { fontFamily: fonts.display, fontSize: 22, lineHeight: 26, color: colors.onDark },
  unit: { fontFamily: fonts.body, fontSize: 12, lineHeight: 14, color: colors.onDarkFaint },
  colon: { fontFamily: fonts.bodyBold, fontSize: 20, color: colors.goldOnDark },
});
