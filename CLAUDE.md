# The Truth — "Forward it to Lumi before you forward it to family"

Hack On Track 2026 · PS3 "Is This Forward True" · Domain: GenAI
Team: Harsh Kasliwal, Kashish Mathur, Kartik Kokate

The Truth is a WhatsApp-styled fact-checking chat. The user forwards/pastes/uploads a message
(text, screenshot, voice note, PDF, URL) to **Lumi**, our female fact-checking assistant. Lumi splits it
into claims, finds dated evidence, and replies with a verdict card per claim, sources, a
simple explanation in EN/HI/MR, a "listen" button, and a ready-to-paste polite reply for the
family group. Users can also **call Lumi** (ElevenLabs Agent) and talk to her.
A public **landing page** (`/`) introduces The Truth and Lumi; the chat lives at `/chat`.

## Build status (see PROMPTS.md for the phase prompts)

| Phase | Status |
|---|---|
| 1 · Chat shell on demo fixtures | ✅ Done |
| 2 · Lumi illustrated avatar + `/demo` screenshot gallery | ✅ Done |
| 3 · Landing page | ✅ Built early (all sections, EN/HI/MR, live demo phone). OG *image* still TODO (OG text metadata is set) |
| 4 · Real verification pipeline | ✅ Done (live when `NEXT_PUBLIC_DEMO_MODE=false`; audio still on the demo fixture) |
| 5 · ElevenLabs voice | ⏭ Next |
| 6–7 · Call Lumi, hardening | ⏳ |

Decisions on 2026-10-12: **light theme is the default** (dark is opt-in, never follows the OS);
the landing page was pulled forward from Phase 3.

---

## Golden rules (never break these)

1. **Evidence before verdict.** Every verdict must trace to evidence items shown in the UI. If nothing can be resolved, Lumi gives **no verdict** and asks for more (see "No low-confidence output").
2. **Exactly four verdicts:** `VERIFIED | FALSE | OUTDATED | PARTLY_SUPPORTED`. Zod schema rejects anything else.
   There is no "can't confirm" / low-confidence verdict anywhere in the product.
3. **Verdict policy is code, not prompt.** The LLM proposes evidence relations; `lib/policy.ts` decides the label deterministically.
4. **No hallucinated sources.** Any URL not returned by a search/fact-check tool call is dropped before reaching the UI.
5. **Explanations, reply messages, TTS audio and Lumi's speech use only `rationaleFacts`.** No new facts.
6. **Secrets server-side only.** ElevenLabs/LLM keys live in Next.js route handlers. The agent connects via signed URL.
7. **Demo mode always works offline** from `/fixtures`. Demo results show a visible `DEMO DATA` badge.
8. **WhatsApp-inspired, not WhatsApp.** Use the palette/feel only. Never use the WhatsApp name, logo, or their wallpaper doodles.
9. **Additive changes only.** Don't rewrite working components; extend them. Don't change `lib/types.ts` without being asked.
10. Mobile-first (360–430px). Chat/call on desktop show a centered phone column + side info panel; the landing page is full-width responsive.
11. **Default language is English** (UI, outputLang, TTS voice, agent). HI/MR are opt-in via the language pill.
12. **Default theme is light.** Dark mode is opt-in (chat menu / landing nav toggle) and saved; it does not follow the OS setting.

---

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion + lucide-react + zod
- `@elevenlabs/react` (agent in browser), `@elevenlabs/elevenlabs-js` (server: TTS + Scribe)
- LLM: **Groq** via `groq-sdk`, behind the provider adapter in `lib/llm.ts` (swappable). Check current
  model ids at https://console.groq.com/docs/models before coding; keep them as constants in `lib/llm.ts`:
  - **JSON tasks** (claims, judge, explain): a model that supports `response_format: json_schema`
    (e.g. `openai/gpt-oss-120b`), output validated with zod, one retry on invalid JSON.
  - **Web search**: `openai/gpt-oss-120b` with Groq's built-in `browser_search` tool (`groq/compound*` were shut down
    2026-09-21). Evidence comes ONLY from `executed_tools` (`browser.search` result lists + `browser.open` page text),
    never from the model's prose.
  - **Vision** (screenshot transcription): `qwen/qwen3.8-27b` (multimodal; llama-4-scout was shut down 2026-07-17).
    The browser downscales to ≤2048px JPEG before upload.
  - `GROQ_API_KEY` may hold several comma-separated keys; a 429 rotates to the next key, then backs off once.
  - Free-tier rate limits are tight: run per-claim calls with small concurrency and back off on 429.
- Google Fact Check Tools API (ClaimReview search) for known viral forwards
- Cache: in-memory Map + `fixtures/` (upgrade to Upstash/Vercel KV only if needed)
- Deploy: Vercel. Set `export const maxDuration = 60` on long routes.

---

## Design tokens (WhatsApp-inspired + Lumi accents)

```ts
// tailwind.config.ts -> theme.extend.colors
truth: {
  header:   '#008069', // light header
  accent:   '#00A884', // primary buttons, links, online dot
  green:    '#25D366', // highlights
  bg:       '#EFEAE2', // chat background (light)
  out:      '#D9FDD3', // user bubble (light)
  in:       '#FFFFFF', // Lumi bubble (light)
  text:     '#111B21',
  muted:    '#667781',
  tick:     '#53BDEB',
  // dark
  dbg:      '#0B141A',
  dpanel:   '#202C33',
  dout:     '#005C4B',
  din:      '#202C33',
  dtext:    '#E9EDEF',
  dmuted:   '#8696A0',
  // our twist
  lumi:     '#FFD166', // Lumi glow / halo
  lumiDeep: '#06D6A0',
}
```

- Font: system stack (`ui-sans-serif, -apple-system, "Segoe UI", Roboto, "Noto Sans Devanagari", sans-serif`).
- Chat wallpaper: ORIGINAL subtle SVG pattern (tiny magnifier, check, clock, quote glyphs at 6% opacity). Generate it ourselves.
- Dark mode via `class` strategy, toggle in chat menu + landing nav, default = **light** (OS preference is ignored).
- Bubbles: 7.5px radius, tail on first bubble of a group, timestamp + ticks bottom-right.

### Verdict system (colour is never the only signal: icon + label + text always)

| Verdict | Colour | Icon (lucide) | EN label | HI label | MR label |
|---|---|---|---|---|---|
| VERIFIED | `#1FA855` | `BadgeCheck` | Verified | सही है | खरे आहे |
| FALSE | `#E5484D` | `XOctagon` | False | गलत है | खोटे आहे |
| OUTDATED | `#8B5CF6` | `History` | Outdated | पुरानी जानकारी | जुनी माहिती |
| PARTLY_SUPPORTED | `#F59E0B` | `CircleDashed` | Partly true | आंशिक रूप से सही | अंशतः खरे |

(Team to proof-read HI/MR strings.)

### No low-confidence output

Lumi never shows "I don't understand" or a low-confidence verdict. When the pipeline cannot resolve
any claim (unreadable input, no checkable claim, or no reliable evidence), it emits
`{ stage: 'error', code: 'INSUFFICIENT_EVIDENCE' }` and Lumi replies with a friendly **"send me more"**
bubble (no verdict card): ask for the full forwarded message, a clearer screenshot, or the link/source it came
from, with quick-action chips. Phrase it as a request, not as a failure.

---

## Lumi — the fact-checking assistant

Lumi is a **female assistant character**: an original illustrated young Indian woman (mid-20s look),
friendly, calm and professional. She must NOT resemble any real person, celebrity, or existing
mascot/brand assistant. Flat-vector illustration style, head-and-shoulders bust framed in a circle.

Look:
- Warm medium-brown skin, dark hair in a loose side braid, big friendly eyes, small expressive mouth.
- Teal top (`#00A884`) with a mint (`#06D6A0`) collar/dupatta accent; small gold earrings.
- Light single-ear headset with a mic boom (she's an assistant you can call).
- A small gold **spark hairclip** (`#FFD166`) — "Lumi = light on the facts".
- A warm gold **halo ring** (`#FFD166`) around the avatar circle; its colour/brightness carries state.
- Modest and respectful; no costume stereotypes; never sexualized.

Pure SVG + Framer Motion, built as separate layer groups so each part animates on its own:
`shoulders · neck · hair-back · head · eyes · brows · mouth · hair-front · headset · spark · halo`.
(If the team later commissions a nicer illustration, keep these same layer ids.) One component:

```tsx
<Lumi
  state="idle" | "listening" | "thinking" | "speaking" | "reacting"
  mood?: Verdict           // used when state === "reacting"
  volume?: number          // 0..1, drives mouth + halo when speaking/listening
  size?: number            // 36 header, 96 empty state, 220 call screen, ~360 landing hero
/>
```

Behaviour:
- **idle:** gentle breathing (y ±2px, 4s), random blink every 3–6s, braid sways slightly, spark twinkles.
- **listening:** head tilts slightly toward the headset mic, eyes look slightly up, halo pulses scaled by mic `volume`.
- **thinking:** eyes glance left↔right, 3 dots float beside her head, spark spins.
- **speaking:** mouth openness = `volume` (smoothed, lerp 0.3), small brow lift on peaks; halo brightness follows.
- **reacting(mood):** VERIFIED = smile + happy arc eyes + green halo flash; FALSE = concerned brows + slight
  head shake + red halo; OUTDATED = glances at a small clock glyph that pops beside her + violet halo;
  PARTLY = head tilt + half smile + amber.
- **asking** (used with the "send me more" bubble): friendly raised brows + small nod, gold halo. This is `state="idle"` + a
  one-off nod, not a mood.
- Respect `prefers-reduced-motion` (no breathing/sway/dots/head motion; keep blink + mouth).
- At 36px only the face + halo need to read clearly; drop fine detail (earrings, headset boom) below 48px.
- Header avatar has a green online dot; status text: `online` / `checking sources…` / `speaking…`.
- `alt`/`aria-label`: "Lumi, The Truth's fact-checking assistant".

---

## Landing page (`/`)

Full-width, responsive marketing page in the same tokens (light + dark). Not a phone column.
Copy comes from `lib/i18n.ts` and follows the EN/हिं/मरा switch. No WhatsApp name/logo here either.

1. **Nav:** The Truth wordmark · How it works · Verdicts · Languages · language pill · "Chat with Lumi" button.
2. **Hero:** headline "Forward it to Lumi before you forward it to family", one-line subhead,
   CTAs **Chat with Lumi** (`/chat`) and **Call Lumi** (`/call`). Large Lumi (idle, ~360px) beside a
   phone frame running a looping live demo built from the real chat components + a fixture
   (forward bubble → StageBubble → VerdictCard). No static screenshots.
3. **What you can forward:** text · screenshot · voice note · PDF · link (icon cards).
4. **How Lumi checks:** 5 steps — Read → Find claims → Search → Judge → Explain.
5. **Verdicts:** the four VerdictChips with EN/HI/MR labels; Lumi reacts with each mood as the section scrolls into view.
6. **Why trust it:** evidence before verdict · no invented sources · rules decide the verdict, not AI ·
   polite replies, no shaming.
7. **Footer:** Hack On Track 2026 · PS3 · team names · disclaimer "Lumi can be wrong. For health, legal or
   money matters, confirm with an official source or professional."
- Reduced motion respected; everything keyboard-reachable; works with `NEXT_PUBLIC_DEMO_MODE=true` offline.

---

## Folder structure

```
app/
  page.tsx                 # Landing page (Nav, Hero, ForwardTypes, Steps, VerdictShowcase, Languages, TrustGrid, CtaBand, Footer)
  chat/page.tsx            # Chat with Lumi (main app screen)
  call/page.tsx            # Voice call with Lumi (ElevenLabs Agent)
  demo/page.tsx            # Screenshot gallery for PPT (all states in phone frames) + Lumi playground
  demo/Gallery.tsx         # frames + html-to-image "Download PNG"
  api/check/route.ts       # POST -> SSE stream of StageEvents, ends with CheckResult
  api/tts/route.ts         # POST {text, lang} -> audio/mpeg (cached)
  api/transcribe/route.ts  # POST multipart audio -> {text, language, words}
  api/lumi/signed-url/route.ts  # GET -> {signedUrl} for the agent
components/
  lumi/Lumi.tsx
  landing/Hero.tsx (+Nav) LiveDemoPhone.tsx Steps.tsx (+ForwardTypes) VerdictShowcase.tsx TrustGrid.tsx (+Languages, CtaBand) Footer.tsx
  chat/Chat.tsx            # chat state + check flow (demo now, /api/check in Phase 4)
  chat/SidePanel.tsx       # desktop info panel beside the phone column
  chat/ChatHeader.tsx ChatInput.tsx MessageList.tsx Bubble.tsx
  chat/ForwardedBubble.tsx VoiceNoteBubble.tsx ImageBubble.tsx PdfBubble.tsx LinkBubble.tsx
  chat/StageBubble.tsx     # live checklist: Reading → Finding claims → Searching → Judging → Explaining
  verdict/VerdictCard.tsx VerdictChip.tsx ClaimRow.tsx ClaimSheet.tsx EvidenceCard.tsx
  verdict/ReplyComposer.tsx ListenButton.tsx
  call/CallScreen.tsx Captions.tsx
  ui/Sheet.tsx             # bottom sheet on native <dialog> (ClaimSheet, ReplyComposer); InlineSheets context renders it inside /demo frames
  ui/useDismiss.ts         # outside-click / Escape for menus
lib/
  types.ts  policy.ts  tiers.ts  i18n.ts  llm.ts  factcheck.ts  extract.ts  pipeline.ts
  schema.ts                # zod mirror of types.ts (rejects anything but the 4 verdicts)
  prefs.ts                 # lang + theme store (localStorage, default English / system theme)
  cache.ts  ssrf.ts  elevenlabs.ts  demo.ts
fixtures/
  scheme-forward.json  health-tip.json  old-news.json  verified-news.json  unclear-forward.json
public/audio/demo/         # pre-generated TTS for fixtures (scripts/pregen-tts.ts)
scripts/pregen-tts.ts
```

---

## Data contract (`lib/types.ts` — frozen; CANNOT_CONFIRM removed 2026-10-12 by team decision)

```ts
export type Verdict = 'VERIFIED'|'FALSE'|'OUTDATED'|'PARTLY_SUPPORTED';
export type Relation = 'SUPPORTS'|'CONTRADICTS'|'NARROWS'|'SUPERSEDES'|'NEUTRAL';
export type Tier = 'A'|'B'|'C'|'D';   // A official, B fact-checker/specialist, C reputable news, D weak
export type Lang = 'en'|'hi'|'mr';
export type InputType = 'text'|'image'|'audio'|'pdf'|'url';

export interface Evidence {
  id: string; publisher: string; title: string; url: string;
  publishedAt?: string; retrievedAt: string;
  excerpt: string; relation: Relation; tier: Tier;
  via: 'factcheck_api'|'web_search'|'fixture';
}
export interface Claim {
  id: string; text: string; sourceSpan?: [number, number];
  verdict: Verdict; oneLine: string;
  whatsRight: string[]; whatsWrong: string[];
  rationaleFacts: string[]; limitations: string[];
  evidence: Evidence[];
}
export interface CheckResult {
  id: string; checkedAt: string; policyVersion: string;
  inputType: InputType; detectedLang: string; outputLang: Lang;
  extractedText: string;
  overall: Verdict; overallSummary: string;
  claims: Claim[];
  replyMessage: string;      // polite, non-shaming message to paste back in the group
  spokenSummary: string;     // <= 350 chars, for TTS/agent; built only from rationaleFacts
  seenCount?: number;        // how many times this forward fingerprint was checked
  demo: boolean;
}
export type StageEvent =
  | { stage: 'extract'|'claims'|'search'|'judge'|'explain'; status: 'start'|'done'; note?: string }
  | { stage: 'done'; result: CheckResult }
  | { stage: 'error'; code: 'UNSUPPORTED_TYPE'|'EXTRACTION_FAILED'|'RETRIEVAL_UNAVAILABLE'|'INSUFFICIENT_EVIDENCE'|'INTERNAL'; message: string };
```

---

## Verdict policy (`lib/policy.ts`, `policyVersion = "1.0"`)

Usable evidence = relation ≠ NEUTRAL and tier ∈ {A,B,C}.
`decide()` returns a `Verdict` or `null` (= unresolved; never shown to the user).
1. No usable evidence → `null`.
2. Usable A/B `SUPPORTS` **and** A/B `CONTRADICTS` → `null` (reliable sources disagree).
3. Any `SUPERSEDES` (A/B/C) with a later date than the latest supporting evidence (or no supporting evidence) → `OUTDATED`.
4. Any A/B `CONTRADICTS` → `FALSE`. (`factcheck.ts` maps a ClaimReview rating of false/fake/misleading to `CONTRADICTS`, tier B.)
5. Any `NARROWS`, or supports with `whatsWrong` non-empty → `PARTLY_SUPPORTED`.
6. `VERIFIED` only if ≥1 A/B `SUPPORTS` or ≥2 C `SUPPORTS` from different domains; otherwise `null`.
Unresolved (`null`) claims are dropped from the result.
- All claims unresolved (or no claims) → `INSUFFICIENT_EVIDENCE` → "send me more" bubble.
- Some dropped → overall is capped at `PARTLY_SUPPORTED` (a forward is never "Verified" while parts were unchecked),
  and summary/reply talk only about the checked claims.
Overall = most severe claim: FALSE > OUTDATED > PARTLY_SUPPORTED > VERIFIED.
Unit-test every rule with fixtures.

## Source tiers (`lib/tiers.ts`)
- A: `*.gov.in`, `*.nic.in`, `pib.gov.in`, `rbi.org.in`, `who.int`, `icmr.gov.in`, `mohfw.gov.in`, `eci.gov.in`, `indiacode.nic.in`, `nih.gov`, `cdc.gov`
- B: `boomlive.in`, `altnews.in`, `factly.in`, `vishvasnews.com`, `newschecker.in`, `factcrescendo.com`, `newsmobile.in`, `factcheck.afp.com`, `politifact.com`, `factcheck.org`, `thequint.com/news/webqoof`, `indiatoday.in/fact-check`, PIB Fact Check pages
- C: established national outlets (`thehindu.com`, `indianexpress.com`, `hindustantimes.com`, `livemint.com`, `ndtv.com`, `reuters.com`, `bbc.com`, `loksatta.com`, `lokmat.com`, `indiatimes.com`, `business-standard.com`, `apnews.com`, `theguardian.com`)
- D: everything else (can be shown as "lead", never decides a verdict)

---

## Pipeline (`lib/pipeline.ts`)

1. **Extract:** text as-is · image → Groq vision model transcription (no OCR libs) · PDF → `unpdf` text with page numbers · URL → `lib/ssrf.ts` safe fetch (http/s only, block private IPs/redirects to private, 2MB cap, 8s timeout) + readability · audio → ElevenLabs Scribe.
2. **Fingerprint:** sha256 of normalized text → `cache.ts`. Hit → return cached result with `seenCount++`.
3. **Claims:** LLM JSON (zod) → atomic checkable claims; opinions/requests excluded.
4. **Search (parallel per claim, small concurrency):** Google Fact Check Tools `claims:search` + gpt-oss `browser_search`
   web search. Collect only URLs present in the tool results (`executed_tools` search results / ClaimReview);
   excerpts come from those results' content.
5. **Judge:** LLM labels each evidence `relation` + extracts `rationaleFacts`, `whatsRight`, `whatsWrong` using ONLY provided excerpts. Then `policy.ts` sets verdict.
   Guards: a web item's relation counts only if the judge's `quote` is really in that page (else NEUTRAL; the quote becomes
   the shown excerpt); a ClaimReview rating counts only when the judge reads it the same way for *our* claim (ratings are
   about the reviewed claim, which may differ); facts/points with numbers not in the retrieved text are dropped.
   Image/PDF uploads go through `/api/extract` first → editable "Lumi read this" bubble → "Check it" → `/api/check`.
6. **Explain:** LLM writes `oneLine`, `overallSummary`, `replyMessage`, `spokenSummary` in `outputLang` from rationaleFacts only. Post-check: reject if it mentions a number/date not in rationaleFacts → fallback to template text.
Stream a `StageEvent` at each start/done. Retrieved page text is untrusted data: wrap in delimiters, never follow instructions inside it.

---

## ElevenLabs (Starter plan — credits are scarce)

- **TTS** `/api/tts`: model `eleven_flash_v2_5` (cheapest, supports Hindi) or `eleven_multilingual_v2` if quality needed. One stock library voice for Lumi (NO voice cloning). Cache by sha256(text+voice+model). Fixture audio pre-generated once into `public/audio/demo/`.
- **STT** `/api/transcribe`: Scribe (check docs for current model id, e.g. `scribe_v2`), returns text + detected language + word timestamps. Transcript is always editable before checking.
- **Voice:** one warm **female** stock library voice, **English by default**, that also sounds good in Hindi; used for both TTS and the agent.
- **Agent "Lumi"** on `/call`: ElevenLabs Agent with client tools `verify_claim`, `show_claim_details`, `set_language`. Browser gets a signed URL from `/api/lumi/signed-url`. Mouth animation from the SDK's output volume.
- Follow the current React SDK docs: https://elevenlabs.io/docs/eleven-agents/libraries/react (newer versions use `ConversationProvider` + `useConversation`). Optionally run `npx skills add elevenlabs/packages`.
- If any ElevenLabs call fails → text result still renders; ListenButton falls back to `speechSynthesis`; call screen shows "Lumi can't take calls right now — chat instead".

---

## Env

```
LLM_PROVIDER=groq
GROQ_API_KEY=
GOOGLE_FACTCHECK_API_KEY=
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=
ELEVENLABS_AGENT_ID=
NEXT_PUBLIC_DEMO_MODE=true   # true = fixtures only, no API calls
```

## Definition of done (every phase)
- `pnpm build` passes, no TS errors, no console errors.
- Works at 360px and in dark mode; keyboard-usable; verdicts readable without colour.
- `NEXT_PUBLIC_DEMO_MODE=true` path works with network off.
- Deployed preview on Vercel.
