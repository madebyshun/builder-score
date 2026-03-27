import { BuilderScore } from '@/types'

export function getTier(score: number): BuilderScore['tier'] {
  if (score >= 90) return 'Legend'
  if (score >= 75) return 'Founder'
  if (score >= 60) return 'Shipper'
  if (score >= 40) return 'Builder'
  return 'Explorer'
}

export const TIER_COLORS: Record<BuilderScore['tier'], string> = {
  Explorer: '#64748b',
  Builder:  '#4a90d9',
  Shipper:  '#00b4d8',
  Founder:  '#f59e0b',
  Legend:   '#8b5cf6',
}

export const TIER_EMOJI: Record<BuilderScore['tier'], string> = {
  Explorer: '🌱',
  Builder:  '🔨',
  Shipper:  '⚡',
  Founder:  '🚀',
  Legend:   '🏆',
}

// Mock score generator — replace with real API calls
export async function fetchScore(handle: string): Promise<BuilderScore> {
  // TODO: integrate real data sources:
  // - Onchain: Basescan API (tx count, contracts)
  // - Content: X/Twitter API (tweets, engagement)
  // - Community: bot DB (points, referrals, projects)
  // - Bankr: Bankr agent profiles API

  const seed = handle.length * 7 + handle.charCodeAt(0)
  const onchain  = Math.min(100, 40 + (seed % 40))
  const content  = Math.min(100, 30 + ((seed * 3) % 50))
  const community = Math.min(100, 20 + ((seed * 7) % 60))
  const bankr    = Math.min(100, 50 + ((seed * 2) % 40))
  const overall  = Math.round((onchain * 0.35 + content * 0.25 + community * 0.25 + bankr * 0.15))

  return {
    handle,
    overall,
    subscores: { onchain, content, community, bankr, bankrBonus: seed % 3 === 0 },
    tier: getTier(overall),
    points: seed * 13 % 2000,
    streak: seed % 21,
    earned: (seed * 13 % 2000) * 10000,
    projects: seed % 8,
    change7d: (seed % 20) - 10,
    avatar: `https://unavatar.io/twitter/${handle}`,
  }
}
