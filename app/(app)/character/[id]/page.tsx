export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import TrackerClient from '@/components/tracker/TrackerClient'
import { CharacterData } from '@/types/character'

export default async function CharacterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  const raw = await prisma.character.findUnique({ where: { id } })

  if (!raw || raw.userId !== session!.user.id) notFound()

  const character = raw as unknown as CharacterData
  return <TrackerClient character={character} />
}
