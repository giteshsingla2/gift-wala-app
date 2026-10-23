import * as SecureStore from 'expo-secure-store';
import { useSyncExternalStore } from 'react';
import { Platform } from 'react-native';

import * as api from '@/api';
import { setAuthToken, setUnauthorizedHandler } from '@/api/client';
import { applyReminder } from '@/lib/reminders';
import type { AppConfig, User } from '@/types';

// Login session and app-wide config. The token is kept in the phone's secure storage.

type Session = {
  ready: boolean;
  token: string | null;
  user: User | null;
  wallet: number;
  config: AppConfig | null;
};

const TOKEN_KEY = 'giftwala.token';
let state: Session = { ready: false, token: null, user: null, wallet: 0, config: null };
const listeners = new Set<() => void>();

function set(patch: Partial<Session>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

const storage = {
  get: () => (Platform.OS === 'web' ? Promise.resolve(globalThis.localStorage?.getItem(TOKEN_KEY) ?? null) : SecureStore.getItemAsync(TOKEN_KEY)),
  set: (v: string) => (Platform.OS === 'web' ? Promise.resolve(globalThis.localStorage?.setItem(TOKEN_KEY, v)) : SecureStore.setItemAsync(TOKEN_KEY, v)),
  clear: () => (Platform.OS === 'web' ? Promise.resolve(globalThis.localStorage?.removeItem(TOKEN_KEY)) : SecureStore.deleteItemAsync(TOKEN_KEY)),
};

setUnauthorizedHandler(() => {
  if (state.token) void logout();
});

/** Loads the saved login and the app config. Safe to call more than once. */
export async function initSession() {
  const [token, config] = await Promise.all([storage.get().catch(() => null), api.getConfig().catch(() => null)]);
  setAuthToken(token);
  set({ token, config: config ?? state.config });
  if (token) await refreshMe().catch(() => {});
  set({ ready: true });
}

export async function refreshConfig() {
  const config = await api.getConfig();
  set({ config });
  return config;
}

export async function refreshMe() {
  const { user, wallet } = await api.getMe();
  set({ user, wallet });
  return user;
}

export async function loginWithPhone(phone: string) {
  const { token, user } = await api.login(phone);
  await storage.set(token);
  setAuthToken(token);
  set({ token, user });
  await applyReminder(user.reminderEnabled, user.reminderTime).catch(() => {});
  return user;
}

export async function saveProfile(patch: Parameters<typeof api.updateMe>[0]) {
  const { user } = await api.updateMe(patch);
  set({ user });
  return user;
}

export function setWallet(wallet: number) {
  if (wallet !== state.wallet) set({ wallet });
}

export async function logout() {
  await storage.clear().catch(() => {});
  setAuthToken(null);
  set({ token: null, user: null, wallet: 0 });
  await applyReminder(false, '09:00').catch(() => {});
}

export function useSession() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
    () => state,
  );
}
