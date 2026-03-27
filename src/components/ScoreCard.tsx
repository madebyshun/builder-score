'use client'
import { BuilderScore } from '@/types'
import { TIER_COLORS, TIER_EMOJI } from '@/lib/score'
import { useRef } from 'react'

interface Props {
  score: BuilderScore
  onClose?: () => void
}

export function ScoreCard({ score, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const tierColor = TIER_COLORS[score.tier]
  const tierEmoji = TIER_EMOJI[score.tier]
  const sub = score.subscores || { onchain: 0, content: 0, community: 0, bankrBonus: 0 }

  const bars = [
    { label: 'Consistency',   value: sub.onchain   ?? Math.round(score.overall * 0.9),  color: '#4a90d9',  max: 25 },
    { label: 'Technical',     value: sub.content   ?? Math.round(score.overall * 0.8),  color: '#00b4d8',  max: 25 },
    { label: 'Builder focus', value: sub.community ?? Math.round(score.overall * 0.85), color: '#8b5cf6',  max: 25 },
    { label: 'Community',     value: Math.round((sub.community ?? score.overall) * 0.85), color: '#34d399', max: 25 },
  ]

  async function handleDownload() {
    try {
      const { default: html2canvas } = await import('html2canvas')
      if (!cardRef.current) return
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#060c1a',
        scale: 2,
        useCORS: true,
        allowTaint: true,
      })
      const link = document.createElement('a')
      link.download = `builder-score-${score.handle}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch {
      alert('Download failed. Try again.')
    }
  }

  function handleShare() {
    const text = encodeURIComponent(
      `My Builder Score on Base: ${score.overall} ${tierEmoji} ${score.tier}\n\nCheck yours 👇\nblueagent.xyz/score`
    )
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose?.() }}>

      <div className="w-full max-w-4xl">
        {/* Card — 1600x900 ratio = 16:9, rendered at ~800x450 */}
        <div ref={cardRef}
          className="relative w-full overflow-hidden rounded-2xl border border-[#1e2d4a]"
          style={{
            aspectRatio: '16/9',
            background: 'linear-gradient(135deg, #060c1a 0%, #0a1428 60%, #060c1a 100%)',
          }}>

          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10"
              style={{ background: tierColor, filter: 'blur(80px)' }} />
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 rounded-full opacity-5"
              style={{ background: '#4a90d9', filter: 'blur(60px)' }} />
          </div>

          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-3 border-b border-white/5">
            <div className="flex items-center gap-1.5">
              {['#ff5f57','#febc2e','#28c840'].map((c, i) => (
                <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
              ))}
              <span className="text-white/20 text-[9px] font-mono ml-2 tracking-widest">blue-agent ~ builder-score</span>
            </div>
            <span className="text-white/20 text-[9px] font-mono tracking-widest">blueagent.xyz</span>
          </div>

          {/* Main content */}
          <div className="absolute inset-0 flex items-center px-10 pt-8 pb-6 gap-8">

            {/* LEFT — handle + tier + SCORE */}
            <div className="flex flex-col justify-center flex-shrink-0" style={{ minWidth: '200px' }}>
              {/* Handle + avatar row */}
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-full overflow-hidden bg-[#1e2d4a] flex-shrink-0"
                  style={{ width: '48px', height: '48px', border: `2px solid ${tierColor}` }}>
                  {score.avatar ? (
                    <img src={score.avatar} alt={score.handle}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      crossOrigin="anonymous"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🟦</div>
                  )}
                </div>
                <div>
                  <p className="text-white font-bold font-mono" style={{ fontSize: '14px' }}>@{score.handle}</p>
                  <span className="font-mono" style={{ fontSize: '10px', color: tierColor }}>
                    {tierEmoji} {score.tier}
                  </span>
                </div>
              </div>

              {/* SCORE label */}
              <p className="font-mono" style={{ fontSize: '9px', color: '#334155', letterSpacing: '3px', marginBottom: '4px' }}>SCORE</p>

              {/* Hero number */}
              <div className="font-bold font-mono leading-none"
                style={{
                  fontSize: '110px',
                  color: '#ffffff',
                  textShadow: `0 0 40px ${tierColor}88, 0 0 80px ${tierColor}44`,
                  lineHeight: 1,
                  letterSpacing: '-4px',
                }}>
                {score.overall}
              </div>

              {(sub.bankrBonus ?? 0) > 0 && (
                <p className="font-mono mt-2" style={{ fontSize: '9px', color: '#34d399' }}>🟦 +{sub.bankrBonus} Bankr bonus</p>
              )}
            </div>

            {/* VERTICAL DIVIDER */}
            <div className="flex-shrink-0 self-stretch" style={{ width: '1px', backgroundColor: '#1e2d4a' }} />

            {/* RIGHT — Metrics + summary */}
            <div className="flex-1 flex flex-col justify-center gap-3">
              {bars.map(b => (
                <div key={b.label}>
                  <p className="font-mono" style={{ fontSize: '9px', color: '#4a5568', letterSpacing: '1.5px', marginBottom: '2px' }}>
                    {b.label.toUpperCase()}
                  </p>
                  <p className="font-bold font-mono" style={{ fontSize: '26px', color: b.color, letterSpacing: '-1px', lineHeight: 1 }}>
                    +{b.value}
                  </p>
                </div>
              ))}

              {/* Summary */}
              {score.summary && (
                <div style={{ borderTop: '1px solid #1e2d4a', paddingTop: '10px', marginTop: '2px' }}>
                  <p className="font-mono leading-relaxed" style={{ fontSize: '10px', color: '#64748b' }}>
                    💡 {score.summary}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
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
