import { BuilderScore, SubScores, Tier } from './types'
import { buildScoringPrompt } from './prompt'
import { fetchAllIdentity } from './identity'

export * from './types'
export * from './identity'
export * from './prompt'

// ── Tier helpers ──────────────────────────────────────────
export function getTier(score: number): Tier {
  if (score >= 86) return 'Legend'
  if (score >= 71) return 'Founder'
  if (score >= 51) return 'Shipper'
  if (score >= 31) return 'Builder'
  return 'Explorer'
}

export const TIER_EMOJI: Record<Tier, string> = {
  Explorer: '🌱',
  Builder:  '🔨',
  Shipper:  '⚡',
  Founder:  '🚀',
  Legend:   '🏆',
}

// ── Parse raw agent/LLM response ─────────────────────────
export function parseScoreResponse(result: string, handle: string): BuilderScore | null {
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
  const tier         = tierMatch        ? tierMatch[1] as Tier : null

  // Final score = sum of 4 dimensions
  let score: number
  if (consistency !== null && technical !== null && builderFocus !== null && community !== null) {
    score = Math.min(100, consistency + technical + builderFocus + community)
  } else if (scoreMatch) {
    score = parseInt(scoreMatch[1])
  } else {
    return null
  }

  const subscores: SubScores = {
    consistency:  consistency  ?? Math.round(score * 0.25),
    technical:    technical    ?? Math.round(score * 0.25),
    builderFocus: builderFocus ?? Math.round(score * 0.25),
    community:    community    ?? Math.round(score * 0.25),
  }

  return {
    handle,
    score,
    tier: getTier(score) || tier || 'Explorer',
    subscores,
    summary,
    identity: { hasFarcaster: false },
    raw: result,
  }
}

// ── Format output for Telegram ────────────────────────────
export function formatScoreMessage(bs: BuilderScore): string {
  const emoji = TIER_EMOJI[bs.tier] || '🟦'
  const lines = [
    `🟦 <b>Builder Score</b>`,
    `@${bs.handle}`,
    ``,
    `Score: <b>${bs.score}/100</b> ${emoji}`,
    `Tier: <b>${bs.tier}</b>`,
    ``,
    `Consistency: <b>${bs.subscores.consistency}</b>/25`,
    `Technical: <b>${bs.subscores.technical}</b>/25`,
    `Builder focus: <b>${bs.subscores.builderFocus}</b>/25`,
    `Community: <b>${bs.subscores.community}</b>/25`,
    bs.summary ? `\n💡 ${bs.summary}` : '',
    ``,
    `─────────────────`,
    `<i>Powered by Blue Agent 🟦 · Blocky Studio</i>`,
  ]
  return lines.filter(l => l !== undefined).join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

// ── Main entry point ──────────────────────────────────────
// agentFn: caller provides their own Bankr Agent / LLM function
export async function runBuilderScore(
  handle: string,
  agentFn: (prompt: string) => Promise<string>
): Promise<BuilderScore | null> {
  const cleanHandle = handle.replace('@', '')

  // Fetch identity in parallel with agent call
  const [identityData, agentResult] = await Promise.all([
    fetchAllIdentity(cleanHandle),
    (async () => {
      const prompt = buildScoringPrompt(cleanHandle)
      for (let attempt = 1; attempt <= 3; attempt++) {
        const result = await agentFn(prompt)
        if (result) return result
        if (attempt < 3) await new Promise(r => setTimeout(r, 2000))
      }
      return ''
    })(),
  ])

  if (!agentResult) return null

  const bs = parseScoreResponse(agentResult, cleanHandle)
  if (!bs) return null

  // Attach identity data
  bs.identity = identityData

  return bs
}
