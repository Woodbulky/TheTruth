import type { Tier } from './types';

// Path-scoped entries first: a fact-check section of a news site outranks the site itself.
const B_PATHS = ['thequint.com/news/webqoof', 'indiatoday.in/fact-check'];
const A = ['gov.in', 'nic.in', 'rbi.org.in', 'who.int', 'nih.gov', 'cdc.gov'];
const B = ['boomlive.in', 'altnews.in', 'factly.in', 'vishvasnews.com', 'newschecker.in', 'factcrescendo.com', 'newsmobile.in', 'factcheck.afp.com', 'politifact.com', 'factcheck.org'];
const C = ['thehindu.com', 'indianexpress.com', 'hindustantimes.com', 'livemint.com', 'ndtv.com', 'reuters.com', 'bbc.com', 'loksatta.com', 'lokmat.com',
  'indiatimes.com', 'business-standard.com', 'apnews.com', 'theguardian.com'];

/** Bare host ("ndtv.com"); the raw string if it isn't a URL (fixtures use "#"). */
export function hostOf(url: string) {
  try { return new URL(url).hostname.toLowerCase().replace(/^www\./, ''); } catch { return url; }
}
const under = (host: string, list: string[]) => list.some((d) => host === d || host.endsWith(`.${d}`));

/** A official, B fact-checker, C reputable news, D everything else (a lead, never decides a verdict). */
export function tierOf(url: string): Tier {
  let path: string;
  try { path = new URL(url).pathname.toLowerCase(); } catch { return 'D'; }
  const host = hostOf(url);
  if (B_PATHS.some((p) => `${host}${path}`.startsWith(p))) return 'B';
  if (under(host, A)) return 'A';
  if (under(host, B)) return 'B';
  if (under(host, C)) return 'C';
  return 'D';
}
