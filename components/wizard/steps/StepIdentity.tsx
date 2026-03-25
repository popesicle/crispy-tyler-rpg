import { WizardState } from '@/types/character'

interface Props {
  state: WizardState
  onChange: (partial: Partial<WizardState>) => void
}

export default function StepIdentity({ state, onChange }: Props) {
  return (
    <div>
      <div className="section-label">Personnel File</div>
      <h2 className="font-display text-[36px] text-amber mb-6">
        Agent Identity
      </h2>

      <div className="flex flex-col gap-5">
        <div>
          <label className="label-style">
            Full Name <span className="text-red-stamp">*</span>
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
          <label className="label-style">
            Codename / Field Alias{' '}
            <span className="text-concrete text-base">(optional)</span>
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
          <label className="label-style">
            Backstory / Personnel Notes{' '}
            <span className="text-concrete text-base">(optional)</span>
          </label>
          <textarea
            className="input"
            value={state.backstory}
            onChange={(e) => onChange({ backstory: e.target.value })}
            placeholder="Prior service, unusual circumstances, how you ended up in the FRC..."
          />
        </div>
      </div>

      <div className="mt-7 px-3.5 py-2.5 border border-concrete-dark bg-white/[0.01]">
        <p className="font-mono text-3xl text-concrete tracking-[1px] m-0 leading-relaxed">
          FRC INTERNAL: All operative identities are classified at CONFIDENTIAL level or above.
          Codenames are assigned by field coordinators and may differ from self-selected aliases.
        </p>
      </div>
    </div>
  )
}
