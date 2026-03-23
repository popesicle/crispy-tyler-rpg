'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { WizardState, ArmorType } from '@/types/character'
import { CREATION_RULES, EXAMPLE_BUILDS } from '@/lib/game-data'
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
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <div className="section-label">Character Creation</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1
            style={{
              fontFamily: '"Special Elite", serif',
              fontSize: 30,
              color: 'var(--amber)',
              margin: 0,
              letterSpacing: 2,
            }}
          >
            New Operative File
          </h1>
          <button
            className="btn"
            onClick={() => setSidebarOpen((o) => !o)}
            style={{ fontSize: 30, letterSpacing: 2, padding: '5px 12px' }}
          >
            {sidebarOpen ? 'Hide' : 'Show'} Reference Builds
          </button>
        </div>
      </div>

      {/* Step indicator */}
      <div
        style={{
          display: 'flex',
          gap: 0,
          marginBottom: 28,
          overflowX: 'auto',
          borderBottom: '1px solid var(--concrete-dark)',
          paddingBottom: 0,
        }}
      >
        {STEPS.map((s, i) => {
          const active = i === step
          const done = i < step
          return (
            <button
              key={s.label}
              onClick={() => i < step && setStep(i)}
              disabled={i > step}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                padding: '8px 12px',
                background: 'transparent',
                border: 'none',
                borderBottom: active ? '2px solid var(--amber)' : '2px solid transparent',
                cursor: i < step ? 'pointer' : 'default',
                flexShrink: 0,
                marginBottom: -1,
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  border: `1px solid ${active ? 'var(--amber)' : done ? 'var(--olive)' : 'var(--concrete-dark)'}`,
                  background: active ? 'var(--amber-deep)' : done ? 'rgba(107,122,62,0.2)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: 30,
                  color: active ? 'var(--amber)' : done ? 'var(--olive)' : 'var(--concrete-dark)',
                }}
              >
                {done ? '✓' : i + 1}
              </div>
              <div
                style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: 36,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  color: active ? 'var(--amber)' : done ? 'var(--concrete)' : 'var(--concrete-dark)',
                }}
              >
                {s.label}
              </div>
            </button>
          )
        })}
      </div>

      {/* Main layout */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        {/* Step content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="panel" style={{ marginBottom: 20 }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                className="btn"
                onClick={() => setStep((s) => s - 1)}
                disabled={step === 0}
                style={{ fontSize: 19, letterSpacing: 3 }}
              >
                ← Back
              </button>

              <div
                style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: 30,
                  color: ok ? 'var(--olive)' : 'var(--red-stamp)',
                  letterSpacing: 2,
                }}
              >
                {ok ? '— ready —' : validationMessage(step)}
              </div>

              <button
                className="btn btn-primary"
                onClick={() => setStep((s) => s + 1)}
                disabled={!ok}
                style={{ fontSize: 19, letterSpacing: 3 }}
              >
                Next →
              </button>
            </div>
          )}

          {step === STEPS.length - 1 && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <button
                className="btn"
                onClick={() => setStep((s) => s - 1)}
                style={{ fontSize: 19, letterSpacing: 3 }}
              >
                ← Back
              </button>
            </div>
          )}
        </div>

        {/* Example builds sidebar */}
        {sidebarOpen && (
          <div
            style={{
              width: 280,
              flexShrink: 0,
              border: '1px solid var(--amber-deep)',
              background: 'rgba(61,46,15,0.15)',
            }}
          >
            <div
              style={{
                padding: '10px 14px',
                borderBottom: '1px solid var(--amber-deep)',
                background: 'rgba(61,46,15,0.3)',
              }}
            >
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
                Inspiration Only
              </div>
              <div
                style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: 30,
                  color: 'var(--concrete)',
                  letterSpacing: 1,
                  lineHeight: 1.4,
                }}
              >
                Viewing these does not change your character.
              </div>
            </div>

            <div>
              {EXAMPLE_BUILDS.map((build) => {
                const open = expandedBuild === build.name
                return (
                  <div key={build.name} style={{ borderBottom: '1px solid var(--concrete-dark)' }}>
                    <button
                      onClick={() => setExpandedBuild(open ? null : build.name)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: '"Special Elite", serif',
                          fontSize: 17,
                          color: 'var(--off-white)',
                          letterSpacing: 1,
                        }}
                      >
                        {build.name}
                      </div>
                      <span style={{ color: 'var(--concrete)', fontSize: 30 }}>{open ? '▲' : '▼'}</span>
                    </button>

                    {open && (
                      <div style={{ padding: '0 14px 14px', fontSize: 30 }}>
                        <div
                          style={{
                            fontFamily: '"Share Tech Mono", monospace',
                            color: 'var(--concrete)',
                            letterSpacing: 1,
                            fontStyle: 'italic',
                            marginBottom: 10,
                            lineHeight: 1.5,
                          }}
                        >
                          {build.tagline}
                        </div>

                        <BuildRow label="Attrs">
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            {Object.entries(build.attrs).map(([k, v]) => (
                              <span key={k} style={{ color: 'var(--amber)', fontFamily: '"Share Tech Mono", monospace', fontSize: 30 }}>
                                {k}:{v}
                              </span>
                            ))}
                          </div>
                        </BuildRow>

                        <BuildRow label="Expert">
                          <span style={{ color: 'var(--amber)', fontFamily: '"Share Tech Mono", monospace', fontSize: 30 }}>
                            {build.expertSkill}
                          </span>
                          <div style={{ color: 'var(--concrete)', fontFamily: '"Share Tech Mono", monospace', fontSize: 17, marginTop: 2 }}>
                            {build.expertSpecs.join(', ')}
                          </div>
                        </BuildRow>

                        <BuildRow label="Trained">
                          {build.trainedSkills.map((s) => (
                            <div key={s} style={{ color: 'var(--concrete-light)', fontFamily: '"Share Tech Mono", monospace', fontSize: 30 }}>
                              {s}
                            </div>
                          ))}
                        </BuildRow>

                        <BuildRow label="Talent">
                          <div style={{ fontFamily: '"Special Elite", serif', fontSize: 19, color: 'var(--off-white)', marginBottom: 2 }}>
                            {build.talent}
                          </div>
                          <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 17, color: 'var(--concrete)', lineHeight: 1.5 }}>
                            {build.talentDesc}
                          </div>
                        </BuildRow>

                        <BuildRow label="Tags">
                          {build.bgTags.map((t) => (
                            <div key={t} style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 17, color: 'var(--amber-dim)' }}>
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
    <div style={{ marginBottom: 8 }}>
      <div
        style={{
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: 36,
          letterSpacing: 3,
          color: 'var(--amber-dim)',
          textTransform: 'uppercase',
          marginBottom: 3,
        }}
      >
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
