'use client'

import { useState } from 'react'
import { WizardState } from '@/types/character'
import { EXPENDABLES, CREATION_RULES } from '@/lib/game-data'

interface Props {
  state: WizardState
  onChange: (partial: Partial<WizardState>) => void
}

const { expendableCount: MAX } = CREATION_RULES
const CATEGORIES = Array.from(new Set(EXPENDABLES.map((e) => e.cat)))

export default function StepExpendables({ state, onChange }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)

  function toggle(name: string) {
    if (state.expendables.includes(name)) {
      onChange({ expendables: state.expendables.filter((e) => e !== name) })
    } else if (state.expendables.length < MAX) {
      onChange({ expendables: [...state.expendables, name] })
    }
  }

  const count = state.expendables.length
  const full = count === MAX

  return (
    <div>
      <div className="section-label">Operational Supplies</div>
      <h2 className="font-display text-4xl text-amber mb-2">
        Expendables
      </h2>

      {/* Counter */}
      <div
        style={{
          borderColor: full ? 'var(--olive)' : 'var(--amber-deep)',
          background: full ? 'rgba(107,122,62,0.1)' : 'rgba(61,46,15,0.2)',
        }}
        className="flex items-center gap-3 mb-6 p-3 border"
      >
        <div
          style={{
            color: full ? 'var(--olive)' : 'var(--amber)',
          }}
          className="font-display text-4xl leading-none min-w-10"
        >
          {count}/{MAX}
        </div>
        <div
          style={{
            color: full ? 'var(--olive)' : 'var(--concrete)',
          }}
          className="font-mono text-base tracking-wide"
        >
          {full
            ? 'Loadout complete. Proceed when ready.'
            : `Select exactly ${MAX} items from the deck below. Each may be used once in the field.`}
        </div>
      </div>

      {/* Cards grouped by category */}
      {CATEGORIES.map((cat) => {
        const catItems = EXPENDABLES.filter((e) => e.cat === cat)

        return (
          <div key={cat} className="mb-4">
            <div className="section-label mb-2">{cat}</div>
            <div className="flex flex-col gap-1">
              {catItems.map((item) => {
                const selected = state.expendables.includes(item.name)
                const disabled = !selected && full
                const isExpanded = expanded === item.name

                return (
                  <div
                    key={item.name}
                    style={{
                      borderColor: selected ? 'var(--amber)' : 'var(--concrete-dark)',
                      background: selected
                        ? 'rgba(200,164,90,0.07)'
                        : disabled
                        ? 'rgba(255,255,255,0.01)'
                        : 'rgba(255,255,255,0.02)',
                      opacity: disabled ? 0.5 : 1,
                    }}
                    className="border transition-all duration-150"
                  >
                    {/* Card header row */}
                    <div className="flex items-center gap-2.5">
                      {/* Select checkbox */}
                      <button
                        onClick={() => !disabled && toggle(item.name)}
                        disabled={disabled}
                        style={{
                          background: selected ? 'rgba(200,164,90,0.15)' : 'transparent',
                          borderRightColor: selected ? 'var(--amber-dim)' : 'var(--concrete-dark)',
                          color: selected ? 'var(--amber)' : 'var(--concrete-dark)',
                        }}
                        className="w-11 self-stretch border-r flex items-center justify-center text-2xl flex-shrink-0"
                        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                      >
                        {selected ? '✓' : '○'}
                      </button>

                      {/* Name */}
                      <div className="flex-1 py-2.5">
                        <div
                          style={{
                            color: selected ? 'var(--amber)' : 'var(--off-white)',
                          }}
                          className="font-display text-base tracking-wide"
                        >
                          {item.name}
                        </div>
                      </div>

                      {/* Expand toggle */}
                      <button
                        onClick={() => setExpanded(isExpanded ? null : item.name)}
                        className="px-3.5 py-2.5 bg-transparent border-0 cursor-pointer text-concrete font-mono text-base tracking-[2px] flex-shrink-0"
                      >
                        {isExpanded ? 'HIDE' : 'INFO'}
                      </button>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="px-3.5 pb-3.5 pl-11 border-t border-concrete-dark">
                        <div className="pt-3 flex flex-col gap-2">
                          <div>
                            <div className="font-mono text-sm tracking-[3px] text-olive uppercase mb-1">
                              Effect
                            </div>
                            <div className="font-mono text-base text-concrete-light tracking-wide leading-relaxed">
                              {item.effect}
                            </div>
                          </div>
                          <div>
                            <div className="font-mono text-sm tracking-[3px] text-red-stamp uppercase mb-1">
                              Drawback
                            </div>
                            <div className="font-mono text-base text-concrete tracking-wide leading-relaxed">
                              {item.drawback}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
