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
        className="bg-red-stamp text-off-white font-display text-sm tracking-[6px] uppercase text-center px-0 py-1.5 mb-5 opacity-90"
      >
        Federal Remediation Commission — Personnel File
      </div>

      <div className="flex items-baseline gap-4 mb-6">
        <h2
          className="font-display text-4xl text-amber m-0 tracking-[2px]"
        >
          {state.name || '—'}
        </h2>
        {state.codename && (
          <div
            className="font-mono text-sm text-amber-dim tracking-[2px]"
          >
            &ldquo;{state.codename}&rdquo;
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Attributes */}
        <Section label="Attributes">
          <div className="grid grid-cols-3 gap-1">
            {ATTR_KEYS.map((k) => (
              <div
                key={k}
                className="text-center p-1.5 border border-concrete-dark"
              >
                <div className="font-display text-2xl text-amber">
                  {state.attrs[k]}
                </div>
                <div
                  className="font-mono text-4xl text-concrete tracking-[2px]"
                >
                  {k}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Proficiency dice */}
        <Section label="Proficiency Dice">
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1.25">
              <FinalizeDie /><FinalizeDie />
            </div>
            <div>
              <div className="font-mono text-4xl text-amber tracking-[2px]">
                2d6
              </div>
              <div className="font-mono text-sm text-concrete tracking-wide mt-0.25">
                Added to every roll
              </div>
            </div>
          </div>
        </Section>

        {/* Armor + weapons */}
        <Section label="Loadout">
          <Row label="Armor" value={state.armor.toUpperCase()} />
          <div className="mt-2">
            {state.weapons.map((w, i) => (
              <div
                key={i}
                className="flex justify-between font-mono text-base text-concrete-light py-0.5 px-0 border-b border-concrete-dark"
              >
                <span>{w.name}</span>
                <span className="text-amber-dim">{w.damage}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Skills */}
        <Section label="Skills">
          {expertSkill && (
            <div className="mb-2">
              <div
                className="font-mono text-sm text-amber-dim tracking-[3px] uppercase mb-1"
              >
                Expert
              </div>
              <div className="font-mono text-4xl text-amber">
                {expertSkill.name}
              </div>
              <div
                className="font-mono text-2xl text-concrete mt-0.5"
              >
                {expertSkill.specializations.join(', ')}
              </div>
            </div>
          )}
          <div>
            <div
              className="font-mono text-base text-concrete tracking-[3px] uppercase mb-1"
            >
              Trained
            </div>
            {trainedSkills.map((s) => (
              <div
                key={s.name}
                className="font-mono text-base text-concrete-light py-0.5 px-0"
              >
                {s.name}
              </div>
            ))}
          </div>
        </Section>

        {/* Talent */}
        <Section label="Talent">
          <div className="font-display text-2xl text-off-white mb-1.5">
            {state.talent}
          </div>
          <div
            className="font-mono text-2xl text-concrete tracking-wide leading-relaxed"
          >
            {state.talentDesc}
          </div>
        </Section>
      </div>

      {/* Expendables */}
      <div className="mt-4">
        <Section label="Expendables">
          <div className="flex flex-col gap-1">
            {expendableDetails.filter(Boolean).map((item) => (
              <div
                key={item.name}
                className="p-2 border border-concrete-dark flex justify-between items-center"
              >
                <div className="font-display text-2xl text-off-white">
                  {item.name}
                </div>
                <div
                  className="font-mono text-sm text-concrete tracking-[2px]"
                >
                  {item.cat}
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Background tags */}
      <div className="mt-4">
        <Section label="Background Tags">
          <div className="flex gap-2 flex-wrap">
            {state.bgTags.filter((t) => t.trim()).map((tag) => (
              <div
                key={tag}
                className="font-mono text-base text-amber border border-amber-deep px-3 py-1 tracking-wide"
              >
                {tag}
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Backstory */}
      {state.backstory && (
        <div className="mt-4">
          <Section label="Personnel Notes">
            <p
              className="font-mono text-base text-concrete tracking-wide leading-relaxed m-0"
            >
              {state.backstory}
            </p>
          </Section>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          className="mt-5 font-mono text-base text-red-stamp border border-red-stamp p-3 tracking-wide"
        >
          {error}
        </div>
      )}

      {/* Submit */}
      <div className="mt-7 text-center">
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="btn btn-primary text-2xl px-9 py-3 tracking-[5px]"
        >
          {submitting ? 'Filing...' : 'File Character'}
        </button>
        <div
          className="mt-2.5 font-mono text-sm text-concrete-dark tracking-[2px] uppercase"
        >
          FRC Form 7-OP — Operative Character Record
        </div>
      </div>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border border-concrete-dark p-3.5">
      <div className="section-label mb-2.5">{label}</div>
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
    <div className="flex justify-between mb-1">
      <span className="font-mono text-2xl text-concrete tracking-[2px]">
        {label.toUpperCase()}
      </span>
      <span className="font-mono text-base text-off-white tracking-wide">
        {value}
      </span>
    </div>
  )
}
