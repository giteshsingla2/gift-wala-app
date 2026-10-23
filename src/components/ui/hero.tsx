import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/constants/theme';

// Blue hero backdrop: the vertical gradient. Screens layer Sunburst / ConfettiLayer / Spotlights on top.
export function HeroBackground({ children, style, midStop = 0.6 }: { children?: React.ReactNode; style?: StyleProp<ViewStyle>; midStop?: number }) {
  return (
    <View style={[styles.hero, style]}>
      <LinearGradient
        colors={[colors.heroTop, colors.heroMid, colors.heroBottom]}
        locations={[0, midStop, 1]}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { overflow: 'hidden' },
});
