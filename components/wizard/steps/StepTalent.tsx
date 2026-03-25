import { WizardState } from '@/types/character'

interface Props {
  state: WizardState
  onChange: (partial: Partial<WizardState>) => void
}

export default function StepTalent({ state, onChange }: Props) {
  return (
    <div>
      <div className="section-label">Special Capabilities</div>
      <h2 className="font-display text-4xl text-amber mb-2">
        Talent
      </h2>

      <div className="p-3 border border-amber-deep bg-amber-deep/20 mb-7">
        <p
          className="font-mono text-base text-concrete-light tracking-wide m-0 leading-relaxed"
        >
          <span className="text-amber font-bold">RULE:</span> Talents bend or break
          a rule once per scene. Write a specific, situational ability — not a passive stat boost.
          Define when it triggers, what it does, and any limits.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <div>
          <label className="font-mono text-2xl tracking-[3px] text-amber-dim uppercase block mb-1.5">
            Talent Name <span className="text-red-stamp">*</span>
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
          <label className="font-mono text-2xl tracking-[3px] text-amber-dim uppercase block mb-1.5">
            Talent Description <span className="text-red-stamp">*</span>
          </label>
          <textarea
            className="input min-h-[120px]"
            value={state.talentDesc}
            onChange={(e) => onChange({ talentDesc: e.target.value })}
            placeholder="Once per scene, when you [trigger condition], [effect]. [Any limits or costs]."
          />
        </div>
      </div>

      {/* Example talent reference */}
      <div className="mt-7">
        <div className="section-label mb-3">Examples from reference builds</div>
        <div className="flex flex-col gap-1.5">
          {EXAMPLE_TALENTS.map((ex) => (
            <div
              key={ex.name}
              className="p-3 border border-concrete-dark bg-white/[0.02]"
            >
              <div className="font-display text-2xl text-off-white mb-1">
                {ex.name}
              </div>
              <div className="font-mono text-xl text-concrete tracking-wide leading-relaxed">
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
