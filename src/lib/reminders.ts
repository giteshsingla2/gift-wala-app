import { isRunningInExpoGo } from 'expo';
import { Platform } from 'react-native';

import { t } from '@/i18n';

// The daily haazri reminder is a local notification scheduled on the phone at the user's chosen time.
// expo-notifications can't load inside Expo Go on Android (it's missing a native module), so it is
// imported lazily and reminders only run in real builds (development build or Play Store app).

const CHANNEL_ID = 'haazri-reminder';
const supported = Platform.OS !== 'web' && !isRunningInExpoGo();

let loaded: Promise<typeof import('expo-notifications')> | null = null;

function notifications() {
  loaded ??= import('expo-notifications').then((N) => {
    N.setNotificationHandler({
      handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }),
    });
    return N;
  });
  return loaded;
}

/** Schedules (or cancels) the daily reminder. Returns false if the user refused notifications. */
export async function applyReminder(enabled: boolean, time: string): Promise<boolean> {
  if (!supported) return true;
  const N = await notifications();
  await N.cancelAllScheduledNotificationsAsync();
  if (!enabled) return true;

  const current = await N.getPermissionsAsync();
  const granted = current.granted || (await N.requestPermissionsAsync()).granted;
  if (!granted) return false;

  if (Platform.OS === 'android') {
    await N.setNotificationChannelAsync(CHANNEL_ID, { name: t.reminder.channelName, importance: N.AndroidImportance.DEFAULT });
  }
  const [hour, minute] = time.split(':').map(Number);
  await N.scheduleNotificationAsync({
    content: { title: t.reminder.title, body: t.reminder.body },
    trigger: { type: N.SchedulableTriggerInputTypes.DAILY, hour, minute, channelId: CHANNEL_ID },
  });
  return true;
}
