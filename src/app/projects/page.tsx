'use client'

const MOCK_PROJECTS = [
  { id: '1', name: 'Blue Agent Bot', description: 'AI assistant for Base builders. Score, signals, community automation.', url: 'https://t.me/Blockyagent_beta_bot', twitter: 'blocky_agent', submitterUsername: 'madebyshun', votes: 24, timestamp: Date.now() - 86400000 * 2 },
  { id: '2', name: 'Builder Score API', description: 'Open API to score any Base builder. Onchain + content + community.', url: 'https://blueagent.xyz/score', twitter: 'blocky_agent', submitterUsername: 'madebyshun', votes: 18, timestamp: Date.now() - 86400000 * 5 },
  { id: '3', name: 'Base Gem Signals', description: 'Real-time gem signals on Base. Filtered by FDV, liq, vol, buys.', url: 'https://t.me/blueagent_hub', twitter: 'blocky_agent', submitterUsername: 'madebyshun', votes: 12, timestamp: Date.now() - 86400000 * 7 },
]

export default function Projects() {
  return (
    <main className="min-h-screen bg-[#f0f4f8] font-mono">
      <nav className="border-b border-[#c8d8e8] bg-white/80 backdrop-blur px-6 py-3 flex items-center justify-between">
        <a href="/" className="text-[#4a90d9] font-bold tracking-widest text-sm">🟦 BLUE AGENT</a>
        <div className="flex gap-6 text-xs text-[#4a90d9]">
          <a href="/dashboard" className="hover:text-[#0a0f1e] transition">Dashboard</a>
          <a href="/projects" className="text-[#0a0f1e] font-bold">Projects</a>
          <a href="https://t.me/blueagent_hub" target="_blank" className="hover:text-[#0a0f1e] transition">Community</a>
        </div>
        <button className="text-xs border border-[#4a90d9] text-[#4a90d9] px-3 py-1 rounded hover:bg-[#4a90d9] hover:text-white transition">
          Connect Wallet
        </button>
      </nav>

      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0a0f1e]">Base Projects</h1>
            <p className="text-xs text-[#64748b] mt-1">Curated by Blue Agent · Submit via bot</p>
          </div>
          <a
            href="https://t.me/Blockyagent_beta_bot"
            target="_blank"
            className="text-xs bg-[#4a90d9] text-white px-4 py-2 rounded-lg hover:bg-[#357abd] transition"
          >
            + Submit Project
          </a>
        </div>

        <div className="grid gap-4">
          {MOCK_PROJECTS.map(p => (
            <div key={p.id} className="bg-white rounded-xl border border-[#c8d8e8] p-5 hover:border-[#4a90d9] transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-[#0a0f1e]">{p.name}</h3>
                    {p.twitter && (
                      <a href={`https://x.com/${p.twitter}`} target="_blank" className="text-[#4a90d9] text-xs hover:underline">
                        @{p.twitter}
                      </a>
                    )}
                  </div>
                  <p className="text-[#64748b] text-xs mb-3">{p.description}</p>
                  <div className="flex items-center gap-4 text-xs text-[#64748b]">
                    <span>👤 @{p.submitterUsername}</span>
                    <a href={p.url} target="_blank" className="text-[#4a90d9] hover:underline">🔗 View Project</a>
                    <span>{new Date(p.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
                <button className="flex flex-col items-center ml-4 border border-[#c8d8e8] rounded-lg px-3 py-2 hover:border-[#4a90d9] hover:text-[#4a90d9] transition text-[#64748b]">
                  <span className="text-lg">👍</span>
                  <span className="text-xs font-bold">{p.votes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
