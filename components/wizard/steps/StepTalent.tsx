import { WizardState } from '@/types/character'

interface Props {
  state: WizardState
  onChange: (partial: Partial<WizardState>) => void
}

export default function StepTalent({ state, onChange }: Props) {
  return (
    <div>
      <div className="section-label">Special Capabilities</div>
      <h2 style={{ fontFamily: '"Special Elite", serif', fontSize: 36, color: 'var(--amber)', marginBottom: 8 }}>
        Talent
      </h2>

      <div
        style={{
          padding: '10px 14px',
          border: '1px solid var(--amber-deep)',
          background: 'rgba(61,46,15,0.2)',
          marginBottom: 28,
        }}
      >
        <p
          style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: 19,
            color: 'var(--concrete-light)',
            letterSpacing: 1,
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          <span style={{ color: 'var(--amber)', fontWeight: 'bold' }}>RULE:</span> Talents bend or break
          a rule once per scene. Write a specific, situational ability — not a passive stat boost.
          Define when it triggers, what it does, and any limits.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label style={labelStyle}>
            Talent Name <span style={{ color: 'var(--red-stamp)' }}>*</span>
          </label>
          <input
            className="input"
            type="text"
            value={state.talent}
            onChange={(e) => onChange({ talent: e.target.value })}
            placeholder="e.g. Ghost in the Doorframe, Second Sight, Occult Pattern Recognition"
          />
        </div>

        <div>
          <label style={labelStyle}>
            Talent Description <span style={{ color: 'var(--red-stamp)' }}>*</span>
          </label>
          <textarea
            className="input"
            value={state.talentDesc}
            onChange={(e) => onChange({ talentDesc: e.target.value })}
            placeholder="Once per scene, when you [trigger condition], [effect]. [Any limits or costs]."
            style={{ minHeight: 120 }}
          />
        </div>
      </div>

      {/* Example talent reference */}
      <div style={{ marginTop: 28 }}>
        <div className="section-label" style={{ marginBottom: 12 }}>Examples from reference builds</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {EXAMPLE_TALENTS.map((ex) => (
            <div
              key={ex.name}
              style={{
                padding: '10px 14px',
                border: '1px solid var(--concrete-dark)',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              <div
                style={{
                  fontFamily: '"Special Elite", serif',
                  fontSize: 30,
                  color: 'var(--off-white)',
                  marginBottom: 4,
                }}
              >
                {ex.name}
              </div>
              <div
                style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: 30,
                  color: 'var(--concrete)',
                  letterSpacing: 1,
                  lineHeight: 1.5,
                }}
              >
                {ex.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const EXAMPLE_TALENTS = [
  {
    name: 'Occult Pattern Recognition',
    desc: 'Once per scene, when you succeed on an Occult or Parapsychology roll, you may ask one extra connecting question. The GM must reveal a useful link, pattern, or clue.',
  },
  {
    name: 'Ghost in the Doorframe',
    desc: 'Once per scene, the first time you fail a Stealth roll, treat it as a partial success: you get into position, but the GM introduces a lesser complication instead of full detection.',
  },
  {
    name: 'Second Sight',
    desc: "Once per scene, before making a roll, ask the GM for a brief premonition. If you follow the vision's guidance, gain +1 die on the next relevant roll.",
  },
]

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: '"Share Tech Mono", monospace',
  fontSize: 30,
  letterSpacing: 3,
  color: 'var(--amber-dim)',
  textTransform: 'uppercase',
  marginBottom: 6,
}
