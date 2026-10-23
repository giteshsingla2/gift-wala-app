import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ConfettiLayer, GiftGlyph, Sunburst, type ConfettiPiece } from '@/components/ui/art';
import { Button3D } from '@/components/ui/button-3d';
import { HeroBackground } from '@/components/ui/hero';
import { ShieldCheckIcon } from '@/components/ui/icons';
import { colors, fonts, goldGradient, headingShadow } from '@/constants/theme';
import { t } from '@/i18n';
import { loginWithPhone } from '@/store/session';

const CONFETTI: ConfettiPiece[] = [
  { kind: 'rect', x: 40, y: 150, color: '#FFC233', rotate: 25 },
  { kind: 'rect', x: 340, y: 132, color: '#FF5C8A', rotate: -30, w: 7, h: 13 },
  { kind: 'dot', x: 100, y: 110, color: '#3DDC97', r: 4 },
  { kind: 'squiggle', x: 300, y: 40, color: '#7CC4FF' },
  { kind: 'sparkle', x: 40, y: 60, color: '#FFFFFF', scale: 0.9 },
  { kind: 'sparkle', x: 312, y: 90, color: '#FFE58A' },
];

// Phone number only for now (no OTP). See docs/BACKEND.md.
export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const digits = phone.replace(/\D/g, '');
  const valid = /^[6-9]\d{9}$/.test(digits);

  const submit = async () => {
    if (!valid) {
      setError(t.login.invalid);
      return;
    }
    setBusy(true);
    setError(undefined);
    try {
      await loginWithPhone(digits);
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <HeroBackground style={[styles.hero, { paddingTop: insets.top + 48 }]}>
          <Sunburst size={420} style={{ left: width / 2 - 210, top: insets.top - 60 }} />
          <ConfettiLayer pieces={CONFETTI} width={width} height={320} style={{ top: insets.top }} />
          <LinearGradient colors={goldGradient} style={styles.logo}>
            <GiftGlyph size={40} />
          </LinearGradient>
          <Text style={styles.title}>{t.login.title}</Text>
          <Text style={styles.subtitle}>{t.login.subtitle}</Text>
        </HeroBackground>

        <View style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
          <Text style={styles.label}>{t.login.phoneLabel}</Text>
          <View style={[styles.inputRow, error ? styles.inputError : null]}>
            <Text style={styles.prefix}>+91</Text>
            <TextInput
              value={phone}
              onChangeText={(v) => {
                setPhone(v);
                setError(undefined);
              }}
              placeholder={t.login.phonePlaceholder}
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              autoComplete="tel"
              maxLength={14}
              returnKeyType="done"
              onSubmitEditing={submit}
              style={styles.input}
              accessibilityLabel={t.login.phoneLabel}
            />
          </View>
          {error ? (
            <Text style={styles.error} accessibilityLiveRegion="polite">
              {error}
            </Text>
          ) : null}
          <Button3D variant="gold" label={t.login.continue} onPress={submit} disabled={busy} style={styles.button} />
          <View style={styles.free}>
            <ShieldCheckIcon size={22} />
            <Text style={styles.freeText}>{t.login.free}</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { flexGrow: 1 },
  hero: { alignItems: 'center', paddingHorizontal: 24, paddingBottom: 64 },
  logo: {
    width: 76,
    height: 76,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 5px 0px ${colors.goldEdge}`,
  },
  title: { marginTop: 18, fontFamily: fonts.display, fontSize: 32, lineHeight: 38, color: colors.onDark, textAlign: 'center', ...headingShadow },
  subtitle: { marginTop: 6, fontFamily: fonts.body, fontSize: 17, lineHeight: 23, color: colors.onDarkMuted, textAlign: 'center' },
  sheet: {
    flexGrow: 1,
    marginTop: -28,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    gap: 10,
  },
  label: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.text },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 58,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.bg,
  },
  inputError: { borderColor: colors.live },
  prefix: { fontFamily: fonts.bodyBold, fontSize: 19, color: colors.text },
  input: { flex: 1, fontFamily: fonts.bodySemiBold, fontSize: 20, color: colors.text, paddingVertical: 8 },
  error: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: colors.liveText },
  button: { marginTop: 8 },
  free: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8, padding: 14, borderRadius: 16, backgroundColor: colors.successBg },
  freeText: { flex: 1, fontFamily: fonts.bodyBold, fontSize: 15, color: colors.successText },
});
