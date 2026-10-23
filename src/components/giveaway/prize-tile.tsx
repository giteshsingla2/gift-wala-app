import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { PrizeImage } from '@/components/ui/prize-art';
import { gradientPoints } from '@/constants/theme';
import type { Giveaway } from '@/types';

const tilePoints = gradientPoints(160);

// The coloured square behind a prize image. Colours come from the giveaway (admin-controlled).
export function PrizeTile({ giveaway, size, height, imageSize, radius = 18, style }: { giveaway: Pick<Giveaway, 'tileColorFrom' | 'tileColorTo' | 'imageUrl' | 'art'>; size: number; height?: number; imageSize?: number; radius?: number; style?: StyleProp<ViewStyle> }) {
  const h = height ?? size;
  const img = imageSize ?? Math.min(size, h) * 0.9;
  return (
    <LinearGradient colors={[giveaway.tileColorFrom, giveaway.tileColorTo]} {...tilePoints} style={[styles.tile, { width: size, height: h, borderRadius: radius }, style]}>
      <PrizeImage imageUrl={giveaway.imageUrl} art={giveaway.art} width={img} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  tile: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
});
