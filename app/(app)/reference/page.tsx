import { SKILLS, AURAS, WORDS_OF_POWER, ARMOR_OPTIONS, EXPENDABLES } from '@/lib/game-data'

export default function ReferencePage() {
  return (
    <div>
      <div className="section-label">Quick Reference</div>
      <h1 style={{ fontFamily: '"Special Elite", serif', fontSize: 36, color: 'var(--amber)', margin: '0 0 28px', letterSpacing: 2 }}>
        Field Reference
      </h1>

      {/* Armor */}
      <Section label="Armor">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {ARMOR_OPTIONS.map((a) => (
            <div key={a.type} style={{ display: 'flex', gap: 12, padding: '8px 12px', border: '1px solid var(--concrete-dark)' }}>
              <div style={{ fontFamily: '"Special Elite", serif', fontSize: 19, color: 'var(--off-white)', minWidth: 70 }}>{a.label}</div>
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 19, color: 'var(--amber-dim)' }}>{a.soak}</div>
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 19, color: 'var(--concrete)' }}>{a.modifier}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Auras */}
      <Section label="Weird Operations — Auras">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 8 }}>
          {AURAS.map((a) => (
            <div key={a.name} style={{ padding: '10px', border: '1px solid var(--concrete-dark)' }}>
              <div style={{ fontFamily: '"Special Elite", serif', fontSize: 30, color: 'var(--amber)', marginBottom: 4 }}>{a.name}</div>
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 30, color: 'var(--concrete-light)', lineHeight: 1.5, marginBottom: 4 }}>{a.effect}</div>
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 17, color: 'var(--red-stamp)', letterSpacing: 1 }}>Cost: {a.cost}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Words of Power */}
      <Section label="Weird Operations — Words of Power">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 6 }}>
          {WORDS_OF_POWER.map((w) => (
            <div key={w.name} style={{ padding: '8px 10px', border: '1px solid var(--concrete-dark)' }}>
              <div style={{ fontFamily: '"Special Elite", serif', fontSize: 30, color: 'var(--off-white)', marginBottom: 3 }}>{w.name}</div>
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 30, color: 'var(--concrete)', lineHeight: 1.5 }}>{w.effect}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Skills */}
      <Section label="Skills">
        {(['Physical', 'Investigation', 'Social', 'Weird'] as const).map((cat) => (
          <div key={cat} style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 17, letterSpacing: 3, color: 'var(--amber-dim)', textTransform: 'uppercase', marginBottom: 6 }}>{cat}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {SKILLS.filter((s) => s.cat === cat).map((s) => (
                <div key={s.name} style={{ display: 'flex', gap: 12, padding: '6px 10px', border: '1px solid var(--concrete-dark)' }}>
                  <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 36, color: 'var(--off-white)', minWidth: 220 }}>{s.name}</div>
                  <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 17, color: 'var(--amber-dim)', letterSpacing: 1, alignSelf: 'center' }}>{s.attr}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Section>

      {/* Expendables */}
      <Section label="Expendables Deck">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {EXPENDABLES.map((e) => (
            <div key={e.name} style={{ padding: '10px 12px', border: '1px solid var(--concrete-dark)' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 4 }}>
                <div style={{ fontFamily: '"Special Elite", serif', fontSize: 30, color: 'var(--off-white)' }}>{e.name}</div>
                <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 17, color: 'var(--concrete-dark)', letterSpacing: 2 }}>{e.cat}</div>
              </div>
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 30, color: 'var(--concrete-light)', lineHeight: 1.5, marginBottom: 2 }}>{e.effect}</div>
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 30, color: 'var(--red-stamp)', lineHeight: 1.5 }}>Drawback: {e.drawback}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div className="section-label" style={{ marginBottom: 12 }}>{label}</div>
      {children}
    </div>
  )
}
