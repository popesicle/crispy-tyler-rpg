'use client'

import { useState } from 'react'
import { Clock } from '@/types/character'

interface Props {
  clocks: Clock[]
  onChange: (clocks: Clock[]) => void
}

export default function ClockWidget({ clocks, onChange }: Props) {
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState<'progress' | 'threat'>('progress')
  const [newSegments, setNewSegments] = useState<4 | 6 | 8>(4)

  function addClock() {
    if (!newName.trim()) return
    const clock: Clock = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      type: newType,
      segments: newSegments,
      filled: 0,
    }
    onChange([...clocks, clock])
    setNewName('')
    setNewType('progress')
    setNewSegments(4)
    setAdding(false)
  }

  function toggleSegment(id: string, i: number) {
    onChange(
      clocks.map((c) => {
        if (c.id !== id) return c
        // clicking last filled = decrement, else fill to i+1
        const filled = c.filled === i + 1 ? i : i + 1
        return { ...c, filled }
      })
    )
  }

  function deleteClock(id: string) {
    onChange(clocks.filter((c) => c.id !== id))
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div className="section-label" style={{ margin: 0 }}>Clocks</div>
        {!adding && (
          <button
            className="btn"
            onClick={() => setAdding(true)}
            style={{ fontSize: 13, letterSpacing: 2, padding: '3px 10px' }}
          >
            + Add Clock
          </button>
        )}
      </div>

      {/* Add clock form */}
      {adding && (
        <div
          style={{
            padding: '14px',
            border: '1px solid var(--amber-deep)',
            background: 'rgba(61,46,15,0.2)',
            marginBottom: 12,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              className="input"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Clock name (e.g. Ritual Complete, Heat Level)"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && addClock()}
            />

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {(['progress', 'threat'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setNewType(t)}
                    style={{
                      fontFamily: '"Share Tech Mono", monospace',
                      fontSize: 14,
                      letterSpacing: 2,
                      padding: '4px 10px',
                      border: `1px solid ${newType === t ? (t === 'progress' ? 'var(--olive)' : 'var(--red-stamp)') : 'var(--concrete-dark)'}`,
                      background: newType === t ? (t === 'progress' ? 'rgba(107,122,62,0.15)' : 'rgba(139,26,26,0.15)') : 'transparent',
                      color: newType === t ? (t === 'progress' ? 'var(--olive)' : 'var(--red-stamp)') : 'var(--concrete)',
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 4 }}>
                {([4, 6, 8] as const).map((n) => (
                  <button
                    key={n}
                    onClick={() => setNewSegments(n)}
                    style={{
                      fontFamily: '"Share Tech Mono", monospace',
                      fontSize: 14,
                      letterSpacing: 2,
                      padding: '4px 10px',
                      border: `1px solid ${newSegments === n ? 'var(--amber-dim)' : 'var(--concrete-dark)'}`,
                      background: newSegments === n ? 'rgba(200,164,90,0.12)' : 'transparent',
                      color: newSegments === n ? 'var(--amber)' : 'var(--concrete)',
                      cursor: 'pointer',
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary" onClick={addClock} style={{ fontSize: 14, letterSpacing: 2, padding: '5px 14px' }}>
                Add
              </button>
              <button className="btn" onClick={() => { setAdding(false); setNewName('') }} style={{ fontSize: 14, letterSpacing: 2, padding: '5px 14px' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clock list */}
      {clocks.length === 0 && !adding && (
        <div
          style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: 30,
            color: 'var(--concrete-dark)',
            letterSpacing: 2,
            textAlign: 'center',
            padding: '16px 0',
            border: '1px solid var(--concrete-dark)',
          }}
        >
          No active clocks.
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {clocks.map((clock) => (
          <ClockCard
            key={clock.id}
            clock={clock}
            onSegmentClick={(i) => toggleSegment(clock.id, i)}
            onDelete={() => deleteClock(clock.id)}
          />
        ))}
      </div>
    </div>
  )
}

function ClockCard({
  clock,
  onSegmentClick,
  onDelete,
}: {
  clock: Clock
  onSegmentClick: (i: number) => void
  onDelete: () => void
}) {
  const isProgress = clock.type === 'progress'
  const fillColor = isProgress ? '#6b7a3e' : '#8b1a1a'
  const SIZE = 90
  const CENTER = SIZE / 2
  const RADIUS = SIZE / 2 - 5

  function polarToCartesian(deg: number) {
    const rad = ((deg - 90) * Math.PI) / 180
    return {
      x: CENTER + RADIUS * Math.cos(rad),
      y: CENTER + RADIUS * Math.sin(rad),
    }
  }

  function segmentPath(i: number) {
    const startAngle = (i * 360) / clock.segments
    const endAngle = ((i + 1) * 360) / clock.segments
    const start = polarToCartesian(startAngle)
    const end = polarToCartesian(endAngle)
    const largeArc = 360 / clock.segments > 180 ? 1 : 0
    return `M ${CENTER} ${CENTER} L ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)} Z`
  }

  return (
    <div
      style={{
        border: `1px solid ${isProgress ? 'var(--olive-dim)' : 'var(--red-stamp)'}`,
        background: 'rgba(255,255,255,0.02)',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        minWidth: 120,
      }}
    >
      {/* Type badge */}
      <div
        style={{
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: 36,
          letterSpacing: 3,
          color: isProgress ? 'var(--olive)' : 'var(--red-stamp)',
          textTransform: 'uppercase',
        }}
      >
        {clock.type}
      </div>

      {/* SVG clock face */}
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ cursor: 'pointer' }}
      >
        {Array.from({ length: clock.segments }, (_, i) => (
          <path
            key={i}
            d={segmentPath(i)}
            fill={i < clock.filled ? fillColor : 'var(--concrete-dark)'}
            stroke="var(--bg)"
            strokeWidth="2"
            onClick={() => onSegmentClick(i)}
          />
        ))}
        {/* Center dot */}
        <circle cx={CENTER} cy={CENTER} r={4} fill="var(--bg)" />
      </svg>

      {/* Filled count */}
      <div
        style={{
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: 30,
          color: 'var(--concrete)',
          letterSpacing: 1,
        }}
      >
        {clock.filled}/{clock.segments}
      </div>

      {/* Name */}
      <div
        style={{
          fontFamily: '"Special Elite", serif',
          fontSize: 36,
          color: 'var(--off-white)',
          textAlign: 'center',
          letterSpacing: 1,
        }}
      >
        {clock.name}
      </div>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="btn btn-danger"
        style={{ fontSize: 36, padding: '2px 8px', letterSpacing: 2 }}
      >
        Remove
      </button>
    </div>
  )
}
