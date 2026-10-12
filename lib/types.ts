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
