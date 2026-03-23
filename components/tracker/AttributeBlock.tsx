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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
        {ATTRS.map(({ key, label }) => (
          <div
            key={key}
            style={{
              border: '1px solid var(--concrete-dark)',
              padding: '10px 8px',
              textAlign: 'center',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <div
              style={{
                fontFamily: '"Special Elite", serif',
                fontSize: 32,
                color: 'var(--amber)',
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              {attrs[key]}
            </div>
            <div
              style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: 13,
                letterSpacing: 2,
                color: 'var(--concrete)',
                textTransform: 'uppercase',
              }}
            >
              {key}
            </div>
            <div
              style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: 12,
                color: 'var(--concrete-dark)',
                letterSpacing: 1,
                marginTop: 1,
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Proficiency dice */}
      <div
        style={{
          marginTop: 10,
          padding: '8px 10px',
          border: '1px solid var(--amber-deep)',
          background: 'rgba(200,164,90,0.04)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', gap: 5 }}>
          <Die />
          <Die />
        </div>
        <div>
          <div
            style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: 14,
              color: 'var(--amber)',
              letterSpacing: 2,
            }}
          >
            2d6 Proficiency
          </div>
          <div
            style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: 12,
              color: 'var(--concrete)',
              letterSpacing: 1,
              marginTop: 1,
            }}
          >
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
