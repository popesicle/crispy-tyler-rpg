'use client'

import { WizardState, Weapon } from '@/types/character'

interface Props {
  state: WizardState
  onChange: (partial: Partial<WizardState>) => void
}

const PISTOL: Weapon = { name: 'Service Pistol', damage: '2 Fatigue' }
const DAMAGE_OPTIONS = ['2 Fatigue', '3 Fatigue']

export default function StepWeapons({ state, onChange }: Props) {
  const pistol = state.weapons.find((w) => w.name === PISTOL.name) ?? PISTOL
  const primary = state.weapons.find((w) => w.name !== PISTOL.name) ?? null

  function updatePrimary(fields: Partial<Weapon>) {
    const currentPrimary = primary ?? { name: '', damage: '2 Fatigue' }
    const updated = { ...currentPrimary, ...fields }

    if (updated.name.trim()) {
      onChange({ weapons: [pistol, updated] })
    } else {
      onChange({ weapons: [pistol] })
    }
  }

  return (
    <div>
      <div className="section-label">Assigned Loadout</div>
      <h2 className="font-display text-4xl text-amber mb-2">
        Weapons
      </h2>

      <p className="font-mono text-base text-concrete tracking-wide mb-7 leading-relaxed">
        All operatives carry a standard-issue sidearm. Optionally add one primary weapon from
        your prior service or field experience.
      </p>

      {/* Standard issue pistol — locked */}
      <div className="mb-5">
        <div className="section-label mb-2.5">Standard Issue (cannot remove)</div>
        <div
          className="flex items-center justify-between px-[18px] py-3.5 border border-olive-dim bg-olive-dim/10"
        >
          <div>
            <div
              className="font-display text-4xl text-off-white tracking-wide"
            >
              {PISTOL.name}
            </div>
            <div
              className="font-mono text-sm text-concrete tracking-[2px] mt-0.5"
            >
              Standard FRC field sidearm
            </div>
          </div>
          <div
            className="font-mono text-4xl text-olive tracking-[2px] border border-olive-dim px-2.5 py-0.5"
          >
            {PISTOL.damage}
          </div>
        </div>
      </div>

      {/* Primary weapon */}
      <div>
        <div className="section-label mb-2.5">
          Primary Weapon <span className="text-concrete text-sm">(optional)</span>
        </div>
        <div
          className="p-[18px] border border-concrete-dark bg-white/[0.02] flex flex-col gap-3.5"
        >
          <div>
            <label className="font-mono text-2xl tracking-[3px] text-amber-dim uppercase block mb-1.5">Weapon Name</label>
            <input
              className="input"
              type="text"
              value={primary?.name ?? ''}
              onChange={(e) => updatePrimary({ name: e.target.value })}
              placeholder="e.g. Remington 870, M16, Hunting Knife"
            />
          </div>

          <div>
            <label className="font-mono text-2xl tracking-[3px] text-amber-dim uppercase block mb-1.5">Damage</label>
            <div className="flex gap-1.5">
              {DAMAGE_OPTIONS.map((opt) => {
                const sel = (primary?.damage ?? '2 Fatigue') === opt
                return (
                  <button
                    key={opt}
                    onClick={() => updatePrimary({ damage: opt })}
                    style={{
                      borderColor: sel ? 'var(--amber)' : 'var(--concrete-dark)',
                      background: sel ? 'rgba(200,164,90,0.12)' : 'transparent',
                      color: sel ? 'var(--amber)' : 'var(--concrete)',
                    }}
                    className="font-mono text-4xl px-3.5 py-1.5 border cursor-pointer tracking-wide"
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      {state.weapons.length > 0 && (
        <div className="mt-5">
          <div className="section-label mb-2">Loadout Summary</div>
          <div className="flex flex-col gap-0.5">
            {state.weapons.map((w, i) => (
              <div
                key={i}
                className="flex justify-between px-3.5 py-2 border border-concrete-dark font-mono text-4xl"
              >
                <span className="text-off-white">{w.name}</span>
                <span className="text-amber-dim">{w.damage}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
