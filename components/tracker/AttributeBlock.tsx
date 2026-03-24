import { Attributes } from '@/types/character'

const ATTRS: { key: keyof Attributes; label: string }[] = [
  { key: 'STR', label: 'Strength' },
  { key: 'DEX', label: 'Dexterity' },
  { key: 'CON', label: 'Constitution' },
  { key: 'INT', label: 'Intelligence' },
  { key: 'WIS', label: 'Wisdom' },
  { key: 'CHA', label: 'Charisma' },
]

export default function AttributeBlock({ attrs }: { attrs: Attributes }) {
  return (
    <div>
      <div className="section-label">Attributes</div>
      <div className="grid grid-cols-3 gap-1">
        {ATTRS.map(({ key, label }) => (
          <div
            key={key}
            className="border border-concrete-dark px-2 py-2.5 text-center bg-white/[0.02]"
          >
            <div className="font-display text-[32px] text-amber leading-none mb-1">
              {attrs[key]}
            </div>
            <div className="font-mono text-xs tracking-[2px] text-concrete uppercase">
              {key}
            </div>
            <div className="font-mono text-[11px] text-concrete-dark tracking-[1px] mt-0.5">
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Proficiency dice */}
      <div className="mt-2.5 px-2.5 py-2 border border-amber-deep bg-[rgba(200,164,90,0.04)] flex items-center gap-2.5">
        <div className="flex gap-1.25">
          <Die />
          <Die />
        </div>
        <div>
          <div className="font-mono text-sm text-amber tracking-[2px]">
            2d6 Proficiency
          </div>
          <div className="font-mono text-xs text-concrete tracking-[1px] mt-0.5">
            Added to every roll
          </div>
        </div>
      </div>
    </div>
  )
}

function Die() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1" y="1" width="26" height="26" rx="4" fill="rgba(200,164,90,0.12)" stroke="var(--amber-dim)" strokeWidth="1.5" />
      {/* 6-face pip layout */}
      <circle cx="9"  cy="9"  r="2.2" fill="var(--amber)" />
      <circle cx="19" cy="9"  r="2.2" fill="var(--amber)" />
      <circle cx="9"  cy="14" r="2.2" fill="var(--amber)" />
      <circle cx="19" cy="14" r="2.2" fill="var(--amber)" />
      <circle cx="9"  cy="19" r="2.2" fill="var(--amber)" />
      <circle cx="19" cy="19" r="2.2" fill="var(--amber)" />
    </svg>
  )
}
