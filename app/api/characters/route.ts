import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
  const { name, codename, backstory, attrs, skills, talent, talentDesc, armor, weapons, expendables, bgTags } = body

  if (!name || !attrs || !skills || !talent || !talentDesc || !armor || !weapons || !expendables || !bgTags) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  const character = await prisma.character.create({
    data: {
      userId: session.user.id,
      name,
      codename: codename || null,
      backstory: backstory || null,
      attrs,
      skills,
      talent,
      talentDesc,
      armor,
      weapons,
      expendables,
      bgTags,
      fatigue: 0,
      stress: 0,
      clocks: [],
      activeAuras: [],
      notes: '',
    },
  })

  return NextResponse.json(character, { status: 201 })
}
