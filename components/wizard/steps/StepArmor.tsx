import { WizardState, ArmorType } from '@/types/character'
import { ARMOR_OPTIONS } from '@/lib/game-data'

interface Props {
  state: WizardState
  onChange: (partial: Partial<WizardState>) => void
}

export default function StepArmor({ state, onChange }: Props) {
  return (
    <div>
      <div className="section-label">Field Equipment</div>
      <h2 className="font-display text-4xl text-amber mb-2">
        Armor Class
      </h2>

      <p className="font-mono text-base text-concrete tracking-wide mb-7 leading-relaxed">
        Select your operative&apos;s standard protective equipment. Soak dice reduce incoming physical
        damage. Initiative modifier applies to action order.
      </p>

      <div className="flex flex-col gap-2">
        {ARMOR_OPTIONS.map((armor) => {
          const selected = state.armor === armor.type

          return (
            <button
              key={armor.type}
              onClick={() => onChange({ armor: armor.type as ArmorType })}
              style={{
                borderColor: selected ? 'var(--amber)' : 'var(--concrete-dark)',
                background: selected ? 'rgba(200,164,90,0.08)' : 'rgba(255,255,255,0.02)',
                gridTemplateColumns: '80px 1fr auto',
              }}
              className="w-full grid gap-4 px-5 py-[18px] border transition-all duration-150 items-center text-left"
            >
              {/* Selected indicator + label */}
              <div className="flex items-center gap-2.5">
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderColor: selected ? 'var(--amber)' : 'var(--concrete-dark)',
                    background: selected ? 'var(--amber-dim)' : 'transparent',
                  }}
                  className="border flex-shrink-0"
                />
                <div className="font-display text-2xl tracking-wide" style={{ color: selected ? 'var(--amber)' : 'var(--off-white)' }}>
                  {armor.label}
                </div>
              </div>

              {/* Description */}
              <div>
                <div
                  className="font-mono text-base tracking-wide mb-0.5"
                  style={{
                    color: selected ? 'var(--off-white)' : 'var(--concrete)',
                  }}
                >
                  {armor.description}
                </div>
              </div>

              {/* Stats */}
              <div className="text-right flex-shrink-0">
                <div
                  className="font-mono text-sm tracking-wide"
                  style={{
                    color: selected ? 'var(--amber)' : 'var(--concrete-light)',
                  }}
                >
                  {armor.soak}
                </div>
                <div
                  className="font-mono text-2xl tracking-wide mt-0.5"
                  style={{
                    color: selected ? 'var(--amber-dim)' : 'var(--concrete-dark)',
                  }}
                >
                  {armor.modifier}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
