export function buildScoringPrompt(handle: string): string {
  return `Score @${handle} as a Base/crypto builder. Check their X/Twitter profile, posts, bio, and activity.
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
- SUMMARY: one punchy sentence about who this builder is`
}
