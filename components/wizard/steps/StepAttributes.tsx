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
      <h2 className="font-display text-4xl text-amber mb-2">
        Attributes
      </h2>

      {/* Points counter */}
      <div
        style={{
          borderColor: remaining === 0 ? 'var(--olive)' : 'var(--amber-deep)',
          background: remaining === 0 ? 'rgba(107,122,62,0.1)' : 'rgba(61,46,15,0.3)',
        }}
        className="flex items-center gap-3 mb-7 p-3 border transition-all duration-200"
      >
        <div
          style={{
            color: remaining === 0 ? 'var(--olive)' : 'var(--amber)',
          }}
          className="font-display text-4xl leading-none min-w-10"
        >
          {remaining}
        </div>
        <div>
          <div
            className="font-mono text-2xl tracking-[3px] text-amber-dim uppercase"
          >
            Points Remaining
          </div>
          <div
            style={{
              color: remaining === 0 ? 'var(--olive)' : 'var(--concrete)',
            }}
            className="font-mono text-base"
          >
            {remaining === 0 ? 'All points assigned — proceed when ready.' : `Distribute ${attributePoints} points total across 6 attributes (min ${attributeMin}, max ${attributeMax}).`}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {ATTRS.map(({ key, label, desc }) => {
          const val = state.attrs[key]
          return (
            <div
              key={key}
              className="grid items-center gap-4 p-3 border border-concrete-dark bg-white/[0.02]"
              style={{ gridTemplateColumns: '52px 1fr auto' }}
            >
              {/* Stat abbreviation */}
              <div className="text-center">
                <div
                  className="font-display text-4xl text-amber tracking-wide"
                >
                  {key}
                </div>
                <div
                  className="font-mono text-4xl text-concrete tracking-wide"
                >
                  {label.toUpperCase()}
                </div>
              </div>

              {/* Description + pip dots */}
              <div>
                <div
                  className="font-mono text-2xl text-concrete tracking-wide mb-1"
                >
                  {desc}
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: attributeMax }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 12,
                        height: 12,
                        background: i < val ? 'var(--amber-dim)' : 'var(--concrete-dark)',
                        borderColor: i < val ? 'var(--amber)' : 'var(--concrete-dark)',
                      }}
                      className="border"
                    />
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => adjust(key, -1)}
                  disabled={val <= attributeMin}
                  className="w-7 h-7 bg-transparent border border-amber-dim text-amber cursor-pointer flex items-center justify-center leading-none font-mono text-3xl transition-all"
                  style={{
                    opacity: val <= attributeMin ? 0.3 : 1,
                  }}
                >
                  −
                </button>
                <span
                  className="font-display text-2xl text-off-white min-w-6 text-center leading-none"
                >
                  {val}
                </span>
                <button
                  onClick={() => adjust(key, 1)}
                  disabled={val >= attributeMax || remaining <= 0}
                  className="w-7 h-7 bg-transparent border border-amber-dim text-amber cursor-pointer flex items-center justify-center leading-none font-mono text-3xl transition-all"
                  style={{
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
