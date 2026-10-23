import Constants from 'expo-constants';

// Where the Gift Wala server lives. Set EXPO_PUBLIC_API_URL for other environments.
// In development a USB-connected phone reaches the Mac's server via `adb reverse tcp:3000 tcp:3000`.
export const config = {
  apiUrl: (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000').replace(/\/$/, ''),
  appVersion: Constants.expoConfig?.version ?? '1.0.0',
} as const;
