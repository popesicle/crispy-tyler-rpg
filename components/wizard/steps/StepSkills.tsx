'use client'

import { useState } from 'react'
import { WizardState } from '@/types/character'
import { SKILLS, CREATION_RULES } from '@/lib/game-data'
import { cn } from '@/lib/cn'

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
      <h2 className="font-display text-4xl text-amber mb-2">
        Skills
      </h2>

      {/* Status bar */}
      <div className="flex gap-2 mb-6">
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

      <div className="mb-5 p-3 border border-concrete-dark font-mono text-2xl text-concrete tracking-wide leading-relaxed">
        Pick <strong className="text-off-white">3 Trained</strong> + <strong className="text-amber">1 Expert</strong>.
        Only the Expert skill gets specializations — pick at least 1 from its list.
        Trained skills carry no specializations.
      </div>

      {CATEGORIES.map((cat) => {
        const catSkills = SKILLS.filter((s) => s.cat === cat)
        const open = expandedCat === cat

        return (
          <div key={cat} className="mb-1">
            {/* Category header */}
            <button
              onClick={() => setExpandedCat(open ? null : cat)}
              style={{
                background: open ? 'rgba(200,164,90,0.06)' : 'rgba(255,255,255,0.02)',
              }}
              className={cn(
                'w-full flex items-center justify-between px-3.5 py-2 border text-left',
                open ? 'border-amber-deep' : 'border-concrete-dark'
              )}
            >
              <span className="font-mono text-2xl tracking-[4px] text-amber-dim uppercase">
                {cat}
              </span>
              <span className="text-concrete text-4xl">{open ? '▲' : '▼'}</span>
            </button>

            {open && (
              <div style={{ borderLeftColor: 'var(--amber-deep)' }} className="border-l-2 ml-1">
                {catSkills.map((skill) => {
                  const sel = getSkill(skill.name)
                  const isTrained = sel?.level === 'trained'
                  const isExpert = sel?.level === 'expert'

                  return (
                    <div key={skill.name}>
                      <div
                        style={{
                          background: isExpert
                            ? 'rgba(200,164,90,0.06)'
                            : isTrained
                            ? 'rgba(255,255,255,0.03)'
                            : 'transparent',
                        }}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-concrete-dark"
                      >
                        {/* Skill name + attr */}
                        <div className="flex-1">
                          <div
                            className={cn(
                              'font-mono text-sm',
                              isExpert ? 'text-amber' : isTrained ? 'text-off-white' : 'text-concrete'
                            )}
                          >
                            {skill.name}
                          </div>
                          <div
                            className="font-mono text-sm text-concrete-dark tracking-[2px] mt-0.5"
                          >
                            {skill.attr}
                          </div>
                        </div>

                        {/* Trained button */}
                        <button
                          onClick={() => toggleTrained(skill.name)}
                          disabled={!isTrained && (trainedCount >= TRAINED_MAX || isExpert)}
                          className={cn(
                            'w-7 h-7 font-mono text-base font-bold tracking-wide border cursor-pointer flex-shrink-0 transition-all flex items-center justify-center',
                            isTrained ? 'border-concrete-light bg-[rgba(181,179,172,0.15)] text-off-white' : 'border-concrete-dark bg-transparent text-concrete-dark',
                            !isTrained && (trainedCount >= TRAINED_MAX || isExpert) && 'opacity-35'
                          )}
                        >
                          T
                        </button>

                        {/* Expert button */}
                        <button
                          onClick={() => toggleExpert(skill.name)}
                          disabled={!isExpert && (!!expertSkill || isTrained)}
                          className={cn(
                            'w-7 h-7 font-mono text-base font-bold tracking-wide border cursor-pointer flex-shrink-0 transition-all flex items-center justify-center',
                            isExpert ? 'border-amber bg-[rgba(200,164,90,0.15)] text-amber' : 'border-concrete-dark bg-transparent text-concrete-dark',
                            !isExpert && (!!expertSkill || isTrained) && 'opacity-35'
                          )}
                        >
                          E
                        </button>
                      </div>

                      {/* Specializations (only for expert skill) */}
                      {isExpert && (
                        <div className="px-3.5 pb-3.5 pl-7 bg-amber-deep/10 border-b border-amber-deep">
                          <div className="font-mono text-sm tracking-[3px] text-amber-dim uppercase mb-2">
                            Specializations — pick ≥1
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {skill.specs.map((spec) => {
                              const active = sel?.specializations.includes(spec)
                              return (
                                <button
                                  key={spec}
                                  onClick={() => toggleSpec(skill.name, spec)}
                                  className={cn(
                                    'font-mono text-base px-2.5 py-1 border cursor-pointer tracking-wide',
                                    active ? 'border-amber bg-[rgba(200,164,90,0.2)] text-amber' : 'border-concrete-dark bg-transparent text-concrete'
                                  )}
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
      className={cn(
        'px-3 py-1.25 border font-mono text-base tracking-wide whitespace-nowrap',
        ok ? 'border-olive bg-[rgba(107,122,62,0.1)] text-olive' : 'border-concrete-dark bg-transparent text-concrete'
      )}
    >
      {label}: {count}{max !== null ? `/${max}` : ''}
    </div>
  )
}
