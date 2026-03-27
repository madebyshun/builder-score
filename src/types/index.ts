export interface BuilderScore {
  handle: string
  overall: number
  subscores: {
    onchain: number
    content: number
    community: number
    bankrBonus: number  // bonus pts, not a sub-score
  }
  tier: 'Explorer' | 'Builder' | 'Shipper' | 'Founder' | 'Legend'
  summary?: string
  avatar?: string
}

export interface Project {
  id: string
  name: string
  description: string
  url: string
  twitter?: string
  submitterId: number
  submitterUsername?: string
  timestamp: number
  votes: number
  voters: number[]
  approved?: boolean
}

export interface LeaderboardEntry {
  rank: number
  handle: string
  avatar?: string
  score: number
  points: number
  earned: number
  streak: number
  projects: number
  change7d: number
  tier: BuilderScore['tier']
}
