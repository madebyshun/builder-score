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
    // Fetch Farcaster data (Warpcast public, no key needed)
    let fcFollowers: number | null = null
    let fcBio = ''
    try {
      const fcRes = await fetch(`https://api.warpcast.com/v2/user-by-username?username=${handle.toLowerCase()}`, { signal: AbortSignal.timeout(5000) })
      const fcData = await fcRes.json()
      const fcUser = fcData?.result?.user
      if (fcUser) {
        fcFollowers = fcUser.followerCount ?? null
        fcBio = fcUser.profile?.bio?.text || ''
      }
    } catch {}

    const fcContext = fcFollowers !== null
      ? `\nFarcaster: ${fcFollowers.toLocaleString()} followers, bio: "${fcBio}"`
      : '\nFarcaster: not found'

    const prompt = `Score @${handle} as a Base/crypto builder. Check their X/Twitter profile, posts, bio, and activity.
Reply in this EXACT format only (no extra text):
SCORE: X/100
TIER: Explorer|Builder|Shipper|Founder|Legend
Consistency: X/25
Technical: X/25
Builder focus: X/25
Community: X/25
SUMMARY: one sentence

Scoring guide:
- Consistency (0-25): posting frequency, regularity, showing up — how often they share work
- Technical (0-25): code quality, smart contracts, technical depth of posts, GitHub mentions
- Builder focus (0-25): projects shipped, building in public, Base/onchain activity, products launched
- Community (0-25): followers, engagement, replies, community recognition, reputation on X and Farcaster
- SUMMARY: one punchy sentence about who this builder is

Real data to factor in:${fcContext}`

    const result = await askLLM(prompt)
    if (!result) throw new Error('No result')

    // Parse
    const scoreMatch       = result.match(/SCORE:\s*(\d+)/i)
    const tierMatch        = result.match(/TIER:\s*(\w+)/i)
    const consistencyMatch = result.match(/Consistency:\s*(\d+)/i)
    const technicalMatch   = result.match(/Technical:\s*(\d+)/i)
    const builderMatch     = result.match(/Builder\s*focus:\s*(\d+)/i)
    const communityMatch   = result.match(/Community:\s*(\d+)/i)
    const summaryMatch     = result.match(/SUMMARY:\s*(.+)/i)

    const consistency  = consistencyMatch ? Math.min(25, parseInt(consistencyMatch[1])) : null
    const technical    = technicalMatch   ? Math.min(25, parseInt(technicalMatch[1]))   : null
    const builderFocus = builderMatch     ? Math.min(25, parseInt(builderMatch[1]))     : null
    const community    = communityMatch   ? Math.min(25, parseInt(communityMatch[1]))   : null
    const summary      = summaryMatch     ? summaryMatch[1].trim() : ''
    const tier         = tierMatch        ? tierMatch[1] : null

    // Final score = sum of 4 dimensions
    let overall: number
    if (consistency !== null && technical !== null && builderFocus !== null && community !== null) {
      overall = Math.min(100, consistency + technical + builderFocus + community)
    } else {
      overall = scoreMatch ? parseInt(scoreMatch[1]) : 50
    }

    const finalTier = getTier(overall) || tier || 'Explorer'

    return NextResponse.json({
      handle,
      overall,
      subscores: {
        consistency:  consistency  ?? Math.round(overall * 0.25),
        technical:    technical    ?? Math.round(overall * 0.25),
        builderFocus: builderFocus ?? Math.round(overall * 0.25),
        community:    community    ?? Math.round(overall * 0.25),
      },
      tier: finalTier,
      summary,
      avatar: `https://unavatar.io/twitter/${handle}`,
      farcaster: fcFollowers !== null ? { followers: fcFollowers } : null,
    })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch score' }, { status: 500 })
  }
}
