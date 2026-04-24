import { NextResponse } from 'next/server'
import type { Prisma } from '@prisma/client'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { validateCreateCharacterPayload } from '@/lib/character-validation'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const characters = await prisma.character.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
  })
  return NextResponse.json(characters)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const payload = validateCreateCharacterPayload(body)
  if (!payload.ok) return NextResponse.json({ error: payload.error }, { status: 400 })

  const data = {
    userId: session.user.id,
    ...payload.data,
    fatigue: 0,
    stress: 0,
    clocks: [],
    activeAuras: [],
    notes: '',
  } as unknown as Prisma.CharacterUncheckedCreateInput

  const character = await prisma.character.create({
    data,
  })

  return NextResponse.json(character, { status: 201 })
}
