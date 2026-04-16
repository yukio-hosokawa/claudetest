import { NextRequest, NextResponse } from 'next/server'
import { getAllResponses } from '@/lib/storage'
import { generateMarkdown } from '@/lib/markdown'

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    return NextResponse.json({ error: 'ADMIN_PASSWORD が設定されていません。' }, { status: 500 })
  }

  if (key !== adminPassword) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const responses = await getAllResponses()
    const markdown = generateMarkdown(responses)

    return new NextResponse(markdown, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
      },
    })
  } catch (err) {
    console.error('results error:', err)
    return NextResponse.json({ error: 'サーバーエラーが発生しました。' }, { status: 500 })
  }
}
