'use client'
import { useState } from 'react'
import { ScoreCard } from '@/components/ScoreCard'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useTheme } from '@/components/ThemeProvider'
import { BuilderScore } from '@/types'

const MOCK_LEADERBOARD = [
  { rank: 1, handle: 'madebyshun', score: 82, points: 1240, earned: 12400000, streak: 14, projects: 3, change7d: 12, tier: 'Founder' },
  { rank: 2, handle: 'jessepollak', score: 78, points: 980, earned: 9800000, streak: 7, projects: 5, change7d: 5, tier: 'Shipper' },
  { rank: 3, handle: 'buildonbase', score: 74, points: 760, earned: 7600000, streak: 21, projects: 2, change7d: -3, tier: 'Shipper' },
  { rank: 4, handle: 'basedbuilder', score: 68, points: 540, earned: 5400000, streak: 3, projects: 1, change7d: 8, tier: 'Builder' },
  { rank: 5, handle: 'onchaindev', score: 65, points: 420, earned: 4200000, streak: 9, projects: 4, change7d: 15, tier: 'Builder' },
]

export default function Home() {
  const [handle, setHandle] = useState('')
  const [score, setScore] = useState<BuilderScore | null>(null)
  const [loading, setLoading] = useState(false)
  const { theme } = useTheme()

  const isDark = theme === 'dark'

  // Theme-aware classes
  const bg        = isDark ? 'bg-[#0a0f1e]' : 'bg-[#f0f4f8]'
  const card      = isDark ? 'bg-[#0d1425] border-[#1e2d4a]' : 'bg-white border-[#c8d8e8]'
  const navBg     = isDark ? 'bg-[#0a0f1e]/90 border-[#1e2d4a]' : 'bg-white/80 border-[#c8d8e8]'
  const textMain  = isDark ? 'text-[#e2f0fb]' : 'text-[#0a0f1e]'
  const textMuted = isDark ? 'text-[#4a90d9]' : 'text-[#64748b]'
  const input     = isDark ? 'bg-[#0d1425] border-[#1e2d4a] text-[#e2f0fb] placeholder-[#334155]' : 'bg-white border-[#c8d8e8] text-[#0a0f1e]'
  const tableRow  = isDark ? 'border-[#1e2d4a] hover:bg-[#0d1425]' : 'border-[#f0f4f8] hover:bg-[#f8fafc]'
  const tableHead = isDark ? 'bg-[#0d1425] text-[#4a90d9] border-[#1e2d4a]' : 'bg-[#f8fafc] text-[#64748b] border-[#c8d8e8]'
  const statsBg   = isDark ? 'bg-[#060d1a]' : 'bg-[#0a0f1e]'

  async function handleCheck() {
    if (!handle.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`/api/score?handle=${handle.replace('@', '')}`)
      const data = await res.json()
      if (data.error) { alert(`Error: ${data.error}`); return }
      // Ensure subscores exist
      if (!data.subscores) {
        data.subscores = {
          consistency:  Math.round((data.overall || 50) * 0.22),
          technical:    Math.round((data.overall || 50) * 0.20),
          builderFocus: Math.round((data.overall || 50) * 0.21),
          community:    Math.round((data.overall || 50) * 0.19),
          bankrBonus:   0
        }
      }
      setScore(data)
    } catch (e) {
      alert('Failed to fetch score. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={`min-h-screen ${bg} font-mono transition-colors duration-200`}>
      {/* Nav */}
      <nav className={`border-b ${navBg} backdrop-blur px-6 py-3 flex items-center justify-between sticky top-0 z-10`}>
        <span className="text-[#4a90d9] font-bold tracking-widest text-sm">🟦 BLUE AGENT</span>
        <div className={`flex gap-6 text-xs ${textMuted}`}>
          <a href="/dashboard" className={`hover:text-[#4a90d9] transition`}>Dashboard</a>
          <a href="/projects" className={`hover:text-[#4a90d9] transition`}>Projects</a>
          <a href="https://t.me/blueagent_hub" target="_blank" className={`hover:text-[#4a90d9] transition`}>Community</a>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button className="text-xs border border-[#4a90d9] text-[#4a90d9] px-3 py-1 rounded hover:bg-[#4a90d9] hover:text-white transition">
            Connect Wallet
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-2xl mx-auto pt-16 pb-12 px-4 text-center">
        <p className="text-xs text-[#4a90d9] tracking-widest mb-3">▸ blue-agent ~ builder-score</p>
        <h1 className={`text-4xl font-bold ${textMain} mb-3`}>
          What's your <span className="text-[#4a90d9]">Builder Score</span>?
        </h1>
        <p className={`${textMuted} text-sm mb-8`}>
          Discover and rank Base builders by onchain activity, content & community.
        </p>

        {/* Input */}
        <div className="flex gap-2 max-w-md mx-auto mb-8">
          <input
            value={handle}
            onChange={e => setHandle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCheck()}
            placeholder="@yourhandle"
            className={`flex-1 border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#4a90d9] ${input}`}
          />
          <button
            onClick={handleCheck}
            disabled={loading}
            className="bg-[#4a90d9] text-white px-5 py-3 rounded-lg text-sm font-bold hover:bg-[#357abd] transition disabled:opacity-50"
          >
            {loading ? '...' : 'Generate →'}
          </button>
        </div>

        {/* Score Card Popup */}
        {score && (
          <ScoreCard score={score} onClose={() => setScore(null)} />
        )}
      </section>

      {/* Stats Bar */}
      <section className={`${statsBg} py-4`}>
        <div className="max-w-4xl mx-auto flex justify-around text-center">
          {[
            { label: 'Builders', value: '247' },
            { label: 'Projects', value: '89' },
            { label: '$BLUEAGENT Distributed', value: '842M' },
            { label: 'Avg Score', value: '61' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-[#4a90d9] font-bold text-lg">{s.value}</div>
              <div className="text-[#334155] text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Leaderboard */}
      <section className="max-w-5xl mx-auto py-12 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-lg font-bold ${textMain}`}>🏆 Top Builders</h2>
          <a href="/dashboard" className="text-xs text-[#4a90d9] hover:underline">Full Dashboard →</a>
        </div>

        <div className={`${card} rounded-xl border overflow-hidden`}>
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b text-xs ${tableHead}`}>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Builder</th>
                <th className="px-4 py-3 text-right">Score</th>
                <th className="px-4 py-3 text-right">Points</th>
                <th className="px-4 py-3 text-right">$BLUEAGENT</th>
                <th className="px-4 py-3 text-right">Streak</th>
                <th className="px-4 py-3 text-right">7d</th>
                <th className="px-4 py-3 text-right">Projects</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_LEADERBOARD.map((b) => (
                <tr key={b.rank} className={`border-b ${tableRow} transition`}>
                  <td className={`px-4 py-3 ${textMuted} font-mono text-xs`}>
                    {b.rank === 1 ? '🥇' : b.rank === 2 ? '🥈' : b.rank === 3 ? '🥉' : b.rank}
                  </td>
                  <td className="px-4 py-3">
                    <a href={`/score/${b.handle}`} className={`${textMain} hover:text-[#4a90d9] font-medium`}>
                      @{b.handle}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-[#4a90d9] font-bold">{b.score}</span>
                    <span className={`${textMuted} text-xs`}>/100</span>
                  </td>
                  <td className={`px-4 py-3 text-right ${textMain}`}>{b.points.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-xs text-[#4a90d9]">{(b.earned / 1000000).toFixed(1)}M 🟦</td>
                  <td className="px-4 py-3 text-right text-xs">🔥 {b.streak}d</td>
                  <td className="px-4 py-3 text-right text-xs">
                    <span className={b.change7d >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {b.change7d >= 0 ? '+' : ''}{b.change7d}%
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-right text-xs ${textMuted}`}>{b.projects}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
