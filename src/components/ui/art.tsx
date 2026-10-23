import { createContext, useContext, useId } from 'react';
import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Polygon, RadialGradient, Rect, Stop, Text } from 'react-native-svg';

import { colors, confetti, fonts } from '@/constants/theme';

// Reusable UI illustrations ported from the design files. All decorative, hidden from screen readers.

// Hides decorative SVG from screen readers. Empty on web, where these props are not DOM attributes.
export const decorative = Platform.OS === 'web' ? {} : ({ accessible: false, importantForAccessibility: 'no-hide-descendants' } as const);
const hidden = decorative;

export const SPARKLE_PATH = 'M0 -10L2.5 -2.5L10 0L2.5 2.5L0 10L-2.5 2.5L-10 0L-2.5 -2.5Z';

// Gradient ids must be unique per Svg: on web every id is global to the page, and screens kept
// mounted in the navigation stack would otherwise fight over the same "coin" gradient.
const SvgIdContext = createContext('');

export function useSvgId() {
  return useId().replace(/[^a-zA-Z0-9]/g, '');
}

export function SvgScope({ id, children }: { id: string; children: React.ReactNode }) {
  return <SvgIdContext.Provider value={id}>{children}</SvgIdContext.Provider>;
}

// Put inside <Defs> (within an SvgScope) of any Svg that uses <CoinG> or the coin gradient.
export function CoinGradient() {
  const sid = useContext(SvgIdContext);
  return (
    <RadialGradient id={`coin${sid}`} cx="35%" cy="30%" r="75%">
      <Stop offset="0" stopColor={colors.coinLight} />
      <Stop offset="0.45" stopColor={colors.coinMid} />
      <Stop offset="1" stopColor={colors.coinDark} />
    </RadialGradient>
  );
}

type CoinGProps = { x: number; y: number; r?: number; edge?: number; ring?: boolean; symbol?: boolean; check?: boolean };

// A coin centred at (x, y) for use inside an Svg that defines CoinGradient.
export function CoinG({ x, y, r = 20, edge, ring = true, symbol = true, check = false }: CoinGProps) {
  const sid = useContext(SvgIdContext);
  const e = edge ?? Math.max(2, r * 0.15);
  return (
    <G transform={`translate(${x} ${y})`}>
      <Circle cx={0} cy={e} r={r} fill={colors.coinEdge} />
      <Circle cx={0} cy={0} r={r} fill={`url(#coin${sid})`} />
      {ring && <Circle cx={0} cy={0} r={r * 0.73} fill="none" stroke={colors.coinRing} strokeWidth={2} />}
      {symbol && !check && (
        <Text x={0} y={r * 0.35} textAnchor="middle" fontFamily={fonts.display} fontSize={r * 0.95} fill={colors.coinInk}>
          ₹
        </Text>
      )}
      {check && (
        <Path
          d={`M${-r * 0.38} 0l${r * 0.25} ${r * 0.25} ${r * 0.5} ${-r * 0.5}`}
          stroke="#8A4300"
          strokeWidth={r * 0.17}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </G>
  );
}

export function Coin({ size = 30, style }: { size?: number; style?: ViewStyle }) {
  const sid = useSvgId();
  return (
    <Svg width={size} height={size} viewBox="-22 -22 44 46" style={style} {...hidden}>
      <SvgScope id={sid}>
        <Defs>
          <CoinGradient />
        </Defs>
        <CoinG x={0} y={0} r={19} edge={2} />
      </SvgScope>
    </Svg>
  );
}

export function Sparkle({ size = 14, color = colors.coinRing, style }: { size?: number; color?: string; style?: ViewStyle }) {
  return (
    <Svg width={size} height={size} viewBox="-10 -10 20 20" style={style} {...hidden}>
      <Path d={SPARKLE_PATH} fill={color} />
    </Svg>
  );
}

// The red gift box used in the logo tile.
export function GiftGlyph({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...hidden}>
      <Rect x="3" y="9" width="18" height="12" rx="2" fill="#E5283C" />
      <Rect x="2" y="7" width="20" height="4" rx="1.5" fill="#FF5C6E" />
      <Rect x="10.5" y="7" width="3" height="14" fill="#FFF3C4" />
      <Path d="M12 7C10 3.5 6.5 3.8 7 6.2 7.4 7.6 10 7 12 7zM12 7c2-3.5 5.5-3.2 5 -0.8C16.6 7.6 14 7 12 7z" fill="#FFF3C4" />
    </Svg>
  );
}

export function Medal({ day, label }: { day: number; label: string }) {
  const sid = useSvgId();
  return (
    <Svg width={92} height={100} viewBox="0 0 92 100" {...hidden}>
      <Defs>
        <LinearGradient id={`medal${sid}`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFE27A" />
          <Stop offset="0.5" stopColor="#FFC233" />
          <Stop offset="1" stopColor="#E08A00" />
        </LinearGradient>
      </Defs>
      <Path d="M26 64 L16 96 L30 90 L38 100 L46 70Z" fill="#FF5C8A" />
      <Path d="M66 64 L76 96 L62 90 L54 100 L46 70Z" fill="#E5283C" />
      <Path d="M46 4 L80 18 V44 C80 64 64 76 46 82 C28 76 12 64 12 44 V18 Z" fill={colors.coinEdge} transform="translate(0 4)" />
      <Path d="M46 4 L80 18 V44 C80 64 64 76 46 82 C28 76 12 64 12 44 V18 Z" fill={`url(#medal${sid})`} stroke="#FFF3C4" strokeWidth={2} />
      <Text x={46} y={34} textAnchor="middle" fontFamily={fonts.display} fontSize={12} fill="#7A4200" letterSpacing={1}>
        {label}
      </Text>
      <Text x={46} y={64} textAnchor="middle" fontFamily={fonts.display} fontSize={day > 99 ? 24 : 34} fill={colors.goldInk}>
        {day}
      </Text>
    </Svg>
  );
}

// 12 white wedges around one centre. `size` is the drawn square; centre is its middle.
export function Sunburst({ size = 400, opacity = 0.06, style }: { size?: number; opacity?: number; style?: ViewStyle }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 400 400" style={[styles.abs, style]} {...hidden}>
      {Array.from({ length: 12 }, (_, i) => (
        <Path key={i} d="M200 200L172 -220L228 -220Z" fill="#FFFFFF" opacity={opacity} transform={`rotate(${i * 30} 200 200)`} />
      ))}
    </Svg>
  );
}

// Mela bunting flags across the top of Home.
export function Bunting({ width }: { width: number }) {
  const count = Math.ceil(width / 26);
  const sag = (x: number) => 6 + 8 * (1 - Math.pow((x - width / 2) / (width / 2), 2));
  return (
    <View>
      <Svg width={width} height={34} viewBox={`0 0 ${width} 34`} {...hidden}>
        <Path d={`M0 6 Q${width / 2} 22 ${width} 6`} stroke="#F5D9A8" strokeWidth={1.5} fill="none" />
        {Array.from({ length: count }, (_, i) => {
          const x = 10 + i * 26;
          const y = sag(x + 9) + 0.8;
          return <Polygon key={i} points={`${x},${y} ${x + 18},${y} ${x + 9},${y + 17}`} fill={confetti[i % 5]} />;
        })}
      </Svg>
    </View>
  );
}

export type ConfettiPiece =
  | { kind: 'rect'; x: number; y: number; color: string; rotate: number; w?: number; h?: number }
  | { kind: 'dot'; x: number; y: number; color: string; r?: number; opacity?: number }
  | { kind: 'squiggle'; x: number; y: number; color: string }
  | { kind: 'sparkle'; x: number; y: number; color: string; scale?: number };

// Static confetti layer, positioned in design pixels. Keep pieces away from text.
export function ConfettiLayer({ pieces, width, height, style }: { pieces: ConfettiPiece[]; width: number; height: number; style?: ViewStyle }) {
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={[styles.abs, style]} pointerEvents="none" {...hidden}>
      {pieces.map((p, i) => {
        switch (p.kind) {
          case 'rect': {
            const w = p.w ?? 8;
            const h = p.h ?? 14;
            return <Rect key={i} x={p.x} y={p.y} width={w} height={h} rx={2} fill={p.color} transform={`rotate(${p.rotate} ${p.x + w / 2} ${p.y + h / 2})`} />;
          }
          case 'dot':
            return <Circle key={i} cx={p.x} cy={p.y} r={p.r ?? 3.5} fill={p.color} opacity={p.opacity ?? 1} />;
          case 'squiggle':
            return <Path key={i} d={`M${p.x} ${p.y} q6 -8 12 0 t12 0`} stroke={p.color} strokeWidth={3} fill="none" strokeLinecap="round" />;
          case 'sparkle':
            return <Path key={i} d={SPARKLE_PATH} fill={p.color} transform={`translate(${p.x} ${p.y}) scale(${p.scale ?? 0.8})`} />;
        }
      })}
    </Svg>
  );
}

// Two soft spotlight beams from the top corners (celebration and winners screens).
export function Spotlights({ width, height }: { width: number; height: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 390 520" preserveAspectRatio="none" style={styles.abs} pointerEvents="none" {...hidden}>
      <Polygon points="10,0 64,0 230,520 110,520" fill="#FFFFFF" opacity={0.05} />
      <Polygon points="326,0 380,0 280,520 160,520" fill="#FFFFFF" opacity={0.05} />
    </Svg>
  );
}

export function CoinStack({ width = 64, height = 56 }: { width?: number; height?: number }) {
  const sid = useSvgId();
  return (
    <Svg width={width} height={height} viewBox="0 0 64 56" {...hidden}>
      <SvgScope id={sid}>
        <Defs>
          <CoinGradient />
        </Defs>
        <G transform="translate(32 0)">
          <Ellipse cx={0} cy={48} rx={20} ry={6} fill={colors.coinEdge} />
          <Rect x={-20} y={36} width={40} height={12} fill={colors.coinDark} />
          <Ellipse cx={0} cy={36} rx={20} ry={6} fill={colors.coinMid} />
          <Rect x={-20} y={24} width={40} height={12} fill={colors.coinDark} />
          <Ellipse cx={0} cy={24} rx={20} ry={6} fill={colors.coinMid} />
          <Rect x={-20} y={12} width={40} height={12} fill={colors.coinDark} />
          <Ellipse cx={0} cy={12} rx={20} ry={6} fill={`url(#coin${sid})`} />
        </G>
      </SvgScope>
    </Svg>
  );
}

// Gold avatar ring with laurel leaves and a crown for the mega winner.
export function LaurelCrown({ children }: { children?: React.ReactNode }) {
  const sid = useSvgId();
  const leaves = [
    [90.3, 125.1, 100],
    [67.9, 115.9, 125],
    [51.5, 98, 150],
    [44.2, 74.9, 175],
    [47.4, 50.8, 200],
    [109.7, 125.1, 80],
    [132.1, 115.9, 55],
    [148.5, 98, 30],
    [155.8, 74.9, 5],
    [152.6, 50.8, -20],
  ];
  return (
    <View style={{ width: 200, height: 140 }}>
      <Svg width={200} height={140} viewBox="0 0 200 140" style={styles.abs} {...hidden}>
        <Defs>
          <LinearGradient id={`ring${sid}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FFE27A" />
            <Stop offset="1" stopColor="#E08A00" />
          </LinearGradient>
        </Defs>
        <G fill="#FFC233" stroke="#C46F00" strokeWidth={1}>
          {leaves.map(([cx, cy, r], i) => (
            <Ellipse key={i} cx={cx} cy={cy} rx={6} ry={12} transform={`rotate(${r} ${cx} ${cy})`} />
          ))}
        </G>
        <Circle cx={100} cy={74} r={44} fill={colors.navyInk} />
        <Circle cx={100} cy={70} r={44} fill={`url(#ring${sid})`} />
        <Circle cx={100} cy={70} r={37} fill={colors.primaryLight} />
        <Path d="M82 30 L86 12 L94 22 L100 6 L106 22 L114 12 L118 30 Z" fill={`url(#ring${sid})`} stroke="#C46F00" strokeWidth={1.5} strokeLinejoin="round" />
        <Circle cx={100} cy={6} r={3} fill="#FF5C8A" />
      </Svg>
      <View style={styles.laurelCenter}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  abs: { position: 'absolute' },
  laurelCenter: {
    position: 'absolute',
    left: 63,
    top: 33,
    width: 74,
    height: 74,
    borderRadius: 37,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
