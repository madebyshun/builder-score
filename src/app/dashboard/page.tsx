'use client'
import { useState } from 'react'

const MOCK_BUILDERS = [
  { rank: 1, handle: 'madebyshun', score: 82, points: 1240, earned: 12400000, streak: 14, projects: 3, change7d: 12, tier: 'Founder 🚀' },
  { rank: 2, handle: 'jessepollak', score: 78, points: 980, earned: 9800000, streak: 7, projects: 5, change7d: 5, tier: 'Shipper ⚡' },
  { rank: 3, handle: 'buildonbase', score: 74, points: 760, earned: 7600000, streak: 21, projects: 2, change7d: -3, tier: 'Shipper ⚡' },
  { rank: 4, handle: 'basedbuilder', score: 68, points: 540, earned: 5400000, streak: 3, projects: 1, change7d: 8, tier: 'Builder 🔨' },
  { rank: 5, handle: 'onchaindev', score: 65, points: 420, earned: 4200000, streak: 9, projects: 4, change7d: 15, tier: 'Builder 🔨' },
  { rank: 6, handle: 'basebuilder2', score: 58, points: 310, earned: 3100000, streak: 2, projects: 0, change7d: -5, tier: 'Builder 🔨' },
  { rank: 7, handle: 'cryptobuild', score: 52, points: 220, earned: 2200000, streak: 5, projects: 2, change7d: 3, tier: 'Builder 🔨' },
  { rank: 8, handle: 'newbuilder', score: 35, points: 110, earned: 1100000, streak: 1, projects: 1, change7d: 20, tier: 'Explorer 🌱' },
]

type SortKey = 'score' | 'points' | 'earned' | 'change7d' | 'streak'

export default function Dashboard() {
  const [sort, setSort] = useState<SortKey>('score')
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<'all' | 'rising' | 'new'>('all')

  const sorted = [...MOCK_BUILDERS]
    .filter(b => b.handle.includes(search.replace('@', '')))
    .sort((a, b) => b[sort] - a[sort])

  const rising = [...MOCK_BUILDERS].sort((a, b) => b.change7d - a.change7d).slice(0, 5)

  return (
    <main className="min-h-screen bg-[#f0f4f8] font-mono">
      {/* Nav */}
      <nav className="border-b border-[#c8d8e8] bg-white/80 backdrop-blur px-6 py-3 flex items-center justify-between">
        <a href="/" className="text-[#4a90d9] font-bold tracking-widest text-sm">🟦 BLUE AGENT</a>
        <div className="flex gap-6 text-xs text-[#4a90d9]">
          <a href="/dashboard" className="text-[#0a0f1e] font-bold">Dashboard</a>
          <a href="/projects" className="hover:text-[#0a0f1e] transition">Projects</a>
          <a href="https://t.me/blueagent_hub" target="_blank" className="hover:text-[#0a0f1e] transition">Community</a>
        </div>
        <button className="text-xs border border-[#4a90d9] text-[#4a90d9] px-3 py-1 rounded hover:bg-[#4a90d9] hover:text-white transition">
          Connect Wallet
        </button>
      </nav>

      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0a0f1e]">Builder Dashboard</h1>
            <p className="text-xs text-[#64748b] mt-1">247 builders · Updated live</p>
          </div>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search @handle..."
            className="border border-[#c8d8e8] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#4a90d9] bg-white w-48"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'rising', 'new'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-xs px-4 py-2 rounded-lg border transition capitalize ${
                tab === t
                  ? 'bg-[#4a90d9] text-white border-[#4a90d9]'
                  : 'border-[#c8d8e8] text-[#64748b] hover:border-[#4a90d9]'
              }`}
            >
              {t === 'rising' ? '🔥 Rising' : t === 'new' ? '🆕 New' : 'All Builders'}
            </button>
          ))}

          {/* Sort */}
          <div className="ml-auto flex gap-2">
            {(['score', 'points', 'earned', 'change7d', 'streak'] as SortKey[]).map(s => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`text-xs px-3 py-2 rounded-lg border transition ${
                  sort === s
                    ? 'bg-[#0a0f1e] text-white border-[#0a0f1e]'
                    : 'border-[#c8d8e8] text-[#64748b] hover:border-[#0a0f1e]'
                }`}
              >
                {s === 'change7d' ? '7d' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-[#c8d8e8] overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#c8d8e8] text-xs text-[#64748b] bg-[#f8fafc]">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Builder</th>
                <th className="px-4 py-3 text-left">Tier</th>
                <th className="px-4 py-3 text-right cursor-pointer hover:text-[#4a90d9]" onClick={() => setSort('score')}>Score {sort === 'score' ? '↓' : ''}</th>
                <th className="px-4 py-3 text-right cursor-pointer hover:text-[#4a90d9]" onClick={() => setSort('points')}>Points {sort === 'points' ? '↓' : ''}</th>
                <th className="px-4 py-3 text-right cursor-pointer hover:text-[#4a90d9]" onClick={() => setSort('earned')}>$BLUEAGENT {sort === 'earned' ? '↓' : ''}</th>
                <th className="px-4 py-3 text-right cursor-pointer hover:text-[#4a90d9]" onClick={() => setSort('streak')}>Streak {sort === 'streak' ? '↓' : ''}</th>
                <th className="px-4 py-3 text-right cursor-pointer hover:text-[#4a90d9]" onClick={() => setSort('change7d')}>7d {sort === 'change7d' ? '↓' : ''}</th>
                <th className="px-4 py-3 text-right">Projects</th>
              </tr>
            </thead>
            <tbody>
              {(tab === 'rising' ? rising : sorted).map((b) => (
                <tr key={b.rank} className="border-b border-[#f0f4f8] hover:bg-[#f8fafc] transition">
                  <td className="px-4 py-3 text-[#64748b] text-xs font-mono">
                    {b.rank === 1 ? '🥇' : b.rank === 2 ? '🥈' : b.rank === 3 ? '🥉' : b.rank}
                  </td>
                  <td className="px-4 py-3">
                    <a href={`/score/${b.handle}`} className="text-[#0a0f1e] hover:text-[#4a90d9] font-medium text-xs">
                      @{b.handle}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#64748b]">{b.tier}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-[#4a90d9] font-bold text-sm">{b.score}</span>
                    <span className="text-[#64748b] text-xs">/100</span>
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-[#0a0f1e]">{b.points.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-xs text-[#4a90d9]">{(b.earned / 1000000).toFixed(1)}M 🟦</td>
                  <td className="px-4 py-3 text-right text-xs">🔥 {b.streak}d</td>
                  <td className="px-4 py-3 text-right text-xs">
                    <span className={b.change7d >= 0 ? 'text-green-500' : 'text-red-400'}>
                      {b.change7d >= 0 ? '+' : ''}{b.change7d}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-[#64748b]">{b.projects}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
