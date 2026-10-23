import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { CoinG, CoinGradient, SPARKLE_PATH, Sunburst, SvgScope, decorative, useSvgId } from '@/components/ui/art';
import { PrizeImage } from '@/components/ui/prize-image';

// Decorations around the prize photo: glow, shadow, floating coins and sparkles.

/** Home poster: 260×214 with the prize in the middle and the sunburst behind. */
export function HomeHeroArt({ imageUrl }: { imageUrl: string | null }) {
  const sid = useSvgId();
  return (
    <View style={styles.homeWrap}>
      <Sunburst size={400} style={{ left: 130 - 200, top: 104 - 200 }} />
      <View>
        <Svg width={260} height={214} viewBox="0 0 260 214" {...decorative}>
          <SvgScope id={sid}>
            <Defs>
              <RadialGradient id={`glow${sid}`} cx="50%" cy="50%" r="50%">
                <Stop offset="0" stopColor="#FFE08A" stopOpacity={0.55} />
                <Stop offset="1" stopColor="#FFE08A" stopOpacity={0} />
              </RadialGradient>
              <CoinGradient />
            </Defs>
            <Circle cx={130} cy={104} r={104} fill={`url(#glow${sid})`} />
            <Ellipse cx={130} cy={204} rx={58} ry={8} fill="#050B33" opacity={0.35} />
          </SvgScope>
        </Svg>
      </View>
      <View style={styles.center} pointerEvents="none">
        <PrizeImage uri={imageUrl} width={196} />
      </View>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width={260} height={214} viewBox="0 0 260 214" {...decorative}>
          <SvgScope id={`${sid}c`}>
            <Defs>
              <CoinGradient />
            </Defs>
            <CoinG x={44} y={156} r={23} edge={3.5} />
            <CoinG x={220} y={56} r={18} edge={3} />
            <CoinG x={224} y={166} r={14} edge={2.5} />
            <Path d={SPARKLE_PATH} fill="#FFFFFF" transform="translate(52 50) scale(1.2)" />
            <Path d={SPARKLE_PATH} fill="#FFE58A" transform="translate(206 118) scale(0.8)" />
          </SvgScope>
        </Svg>
      </View>
    </View>
  );
}

/** Giveaway detail hero: prize centred, coins and confetti around it. */
export function DetailHeroArt({ imageUrl, width }: { imageUrl: string | null; width: number }) {
  const sid = useSvgId();
  const s = width / 390;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[styles.detailCenter, { top: 70 * s, height: 210 * s }]}>
        <PrizeImage uri={imageUrl} width={220 * s} />
      </View>
      <View style={StyleSheet.absoluteFill}>
        <Svg width={width} height={330 * s} viewBox="0 0 390 330" {...decorative}>
          <SvgScope id={sid}>
            <Defs>
              <CoinGradient />
            </Defs>
            <Ellipse cx={195} cy={282} rx={70} ry={10} fill="#7A3A00" opacity={0.2} />
            <CoinG x={84} y={220} r={26} edge={5} />
            <CoinG x={306} y={130} r={21} edge={4} />
            <CoinG x={312} y={236} r={15} edge={3} />
            <Rect x={62} y={120} width={8} height={14} rx={2} fill="#FFFFFF" transform="rotate(25 66 127)" />
            <Rect x={330} y={90} width={7} height={13} rx={2} fill="#E5283C" transform="rotate(-30 333 96)" />
            <Circle cx={100} cy={96} r={4} fill="#FFFFFF" />
            <Path d={SPARKLE_PATH} fill="#FFFFFF" transform="translate(104 162) scale(1.1)" />
            <Path d={SPARKLE_PATH} fill="#FFFFFF" transform="translate(296 196) scale(0.8)" />
          </SvgScope>
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  homeWrap: { width: 260, height: 214, marginTop: 4 },
  center: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', paddingBottom: 10 },
  detailCenter: { position: 'absolute', left: 0, right: 0, alignItems: 'center', justifyContent: 'center' },
});
