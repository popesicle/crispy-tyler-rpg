import { Expendable } from '@/types/character'
import { EXPENDABLES } from '@/lib/game-data'
import { cn } from '@/lib/cn'

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
      <div className="flex flex-col gap-1">
        {expendables.map((item) => {
          const detail = EXPENDABLES.find((e) => e.name === item.name)
          return (
            <button
              key={item.name}
              onClick={() => toggle(item.name)}
              style={{
                background: item.used ? 'rgba(255,255,255,0.01)' : 'rgba(200,164,90,0.05)',
                opacity: item.used ? 0.55 : 1,
              }}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 border transition-all duration-150 cursor-pointer text-left w-full relative',
                item.used ? 'border-concrete-dark' : 'border-amber-dim'
              )}
            >
              {/* Status indicator */}
              <div
                className={cn(
                  'w-2.5 h-2.5 border shrink-0 rounded-full',
                  item.used ? 'border-concrete-dark bg-transparent' : 'border-amber bg-amber-dim'
                )}
              />

              {/* Name + category */}
              <div className="flex-1">
                <div
                  className={cn(
                    'font-display text-lg tracking-[1px]',
                    item.used ? 'text-concrete line-through' : 'text-off-white'
                  )}
                >
                  {item.name}
                </div>
                {detail && (
                  <div className="font-mono text-base text-concrete-dark tracking-[2px] mt-0.5">
                    {detail.cat}
                  </div>
                )}
              </div>

              {/* Depleted stamp */}
              {item.used && (
                <div
                  className="stamp stamp-rotated text-base tracking-[3px] px-1.5 py-0.5 opacity-70 absolute right-3.5 top-1/2 -translate-y-1/2 -rotate-1"
                >
                  Depleted
                </div>
              )}
            </button>
          )
        })}
      </div>
      <div className="mt-1.5 font-mono text-base text-concrete-dark tracking-[1px]">
        Click to toggle depleted state.
      </div>
    </div>
  )
}
