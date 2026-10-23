import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, RadialGradient, Rect, Stop, Text } from 'react-native-svg';

import { CoinG, CoinGradient, SPARKLE_PATH, Sunburst, SvgScope, decorative, useSvgId } from '@/components/ui/art';
import { PrizeArt } from '@/components/ui/prize-art';
import { fonts } from '@/constants/theme';
import { t } from '@/i18n';
import type { Giveaway } from '@/types';

const hidden = decorative;

// Big product shot on the Home hero: glow, floating coins and sparkles around the prize.
export function HomeHeroArt({ giveaway }: { giveaway: Pick<Giveaway, 'imageUrl' | 'art'> }) {
  const drawPhone = !giveaway.imageUrl && giveaway.art === 'iphone';
  const sid = useSvgId();
  return (
    <View style={styles.homeWrap}>
      <Sunburst size={400} style={{ left: 130 - 200, top: 104 - 200 }} />
      <View>
        <Svg width={260} height={214} viewBox="0 0 260 214" {...hidden}>
          <SvgScope id={sid}>
            <Defs>
              <RadialGradient id={`glow${sid}`} cx="50%" cy="50%" r="50%">
                <Stop offset="0" stopColor="#FFE08A" stopOpacity={0.55} />
                <Stop offset="1" stopColor="#FFE08A" stopOpacity={0} />
              </RadialGradient>
              <LinearGradient id={`homeBody${sid}`} x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#5A6075" />
                <Stop offset="1" stopColor="#15171E" />
              </LinearGradient>
              <LinearGradient id={`homeScreen${sid}`} x1="0" y1="0" x2="0.4" y2="1">
                <Stop offset="0" stopColor="#5B6CFF" />
                <Stop offset="0.55" stopColor="#B05CFF" />
                <Stop offset="1" stopColor="#FF8FB1" />
              </LinearGradient>
              <CoinGradient />
            </Defs>
            <Circle cx={130} cy={104} r={104} fill={`url(#glow${sid})`} />
            <Ellipse cx={130} cy={204} rx={58} ry={8} fill="#050B33" opacity={0.35} />
            {drawPhone && (
              <G transform="rotate(-10 130 104)">
                <Rect x={82} y={8} width={96} height={190} rx={20} fill={`url(#homeBody${sid})`} stroke="#9298AE" strokeWidth={2} />
                <Rect x={89} y={15} width={82} height={176} rx={14} fill={`url(#homeScreen${sid})`} />
                <Rect x={114} y={22} width={32} height={9} rx={4.5} fill="#0B0C10" />
                <Text x={130} y={66} textAnchor="middle" fontFamily={fonts.displayBold} fontSize={22} fill="#FFFFFF">
                  10:30
                </Text>
                {[100, 122, 144].map((x) => (
                  <G key={x}>
                    <Rect x={x} y={120} width={16} height={16} rx={4} fill="#FFFFFF" opacity={0.4} />
                    <Rect x={x} y={142} width={16} height={16} rx={4} fill="#FFFFFF" opacity={0.4} />
                  </G>
                ))}
                <Rect x={100} y={168} width={60} height={14} rx={7} fill="#FFFFFF" opacity={0.3} />
                <Path d="M94 22 L132 15 L104 191 L91 184Z" fill="#FFFFFF" opacity={0.13} />
                <Rect x={178} y={54} width={3} height={26} rx={1.5} fill="#7C8298" />
              </G>
            )}
            <CoinG x={52} y={150} r={23} edge={3.5} />
            <CoinG x={214} y={58} r={18} edge={3} />
            <CoinG x={218} y={164} r={14} edge={2.5} />
            <Path d={SPARKLE_PATH} fill="#FFFFFF" transform="translate(60 54) scale(1.2)" />
            <Path d={SPARKLE_PATH} fill="#FFE58A" transform="translate(196 118) scale(0.8)" />
          </SvgScope>
        </Svg>
      </View>
      {!drawPhone && (
        <View style={styles.center} pointerEvents="none">
          {giveaway.imageUrl ? (
            <Image source={{ uri: giveaway.imageUrl }} style={styles.homeImage} contentFit="contain" accessible={false} />
          ) : (
            <PrizeArt art={giveaway.art} width={170} />
          )}
        </View>
      )}
    </View>
  );
}

// Product shot on the Giveaway detail hero.
export function DetailHeroArt({ giveaway, width }: { giveaway: Pick<Giveaway, 'imageUrl' | 'art' | 'title'>; width: number }) {
  const drawRecharge = !giveaway.imageUrl && giveaway.art === 'recharge';
  const sid = useSvgId();
  const amount = giveaway.title.match(/₹\s?\d+/)?.[0] ?? '₹20';
  const s = width / 390;
  return (
    <View style={[StyleSheet.absoluteFill]} pointerEvents="none">
      <Svg width={width} height={330 * s} viewBox="0 0 390 330" {...hidden}>
        <SvgScope id={sid}>
          <Defs>
            <LinearGradient id={`detailBody${sid}`} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#4A4F62" />
              <Stop offset="1" stopColor="#15171E" />
            </LinearGradient>
            <LinearGradient id={`detailScreen${sid}`} x1="0" y1="0" x2="0.3" y2="1">
              <Stop offset="0" stopColor="#FF8A3D" />
              <Stop offset="1" stopColor="#E5283C" />
            </LinearGradient>
            <CoinGradient />
          </Defs>
          <Ellipse cx={195} cy={276} rx={70} ry={10} fill="#7A3A00" opacity={0.25} />
          {drawRecharge && (
            <G transform="rotate(-9 195 170)">
              <Rect x={146} y={66} width={100} height={200} rx={22} fill={`url(#detailBody${sid})`} stroke="#8A8FA3" strokeWidth={2} />
              <Rect x={153} y={73} width={86} height={186} rx={15} fill={`url(#detailScreen${sid})`} />
              <Rect x={179} y={80} width={34} height={9} rx={4.5} fill="#0B0C10" />
              <Text x={196} y={134} textAnchor="middle" fontFamily={fonts.bodyBold} fontSize={12} fill="#FFE3D0">
                {t.detail.rechargeDone}
              </Text>
              <Text x={196} y={178} textAnchor="middle" fontFamily={fonts.display} fontSize={44} fill="#FFFFFF">
                {amount}
              </Text>
              <Rect x={168} y={200} width={56} height={20} rx={10} fill="#FFFFFF" opacity={0.9} />
              <Path d="M186 210l5 5 9 -10" stroke="#E5283C" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M158 80 L200 73 L168 259 L155 252Z" fill="#FFFFFF" opacity={0.13} />
            </G>
          )}
          <CoinG x={96} y={214} r={26} edge={5} />
          <CoinG x={292} y={136} r={21} edge={4} />
          <CoinG x={300} y={236} r={15} edge={3} />
          <Rect x={70} y={120} width={8} height={14} rx={2} fill="#FFFFFF" transform="rotate(25 74 127)" />
          <Rect x={320} y={90} width={7} height={13} rx={2} fill="#E5283C" transform="rotate(-30 323 96)" />
          <Circle cx={110} cy={96} r={4} fill="#FFFFFF" />
          <Path d={SPARKLE_PATH} fill="#FFFFFF" transform="translate(116 160) scale(1.1)" />
          <Path d={SPARKLE_PATH} fill="#FFFFFF" transform="translate(286 196) scale(0.8)" />
        </SvgScope>
      </Svg>
      {!drawRecharge && (
        <View style={[styles.detailCenter, { top: 66 * s, height: 210 * s }]}>
          {giveaway.imageUrl ? (
            <Image source={{ uri: giveaway.imageUrl }} style={{ width: 210 * s, height: 210 * s }} contentFit="contain" accessible={false} />
          ) : (
            <PrizeArt art={giveaway.art} width={190 * s} />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  homeWrap: { width: 260, height: 214, marginTop: 4 },
  center: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  homeImage: { width: 190, height: 190 },
  detailCenter: { position: 'absolute', left: 0, right: 0, alignItems: 'center', justifyContent: 'center' },
});
