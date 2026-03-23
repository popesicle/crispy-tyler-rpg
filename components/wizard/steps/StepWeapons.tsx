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
      <h2 style={{ fontFamily: '"Special Elite", serif', fontSize: 36, color: 'var(--amber)', marginBottom: 8 }}>
        Weapons
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
        All operatives carry a standard-issue sidearm. Optionally add one primary weapon from
        your prior service or field experience.
      </p>

      {/* Standard issue pistol — locked */}
      <div style={{ marginBottom: 20 }}>
        <div className="section-label" style={{ marginBottom: 10 }}>Standard Issue (cannot remove)</div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            border: '1px solid var(--olive-dim)',
            background: 'rgba(107,122,62,0.05)',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: '"Special Elite", serif',
                fontSize: 36,
                color: 'var(--off-white)',
                letterSpacing: 1,
              }}
            >
              {PISTOL.name}
            </div>
            <div
              style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: 17,
                color: 'var(--concrete)',
                letterSpacing: 2,
                marginTop: 2,
              }}
            >
              Standard FRC field sidearm
            </div>
          </div>
          <div
            style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: 36,
              color: 'var(--olive)',
              letterSpacing: 2,
              border: '1px solid var(--olive-dim)',
              padding: '3px 10px',
            }}
          >
            {PISTOL.damage}
          </div>
        </div>
      </div>

      {/* Primary weapon */}
      <div>
        <div className="section-label" style={{ marginBottom: 10 }}>
          Primary Weapon <span style={{ color: 'var(--concrete)', fontSize: 17 }}>(optional)</span>
        </div>
        <div
          style={{
            padding: '18px',
            border: '1px solid var(--concrete-dark)',
            background: 'rgba(255,255,255,0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <div>
            <label style={labelStyle}>Weapon Name</label>
            <input
              className="input"
              type="text"
              value={primary?.name ?? ''}
              onChange={(e) => updatePrimary({ name: e.target.value })}
              placeholder="e.g. Remington 870, M16, Hunting Knife"
            />
          </div>

          <div>
            <label style={labelStyle}>Damage</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {DAMAGE_OPTIONS.map((opt) => {
                const sel = (primary?.damage ?? '2 Fatigue') === opt
                return (
                  <button
                    key={opt}
                    onClick={() => updatePrimary({ damage: opt })}
                    style={{
                      fontFamily: '"Share Tech Mono", monospace',
                      fontSize: 36,
                      padding: '6px 14px',
                      border: `1px solid ${sel ? 'var(--amber)' : 'var(--concrete-dark)'}`,
                      background: sel ? 'rgba(200,164,90,0.12)' : 'transparent',
                      color: sel ? 'var(--amber)' : 'var(--concrete)',
                      cursor: 'pointer',
                      letterSpacing: 1,
                    }}
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
        <div style={{ marginTop: 20 }}>
          <div className="section-label" style={{ marginBottom: 8 }}>Loadout Summary</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {state.weapons.map((w, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 14px',
                  border: '1px solid var(--concrete-dark)',
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: 36,
                }}
              >
                <span style={{ color: 'var(--off-white)' }}>{w.name}</span>
                <span style={{ color: 'var(--amber-dim)' }}>{w.damage}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: '"Share Tech Mono", monospace',
  fontSize: 30,
  letterSpacing: 3,
  color: 'var(--amber-dim)',
  textTransform: 'uppercase',
  marginBottom: 6,
}
