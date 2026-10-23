import { useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { confetti } from '@/constants/theme';

// One-shot confetti burst for celebrations. Pieces fall from the top and fade out.

const PIECES = Array.from({ length: 36 }, (_, i) => ({
  x: (i * 37) % 100,
  delay: (i % 9) * 60,
  drift: ((i * 53) % 60) - 30,
  spin: ((i * 97) % 720) - 360,
  color: confetti[i % (confetti.length - 1)],
  round: i % 4 === 0,
  size: 7 + (i % 3) * 2,
}));

function Piece({ p, width, height }: { p: (typeof PIECES)[number]; width: number; height: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(p.delay, withTiming(1, { duration: 1800, easing: Easing.out(Easing.quad) }));
  }, [p.delay, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: 1 - progress.value * progress.value,
    transform: [
      { translateY: -20 + progress.value * height * 0.75 },
      { translateX: p.drift * progress.value },
      { rotate: `${p.spin * progress.value}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.piece,
        { left: (p.x / 100) * width, width: p.size, height: p.round ? p.size : p.size * 1.7, borderRadius: p.round ? p.size : 2, backgroundColor: p.color },
        style,
      ]}
    />
  );
}

export function ConfettiBurst() {
  const { width, height } = useWindowDimensions();
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none" accessible={false} importantForAccessibility="no-hide-descendants">
      {PIECES.map((p, i) => (
        <Piece key={i} p={p} width={width} height={height} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  piece: { position: 'absolute', top: 0 },
});
