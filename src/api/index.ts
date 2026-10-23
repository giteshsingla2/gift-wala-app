// App API. Each function matches an endpoint in docs/BACKEND.md.

import type { AppConfig, Giveaway, GiveawaysData, HomeData, Progress, Task, User, Winner, WinnersData, WinnersRange } from '@/types';
import { request } from './client';

export { ApiError } from './client';

export const login = (phone: string) => request<{ token: string; user: User; isNew: boolean }>('/auth/login', { method: 'POST', body: { phone } });

export const getMe = () => request<{ user: User; wallet: number }>('/me');

export const updateMe = (patch: Partial<Omit<User, 'id' | 'phone'>>) => request<{ user: User }>('/me', { method: 'PATCH', body: patch });

export const getMyWins = () => request<{ wins: Winner[]; wallet: number }>('/me/wins');

export const getConfig = () => request<AppConfig>('/config');

export const getHome = () => request<HomeData>('/home');

export const getGiveaways = (categoryId?: string) => request<GiveawaysData>(`/giveaways${categoryId ? `?category=${encodeURIComponent(categoryId)}` : ''}`);

export const getGiveaway = (id: string) => request<{ giveaway: Giveaway; winners: Winner[] }>(`/giveaways/${encodeURIComponent(id)}`);

export const getHaazri = () => request<{ giveaways: Giveaway[] }>('/haazri');

export const startHaazri = (giveawayId: string) =>
  request<{ attemptId: number; day: number; task: Task }>(`/giveaways/${encodeURIComponent(giveawayId)}/haazri/start`, { method: 'POST' });

export const completeHaazri = (giveawayId: string, attemptId: number, sharesOpened?: number) =>
  request<{ progress: Progress }>(`/giveaways/${encodeURIComponent(giveawayId)}/haazri/complete`, {
    method: 'POST',
    body: { attemptId, sharesOpened },
  });

export const getWinners = (range: WinnersRange) => request<WinnersData>(`/winners?range=${range}`);
