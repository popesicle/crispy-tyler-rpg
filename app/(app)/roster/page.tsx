export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function RosterPage() {
  const session = await auth()
  const characters = await prisma.character.findMany({
    where: { userId: session!.user.id },
    orderBy: { updatedAt: 'desc' },
    select: { id: true, name: true, codename: true, armor: true, updatedAt: true },
  })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <div className="section-label">Active Personnel</div>
          <h1
            style={{
              fontFamily: '"Special Elite", serif',
              fontSize: 36,
              color: 'var(--amber)',
              letterSpacing: 2,
              margin: 0,
            }}
          >
            Operative Roster
          </h1>
        </div>
        <Link href="/create" className="btn btn-primary" style={{ marginTop: 24 }}>
          + New Operative
        </Link>
      </div>

      {characters.length === 0 ? (
        <div
          style={{
            border: '1px solid var(--concrete-dark)',
            padding: 48,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: '"Special Elite", serif',
              fontSize: 30,
              color: 'var(--concrete)',
              marginBottom: 8,
            }}
          >
            No operatives on file.
          </div>
          <div
            style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: 19,
              color: 'var(--concrete-dark)',
              letterSpacing: 2,
              marginBottom: 24,
            }}
          >
            All personnel records are classified or do not exist.
          </div>
          <Link href="/create" className="btn">
            File First Operative
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {characters.map((char: typeof characters[number]) => (
            <Link
              key={char.id}
              href={`/character/${char.id}`}
              className="roster-row"
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: '"Special Elite", serif',
                    fontSize: 30,
                    color: 'var(--off-white)',
                    letterSpacing: 1,
                  }}
                >
                  {char.name}
                </div>
                {char.codename && (
                  <div
                    style={{
                      fontFamily: '"Share Tech Mono", monospace',
                      fontSize: 19,
                      color: 'var(--amber-dim)',
                      letterSpacing: 2,
                      marginTop: 2,
                    }}
                  >
                    &ldquo;{char.codename}&rdquo;
                  </div>
                )}
              </div>
              <div
                style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: 30,
                  color: 'var(--concrete)',
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  flexShrink: 0,
                }}
              >
                {char.armor} armor
              </div>
              <div
                style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: 17,
                  color: 'var(--concrete-dark)',
                  letterSpacing: 1,
                  flexShrink: 0,
                }}
              >
                {new Date(char.updatedAt).toLocaleDateString()}
              </div>
              <div style={{ color: 'var(--amber-dim)', fontSize: 30 }}>›</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
