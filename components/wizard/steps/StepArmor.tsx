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
      <h2 style={{ fontFamily: '"Special Elite", serif', fontSize: 36, color: 'var(--amber)', marginBottom: 8 }}>
        Armor Class
      </h2>

      <p
        style={{
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: 19,
          color: 'var(--concrete)',
          letterSpacing: 1,
          marginBottom: 28,
          lineHeight: 1.6,
        }}
      >
        Select your operative&apos;s standard protective equipment. Soak dice reduce incoming physical
        damage. Initiative modifier applies to action order.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {ARMOR_OPTIONS.map((armor) => {
          const selected = state.armor === armor.type

          return (
            <button
              key={armor.type}
              onClick={() => onChange({ armor: armor.type as ArmorType })}
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '80px 1fr auto',
                alignItems: 'center',
                gap: 16,
                padding: '18px 20px',
                border: `1px solid ${selected ? 'var(--amber)' : 'var(--concrete-dark)'}`,
                background: selected ? 'rgba(200,164,90,0.08)' : 'rgba(255,255,255,0.02)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
            >
              {/* Selected indicator + label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 14,
                    height: 14,
                    border: `1px solid ${selected ? 'var(--amber)' : 'var(--concrete-dark)'}`,
                    background: selected ? 'var(--amber-dim)' : 'transparent',
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    fontFamily: '"Special Elite", serif',
                    fontSize: 30,
                    color: selected ? 'var(--amber)' : 'var(--off-white)',
                    letterSpacing: 1,
                  }}
                >
                  {armor.label}
                </div>
              </div>

              {/* Description */}
              <div>
                <div
                  style={{
                    fontFamily: '"Share Tech Mono", monospace',
                    fontSize: 19,
                    color: selected ? 'var(--off-white)' : 'var(--concrete)',
                    letterSpacing: 1,
                    marginBottom: 3,
                  }}
                >
                  {armor.description}
                </div>
              </div>

              {/* Stats */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div
                  style={{
                    fontFamily: '"Share Tech Mono", monospace',
                    fontSize: 17,
                    color: selected ? 'var(--amber)' : 'var(--concrete-light)',
                    letterSpacing: 1,
                  }}
                >
                  {armor.soak}
                </div>
                <div
                  style={{
                    fontFamily: '"Share Tech Mono", monospace',
                    fontSize: 30,
                    color: selected ? 'var(--amber-dim)' : 'var(--concrete-dark)',
                    letterSpacing: 1,
                    marginTop: 2,
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
