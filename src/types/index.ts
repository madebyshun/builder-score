export interface BuilderScore {
  handle: string
  overall: number
  subscores: {
    onchain: number
    content: number
    community: number
    bankr: number
    bankrBonus: boolean
  }
  tier: 'Explorer' | 'Builder' | 'Shipper' | 'Founder' | 'Legend'
  points: number
  streak: number
  earned: number // $BLUEAGENT earned
  projects: number
  change7d: number // % change in 7 days
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
