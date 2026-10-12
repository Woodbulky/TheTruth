# SATYA — Claude Code prompt sequence

Put `CLAUDE.md` in the repo root first. Run one phase per session. Commit + deploy after each.
Phases 1–3 = Round 1 (PPT + live link, zero API keys needed). Phases 4–7 = prototype.

---

## Phase 1 — Frontend shell on mock data (deploy today) ✅ DONE

```
Read CLAUDE.md fully. Scaffold the Next.js app exactly as specified (App Router, TS, Tailwind,
Framer Motion, lucide-react, zod). Use pnpm.

Build with NEXT_PUBLIC_DEMO_MODE=true only — no API calls in this phase.

1. lib/types.ts exactly as in CLAUDE.md. lib/i18n.ts with all UI strings + verdict labels in en/hi/mr.
2. fixtures/: 4 CheckResult JSON files (scheme-forward → PARTLY_SUPPORTED with 3 claims:
   VERIFIED + PARTLY_SUPPORTED + VERIFIED; health-tip → FALSE; old-news → OUTDATED;
   verified-news → VERIFIED) + unclear-forward.json (input only → INSUFFICIENT_EVIDENCE →
   "send me more" bubble, no verdict). Use fictional schemes/news only. Every fixture evidence item: publisher "Demo Source", url "#",
   excerpt prefixed "[DEMO]". demo: true. Default lang = en. Fill replyMessage + spokenSummary in all 3 languages
   (add a `localized` map in the fixture file, not in types.ts).
3. lib/demo.ts: fake check() that emits StageEvents with realistic delays (extract 600ms,
   claims 900ms, search 1500ms, judge 1000ms, explain 700ms) then the fixture.
4. Chat screen app/chat/page.tsx: WhatsApp-inspired chat with Lumi per CLAUDE.md tokens.
   app/page.tsx = minimal placeholder (SATYA wordmark + "Chat with Lumi" → /chat) until Phase 3.
   - ChatHeader: back arrow (→ /), Lumi avatar (use a placeholder circle for now), "Lumi", status text,
     icons: phone (→ /call), language pill EN/हिं/मरा, menu (demo forwards, dark mode, clear chat).
   - Original SVG wallpaper pattern (magnifier/check/clock/quote glyphs, 6% opacity).
   - Welcome message from Lumi + 4 chips "Try a demo forward" (one per fixture).
   - ChatInput: paperclip (image/PDF/audio/link — in demo mode they insert a matching
     mock bubble and run the matching fixture), text field "Paste or forward a message…",
     mic button that swaps to send when text is typed.
   - User bubbles: ForwardedBubble ("↪ Forwarded" label), ImageBubble, VoiceNoteBubble
     (fake waveform + duration), PdfBubble, LinkBubble.
   - Lumi reply: typing dots → StageBubble (live checklist with ticks) → VerdictCard.
5. VerdictCard: VerdictChip (icon + label + colour), overallSummary, "N claims checked",
   ClaimRow list, actions: Listen (disabled stub), "Reply to group" (opens ReplyComposer
   with replyMessage + Copy button), 👍/👎. DEMO DATA badge when demo === true.
6. ClaimSheet (bottom sheet, swipe/close): quoted claim, What's right / What's wrong,
   EvidenceCard list (publisher initial avatar, tier badge A/B/C/D, published date,
   relation tag), limitations, "Checked at".
7. Desktop ≥1024px: centered 430px phone column + left panel with SATYA logo text,
   tagline "Evidence before belief", and a 5-step "How Lumi checks" pipeline.
8. Dark mode, 360px, reduced motion, keyboard focus states.
Then: pnpm build, fix all errors, and give me the Vercel deploy steps.
```

## Phase 2 — Lumi avatar + PPT screenshot route ✅ DONE

> Done 2026-10-12. Lumi.tsx is the illustrated SVG (all layer ids, 5 states, moods, volume, blink,
> reduced motion, <48px simplification, plus an `asking` prop for the "send me more" nod). /demo has the
> Lumi playground + 12 frames incl. the landing hero. Light theme became the default.

```
Read CLAUDE.md "Lumi" section. Build components/lumi/Lumi.tsx: Lumi is a female assistant —
an original flat-vector young Indian woman (head-and-shoulders bust, side braid, teal top with
mint accent, single-ear headset, gold spark hairclip, gold halo ring). Pure SVG + Framer Motion,
split into the named layer groups from CLAUDE.md, with all 5 states, mood reactions,
volume-driven mouth/halo, random blink, reduced-motion support, and a simplified render below
48px. Original design only — must not resemble a real person or existing mascot.

Wire it in:
- Header avatar (36px) with online dot; status text follows pipeline stage.
- Empty state: 96px Lumi above welcome message.
- During checking: header Lumi = thinking; on result: reacting(mood = overall) for 2s then idle.
- Add a dev slider page section in /demo to test volume 0..1 and every state.

Build app/demo/page.tsx: grid of phone frames (390×844) showing: empty chat, checking in
progress, each of the 4 verdict results, ClaimSheet open, ReplyComposer open, dark mode,
call screen placeholder. Each frame has a "Download PNG" button using html-to-image.
This page is for PPT screenshots (add the landing page hero to the grid after Phase 3).
pnpm build, then commit.
```

## Phase 3 — Landing page ✅ BUILT EARLY (only the OG image is left)

```
Read CLAUDE.md "Landing page" and "Lumi". Replace the app/page.tsx placeholder with the full
landing page using components/landing/*:
- Nav, Hero (headline, subhead, Chat with Lumi → /chat, Call Lumi → /call, Lumi at ~360px idle
  beside LiveDemoPhone), What you can forward, How Lumi checks (5 steps), VerdictShowcase
  (5 chips in EN/HI/MR; Lumi plays each mood reaction as it scrolls into view), TrustGrid, Footer
  with team + disclaimer.
- LiveDemoPhone reuses the real chat components and lib/demo.ts with a fixture, looping
  forward → StageBubble → VerdictCard. No static screenshots.
- All copy in lib/i18n.ts; the language pill switches the whole page.
- Full-width responsive (360px → desktop), dark mode, reduced motion, keyboard focus,
  page metadata + Open Graph image (Lumi + headline). Works offline in demo mode.
pnpm build, then commit + deploy.
```

## Phase 4 — Real verification pipeline

```
Read CLAUDE.md "Stack", "Pipeline", "Verdict policy", "Source tiers". Implement:
- lib/llm.ts adapter on Groq (groq-sdk). Check current model ids at
  https://console.groq.com/docs/models and keep them as constants:
  - JSON calls (claims / judge / explain): model with response_format json_schema
    (e.g. openai/gpt-oss-120b), validated with zod, one retry on invalid JSON.
  - search(claim): Groq Compound (groq/compound or compound-mini) web search. Build Evidence
    ONLY from the search results in executed_tools (url, title, content) — ignore any URL the
    model writes in its prose.
  - vision(image): Groq vision model (e.g. meta-llama/llama-4-scout-17b-16e-instruct); check
    its image size limits and downscale before sending.
  - Small concurrency for per-claim calls + backoff on 429 (free-tier limits).
- lib/factcheck.ts: Google Fact Check Tools claims:search (query + languageCode), map
  ClaimReview → Evidence (via: 'factcheck_api').
- lib/tiers.ts, lib/policy.ts (+ vitest unit tests for every rule), lib/ssrf.ts, lib/cache.ts.
- lib/extract.ts: text, image (Groq vision transcription), pdf (unpdf, page numbers), url (ssrf
  fetch + readability). Audio stays stubbed until Phase 5.
- lib/pipeline.ts + app/api/check/route.ts streaming StageEvents as SSE; maxDuration = 60.
- Drop any evidence URL not returned by a tool call. Post-check explanations for numbers/dates
  not in rationaleFacts; on failure use template text.
- Frontend: when DEMO_MODE=false call /api/check; keep demo chips always using fixtures.
- Image/PDF upload: show extracted text in an editable "Lumi read this:" bubble with
  "Check it" button before running claims (user can fix OCR).
Test with 10 real Indian forwards; print a table: input, claims, verdicts, sources.
```

## Phase 5 — ElevenLabs voice: Listen + voice notes

```
Read CLAUDE.md "ElevenLabs". Implement:
- lib/elevenlabs.ts (server-only), app/api/tts/route.ts (cache by hash, return audio/mpeg),
  app/api/transcribe/route.ts (Scribe; return text, language, words).
- ListenButton: plays /api/tts for spokenSummary in outputLang; while playing, header Lumi =
  speaking with volume from a WebAudio AnalyserNode on the audio element. Fallback:
  window.speechSynthesis. Demo fixtures use public/audio/demo/*.mp3.
- scripts/pregen-tts.ts: generate fixture audio for en/hi/mr once (prints credits used).
- Mic in ChatInput: hold-to-record (MediaRecorder, max 60s, slide to cancel) → VoiceNoteBubble
  → /api/transcribe → editable transcript bubble → "Check it".
- Audio upload via paperclip uses the same path.
Never block the text result on any ElevenLabs failure.
```

## Phase 6 — Call Lumi (ElevenLabs Agent)

```
Read CLAUDE.md "ElevenLabs". Install the latest @elevenlabs/react and follow
https://elevenlabs.io/docs/eleven-agents/libraries/react (ConversationProvider + useConversation).
- app/api/lumi/signed-url/route.ts: server fetch of
  https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=$ELEVENLABS_AGENT_ID
  with xi-api-key header → { signedUrl }.
- app/call/page.tsx + CallScreen: full-screen dark teal gradient, Lumi 220px, "Lumi",
  status/timer, live captions of last 3 turns, mute / speaker / red end button,
  mic permission prompt UX. Lumi state: listening (input volume) / speaking (output volume)
  / thinking (while a tool runs).
- Client tools (names must match the dashboard config):
  verify_claim({ message_text, language }) → (on INSUFFICIENT_EVIDENCE returns { needs_more_info: true })
    runs the same pipeline as chat (or fixture in
    demo mode), pushes the VerdictCard into the chat history, shows a mini verdict card on
    the call screen, and returns JSON { overall, spoken_summary, claims:[{text, verdict,
    one_line}], top_sources:[{publisher, published_at}] }.
  show_claim_details({ claim_index }) → opens ClaimSheet over the call screen.
  set_language({ language }) → switches UI language.
- On end: navigate back to /chat where the verdict cards remain.
- Error → "Lumi can't take calls right now — chat instead" with button back to chat.
```

## Phase 7 — Demo hardening

```
- Add PWA manifest + icons (Lumi's face) + Web Share Target (GET → /chat, text/url params) so on
  Android you can share text/links from other apps straight into SATYA (prefills the chat input).
- "Seen N times" chip on VerdictCard when cache.seenCount > 1.
- Error states for every StageEvent error code. Retry button.
- Health route GET /api/health (groq, factcheck, elevenlabs reachable).
- Run the full demo script 3x with network on and once with DEMO_MODE=true network off.
```

---

## ElevenLabs dashboard setup (do this by hand, ~15 min)

Create Agent → name **Lumi**. Voice: one warm female stock voice (same one as TTS) from the library that
sounds good in Hindi (no cloning). Default language **English**; add Hindi (and Marathi if the
dashboard lists it, else Lumi answers Marathi users in Hindi/English). Keep the agent private
(signed URL only). Turn on "wait for response" for every client tool.

**First message**
```
Hi, I'm Lumi! Read me a forward or tell me what you heard, and I'll check it against reliable sources.
```

**System prompt**
```
You are Lumi, a friendly young woman who is the fact-checking assistant inside SATYA. You are warm, calm and brief, and you
never shame the person who sent a forward — you check the claim, not the sender.

Speak in the user's language (English, Hindi or Marathi). Keep every turn under 3 short sentences.

When the user reads out, pastes, or describes a message they received, call verify_claim with
the message text as close to verbatim as possible and the user's language. Say "Let me check
the sources" while you wait.

After verify_claim returns, say the overall verdict in plain words, then speak spoken_summary.
Then offer: "Want me to show the sources?" If yes, call show_claim_details.

You may ONLY state verdicts, facts, numbers, dates and source names that appear in the
verify_claim result. If verify_claim returns needs_more_info, don't give any verdict: warmly ask for
the full forwarded message, a clearer screenshot, or where it came from. Never guess.

Do not give medical, legal or financial advice; for those topics suggest confirming with a
doctor, official office or professional. If the user switches language, call set_language.
```

**Client tools** (type: Client, wait for response: ON)
```
verify_claim
  description: Check a forwarded message against reliable sources and return the verdict.
  params: message_text (string, required) — the forward text;
          language (string, enum: en, hi, mr, required)

show_claim_details
  description: Open the evidence and sources for one claim on the user's screen.
  params: claim_index (number, required) — 0-based index from the verify_claim result

set_language
  description: Switch the app's display language.
  params: language (string, enum: en, hi, mr, required)
```

**Credit discipline (Starter plan)**
- Develop the call UI against a mock conversation hook; use real agent minutes only for
  final rehearsals and the demo.
- Pre-generate fixture TTS once; never regenerate in a loop.
- Record a backup screen capture of a full call in case venue Wi-Fi or credits fail.
