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
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="section-label">Active Personnel</div>
          <h1 className="font-display text-[36px] text-amber tracking-[2px] m-0">
            Operative Roster
          </h1>
        </div>
        <Link href="/create" className="btn btn-primary mt-6">
          + New Operative
        </Link>
      </div>

      {characters.length === 0 ? (
        <div className="border border-concrete-dark p-12 text-center">
          <div className="font-display text-3xl text-concrete mb-2">
            No operatives on file.
          </div>
          <div className="font-mono text-lg text-concrete-dark tracking-[2px] mb-6">
            All personnel records are classified or do not exist.
          </div>
          <Link href="/create" className="btn">
            File First Operative
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-0.5">
          {characters.map((char: typeof characters[number]) => (
            <Link
              key={char.id}
              href={`/character/${char.id}`}
              className="roster-row"
            >
              <div className="flex-1">
                <div className="font-display text-3xl text-off-white tracking-[1px]">
                  {char.name}
                </div>
                {char.codename && (
                  <div className="font-mono text-lg text-amber-dim tracking-[2px] mt-0.5">
                    &ldquo;{char.codename}&rdquo;
                  </div>
                )}
              </div>
              <div className="font-mono text-3xl text-concrete tracking-[2px] uppercase shrink-0">
                {char.armor} armor
              </div>
              <div className="font-mono text-base text-concrete-dark tracking-[1px] shrink-0">
                {new Date(char.updatedAt).toLocaleDateString()}
              </div>
              <div className="text-amber-dim text-3xl">›</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
