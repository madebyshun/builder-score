import { NextRequest, NextResponse } from 'next/server'
import { fetchScore } from '@/lib/score'

export async function GET(req: NextRequest) {
  const handle = req.nextUrl.searchParams.get('handle')
  if (!handle) return NextResponse.json({ error: 'handle required' }, { status: 400 })

  try {
    const score = await fetchScore(handle.replace('@', ''))
    return NextResponse.json(score)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch score' }, { status: 500 })
  }
}
