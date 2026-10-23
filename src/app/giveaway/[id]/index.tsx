import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Share, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { enterGiveaway, getGiveaway, simulateTaskConfirmed } from '@/api';
import { DetailHeroArt } from '@/components/giveaway/hero-art';
import { Sunburst } from '@/components/ui/art';
import { useHms } from '@/components/ui/countdown';
import { Button3D } from '@/components/ui/button-3d';
import { GlassIconButton } from '@/components/ui/glass';
import { BackIcon, CheckIcon, ClockIcon, ShareIcon, ShieldCheckIcon, SmallTrophyIcon } from '@/components/ui/icons';
import { ScreenState } from '@/components/ui/screen-state';
import { colors, fonts, goldGradient, gradientPoints, isLightColor, shadows } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';
import { t } from '@/i18n';
import type { Giveaway } from '@/types';

const heroPoints = gradientPoints(170);

export default function GiveawayDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, error, refresh } = useApi(() => getGiveaway(id), [id]);

  if (!data) return <ScreenState error={error} onRetry={refresh} />;
  return <Detail giveaway={data} onChanged={refresh} />;
}

function Detail({ giveaway, onChanged }: { giveaway: Giveaway; onChanged: () => void }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const hms = useHms(giveaway.endsAt);
  const [entering, setEntering] = useState(false);
  const light = isLightColor(giveaway.tileColorFrom);
  const ink = light ? colors.goldInk : '#FFFFFF';
  const heroHeight = Math.round(330 * Math.min(1, width / 390));
  const daily = giveaway.tagStyle === 'daily';

  const onEnter = async () => {
    if (giveaway.entryType === 'haazri') {
      router.navigate('/haazri');
      return;
    }
    setEntering(true);
    try {
      const { taskUrl } = await enterGiveaway(giveaway.id);
      await WebBrowser.openBrowserAsync(taskUrl);
      // The website's server confirms the entry via webhook. In development we fake that step.
      if (__DEV__) simulateTaskConfirmed(giveaway.id);
      onChanged();
    } catch {
      Alert.alert(t.detail.enterFailed);
    } finally {
      setEntering(false);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar style={light ? 'dark' : 'light'} />
      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        <LinearGradient colors={[giveaway.tileColorFrom, giveaway.tileColorTo]} {...heroPoints} style={[styles.hero, { height: heroHeight + insets.top }]}>
          <Sunburst size={420} opacity={light ? 0.16 : 0.08} style={{ left: width / 2 - 210, top: insets.top - 40 }} />
          <View style={[StyleSheet.absoluteFill, { top: insets.top }]}>
            <DetailHeroArt giveaway={giveaway} width={width} />
          </View>
          <View style={[styles.heroBar, { paddingTop: insets.top + 14 }]}>
            <GlassIconButton label={t.a11y.back} tone={light ? 'warm' : 'light'} onPress={() => router.back()}>
              <BackIcon size={22} color={ink} />
            </GlassIconButton>
            <GlassIconButton
              label={t.a11y.share}
              tone={light ? 'warm' : 'light'}
              onPress={() => Share.share({ message: t.detail.shareMessage(giveaway.title, t.appName) })}>
              <ShareIcon size={20} color={ink} />
            </GlassIconButton>
          </View>
          <View style={styles.heroChips}>
            <View style={styles.heroChip}>
              <SmallTrophyIcon size={16} color="#FFFFFF" />
              <Text style={styles.heroChipText}>{daily ? t.common.winnersToday(giveaway.winnersCount) : t.common.winners(giveaway.winnersCount)}</Text>
            </View>
            <View style={styles.heroChip} accessible accessibilityLabel={t.countdown.endsIn(hms)}>
              <ClockIcon size={16} color="#FFFFFF" strokeWidth={2.2} />
              <Text style={[styles.heroChipText, styles.tabular]}>{t.countdown.endsIn(hms)}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.sheet}>
          <View style={styles.titleBlock}>
            <Text style={styles.title} accessibilityRole="header">
              {giveaway.title}
            </Text>
            {giveaway.subtitle ? <Text style={styles.subtitle}>{giveaway.subtitle}</Text> : null}
          </View>

          {giveaway.entered ? (
            <View style={styles.youreIn}>
              <CheckIcon size={22} color={colors.successText} />
              <View style={styles.flex}>
                <Text style={styles.youreInTitle}>{t.detail.youreIn}</Text>
                <Text style={styles.youreInBody}>{t.detail.youreInBody}</Text>
              </View>
            </View>
          ) : null}

          <View style={styles.steps}>
            <Text style={styles.h2} accessibilityRole="header">
              {t.detail.howToEnter}
            </Text>
            <View style={styles.stepList}>
              <View style={styles.stepLine} />
              {t.detail.steps.map((step, i) => {
                const last = i === t.detail.steps.length - 1;
                return (
                  <View key={step.title} style={styles.step}>
                    <LinearGradient colors={last ? goldGradient : [colors.ribbonTop, colors.ribbonBottom]} style={[styles.stepBadge, last && styles.stepBadgeGold]}>
                      {last ? (
                        <SmallTrophyIcon size={22} color={colors.goldInk} strokeWidth={2.4} />
                      ) : (
                        <Text style={styles.stepNumber}>{i + 1}</Text>
                      )}
                    </LinearGradient>
                    <View style={styles.flex}>
                      <Text style={styles.stepTitle}>{step.title}</Text>
                      <Text style={styles.stepBody}>{step.body}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.free}>
            <ShieldCheckIcon size={24} />
            <Text style={styles.freeText}>{t.detail.freeBanner}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable onPress={() => router.push(`/giveaway/${giveaway.id}/rules`)} accessibilityRole="link" hitSlop={12}>
          <Text style={styles.rules}>{t.detail.rules}</Text>
        </Pressable>
        <View style={styles.flex}>
          {giveaway.entered ? (
            <Button3D variant="done" height={58} label={t.detail.youreIn} icon={<CheckIcon size={22} color={colors.successText} />} disabled />
          ) : (
            <>
              <Button3D
                variant="gold"
                height={58}
                label={giveaway.entryType === 'haazri' ? t.detail.haazriEntry : t.detail.enterNow}
                textStyle={giveaway.entryType === 'haazri' ? styles.enterTextSmall : styles.enterText}
                onPress={onEnter}
                disabled={entering}
              />
              <View style={styles.freeBadge} pointerEvents="none">
                <Text style={styles.freeBadgeText}>{t.detail.free}</Text>
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { flexGrow: 1 },
  flex: { flex: 1 },
  hero: { overflow: 'hidden' },
  heroBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16 },
  heroChips: { position: 'absolute', left: 16, right: 16, bottom: 42, flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  heroChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(58,31,0,0.62)',
  },
  heroChipText: { fontFamily: fonts.bodyBold, fontSize: 14, color: '#FFFFFF' },
  tabular: { fontVariant: ['tabular-nums'] },
  sheet: {
    marginTop: -28,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 22,
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 16,
  },
  titleBlock: { gap: 2 },
  title: { fontFamily: fonts.display, fontSize: 30, lineHeight: 34, color: colors.text },
  subtitle: { fontFamily: fonts.body, fontSize: 16, lineHeight: 22, color: colors.textMuted },
  youreIn: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 16, backgroundColor: colors.successBg },
  youreInTitle: { fontFamily: fonts.display, fontSize: 19, lineHeight: 23, color: colors.successText },
  youreInBody: { fontFamily: fonts.body, fontSize: 14, lineHeight: 19, color: colors.successText },
  steps: { gap: 10 },
  h2: { fontFamily: fonts.display, fontSize: 20, lineHeight: 26, color: colors.text },
  stepList: { gap: 14 },
  stepLine: { position: 'absolute', left: 21, top: 22, bottom: 22, width: 3, borderRadius: 3, backgroundColor: colors.primaryTint },
  step: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  stepBadge: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', boxShadow: `0px 3px 0px ${colors.primaryEdge}` },
  stepBadgeGold: { boxShadow: `0px 3px 0px ${colors.goldEdge}` },
  stepNumber: { fontFamily: fonts.display, fontSize: 20, lineHeight: 26, color: '#FFFFFF' },
  stepTitle: { fontFamily: fonts.bodyBold, fontSize: 16, lineHeight: 21, color: colors.text },
  stepBody: { fontFamily: fonts.body, fontSize: 14, lineHeight: 19, color: colors.textMuted },
  free: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 16, backgroundColor: colors.successBg },
  freeText: { flex: 1, fontFamily: fonts.bodyBold, fontSize: 15, color: colors.successText },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingTop: 14,
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    boxShadow: shadows.nav,
  },
  rules: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.primary, textDecorationLine: 'underline' },
  enterText: { fontSize: 21 },
  enterTextSmall: { fontSize: 17 },
  freeBadge: {
    position: 'absolute',
    top: -10,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 1,
    borderRadius: 999,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  freeBadgeText: { fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 0.7, color: '#FFFFFF' },
});
