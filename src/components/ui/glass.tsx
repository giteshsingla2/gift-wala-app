import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts } from '@/constants/theme';

// Translucent controls that sit on the blue heroes.

export function GlassIconButton({ onPress, label, children, round, tone = 'light', style }: { onPress?: () => void; label: string; children: React.ReactNode; round?: boolean; tone?: 'light' | 'warm'; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={4}
      style={({ pressed }) => [styles.iconButton, round && styles.round, tone === 'warm' && styles.warm, pressed && styles.pressed, style]}>
      {children}
    </Pressable>
  );
}

export function GlassChip({ icon, label, onPress, accessibilityLabel }: { icon?: React.ReactNode; label: string; onPress?: () => void; accessibilityLabel?: string }) {
  const content = (
    <>
      {icon}
      <Text style={styles.chipText}>{label}</Text>
    </>
  );
  if (!onPress) return <View style={styles.chip}>{content}</View>;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={accessibilityLabel ?? label} style={({ pressed }) => [styles.chip, styles.chipTall, pressed && styles.pressed]}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.glassLightBg,
    borderWidth: 1,
    borderColor: colors.glassLightBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  round: { borderRadius: 22 },
  warm: { backgroundColor: 'rgba(255,255,255,0.55)', borderColor: 'rgba(255,255,255,0.8)' },
  pressed: { opacity: 0.7 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: colors.glassLightBg,
    borderWidth: 1,
    borderColor: colors.glassLightBorder,
  },
  chipTall: { minHeight: 44 },
  chipText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.onDark },
});
