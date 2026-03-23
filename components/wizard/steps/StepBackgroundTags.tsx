'use client'

import { WizardState } from '@/types/character'
import { CREATION_RULES } from '@/lib/game-data'

interface Props {
  state: WizardState
  onChange: (partial: Partial<WizardState>) => void
}

const { backgroundTags: { min: MIN, max: MAX } } = CREATION_RULES

export default function StepBackgroundTags({ state, onChange }: Props) {
  function updateTag(index: number, value: string) {
    const updated = [...state.bgTags]
    updated[index] = value
    // trim empty trailing tags
    while (updated.length > MIN && !updated[updated.length - 1]) {
      updated.pop()
    }
    onChange({ bgTags: updated })
  }

  function addTag() {
    if (state.bgTags.length < MAX) {
      onChange({ bgTags: [...state.bgTags, ''] })
    }
  }

  function removeTag(index: number) {
    if (state.bgTags.length <= MIN) return
    onChange({ bgTags: state.bgTags.filter((_, i) => i !== index) })
  }

  const tags = state.bgTags.length === 0 ? [''] : state.bgTags

  return (
    <div>
      <div className="section-label">Service Record</div>
      <h2 style={{ fontFamily: '"Special Elite", serif', fontSize: 36, color: 'var(--amber)', marginBottom: 8 }}>
        Background Tags
      </h2>

      <div
        style={{
          padding: '12px 14px',
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
          <span style={{ color: 'var(--amber)' }}>RULE:</span> Once per scene, when a background tag
          clearly applies to the situation, you gain <strong>+1 die or 1 reroll</strong>.
          Tags represent who you were before the FRC — prior professions, defining experiences,
          unusual circumstances.
        </p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div className="section-label" style={{ marginBottom: 12 }}>
          Your Tags ({tags.filter(t => t.trim()).length}/{MAX} — {MIN} required)
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {tags.map((tag, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div
                style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: 19,
                  color: 'var(--amber-dim)',
                  letterSpacing: 2,
                  minWidth: 20,
                  flexShrink: 0,
                }}
              >
                #{i + 1}
              </div>
              <input
                className="input"
                type="text"
                value={tag}
                onChange={(e) => updateTag(i, e.target.value)}
                placeholder={i === 0 ? 'e.g. Vietnam Vet (Recon), Former Academic, Odd Childhood' : 'e.g. Agency Black Ops, Former Cult Consultant'}
                style={{ flex: 1 }}
              />
              {tags.length > MIN && (
                <button
                  className="btn btn-danger"
                  onClick={() => removeTag(i)}
                  style={{ fontSize: 30, padding: '6px 10px', flexShrink: 0 }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        {tags.length < MAX && (
          <button
            className="btn"
            onClick={addTag}
            style={{ marginTop: 10, fontSize: 30, letterSpacing: 2 }}
          >
            + Add Second Tag
          </button>
        )}
      </div>

      {/* Examples */}
      <div>
        <div className="section-label" style={{ marginBottom: 10 }}>Examples</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {EXAMPLE_TAGS.map((tag) => (
            <div
              key={tag}
              style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: 30,
                color: 'var(--concrete)',
                border: '1px solid var(--concrete-dark)',
                padding: '3px 10px',
                letterSpacing: 1,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const EXAMPLE_TAGS = [
  'Vietnam Vet (Recon)',
  'Agency Black Ops',
  'Academic (Old University)',
  'Former Cult Consultant',
  'Project Subject (Government Psi Program)',
  'Odd Childhood',
  'Former NYPD Homicide',
  'Disgraced Priest',
  'Military Intelligence',
  'Rural Sheriff (Retired)',
  'War Correspondent',
  'Former Cartel Fixer',
]
