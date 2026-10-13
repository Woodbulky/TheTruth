import 'server-only';
import Groq, { RateLimitError } from 'groq-sdk';
import type { ChatCompletionCreateParamsNonStreaming, ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions';
import { z } from 'zod';

// Checked against https://api.groq.com/openai/v1/models on 2026-10-13.
// groq/compound* were shut down 2026-09-21 → web search uses gpt-oss's built-in browser_search.
// llama-4-scout was shut down 2026-07-17 → vision uses qwen3.8 (multimodal).
export const JSON_MODEL = 'openai/gpt-oss-120b';
export const SEARCH_MODEL = 'openai/gpt-oss-120b';
export const VISION_MODEL = 'qwen/qwen3.8-27b';

// GROQ_API_KEY may hold several comma-separated keys; a 429 on one rotates to the next.
const keys = [...new Set((process.env.GROQ_API_KEY ?? '').split(',').map((k) => k.trim()).filter(Boolean))];
const clients = keys.map((apiKey) => new Groq({ apiKey, maxRetries: 0, timeout: 30_000 }));
let next = 0;

export const llmConfigured = () => clients.length > 0;

async function complete(params: ChatCompletionCreateParamsNonStreaming) {
  if (!clients.length) throw new Error('GROQ_API_KEY is not set');
  for (let round = 0; round < 2; round++) {
    let wait = 0;
    for (let i = 0; i < clients.length; i++) {
      const client = clients[next++ % clients.length];
      try {
        return await client.chat.completions.create(params);
      } catch (e) {
        if (!(e instanceof RateLimitError)) throw e;
        wait = Math.max(wait, Number(e.headers?.get('retry-after')) || 2);
      }
    }
    if (round === 0) await new Promise((r) => setTimeout(r, Math.min(wait, 8) * 1000)); // every key is rate-limited: back off once
  }
  throw new Error('Groq rate limit on every key');
}

/** Structured call: json_schema from the zod schema, validated with zod, one retry on invalid output. */
export async function json<T>(schema: z.ZodType<T>, name: string, messages: ChatCompletionMessageParam[], effort: 'low' | 'medium' = 'low'): Promise<T> {
  let last: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await complete({
      model: JSON_MODEL,
      messages,
      reasoning_effort: effort,
      response_format: { type: 'json_schema', json_schema: { name, schema: z.toJSONSchema(schema) as Record<string, unknown> } },
    });
    try {
      return schema.parse(JSON.parse(res.choices[0]?.message.content ?? ''));
    } catch (e) {
      last = e;
    }
  }
  throw last;
}

export interface SearchHit { url: string; title: string; content: string }

/**
 * Web search via browser_search. Hits come ONLY from executed_tools: result lists from
 * `browser.search`, page text from `browser.open`. The model's prose (and any URL in it) is ignored.
 */
export async function search(prompt: string): Promise<SearchHit[]> {
  const res = await complete({
    model: SEARCH_MODEL,
    messages: [{ role: 'user', content: prompt }],
    tools: [{ type: 'browser_search' }],
    tool_choice: 'required',
    reasoning_effort: 'low',
  });
  const hits = new Map<string, SearchHit>();
  for (const t of res.choices[0]?.message.executed_tools ?? []) {
    const opened = (t as { name?: string }).name === 'browser.open'; // `name` is sent but missing from the SDK types
    for (const r of t.search_results?.results ?? []) {
      if (!r.url || !/^https?:\/\//.test(r.url)) continue;
      const hit = hits.get(r.url) ?? { url: r.url, title: '', content: '' };
      if (opened) hit.content ||= cleanPage(r.content ?? '');
      else hit.title ||= r.title ?? '';
      hits.set(r.url, hit);
    }
  }
  return [...hits.values()];
}

// browser.open returns "L12: text" lines; drop the line prefixes and the leading URL header.
const cleanPage = (s: string) =>
  s.replace(/^L\d+: ?/gm, '').replace(/^\s*URL:\s*\n?\S+\n/, '').replace(/\n{3,}/g, '\n\n').trim();

/** Transcribe a screenshot/photo (data: URL) to plain text. */
export async function vision(dataUrl: string): Promise<string> {
  const res = await complete({
    model: VISION_MODEL,
    reasoning_effort: 'none',
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: 'Transcribe ALL text in this image exactly as written, keeping its language and line breaks. Output only the text. If the image has no text, describe in one sentence what it claims to show.' },
        { type: 'image_url', image_url: { url: dataUrl } },
      ],
    }],
  });
  return res.choices[0]?.message.content?.trim() ?? '';
}
