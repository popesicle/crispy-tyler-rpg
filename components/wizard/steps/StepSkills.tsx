'use client'

import { useState } from 'react'
import { WizardState } from '@/types/character'
import { SKILLS, CREATION_RULES } from '@/lib/game-data'

interface Props {
  state: WizardState
  onChange: (partial: Partial<WizardState>) => void
}

const CATEGORIES = ['Physical', 'Investigation', 'Social', 'Weird'] as const
const { trainedSkills: TRAINED_MAX, expertSkills: EXPERT_MAX } = CREATION_RULES

export default function StepSkills({ state, onChange }: Props) {
  const [expandedCat, setExpandedCat] = useState<string | null>('Physical')

  const trainedCount = state.skills.filter((s) => s.level === 'trained').length
  const expertSkill = state.skills.find((s) => s.level === 'expert') ?? null

  function getSkill(name: string) {
    return state.skills.find((s) => s.name === name) ?? null
  }

  function toggleTrained(name: string) {
    const existing = getSkill(name)
    if (existing?.level === 'expert') return // can't toggle expert as trained directly

    if (existing?.level === 'trained') {
      // deselect
      onChange({ skills: state.skills.filter((s) => s.name !== name) })
    } else if (!existing && trainedCount < TRAINED_MAX) {
      // select as trained
      onChange({ skills: [...state.skills, { name, level: 'trained', specializations: [] }] })
    }
  }

  function toggleExpert(name: string) {
    const existing = getSkill(name)

    if (existing?.level === 'expert') {
      // deselect expert
      onChange({ skills: state.skills.filter((s) => s.name !== name) })
      return
    }

    // Remove any existing expert, also remove this skill if it was trained
    const withoutExpertAndThis = state.skills.filter(
      (s) => s.level !== 'expert' && s.name !== name
    )
    onChange({
      skills: [...withoutExpertAndThis, { name, level: 'expert', specializations: [] }],
    })
  }

  function toggleSpec(skillName: string, spec: string) {
    const skills = state.skills.map((s) => {
      if (s.name !== skillName) return s
      const has = s.specializations.includes(spec)
      return {
        ...s,
        specializations: has
          ? s.specializations.filter((x) => x !== spec)
          : [...s.specializations, spec],
      }
    })
    onChange({ skills })
  }

  const trainedOk = trainedCount === TRAINED_MAX
  const expertOk = !!expertSkill && expertSkill.specializations.length >= CREATION_RULES.expertSpecMin

  return (
    <div>
      <div className="section-label">Capability Assessment</div>
      <h2 style={{ fontFamily: '"Special Elite", serif', fontSize: 36, color: 'var(--amber)', marginBottom: 8 }}>
        Skills
      </h2>

      {/* Status bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <StatusPill
          label="Trained"
          count={trainedCount}
          max={TRAINED_MAX}
          ok={trainedOk}
        />
        <StatusPill
          label="Expert"
          count={expertSkill ? 1 : 0}
          max={EXPERT_MAX}
          ok={expertOk}
        />
        {expertSkill && (
          <StatusPill
            label="Specializations"
            count={expertSkill.specializations.length}
            max={null}
            ok={expertOk}
          />
        )}
      </div>

      <div
        style={{
          marginBottom: 20,
          padding: '8px 12px',
          border: '1px solid var(--concrete-dark)',
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: 30,
          color: 'var(--concrete)',
          letterSpacing: 1,
          lineHeight: 1.6,
        }}
      >
        Pick <strong style={{ color: 'var(--off-white)' }}>3 Trained</strong> + <strong style={{ color: 'var(--amber)' }}>1 Expert</strong>.
        Only the Expert skill gets specializations — pick at least 1 from its list.
        Trained skills carry no specializations.
      </div>

      {CATEGORIES.map((cat) => {
        const catSkills = SKILLS.filter((s) => s.cat === cat)
        const open = expandedCat === cat

        return (
          <div key={cat} style={{ marginBottom: 4 }}>
            {/* Category header */}
            <button
              onClick={() => setExpandedCat(open ? null : cat)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 14px',
                background: open ? 'rgba(200,164,90,0.06)' : 'rgba(255,255,255,0.02)',
                border: '1px solid var(--concrete-dark)',
                borderColor: open ? 'var(--amber-deep)' : 'var(--concrete-dark)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span
                style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: 30,
                  letterSpacing: 4,
                  color: 'var(--amber-dim)',
                  textTransform: 'uppercase',
                }}
              >
                {cat}
              </span>
              <span style={{ color: 'var(--concrete)', fontSize: 36 }}>{open ? '▲' : '▼'}</span>
            </button>

            {open && (
              <div style={{ borderLeft: '2px solid var(--amber-deep)', marginLeft: 4 }}>
                {catSkills.map((skill) => {
                  const sel = getSkill(skill.name)
                  const isTrained = sel?.level === 'trained'
                  const isExpert = sel?.level === 'expert'

                  return (
                    <div key={skill.name}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 14px',
                          borderBottom: '1px solid var(--concrete-dark)',
                          background: isExpert
                            ? 'rgba(200,164,90,0.06)'
                            : isTrained
                            ? 'rgba(255,255,255,0.03)'
                            : 'transparent',
                        }}
                      >
                        {/* Skill name + attr */}
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontFamily: '"Share Tech Mono", monospace',
                              fontSize: 17,
                              color: isExpert ? 'var(--amber)' : isTrained ? 'var(--off-white)' : 'var(--concrete)',
                            }}
                          >
                            {skill.name}
                          </div>
                          <div
                            style={{
                              fontFamily: '"Share Tech Mono", monospace',
                              fontSize: 17,
                              color: 'var(--concrete-dark)',
                              letterSpacing: 2,
                              marginTop: 2,
                            }}
                          >
                            {skill.attr}
                          </div>
                        </div>

                        {/* Trained button */}
                        <button
                          onClick={() => toggleTrained(skill.name)}
                          disabled={!isTrained && (trainedCount >= TRAINED_MAX || isExpert)}
                          style={{
                            ...toggleBtnStyle,
                            borderColor: isTrained ? 'var(--concrete-light)' : 'var(--concrete-dark)',
                            color: isTrained ? 'var(--off-white)' : 'var(--concrete-dark)',
                            background: isTrained ? 'rgba(181,179,172,0.15)' : 'transparent',
                            opacity: !isTrained && (trainedCount >= TRAINED_MAX || isExpert) ? 0.35 : 1,
                          }}
                        >
                          T
                        </button>

                        {/* Expert button */}
                        <button
                          onClick={() => toggleExpert(skill.name)}
                          disabled={!isExpert && (!!expertSkill || isTrained)}
                          style={{
                            ...toggleBtnStyle,
                            borderColor: isExpert ? 'var(--amber)' : 'var(--concrete-dark)',
                            color: isExpert ? 'var(--amber)' : 'var(--concrete-dark)',
                            background: isExpert ? 'rgba(200,164,90,0.15)' : 'transparent',
                            opacity: !isExpert && (!!expertSkill || isTrained) ? 0.35 : 1,
                          }}
                        >
                          E
                        </button>
                      </div>

                      {/* Specializations (only for expert skill) */}
                      {isExpert && (
                        <div
                          style={{
                            padding: '12px 14px 14px 28px',
                            background: 'rgba(200,164,90,0.04)',
                            borderBottom: '1px solid var(--amber-deep)',
                          }}
                        >
                          <div
                            style={{
                              fontFamily: '"Share Tech Mono", monospace',
                              fontSize: 17,
                              letterSpacing: 3,
                              color: 'var(--amber-dim)',
                              textTransform: 'uppercase',
                              marginBottom: 8,
                            }}
                          >
                            Specializations — pick ≥1
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {skill.specs.map((spec) => {
                              const active = sel?.specializations.includes(spec)
                              return (
                                <button
                                  key={spec}
                                  onClick={() => toggleSpec(skill.name, spec)}
                                  style={{
                                    fontFamily: '"Share Tech Mono", monospace',
                                    fontSize: 19,
                                    padding: '4px 10px',
                                    background: active ? 'rgba(200,164,90,0.2)' : 'transparent',
                                    border: `1px solid ${active ? 'var(--amber)' : 'var(--concrete-dark)'}`,
                                    color: active ? 'var(--amber)' : 'var(--concrete)',
                                    cursor: 'pointer',
                                    letterSpacing: 1,
                                  }}
                                >
                                  {active ? '✓ ' : ''}{spec}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function StatusPill({ label, count, max, ok }: { label: string; count: number; max: number | null; ok: boolean }) {
  return (
    <div
      style={{
        padding: '5px 12px',
        border: `1px solid ${ok ? 'var(--olive)' : 'var(--concrete-dark)'}`,
        background: ok ? 'rgba(107,122,62,0.1)' : 'transparent',
        fontFamily: '"Share Tech Mono", monospace',
        fontSize: 19,
        color: ok ? 'var(--olive)' : 'var(--concrete)',
        letterSpacing: 1,
        whiteSpace: 'nowrap',
      }}
    >
      {label}: {count}{max !== null ? `/${max}` : ''}
    </div>
  )
}

const toggleBtnStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  fontFamily: '"Share Tech Mono", monospace',
  fontSize: 19,
  fontWeight: 'bold',
  letterSpacing: 1,
  border: '1px solid',
  cursor: 'pointer',
  flexShrink: 0,
  transition: 'all 0.1s',
}
