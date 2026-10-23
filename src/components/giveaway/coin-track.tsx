import { Fragment } from 'react';
import Svg, { Circle, Defs, Rect, Text } from 'react-native-svg';

import { CoinG, CoinGradient, SvgScope, decorative, useSvgId } from '@/components/ui/art';
import { colors, fonts } from '@/constants/theme';
import type { HaazriProgress } from '@/types';

// Compact haazri track for the Home card: gold coins for done days, a ringed node for today,
// grey numbers for later days, and the prize badge at the end.
export function CoinTrack({ progress }: { progress: HaazriProgress }) {
  const sid = useSvgId();
  const n = progress.haazriDays;
  const done = progress.daysMarked;
  const todayIndex = progress.markedToday ? -1 : done;
  const step = (300 - 18) / Math.max(1, n - 2);
  const xs = Array.from({ length: n - 1 }, (_, i) => 18 + i * step);
  const fillTo = done === 0 ? 18 : (xs[Math.min(done, n - 2)] ?? 300);

  return (
    <Svg width="100%" style={{ aspectRatio: 354 / 52 }} viewBox="0 0 354 52" {...decorative}>
      <SvgScope id={sid}>
        <Defs>
          <CoinGradient />
        </Defs>
        <Rect x={18} y={23} width={318} height={6} rx={3} fill="#E6EBF7" />
        <Rect x={18} y={23} width={Math.max(0, fillTo - 18)} height={6} rx={3} fill={colors.coinMid} />
        {xs.map((x, i) => {
          if (i < done) return <CoinG key={i} x={x} y={26} r={15} edge={2.5} ring={false} check />;
          if (i === todayIndex)
            return (
              <Fragment key={i}>
                <Circle cx={x} cy={26} r={22} fill="none" stroke={colors.coinMid} strokeOpacity={0.35} strokeWidth={5} />
                <Circle cx={x} cy={26} r={16} fill="#FFFFFF" stroke={colors.goldBottom} strokeWidth={3} />
                <Text x={x} y={32} textAnchor="middle" fontFamily={fonts.display} fontSize={17} fill={colors.goldInk}>
                  {i + 1}
                </Text>
              </Fragment>
            );
          return (
            <Fragment key={i}>
              <Circle cx={x} cy={26} r={12} fill="#EEF1F8" stroke="#D5DBEA" />
              <Text x={x} y={31} textAnchor="middle" fontFamily={fonts.bodyBold} fontSize={13} fill={colors.textMuted}>
                {i + 1}
              </Text>
            </Fragment>
          );
        })}
        <Rect x={318} y={8} width={34} height={34} rx={10} fill={colors.primary} />
        <Rect x={324} y={22} width={22} height={15} rx={2} fill="#E5283C" />
        <Rect x={322} y={18} width={26} height={6} rx={2} fill="#FF5C6E" />
        <Rect x={333} y={18} width={4} height={19} fill="#FFE58A" />
      </SvgScope>
    </Svg>
  );
}
