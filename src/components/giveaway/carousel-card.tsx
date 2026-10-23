import { StyleSheet, Text, View } from 'react-native';

import { Button3D } from '@/components/ui/button-3d';
import { colors, fonts, shadows, type as typo } from '@/constants/theme';
import { t } from '@/i18n';
import type { Giveaway } from '@/types';
import { PrizeTile } from './prize-tile';

const AVATAR_COLORS = ['#C9D5FF', '#FFD9A0', '#B6EBCF', '#FFC9D6'];

// Home carousel card: 172 wide, prize tile on top, full-width Enter button.
export function GiveawayCarouselCard({ giveaway, onPress }: { giveaway: Giveaway; onPress: () => void }) {
  const offset = giveaway.sortOrder;
  return (
    <View style={styles.card}>
      <PrizeTile giveaway={giveaway} size={172} height={112} imageSize={96} radius={0} />
      <View style={styles.body}>
        <Text style={typo.cardTitle} numberOfLines={1}>
          {giveaway.title}
        </Text>
        <View style={styles.winners}>
          <View style={styles.avatars}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={[styles.avatar, i > 0 && styles.avatarOverlap, { backgroundColor: AVATAR_COLORS[(i + offset) % AVATAR_COLORS.length] }]} />
            ))}
          </View>
          <Text style={styles.winnersText}>{t.common.winnersToday(giveaway.winnersCount)}</Text>
        </View>
        <Button3D
          variant={giveaway.entered ? 'done' : 'blue'}
          height={44}
          label={giveaway.entered ? t.home.entered : t.home.enterFree}
          textStyle={giveaway.entered ? styles.enteredText : undefined}
          onPress={onPress}
          accessibilityLabel={`${giveaway.entered ? t.home.entered : t.home.enterFree}: ${giveaway.title}`}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: 172, backgroundColor: colors.surface, borderRadius: 22, boxShadow: shadows.giveawayCard, overflow: 'hidden' },
  body: { paddingTop: 12, paddingHorizontal: 14, paddingBottom: 14, gap: 6 },
  winners: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  avatars: { flexDirection: 'row' },
  avatar: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#FFFFFF' },
  avatarOverlap: { marginLeft: -7 },
  winnersText: { flex: 1, fontFamily: fonts.body, fontSize: 13, lineHeight: 17, color: colors.textMuted },
  button: { marginTop: 4 },
  enteredText: { fontFamily: fonts.bodyBold, fontSize: 16 },
});
