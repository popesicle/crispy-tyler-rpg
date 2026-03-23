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
      <div className="no-print" style={{ padding: '16px 24px', borderBottom: '1px solid #ccc', background: '#f0ece0' }}>
        <PrintTrigger />
        <a
          href={`/character/${c.id}`}
          style={{ marginLeft: 16, fontFamily: '"Share Tech Mono", monospace', fontSize: 36, color: '#6b5428' }}
        >
          ← Back to Tracker
        </a>
      </div>

      {/* Print sheet */}
      <div
        style={{
          background: 'var(--paper)',
          color: 'var(--ink)',
          minHeight: '100vh',
          padding: '32px 40px',
          fontFamily: '"Share Tech Mono", monospace',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 20, borderBottom: '2px solid var(--ink)', paddingBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div
                style={{
                  fontFamily: '"Special Elite", serif',
                  fontSize: 17,
                  letterSpacing: 5,
                  color: '#6b5428',
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}
              >
                Federal Remediation Commission
              </div>
              <h1
                style={{
                  fontFamily: '"Special Elite", serif',
                  fontSize: 36,
                  color: 'var(--ink)',
                  margin: 0,
                  letterSpacing: 2,
                }}
              >
                {c.name}
              </h1>
              {c.codename && (
                <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 36, color: '#8a6e35', letterSpacing: 2, marginTop: 2 }}>
                  &ldquo;{c.codename}&rdquo;
                </div>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontFamily: '"Special Elite", serif',
                  color: '#8b1a1a',
                  fontSize: 30,
                  letterSpacing: 4,
                  border: '2px solid #8b1a1a',
                  padding: '4px 12px',
                  transform: 'rotate(-3deg)',
                  display: 'inline-block',
                  opacity: 0.85,
                }}
              >
                FRC
              </div>
              <div
                style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: 17,
                  color: '#8a6e35',
                  letterSpacing: 2,
                  marginTop: 8,
                }}
              >
                {c.id.slice(0, 8).toUpperCase()}
              </div>
              <div
                style={{
                  fontFamily: '"Special Elite", serif',
                  fontSize: 30,
                  color: '#8b1a1a',
                  letterSpacing: 3,
                  marginTop: 2,
                }}
              >
                CLEARANCE: ██████
              </div>
            </div>
          </div>
        </div>

        {/* Two-column body */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          {/* Left: Attributes + Tracks + Loadout */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <PrintSection label="Attributes">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
                {ATTR_KEYS.map((k) => (
                  <div
                    key={k}
                    style={{
                      border: '1px solid #8a8880',
                      padding: '6px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontFamily: '"Special Elite", serif', fontSize: 30, color: 'var(--ink)' }}>
                      {c.attrs[k]}
                    </div>
                    <div style={{ fontSize: 17, letterSpacing: 2, color: '#8a6e35' }}>{k}</div>
                  </div>
                ))}
              </div>
            </PrintSection>

            <PrintSection label={`Fatigue Track (max: CON ${c.attrs.CON})`}>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {Array.from({ length: c.attrs.CON }, (_, i) => (
                  <div key={i} style={{ width: 20, height: 20, border: '1px solid #8a8880' }} />
                ))}
              </div>
              <div style={{ fontSize: 17, color: '#8a8880', marginTop: 4, letterSpacing: 1 }}>
                At {c.attrs.CON}: WOUNDED (−1 die physical) | Overflow: DOWN
              </div>
            </PrintSection>

            <PrintSection label={`Stress Track (max: WIS ${c.attrs.WIS})`}>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {Array.from({ length: c.attrs.WIS }, (_, i) => (
                  <div key={i} style={{ width: 20, height: 20, border: '1px solid #8a8880' }} />
                ))}
              </div>
            </PrintSection>

            <PrintSection label="Loadout">
              <div style={{ fontSize: 19, color: '#6b5428', marginBottom: 4, letterSpacing: 1 }}>
                {c.armor.toUpperCase()} ARMOR
              </div>
              {c.weapons.map((w, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '3px 0',
                    borderBottom: '1px solid #ccc',
                    fontSize: 19,
                  }}
                >
                  <span>{w.name}</span>
                  <span style={{ color: '#8a6e35' }}>{w.damage}</span>
                </div>
              ))}
            </PrintSection>
          </div>

          {/* Right: Skills + Talent + Expendables */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <PrintSection label="Skills">
              {expertSkill && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 17, letterSpacing: 2, color: '#8a6e35', marginBottom: 3 }}>EXPERT</div>
                  <div style={{ fontFamily: '"Special Elite", serif', fontSize: 30, color: 'var(--ink)' }}>
                    {expertSkill.name}
                  </div>
                  <div style={{ fontSize: 30, color: '#8a8880', letterSpacing: 1 }}>
                    {expertSkill.specializations.join(' · ')}
                  </div>
                </div>
              )}
              <div style={{ fontSize: 17, letterSpacing: 2, color: '#8a8880', marginBottom: 3 }}>TRAINED</div>
              {trainedSkills.map((s) => (
                <div key={s.name} style={{ fontSize: 19, padding: '2px 0', borderBottom: '1px solid #ccc' }}>
                  {s.name}
                </div>
              ))}
            </PrintSection>

            <PrintSection label="Talent">
              <div style={{ fontFamily: '"Special Elite", serif', fontSize: 30, marginBottom: 4 }}>{c.talent}</div>
              <div style={{ fontSize: 30, color: '#5a5a5a', lineHeight: 1.6 }}>{c.talentDesc}</div>
            </PrintSection>

            <PrintSection label="Expendables">
              {c.expendables.map((e) => (
                <div
                  key={e.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '3px 0',
                    borderBottom: '1px solid #ccc',
                  }}
                >
                  <div style={{ width: 12, height: 12, border: '1px solid #8a8880', flexShrink: 0 }} />
                  <span style={{ fontSize: 19 }}>{e.name}</span>
                </div>
              ))}
            </PrintSection>
          </div>
        </div>

        {/* Background Tags */}
        <PrintSection label="Background Tags">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {c.bgTags.map((tag) => (
              <div
                key={tag}
                style={{
                  fontSize: 19,
                  border: '1px solid #8a6e35',
                  padding: '3px 10px',
                  letterSpacing: 1,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 17, color: '#8a8880', marginTop: 4, letterSpacing: 1 }}>
            Once per scene, when a tag applies: +1 die or 1 reroll.
          </div>
        </PrintSection>

        {/* Backstory */}
        {c.backstory && (
          <div style={{ marginTop: 14 }}>
            <PrintSection label="Personnel Notes">
              <p style={{ fontSize: 30, lineHeight: 1.7, margin: 0, color: '#5a5a5a' }}>{c.backstory}</p>
            </PrintSection>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: 24,
            paddingTop: 8,
            borderTop: '1px solid #ccc',
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: 36,
            color: '#8a8880',
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
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
    <div>
      <div
        style={{
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: 36,
          letterSpacing: 4,
          color: '#8a6e35',
          textTransform: 'uppercase',
          borderBottom: '1px solid #8a8880',
          paddingBottom: 3,
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  )
}
