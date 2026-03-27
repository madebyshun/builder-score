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

// Real score via Bankr Agent (same as bot)
export async function fetchScore(handle: string): Promise<BuilderScore> {
  const h = handle.replace('@', '')

  // Call our API route which uses Bankr Agent
  const res = await fetch(`/api/score?handle=${h}`)
  if (!res.ok) throw new Error('Score fetch failed')
  return res.json()
}
