# The Truth — Forward it to Lumi before you forward it to family

Hack On Track 2026 · PS3 "Is This Forward True". See `CLAUDE.md` for the full spec and `PROMPTS.md` for the build phases.

```bash
pnpm install
cp .env.example .env.local   # NEXT_PUBLIC_DEMO_MODE=true needs no keys
pnpm dev                     # http://localhost:3000  (/, /chat, /call, /demo)
pnpm build
```

Deploy: import the repo on Vercel (framework auto-detected, pnpm), add the env vars from `.env.example`, deploy.
