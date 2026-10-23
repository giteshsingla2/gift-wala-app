import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, goldGradient, shadows } from '@/constants/theme';
import { t } from '@/i18n';
import { CalendarCheckIcon, GiftIcon, HomeIcon, TrophyIcon, UserIcon } from './icons';

// Five-item bar with the raised gold Haazri button in the middle.

const ITEMS = {
  index: { label: t.nav.home, Icon: HomeIcon },
  giveaways: { label: t.nav.giveaways, Icon: GiftIcon },
  haazri: { label: t.nav.haazri, Icon: CalendarCheckIcon },
  winners: { label: t.nav.winners, Icon: TrophyIcon },
  profile: { label: t.nav.profile, Icon: UserIcon },
} as const;

export function BottomNav({ state, emitter, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) + 6 }]} accessibilityRole="tablist">
      {state.routes.map((route, index) => {
        const item = ITEMS[route.name as keyof typeof ITEMS];
        if (!item) return null;
        const focused = state.index === index;
        const onPress = () => {
          const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigateToTab(route.key);
        };
        const color = focused ? colors.primary : colors.textMuted;

        if (route.name === 'haazri') {
          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={item.label}
              style={styles.item}>
              <View style={[styles.haazriRing, focused && styles.haazriRingActive]}>
                <LinearGradient colors={goldGradient} style={styles.haazriButton}>
                  <CalendarCheckIcon size={28} color={colors.goldInk} strokeWidth={2.4} />
                </LinearGradient>
              </View>
              <Text style={[styles.label, styles.haazriLabel, focused && { color: colors.primary, fontFamily: fonts.display }]}>{item.label}</Text>
            </Pressable>
          );
        }

        const { Icon } = item;
        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={item.label}
            style={styles.item}>
            <Icon size={24} color={color} strokeWidth={focused ? 2.2 : 2} {...(focused ? { active: true } : {})} />
            <Text style={[styles.label, { color }, focused && styles.labelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    boxShadow: shadows.nav,
    paddingTop: 6,
    paddingHorizontal: 6,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 2, minHeight: 54 },
  label: { fontFamily: fonts.bodyMedium, fontSize: 13, lineHeight: 17 },
  labelActive: { fontFamily: fonts.bodyBold },
  haazriLabel: { fontFamily: fonts.bodyBold, color: colors.goldInk },
  haazriRing: {
    marginTop: -34,
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 5,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 6px 14px rgba(196,111,0,0.35)',
    overflow: 'visible',
  },
  haazriRingActive: { boxShadow: `0px 0px 0px 3px ${colors.primary}, 0px 6px 14px rgba(196,111,0,0.35)` },
  haazriButton: { flex: 1, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
});
