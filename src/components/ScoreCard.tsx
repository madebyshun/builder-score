'use client'
import { BuilderScore } from '@/types'
import { TIER_COLORS as TC, TIER_EMOJI as TE } from '@/lib/score'

interface Props { score: BuilderScore; compact?: boolean }

export function ScoreCard({ score, compact }: Props) {
  const tierColor = TC[score.tier]
  const tierEmoji = TE[score.tier]

  const bars = [
    { label: 'Onchain',   value: score.subscores.onchain,   color: '#4a90d9' },
    { label: 'Content',   value: score.subscores.content,   color: '#00b4d8' },
    { label: 'Community', value: score.subscores.community, color: '#34d399' },
    { label: 'Bankr 🟦',  value: score.subscores.bankr,     color: '#8b5cf6', bonus: score.subscores.bankrBonus },
  ]

  return (
    <div className="bg-[#0a0f1e] rounded-xl border border-[#1e2d4a] p-6 w-full max-w-md font-mono">
      {/* Title bar */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="text-[#4a90d9] text-xs ml-3 tracking-widest">blue-agent ~ builder-score</span>
      </div>

      {/* Handle */}
      <p className="text-[#4a90d9] text-sm mb-1">▸ score @{score.handle}</p>

      {/* Big score */}
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-[#4a90d9] text-7xl font-bold tracking-tight">{score.overall}</span>
        <span className="text-[#4a90d9] text-xl mb-1">/100</span>
        <span className="ml-2 text-sm px-2 py-0.5 rounded-full border" style={{ color: tierColor, borderColor: tierColor }}>
          {tierEmoji} {score.tier}
        </span>
      </div>

      {/* Overall bar */}
      <div className="w-full h-1.5 bg-[#1e2d4a] rounded-full mb-6">
        <div className="h-full bg-[#4a90d9] rounded-full" style={{ width: `${score.overall}%` }} />
      </div>

      {/* Divider */}
      <div className="border-t border-[#1e2d4a] mb-4" />

      {/* Sub-scores */}
      <div className="space-y-3">
        {bars.map(bar => (
          <div key={bar.label} className="flex items-center gap-3">
            <span className="text-xs w-24 flex-shrink-0" style={{ color: bar.color }}>{bar.label}</span>
            <div className="flex-1 h-1.5 bg-[#1e2d4a] rounded-full">
              <div className="h-full rounded-full transition-all" style={{ width: `${bar.value}%`, backgroundColor: bar.color }} />
            </div>
            <span className="text-xs w-8 text-right flex-shrink-0" style={{ color: bar.color }}>
              {bar.value}{bar.bonus ? <span className="text-[10px] ml-0.5">+5</span> : null}
            </span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-[#1e2d4a] my-4" />

      {/* Stats row */}
      <div className="flex justify-between text-xs text-[#4a90d9]">
        <span>⭐ {score.points.toLocaleString()} pts</span>
        <span>🔥 {score.streak}d streak</span>
        <span>📁 {score.projects} projects</span>
      </div>

      {/* CTA */}
      <div className="mt-4 text-xs text-[#00b4d8]">→ blueagent.xyz/score</div>
    </div>
  )
}
