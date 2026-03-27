'use client'
import { BuilderScore } from '@/types'
import { TIER_COLORS, TIER_EMOJI } from '@/lib/score'
import { useRef } from 'react'

interface Props {
  score: BuilderScore
  onClose?: () => void
}

const C = {
  bg:      '#060c1a',
  border:  '#1e2d4a',
  blue:    '#4a90d9',
  cta:     '#00b4d8',
  green:   '#34d399',
  purple:  '#8b5cf6',
  muted:   '#334155',
  white:   '#e2f0fb',
}

export function ScoreCard({ score, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const tierColor = TIER_COLORS[score.tier]
  const tierEmoji = TIER_EMOJI[score.tier]
  const sub = score.subscores || { onchain: 0, content: 0, community: 0, bankrBonus: 0 }

  const metrics = [
    { label: 'Consistency',   value: sub.onchain   ?? Math.round(score.overall * 0.22), color: C.blue   },
    { label: 'Technical',     value: sub.content   ?? Math.round(score.overall * 0.20), color: C.cta    },
    { label: 'Builder focus', value: sub.community ?? Math.round(score.overall * 0.21), color: C.purple  },
    { label: 'Community',     value: Math.round((sub.community ?? score.overall) * 0.19), color: C.green },
  ]

  async function handleDownload() {
    try {
      const { default: html2canvas } = await import('html2canvas')
      if (!cardRef.current) return
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: C.bg, scale: 2, useCORS: true, allowTaint: true,
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

  const mono = 'ui-monospace, "Courier New", monospace'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose?.() }}>

      <div style={{ width: '100%', maxWidth: '760px' }}>

        {/* Card */}
        <div ref={cardRef} style={{
          width: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          background: C.bg,
          border: `1px solid ${C.border}`,
          boxShadow: `0 0 40px ${C.blue}22`,
          fontFamily: mono,
        }}>

          {/* TOP — 2 columns */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}` }}>

            {/* LEFT — Score */}
            <div style={{
              flex: '0 0 50%',
              padding: '40px 36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              borderRight: `1px solid ${C.border}`,
            }}>
              <div style={{ fontSize: 10, color: C.muted, letterSpacing: 3, marginBottom: 16 }}>
                BUILDER SCORE
              </div>

              {/* Hero number */}
              <div style={{
                fontSize: 120,
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1,
                letterSpacing: -6,
                textShadow: `0 0 60px ${C.blue}99, 0 0 120px ${C.blue}44`,
              }}>
                {score.overall}
              </div>

              {/* Tier */}
              <div style={{
                marginTop: 16,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                color: tierColor,
                border: `1px solid ${tierColor}`,
                borderRadius: 6,
                padding: '4px 12px',
                alignSelf: 'flex-start',
                backgroundColor: `${tierColor}15`,
              }}>
                {tierEmoji} {score.tier}
              </div>

              {(sub.bankrBonus ?? 0) > 0 && (
                <div style={{ marginTop: 8, fontSize: 10, color: C.green }}>
                  🟦 +{sub.bankrBonus} Bankr bonus
                </div>
              )}
            </div>

            {/* RIGHT — Profile */}
            <div style={{
              flex: '0 0 50%',
              padding: '40px 36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 16,
            }}>
              {/* Avatar + handle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 72, height: 72,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: `2px solid ${C.blue}`,
                  background: '#1e2d4a',
                  flexShrink: 0,
                }}>
                  {score.avatar
                    ? <img src={score.avatar} alt="" crossOrigin="anonymous"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🟦</div>
                  }
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#ffffff' }}>@{score.handle}</div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 4, letterSpacing: 1 }}>BASE BUILDER</div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, backgroundColor: C.border }} />

              {/* Summary — same as bot 💡 */}
              {score.summary && (
                <div style={{ fontSize: 12, color: C.white, lineHeight: 1.6, opacity: 0.8 }}>
                  💡 {score.summary}
                </div>
              )}

              {/* Footer tag */}
              <div style={{ fontSize: 10, color: C.cta, letterSpacing: 1, marginTop: 'auto' }}>
                → blueagent.xyz/score
              </div>
            </div>
          </div>

          {/* BOTTOM — Metrics row */}
          <div style={{
            display: 'flex',
            borderTop: `1px solid ${C.border}`,
          }}>
            {metrics.map((m, i) => (
              <div key={m.label} style={{
                flex: 1,
                padding: '20px 24px',
                borderRight: i < metrics.length - 1 ? `1px solid ${C.border}` : 'none',
              }}>
                <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2, marginBottom: 8 }}>
                  {m.label.toUpperCase()}
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, color: m.color, letterSpacing: -1, lineHeight: 1 }}>
                  +{m.value}
                </div>
                {/* Thin bar */}
                <div style={{ height: 2, backgroundColor: '#1a2540', borderRadius: 2, marginTop: 10, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.round(m.value / 25 * 100)}%`,
                    backgroundColor: m.color,
                    borderRadius: 2,
                  }} />
                </div>
              </div>
            ))}
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
