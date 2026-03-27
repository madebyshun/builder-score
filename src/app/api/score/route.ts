import { NextRequest, NextResponse } from 'next/server'

const BANKR_API_KEY = process.env.BANKR_API_KEY || ''

function getTier(score: number): string {
  if (score >= 90) return 'Legend'
  if (score >= 75) return 'Founder'
  if (score >= 60) return 'Shipper'
  if (score >= 40) return 'Builder'
  return 'Explorer'
}

async function askLLM(prompt: string): Promise<string> {
  // Use Bankr LLM Gateway (fast, sync)
  const res = await fetch('https://llm.bankr.bot/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': BANKR_API_KEY,
      'content-type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4.5',
      max_tokens: 400,
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
    const prompt = `Score @${handle} as a Base builder (0-100). Analyze their X/Twitter activity and on-chain presence.
Reply in this EXACT format only:
SCORE: X/100
TIER: Explorer|Builder|Shipper|Founder|Legend
Onchain: X/100
Content: X/100
Community: X/100
SUMMARY: one sentence about this builder`

    const result = await askLLM(prompt)

    // Parse response
    const scoreMatch = result.match(/SCORE:\s*(\d+)\/100/i)
    const onchainMatch = result.match(/Onchain:\s*(\d+)/i)
    const contentMatch = result.match(/Content:\s*(\d+)/i)
    const communityMatch = result.match(/Community:\s*(\d+)/i)
    const summaryMatch = result.match(/SUMMARY:\s*(.+)/i)

    const overall = scoreMatch ? parseInt(scoreMatch[1]) : 50
    const onchain = onchainMatch ? parseInt(onchainMatch[1]) : Math.round(overall * 0.9)
    const content = contentMatch ? parseInt(contentMatch[1]) : Math.round(overall * 0.8)
    const community = communityMatch ? parseInt(communityMatch[1]) : Math.round(overall * 0.85)

    // Check Bankr profile bonus
    let bankrBonus = 0
    try {
      const bankrRes = await fetch('https://api.bankr.bot/agent-profiles?limit=100')
      const profiles = await bankrRes.json()
      const hasBankr = (profiles.profiles || []).some((p: any) =>
        (p.twitterUsername || '').toLowerCase().replace('@', '') === handle.toLowerCase()
      )
      if (hasBankr) bankrBonus = 5
    } catch {}

    return NextResponse.json({
      handle,
      overall: Math.min(100, overall + bankrBonus),
      subscores: { onchain, content, community, bankrBonus },
      tier: getTier(overall + bankrBonus),
      summary: summaryMatch?.[1]?.trim() || '',
      avatar: `https://unavatar.io/twitter/${handle}`,
    })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch score' }, { status: 500 })
  }
}
