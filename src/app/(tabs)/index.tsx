import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { LinearGradient } from 'expo-linear-gradient';
import { Linking, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getHome } from '@/api';
import { GiveawayCarouselCard } from '@/components/giveaway/carousel-card';
import { HaazriCard } from '@/components/giveaway/haazri-card';
import { HomeHeroArt } from '@/components/giveaway/hero-art';
import { Bunting, Coin, ConfettiLayer, GiftGlyph, type ConfettiPiece } from '@/components/ui/art';
import { Countdown } from '@/components/ui/countdown';
import { GlassIconButton } from '@/components/ui/glass';
import { HeroBackground } from '@/components/ui/hero';
import { BellIcon } from '@/components/ui/icons';
import { RibbonPanel } from '@/components/ui/ribbon-panel';
import { ScreenState } from '@/components/ui/screen-state';
import { GoldPill, LiveChip } from '@/components/ui/tag';
import { WhatsAppCard } from '@/components/ui/whatsapp-card';
import { MoreWinnersDivider, WinnerCard, WinnerSummaryRow } from '@/components/winners/winner-card';
import { WinnerTicker } from '@/components/winners/winner-ticker';
import { config } from '@/constants/config';
import { colors, fonts, goldGradient, headingShadow, type as typo } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';
import { t } from '@/i18n';

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

  if (!data) return <ScreenState error={error} onRetry={refresh} />;

  const featuredPrize = data.featured.title;
  const openVideo = (url?: string) => url && WebBrowser.openBrowserAsync(url);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#FFFFFF" progressViewOffset={insets.top} />}>
        <HeroBackground midStop={0.58} style={[styles.hero, { paddingTop: insets.top }]}>
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
            <View style={styles.topActions}>
              <View style={styles.wallet} accessible accessibilityLabel={t.a11y.wallet(data.walletTotal)}>
                <Coin size={30} />
                <Text style={styles.walletText}>{t.rupees(data.walletTotal)}</Text>
              </View>
              <GlassIconButton label={t.a11y.notifications} round>
                <BellIcon size={22} color="#FFFFFF" />
                {data.unreadNotifications > 0 && <View style={styles.unreadDot} />}
              </GlassIconButton>
            </View>
          </View>

          <View style={styles.tickerWrap}>
            <WinnerTicker winners={data.recentWinners} />
          </View>

          <Pressable style={styles.featured} onPress={() => router.navigate('/haazri')} accessibilityRole="button" accessibilityLabel={`${t.home.featuredTitle(featuredPrize)}. ${t.home.featuredSubtitle(data.haazri.haazriDays)}`}>
            <GoldPill label={t.home.megaDraw} />
            <Text style={styles.heroTitle}>{t.home.featuredTitle(featuredPrize)}</Text>
            <Text style={styles.heroSubtitle}>{t.home.featuredSubtitle(data.haazri.haazriDays)}</Text>
            <HomeHeroArt giveaway={data.featured} />
            <View style={styles.countdown}>
              <Countdown endsAt={data.featured.resultAt} label={t.countdown.resultIn} />
            </View>
          </Pressable>
        </HeroBackground>

        <View style={styles.haazriCard}>
          <HaazriCard progress={data.haazri} onPress={() => router.navigate('/haazri')} />
        </View>

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
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
            {data.today.map((g) => (
              <GiveawayCarouselCard key={g.id} giveaway={g} onPress={() => router.push(`/giveaway/${g.id}`)} />
            ))}
          </ScrollView>
        </View>

        <RibbonPanel title={t.home.luckyWinners} style={styles.winners}>
          <WinnerCard winner={data.megaWinner} onWatchVideo={() => openVideo(data.megaWinner.videoUrl)} />
          {data.recentWinners.slice(0, 1).map((w) => (
            <WinnerCard key={w.id} winner={w} />
          ))}
          <MoreWinnersDivider />
          <WinnerSummaryRow count={data.yesterdayWinnersCount} label={t.home.wonDailyYesterday} onPress={() => router.navigate('/winners')} />
        </RibbonPanel>

        <View style={styles.whatsapp}>
          <WhatsAppCard onJoin={() => Linking.openURL(config.whatsappChannelUrl)} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 24 },
  hero: { paddingBottom: 86 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingTop: 4, paddingHorizontal: 16 },
  logo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoTile: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', boxShadow: `0px 3px 0px ${colors.goldEdge}` },
  logoText: { fontFamily: fonts.display, fontSize: 25, lineHeight: 32, color: colors.onDark, ...headingShadow },
  topActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
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
  unreadDot: { position: 'absolute', top: 9, right: 10, width: 9, height: 9, borderRadius: 5, backgroundColor: '#FF5C8A', borderWidth: 2, borderColor: colors.primaryEdge },
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
  carousel: { gap: 14, paddingHorizontal: 16, paddingBottom: 10 },
  winners: { marginTop: 18, marginHorizontal: 16 },
  whatsapp: { paddingTop: 24, paddingHorizontal: 16 },
});
