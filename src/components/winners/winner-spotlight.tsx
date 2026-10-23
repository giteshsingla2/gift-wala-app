import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LaurelCrown } from '@/components/ui/art';
import { PlayIcon } from '@/components/ui/icons';
import { colors, fonts, headingShadow } from '@/constants/theme';
import { t } from '@/i18n';
import { formatWonAt, initials } from '@/lib/format';
import type { Winner } from '@/types';

// Mega winner on the Winners hero: photo (or initials) in a gold ring with laurels and a crown.
export function WinnerSpotlight({ winner, onWatchVideo }: { winner: Winner; onWatchVideo?: () => void }) {
  return (
    <View style={styles.wrap}>
      <LaurelCrown>
        {winner.photoUrl ? (
          <Image source={{ uri: winner.photoUrl }} style={styles.photo} contentFit="cover" accessible={false} />
        ) : (
          <Text style={styles.initials}>{initials(winner.name)}</Text>
        )}
      </LaurelCrown>
      <Text style={styles.name}>{winner.name}</Text>
      <Text style={styles.prize}>
        {t.winners.wonPrefix}
        <Text style={styles.prizeName}>{winner.prizeLabel}</Text>
        {t.common.dot}
        {formatWonAt(winner.wonAt)}
      </Text>
      {winner.videoUrl && onWatchVideo ? (
        <Pressable onPress={onWatchVideo} accessibilityRole="button" style={({ pressed }) => [styles.video, pressed && { opacity: 0.75 }]}>
          <PlayIcon size={30} circle={colors.coinMid} triangle={colors.goldInk} />
          <Text style={styles.videoText}>{t.home.watchVideo}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  photo: { width: 74, height: 74 },
  initials: { fontFamily: fonts.display, fontSize: 32, lineHeight: 40, color: colors.onDark },
  name: { marginTop: -4, fontFamily: fonts.display, fontSize: 26, lineHeight: 30, color: colors.onDark, ...headingShadow },
  prize: { fontFamily: fonts.body, fontSize: 15, lineHeight: 20, color: colors.onDarkMuted, textAlign: 'center' },
  prizeName: { fontFamily: fonts.bodyBold, color: colors.goldOnDark },
  video: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 44,
    paddingLeft: 8,
    paddingRight: 18,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  videoText: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.onDark },
});
