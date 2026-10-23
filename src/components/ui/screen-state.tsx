import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/constants/theme';
import { t } from '@/i18n';

// Shown before the first load finishes, or if it fails with nothing cached.
export function ScreenState({ error, onRetry }: { error?: Error; onRetry?: () => void }) {
  return (
    <View style={styles.wrap}>
      {error ? (
        <>
          <Text style={styles.text}>{t.common.loadFailed}</Text>
          {onRetry ? (
            <Pressable onPress={onRetry} accessibilityRole="button" style={styles.retry}>
              <Text style={styles.retryText}>{t.common.retry}</Text>
            </Pressable>
          ) : null}
        </>
      ) : (
        <ActivityIndicator size="large" color={colors.primary} accessibilityLabel={t.common.loading} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24, backgroundColor: colors.bg },
  text: { fontFamily: fonts.body, fontSize: 16, color: colors.textMuted, textAlign: 'center' },
  retry: { minHeight: 44, paddingHorizontal: 20, justifyContent: 'center', borderRadius: 12, backgroundColor: colors.primaryTint },
  retryText: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.primary },
});
