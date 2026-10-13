import { z } from 'zod';
import { runCheck } from '@/lib/pipeline';
import { MAX_TEXT } from '@/lib/extract';

export const maxDuration = 60;

const Body = z.object({
  inputType: z.enum(['text', 'image', 'audio', 'pdf', 'url']),
  lang: z.enum(['en', 'hi', 'mr']).default('en'),
  text: z.string().max(MAX_TEXT * 2).optional(),
  url: z.url({ protocol: /^https?$/ }).optional(),
}).refine((b) => b.text?.trim() || b.url, 'text or url required');

/** POST → text/event-stream of StageEvents, ending with `done` (CheckResult) or `error`. */
export async function POST(req: Request) {
  const body = Body.safeParse(await req.json().catch(() => null));
  if (!body.success) return Response.json({ error: 'Bad request' }, { status: 400 });
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'false') return Response.json({ error: 'Demo mode: live checks are off' }, { status: 403 });

  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(c) {
      for await (const ev of runCheck(body.data)) {
        if (req.signal.aborted) break;
        c.enqueue(enc.encode(`data: ${JSON.stringify(ev)}\n\n`));
      }
      c.close();
    },
  });
  return new Response(stream, { headers: { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache, no-transform' } });
}
