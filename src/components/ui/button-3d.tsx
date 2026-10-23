import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { colors, fonts } from '@/constants/theme';

// The game-feel button: a gradient face over a hard darker edge. Pressing pushes the face down
// onto the edge. Use one gold button per screen, for the thing we most want the user to do.

type Variant = 'gold' | 'goldSmall' | 'blue' | 'green' | 'white' | 'done';

const VARIANTS: Record<Variant, { face: readonly [string, string]; edge: string; edgeHeight: number; height: number; radius: number; text: TextStyle; glow?: string }> = {
  gold: {
    face: [colors.goldTop, colors.goldBottom],
    edge: colors.goldEdge,
    edgeHeight: 5,
    height: 56,
    radius: 16,
    text: { fontFamily: fonts.display, fontSize: 20, color: colors.goldInk },
    glow: '0px 10px 18px rgba(196,111,0,0.3)',
  },
  goldSmall: {
    face: [colors.goldTop, colors.goldBottom],
    edge: colors.goldEdge,
    edgeHeight: 4,
    height: 44,
    radius: 12,
    text: { fontFamily: fonts.display, fontSize: 16, color: colors.goldInk },
  },
  blue: {
    face: [colors.primaryLight, colors.primary],
    edge: colors.primaryEdge,
    edgeHeight: 4,
    height: 44,
    radius: 13,
    text: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.onDark },
  },
  green: {
    face: [colors.whatsappTop, colors.whatsappBottom],
    edge: colors.whatsappEdge,
    edgeHeight: 5,
    height: 56,
    radius: 16,
    text: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.onDark },
  },
  white: {
    face: ['#FFFFFF', '#FFFFFF'],
    edge: colors.whatsappOnWhiteEdge,
    edgeHeight: 4,
    height: 44,
    radius: 12,
    text: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.whatsappOnWhiteText },
  },
  done: {
    face: [colors.successBg, colors.successBg],
    edge: '#BFE3CD',
    edgeHeight: 3,
    height: 56,
    radius: 16,
    text: { fontFamily: fonts.display, fontSize: 19, color: colors.successText },
  },
};

type Props = {
  variant?: Variant;
  label?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  height?: number;
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  faceStyle?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  // Render as plain visuals inside a larger pressable (the parent owns the tap and passes `pressed`).
  asStatic?: boolean;
  pressed?: boolean;
};

export function Button3D({ variant = 'gold', label, icon, children, onPress, disabled, height, textStyle, style, faceStyle, accessibilityLabel, asStatic, pressed }: Props) {
  const v = VARIANTS[variant];
  const h = height ?? v.height;
  const render = (down: boolean) => (
    <>
      <View style={[styles.edge, { top: v.edgeHeight, height: h, borderRadius: v.radius, backgroundColor: v.edge, boxShadow: down ? undefined : v.glow }]} />
      <LinearGradient
        colors={v.face}
        style={[styles.face, { height: h, borderRadius: v.radius, transform: [{ translateY: down ? v.edgeHeight : 0 }] }, faceStyle]}>
        {icon}
        {label ? (
          <Text style={[v.text, textStyle]} numberOfLines={1}>
            {label}
          </Text>
        ) : null}
        {children}
      </LinearGradient>
    </>
  );
  if (asStatic) {
    return (
      <View style={[{ height: h + v.edgeHeight }, style]} importantForAccessibility="no-hide-descendants">
        {render(!!pressed)}
      </View>
    );
  }
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
      style={[{ height: h + v.edgeHeight }, style]}>
      {({ pressed: p }) => render(p && !disabled)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  edge: { position: 'absolute', left: 0, right: 0 },
  face: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 16 },
});
