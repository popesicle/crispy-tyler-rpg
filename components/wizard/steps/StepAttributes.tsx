import { WizardState, AttributeKey, Attributes } from '@/types/character'
import { CREATION_RULES } from '@/lib/game-data'

interface Props {
  state: WizardState
  onChange: (partial: Partial<WizardState>) => void
}

const ATTRS: { key: AttributeKey; label: string; desc: string }[] = [
  { key: 'STR', label: 'Strength', desc: 'Physical force, melee, carrying capacity' },
  { key: 'DEX', label: 'Dexterity', desc: 'Speed, precision, stealth, firearms' },
  { key: 'CON', label: 'Constitution', desc: 'Endurance — determines Fatigue track length' },
  { key: 'INT', label: 'Intelligence', desc: 'Reasoning, investigation, occult knowledge' },
  { key: 'WIS', label: 'Wisdom', desc: 'Perception, insight — determines Stress track length' },
  { key: 'CHA', label: 'Charisma', desc: 'Persuasion, intimidation, social navigation' },
]

const { attributePoints, attributeMin, attributeMax } = CREATION_RULES

export default function StepAttributes({ state, onChange }: Props) {
  const total = Object.values(state.attrs).reduce((s, v) => s + v, 0)
  const remaining = attributePoints - total

  function adjust(key: AttributeKey, delta: number) {
    const current = state.attrs[key]
    const next = current + delta
    if (next < attributeMin || next > attributeMax) return
    if (delta > 0 && remaining <= 0) return
    onChange({ attrs: { ...state.attrs, [key]: next } as Attributes })
  }

  return (
    <div>
      <div className="section-label">Operative Profile</div>
      <h2 style={{ fontFamily: '"Special Elite", serif', fontSize: 36, color: 'var(--amber)', marginBottom: 8 }}>
        Attributes
      </h2>

      {/* Points counter */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 28,
          padding: '10px 14px',
          border: `1px solid ${remaining === 0 ? 'var(--olive)' : 'var(--amber-deep)'}`,
          background: remaining === 0 ? 'rgba(107,122,62,0.1)' : 'rgba(61,46,15,0.3)',
          transition: 'all 0.2s',
        }}
      >
        <div
          style={{
            fontFamily: '"Special Elite", serif',
            fontSize: 36,
            color: remaining === 0 ? 'var(--olive)' : 'var(--amber)',
            lineHeight: 1,
            minWidth: 40,
          }}
        >
          {remaining}
        </div>
        <div>
          <div
            style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: 30,
              letterSpacing: 3,
              color: 'var(--amber-dim)',
              textTransform: 'uppercase',
            }}
          >
            Points Remaining
          </div>
          <div
            style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: 19,
              color: remaining === 0 ? 'var(--olive)' : 'var(--concrete)',
            }}
          >
            {remaining === 0 ? 'All points assigned — proceed when ready.' : `Distribute ${attributePoints} points total across 6 attributes (min ${attributeMin}, max ${attributeMax}).`}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {ATTRS.map(({ key, label, desc }) => {
          const val = state.attrs[key]
          return (
            <div
              key={key}
              style={{
                display: 'grid',
                gridTemplateColumns: '52px 1fr auto',
                alignItems: 'center',
                gap: 16,
                padding: '12px 14px',
                border: '1px solid var(--concrete-dark)',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              {/* Stat abbreviation */}
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontFamily: '"Special Elite", serif',
                    fontSize: 36,
                    color: 'var(--amber)',
                    letterSpacing: 1,
                  }}
                >
                  {key}
                </div>
                <div
                  style={{
                    fontFamily: '"Share Tech Mono", monospace',
                    fontSize: 36,
                    color: 'var(--concrete)',
                    letterSpacing: 1,
                  }}
                >
                  {label.toUpperCase()}
                </div>
              </div>

              {/* Description + pip dots */}
              <div>
                <div
                  style={{
                    fontFamily: '"Share Tech Mono", monospace',
                    fontSize: 30,
                    color: 'var(--concrete)',
                    letterSpacing: 1,
                    marginBottom: 4,
                  }}
                >
                  {desc}
                </div>
                <div style={{ display: 'flex', gap: 3 }}>
                  {Array.from({ length: attributeMax }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 12,
                        height: 12,
                        background: i < val ? 'var(--amber-dim)' : 'var(--concrete-dark)',
                        border: `1px solid ${i < val ? 'var(--amber)' : 'var(--concrete-dark)'}`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={() => adjust(key, -1)}
                  disabled={val <= attributeMin}
                  style={{
                    ...controlBtnStyle,
                    opacity: val <= attributeMin ? 0.3 : 1,
                  }}
                >
                  −
                </button>
                <span
                  style={{
                    fontFamily: '"Special Elite", serif',
                    fontSize: 30,
                    color: 'var(--off-white)',
                    minWidth: 24,
                    textAlign: 'center',
                    lineHeight: 1,
                  }}
                >
                  {val}
                </span>
                <button
                  onClick={() => adjust(key, 1)}
                  disabled={val >= attributeMax || remaining <= 0}
                  style={{
                    ...controlBtnStyle,
                    opacity: val >= attributeMax || remaining <= 0 ? 0.3 : 1,
                  }}
                >
                  +
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const controlBtnStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  background: 'transparent',
  border: '1px solid var(--amber-dim)',
  color: 'var(--amber)',
  fontFamily: '"Share Tech Mono", monospace',
  fontSize: 36,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1,
}
