import { cn } from '@/lib/cn'

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
      <div className="flex items-center justify-between mb-2">
        <div className="section-label m-0">
          {isFatigue ? `Fatigue (CON: ${max})` : `Stress (WIS: ${max})`}
        </div>
        {badge && (
          <div
            className={cn(
              'font-display text-sm tracking-[3px] border px-2 py-0.5 uppercase',
              badge.color === 'var(--red-stamp)' && 'border-red-stamp text-red-stamp',
              badge.color === '#c06020' && 'text-orange-600 border-orange-600'
            )}
            style={badge.color === '#b02020' ? { borderColor: '#b02020', color: '#b02020' } : undefined}
          >
            {badge.label}
          </div>
        )}
      </div>

      <div className="flex gap-1 flex-wrap items-center">
        {Array.from({ length: displayMax }, (_, i) => {
          const isOverflow = isFatigue && i >= max
          const filled = i < value
          const borderColor = isOverflow
            ? '#b02020'
            : filled
            ? isFatigue
              ? 'var(--amber)'
              : '#b02020'
            : 'var(--concrete-dark)'
          return (
            <button
              key={i}
              onClick={() => handlePip(i)}
              title={isOverflow ? 'DOWN — exceeded track' : undefined}
              style={{
                borderColor,
                background: filled ? (isOverflow ? overflowColor : fillColor) : 'transparent',
                color: filled ? 'transparent' : 'var(--concrete-dark)',
              }}
              className={cn(
                'w-[22px] h-[22px] border p-0 transition-all duration-100 flex items-center justify-center font-mono text-sm cursor-pointer'
              )}
            >
              {isOverflow && !filled ? '×' : ''}
            </button>
          )
        })}

        {/* Reset button */}
        <button
          onClick={() => onChange(0)}
          className="ml-1.5 font-mono text-xs tracking-[2px] text-concrete-dark bg-transparent border border-concrete-dark px-1.5 py-0.5 cursor-pointer uppercase"
        >
          Reset
        </button>
      </div>

      {isFatigue && (
        <div className="mt-1.5 font-mono text-xs text-concrete-dark tracking-[1px]">
          At {max}: <span className="text-red-stamp">WOUNDED</span> (−1 die physical) &nbsp;|&nbsp; Overflow:{' '}
          <span style={{ color: '#b02020' }}>DOWN</span>
        </div>
      )}
    </div>
  )
}
