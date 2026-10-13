import { hostOf } from './tiers';
import type { Evidence, Verdict } from './types';

export const POLICY_VERSION = '1.0';

type Ev = Pick<Evidence, 'relation' | 'tier' | 'url' | 'publishedAt'>;

const strong = (e: Ev) => e.tier === 'A' || e.tier === 'B';
const time = (d?: string) => (d ? Date.parse(d) || undefined : undefined);

/**
 * Deterministic verdict for one claim (CLAUDE.md "Verdict policy").
 * `null` = unresolved: the claim is dropped and never shown.
 */
export function decide(evidence: Ev[], whatsWrong: string[] = []): Verdict | null {
  const usable = evidence.filter((e) => e.relation !== 'NEUTRAL' && e.tier !== 'D');
  if (!usable.length) return null; // 1

  const supports = usable.filter((e) => e.relation === 'SUPPORTS');
  const strongContra = usable.some((e) => strong(e) && e.relation === 'CONTRADICTS');
  if (strongContra && supports.some(strong)) return null; // 2: reliable sources disagree

  const supportTimes = supports.map((e) => time(e.publishedAt)).filter((t) => t !== undefined);
  const latestSupport = supportTimes.length ? Math.max(...supportTimes) : undefined;
  const outdated = usable.some((e) => {
    if (e.relation !== 'SUPERSEDES') return false;
    if (!supports.length) return true;
    const t = time(e.publishedAt);
    return t !== undefined && (latestSupport === undefined || t > latestSupport);
  });
  if (outdated) return 'OUTDATED'; // 3

  if (strongContra) return 'FALSE'; // 4

  if (usable.some((e) => e.relation === 'NARROWS') || (supports.length && whatsWrong.length)) return 'PARTLY_SUPPORTED'; // 5

  const cDomains = new Set(supports.filter((e) => e.tier === 'C').map((e) => hostOf(e.url)));
  if (supports.some(strong) || cDomains.size >= 2) return 'VERIFIED'; // 6
  return null;
}

const SEVERITY: Verdict[] = ['FALSE', 'OUTDATED', 'PARTLY_SUPPORTED', 'VERIFIED'];

/** Most severe claim wins; a forward is never "Verified" while some of its claims went unchecked. */
export function overall(verdicts: Verdict[], dropped: number): Verdict | null {
  if (!verdicts.length) return null;
  const worst = SEVERITY.find((v) => verdicts.includes(v))!;
  return dropped && worst === 'VERIFIED' ? 'PARTLY_SUPPORTED' : worst;
}

const DEVANAGARI = '०१२३४५६७८९';
/** Numbers in `text` that don't appear in `allowed` (Devanagari digits and 1,00,000-style commas normalised; "COVID-19"-style names ignored). */
export function newNumbers(text: string, allowed: string) {
  const nums = (s: string) =>
    (s.replace(/[०-९]/g, (d) => String(DEVANAGARI.indexOf(d))).match(/(?<![\p{L}\d])(?<!\p{L}[-‑‐])\d[\d,]*(?:\.\d+)?/gu) ?? []).map((n) => n.replace(/,/g, ''));
  const ok = new Set(nums(allowed));
  return nums(text).filter((n) => !ok.has(n));
}
