import { WizardState, ArmorType } from '@/types/character'
import { ARMOR_OPTIONS } from '@/lib/game-data'
import { cn } from '@/lib/cn'

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
                gridTemplateColumns: '80px 1fr auto',
              }}
              className={cn(
                'w-full grid gap-4 px-5 py-[18px] border transition-all duration-150 items-center text-left',
                selected ? 'border-amber bg-[rgba(200,164,90,0.08)]' : 'border-concrete-dark bg-white/[0.02]'
              )}
            >
              {/* Selected indicator + label */}
              <div className="flex items-center gap-2.5">
                <div
                  className={cn(
                    'border flex-shrink-0 w-[14px] h-[14px]',
                    selected ? 'border-amber bg-amber-dim' : 'border-concrete-dark bg-transparent'
                  )}
                />
                <div className={cn(
                  'font-display text-2xl tracking-wide',
                  selected ? 'text-amber' : 'text-off-white'
                )}>
                  {armor.label}
                </div>
              </div>

              {/* Description */}
              <div>
                <div
                  className={cn(
                    'font-mono text-base tracking-wide mb-0.5',
                    selected ? 'text-off-white' : 'text-concrete'
                  )}
                >
                  {armor.description}
                </div>
              </div>

              {/* Stats */}
              <div className="text-right flex-shrink-0">
                <div
                  className={cn(
                    'font-mono text-sm tracking-wide',
                    selected ? 'text-amber' : 'text-concrete-light'
                  )}
                >
                  {armor.soak}
                </div>
                <div
                  className={cn(
                    'font-mono text-2xl tracking-wide mt-0.5',
                    selected ? 'text-amber-dim' : 'text-concrete-dark'
                  )}
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
