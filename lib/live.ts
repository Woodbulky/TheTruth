import type { InputType, Lang, StageEvent } from './types';

/** NEXT_PUBLIC_DEMO_MODE=false switches typed text and uploads to the real pipeline. Demo chips always use fixtures. */
export const LIVE = process.env.NEXT_PUBLIC_DEMO_MODE === 'false';

const unavailable: StageEvent = { stage: 'error', code: 'RETRIEVAL_UNAVAILABLE', message: 'Could not reach /api/check' };

/** POST /api/check and yield its SSE StageEvents. Always ends with `done` or `error`. */
export async function* liveCheck(body: { inputType: InputType; lang: Lang; text?: string; url?: string }): AsyncGenerator<StageEvent> {
  const res = await fetch('/api/check', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }).catch(() => null);
  if (!res?.ok || !res.body) return yield unavailable;
  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let buf = '';
  try {
    for (let r = await reader.read(); !r.done; r = await reader.read()) {
      buf += r.value;
      for (let i = buf.indexOf('\n\n'); i >= 0; i = buf.indexOf('\n\n')) {
        const line = buf.slice(0, i);
        buf = buf.slice(i + 2);
        if (!line.startsWith('data: ')) continue;
        const ev = JSON.parse(line.slice(6)) as StageEvent;
        yield ev;
        if (ev.stage === 'done' || ev.stage === 'error') return;
      }
    }
  } catch { /* connection dropped */ }
  yield unavailable;
}

/** Shrink photos/screenshots to ≤2048px JPEG before upload (vision model limit + mobile data). */
async function downscale(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const s = Math.min(1, 2048 / Math.max(bmp.width, bmp.height));
  const canvas = new OffscreenCanvas(Math.round(bmp.width * s), Math.round(bmp.height * s));
  canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return canvas.convertToBlob({ type: 'image/jpeg', quality: 0.85 });
}

/** Image/PDF → text via /api/extract, for the editable "Lumi read this" bubble. */
export async function extractFile(file: File): Promise<{ text: string; pages?: number }> {
  const form = new FormData();
  form.append('file', file.type.startsWith('image/') ? await downscale(file) : file, file.name);
  const res = await fetch('/api/extract', { method: 'POST', body: form });
  if (!res.ok) throw new Error(`extract ${res.status}`);
  return res.json();
}
