import { AURAS, WORDS_OF_POWER } from '@/lib/game-data'
import { cn } from '@/lib/cn'

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
      <div className="font-mono text-base tracking-[3px] text-amber-dim uppercase mb-2">
        Auras — Toggle Active
      </div>
      <div className="grid grid-cols-2 gap-1.5 mb-5">
        {AURAS.map((aura) => {
          const active = activeAuras.includes(aura.name)
          return (
            <button
              key={aura.name}
              onClick={() => toggleAura(aura.name)}
              style={{
                background: active ? 'rgba(200,164,90,0.1)' : 'rgba(255,255,255,0.02)',
              }}
              className={cn(
                'px-3 py-3 border transition-all duration-150 cursor-pointer text-left',
                active ? 'border-amber' : 'border-concrete-dark'
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={cn(
                    'w-2 h-2 border rounded-full shrink-0',
                    active ? 'border-amber bg-amber-dim' : 'border-concrete-dark bg-transparent'
                  )}
                />
                <div
                  className={cn(
                    'font-display text-[30px] tracking-[1px]',
                    active ? 'text-amber' : 'text-concrete'
                  )}
                >
                  {aura.name}
                </div>
              </div>
              <div
                className={cn(
                  'font-mono text-base tracking-[1px] leading-relaxed mb-1',
                  active ? 'text-concrete-light' : 'text-concrete-dark'
                )}
              >
                {aura.effect}
              </div>
              <div
                className={cn(
                  'font-mono text-base tracking-[1px]',
                  active ? 'text-red-stamp' : 'text-concrete-dark'
                )}
              >
                Cost: {aura.cost}
              </div>
            </button>
          )
        })}
      </div>

      {/* Words of Power — reference only */}
      <div className="font-mono text-base tracking-[3px] text-concrete uppercase mb-2">
        Words of Power — Reference
      </div>
      <div className="grid grid-cols-2 gap-1">
        {WORDS_OF_POWER.map((word) => (
          <div
            key={word.name}
            className="px-2.5 py-2 border border-concrete-dark bg-white/[0.01]"
          >
            <div className="font-display text-base text-off-white tracking-[1px] mb-0.75">
              {word.name}
            </div>
            <div className="font-mono text-base text-concrete tracking-[1px] leading-relaxed">
              {word.effect}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
