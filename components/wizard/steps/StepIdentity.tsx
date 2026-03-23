import { WizardState } from '@/types/character'

interface Props {
  state: WizardState
  onChange: (partial: Partial<WizardState>) => void
}

export default function StepIdentity({ state, onChange }: Props) {
  return (
    <div>
      <div className="section-label">Personnel File</div>
      <h2 style={{ fontFamily: '"Special Elite", serif', fontSize: 36, color: 'var(--amber)', marginBottom: 24 }}>
        Agent Identity
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label style={labelStyle}>
            Full Name <span style={{ color: 'var(--red-stamp)' }}>*</span>
          </label>
          <input
            className="input"
            type="text"
            value={state.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Agent surname, given name"
          />
        </div>

        <div>
          <label style={labelStyle}>
            Codename / Field Alias{' '}
            <span style={{ color: 'var(--concrete)', fontSize: 17 }}>(optional)</span>
          </label>
          <input
            className="input"
            type="text"
            value={state.codename}
            onChange={(e) => onChange({ codename: e.target.value })}
            placeholder="e.g. SPECTRE, MOTH, ORACLE"
          />
        </div>

        <div>
          <label style={labelStyle}>
            Backstory / Personnel Notes{' '}
            <span style={{ color: 'var(--concrete)', fontSize: 17 }}>(optional)</span>
          </label>
          <textarea
            className="input"
            value={state.backstory}
            onChange={(e) => onChange({ backstory: e.target.value })}
            placeholder="Prior service, unusual circumstances, how you ended up in the FRC..."
            style={{ minHeight: 120 }}
          />
        </div>
      </div>

      <div
        style={{
          marginTop: 28,
          padding: '10px 14px',
          border: '1px solid var(--concrete-dark)',
          background: 'rgba(255,255,255,0.01)',
        }}
      >
        <p
          style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: 30,
            color: 'var(--concrete)',
            letterSpacing: 1,
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          FRC INTERNAL: All operative identities are classified at CONFIDENTIAL level or above.
          Codenames are assigned by field coordinators and may differ from self-selected aliases.
        </p>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: '"Share Tech Mono", monospace',
  fontSize: 30,
  letterSpacing: 3,
  color: 'var(--amber-dim)',
  textTransform: 'uppercase',
  marginBottom: 6,
}
