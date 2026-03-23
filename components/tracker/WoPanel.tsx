import { AURAS, WORDS_OF_POWER } from '@/lib/game-data'

interface Props {
  activeAuras: string[]
  onChange: (activeAuras: string[]) => void
}

export default function WoPanel({ activeAuras, onChange }: Props) {
  function toggleAura(name: string) {
    if (activeAuras.includes(name)) {
      onChange(activeAuras.filter((a) => a !== name))
    } else {
      onChange([...activeAuras, name])
    }
  }

  return (
    <div>
      <div className="section-label">Weird Operations</div>

      {/* Auras */}
      <div
        style={{
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: 17,
          letterSpacing: 3,
          color: 'var(--amber-dim)',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}
      >
        Auras — Toggle Active
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6, marginBottom: 20 }}>
        {AURAS.map((aura) => {
          const active = activeAuras.includes(aura.name)
          return (
            <button
              key={aura.name}
              onClick={() => toggleAura(aura.name)}
              style={{
                padding: '12px',
                border: `1px solid ${active ? 'var(--amber)' : 'var(--concrete-dark)'}`,
                background: active ? 'rgba(200,164,90,0.1)' : 'rgba(255,255,255,0.02)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    border: `1px solid ${active ? 'var(--amber)' : 'var(--concrete-dark)'}`,
                    background: active ? 'var(--amber-dim)' : 'transparent',
                    borderRadius: '50%',
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    fontFamily: '"Special Elite", serif',
                    fontSize: 30,
                    color: active ? 'var(--amber)' : 'var(--concrete)',
                    letterSpacing: 1,
                  }}
                >
                  {aura.name}
                </div>
              </div>
              <div
                style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: 17,
                  color: active ? 'var(--concrete-light)' : 'var(--concrete-dark)',
                  letterSpacing: 1,
                  lineHeight: 1.5,
                  marginBottom: 4,
                }}
              >
                {aura.effect}
              </div>
              <div
                style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: 17,
                  color: active ? 'var(--red-stamp)' : 'var(--concrete-dark)',
                  letterSpacing: 1,
                }}
              >
                Cost: {aura.cost}
              </div>
            </button>
          )
        })}
      </div>

      {/* Words of Power — reference only */}
      <div
        style={{
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: 17,
          letterSpacing: 3,
          color: 'var(--concrete)',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}
      >
        Words of Power — Reference
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 4 }}>
        {WORDS_OF_POWER.map((word) => (
          <div
            key={word.name}
            style={{
              padding: '8px 10px',
              border: '1px solid var(--concrete-dark)',
              background: 'rgba(255,255,255,0.01)',
            }}
          >
            <div
              style={{
                fontFamily: '"Special Elite", serif',
                fontSize: 17,
                color: 'var(--off-white)',
                letterSpacing: 1,
                marginBottom: 3,
              }}
            >
              {word.name}
            </div>
            <div
              style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: 17,
                color: 'var(--concrete)',
                letterSpacing: 1,
                lineHeight: 1.5,
              }}
            >
              {word.effect}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
