'use client'
import { BuilderScore } from '@/types'
import { TIER_COLORS, TIER_EMOJI } from '@/lib/score'
import { useRef } from 'react'

interface Props {
  score: BuilderScore
  onClose?: () => void
}

function Bar({ value, color, label, max = 100 }: { value: number; color: string; label: string; max?: number }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] w-24 flex-shrink-0 font-mono" style={{ color: '#64748b' }}>{label}</span>
      <div className="flex-1 h-1 bg-[#1a2540] rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-[11px] w-5 text-right flex-shrink-0 font-mono font-bold" style={{ color }}>{value}</span>
    </div>
  )
}

export function ScoreCard({ score, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const tierColor = TIER_COLORS[score.tier]
  const tierEmoji = TIER_EMOJI[score.tier]

  const sub = score.subscores || { onchain: 0, content: 0, community: 0, bankrBonus: 0 }
  const bars = [
    { label: 'Consistency',   value: sub.onchain   ?? Math.round(score.overall * 0.9),  color: '#4a90d9', max: 25 },
    { label: 'Technical',     value: sub.content   ?? Math.round(score.overall * 0.8),  color: '#00b4d8', max: 25 },
    { label: 'Builder focus', value: sub.community ?? Math.round(score.overall * 0.85), color: '#8b5cf6', max: 25 },
    { label: 'Community',     value: Math.round((sub.community ?? score.overall * 0.8) * 0.9), color: '#34d399', max: 25 },
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
        {/* Card — X feed optimized (500x500 ratio) */}
        <div ref={cardRef} className="rounded-2xl overflow-hidden border border-[#1e2d4a] w-[500px]"
          style={{ background: 'linear-gradient(135deg, #060c1a 0%, #0a1428 100%)' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#1e2d4a]">
            <div className="flex items-center gap-2">
              {['#ff5f57','#febc2e','#28c840'].map((c, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
              ))}
              <span className="text-[#334155] text-[10px] font-mono ml-2">blue-agent ~ builder-score</span>
            </div>
            <span className="text-[#4a90d9] text-[10px] font-mono">blueagent.xyz</span>
          </div>

          {/* Main */}
          <div className="p-5">
            {/* Top row: avatar + score */}
            <div className="flex items-center gap-4 mb-5">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 flex-shrink-0 bg-[#1e2d4a]"
                style={{ borderColor: tierColor }}>
                {score.avatar ? (
                  <img src={score.avatar} alt={score.handle}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">🟦</div>
                )}
              </div>

              {/* Handle + tier */}
              <div className="flex-1">
                <p className="text-white font-bold text-sm font-mono">@{score.handle}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-full border font-mono"
                    style={{ color: tierColor, borderColor: tierColor, backgroundColor: `${tierColor}15` }}>
                    {tierEmoji} {score.tier}
                  </span>
                  {(sub.bankrBonus ?? 0) > 0 && (
                    <span className="text-[10px] text-[#34d399] font-mono">🟦 +{sub.bankrBonus}</span>
                  )}
                </div>
              </div>

              {/* Big score */}
              <div className="text-right">
                <span className="font-bold text-white font-mono leading-none"
                  style={{ fontSize: '52px', textShadow: `0 0 20px ${tierColor}88` }}>
                  {score.overall}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#1e2d4a] mb-4" />

            {/* Sub-scores */}
            <div className="space-y-2.5 mb-4">
              {bars.map(b => <Bar key={b.label} {...b} />)}
            </div>

            {/* Summary */}
            {score.summary && (
              <div className="border-t border-[#1e2d4a] pt-3 mt-3">
                <p className="text-[#64748b] text-[11px] font-mono leading-relaxed">
                  💡 {score.summary}
                </p>
              </div>
            )}
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
