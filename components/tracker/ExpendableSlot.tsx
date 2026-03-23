import { Expendable } from '@/types/character'
import { EXPENDABLES } from '@/lib/game-data'

interface Props {
  expendables: Expendable[]
  onChange: (expendables: Expendable[]) => void
}

export default function ExpendableSlot({ expendables, onChange }: Props) {
  function toggle(name: string) {
    onChange(expendables.map((e) => (e.name === name ? { ...e, used: !e.used } : e)))
  }

  return (
    <div>
      <div className="section-label">Expendables</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {expendables.map((item) => {
          const detail = EXPENDABLES.find((e) => e.name === item.name)
          return (
            <button
              key={item.name}
              onClick={() => toggle(item.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                border: `1px solid ${item.used ? 'var(--concrete-dark)' : 'var(--amber-dim)'}`,
                background: item.used ? 'rgba(255,255,255,0.01)' : 'rgba(200,164,90,0.05)',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                opacity: item.used ? 0.55 : 1,
                transition: 'all 0.15s',
                position: 'relative',
              }}
            >
              {/* Status indicator */}
              <div
                style={{
                  width: 10,
                  height: 10,
                  border: `1px solid ${item.used ? 'var(--concrete-dark)' : 'var(--amber)'}`,
                  background: item.used ? 'transparent' : 'var(--amber-dim)',
                  flexShrink: 0,
                }}
              />

              {/* Name + category */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: '"Special Elite", serif',
                    fontSize: 19,
                    color: item.used ? 'var(--concrete)' : 'var(--off-white)',
                    letterSpacing: 1,
                    textDecoration: item.used ? 'line-through' : 'none',
                  }}
                >
                  {item.name}
                </div>
                {detail && (
                  <div
                    style={{
                      fontFamily: '"Share Tech Mono", monospace',
                      fontSize: 17,
                      color: 'var(--concrete-dark)',
                      letterSpacing: 2,
                      marginTop: 2,
                    }}
                  >
                    {detail.cat}
                  </div>
                )}
              </div>

              {/* Depleted stamp */}
              {item.used && (
                <div
                  className="stamp stamp-rotated"
                  style={{
                    fontSize: 17,
                    letterSpacing: 3,
                    padding: '1px 6px',
                    opacity: 0.7,
                    position: 'absolute',
                    right: 14,
                    top: '50%',
                    transform: 'translateY(-50%) rotate(-4deg)',
                  }}
                >
                  Depleted
                </div>
              )}
            </button>
          )
        })}
      </div>
      <div
        style={{
          marginTop: 6,
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: 17,
          color: 'var(--concrete-dark)',
          letterSpacing: 1,
        }}
      >
        Click to toggle depleted state.
      </div>
    </div>
  )
}
