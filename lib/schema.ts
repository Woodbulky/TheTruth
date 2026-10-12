import { z } from 'zod';
import type { CheckResult } from './types';

export const VerdictSchema = z.enum(['VERIFIED', 'FALSE', 'OUTDATED', 'PARTLY_SUPPORTED']);
export const LangSchema = z.enum(['en', 'hi', 'mr']);

export const EvidenceSchema = z.object({
  id: z.string(), publisher: z.string(), title: z.string(), url: z.string(),
  publishedAt: z.string().optional(), retrievedAt: z.string(),
  excerpt: z.string(),
  relation: z.enum(['SUPPORTS', 'CONTRADICTS', 'NARROWS', 'SUPERSEDES', 'NEUTRAL']),
  tier: z.enum(['A', 'B', 'C', 'D']),
  via: z.enum(['factcheck_api', 'web_search', 'fixture']),
});

export const ClaimSchema = z.object({
  id: z.string(), text: z.string(), sourceSpan: z.tuple([z.number(), z.number()]).optional(),
  verdict: VerdictSchema, oneLine: z.string(),
  whatsRight: z.array(z.string()), whatsWrong: z.array(z.string()),
  rationaleFacts: z.array(z.string()), limitations: z.array(z.string()),
  evidence: z.array(EvidenceSchema),
});

export const CheckResultSchema = z.object({
  id: z.string(), checkedAt: z.string(), policyVersion: z.string(),
  inputType: z.enum(['text', 'image', 'audio', 'pdf', 'url']), detectedLang: z.string(), outputLang: LangSchema,
  extractedText: z.string(),
  overall: VerdictSchema, overallSummary: z.string(),
  claims: z.array(ClaimSchema).min(1),
  replyMessage: z.string(),
  spokenSummary: z.string().max(350),
  seenCount: z.number().optional(),
  demo: z.boolean(),
}) satisfies z.ZodType<CheckResult>;
