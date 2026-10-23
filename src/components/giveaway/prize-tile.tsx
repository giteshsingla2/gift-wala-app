import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { PrizeImage } from '@/components/ui/prize-image';
import { gradientPoints } from '@/constants/theme';

const tilePoints = gradientPoints(160);

// The coloured square behind a prize photo. Colours come from the giveaway (set in the admin panel).
export function PrizeTile({
  colors,
  imageUrl,
  size,
  height,
  imageSize,
  radius = 18,
  style,
}: {
  colors: { from: string; to: string };
  imageUrl: string | null;
  size: number;
  height?: number;
  imageSize?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const h = height ?? size;
  const img = imageSize ?? Math.min(size, h) * 0.9;
  return (
    <LinearGradient colors={[colors.from, colors.to]} {...tilePoints} style={[styles.tile, { width: size, height: h, borderRadius: radius }, style]}>
      <PrizeImage uri={imageUrl} width={img} />
    </LinearGradient>
  );
}

export const tileColorsOf = (g: { tileColorFrom: string; tileColorTo: string }) => ({ from: g.tileColorFrom, to: g.tileColorTo });

const styles = StyleSheet.create({
  tile: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
});
