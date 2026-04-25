import { NextResponse } from 'next/server'
import { chromium } from 'playwright'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const character = await prisma.character.findUnique({ where: { id: params.id } })
  if (!character || character.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const reqUrl = new URL(req.url)
  const printUrl = new URL(`/character/${params.id}/print`, reqUrl.origin)
  const cookie = req.headers.get('cookie')

  let browser: Awaited<ReturnType<typeof chromium.launch>> | null = null

  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const context = await browser.newContext({
      extraHTTPHeaders: cookie ? { cookie } : undefined,
    })
    const page = await context.newPage()

    await page.emulateMedia({ media: 'print' })
    const response = await page.goto(printUrl.toString(), {
      waitUntil: 'networkidle',
      timeout: 30_000,
    })

    if (!response?.ok()) {
      throw new Error(`Print page returned ${response?.status() ?? 'no response'}`)
    }

    await page.evaluate(() => document.fonts.ready)

    const pdf = await page.pdf({
      format: 'Letter',
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
    })

    return new Response(new Uint8Array(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': String(pdf.length),
        'Content-Disposition': `attachment; filename="${filenameSafe(character.name || 'character')}-sheet.pdf"`,
        'Cache-Control': 'private, no-store',
      },
    })
  } catch (error) {
    console.error('Failed to render character sheet PDF', error)
    return NextResponse.json({ error: 'Failed to render PDF.' }, { status: 500 })
  } finally {
    await browser?.close()
  }
}

function filenameSafe(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'character'
}
