'use client';
import { Check, X } from 'lucide-react';
import { STR } from '@/lib/i18n';
import { useLang } from '@/lib/prefs';
import type { Claim } from '@/lib/types';
import { Sheet } from '@/components/ui/Sheet';
import { EvidenceCard } from './EvidenceCard';
import { VerdictChip } from './VerdictChip';

export function ClaimSheet({ claim, checkedAt, onClose }: { claim: Claim | null; checkedAt: string; onClose: () => void }) {
  const lang = useLang();
  const t = STR[lang];
  return (
    <Sheet open={!!claim} onClose={onClose} title={t.claimDetails} closeLabel={t.close}>
      {claim && (
        <div className="space-y-4">
          <blockquote className="border-l-4 border-satya-accent pl-3 text-[15px] italic">{claim.text}</blockquote>
          <div className="space-y-1">
            <VerdictChip verdict={claim.verdict} size="lg" />
            <p className="text-sm">{claim.oneLine}</p>
          </div>
          <List title={t.whatsRight} items={claim.whatsRight} ok />
          <List title={t.whatsWrong} items={claim.whatsWrong} />
          <section>
            <h3 className="mb-2 text-sm font-semibold">
              {t.sources} ({claim.evidence.length})
            </h3>
            <ul className="space-y-2">
              {claim.evidence.map((e) => (
                <EvidenceCard key={e.id} e={e} />
              ))}
            </ul>
          </section>
          {claim.limitations.length > 0 && (
            <section>
              <h3 className="mb-1 text-sm font-semibold">{t.limitations}</h3>
              <ul className="list-disc pl-5 text-sm text-satya-muted dark:text-satya-dmuted">
                {claim.limitations.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </section>
          )}
          <p className="text-xs text-satya-muted dark:text-satya-dmuted">
            {t.checkedAt}{' '}
            {new Date(checkedAt).toLocaleString(`${lang}-IN`, { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        </div>
      )}
    </Sheet>
  );
}

function List({ title, items, ok }: { title: string; items: string[]; ok?: boolean }) {
  if (!items.length) return null;
  const Icon = ok ? Check : X;
  return (
    <section>
      <h3 className="mb-1 text-sm font-semibold">{title}</h3>
      <ul className="space-y-1">
        {items.map((i) => (
          <li key={i} className="flex gap-2 text-sm">
            <Icon size={16} className="mt-0.5 shrink-0" color={ok ? '#1FA855' : '#E5484D'} strokeWidth={3} aria-hidden />
            {i}
          </li>
        ))}
      </ul>
    </section>
  );
}
