export type Tier = 'Explorer' | 'Builder' | 'Shipper' | 'Founder' | 'Legend'

export interface SubScores {
  consistency: number   // /25
  technical: number     // /25
  builderFocus: number  // /25
  community: number     // /25
}

export interface IdentityData {
  hasFarcaster: boolean
  farcasterFollowers?: number
  farcasterBio?: string
  hasBasename?: boolean
  hasENS?: boolean
}

export interface BuilderScore {
  handle: string
  score: number          // 0–100
  tier: Tier
  subscores: SubScores
  summary: string
  identity: IdentityData
  raw?: string           // raw agent response
}
