'use client'
import { BuilderScore } from '@/types'
import { TIER_COLORS, TIER_EMOJI } from '@/lib/score'
import { useRef } from 'react'

interface Props {
  score: BuilderScore
  onClose?: () => void
}

// Blue Agent Visual Identity
const C = {
  bg:     '#ffffff',
  frame:  '#c8d8e8',
  title:  '#4a90d9',
  body:   '#0a0f1e',
  blue:   '#4a90d9',
  cta:    '#00b4d8',
  green:  '#34d399',
  purple: '#8b5cf6',
  muted:  '#334155',
  white:  '#e2f0fb',
  divider:'#1e2d4a',
}

export function ScoreCard({ score, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const tierColor = TIER_COLORS[score.tier]
  const tierEmoji = TIER_EMOJI[score.tier]
  const sub = score.subscores || { onchain: 0, content: 0, community: 0, bankrBonus: 0 }

  const metrics = [
    { label: 'Consistency',   value: sub.onchain   ?? Math.round(score.overall * 0.22), color: C.blue   },
    { label: 'Technical',     value: sub.content   ?? Math.round(score.overall * 0.20), color: C.cta    },
    { label: 'Builder focus', value: sub.community ?? Math.round(score.overall * 0.21), color: C.purple },
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

        {/* ── MAC OS TERMINAL CARD ── */}
        <div ref={cardRef} style={{
          width: '100%',
          borderRadius: '14px',
          overflow: 'hidden',
          border: `1.5px solid ${C.frame}`,
          boxShadow: '0 24px 64px rgba(74,144,217,0.18)',
          background: C.bg,
          fontFamily: mono,
        }}>

          {/* Title bar */}
          <div style={{
            backgroundColor: C.title,
            padding: '11px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            {['#ff5f57','#febc2e','#28c840'].map((c, i) => (
              <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: c }} />
            ))}
            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, marginLeft: 14, letterSpacing: 1 }}>
              blue-agent ~ builder-score
            </span>
          </div>

          {/* Terminal body */}
          <div style={{ backgroundColor: C.body }}>

            {/* TOP SECTION — 2 columns */}
            <div style={{
              display: 'flex',
              borderBottom: `1px solid ${C.divider}`,
            }}>

              {/* LEFT — Score hero */}
              <div style={{
                flex: '0 0 50%',
                padding: '32px 36px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                borderRight: `1px solid ${C.divider}`,
              }}>
                <span style={{ fontSize: 9, color: C.muted, letterSpacing: 3, marginBottom: 12 }}>▸ score</span>

                {/* Hero number */}
                <div style={{
                  fontSize: 108,
                  fontWeight: 900,
                  color: '#ffffff',
                  lineHeight: 1,
                  letterSpacing: -5,
                  textShadow: `0 0 50px ${C.blue}88, 0 0 100px ${C.blue}33`,
                }}>
                  {score.overall}
                </div>

                {/* Tier badge */}
                <div style={{
                  marginTop: 16,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 11,
                  color: tierColor,
                  border: `1px solid ${tierColor}`,
                  borderRadius: 4,
                  padding: '3px 10px',
                  alignSelf: 'flex-start',
                  backgroundColor: `${tierColor}15`,
                }}>
                  {tierEmoji} {score.tier}
                </div>

                {(sub.bankrBonus ?? 0) > 0 && (
                  <span style={{ marginTop: 8, fontSize: 9, color: C.green }}>🟦 +{sub.bankrBonus} Bankr bonus</span>
                )}
              </div>

              {/* RIGHT — Profile */}
              <div style={{
                flex: '0 0 50%',
                padding: '32px 36px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 16,
              }}>
                {/* Avatar + handle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 60, height: 60,
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
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🟦</div>
                    }
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>@{score.handle}</div>
                    <div style={{ fontSize: 9, color: C.muted, letterSpacing: 1.5, marginTop: 3 }}>BASE BUILDER</div>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, backgroundColor: C.divider }} />

                {/* Summary — 💡 same as bot */}
                {score.summary && (
                  <div style={{ fontSize: 11, color: C.white, lineHeight: 1.7, opacity: 0.75 }}>
                    💡 {score.summary}
                  </div>
                )}

                {/* CTA */}
                <div style={{ fontSize: 9, color: C.cta, letterSpacing: 1, marginTop: 'auto' }}>
                  → blueagent.xyz/score
                </div>
              </div>
            </div>

            {/* BOTTOM — Metrics row */}
            <div style={{ display: 'flex' }}>
              {metrics.map((m, i) => (
                <div key={m.label} style={{
                  flex: 1,
                  padding: '18px 24px',
                  borderRight: i < metrics.length - 1 ? `1px solid ${C.divider}` : 'none',
                }}>
                  <div style={{ fontSize: 8, color: C.muted, letterSpacing: 2, marginBottom: 8 }}>
                    {m.label.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 30, fontWeight: 700, color: m.color, letterSpacing: -1, lineHeight: 1 }}>
                    +{m.value}
                  </div>
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
