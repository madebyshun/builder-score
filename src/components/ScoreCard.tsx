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
  const sub = score.subscores || { consistency: 0, technical: 0, builderFocus: 0, community: 0 }

  const dimensions = [
    { label: 'Consistency',   value: sub.consistency,  color: '#4a90d9' },
    { label: 'Technical',     value: sub.technical,    color: '#00b4d8' },
    { label: 'Builder focus', value: sub.builderFocus, color: '#8b5cf6' },
    { label: 'Community',     value: sub.community,    color: '#34d399' },
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
      `My Builder Score on Base: ${score.overall}/100 ${tierEmoji} ${score.tier}\n\nConsistency: ${sub.consistency}/25\nTechnical: ${sub.technical}/25\nBuilder focus: ${sub.builderFocus}/25\nCommunity: ${sub.community}/25\n\nCheck yours 👇\nt.me/blockyagent_bot`
    )
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
  }

  const fcFollowers = score.farcaster?.followers

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose?.() }}>

      <div className="w-full max-w-2xl">
        {/* Card — portrait-ish, optimized for mobile share */}
        <div ref={cardRef}
          className="relative w-full overflow-hidden rounded-2xl border border-[#1e2d4a]"
          style={{
            background: 'linear-gradient(160deg, #060c1a 0%, #0a1428 50%, #060c1a 100%)',
            padding: '32px',
          }}>

          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
              style={{ background: tierColor, filter: 'blur(80px)', transform: 'translate(30%, -30%)' }} />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-5"
              style={{ background: '#4a90d9', filter: 'blur(60px)', transform: 'translate(-30%, 30%)' }} />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col gap-6">

            {/* ── Header ── */}
            <div className="flex items-center justify-between">
              {/* Left: avatar + handle */}
              <div className="flex items-center gap-3">
                <div style={{
                  width: '52px', height: '52px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: `2px solid ${tierColor}55`,
                  background: '#1e2d4a',
                  flexShrink: 0,
                }}>
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
                  <p style={{ fontSize: '16px', fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>
                    @{score.handle}
                  </p>
                  <p style={{ fontSize: '11px', color: '#4a5568', marginTop: '2px', letterSpacing: '0.5px' }}>
                    Base Builder
                  </p>
                </div>
              </div>

              {/* Right: tier badge */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '4px',
              }}>
                <div style={{
                  fontSize: '11px',
                  color: tierColor,
                  border: `1px solid ${tierColor}55`,
                  borderRadius: '6px',
                  padding: '3px 10px',
                  background: `${tierColor}15`,
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                }}>
                  {tierEmoji} {score.tier.toUpperCase()}
                </div>
                {fcFollowers !== undefined && fcFollowers !== null && (
                  <p style={{ fontSize: '10px', color: '#64748b' }}>
                    🟣 {fcFollowers.toLocaleString()} FC followers
                  </p>
                )}
              </div>
            </div>

            {/* ── Score ── */}
            <div className="flex items-end gap-3">
              <span style={{
                fontSize: '96px',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1,
                letterSpacing: '-4px',
                textShadow: `0 0 40px ${tierColor}66`,
                fontFamily: 'monospace',
              }}>
                {score.overall}
              </span>
              <div style={{ paddingBottom: '12px' }}>
                <p style={{ fontSize: '13px', color: '#4a5568', letterSpacing: '1px' }}>/100</p>
                <p style={{ fontSize: '11px', color: tierColor, marginTop: '2px' }}>Builder Score</p>
              </div>
            </div>

            {/* ── Divider ── */}
            <div style={{ height: '1px', background: 'linear-gradient(90deg, #1e2d4a, transparent)' }} />

            {/* ── 4 Dimensions ── */}
            <div className="flex flex-col gap-3">
              {dimensions.map(d => (
                <div key={d.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', letterSpacing: '0.5px' }}>
                    {d.label}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Bar */}
                    <div style={{ width: '80px', height: '3px', background: '#1e2d4a', borderRadius: '2px' }}>
                      <div style={{
                        width: `${(d.value / 25) * 100}%`,
                        height: '100%',
                        background: d.color,
                        borderRadius: '2px',
                      }} />
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', minWidth: '36px', textAlign: 'right', fontFamily: 'monospace' }}>
                      {d.value}<span style={{ fontSize: '10px', color: '#4a5568', fontWeight: 400 }}>/25</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Summary ── */}
            {score.summary && (
              <>
                <div style={{ height: '1px', background: 'linear-gradient(90deg, #1e2d4a, transparent)' }} />
                <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.7 }}>
                  💡 {score.summary}
                </p>
              </>
            )}

            {/* ── Footer ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '-8px' }}>
              <span style={{ fontSize: '10px', color: '#2d3748', letterSpacing: '1px' }}>
                🟦 BLOCKY STUDIO
              </span>
              <span style={{ fontSize: '10px', color: '#2d3748', letterSpacing: '0.5px' }}>
                t.me/blockyagent_bot
              </span>
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
