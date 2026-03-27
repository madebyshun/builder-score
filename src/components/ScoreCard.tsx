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
  const sub = score.subscores || { consistency: 0, technical: 0, builderFocus: 0, community: 0, bankrBonus: 0 }

  const bars = [
    { label: 'Consistency',   value: sub.consistency  ?? Math.round(score.overall * 0.22), color: '#4a90d9', max: 25 },
    { label: 'Technical',     value: sub.technical    ?? Math.round(score.overall * 0.20), color: '#00b4d8', max: 25 },
    { label: 'Builder focus', value: sub.builderFocus ?? Math.round(score.overall * 0.21), color: '#8b5cf6', max: 25 },
    { label: 'Community',     value: sub.community    ?? Math.round(score.overall * 0.19), color: '#34d399', max: 25 },
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

          {/* Main content — 1:1, no divider */}
          <div className="absolute inset-0 flex items-end px-10 pt-6 pb-6">

            {/* LEFT 50% — score top-aligned */}
            <div style={{ width: '50%', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start', paddingLeft: '8px' }}>
              <div className="font-bold font-mono"
                style={{
                  fontSize: '170px',
                  color: '#ffffff',
                  textShadow: `0 0 50px ${tierColor}99, 0 0 100px ${tierColor}44`,
                  lineHeight: 1,
                  letterSpacing: '-8px',
                }}>
                {score.overall}
              </div>
            </div>

            {/* RIGHT 50% */}
            <div style={{
              width: '50%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              paddingRight: '8px',
              height: '100%',
              paddingTop: '14px',
              paddingBottom: '6px',
            }}>

              {/* ── User info ── */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexDirection: 'row-reverse' }}>
                {/* Avatar */}
                <div style={{
                  width: '54px', height: '54px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: `2px solid ${tierColor}`,
                  background: '#1e2d4a',
                  flexShrink: 0,
                  boxShadow: `0 0 12px ${tierColor}44`,
                }}>
                  {score.avatar ? (
                    <img src={score.avatar} alt={score.handle}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      crossOrigin="anonymous"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🟦</div>
                  )}
                </div>
                {/* Name + tier */}
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.5px', fontFamily: 'inherit' }}>
                    @{score.handle}
                  </p>
                  <p style={{ fontSize: '10px', color: '#4a5568', marginTop: '2px', letterSpacing: '1px', fontFamily: 'inherit' }}>
                    BASE BUILDER
                  </p>
                  <div style={{
                    display: 'inline-block',
                    marginTop: '4px',
                    fontSize: '10px',
                    color: tierColor,
                    border: `1px solid ${tierColor}`,
                    borderRadius: '4px',
                    padding: '1px 8px',
                    background: `${tierColor}15`,
                    fontFamily: 'inherit',
                  }}>
                    {tierEmoji} {score.tier}
                  </div>
                </div>
              </div>

              {/* ── Metrics ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                {bars.map(b => (
                  <div key={b.label} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '9px', color: '#4a5568', letterSpacing: '1.5px', fontFamily: 'inherit' }}>
                      {b.label.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '24px', fontWeight: 700, color: b.color, letterSpacing: '-1px', lineHeight: 1, fontFamily: 'inherit' }}>
                      +{b.value}
                    </span>
                  </div>
                ))}
                {(sub.bankrBonus ?? 0) > 0 && (
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '9px', color: '#34d399', letterSpacing: '1.5px', fontFamily: 'inherit' }}>BANKR BONUS</span>
                    <span style={{ fontSize: '24px', fontWeight: 700, color: '#34d399', letterSpacing: '-1px', lineHeight: 1, fontFamily: 'inherit' }}>+{sub.bankrBonus}</span>
                  </div>
                )}
              </div>

              {/* ── Summary ── */}
              {score.summary && (
                <div style={{ borderTop: '1px solid rgba(74,144,217,0.15)', paddingTop: '8px', width: '100%' }}>
                  <p style={{ fontSize: '9px', color: '#4a5568', lineHeight: 1.7, textAlign: 'right', fontFamily: 'inherit' }}>
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
