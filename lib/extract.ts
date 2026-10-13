import 'server-only';
import { extractText } from 'unpdf';
import { vision } from './llm';
import { safeFetch } from './ssrf';

export const MAX_TEXT = 8000;
const clip = (s: string) => s.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim().slice(0, MAX_TEXT);

export async function fromImage(bytes: Buffer, mime: string) {
  return clip(await vision(`data:${mime};base64,${bytes.toString('base64')}`));
}

export async function fromPdf(bytes: Uint8Array) {
  const { totalPages, text } = await extractText(new Uint8Array(bytes));
  return { pages: totalPages, text: clip(text.map((t, i) => `[Page ${i + 1}]\n${t}`).join('\n\n')) };
}

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const decode = (s: string) => s
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&(\w+);/g, (m, e: string) => ENTITIES[e.toLowerCase()] ?? m);
const meta = (html: string, name: string) =>
  html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${name}["'][^>]*content=["']([^"']*)`, 'i'))?.[1];

/**
 * Readable text from an HTML page: title + description + paragraph/heading text of <article> (or <body>).
 * ponytail: regex readability, no DOM. Swap in @mozilla/readability + linkedom if pages come out noisy.
 */
export function htmlToText(html: string) {
  const title = meta(html, 'og:title') ?? html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '';
  const desc = meta(html, 'og:description') ?? meta(html, 'description') ?? '';
  const date = meta(html, 'article:published_time') ?? '';
  const main = (html.match(/<article[\s\S]*?<\/article>/i) ?? html.match(/<body[\s\S]*<\/body>/i) ?? [html])[0]
    .replace(/<(script|style|noscript|nav|header|footer|aside|form|svg)[\s\S]*?<\/\1>/gi, ' ');
  const blocks = [...main.matchAll(/<(p|h[1-3]|li|blockquote)[^>]*>([\s\S]*?)<\/\1>/gi)]
    .map((m) => decode(m[2].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim())
    .filter((t) => t.length > 30);
  return [decode(title).trim(), date && `Published: ${date.slice(0, 10)}`, decode(desc).trim(), ...blocks].filter(Boolean).join('\n\n');
}

export async function fromUrl(url: string) {
  const res = await safeFetch(url);
  if (res.type.includes('pdf')) return (await fromPdf(res.bytes)).text;
  if (!/html|text\/plain/.test(res.type)) throw new Error(`Unsupported content type ${res.type}`);
  const body = res.bytes.toString('utf8');
  return clip(res.type.includes('html') ? htmlToText(body) : body);
}
