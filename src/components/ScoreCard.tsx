'use client'
import { BuilderScore } from '@/types'
import { TIER_COLORS, TIER_EMOJI } from '@/lib/score'
import { useRef } from 'react'

interface Props {
  score: BuilderScore
  onClose?: () => void
}

// Blue Agent color palette
const C = {
  bg:      '#ffffff',
  frame:   '#c8d8e8',
  titleBg: '#4a90d9',
  body:    '#0a0f1e',
  textMain:'#e2f0fb',
  textBlue:'#4a90d9',
  textCta: '#00b4d8',
  green:   '#34d399',
  muted:   '#334155',
}

export function ScoreCard({ score, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const tierColor = TIER_COLORS[score.tier]
  const tierEmoji = TIER_EMOJI[score.tier]
  const sub = score.subscores || { onchain: 0, content: 0, community: 0, bankrBonus: 0 }

  const subItems = [
    { label: 'Consistency',   value: sub.onchain   ?? Math.round(score.overall * 0.22), color: C.textBlue },
    { label: 'Technical',     value: sub.content   ?? Math.round(score.overall * 0.20), color: C.textCta  },
    { label: 'Builder focus', value: sub.community ?? Math.round(score.overall * 0.21), color: '#8b5cf6'  },
    { label: 'Community',     value: Math.round((sub.community ?? score.overall) * 0.19), color: C.green  },
  ]

  async function handleDownload() {
    try {
      const { default: html2canvas } = await import('html2canvas')
      if (!cardRef.current) return
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: C.bg,
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
      `My Builder Score on Base: ${score.overall} ${tierEmoji} ${score.tier}\n\nCheck yours → blueagent.xyz/score`
    )
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
  }

  const mono = 'ui-monospace, "Courier New", monospace'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose?.() }}>

      <div style={{ width: '100%', maxWidth: '720px' }}>

        {/* ── Card ── 16:9 Mac OS Terminal */}
        <div ref={cardRef} style={{
          width: '100%',
          aspectRatio: '16/9',
          borderRadius: '14px',
          overflow: 'hidden',
          border: `1.5px solid ${C.frame}`,
          boxShadow: '0 24px 64px rgba(74,144,217,0.18), 0 4px 16px rgba(0,0,0,0.12)',
          background: C.bg,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: mono,
        }}>

          {/* Title bar */}
          <div style={{
            backgroundColor: C.titleBg,
            padding: '10px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0,
          }}>
            {['#ff5f57','#febc2e','#28c840'].map((c, i) => (
              <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: c }} />
            ))}
            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, marginLeft: 14, letterSpacing: 1 }}>
              blue-agent ~ builder-score
            </span>
          </div>

          {/* Terminal body */}
          <div style={{
            backgroundColor: C.body,
            flex: 1,
            display: 'flex',
            padding: '20px 32px',
            gap: '24px',
          }}>

            {/* LEFT — Avatar + handle + score hero */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              width: '160px',
              gap: '10px',
            }}>
              {/* Prompt line */}
              <span style={{ color: C.muted, fontSize: 10, alignSelf: 'flex-start' }}>▸ score @{score.handle}</span>

              {/* Avatar */}
              <div style={{
                width: 64, height: 64,
                borderRadius: '50%',
                overflow: 'hidden',
                border: `2px solid ${C.textBlue}`,
                background: '#1e2d4a',
                flexShrink: 0,
              }}>
                {score.avatar
                  ? <img src={score.avatar} alt="" crossOrigin="anonymous"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🟦</div>
                }
              </div>

              {/* Score hero */}
              <div style={{
                fontSize: 72,
                fontWeight: 700,
                color: C.textBlue,
                lineHeight: 1,
                letterSpacing: -3,
                textShadow: `0 0 30px ${C.textBlue}88`,
              }}>
                {score.overall}
              </div>

              {/* Tier */}
              <div style={{
                fontSize: 11,
                color: tierColor,
                letterSpacing: 1,
                border: `1px solid ${tierColor}`,
                borderRadius: 4,
                padding: '2px 8px',
                backgroundColor: `${tierColor}15`,
              }}>
                {tierEmoji} {score.tier}
              </div>

              {/* Bankr bonus */}
              {(sub.bankrBonus ?? 0) > 0 && (
                <div style={{ fontSize: 9, color: C.green, letterSpacing: 0.5 }}>
                  🟦 +{sub.bankrBonus} Bankr bonus
                </div>
              )}
            </div>

            {/* VERTICAL DIVIDER */}
            <div style={{ width: 1, backgroundColor: '#1e2d4a', flexShrink: 0 }} />

            {/* RIGHT — Sub-scores + summary */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '14px',
            }}>
              {subItems.map(item => (
                <div key={item.label}>
                  {/* Label row */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: 5,
                  }}>
                    <span style={{ fontSize: 10, color: C.muted, letterSpacing: 1 }}>▸ {item.label}</span>
                    <span style={{ fontSize: 18, fontWeight: 700, color: item.color, letterSpacing: -0.5 }}>
                      {item.value}
                    </span>
                  </div>
                  {/* Bar */}
                  <div style={{ height: 3, backgroundColor: '#1a2540', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.round(item.value / 25 * 100)}%`,
                      backgroundColor: item.color,
                      borderRadius: 2,
                    }} />
                  </div>
                </div>
              ))}

              {/* Summary */}
              {score.summary && (
                <div style={{ borderTop: '1px solid #1e2d4a', paddingTop: 10, marginTop: 4 }}>
                  <span style={{ fontSize: 8, color: C.muted, lineHeight: 1.6 }}>
                    → {score.summary}
                  </span>
                </div>
              )}

              {/* Footer CTA */}
              <div style={{ fontSize: 9, color: C.textCta, marginTop: 'auto', letterSpacing: 0.5 }}>
                → blueagent.xyz/score
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'center' }}>
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
