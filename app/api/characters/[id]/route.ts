import { NextResponse } from 'next/server'
import type { Prisma } from '@prisma/client'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { validateCharacterUpdates } from '@/lib/character-validation'

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
  const updates = validateCharacterUpdates(body)
  if (!updates.ok) return NextResponse.json({ error: updates.error }, { status: 400 })

  const updated = await prisma.character.update({
    where: { id: params.id },
    data: updates.data as Prisma.CharacterUpdateInput,
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
