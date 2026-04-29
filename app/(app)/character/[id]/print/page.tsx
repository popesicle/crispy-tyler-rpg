export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { CharacterData } from '@/types/character'
import PrintTrigger from '@/components/ui/PrintTrigger'

const ATTR_KEYS = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as const

export default async function PrintPage({ params }: { params: { id: string } }) {
  const session = await auth()
  const raw = await prisma.character.findUnique({ where: { id: params.id } })

  if (!raw || raw.userId !== session!.user.id) notFound()

  const c = raw as unknown as CharacterData
  const expertSkill = c.skills.find((s) => s.level === 'expert')
  const trainedSkills = c.skills.filter((s) => s.level === 'trained')

  return (
    <>
      {/* Print button — hidden in actual print */}
      <div className="no-print px-6 py-4 border-b bg-[#f0ece0]">
        <PrintTrigger characterId={c.id} />
        <a
          href={`/character/${c.id}`}
          className="ml-4 font-mono text-3xl text-[#6b5428]"
        >
          ← Back to Tracker
        </a>
      </div>

      {/* Print sheet */}
      <div
        className="print-sheet font-mono min-h-screen px-10 py-8 bg-[var(--paper)] text-[var(--ink)]"
      >
        {/* Header */}
        <div className="mb-5 border-b-2 pb-3 border-b-[var(--ink)]">
          <div className="flex justify-between items-start">
            <div>
              <div
                className="font-display text-base tracking-[5px] uppercase mb-1 text-[#6b5428]"
              >
                Federal Remediation Commission
              </div>
              <h1
                className="font-display text-3xl m-0 tracking-[2px] text-[var(--ink)]"
              >
                {c.name}
              </h1>
              {c.codename && (
                <div className="font-mono text-3xl tracking-[2px] mt-0.5 text-[#8a6e35]">
                  &ldquo;{c.codename}&rdquo;
                </div>
              )}
            </div>
            <div className="text-right">
              <div
                className="font-display text-3xl tracking-[4px] border-2 px-3 py-1 inline-block opacity-85 text-[#8b1a1a] border-[#8b1a1a] -rotate-[3deg]"
              >
                FRC
              </div>
              <div
                className="font-mono text-base tracking-[2px] mt-2 text-[#8a6e35]"
              >
                {c.id.slice(0, 8).toUpperCase()}
              </div>
              <div
                className="font-display text-3xl tracking-[3px] mt-0.5 text-[#8b1a1a]"
              >
                CLEARANCE: ██████
              </div>
            </div>
          </div>
        </div>

        {/* Two-column body */}
        <div className="print-grid grid grid-cols-2 gap-5 mb-5">
          {/* Left: Attributes + Tracks */}
          <div className="flex flex-col gap-3.5">
            <PrintSection label="Attributes">
              <div className="print-section grid grid-cols-3 gap-1">
                {ATTR_KEYS.map((k) => (
                  <div
                    key={k}
                    className="border px-1.5 py-1.5 text-center border-[#8a8880]"
                  >
                    <div className="font-display text-3xl text-[var(--ink)]">
                      {c.attrs[k]}
                    </div>
                    <div className="text-base tracking-[2px] text-[#8a6e35]">{k}</div>
                  </div>
                ))}
              </div>
            </PrintSection>

            <PrintSection label={`Fatigue Track (max: CON ${c.attrs.CON})`}>
              <div className="flex gap-1 flex-wrap">
                {Array.from({ length: c.attrs.CON }, (_, i) => (
                  <div key={i} className="w-5 h-5 border border-[#8a8880]" />
                ))}
              </div>
              <div className="text-base mt-1 text-[#8a8880] tracking-[0.05em]">
                At {c.attrs.CON}: WOUNDED (−1 die physical) | Overflow: DOWN
              </div>
            </PrintSection>

            <PrintSection label={`Stress Track (max: WIS ${c.attrs.WIS})`}>
              <div className="flex gap-1 flex-wrap">
                {Array.from({ length: c.attrs.WIS }, (_, i) => (
                  <div key={i} className="w-5 h-5 border border-[#8a8880]" />
                ))}
              </div>
            </PrintSection>

          </div>

          {/* Right: Skills + Loadout + Expendables + Talent */}
          <div className="flex flex-col gap-3.5">
            <PrintSection label="Skills">
              {expertSkill && (
                <div className="mb-2">
                  <div className="text-base tracking-[2px] mb-0.75 text-[#8a6e35]">EXPERT</div>
                  <div className="font-display text-3xl text-[var(--ink)]">
                    {expertSkill.name}
                  </div>
                  <div className="text-3xl tracking-[0.05em] text-[#8a8880]">
                    {expertSkill.specializations.join(' · ')}
                  </div>
                </div>
              )}
              <div className="text-base tracking-[2px] mb-0.75 text-[#8a8880]">TRAINED</div>
              {trainedSkills.map((s) => (
                <div key={s.name} className="text-lg py-0.5 border-b border-b-[#ccc]">
                  {s.name}
                </div>
              ))}
            </PrintSection>

            <PrintSection label="Loadout">
              <div className="text-lg mb-1 text-[#6b5428] tracking-[0.05em]">
                {c.armor.toUpperCase()} ARMOR
              </div>
              {c.weapons.map((w, i) => (
                <div
                  key={i}
                  className="flex justify-between py-0.75 border-b text-lg border-b-[#ccc]"
                >
                  <span>{w.name}</span>
                  <span className="text-[#8a6e35]">{w.damage}</span>
                </div>
              ))}
            </PrintSection>

            <PrintSection label="Expendables">
              {c.expendables.map((e) => (
                <div
                  key={e.name}
                  className="flex items-center gap-2 py-0.75 border-b border-b-[#ccc]"
                >
                  <div className="w-3 h-3 border shrink-0 border-[#8a8880]" />
                  <span className="text-lg">{e.name}</span>
                </div>
              ))}
            </PrintSection>
          </div>
        </div>

        {/* Talent */}
        <PrintSection label="Talent">
          <div className="font-display text-3xl mb-1">{c.talent}</div>
          <div className="text-3xl leading-relaxed text-[#5a5a5a]">{c.talentDesc}</div>
        </PrintSection>

        {/* Background Tags */}
        <PrintSection label="Background Tags">
          <div className="flex gap-2 flex-wrap">
            {c.bgTags.map((tag) => (
              <div
                key={tag}
                className="text-lg border px-2.5 py-0.75 border-[#8a6e35] tracking-[0.05em]"
              >
                {tag}
              </div>
            ))}
          </div>
          <div className="text-base mt-1 text-[#8a8880] tracking-[0.05em]">
            Once per scene, when a tag applies: +1 die or 1 reroll.
          </div>
        </PrintSection>

        {/* Backstory */}
        {c.backstory && (
          <div className="mt-3.5">
            <PrintSection label="Personnel Notes">
              <p className="text-3xl leading-relaxed m-0 text-[#5a5a5a]">{c.backstory}</p>
            </PrintSection>
          </div>
        )}

        {/* Footer */}
        <div
          className="mt-6 pt-2 border-t flex justify-between font-mono text-3xl uppercase tracking-[2px] border-t-[#ccc] text-[#8a8880]"
        >
          <span>FRC Form 7-OP — Operative Character Record</span>
          <span>Classified — Internal Use Only</span>
        </div>
      </div>
    </>
  )
}

function PrintSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="print-section">
      <div
        className="font-mono text-3xl tracking-[4px] uppercase border-b pb-0.75 mb-2 text-[#8a6e35] border-b-[#8a8880]"
      >
        {label}
      </div>
      {children}
    </div>
  )
}
