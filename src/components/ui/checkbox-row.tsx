import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts } from '@/constants/theme';
import { BellIcon, CheckIcon } from './icons';

// A tappable row with a bell tile and a green checkbox, used for reminder and alert toggles.
export function CheckboxRow({ title, body, value, onChange, dashed, style }: { title: string; body?: string; value: boolean; onChange: (v: boolean) => void; dashed?: boolean; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable
      onPress={() => onChange(!value)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value }}
      accessibilityLabel={body ? `${title}. ${body}` : title}
      style={[styles.row, dashed ? styles.dashed : styles.plain, style]}>
      <View style={[styles.bell, dashed && styles.bellLarge]}>
        <BellIcon size={dashed ? 22 : 20} color={colors.primary} />
      </View>
      <View style={styles.text}>
        <Text style={[styles.title, !dashed && styles.titlePlain]}>{title}</Text>
        {body ? <Text style={styles.body}>{body}</Text> : null}
      </View>
      <View style={[styles.box, value && styles.boxOn]}>{value && <CheckIcon size={18} color="#FFFFFF" strokeWidth={3.2} />}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52 },
  plain: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 16, backgroundColor: colors.bg },
  dashed: { padding: 14, borderRadius: 20, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.divider, backgroundColor: colors.bgAlt },
  bell: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' },
  bellLarge: { width: 44, height: 44, borderRadius: 14 },
  text: { flex: 1 },
  title: { fontFamily: fonts.bodyBold, fontSize: 15, lineHeight: 20, color: colors.text },
  titlePlain: { fontSize: 16 },
  body: { fontFamily: fonts.body, fontSize: 13, lineHeight: 17, color: colors.textMuted2 },
  box: { width: 26, height: 26, borderRadius: 5, borderWidth: 2, borderColor: colors.divider, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  boxOn: { backgroundColor: colors.success, borderColor: colors.success },
});
