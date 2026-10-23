import { useSyncExternalStore } from 'react';

// Small in-memory store for on-device toggles. Persisting them and scheduling the local
// notifications is a later step (expo-notifications + storage).
type Prefs = { haazriReminder: boolean; giveawayAlerts: boolean };

let prefs: Prefs = { haazriReminder: true, giveawayAlerts: true };
const listeners = new Set<() => void>();

export function setPref<K extends keyof Prefs>(key: K, value: Prefs[K]) {
  prefs = { ...prefs, [key]: value };
  listeners.forEach((l) => l());
}

export function usePrefs() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => prefs,
    () => prefs,
  );
}
