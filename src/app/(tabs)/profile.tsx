import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, RefreshControl, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getMyWins } from '@/api';
import { Coin } from '@/components/ui/art';
import { Button3D } from '@/components/ui/button-3d';
import { HeroBackground } from '@/components/ui/hero';
import { ChevronRightIcon, ShieldCheckIcon } from '@/components/ui/icons';
import { WinnerCard } from '@/components/winners/winner-card';
import { colors, fonts, headingShadow, shadows } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';
import { t } from '@/i18n';
import { formatTime } from '@/lib/format';
import { applyReminder } from '@/lib/reminders';
import { logout, saveProfile, setWallet, useSession } from '@/store/session';
import type { User } from '@/types';

const INFO_PAGES = ['rules', 'funding', 'safety', 'help'] as const;

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, wallet } = useSession();
  const wins = useApi(getMyWins);
  const [showIosPicker, setShowIosPicker] = useState(false);

  useEffect(() => {
    if (wins.data) setWallet(wins.data.wallet);
  }, [wins.data]);

  if (!user) return null;

  const setReminder = async (enabled: boolean, time: string) => {
    const granted = await applyReminder(enabled, time).catch(() => true);
    if (!granted) Alert.alert(t.profile.reminderDenied);
    await saveProfile({ reminderEnabled: enabled && granted, reminderTime: time }).catch(() => {});
  };

  const pickTime = () => {
    const [h, m] = user.reminderTime.split(':').map(Number);
    const value = new Date();
    value.setHours(h, m, 0, 0);
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value,
        mode: 'time',
        onChange: (event, date) => {
          if (event.type === 'set' && date) setReminder(true, `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`);
        },
      });
    } else if (Platform.OS === 'ios') {
      setShowIosPicker((v) => !v);
    }
  };

  const confirmLogout = () =>
    Alert.alert(t.profile.logoutConfirm, undefined, [
      { text: t.common.cancel, style: 'cancel' },
      { text: t.profile.logout, style: 'destructive', onPress: () => logout() },
    ]);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={wins.refreshing} onRefresh={wins.refresh} tintColor="#FFFFFF" progressViewOffset={insets.top} />}>
        <HeroBackground style={[styles.hero, { paddingTop: insets.top + 18 }]}>
          <Text style={styles.title} accessibilityRole="header">
            {user.name || t.profile.title}
          </Text>
          <Text style={styles.phone}>+91 {user.phone}</Text>
          <View style={styles.wallet} accessible accessibilityLabel={t.a11y.wallet(wallet)}>
            <Coin size={44} />
            <View>
              <Text style={styles.walletLabel}>{t.profile.totalWinnings}</Text>
              <Text style={styles.walletValue}>{t.rupees(wallet)}</Text>
            </View>
          </View>
        </HeroBackground>

        <View style={styles.body}>
          <Section title={t.profile.myWins}>
            {wins.data && wins.data.wins.length > 0 ? (
              wins.data.wins.map((w) => <WinnerCard key={w.id} winner={w} compact />)
            ) : (
              <Text style={styles.muted}>{t.profile.noWins}</Text>
            )}
          </Section>

          <DetailsForm key={user.id} user={user} />

          <Section title={t.profile.reminder}>
            <View style={styles.row}>
              <Text style={[styles.rowText, styles.flex]}>{t.profile.reminderBody}</Text>
              <Switch
                value={user.reminderEnabled}
                onValueChange={(v) => setReminder(v, user.reminderTime)}
                trackColor={{ true: colors.success, false: colors.border }}
                accessibilityLabel={t.profile.reminder}
              />
            </View>
            {user.reminderEnabled ? (
              <Pressable onPress={pickTime} accessibilityRole="button" style={styles.timeRow}>
                <Text style={styles.rowText}>{t.profile.reminderTime}</Text>
                <Text style={styles.timeValue}>{formatTime(user.reminderTime)}</Text>
              </Pressable>
            ) : null}
            {showIosPicker && Platform.OS === 'ios' ? (
              <DateTimePicker
                mode="time"
                display="spinner"
                value={(() => {
                  const d = new Date();
                  const [h, m] = user.reminderTime.split(':').map(Number);
                  d.setHours(h, m, 0, 0);
                  return d;
                })()}
                onChange={(_, date) => date && setReminder(true, `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`)}
              />
            ) : null}
          </Section>

          <Section title={t.profile.help}>
            {INFO_PAGES.map((p) => (
              <Pressable key={p} onPress={() => router.push(`/info/${p}`)} accessibilityRole="link" style={styles.linkRow}>
                <Text style={styles.rowText}>{t.info[p].title}</Text>
                <ChevronRightIcon size={20} color={colors.primary} />
              </Pressable>
            ))}
          </Section>

          <View style={styles.free}>
            <ShieldCheckIcon size={24} />
            <Text style={styles.freeText}>{t.trust.adsPayForPrizes}</Text>
          </View>

          <Pressable onPress={confirmLogout} accessibilityRole="button" style={styles.logout}>
            <Text style={styles.logoutText}>{t.profile.logout}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function DetailsForm({ user }: { user: User }) {
  const [form, setForm] = useState({ name: user.name, city: user.city, state: user.state, pincode: user.pincode });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string }>();

  const save = async () => {
    setSaving(true);
    setMessage(undefined);
    try {
      await saveProfile(form);
      setMessage({ ok: true, text: t.profile.saved });
    } catch (e) {
      setMessage({ ok: false, text: (e as Error).message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Section title={t.profile.details}>
      <Field label={t.profile.name} value={form.name} onChange={(name) => setForm((f) => ({ ...f, name }))} autoComplete="name" />
      <Field label={t.profile.phone} value={`+91 ${user.phone}`} editable={false} />
      <Field label={t.profile.city} value={form.city} onChange={(city) => setForm((f) => ({ ...f, city }))} />
      <Field label={t.profile.state} value={form.state} onChange={(state) => setForm((f) => ({ ...f, state }))} />
      <Field label={t.profile.pincode} value={form.pincode} onChange={(pincode) => setForm((f) => ({ ...f, pincode: pincode.replace(/\D/g, '').slice(0, 6) }))} keyboardType="number-pad" />
      <Button3D variant="blue" height={48} label={t.profile.save} onPress={save} disabled={saving} />
      {message ? <Text style={[styles.message, !message.ok && styles.messageError]}>{message.text}</Text> : null}
    </Section>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.h2} accessibilityRole="header">
        {title}
      </Text>
      {children}
    </View>
  );
}

function Field({
  label,
  value,
  onChange,
  editable = true,
  keyboardType,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  editable?: boolean;
  keyboardType?: 'number-pad';
  autoComplete?: 'name';
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        editable={editable}
        keyboardType={keyboardType}
        autoComplete={autoComplete}
        style={[styles.input, !editable && styles.inputReadOnly]}
        accessibilityLabel={label}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 32 },
  flex: { flex: 1 },
  hero: { paddingHorizontal: 16, paddingBottom: 24 },
  title: { fontFamily: fonts.display, fontSize: 28, lineHeight: 34, color: colors.onDark, ...headingShadow },
  phone: { fontFamily: fonts.body, fontSize: 16, color: colors.onDarkMuted },
  wallet: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 18,
    backgroundColor: colors.glassDarkBg,
    borderWidth: 1,
    borderColor: colors.glassDarkBorder,
  },
  walletLabel: { fontFamily: fonts.body, fontSize: 14, color: colors.onDarkFaint },
  walletValue: { fontFamily: fonts.display, fontSize: 28, lineHeight: 32, color: colors.goldOnDark },
  body: { padding: 16, gap: 20 },
  section: { gap: 10, backgroundColor: colors.surface, borderRadius: 20, padding: 16, boxShadow: shadows.card },
  h2: { fontFamily: fonts.display, fontSize: 20, lineHeight: 26, color: colors.text },
  muted: { fontFamily: fonts.body, fontSize: 15, lineHeight: 21, color: colors.textMuted },
  field: { gap: 4 },
  label: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.text2 },
  input: {
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.bg,
    fontFamily: fonts.body,
    fontSize: 17,
    color: colors.text,
  },
  inputReadOnly: { color: colors.textMuted },
  message: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.successText, textAlign: 'center' },
  messageError: { color: colors.liveText },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowText: { fontFamily: fonts.bodySemiBold, fontSize: 16, color: colors.text },
  timeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 48, paddingHorizontal: 14, borderRadius: 12, backgroundColor: colors.bg },
  timeValue: { fontFamily: fonts.bodyBold, fontSize: 17, color: colors.primary },
  linkRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 48 },
  free: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 16, backgroundColor: colors.successBg },
  freeText: { flex: 1, fontFamily: fonts.bodyBold, fontSize: 15, lineHeight: 20, color: colors.successText },
  logout: { alignSelf: 'center', minHeight: 48, justifyContent: 'center', paddingHorizontal: 24 },
  logoutText: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.liveText },
});
