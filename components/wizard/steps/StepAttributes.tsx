import { WizardState, AttributeKey, Attributes } from '@/types/character'
import { CREATION_RULES } from '@/lib/game-data'
import { cn } from '@/lib/cn'

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
        className={cn(
          'flex items-center gap-3 mb-7 p-3 border transition-all duration-200',
          remaining === 0 ? 'border-olive bg-[rgba(107,122,62,0.1)]' : 'border-amber-deep bg-[rgba(61,46,15,0.3)]'
        )}
      >
        <div
          className={cn(
            'font-display text-4xl leading-none min-w-10',
            remaining === 0 ? 'text-olive' : 'text-amber'
          )}
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
            className={cn(
              'font-mono text-base',
              remaining === 0 ? 'text-olive' : 'text-concrete'
            )}
          >
            {remaining === 0 ? 'All points assigned — proceed when ready.' : `Distribute ${attributePoints} points total across 6 attributes (min ${attributeMin}, max ${attributeMax}).`}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {ATTRS.map(({ key, desc }) => {
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
                  className="font-display text-xl text-amber tracking-wide"
                >
                  {key}
                </div>
              </div>

              {/* Description + pip dots */}
              <div>
                <div
                  className="font-mono text-xxl text-concrete tracking-wide mb-1"
                >
                  {desc}
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: attributeMax }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'border w-3 h-3',
                        i < val ? 'border-amber bg-amber-dim' : 'border-concrete-dark bg-concrete-dark'
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => adjust(key, -1)}
                  disabled={val <= attributeMin}
                  className={cn(
                    'w-7 h-7 bg-transparent border border-amber-dim text-amber cursor-pointer flex items-center justify-center leading-none font-mono text-2xl transition-all',
                    val <= attributeMin && 'opacity-30'
                  )}
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
                  className={cn(
                    'w-7 h-7 bg-transparent border border-amber-dim text-amber cursor-pointer flex items-center justify-center leading-none font-mono text-2xl transition-all',
                    (val >= attributeMax || remaining <= 0) && 'opacity-30'
                  )}
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
