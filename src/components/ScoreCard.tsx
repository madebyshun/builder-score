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

  const subItems = [
    { label: 'CONSISTENCY',   value: sub.onchain   ?? Math.round(score.overall * 0.22) },
    { label: 'TECHNICAL',     value: sub.content   ?? Math.round(score.overall * 0.20) },
    { label: 'BUILDER FOCUS', value: sub.community ?? Math.round(score.overall * 0.21) },
    { label: 'COMMUNITY',     value: Math.round((sub.community ?? score.overall) * 0.19) },
  ]

  async function handleDownload() {
    try {
      const { default: html2canvas } = await import('html2canvas')
      if (!cardRef.current) return
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0f1e',
        scale: 2,
        useCORS: true,
        allowTaint: true,
      })
      const link = document.createElement('a')
      link.download = `builder-score-${score.handle}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch { alert('Download failed') }
  }

  function handleShare() {
    const text = encodeURIComponent(
      `My Builder Score on Base: ${score.overall} ${tierEmoji} ${score.tier}\n\nblueagent.xyz/score`
    )
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
  }

  // Footer stats
  const footerLeft = {
    label: 'ONCHAIN ACTIVITY',
    value: `${sub.onchain ?? Math.round(score.overall * 0.9)}%`,
    bar: sub.onchain ?? Math.round(score.overall * 0.9),
  }
  const footerRight = {
    label: 'BUILDER SCORE',
    value: `${score.overall}/100`,
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose?.() }}>

      <div className="w-full" style={{ maxWidth: '720px' }}>
        {/* Card — 16:9 */}
        <div ref={cardRef}
          style={{
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: '16px',
            overflow: 'hidden',
            position: 'relative',
            background: 'linear-gradient(135deg, #0a1228 0%, #0d1635 50%, #080f20 100%)',
            fontFamily: 'ui-monospace, monospace',
          }}>

          {/* Subtle grid overlay */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.03,
            backgroundImage: 'linear-gradient(#4a90d9 1px, transparent 1px), linear-gradient(90deg, #4a90d9 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />

          {/* TOP BAR */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: '1px solid rgba(74,144,217,0.1)',
          }}>
            {/* Label */}
            <div style={{
              border: '1px solid rgba(74,144,217,0.4)',
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '10px',
              color: 'rgba(74,144,217,0.8)',
              letterSpacing: '2px',
            }}>
              BUILDER_SCORE 🟦
            </div>

            {/* Avatar + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.5px' }}>
                  @{score.handle}
                </div>
                <div style={{
                  fontSize: '9px', letterSpacing: '1px', marginTop: '2px',
                  color: tierColor,
                }}>
                  {tierEmoji} {score.tier.toUpperCase()}
                </div>
              </div>
              <div style={{
                width: '48px', height: '48px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: `2px solid ${tierColor}`,
                background: '#1e2d4a',
                flexShrink: 0,
              }}>
                {score.avatar
                  ? <img src={score.avatar} alt="" crossOrigin="anonymous"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🟦</div>
                }
              </div>
            </div>
          </div>

          {/* MAIN BODY */}
          <div style={{
            position: 'absolute',
            top: '64px', bottom: '64px',
            left: 0, right: 0,
            display: 'flex',
            alignItems: 'center',
            padding: '0 32px',
            gap: '32px',
          }}>
            {/* LEFT — Hero score number */}
            <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                fontSize: '160px',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1,
                letterSpacing: '-8px',
                textShadow: `0 0 60px ${tierColor}66, 0 0 120px ${tierColor}22`,
                fontFamily: 'ui-monospace, monospace',
              }}>
                {score.overall}
              </div>
            </div>

            {/* DIVIDER */}
            <div style={{ width: '1px', alignSelf: 'stretch', background: 'rgba(74,144,217,0.15)', flexShrink: 0 }} />

            {/* RIGHT — Sub-scores */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '18px' }}>
              {subItems.map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '2px' }}>
                    {item.label}
                  </span>
                  <span style={{
                    fontSize: '28px', fontWeight: 700,
                    color: '#ffffff',
                    letterSpacing: '-1px',
                    fontFamily: 'ui-monospace, monospace',
                  }}>
                    +{item.value}
                  </span>
                </div>
              ))}
              {(sub.bankrBonus ?? 0) > 0 && (
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '10px', color: '#34d399', letterSpacing: '2px' }}>
                    BANKR BONUS
                  </span>
                  <span style={{ fontSize: '28px', fontWeight: 700, color: '#34d399', letterSpacing: '-1px' }}>
                    +{sub.bankrBonus}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM BAR */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 28px',
            borderTop: '1px solid rgba(74,144,217,0.1)',
          }}>
            {/* Left: onchain bar */}
            <div>
              <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', marginBottom: '6px' }}>
                {footerLeft.label}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', letterSpacing: '-1px' }}>
                  {footerLeft.value}
                </span>
                <div style={{ width: '80px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${footerLeft.bar}%`, background: '#4a90d9', borderRadius: '2px' }} />
                </div>
              </div>
            </div>

            {/* Summary center */}
            {score.summary && (
              <div style={{ flex: 1, textAlign: 'center', padding: '0 24px' }}>
                <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.25)', lineHeight: 1.5, letterSpacing: '0.5px' }}>
                  {score.summary}
                </p>
              </div>
            )}

            {/* Right: builder score */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', marginBottom: '4px' }}>
                {footerRight.label}
              </div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', letterSpacing: '-1px' }}>
                {footerRight.value}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4 justify-center">
          <button onClick={handleDownload}
            className="text-xs border border-[#4a90d9] text-[#4a90d9] px-5 py-2 rounded-lg hover:bg-[#4a90d9] hover:text-white transition font-mono">
            📥 Download PNG
          </button>
          <button onClick={handleShare}
            className="text-xs bg-black text-white px-5 py-2 rounded-lg hover:opacity-80 transition font-mono border border-[#333]">
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
