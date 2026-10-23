import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Linking, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getHome } from '@/api';
import { GiveawayCarouselCard } from '@/components/giveaway/carousel-card';
import { HaazriCard } from '@/components/giveaway/haazri-card';
import { HomeHeroArt } from '@/components/giveaway/hero-art';
import { TaskSheet } from '@/components/giveaway/task-sheet';
import { Bunting, Coin, ConfettiLayer, GiftGlyph, type ConfettiPiece } from '@/components/ui/art';
import { Countdown } from '@/components/ui/countdown';
import { HeroBackground } from '@/components/ui/hero';
import { RibbonPanel } from '@/components/ui/ribbon-panel';
import { ScreenState } from '@/components/ui/screen-state';
import { GoldPill, LiveChip } from '@/components/ui/tag';
import { WhatsAppCard } from '@/components/ui/whatsapp-card';
import { MoreWinnersDivider, WinnerCard, WinnerSummaryRow } from '@/components/winners/winner-card';
import { WinnerTicker } from '@/components/winners/winner-ticker';
import { colors, fonts, goldGradient, headingShadow, type as typo } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';
import { t } from '@/i18n';
import { countdownTarget, formatDay } from '@/lib/format';
import { setWallet } from '@/store/session';
import type { Giveaway } from '@/types';

const CONFETTI: ConfettiPiece[] = [
  { kind: 'rect', x: 28, y: 190, color: '#FFC233', rotate: 25 },
  { kind: 'rect', x: 352, y: 176, color: '#FF5C8A', rotate: -30, w: 7, h: 13 },
  { kind: 'rect', x: 58, y: 430, color: '#7CC4FF', rotate: 40, w: 7, h: 12 },
  { kind: 'rect', x: 322, y: 452, color: '#3DDC97', rotate: -20, h: 13 },
  { kind: 'dot', x: 70, y: 300, color: '#3DDC97', r: 4 },
  { kind: 'dot', x: 330, y: 290, color: '#FFFFFF', opacity: 0.8 },
  { kind: 'dot', x: 24, y: 370, color: '#FFC233', r: 3 },
  { kind: 'squiggle', x: 300, y: 380, color: '#7CC4FF' },
  { kind: 'squiggle', x: 36, y: 250, color: '#FF5C8A' },
  { kind: 'sparkle', x: 84, y: 220, color: '#FFFFFF', scale: 0.9 },
  { kind: 'sparkle', x: 316, y: 236, color: '#FFE58A', scale: 0.7 },
  { kind: 'sparkle', x: 350, y: 360, color: '#FFFFFF', scale: 0.6 },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { data, error, refreshing, refresh } = useApi(getHome);
  const [taskFor, setTaskFor] = useState<Giveaway | null>(null);

  useEffect(() => {
    if (data) setWallet(data.wallet);
  }, [data]);

  if (!data) return <ScreenState error={error} onRetry={refresh} />;

  const { sections } = data;
  const featured = sections.megaPoster ? data.featured : null;
  const openGiveaway = (g: Giveaway) => router.push(`/giveaway/${g.id}`);
  const openVideo = (url: string | null) => url && WebBrowser.openBrowserAsync(url);
  const showWinners = sections.luckyWinners && (data.pinned.length > 0 || data.yesterdayWinnersCount > 0);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#FFFFFF" progressViewOffset={insets.top} />}>
        <HeroBackground midStop={0.58} style={[styles.hero, { paddingTop: insets.top, paddingBottom: featured ? 86 : 28 }]}>
          <ConfettiLayer pieces={CONFETTI} width={width} height={600} style={{ top: insets.top }} />
          <Bunting width={width} />

          <View style={styles.topBar}>
            <View style={styles.logo}>
              <LinearGradient colors={goldGradient} style={styles.logoTile}>
                <GiftGlyph size={24} />
              </LinearGradient>
              <Text style={styles.logoText} accessibilityRole="header">
                {t.appName}
              </Text>
            </View>
            <Pressable
              onPress={() => router.navigate('/profile')}
              style={styles.wallet}
              accessibilityRole="button"
              accessibilityLabel={t.a11y.wallet(data.wallet)}>
              <Coin size={30} />
              <Text style={styles.walletText}>{t.rupees(data.wallet)}</Text>
            </Pressable>
          </View>

          {sections.ticker && data.ticker.length > 0 ? (
            <View style={styles.tickerWrap}>
              <WinnerTicker winners={data.ticker} />
            </View>
          ) : null}

          {featured ? (
            <Pressable style={styles.featured} onPress={() => openGiveaway(featured)} accessibilityRole="button" accessibilityLabel={t.home.featuredTitle(featured.title)}>
              <GoldPill label={featured.tag || t.home.megaDraw} />
              <Text style={styles.heroTitle}>{t.home.featuredTitle(featured.title)}</Text>
              <Text style={styles.heroSubtitle}>{t.home.featuredSubtitle(featured.haazriDays)}</Text>
              <HomeHeroArt imageUrl={featured.imageUrl} />
              <View style={styles.countdown}>
                {featured.resultAt ? (
                  <Countdown endsAt={countdownTarget(featured)} label={t.countdown.resultIn} />
                ) : (
                  <Text style={styles.heroSubtitle}>{t.home.lastDate(formatDay(featured.lastDate))}</Text>
                )}
              </View>
            </Pressable>
          ) : null}
        </HeroBackground>

        {featured ? (
          <View style={styles.haazriCard}>
            <HaazriCard giveaway={featured} onDoTask={() => setTaskFor(featured)} onOpen={() => router.navigate({ pathname: '/haazri', params: { id: featured.id } })} />
          </View>
        ) : null}

        {sections.today ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitle}>
                <Text style={styles.h2} accessibilityRole="header">
                  {t.home.todaysGiveaways}
                </Text>
                <LiveChip label={t.home.live} />
              </View>
              <Pressable onPress={() => router.navigate('/giveaways')} accessibilityRole="link" hitSlop={12}>
                <Text style={styles.link}>{t.home.seeAll}</Text>
              </Pressable>
            </View>
            {data.giveaways.length === 0 ? (
              <Text style={[typo.secondary, styles.empty]}>{t.home.nothingRunning}</Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
                {data.giveaways.map((g) => (
                  <GiveawayCarouselCard key={g.id} giveaway={g} onPress={() => openGiveaway(g)} />
                ))}
              </ScrollView>
            )}
          </View>
        ) : null}

        {showWinners ? (
          <RibbonPanel title={t.home.luckyWinners} style={styles.winners}>
            {data.pinned.map((w) => (
              <WinnerCard key={w.id} winner={w} onWatchVideo={() => openVideo(w.videoUrl)} />
            ))}
            {data.pinned.length > 0 ? <MoreWinnersDivider /> : null}
            <WinnerSummaryRow
              count={data.yesterdayWinnersCount}
              label={data.yesterdayWinnersCount > 0 ? t.home.wonYesterday : t.home.seeAllWinners}
              onPress={() => router.navigate('/winners')}
            />
          </RibbonPanel>
        ) : null}

        {sections.whatsapp && data.whatsappChannelUrl ? (
          <View style={styles.whatsapp}>
            <WhatsAppCard onJoin={() => Linking.openURL(data.whatsappChannelUrl)} />
          </View>
        ) : null}
      </ScrollView>

      <TaskSheet
        giveaway={taskFor}
        onClose={() => setTaskFor(null)}
        onDone={(g) => {
          setTaskFor(null);
          router.push({ pathname: '/haazri-done', params: { id: g.id } });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 24 },
  hero: {},
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingTop: 4, paddingHorizontal: 16 },
  logo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoTile: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', boxShadow: `0px 3px 0px ${colors.goldEdge}` },
  logoText: { fontFamily: fonts.display, fontSize: 25, lineHeight: 32, color: colors.onDark, ...headingShadow },
  wallet: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    paddingLeft: 6,
    paddingRight: 14,
    borderRadius: 999,
    backgroundColor: colors.glassLightBg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  walletText: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.onDark },
  tickerWrap: { paddingTop: 12, paddingHorizontal: 16 },
  featured: { alignItems: 'center', paddingTop: 18, paddingHorizontal: 16 },
  heroTitle: { ...typo.heroTitle, marginTop: 10, textAlign: 'center', textShadowColor: colors.navyInk, textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 0 },
  heroSubtitle: { fontFamily: fonts.body, fontSize: 16, lineHeight: 22, color: colors.onDarkMuted, marginTop: 4, textAlign: 'center' },
  countdown: { marginTop: 6 },
  haazriCard: { marginTop: -64, paddingHorizontal: 16 },
  section: { paddingTop: 28, gap: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  h2: { fontFamily: fonts.display, fontSize: 22, lineHeight: 28, color: colors.text },
  link: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.primary, textDecorationLine: 'underline' },
  empty: { paddingHorizontal: 16 },
  carousel: { gap: 14, paddingHorizontal: 16, paddingBottom: 10 },
  winners: { marginTop: 18, marginHorizontal: 16 },
  whatsapp: { paddingTop: 24, paddingHorizontal: 16 },
});
