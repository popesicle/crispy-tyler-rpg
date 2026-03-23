interface Props {
  type: 'fatigue' | 'stress'
  value: number
  max: number
  onChange: (val: number) => void
}

export default function ResourceBar({ type, value, max, onChange }: Props) {
  const isFatigue = type === 'fatigue'

  const badge = isFatigue
    ? value > max
      ? { label: 'DOWN', color: '#b02020' }
      : value >= max
      ? { label: 'WOUNDED', color: 'var(--red-stamp)' }
      : null
    : value >= max
    ? { label: 'CRACKING', color: 'var(--red-stamp)' }
    : value >= max - 1 && max > 1
    ? { label: 'STRESSED', color: '#c06020' }
    : null

  // Display max+1 pips for fatigue to allow DOWN state
  const displayMax = isFatigue ? max + 1 : max

  function handlePip(i: number) {
    // clicking last filled pip = decrement
    const newVal = value === i + 1 ? i : i + 1
    onChange(newVal)
  }

  const fillColor = isFatigue ? 'var(--amber-dim)' : 'var(--red-stamp)'
  const overflowColor = '#b02020'

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div className="section-label" style={{ margin: 0 }}>
          {isFatigue ? `Fatigue (CON: ${max})` : `Stress (WIS: ${max})`}
        </div>
        {badge && (
          <div
            style={{
              fontFamily: '"Special Elite", serif',
              fontSize: 14,
              letterSpacing: 3,
              color: badge.color,
              border: `1px solid ${badge.color}`,
              padding: '2px 8px',
              textTransform: 'uppercase',
            }}
          >
            {badge.label}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
        {Array.from({ length: displayMax }, (_, i) => {
          const isOverflow = isFatigue && i >= max
          const filled = i < value
          return (
            <button
              key={i}
              onClick={() => handlePip(i)}
              title={isOverflow ? 'DOWN — exceeded track' : undefined}
              style={{
                width: 22,
                height: 22,
                border: `1px solid ${
                  isOverflow
                    ? '#b02020'
                    : filled
                    ? isFatigue
                      ? 'var(--amber)'
                      : '#b02020'
                    : 'var(--concrete-dark)'
                }`,
                background: filled
                  ? isOverflow
                    ? overflowColor
                    : fillColor
                  : 'transparent',
                cursor: 'pointer',
                padding: 0,
                transition: 'background 0.1s, border-color 0.1s',
                // overflow pip gets an X marker
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: 14,
                color: filled ? 'transparent' : 'var(--concrete-dark)',
              }}
            >
              {isOverflow && !filled ? '×' : ''}
            </button>
          )
        })}

        {/* Reset button */}
        <button
          onClick={() => onChange(0)}
          style={{
            marginLeft: 6,
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: 12,
            letterSpacing: 2,
            color: 'var(--concrete-dark)',
            background: 'transparent',
            border: '1px solid var(--concrete-dark)',
            padding: '2px 6px',
            cursor: 'pointer',
            textTransform: 'uppercase',
          }}
        >
          Reset
        </button>
      </div>

      {isFatigue && (
        <div
          style={{
            marginTop: 6,
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: 12,
            color: 'var(--concrete-dark)',
            letterSpacing: 1,
          }}
        >
          At {max}: <span style={{ color: 'var(--red-stamp)' }}>WOUNDED</span> (−1 die physical) &nbsp;|&nbsp; Overflow:{' '}
          <span style={{ color: '#b02020' }}>DOWN</span>
        </div>
      )}
    </div>
  )
}
