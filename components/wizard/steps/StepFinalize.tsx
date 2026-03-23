import { WizardState } from '@/types/character'
import { EXPENDABLES } from '@/lib/game-data'

interface Props {
  state: WizardState
  onChange: (partial: Partial<WizardState>) => void
  onSubmit: () => void
  submitting: boolean
  error: string
}

const ATTR_KEYS = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as const

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function StepFinalize({ state, onChange, onSubmit, submitting, error }: Props) {
  const expertSkill = state.skills.find((s) => s.level === 'expert')
  const trainedSkills = state.skills.filter((s) => s.level === 'trained')
  const expendableDetails = state.expendables.map((name) => EXPENDABLES.find((e) => e.name === name)!)

  return (
    <div>
      {/* Classified header */}
      <div
        style={{
          background: 'var(--red-stamp)',
          color: 'var(--off-white)',
          fontFamily: '"Special Elite", serif',
          fontSize: 17,
          letterSpacing: 6,
          textTransform: 'uppercase',
          textAlign: 'center',
          padding: '6px 0',
          marginBottom: 20,
          opacity: 0.9,
        }}
      >
        Federal Remediation Commission — Personnel File
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 24 }}>
        <h2
          style={{
            fontFamily: '"Special Elite", serif',
            fontSize: 36,
            color: 'var(--amber)',
            margin: 0,
            letterSpacing: 2,
          }}
        >
          {state.name || '—'}
        </h2>
        {state.codename && (
          <div
            style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: 17,
              color: 'var(--amber-dim)',
              letterSpacing: 2,
            }}
          >
            &ldquo;{state.codename}&rdquo;
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Attributes */}
        <Section label="Attributes">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
            {ATTR_KEYS.map((k) => (
              <div
                key={k}
                style={{
                  textAlign: 'center',
                  padding: '6px 4px',
                  border: '1px solid var(--concrete-dark)',
                }}
              >
                <div style={{ fontFamily: '"Special Elite", serif', fontSize: 30, color: 'var(--amber)' }}>
                  {state.attrs[k]}
                </div>
                <div
                  style={{
                    fontFamily: '"Share Tech Mono", monospace',
                    fontSize: 36,
                    color: 'var(--concrete)',
                    letterSpacing: 2,
                  }}
                >
                  {k}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Proficiency dice */}
        <Section label="Proficiency Dice">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', gap: 5 }}>
              <FinalizeDie /><FinalizeDie />
            </div>
            <div>
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 36, color: 'var(--amber)', letterSpacing: 2 }}>
                2d6
              </div>
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 17, color: 'var(--concrete)', letterSpacing: 1, marginTop: 1 }}>
                Added to every roll
              </div>
            </div>
          </div>
        </Section>

        {/* Armor + weapons */}
        <Section label="Loadout">
          <Row label="Armor" value={state.armor.toUpperCase()} />
          <div style={{ marginTop: 8 }}>
            {state.weapons.map((w, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: 19,
                  color: 'var(--concrete-light)',
                  padding: '3px 0',
                  borderBottom: '1px solid var(--concrete-dark)',
                }}
              >
                <span>{w.name}</span>
                <span style={{ color: 'var(--amber-dim)' }}>{w.damage}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Skills */}
        <Section label="Skills">
          {expertSkill && (
            <div style={{ marginBottom: 8 }}>
              <div
                style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: 17,
                  color: 'var(--amber-dim)',
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}
              >
                Expert
              </div>
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 36, color: 'var(--amber)' }}>
                {expertSkill.name}
              </div>
              <div
                style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: 30,
                  color: 'var(--concrete)',
                  marginTop: 2,
                }}
              >
                {expertSkill.specializations.join(', ')}
              </div>
            </div>
          )}
          <div>
            <div
              style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: 17,
                color: 'var(--concrete)',
                letterSpacing: 3,
                textTransform: 'uppercase',
                marginBottom: 4,
              }}
            >
              Trained
            </div>
            {trainedSkills.map((s) => (
              <div
                key={s.name}
                style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: 19,
                  color: 'var(--concrete-light)',
                  padding: '2px 0',
                }}
              >
                {s.name}
              </div>
            ))}
          </div>
        </Section>

        {/* Talent */}
        <Section label="Talent">
          <div style={{ fontFamily: '"Special Elite", serif', fontSize: 30, color: 'var(--off-white)', marginBottom: 6 }}>
            {state.talent}
          </div>
          <div
            style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: 30,
              color: 'var(--concrete)',
              letterSpacing: 1,
              lineHeight: 1.6,
            }}
          >
            {state.talentDesc}
          </div>
        </Section>
      </div>

      {/* Expendables */}
      <div style={{ marginTop: 16 }}>
        <Section label="Expendables">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {expendableDetails.filter(Boolean).map((item) => (
              <div
                key={item.name}
                style={{
                  padding: '8px 12px',
                  border: '1px solid var(--concrete-dark)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontFamily: '"Special Elite", serif', fontSize: 30, color: 'var(--off-white)' }}>
                  {item.name}
                </div>
                <div
                  style={{
                    fontFamily: '"Share Tech Mono", monospace',
                    fontSize: 17,
                    color: 'var(--concrete)',
                    letterSpacing: 2,
                  }}
                >
                  {item.cat}
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Background tags */}
      <div style={{ marginTop: 16 }}>
        <Section label="Background Tags">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {state.bgTags.filter((t) => t.trim()).map((tag) => (
              <div
                key={tag}
                style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: 19,
                  color: 'var(--amber)',
                  border: '1px solid var(--amber-deep)',
                  padding: '4px 12px',
                  letterSpacing: 1,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Backstory */}
      {state.backstory && (
        <div style={{ marginTop: 16 }}>
          <Section label="Personnel Notes">
            <p
              style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: 19,
                color: 'var(--concrete)',
                letterSpacing: 1,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {state.backstory}
            </p>
          </Section>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            marginTop: 20,
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: 19,
            color: 'var(--red-stamp)',
            border: '1px solid var(--red-stamp)',
            padding: '10px 14px',
            letterSpacing: 1,
          }}
        >
          {error}
        </div>
      )}

      {/* Submit */}
      <div style={{ marginTop: 28, textAlign: 'center' }}>
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="btn btn-primary"
          style={{ fontSize: 30, padding: '12px 36px', letterSpacing: 5 }}
        >
          {submitting ? 'Filing...' : 'File Character'}
        </button>
        <div
          style={{
            marginTop: 10,
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: 17,
            color: 'var(--concrete-dark)',
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          FRC Form 7-OP — Operative Character Record
        </div>
      </div>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid var(--concrete-dark)', padding: '14px' }}>
      <div className="section-label" style={{ marginBottom: 10 }}>{label}</div>
      {children}
    </div>
  )
}

function FinalizeDie() {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="26" height="26" rx="4" fill="rgba(200,164,90,0.12)" stroke="var(--amber-dim)" strokeWidth="1.5" />
      <circle cx="9"  cy="9"  r="2.2" fill="var(--amber)" />
      <circle cx="19" cy="9"  r="2.2" fill="var(--amber)" />
      <circle cx="9"  cy="14" r="2.2" fill="var(--amber)" />
      <circle cx="19" cy="14" r="2.2" fill="var(--amber)" />
      <circle cx="9"  cy="19" r="2.2" fill="var(--amber)" />
      <circle cx="19" cy="19" r="2.2" fill="var(--amber)" />
    </svg>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
      <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 30, color: 'var(--concrete)', letterSpacing: 2 }}>
        {label.toUpperCase()}
      </span>
      <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 19, color: 'var(--off-white)', letterSpacing: 1 }}>
        {value}
      </span>
    </div>
  )
}
