import { fromImage, fromPdf } from '@/lib/extract';

export const maxDuration = 60;

const MAX_IMAGE = 4 * 1024 * 1024; // Groq base64 image limit; the browser downscales before upload
const MAX_PDF = 10 * 1024 * 1024;

/** POST multipart `file` (image or PDF) → { text, pages? } for the editable "Lumi read this" bubble. */
export async function POST(req: Request) {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'false') return Response.json({ error: 'Demo mode' }, { status: 403 });
  const file = (await req.formData().catch(() => null))?.get('file');
  if (!(file instanceof File)) return Response.json({ error: 'No file' }, { status: 400 });
  const bytes = Buffer.from(await file.arrayBuffer());
  try {
    if (/^image\/(jpeg|png|webp|gif)$/.test(file.type) && bytes.length <= MAX_IMAGE) {
      return Response.json({ text: await fromImage(bytes, file.type) });
    }
    if (file.type === 'application/pdf' && bytes.length <= MAX_PDF) {
      return Response.json(await fromPdf(bytes));
    }
    return Response.json({ error: 'Unsupported file' }, { status: 415 });
  } catch (e) {
    console.error('[extract]', e);
    return Response.json({ error: 'Could not read file' }, { status: 422 });
  }
}
