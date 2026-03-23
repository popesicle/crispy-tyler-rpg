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
      <h2 style={{ fontFamily: '"Special Elite", serif', fontSize: 36, color: 'var(--amber)', marginBottom: 8 }}>
        Expendables
      </h2>

      {/* Counter */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 24,
          padding: '10px 14px',
          border: `1px solid ${full ? 'var(--olive)' : 'var(--amber-deep)'}`,
          background: full ? 'rgba(107,122,62,0.1)' : 'rgba(61,46,15,0.2)',
        }}
      >
        <div
          style={{
            fontFamily: '"Special Elite", serif',
            fontSize: 36,
            color: full ? 'var(--olive)' : 'var(--amber)',
            lineHeight: 1,
            minWidth: 40,
          }}
        >
          {count}/{MAX}
        </div>
        <div
          style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: 19,
            color: full ? 'var(--olive)' : 'var(--concrete)',
            letterSpacing: 1,
          }}
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
          <div key={cat} style={{ marginBottom: 16 }}>
            <div className="section-label" style={{ marginBottom: 8 }}>{cat}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {catItems.map((item) => {
                const selected = state.expendables.includes(item.name)
                const disabled = !selected && full
                const isExpanded = expanded === item.name

                return (
                  <div
                    key={item.name}
                    style={{
                      border: `1px solid ${selected ? 'var(--amber)' : 'var(--concrete-dark)'}`,
                      background: selected
                        ? 'rgba(200,164,90,0.07)'
                        : disabled
                        ? 'rgba(255,255,255,0.01)'
                        : 'rgba(255,255,255,0.02)',
                      opacity: disabled ? 0.5 : 1,
                      transition: 'all 0.15s',
                    }}
                  >
                    {/* Card header row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {/* Select checkbox */}
                      <button
                        onClick={() => !disabled && toggle(item.name)}
                        disabled={disabled}
                        style={{
                          width: 44,
                          alignSelf: 'stretch',
                          background: selected ? 'rgba(200,164,90,0.15)' : 'transparent',
                          border: 'none',
                          borderRight: `1px solid ${selected ? 'var(--amber-dim)' : 'var(--concrete-dark)'}`,
                          cursor: disabled ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 30,
                          color: selected ? 'var(--amber)' : 'var(--concrete-dark)',
                          flexShrink: 0,
                        }}
                      >
                        {selected ? '✓' : '○'}
                      </button>

                      {/* Name */}
                      <div style={{ flex: 1, padding: '10px 0' }}>
                        <div
                          style={{
                            fontFamily: '"Special Elite", serif',
                            fontSize: 19,
                            color: selected ? 'var(--amber)' : 'var(--off-white)',
                            letterSpacing: 1,
                          }}
                        >
                          {item.name}
                        </div>
                      </div>

                      {/* Expand toggle */}
                      <button
                        onClick={() => setExpanded(isExpanded ? null : item.name)}
                        style={{
                          padding: '10px 14px',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--concrete)',
                          fontSize: 19,
                          fontFamily: '"Share Tech Mono", monospace',
                          letterSpacing: 2,
                          flexShrink: 0,
                        }}
                      >
                        {isExpanded ? 'HIDE' : 'INFO'}
                      </button>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div
                        style={{
                          padding: '0 14px 14px 44px',
                          borderTop: '1px solid var(--concrete-dark)',
                        }}
                      >
                        <div style={{ paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <div>
                            <div
                              style={{
                                fontFamily: '"Share Tech Mono", monospace',
                                fontSize: 17,
                                letterSpacing: 3,
                                color: 'var(--olive)',
                                textTransform: 'uppercase',
                                marginBottom: 4,
                              }}
                            >
                              Effect
                            </div>
                            <div
                              style={{
                                fontFamily: '"Share Tech Mono", monospace',
                                fontSize: 19,
                                color: 'var(--concrete-light)',
                                letterSpacing: 1,
                                lineHeight: 1.6,
                              }}
                            >
                              {item.effect}
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                fontFamily: '"Share Tech Mono", monospace',
                                fontSize: 17,
                                letterSpacing: 3,
                                color: 'var(--red-stamp)',
                                textTransform: 'uppercase',
                                marginBottom: 4,
                              }}
                            >
                              Drawback
                            </div>
                            <div
                              style={{
                                fontFamily: '"Share Tech Mono", monospace',
                                fontSize: 19,
                                color: 'var(--concrete)',
                                letterSpacing: 1,
                                lineHeight: 1.6,
                              }}
                            >
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
