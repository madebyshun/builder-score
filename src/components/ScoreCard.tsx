'use client'
import { BuilderScore } from '@/types'
import { TIER_COLORS, TIER_EMOJI } from '@/lib/score'
import { useRef } from 'react'

interface Props {
  score: BuilderScore
  onClose?: () => void
}

function Bar({ value, color, label }: { value: number; color: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs w-20 flex-shrink-0 font-mono" style={{ color }}>{label}</span>
      <div className="flex-1 h-1.5 bg-[#1a2540] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs w-7 text-right flex-shrink-0 font-mono" style={{ color }}>{value}</span>
    </div>
  )
}

export function ScoreCard({ score, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const tierColor = TIER_COLORS[score.tier]
  const tierEmoji = TIER_EMOJI[score.tier]

  const sub = score.subscores || { onchain: 0, content: 0, community: 0, bankrBonus: 0 }
  const bars = [
    { label: 'Onchain',   value: sub.onchain   ?? Math.round(score.overall * 0.9), color: '#4a90d9' },
    { label: 'Content',   value: sub.content   ?? Math.round(score.overall * 0.8), color: '#00b4d8' },
    { label: 'Community', value: sub.community ?? Math.round(score.overall * 0.85), color: '#34d399' },
  ]

  async function handleDownload() {
    try {
      const { default: html2canvas } = await import('html2canvas')
      if (!cardRef.current) return
      const canvas = await html2canvas(cardRef.current, { backgroundColor: '#0a0f1e', scale: 2 })
      const link = document.createElement('a')
      link.download = `builder-score-${score.handle}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch {
      alert('Download requires html2canvas. Install: npm install html2canvas')
    }
  }

  function handleShare() {
    const text = encodeURIComponent(
      `My Builder Score on Base: ${score.overall}/100 ${tierEmoji}\n\nTier: ${score.tier}\n\nCheck yours 👇\nblueagent.xyz/score`
    )
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
  }

  return (
    // Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose?.() }}>

      <div className="w-full max-w-2xl">
        {/* Card */}
        <div ref={cardRef} className="rounded-2xl overflow-hidden border border-[#1e2d4a]"
          style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1a35 100%)' }}>

          {/* Title bar */}
          <div className="flex items-center gap-2 px-5 py-3 bg-[#4a90d9]/10 border-b border-[#1e2d4a]">
            {['#ff5f57','#febc2e','#28c840'].map((c, i) => (
              <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
            ))}
            <span className="text-[#4a90d9] text-xs font-mono ml-3 tracking-widest">blue-agent ~ builder-score</span>
          </div>

          {/* Main content — horizontal layout */}
          <div className="flex gap-6 p-6">

            {/* Left: Avatar + score */}
            <div className="flex flex-col items-center flex-shrink-0 w-40">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#4a90d9] mb-3 bg-[#1e2d4a]">
                {score.avatar ? (
                  <img src={score.avatar} alt={score.handle}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🟦</div>
                )}
              </div>

              {/* Handle */}
              <p className="text-[#4a90d9] text-xs font-mono mb-1">@{score.handle}</p>

              {/* Big score */}
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-6xl font-bold text-white leading-none" style={{ textShadow: '0 0 30px #4a90d9aa' }}>{score.overall}</span>
              </div>

              {/* Tier badge */}
              <div className="flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-mono mt-1"
                style={{ color: tierColor, borderColor: tierColor, backgroundColor: `${tierColor}15` }}>
                {tierEmoji} {score.tier}
              </div>

              {/* Bankr bonus */}
              {(sub.bankrBonus ?? 0) > 0 && (
                <div className="mt-2 text-[10px] text-[#34d399] font-mono">
                  🟦 +{sub.bankrBonus} Bankr bonus
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="w-px bg-[#1e2d4a] flex-shrink-0" />

            {/* Right: Sub-scores + summary */}
            <div className="flex-1 flex flex-col justify-between">

              {/* Overall bar */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[#4a90d9] text-xs font-mono">Overall</span>
                  <span className="text-white text-xs font-mono font-bold">{score.overall}</span>
                </div>
                <div className="w-full h-2 bg-[#1a2540] rounded-full overflow-hidden">
                  <div className="h-full bg-[#4a90d9] rounded-full"
                    style={{ width: `${score.overall}%` }} />
                </div>
              </div>

              {/* Sub-scores */}
              <div className="space-y-3 mb-5">
                {bars.map(b => <Bar key={b.label} {...b} />)}
              </div>

              {/* Summary */}
              {score.summary && (
                <p className="text-[#4a90d9] text-xs font-mono leading-relaxed border-t border-[#1e2d4a] pt-3">
                  💡 {score.summary}
                </p>
              )}

              {/* CTA */}
              <div className="text-[10px] text-[#334155] font-mono mt-3">
                → blueagent.xyz/score
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons — outside card */}
        <div className="flex gap-3 mt-4 justify-center">
          <button onClick={handleDownload}
            className="flex items-center gap-2 text-xs border border-[#4a90d9] text-[#4a90d9] px-4 py-2 rounded-lg hover:bg-[#4a90d9] hover:text-white transition font-mono">
            📥 Download PNG
          </button>
          <button onClick={handleShare}
            className="flex items-center gap-2 text-xs bg-black text-white px-4 py-2 rounded-lg hover:opacity-80 transition font-mono border border-[#333]">
            𝕏 Share to X
          </button>
          {onClose && (
            <button onClick={onClose}
              className="text-xs text-[#64748b] px-4 py-2 rounded-lg hover:text-white transition font-mono">
              ✕ Close
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
