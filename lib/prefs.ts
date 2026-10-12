'use client';
import { useSyncExternalStore } from 'react';
import type { Lang } from './types';

// Tiny localStorage-backed store; the inline script in app/layout.tsx applies theme/lang before first paint.
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };
const emit = () => listeners.forEach((l) => l());

const read = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const write = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } };

const LANGS: Lang[] = ['en', 'hi', 'mr'];
const getLang = (): Lang => { const v = read('satya-lang') as Lang; return LANGS.includes(v) ? v : 'en'; };
export const useLang = () => useSyncExternalStore(subscribe, getLang, () => 'en' as Lang);
export function setLang(l: Lang) { write('satya-lang', l); document.documentElement.lang = l; emit(); }
export const nextLang = (l: Lang): Lang => LANGS[(LANGS.indexOf(l) + 1) % LANGS.length];

const isDark = () => document.documentElement.classList.contains('dark');
export const useDark = () => useSyncExternalStore(subscribe, isDark, () => false);
export function setDark(d: boolean) { document.documentElement.classList.toggle('dark', d); write('satya-theme', d ? 'dark' : 'light'); emit(); }
