'use client'

import { useState } from 'react'
import { Clock } from '@/types/character'
import { cn } from '@/lib/cn'

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
      <div className="flex items-center justify-between mb-3">
        <div className="section-label m-0">Clocks</div>
        {!adding && (
          <button
            className="btn text-xs tracking-[2px] px-[10px] py-0.75"
            onClick={() => setAdding(true)}
          >
            + Add Clock
          </button>
        )}
      </div>

      {/* Add clock form */}
      {adding && (
        <div className="px-3.5 py-3.5 border border-amber-deep bg-[rgba(61,46,15,0.2)] mb-3">
          <div className="flex flex-col gap-2.5">
            <input
              className="input"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Clock name (e.g. Ritual Complete, Heat Level)"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && addClock()}
            />

            <div className="flex gap-2 flex-wrap">
              <div className="flex gap-1">
                {(['progress', 'threat'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setNewType(t)}
                    className={`font-mono text-sm tracking-[2px] px-[10px] py-1 uppercase cursor-pointer ${
                      newType === t
                        ? t === 'progress'
                          ? 'border border-olive bg-[rgba(107,122,62,0.15)] text-olive'
                          : 'border border-red-stamp bg-[rgba(139,26,26,0.15)] text-red-stamp'
                        : 'border border-concrete-dark bg-transparent text-concrete'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex gap-1">
                {([4, 6, 8] as const).map((n) => (
                  <button
                    key={n}
                    onClick={() => setNewSegments(n)}
                    className={`font-mono text-sm tracking-[2px] px-[10px] py-1 cursor-pointer ${
                      newSegments === n
                        ? 'border border-amber-dim bg-[rgba(200,164,90,0.12)] text-amber'
                        : 'border border-concrete-dark bg-transparent text-concrete'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button className="btn btn-primary text-sm tracking-[2px] px-3.5 py-1.25" onClick={addClock}>
                Add
              </button>
              <button className="btn text-sm tracking-[2px] px-3.5 py-1.25" onClick={() => { setAdding(false); setNewName('') }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clock list */}
      {clocks.length === 0 && !adding && (
        <div className="font-mono text-3xl text-concrete-dark tracking-[2px] text-center py-4 border border-concrete-dark">
          No active clocks.
        </div>
      )}

      <div className="flex flex-wrap gap-4">
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
      className={cn(
        'border bg-white/[0.02] px-3 py-3 flex flex-col items-center gap-1.5 min-w-[120px]',
        isProgress ? 'border-olive-dim' : 'border-red-stamp'
      )}
    >
      {/* Type badge */}
      <div
        className={cn(
          'font-mono text-3xl tracking-[3px] uppercase',
          isProgress ? 'text-olive' : 'text-red-stamp'
        )}
      >
        {clock.type}
      </div>

      {/* SVG clock face */}
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="cursor-pointer"
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
      <div className="font-mono text-3xl text-concrete tracking-[1px]">
        {clock.filled}/{clock.segments}
      </div>

      {/* Name */}
      <div className="font-display text-3xl text-off-white text-center tracking-[1px]">
        {clock.name}
      </div>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="btn btn-danger text-3xl px-2 py-0.5 tracking-[2px]"
      >
        Remove
      </button>
    </div>
  )
}
