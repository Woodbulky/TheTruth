import 'server-only';
import { createHash } from 'node:crypto';
import type { CheckResult, Lang } from './types';

// ponytail: per-instance Map, lost on cold start; move to Upstash/Vercel KV if seen-counts must survive deploys.
const results = new Map<string, CheckResult>();
const seen = new Map<string, number>();
const MAX = 500;

/** Same forward with different spacing, case, emoji or punctuation → same fingerprint. */
export const fingerprint = (text: string) =>
  createHash('sha256').update(text.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()).digest('hex');

/** Count one more check of this forward; returns the new total. */
export function bumpSeen(fp: string) {
  const n = (seen.get(fp) ?? 0) + 1;
  seen.set(fp, n);
  return n;
}

export const getCached = (fp: string, lang: Lang) => results.get(`${fp}:${lang}`);

export function putCached(fp: string, lang: Lang, r: CheckResult) {
  if (results.size >= MAX) results.delete(results.keys().next().value!); // drop oldest
  results.set(`${fp}:${lang}`, r);
}
