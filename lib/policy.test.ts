import { describe, expect, it } from 'vitest';
import { decide, newNumbers, overall } from './policy';
import { tierOf } from './tiers';
import type { Evidence, Relation, Tier, Verdict } from './types';
import schemeForward from '../fixtures/scheme-forward.json';
import healthTip from '../fixtures/health-tip.json';
import oldNews from '../fixtures/old-news.json';
import verifiedNews from '../fixtures/verified-news.json';

const ev = (relation: Relation, tier: Tier, url = 'https://pib.gov.in/x', publishedAt?: string) => ({ relation, tier, url, publishedAt });

describe('decide()', () => {
  it('1 · no usable evidence → null', () => {
    expect(decide([])).toBeNull();
    expect(decide([ev('SUPPORTS', 'D'), ev('NEUTRAL', 'A')])).toBeNull();
  });

  it('2 · A/B supports and A/B contradicts → null', () => {
    expect(decide([ev('SUPPORTS', 'A'), ev('CONTRADICTS', 'B')])).toBeNull();
  });

  it('3 · later SUPERSEDES → OUTDATED', () => {
    expect(decide([ev('SUPPORTS', 'C', 'https://ndtv.com/a', '2024-07-18'), ev('SUPERSEDES', 'A', 'https://x.gov.in', '2026-10-10')])).toBe('OUTDATED');
    expect(decide([ev('SUPERSEDES', 'C')])).toBe('OUTDATED'); // no supporting evidence at all
    // an older "supersedes" doesn't beat newer support
    expect(decide([ev('SUPPORTS', 'A', 'https://x.gov.in', '2026-10-10'), ev('SUPERSEDES', 'C', 'https://ndtv.com/a', '2024-01-01')])).toBe('VERIFIED');
    // SUPERSEDES from a weak source never decides
    expect(decide([ev('SUPERSEDES', 'D')])).toBeNull();
  });

  it('4 · A/B CONTRADICTS → FALSE; C alone does not', () => {
    expect(decide([ev('CONTRADICTS', 'B')])).toBe('FALSE');
    expect(decide([ev('CONTRADICTS', 'C')])).toBeNull();
  });

  it('5 · NARROWS, or support with whatsWrong → PARTLY_SUPPORTED', () => {
    expect(decide([ev('NARROWS', 'C')])).toBe('PARTLY_SUPPORTED');
    expect(decide([ev('SUPPORTS', 'A')], ['amount is wrong'])).toBe('PARTLY_SUPPORTED');
  });

  it('6 · VERIFIED needs one A/B or two C from different domains', () => {
    expect(decide([ev('SUPPORTS', 'B')])).toBe('VERIFIED');
    expect(decide([ev('SUPPORTS', 'C', 'https://ndtv.com/a')])).toBeNull();
    expect(decide([ev('SUPPORTS', 'C', 'https://ndtv.com/a'), ev('SUPPORTS', 'C', 'https://www.ndtv.com/b')])).toBeNull();
    expect(decide([ev('SUPPORTS', 'C', 'https://ndtv.com/a'), ev('SUPPORTS', 'C', 'https://thehindu.com/b')])).toBe('VERIFIED');
  });

  it('fixtures: every demo claim follows the policy', () => {
    for (const f of [schemeForward, healthTip, oldNews, verifiedNews]) {
      for (const c of f.claims) expect(decide(c.evidence as Evidence[], c.whatsWrong), `${f.id}/${c.id}`).toBe(c.verdict);
      expect(overall(f.claims.map((c) => c.verdict as Verdict), 0)).toBe(f.overall);
    }
  });
});

describe('overall()', () => {
  it('most severe wins, capped when claims were dropped', () => {
    expect(overall([], 0)).toBeNull();
    expect(overall(['VERIFIED', 'OUTDATED', 'PARTLY_SUPPORTED'], 0)).toBe('OUTDATED');
    expect(overall(['VERIFIED', 'FALSE'], 0)).toBe('FALSE');
    expect(overall(['VERIFIED'], 0)).toBe('VERIFIED');
    expect(overall(['VERIFIED'], 1)).toBe('PARTLY_SUPPORTED');
  });
});

describe('tierOf()', () => {
  it('maps domains to tiers', () => {
    expect(tierOf('https://pib.gov.in/PressRelease')).toBe('A');
    expect(tierOf('https://indiacode.nic.in/x')).toBe('A');
    expect(tierOf('https://www.who.int/news')).toBe('A');
    expect(tierOf('https://www.boomlive.in/fact-check/x')).toBe('B');
    expect(tierOf('https://www.thequint.com/news/webqoof/x')).toBe('B');
    expect(tierOf('https://www.thequint.com/news/politics/x')).toBe('D');
    expect(tierOf('https://www.indiatoday.in/fact-check/story/x')).toBe('B');
    expect(tierOf('https://www.ndtv.com/india-news/x')).toBe('C');
    expect(tierOf('https://notgov.in.evil.com/')).toBe('D');
    expect(tierOf('#')).toBe('D');
  });
});

describe('newNumbers()', () => {
  it('flags numbers missing from the allowed facts', () => {
    expect(newNumbers('Scheme ended on 31 March 2025', 'The scheme ended on 31 March 2025.')).toEqual([]);
    expect(newNumbers('₹5,000 per month', 'Rs 5000 a month')).toEqual([]);
    expect(newNumbers('योजना २०२५ में बंद हुई', 'The scheme closed in 2025')).toEqual([]);
    expect(newNumbers('Gargling does not cure COVID-19', 'Gargling does not kill the coronavirus')).toEqual([]);
    expect(newNumbers('Closed for 10 days in 2024', 'Closed in 2024')).toEqual(['10']);
  });
});
