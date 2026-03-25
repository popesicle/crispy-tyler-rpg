import { SKILLS, AURAS, WORDS_OF_POWER, ARMOR_OPTIONS, EXPENDABLES } from '@/lib/game-data'

export default function ReferencePage() {
  return (
    <div>
      <div className="section-label">Quick Reference</div>
      <h1 className="font-display text-4xl text-amber mb-7 tracking-[2px]">
        Field Reference
      </h1>

      {/* Armor */}
      <Section label="Armor">
        <div className="flex flex-col gap-1">
          {ARMOR_OPTIONS.map((a) => (
            <div key={a.type} className="flex gap-3 p-2 border border-concrete-dark">
              <div className="font-display text-lg text-off-white min-w-[70px]">{a.label}</div>
              <div className="font-mono text-lg text-amber-dim">{a.soak}</div>
              <div className="font-mono text-lg text-concrete">{a.modifier}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Auras */}
      <Section label="Weird Operations — Auras">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-2">
          {AURAS.map((a) => (
            <div key={a.name} className="p-2.5 border border-concrete-dark">
              <div className="font-display text-3xl text-amber mb-1">{a.name}</div>
              <div className="font-mono text-3xl text-concrete-light leading-relaxed mb-1">{a.effect}</div>
              <div className="font-mono text-base text-red-stamp tracking-[1px]">Cost: {a.cost}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Words of Power */}
      <Section label="Weird Operations — Words of Power">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-1.5">
          {WORDS_OF_POWER.map((w) => (
            <div key={w.name} className="p-2 border border-concrete-dark">
              <div className="font-display text-3xl text-off-white mb-0.5">{w.name}</div>
              <div className="font-mono text-3xl text-concrete leading-relaxed">{w.effect}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Skills */}
      <Section label="Skills">
        {(['Physical', 'Investigation', 'Social', 'Weird'] as const).map((cat) => (
          <div key={cat} className="mb-4">
            <div className="font-mono text-base tracking-[3px] text-amber-dim uppercase mb-1.5">{cat}</div>
            <div className="flex flex-col gap-0.5">
              {SKILLS.filter((s) => s.cat === cat).map((s) => (
                <div key={s.name} className="flex gap-3 p-1.5 border border-concrete-dark">
                  <div className="font-mono text-4xl text-off-white min-w-[220px]">{s.name}</div>
                  <div className="font-mono text-base text-amber-dim tracking-[1px] self-center">{s.attr}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Section>

      {/* Expendables */}
      <Section label="Expendables Deck">
        <div className="flex flex-col gap-1">
          {EXPENDABLES.map((e) => (
            <div key={e.name} className="p-2.5 border border-concrete-dark">
              <div className="flex gap-2.5 items-baseline mb-1">
                <div className="font-display text-3xl text-off-white">{e.name}</div>
                <div className="font-mono text-base text-concrete-dark tracking-[2px]">{e.cat}</div>
              </div>
              <div className="font-mono text-3xl text-concrete-light leading-relaxed mb-0.5">{e.effect}</div>
              <div className="font-mono text-3xl text-red-stamp leading-relaxed">Drawback: {e.drawback}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <div className="section-label mb-3">{label}</div>
      {children}
    </div>
  )
}
