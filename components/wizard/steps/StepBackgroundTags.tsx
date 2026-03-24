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
      <h2 className="font-display text-4xl text-amber mb-2">
        Background Tags
      </h2>

      <div className="p-3 border border-amber-deep bg-amber-deep/20 mb-7">
        <p
          className="font-mono text-base text-concrete-light tracking-wide m-0 leading-relaxed"
        >
          <span className="text-amber">RULE:</span> Once per scene, when a background tag
          clearly applies to the situation, you gain <strong>+1 die or 1 reroll</strong>.
          Tags represent who you were before the FRC — prior professions, defining experiences,
          unusual circumstances.
        </p>
      </div>

      <div className="mb-5">
        <div className="section-label mb-3">
          Your Tags ({tags.filter(t => t.trim()).length}/{MAX} — {MIN} required)
        </div>

        <div className="flex flex-col gap-2">
          {tags.map((tag, i) => (
            <div key={i} className="flex gap-2 items-center">
              <div
                className="font-mono text-base text-amber-dim tracking-[2px] min-w-5 flex-shrink-0"
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
                  className="btn btn-danger text-2xl px-2.5 py-1.5 flex-shrink-0"
                  onClick={() => removeTag(i)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        {tags.length < MAX && (
          <button
            className="btn mt-2.5 text-2xl tracking-[2px]"
            onClick={addTag}
          >
            + Add Second Tag
          </button>
        )}
      </div>

      {/* Examples */}
      <div>
        <div className="section-label mb-2.5">Examples</div>
        <div className="flex flex-wrap gap-1.5">
          {EXAMPLE_TAGS.map((tag) => (
            <div
              key={tag}
              className="font-mono text-2xl text-concrete border border-concrete-dark px-2.5 py-0.5 tracking-wide"
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
