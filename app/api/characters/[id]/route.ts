import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function getOwnedCharacter(id: string, userId: string) {
  const character = await prisma.character.findUnique({ where: { id } })
  if (!character || character.userId !== userId) return null
  return character
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const character = await getOwnedCharacter(params.id, session.user.id)
  if (!character) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(character)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const existing = await getOwnedCharacter(params.id, session.user.id)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()

  // Only allow updating mutable fields — never userId or createdAt
  const allowed = ['name', 'codename', 'backstory', 'attrs', 'skills', 'talent', 'talentDesc',
    'armor', 'weapons', 'expendables', 'bgTags', 'fatigue', 'stress', 'clocks', 'activeAuras', 'notes']
  const updates = Object.fromEntries(
    Object.entries(body).filter(([k]) => allowed.includes(k))
  )

  const updated = await prisma.character.update({
    where: { id: params.id },
    data: updates,
  })

  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const existing = await getOwnedCharacter(params.id, session.user.id)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.character.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
