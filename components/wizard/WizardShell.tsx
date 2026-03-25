'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { WizardState, ArmorType } from '@/types/character'
import { CREATION_RULES, EXAMPLE_BUILDS } from '@/lib/game-data'
import { cn } from '@/lib/cn'
import StepIdentity from './steps/StepIdentity'
import StepAttributes from './steps/StepAttributes'
import StepSkills from './steps/StepSkills'
import StepTalent from './steps/StepTalent'
import StepArmor from './steps/StepArmor'
import StepWeapons from './steps/StepWeapons'
import StepExpendables from './steps/StepExpendables'
import StepBackgroundTags from './steps/StepBackgroundTags'
import StepFinalize from './steps/StepFinalize'

const STEPS = [
  { label: 'Identity' },
  { label: 'Attributes' },
  { label: 'Skills' },
  { label: 'Talent' },
  { label: 'Armor' },
  { label: 'Weapons' },
  { label: 'Expendables' },
  { label: 'Background' },
  { label: 'Finalize' },
]

const initialState: WizardState = {
  name: '',
  codename: '',
  backstory: '',
  attrs: { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },
  skills: [],
  talent: '',
  talentDesc: '',
  armor: '' as ArmorType,
  weapons: [{ name: 'Service Pistol', damage: '2 Fatigue' }],
  expendables: [],
  bgTags: [],
}

export default function WizardShell() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [state, setState] = useState<WizardState>(initialState)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedBuild, setExpandedBuild] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  function update(partial: Partial<WizardState>) {
    setState((prev) => ({ ...prev, ...partial }))
  }

  function canProceed(): boolean {
    switch (step) {
      case 0: return state.name.trim().length > 0
      case 1: {
        const total = Object.values(state.attrs).reduce((s, v) => s + v, 0)
        return total === CREATION_RULES.attributePoints
      }
      case 2: {
        const trained = state.skills.filter((s) => s.level === 'trained').length
        const expert = state.skills.find((s) => s.level === 'expert')
        return (
          trained === CREATION_RULES.trainedSkills &&
          !!expert &&
          expert.specializations.length >= CREATION_RULES.expertSpecMin
        )
      }
      case 3: return state.talent.trim().length > 0 && state.talentDesc.trim().length > 0
      case 4: return !!state.armor
      case 5: return state.weapons.length > 0
      case 6: return state.expendables.length === CREATION_RULES.expendableCount
      case 7: return state.bgTags.filter((t) => t.trim()).length >= CREATION_RULES.backgroundTags.min
      case 8: return true
      default: return true
    }
  }

  async function handleSubmit() {
    setSubmitError('')
    setSubmitting(true)

    const payload = {
      ...state,
      bgTags: state.bgTags.filter((t) => t.trim()),
      expendables: state.expendables.map((name) => ({ name, used: false })),
    }

    try {
      const res = await fetch('/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setSubmitError(data.error ?? 'Failed to file character.')
        setSubmitting(false)
        return
      }
      router.push(`/character/${data.id}`)
    } catch {
      setSubmitError('Network error — please try again.')
      setSubmitting(false)
    }
  }

  const ok = canProceed()

  return (
    <div className="max-w-[960px] mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <div className="section-label">Character Creation</div>
        <div className="flex items-center justify-between">
          <h1 className="font-display text-[30px] text-amber m-0 tracking-[2px]">
            New Operative File
          </h1>
          <button
            className="btn text-[30px] tracking-[2px] px-3 py-1.25"
            onClick={() => setSidebarOpen((o) => !o)}
          >
            {sidebarOpen ? 'Hide' : 'Show'} Reference Builds
          </button>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex gap-0 mb-7 overflow-x-auto border-b border-concrete-dark pb-0">
        {STEPS.map((s, i) => {
          const active = i === step
          const done = i < step
          return (
            <button
              key={s.label}
              onClick={() => i < step && setStep(i)}
              disabled={i > step}
              className={cn(
                'flex flex-col items-center gap-0.75 px-3 py-2 bg-transparent border-b-2 shrink-0 -mb-0.25',
                active ? 'border-b-amber' : 'border-b-transparent',
                i < step ? 'cursor-pointer' : 'cursor-default'
              )}
            >
              <div
                className={cn(
                  'w-[22px] h-[22px] border flex items-center justify-center font-mono text-[30px]',
                  active ? 'border-amber bg-amber-deep text-amber' : done ? 'border-olive bg-[rgba(107,122,62,0.2)] text-olive' : 'border-concrete-dark bg-transparent text-concrete-dark'
                )}
              >
                {done ? '✓' : i + 1}
              </div>
              <div
                className={cn(
                  'font-mono text-[36px] tracking-[2px] uppercase',
                  active ? 'text-amber' : done ? 'text-concrete' : 'text-concrete-dark'
                )}
              >
                {s.label}
              </div>
            </button>
          )
        })}
      </div>

      {/* Main layout */}
      <div className="flex gap-5 items-start">
        {/* Step content */}
        <div className="flex-1 min-w-0">
          <div className="panel mb-5">
            {step === 0 && <StepIdentity state={state} onChange={update} />}
            {step === 1 && <StepAttributes state={state} onChange={update} />}
            {step === 2 && <StepSkills state={state} onChange={update} />}
            {step === 3 && <StepTalent state={state} onChange={update} />}
            {step === 4 && <StepArmor state={state} onChange={update} />}
            {step === 5 && <StepWeapons state={state} onChange={update} />}
            {step === 6 && <StepExpendables state={state} onChange={update} />}
            {step === 7 && <StepBackgroundTags state={state} onChange={update} />}
            {step === 8 && (
              <StepFinalize
                state={state}
                onChange={update}
                onSubmit={handleSubmit}
                submitting={submitting}
                error={submitError}
              />
            )}
          </div>

          {/* Navigation */}
          {step < STEPS.length - 1 && (
            <div className="flex justify-between items-center">
              <button
                className="btn text-base tracking-[3px]"
                onClick={() => setStep((s) => s - 1)}
                disabled={step === 0}
              >
                ← Back
              </button>

              <div
                className={cn(
                  'font-mono text-[30px] tracking-[2px]',
                  ok ? 'text-olive' : 'text-red-stamp'
                )}
              >
                {ok ? '— ready —' : validationMessage(step)}
              </div>

              <button
                className="btn btn-primary text-base tracking-[3px]"
                onClick={() => setStep((s) => s + 1)}
                disabled={!ok}
              >
                Next →
              </button>
            </div>
          )}

          {step === STEPS.length - 1 && (
            <div className="flex justify-start">
              <button
                className="btn text-base tracking-[3px]"
                onClick={() => setStep((s) => s - 1)}
              >
                ← Back
              </button>
            </div>
          )}
        </div>

        {/* Example builds sidebar */}
        {sidebarOpen && (
          <div className="w-[280px] shrink-0 border border-amber-deep bg-[rgba(61,46,15,0.15)]">
            <div className="px-3.5 py-2.5 border-b border-amber-deep bg-[rgba(61,46,15,0.3)]">
              <div className="font-mono text-base tracking-[3px] text-red-stamp uppercase mb-1">
                Inspiration Only
              </div>
              <div className="font-mono text-[30px] text-concrete tracking-[1px] leading-[1.4]">
                Viewing these does not change your character.
              </div>
            </div>

            <div>
              {EXAMPLE_BUILDS.map((build) => {
                const open = expandedBuild === build.name
                return (
                  <div key={build.name} className="border-b border-concrete-dark">
                    <button
                      onClick={() => setExpandedBuild(open ? null : build.name)}
                      className="w-full px-3.5 py-2.5 bg-transparent border-none text-left cursor-pointer flex justify-between items-center"
                    >
                      <div className="font-display text-base text-off-white tracking-[1px]">
                        {build.name}
                      </div>
                      <span className="text-concrete text-[30px]">{open ? '▲' : '▼'}</span>
                    </button>

                    {open && (
                      <div className="px-3.5 pb-3.5 text-[30px]">
                        <div className="font-mono text-concrete tracking-[1px] italic mb-2.5 leading-relaxed">
                          {build.tagline}
                        </div>

                        <BuildRow label="Attrs">
                          <div className="flex gap-1 flex-wrap">
                            {Object.entries(build.attrs).map(([k, v]) => (
                              <span key={k} className="text-amber font-mono text-[30px]">
                                {k}:{v}
                              </span>
                            ))}
                          </div>
                        </BuildRow>

                        <BuildRow label="Expert">
                          <span className="text-amber font-mono text-[30px]">
                            {build.expertSkill}
                          </span>
                          <div className="text-concrete font-mono text-base mt-0.5">
                            {build.expertSpecs.join(', ')}
                          </div>
                        </BuildRow>

                        <BuildRow label="Trained">
                          {build.trainedSkills.map((s) => (
                            <div key={s} className="text-concrete-light font-mono text-[30px]">
                              {s}
                            </div>
                          ))}
                        </BuildRow>

                        <BuildRow label="Talent">
                          <div className="font-display text-lg text-off-white mb-0.5">
                            {build.talent}
                          </div>
                          <div className="font-mono text-base text-concrete leading-relaxed">
                            {build.talentDesc}
                          </div>
                        </BuildRow>

                        <BuildRow label="Tags">
                          {build.bgTags.map((t) => (
                            <div key={t} className="font-mono text-base text-amber-dim">
                              {t}
                            </div>
                          ))}
                        </BuildRow>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function BuildRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-2">
      <div className="font-mono text-[36px] tracking-[3px] text-amber-dim uppercase mb-0.75">
        {label}
      </div>
      {children}
    </div>
  )
}

function validationMessage(step: number): string {
  switch (step) {
    case 0: return 'Name is required'
    case 1: return 'Distribute all 12 points'
    case 2: return '3 Trained + 1 Expert w/ spec required'
    case 3: return 'Talent name + description required'
    case 4: return 'Select an armor type'
    case 5: return 'Weapons ready'
    case 6: return 'Select exactly 3 expendables'
    case 7: return 'At least 1 background tag required'
    default: return ''
  }
}
