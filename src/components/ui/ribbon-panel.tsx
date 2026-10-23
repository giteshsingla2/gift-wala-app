import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts, panelGradient, ribbonGradient } from '@/constants/theme';
import { Sparkle } from './art';

// "Lucky winners" ribbon sitting half over the top edge of a soft blue panel.
export function RibbonPanel({ title, children, style, openBottom }: { title: string; children: React.ReactNode; style?: StyleProp<ViewStyle>; openBottom?: boolean }) {
  return (
    <View style={[styles.wrap, style]}>
      <LinearGradient colors={panelGradient} style={[styles.panel, openBottom && styles.openBottom]}>
        {children}
      </LinearGradient>
      <View style={styles.ribbonRow} pointerEvents="none">
        <LinearGradient colors={ribbonGradient} style={styles.ribbon}>
          <Sparkle size={14} />
          <Text style={styles.ribbonText} accessibilityRole="header">
            {title}
          </Text>
          <Sparkle size={14} />
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingTop: 22 },
  panel: { borderRadius: 28, paddingTop: 42, paddingHorizontal: 14, paddingBottom: 16, gap: 12 },
  openBottom: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, flex: 1 },
  ribbonRow: { position: 'absolute', top: 0, left: 0, right: 0, alignItems: 'center' },
  ribbon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 5,
    paddingHorizontal: 26,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.ribbonBorder,
    boxShadow: `0px 5px 0px ${colors.primaryEdge}`,
  },
  ribbonText: {
    fontFamily: fonts.display,
    fontSize: 21,
    lineHeight: 30,
    color: colors.onDark,
    textShadowColor: colors.primaryEdge,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 0,
  },
});
