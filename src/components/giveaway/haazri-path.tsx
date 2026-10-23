import { Fragment } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop, Text } from 'react-native-svg';

import { CoinG, CoinGradient, SPARKLE_PATH, SvgScope, decorative, useSvgId } from '@/components/ui/art';
import { colors, fonts } from '@/constants/theme';
import { t } from '@/i18n';

// The winding haazri road. Lays out any number of days as serpentine rows of up to 4 nodes
// (left to right, curve down, right to left...). Above 15 days it switches to a plain grid.

const W = 358;
const TOP = 46;
const ROW_GAP = 104;
const TURN_R = 298;
const TURN_L = 76;
const BULGE = 54;

type Node = { x: number; y: number; row: number };

function rowSizes(n: number, perRow: number) {
  const rows = Math.ceil(n / perRow);
  const base = Math.floor(n / rows);
  const extra = n % rows;
  return Array.from({ length: rows }, (_, r) => base + (r < extra ? 1 : 0));
}

function spread(from: number, to: number, k: number) {
  if (k === 1) return [from];
  return Array.from({ length: k }, (_, i) => from + ((to - from) * i) / (k - 1));
}

function layoutRoad(n: number): Node[] {
  const sizes = rowSizes(n, 4);
  const last = sizes.length - 1;
  return sizes.flatMap((k, r) => {
    const y = TOP + r * ROW_GAP;
    const ltr = r % 2 === 0;
    let xs: number[];
    if (r === 0) xs = spread(40, TURN_R, k);
    else if (ltr) xs = spread(84, 292, k);
    else xs = spread(268, r === last ? 66 : 84, k);
    return xs.map((x) => ({ x, y, row: r }));
  });
}

// Road from the first node through `upTo` (inclusive), following the turns between rows.
function roadPath(nodes: Node[], upTo: number) {
  const end = nodes[upTo];
  let d = `M${nodes[0].x} ${nodes[0].y}`;
  for (let r = 0; r <= end.row; r++) {
    const y = TOP + r * ROW_GAP;
    if (r === end.row) {
      d += ` H${end.x}`;
      break;
    }
    if (r % 2 === 0) d += ` H${TURN_R} C${TURN_R + BULGE} ${y} ${TURN_R + BULGE} ${y + ROW_GAP} ${TURN_R} ${y + ROW_GAP}`;
    else d += ` H${TURN_L} C${TURN_L - BULGE} ${y} ${TURN_L - BULGE} ${y + ROW_GAP} ${TURN_L} ${y + ROW_GAP}`;
  }
  return d;
}

function layoutGrid(n: number): Node[] {
  return Array.from({ length: n }, (_, i) => {
    const row = Math.floor(i / 5);
    return { x: 40 + (i % 5) * 69.5, y: TOP + row * 84, row };
  });
}

export function HaazriPath({ total: n, done: doneInput, doneToday, prizeTitle }: { total: number; done: number; doneToday: boolean; prizeTitle: string }) {
  const sid = useSvgId();
  const grid = n > 15;
  const nodes = grid ? layoutGrid(n) : layoutRoad(n);
  const done = Math.min(doneInput, n);
  const todayIndex = doneToday ? done - 1 : Math.min(done, n - 1);
  const lastRow = nodes[n - 1].row;
  const height = grid ? TOP + lastRow * 84 + 70 : TOP + lastRow * ROW_GAP + 64;
  const prize = nodes[n - 1];
  const prizeLabel = t.haazri.prizeDraw(prizeTitle);

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={t.haazri.pathLabel(done, todayIndex + 1, n)}>
      <Svg width="100%" style={{ aspectRatio: W / height }} viewBox={`0 0 ${W} ${height}`} {...decorative}>
        <SvgScope id={sid}>
          <Defs>
            <CoinGradient />
            <LinearGradient id={`gift${sid}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors.ribbonTop} />
              <Stop offset="1" stopColor={colors.ribbonBottom} />
            </LinearGradient>
          </Defs>

          {!grid && (
            <>
              <Path d={roadPath(nodes, n - 1)} stroke={colors.track} strokeWidth={18} fill="none" strokeLinecap="round" />
              <Path d={roadPath(nodes, n - 1)} stroke="#FFFFFF" strokeWidth={2.5} strokeDasharray="6 9" fill="none" strokeLinecap="round" />
              {todayIndex > 0 && <Path d={roadPath(nodes, todayIndex)} stroke={colors.coinMid} strokeWidth={18} fill="none" strokeLinecap="round" />}
            </>
          )}

          {nodes.slice(0, n - 1).map((node, i) => {
            if (i < done) {
              return (
                <Fragment key={i}>
                  {i === todayIndex && <Circle cx={node.x} cy={node.y} r={34} fill={colors.coinMid} opacity={0.22} />}
                  <CoinG x={node.x} y={node.y} r={24} edge={4} ring check />
                </Fragment>
              );
            }
            if (i === todayIndex) {
              return (
                <Fragment key={i}>
                  <Circle cx={node.x} cy={node.y} r={36} fill={colors.coinMid} opacity={0.22} />
                  <Circle cx={node.x} cy={node.y} r={27} fill="#FFFFFF" stroke={colors.goldBottom} strokeWidth={4} />
                  <Text x={node.x} y={node.y + 10} textAnchor="middle" fontFamily={fonts.display} fontSize={26} fill={colors.goldInk}>
                    {i + 1}
                  </Text>
                </Fragment>
              );
            }
            return (
              <Fragment key={i}>
                <Circle cx={node.x} cy={node.y + 3} r={22} fill="#D5DBEA" />
                <Circle cx={node.x} cy={node.y} r={22} fill="#EEF1F8" />
                <Text x={node.x} y={node.y + 7} textAnchor="middle" fontFamily={fonts.display} fontSize={19} fill={colors.textMuted}>
                  {i + 1}
                </Text>
              </Fragment>
            );
          })}

          {/* TODAY tag above today's node */}
          {todayIndex >= 0 && (
            <Fragment>
              <Rect x={nodes[todayIndex].x - 28} y={nodes[todayIndex].y - 44} width={56} height={20} rx={10} fill={colors.live} />
              <Text x={nodes[todayIndex].x} y={nodes[todayIndex].y - 29.5} textAnchor="middle" fontFamily={fonts.bodyBold} fontSize={12} fill="#FFFFFF">
                {t.haazri.today}
              </Text>
            </Fragment>
          )}

          {/* Prize badge */}
          <Circle cx={prize.x} cy={prize.y - 4} r={50} fill={colors.coinMid} opacity={0.2} />
          <Circle cx={prize.x} cy={prize.y} r={40} fill={colors.primaryEdge} />
          <Circle cx={prize.x} cy={prize.y - 4} r={40} fill={`url(#gift${sid})`} stroke="#FFFFFF" strokeWidth={3} />
          <Rect x={prize.x - 20} y={prize.y - 8} width={40} height={26} rx={4} fill="#E5283C" />
          <Rect x={prize.x - 24} y={prize.y - 16} width={48} height={11} rx={3} fill="#FF5C6E" />
          <Rect x={prize.x - 4} y={prize.y - 16} width={8} height={34} fill="#FFE58A" />
          <Path
            d={`M${prize.x} ${prize.y - 16}c-5 -10 -15 -9 -13 -3C${prize.x - 11.5} ${prize.y - 15} ${prize.x - 5} ${prize.y - 16} ${prize.x} ${prize.y - 16}zM${prize.x} ${prize.y - 16}c5 -10 15 -9 13 -3C${prize.x + 11.5} ${prize.y - 15} ${prize.x + 5} ${prize.y - 16} ${prize.x} ${prize.y - 16}z`}
            fill="#FFE58A"
          />
          <Rect x={prize.x - 42} y={prize.y + 38} width={84} height={22} rx={11} fill={colors.coinMid} />
          <Text
            x={prize.x}
            y={prize.y + 53.5}
            textAnchor="middle"
            fontFamily={fonts.bodyBold}
            fontSize={prizeLabel.length > 13 ? 10 : 12}
            fill={colors.goldInk}>
            {prizeLabel}
          </Text>
          <Path d={SPARKLE_PATH} fill={colors.coinMid} transform={`translate(${Math.min(prize.x + 52, W - 12)} ${prize.y - 42}) scale(0.8)`} />
          <Path d={SPARKLE_PATH} fill="#7CC4FF" transform={`translate(${prize.x - 56} ${prize.y - 28}) scale(0.6)`} />
        </SvgScope>
      </Svg>
    </View>
  );
}
