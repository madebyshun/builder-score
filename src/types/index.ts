export interface BuilderScore {
  handle: string
  overall: number
  subscores: {
    consistency:  number
    technical:    number
    builderFocus: number
    community:    number
    bankrBonus?:  number
  }
  tier: 'Explorer' | 'Builder' | 'Shipper' | 'Founder' | 'Legend'
  summary?: string
  avatar?: string
  farcaster?: {
    followers: number
  } | null
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
