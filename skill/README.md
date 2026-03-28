# builder-score skill

Standalone skill for scoring Base/crypto builders via AI.
Works with any bot — just provide your own LLM/Agent function.

## Usage

```ts
import { runBuilderScore, formatScoreMessage } from './skill'

// Provide your own agent/LLM function
const score = await runBuilderScore('jessepollak', async (prompt) => {
  return await yourBankrAgent(prompt)
})

if (score) {
  console.log(formatScoreMessage(score))
}
```

## Output format (Telegram)

```
🟦 Builder Score
@jessepollak

Score: 95/100 🏆
Tier: Legend

Consistency: 24/25
Technical: 23/25
Builder focus: 25/25
Community: 23/25

💡 The face of Base — ships daily, builds in public.

─────────────────
Powered by Blue Agent 🟦 · Blocky Studio
```

## Scoring dimensions (4 × 25 = 100)

| Dimension     | What it measures |
|---------------|-----------------|
| Consistency   | Posting frequency, showing up daily |
| Technical     | Code quality, smart contracts, depth |
| Builder focus | Projects shipped, onchain activity |
| Community     | Followers, engagement, recognition |

## Tiers

| Score | Tier     |
|-------|----------|
| 0–30  | 🌱 Explorer |
| 31–50 | 🔨 Builder  |
| 51–70 | ⚡ Shipper  |
| 71–85 | 🚀 Founder  |
| 86+   | 🏆 Legend   |

## Identity data (free, no key needed)

- **Farcaster** via Warpcast public API
- **Basename** via ensdata.net
- **ENS** via ensdata.net

## Requirements

- Any LLM or agent function that can search X/Twitter (e.g. Bankr Agent)
- No API keys needed for identity checks (Farcaster, ENS, Basename)

## Built by

Blocky Studio · [@blockyonbase](https://x.com/blockyonbase) · [@blocky_agent](https://x.com/blocky_agent)
