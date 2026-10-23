import Constants from 'expo-constants';
import { Linking, StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/constants/theme';
import { t } from '@/i18n';
import { Button3D } from './button-3d';
import { GiftGlyph } from './art';

// Shown instead of the app when the admin's minimum app version is newer than this build.
export function UpdateRequired() {
  const pkg = Constants.expoConfig?.android?.package;
  return (
    <View style={styles.screen}>
      <GiftGlyph size={72} />
      <Text style={styles.title}>{t.update.title}</Text>
      <Text style={styles.body}>{t.update.body}</Text>
      {pkg ? <Button3D variant="gold" label={t.update.button} onPress={() => Linking.openURL(`market://details?id=${pkg}`)} style={styles.button} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 12, backgroundColor: colors.bg },
  title: { fontFamily: fonts.display, fontSize: 26, lineHeight: 32, color: colors.text, textAlign: 'center' },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 22, color: colors.textMuted, textAlign: 'center' },
  button: { alignSelf: 'stretch', marginTop: 8 },
});
