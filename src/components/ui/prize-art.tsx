import { Image } from 'expo-image';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop, Text } from 'react-native-svg';

import { fonts } from '@/constants/theme';
import type { PrizeArt as PrizeArtKey } from '@/types';
import { CoinGradient, SPARKLE_PATH, SvgScope, decorative, useSvgId } from './art';

type U = (name: string) => string;

// Placeholder prize drawings from the design. Real giveaways send `imageUrl` (600x600 transparent
// PNG/WebP) and PrizeImage shows that instead, so these only appear in development data.

const hidden = decorative;

const vertical = (id: string, from: string, to: string) => (
  <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
    <Stop offset="0" stopColor={from} />
    <Stop offset="1" stopColor={to} />
  </LinearGradient>
);

const smallCoin = (u: U, cx: number, cy: number, r: number) => (
  <G>
    <Circle cx={cx} cy={cy + 2} r={r} fill="#B86A00" />
    <Circle cx={cx} cy={cy} r={r} fill={`url(#${u('coin')})`} />
    <Text x={cx} y={cy + r * 0.4} textAnchor="middle" fontFamily={fonts.display} fontSize={r} fill="#A85400">
      ₹
    </Text>
  </G>
);

const ART: Record<PrizeArtKey, { viewBox: string; body: (u: U) => React.ReactNode }> = {
  recharge: {
    viewBox: '0 0 80 80',
    body: (u) => (
      <>
        <Defs>
          {vertical(u('recharge-s'), '#FF8A3D', '#E5283C')}
          <CoinGradient />
        </Defs>
        <G transform="rotate(-8 34 40)">
          <Rect x="18" y="8" width="32" height="62" rx="7" fill="#22252F" />
          <Rect x="21" y="11" width="26" height="56" rx="5" fill={`url(#${u('recharge-s')})`} />
          <Text x="34" y="44" textAnchor="middle" fontFamily={fonts.display} fontSize="13" fill="#FFFFFF">
            ₹20
          </Text>
        </G>
        {smallCoin(u, 60, 56, 12)}
      </>
    ),
  },
  cash: {
    viewBox: '0 0 80 80',
    body: (u) => (
      <>
        <Defs>
          <CoinGradient />
        </Defs>
        <G transform="rotate(-12 30 36)">
          <Rect x="6" y="22" width="50" height="30" rx="5" fill="#178A54" />
          <Rect x="10" y="26" width="42" height="22" rx="3" fill="none" stroke="#9BE7C0" strokeWidth="1.6" />
          <Circle cx="31" cy="37" r="6" fill="#9BE7C0" />
        </G>
        <G transform="translate(58 0)">
          <Ellipse cx="0" cy="66" rx="14" ry="5" fill="#B86A00" />
          <Rect x="-14" y="56" width="28" height="10" fill="#D98200" />
          <Ellipse cx="0" cy="56" rx="14" ry="5" fill="#FFC233" />
          <Rect x="-14" y="46" width="28" height="10" fill="#D98200" />
          <Ellipse cx="0" cy="46" rx="14" ry="5" fill="#FFC233" />
          <Rect x="-14" y="36" width="28" height="10" fill="#D98200" />
          <Ellipse cx="0" cy="36" rx="14" ry="5" fill={`url(#${u('coin')})`} />
        </G>
      </>
    ),
  },
  data: {
    viewBox: '0 0 80 80',
    body: (u) => (
      <>
        <Defs>{vertical(u('data-s'), '#3E64FF', '#7A3CFF')}</Defs>
        <G transform="rotate(6 32 42)">
          <Rect x="16" y="12" width="34" height="62" rx="7" fill="#22252F" />
          <Rect x="19" y="15" width="28" height="56" rx="5" fill={`url(#${u('data-s')})`} />
          <Text x="33" y="47" textAnchor="middle" fontFamily={fonts.display} fontSize="11" fill="#FFFFFF">
            1.5GB
          </Text>
        </G>
        <G transform="translate(62 28)" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round">
          <Path d="M-12 -1a17 17 0 0 1 24 0" />
          <Path d="M-6.5 5a9 9 0 0 1 13 0" />
        </G>
        <Circle cx="62" cy="39" r="3" fill="#FFFFFF" />
      </>
    ),
  },
  diya: {
    viewBox: '0 0 80 80',
    body: (u) => (
      <>
        <Defs>
          <LinearGradient id={u('diya-b')} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#F97316" />
            <Stop offset="1" stopColor="#9A3412" />
          </LinearGradient>
        </Defs>
        <Circle cx="40" cy="36" r="30" fill="#FFE08A" opacity={0.25} />
        <Path d="M40 12 C49 26 47 38 40 41 C33 38 31 26 40 12Z" fill="#FFC233" />
        <Path d="M40 22 C45 30 44 37 40 39 C36 37 35 30 40 22Z" fill="#FFF3B0" />
        <Path d="M12 46 Q40 74 68 46 Z" fill={`url(#${u('diya-b')})`} />
        <Ellipse cx="40" cy="46" rx="28" ry="5" fill="#FDBA74" />
        <Ellipse cx="40" cy="46" rx="22" ry="3" fill="#7C2D12" />
        <Circle cx="16" cy="66" r="2.5" fill="#FFC233" />
        <Circle cx="64" cy="64" r="2" fill="#FFC233" />
        <Path d={SPARKLE_PATH} fill="#FFE58A" transform="translate(64 18) scale(0.6)" />
      </>
    ),
  },
  weeklyRecharge: {
    viewBox: '0 0 80 80',
    body: (u) => (
      <>
        <Defs>
          {vertical(u('weeklyRecharge-s'), '#A855F7', '#DB2777')}
          <CoinGradient />
        </Defs>
        <G transform="rotate(8 38 40)">
          <Rect x="22" y="8" width="34" height="64" rx="7" fill="#22252F" />
          <Rect x="25" y="11" width="28" height="58" rx="5" fill={`url(#${u('weeklyRecharge-s')})`} />
          <Text x="39" y="45" textAnchor="middle" fontFamily={fonts.display} fontSize="12" fill="#FFFFFF">
            ₹100
          </Text>
        </G>
        {smallCoin(u, 16, 56, 11)}
      </>
    ),
  },
  earbuds: {
    viewBox: '0 0 80 80',
    body: (u) => (
      <>
        <Defs>{vertical(u('earbuds-c'), '#FFFFFF', '#D7DEE8')}</Defs>
        <Ellipse cx="40" cy="72" rx="26" ry="4" fill="#0F766E" opacity={0.25} />
        <Rect x="14" y="36" width="52" height="34" rx="15" fill={`url(#${u('earbuds-c')})`} stroke="#B8C2D1" strokeWidth="1.5" />
        <Path d="M15 48 H65" stroke="#B8C2D1" strokeWidth="1.5" />
        <Circle cx="40" cy="58" r="2" fill="#3DDC97" />
        <G transform="rotate(-16 28 22)">
          <Circle cx="28" cy="20" r="9" fill={`url(#${u('earbuds-c')})`} stroke="#B8C2D1" strokeWidth="1.5" />
          <Rect x="25" y="24" width="6" height="16" rx="3" fill={`url(#${u('earbuds-c')})`} stroke="#B8C2D1" strokeWidth="1.5" />
          <Circle cx="28" cy="20" r="4" fill="#475569" />
        </G>
        <G transform="rotate(16 52 22)">
          <Circle cx="52" cy="20" r="9" fill={`url(#${u('earbuds-c')})`} stroke="#B8C2D1" strokeWidth="1.5" />
          <Rect x="49" y="24" width="6" height="16" rx="3" fill={`url(#${u('earbuds-c')})`} stroke="#B8C2D1" strokeWidth="1.5" />
          <Circle cx="52" cy="20" r="4" fill="#475569" />
        </G>
      </>
    ),
  },
  watch: {
    viewBox: '0 0 80 80',
    body: (u) => (
      <>
        <Defs>
          <LinearGradient id={u('watch-s')} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#1F2937" />
            <Stop offset="1" stopColor="#3E64FF" />
          </LinearGradient>
        </Defs>
        <Ellipse cx="40" cy="74" rx="20" ry="3.5" fill="#9D174D" opacity={0.25} />
        <Rect x="30" y="4" width="20" height="20" rx="6" fill="#2D2F3A" />
        <Rect x="30" y="56" width="20" height="18" rx="6" fill="#2D2F3A" />
        <Rect x="20" y="18" width="40" height="44" rx="12" fill="#22252F" stroke="#9298AE" strokeWidth="1.5" />
        <Rect x="24" y="22" width="32" height="36" rx="9" fill={`url(#${u('watch-s')})`} />
        <Text x="40" y="43" textAnchor="middle" fontFamily={fonts.display} fontSize="13" fill="#FFFFFF">
          10:30
        </Text>
        <Rect x="30" y="47" width="20" height="3" rx="1.5" fill="#3DDC97" />
        <Rect x="60" y="34" width="3" height="10" rx="1.5" fill="#9298AE" />
      </>
    ),
  },
  iphone: {
    viewBox: '0 0 104 150',
    body: (u) => (
      <>
        <Defs>
          <LinearGradient id={u('iphone-b')} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#5A6075" />
            <Stop offset="1" stopColor="#15171E" />
          </LinearGradient>
          <LinearGradient id={u('iphone-s')} x1="0" y1="0" x2="0.4" y2="1">
            <Stop offset="0" stopColor="#5B6CFF" />
            <Stop offset="0.55" stopColor="#B05CFF" />
            <Stop offset="1" stopColor="#FF8FB1" />
          </LinearGradient>
          <CoinGradient />
        </Defs>
        <Ellipse cx="52" cy="144" rx="32" ry="5" fill="#050B33" opacity={0.35} />
        <G transform="rotate(-10 52 72)">
          <Rect x="24" y="6" width="58" height="128" rx="14" fill={`url(#${u('iphone-b')})`} stroke="#9298AE" strokeWidth="1.5" />
          <Rect x="29" y="11" width="48" height="118" rx="10" fill={`url(#${u('iphone-s')})`} />
          <Rect x="44" y="16" width="18" height="6" rx="3" fill="#0B0C10" />
          <Path d="M32 16 L56 11 L38 129 L30 124Z" fill="#FFFFFF" opacity={0.14} />
        </G>
        {smallCoin(u, 18, 109, 14)}
        <Path d={SPARKLE_PATH} fill="#FFFFFF" transform="translate(92 26) scale(0.8)" />
      </>
    ),
  },
  iphoneBlue: {
    viewBox: '0 0 96 112',
    body: (u) => (
      <>
        <Defs>
          <LinearGradient id={u('iphoneBlue-b')} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#5A6075" />
            <Stop offset="1" stopColor="#15171E" />
          </LinearGradient>
          <LinearGradient id={u('iphoneBlue-s')} x1="0" y1="0" x2="0.4" y2="1">
            <Stop offset="0" stopColor="#2E7BFF" />
            <Stop offset="1" stopColor="#22D3EE" />
          </LinearGradient>
        </Defs>
        <Ellipse cx="48" cy="106" rx="28" ry="4" fill="#142C9E" opacity={0.2} />
        <G transform="rotate(12 48 56)">
          <Rect x="26" y="6" width="46" height="96" rx="11" fill={`url(#${u('iphoneBlue-b')})`} stroke="#9298AE" strokeWidth="1.5" />
          <Rect x="30" y="10" width="38" height="88" rx="8" fill={`url(#${u('iphoneBlue-s')})`} />
          <Rect x="42" y="14" width="14" height="5" rx="2.5" fill="#0B0C10" />
          <Path d="M33 14 L50 10 L38 98 L31 94Z" fill="#FFFFFF" opacity={0.15} />
        </G>
      </>
    ),
  },
  coins: {
    viewBox: '0 0 96 90',
    body: (u) => (
      <>
        <Defs>
          <CoinGradient />
        </Defs>
        <Ellipse cx="48" cy="84" rx="32" ry="4" fill="#9A5B00" opacity={0.2} />
        <Circle cx="32" cy="58" r="22" fill="#B86A00" />
        <Circle cx="32" cy="54" r="22" fill={`url(#${u('coin')})`} />
        <Circle cx="32" cy="54" r="16" fill="none" stroke="#FFE58A" strokeWidth="2" />
        <Text x="32" y="61" textAnchor="middle" fontFamily={fonts.display} fontSize="20" fill="#A85400">
          ₹
        </Text>
        <Circle cx="66" cy="40" r="18" fill="#B86A00" />
        <Circle cx="66" cy="37" r="18" fill={`url(#${u('coin')})`} />
        <Circle cx="66" cy="37" r="13" fill="none" stroke="#FFE58A" strokeWidth="2" />
        <Text x="66" y="43" textAnchor="middle" fontFamily={fonts.display} fontSize="16" fill="#A85400">
          ₹
        </Text>
        <Path d={SPARKLE_PATH} fill="#FFC233" transform="translate(80 12) scale(0.9)" />
      </>
    ),
  },
  coinStack: {
    viewBox: '0 0 64 56',
    body: (u) => (
      <>
        <Defs>
          <CoinGradient />
        </Defs>
        <G transform="translate(32 0)">
          <Ellipse cx="0" cy="48" rx="20" ry="6" fill="#B86A00" />
          <Rect x="-20" y="36" width="40" height="12" fill="#D98200" />
          <Ellipse cx="0" cy="36" rx="20" ry="6" fill="#FFC233" />
          <Rect x="-20" y="24" width="40" height="12" fill="#D98200" />
          <Ellipse cx="0" cy="24" rx="20" ry="6" fill="#FFC233" />
          <Rect x="-20" y="12" width="40" height="12" fill="#D98200" />
          <Ellipse cx="0" cy="12" rx="20" ry="6" fill={`url(#${u('coin')})`} />
        </G>
      </>
    ),
  },
};

export function PrizeArt({ art, width, height = width }: { art: PrizeArtKey; width: number; height?: number }) {
  const sid = useSvgId();
  const { viewBox, body } = ART[art];
  return (
    <Svg width={width} height={height} viewBox={viewBox} {...hidden}>
      <SvgScope id={sid}>{body((name) => `${name}${sid}`)}</SvgScope>
    </Svg>
  );
}

// The product picture for a giveaway or win: the server image when present, otherwise the drawing.
export function PrizeImage({ imageUrl, art, width, height = width }: { imageUrl?: string; art: PrizeArtKey; width: number; height?: number }) {
  if (imageUrl) {
    return <Image source={{ uri: imageUrl }} style={{ width, height }} contentFit="contain" transition={150} accessible={false} />;
  }
  return <PrizeArt art={art} width={width} height={height} />;
}
