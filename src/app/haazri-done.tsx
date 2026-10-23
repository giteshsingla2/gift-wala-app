import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, Share, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getHaazri, getWinners, placeholderTotals } from '@/api';
import { ConfettiLayer, GiftGlyph, Spotlights, type ConfettiPiece } from '@/components/ui/art';
import { Button3D } from '@/components/ui/button-3d';
import { ConfettiBurst } from '@/components/ui/confetti-burst';
import { GlassIconButton } from '@/components/ui/glass';
import { BackIcon, ChatIcon } from '@/components/ui/icons';
import { RibbonPanel } from '@/components/ui/ribbon-panel';
import { ScreenState } from '@/components/ui/screen-state';
import { MoreWinnersDivider, WinnerCard, WinnerSummaryRow } from '@/components/winners/winner-card';
import { colors, fonts, goldGradient } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';
import { t } from '@/i18n';

const CONFETTI: ConfettiPiece[] = [
  { kind: 'rect', x: 40, y: 150, color: '#FFC233', rotate: 25 },
  { kind: 'rect', x: 340, y: 132, color: '#FF5C8A', rotate: -30, w: 7, h: 13 },
  { kind: 'rect', x: 74, y: 250, color: '#3DDC97', rotate: 40, w: 7, h: 12 },
  { kind: 'rect', x: 306, y: 240, color: '#7CC4FF', rotate: -20, h: 13 },
  { kind: 'rect', x: 22, y: 300, color: '#FF8A3D', rotate: -35, w: 7, h: 12 },
  { kind: 'rect', x: 356, y: 296, color: '#FFC233', rotate: 30, w: 7, h: 12 },
  { kind: 'dot', x: 100, y: 110, color: '#3DDC97', r: 4 },
  { kind: 'dot', x: 292, y: 96, color: '#FFFFFF', opacity: 0.8 },
  { kind: 'dot', x: 56, y: 210, color: '#FFC233', r: 3 },
  { kind: 'dot', x: 336, y: 200, color: '#FF5C8A' },
  { kind: 'squiggle', x: 290, y: 168, color: '#7CC4FF' },
  { kind: 'squiggle', x: 60, y: 176, color: '#FF5C8A' },
  { kind: 'squiggle', x: 320, y: 276, color: '#FFC233' },
  { kind: 'sparkle', x: 82, y: 132, color: '#FFFFFF', scale: 0.9 },
  { kind: 'sparkle', x: 312, y: 120, color: '#FFE58A' },
  { kind: 'sparkle', x: 40, y: 262, color: '#FFFFFF', scale: 0.6 },
];

// Shown right after a successful mark, with a short confetti burst.
export default function HaazriDoneScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { data, error, refresh } = useApi(async () => {
    const [haazri, winners] = await Promise.all([getHaazri(), getWinners('yesterday')]);
    return { progress: haazri[0], winners };
  });

  if (!data?.progress) return <ScreenState error={error} onRetry={refresh} />;
  const { progress, winners } = data;
  const qualified = progress.daysMarked >= progress.haazriDays;

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <LinearGradient colors={[colors.heroTop, colors.heroMid, colors.heroBottom]} locations={[0, 0.42, 1]} style={StyleSheet.absoluteFill} />
      <Spotlights width={width} height={Math.min(520, height * 0.62)} />
      <ConfettiLayer pieces={CONFETTI} width={width} height={520} style={{ top: insets.top }} />

      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 14, paddingBottom: 120 + insets.bottom }]}>
        <View style={styles.topBar}>
          <GlassIconButton label={t.a11y.back} onPress={() => router.back()}>
            <BackIcon size={22} color="#FFFFFF" />
          </GlassIconButton>
          <View style={styles.badge}>
            <LinearGradient colors={goldGradient} style={styles.badgeCoin}>
              <GiftGlyph size={26} />
            </LinearGradient>
            <Text style={styles.badgeText}>{t.appNameCaps}</Text>
          </View>
          <View style={styles.spacer} />
        </View>

        <View style={styles.headline}>
          <Text style={styles.title} accessibilityRole="header">
            {qualified ? t.haazriDone.qualifiedTitle : t.haazriDone.title}
          </Text>
          <Text style={styles.body}>{qualified ? t.haazriDone.qualifiedBody(progress.title) : t.haazriDone.body(progress.daysMarked)}</Text>
          <View style={styles.strip} accessible accessibilityLabel={`${progress.daysMarked} / ${progress.haazriDays}`}>
            <View style={styles.dots}>
              {Array.from({ length: progress.haazriDays }, (_, i) => (
                <View key={i} style={[styles.dot, i < progress.daysMarked ? styles.dotDone : styles.dotTodo]} />
              ))}
            </View>
            <Text style={styles.stripText}>
              {progress.daysMarked}/{progress.haazriDays}
            </Text>
          </View>
        </View>

        <RibbonPanel title={t.home.luckyWinners} style={styles.panel} openBottom>
          <WinnerCard winner={winners.spotlight} />
          {winners.winners.slice(0, 1).map((w) => (
            <WinnerCard key={w.id} winner={w} />
          ))}
          <MoreWinnersDivider />
          <WinnerSummaryRow count={placeholderTotals.peopleWonUpi} label={t.haazriDone.peopleWon(placeholderTotals.peopleWonUpiPrize)} art="coinStack" />
        </RibbonPanel>
      </ScrollView>

      <LinearGradient colors={['rgba(238,242,255,0)', colors.bgAlt]} locations={[0, 0.38]} style={[styles.bottom, { paddingBottom: insets.bottom + 18 }]}>
        <Button3D
          variant="green"
          style={styles.share}
          accessibilityLabel={t.a11y.whatsappShare}
          icon={<ChatIcon size={26} color="#FFFFFF" />}
          faceStyle={styles.shareFace}
          onPress={() => Share.share({ message: t.haazriDone.shareMessage(t.appName) })}
        />
        <Button3D variant="gold" label={t.haazriDone.seeGiveaways} textStyle={styles.seeText} style={styles.see} onPress={() => router.dismissTo('/')} />
      </LinearGradient>

      <ConfettiBurst />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.heroTop },
  content: { flexGrow: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  spacer: { width: 44 },
  badge: { alignItems: 'center' },
  badgeCoin: {
    zIndex: 1,
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 3px 0px ${colors.navyInk}`,
  },
  badgeText: {
    marginTop: -8,
    paddingTop: 6,
    paddingHorizontal: 12,
    paddingBottom: 1,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.navyInk,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    fontFamily: fonts.display,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 1.1,
    color: colors.onDark,
  },
  headline: { alignItems: 'center', paddingTop: 18, paddingHorizontal: 24, gap: 6 },
  title: {
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 40,
    color: colors.onDark,
    textAlign: 'center',
    textShadowColor: colors.navyInk,
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 0,
  },
  body: { fontFamily: fonts.body, fontSize: 17, lineHeight: 23, color: colors.onDarkMuted, textAlign: 'center' },
  strip: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(5,12,60,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  dots: { flexDirection: 'row', gap: 4, flexWrap: 'wrap', maxWidth: 260 },
  dot: { width: 14, height: 14, borderRadius: 7 },
  dotDone: { backgroundColor: colors.coinMid, boxShadow: `inset 0px -2px 0px ${colors.goldEdge}` },
  dotTodo: { backgroundColor: 'rgba(255,255,255,0.22)' },
  stripText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.goldOnDark },
  panel: { flexGrow: 1, marginTop: 22, marginHorizontal: 14 },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', gap: 10, paddingTop: 36, paddingHorizontal: 20 },
  share: { width: 56 },
  shareFace: { paddingHorizontal: 0 },
  see: { flex: 1 },
  seeText: { fontSize: 19 },
});
