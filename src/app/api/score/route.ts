import { NextRequest, NextResponse } from 'next/server'

const BANKR_API_KEY = process.env.BANKR_API_KEY || ''

function getTier(score: number): string {
  if (score >= 86) return 'Legend'
  if (score >= 71) return 'Founder'
  if (score >= 51) return 'Shipper'
  if (score >= 31) return 'Builder'
  return 'Explorer'
}

async function askLLM(prompt: string): Promise<string> {
  const res = await fetch('https://llm.bankr.bot/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': BANKR_API_KEY,
      'content-type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4.5',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }]
    })
  })
  const data = await res.json()
  return data.content?.[0]?.text || ''
}

export async function GET(req: NextRequest) {
  const handle = req.nextUrl.searchParams.get('handle')?.replace('@', '')
  if (!handle) return NextResponse.json({ error: 'handle required' }, { status: 400 })

  try {
    // Same prompt as bot
    const prompt = `Score @${handle} as a Base builder (0-100). Check their X posts.
Reply in this format only:
SCORE: X/100
TIER: Explorer|Builder|Shipper|Founder|Legend
Consistency: X/25
Technical: X/25
Builder focus: X/25
Community: X/25
SUMMARY: one sentence`

    const result = await askLLM(prompt)
    if (!result) throw new Error('No result')

    // Parse — same as bot
    const scoreMatch       = result.match(/SCORE:\s*(\d+)/i)
    const tierMatch        = result.match(/TIER:\s*(\w+)/i)
    const consistencyMatch = result.match(/Consistency:\s*(\d+)/i)
    const technicalMatch   = result.match(/Technical:\s*(\d+)/i)
    const builderMatch     = result.match(/Builder\s*focus:\s*(\d+)/i)
    const communityMatch   = result.match(/Community:\s*(\d+)/i)
    const summaryMatch     = result.match(/SUMMARY:\s*(.+)/i)

    let overall = scoreMatch ? parseInt(scoreMatch[1]) : 50
    const tier = tierMatch ? tierMatch[1] : null
    const consistency  = consistencyMatch ? parseInt(consistencyMatch[1]) : null
    const technical    = technicalMatch   ? parseInt(technicalMatch[1])   : null
    const builderFocus = builderMatch     ? parseInt(builderMatch[1])     : null
    const community    = communityMatch   ? parseInt(communityMatch[1])   : null
    const summary      = summaryMatch     ? summaryMatch[1].trim()        : ''

    // Check Bankr profile bonus (+5) — same as bot
    let bankrBonus = 0
    try {
      const bankrRes = await fetch('https://api.bankr.bot/agent-profiles?limit=100')
      const profiles = await bankrRes.json()
      const hasBankr = (profiles.profiles || []).some((p: any) =>
        (p.twitterUsername || '').toLowerCase().replace('@', '') === handle.toLowerCase()
      )
      if (hasBankr) {
        bankrBonus = Math.min(5, 100 - overall)
        overall = Math.min(100, overall + bankrBonus)
      }
    } catch {}

    const finalTier = getTier(overall) || tier || 'Explorer'

    return NextResponse.json({
      handle,
      overall,
      subscores: {
        consistency:  consistency  ?? Math.round(overall * 0.22),
        technical:    technical    ?? Math.round(overall * 0.20),
        builderFocus: builderFocus ?? Math.round(overall * 0.21),
        community:    community    ?? Math.round(overall * 0.19),
        bankrBonus,
      },
      tier: finalTier,
      summary,
      avatar: `https://unavatar.io/twitter/${handle}`,
    })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch score' }, { status: 500 })
  }
}
