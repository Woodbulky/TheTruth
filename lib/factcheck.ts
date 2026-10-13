import 'server-only';
import { hostOf, tierOf } from './tiers';
import type { Evidence, Relation } from './types';

interface ClaimReview { publisher?: { name?: string; site?: string }; url?: string; title?: string; reviewDate?: string; textualRating?: string }
interface FcClaim { text?: string; claimant?: string; claimDate?: string; claimReview?: ClaimReview[] }

/** Map a free-text ClaimReview rating ("False", "Misleading", "Half True", …) to a relation. */
export function ratingRelation(rating = ''): Relation {
  const r = rating.toLowerCase();
  if (/partly|partially|half|mix|missing context|exaggerat|needs context/.test(r)) return 'NARROWS';
  if (/false|fake|mislead|incorrect|wrong|hoax|fabricat|scam|baseless|not true|untrue|doctored|edited|satire/.test(r)) return 'CONTRADICTS';
  if (/^(true|correct|accurate|mostly true)/.test(r)) return 'SUPPORTS';
  if (/old|outdated|recycled|dated/.test(r)) return 'SUPERSEDES';
  return 'NEUTRAL';
}

/** Google Fact Check Tools claims:search → Evidence (tier ≥ B, via factcheck_api). Empty on any failure. */
export async function factCheck(query: string, languageCode?: string): Promise<Evidence[]> {
  const key = process.env.GOOGLE_FACTCHECK_API_KEY;
  if (!key) return [];
  const qs = new URLSearchParams({ query, pageSize: '5', key });
  if (languageCode) qs.set('languageCode', languageCode);
  try {
    const res = await fetch(`https://factchecktools.googleapis.com/v1alpha1/claims:search?${qs}`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const { claims = [] } = (await res.json()) as { claims?: FcClaim[] };
    const now = new Date().toISOString();
    return claims.flatMap((c) =>
      (c.claimReview ?? []).filter((r) => r.url?.startsWith('http')).map((r) => ({
        id: '',
        publisher: r.publisher?.name || hostOf(r.url!),
        title: r.title || c.text || '',
        url: r.url!,
        publishedAt: r.reviewDate?.slice(0, 10),
        retrievedAt: now,
        excerpt: `Claim reviewed: “${c.text ?? ''}”${c.claimant ? ` (${c.claimant})` : ''}. Rating: ${r.textualRating ?? 'n/a'}.`,
        relation: ratingRelation(r.textualRating),
        tier: tierOf(r.url!) === 'A' ? 'A' : 'B',
        via: 'factcheck_api' as const,
      })),
    );
  } catch {
    return [];
  }
}
