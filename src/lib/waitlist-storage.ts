// Bump WAITLIST_SCHEMA_VERSION whenever modal questions, option values,
// or final-screen copy change in a way that should invalidate saved
// progress and force returning visitors to see the updated flow.
export const WAITLIST_SCHEMA_VERSION = 2;

const KEY = 'waitlist:state';

export type WaitlistView = 'intro' | 'step2';

export interface WaitlistState {
  v: number;
  id: string;
  token: string;
  answers: Record<string, string>;
  cursor: number;
  complete: boolean;
  answered: number;
  total: number;
  lastView: WaitlistView;
  ts: number;
}

export function loadWaitlistState(): WaitlistState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<WaitlistState> | null;
    if (!parsed || parsed.v !== WAITLIST_SCHEMA_VERSION) {
      localStorage.removeItem(KEY);
      return null;
    }
    if (typeof parsed.id !== 'string' || typeof parsed.token !== 'string') return null;
    return {
      v: WAITLIST_SCHEMA_VERSION,
      id: parsed.id,
      token: parsed.token,
      answers: parsed.answers ?? {},
      cursor: typeof parsed.cursor === 'number' ? parsed.cursor : 0,
      complete: !!parsed.complete,
      answered: typeof parsed.answered === 'number' ? parsed.answered : 0,
      total: typeof parsed.total === 'number' ? parsed.total : 0,
      lastView: parsed.lastView === 'step2' ? 'step2' : 'intro',
      ts: typeof parsed.ts === 'number' ? parsed.ts : Date.now(),
    };
  } catch {
    return null;
  }
}

export function saveWaitlistState(patch: Partial<Omit<WaitlistState, 'v' | 'ts'>>): void {
  try {
    const prev = loadWaitlistState();
    const merged: WaitlistState = {
      v: WAITLIST_SCHEMA_VERSION,
      id: prev?.id ?? '',
      token: prev?.token ?? '',
      answers: prev?.answers ?? {},
      cursor: prev?.cursor ?? 0,
      complete: prev?.complete ?? false,
      answered: prev?.answered ?? 0,
      total: prev?.total ?? 0,
      lastView: prev?.lastView ?? 'intro',
      ts: Date.now(),
      ...patch,
    };
    if (!merged.id || !merged.token) return;
    localStorage.setItem(KEY, JSON.stringify(merged));
  } catch {}
}

export function clearWaitlistState(): void {
  try { localStorage.removeItem(KEY); } catch {}
}
