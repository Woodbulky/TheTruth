import { z } from 'zod';
import { CheckResultSchema } from './schema';
import type { FixtureId } from './i18n';
import type { CheckResult, InputType, Lang, StageEvent } from './types';
import schemeForward from '@/fixtures/scheme-forward.json';
import healthTip from '@/fixtures/health-tip.json';
import oldNews from '@/fixtures/old-news.json';
import verifiedNews from '@/fixtures/verified-news.json';
import unclearForward from '@/fixtures/unclear-forward.json';

const LocSchema = z.object({
  overallSummary: z.string(), replyMessage: z.string(), spokenSummary: z.string().max(350),
  claims: z.array(z.object({ oneLine: z.string(), whatsRight: z.array(z.string()), whatsWrong: z.array(z.string()) })),
});
const FixtureSchema = CheckResultSchema.extend({
  match: z.array(z.string()),
  localized: z.object({ hi: LocSchema, mr: LocSchema }),
});
type Fixture = z.infer<typeof FixtureSchema>;

// Parsed at import: a bad fixture fails loudly in dev/build instead of rendering a bogus verdict.
const RESULTS: Record<Exclude<FixtureId, 'unclear-forward'>, Fixture> = {
  'scheme-forward': FixtureSchema.parse(schemeForward),
  'health-tip': FixtureSchema.parse(healthTip),
  'old-news': FixtureSchema.parse(oldNews),
  'verified-news': FixtureSchema.parse(verifiedNews),
};

export const FIXTURE_IDS: FixtureId[] = ['scheme-forward', 'health-tip', 'old-news', 'verified-news', 'unclear-forward'];

export const fixtureText = (id: FixtureId) =>
  id === 'unclear-forward' ? unclearForward.extractedText : RESULTS[id].extractedText;

/** Demo-mode stand-ins for uploads: each attachment type plays a matching fixture. */
export const ATTACH: Record<Exclude<InputType, 'text'>, { fixture: FixtureId; label?: string; sub?: string }> = {
  image: { fixture: 'old-news' },
  pdf: { fixture: 'scheme-forward', label: 'Sakhi_Card_notice.pdf', sub: '2' },
  audio: { fixture: 'health-tip', sub: '0:24' },
  url: { fixture: 'verified-news', label: 'Bank holidays: 2nd & 4th Saturday', sub: 'https://example.org/bank-holidays' },
};

/** Typed text in demo mode: keyword match to a fixture, else the "send me more" path. */
export function pickFixture(text: string): FixtureId {
  const t = text.toLowerCase();
  const hit = (Object.keys(RESULTS) as (keyof typeof RESULTS)[]).find((id) => RESULTS[id].match.some((m) => t.includes(m)));
  return hit ?? 'unclear-forward';
}

function localize(f: Fixture, lang: Lang, inputType: InputType): CheckResult {
  // CheckResultSchema strips the fixture-only keys (match, localized).
  const result: CheckResult = { ...CheckResultSchema.parse(f), inputType, outputLang: lang, checkedAt: new Date().toISOString() };
  if (lang === 'en') return result;
  const loc = f.localized[lang];
  return {
    ...result,
    overallSummary: loc.overallSummary, replyMessage: loc.replyMessage, spokenSummary: loc.spokenSummary,
    claims: result.claims.map((c, i) => ({ ...c, ...loc.claims[i] })),
  };
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const STEPS = [['extract', 600], ['claims', 900], ['search', 1500], ['judge', 1000], ['explain', 700]] as const;

/** Fake pipeline: same StageEvent stream the real /api/check will send. */
export async function* demoCheck(id: FixtureId, lang: Lang, inputType: InputType): AsyncGenerator<StageEvent> {
  for (const [stage, ms] of STEPS) {
    yield { stage, status: 'start' };
    await sleep(ms);
    if (id === 'unclear-forward' && stage === 'claims') {
      yield { stage: 'error', code: 'INSUFFICIENT_EVIDENCE', message: 'No checkable claim found' };
      return;
    }
    yield { stage, status: 'done' };
  }
  yield { stage: 'done', result: localize(RESULTS[id as keyof typeof RESULTS], lang, inputType) };
}
