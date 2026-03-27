'use client'
import { useState, useEffect } from 'react'

interface Project {
  id: string
  name: string
  description: string
  url: string
  twitter?: string
  submitterUsername?: string
  timestamp: number
  votes: number
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', url: '', twitter: '', submitterHandle: '' })

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => { setProjects(Array.isArray(data) ? data.sort((a: Project, b: Project) => b.timestamp - a.timestamp) : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.description || !form.url) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (res.ok) { setSubmitted(true); setShowForm(false) }
    } finally { setSubmitting(false) }
  }

  return (
    <main className="min-h-screen bg-[#f0f4f8] font-mono">
      {/* Nav */}
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
            <p className="text-xs text-[#64748b] mt-1">Curated by Blue Agent · {projects.length} projects live</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-xs bg-[#4a90d9] text-white px-4 py-2 rounded-lg hover:bg-[#357abd] transition"
          >
            + Submit Project
          </button>
        </div>

        {/* Success banner */}
        {submitted && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">
            ✅ Project submitted! Under review — you'll see it here once approved.
          </div>
        )}

        {/* Submit form */}
        {showForm && (
          <div className="mb-8 bg-white rounded-xl border border-[#c8d8e8] p-6">
            <h2 className="font-bold text-[#0a0f1e] mb-4 text-sm">📝 Submit Your Project</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#64748b] mb-1 block">Project Name *</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    placeholder="My Project" required
                    className="w-full border border-[#c8d8e8] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#4a90d9]" />
                </div>
                <div>
                  <label className="text-xs text-[#64748b] mb-1 block">Your X Handle</label>
                  <input value={form.submitterHandle} onChange={e => setForm({...form, submitterHandle: e.target.value})}
                    placeholder="@yourhandle"
                    className="w-full border border-[#c8d8e8] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#4a90d9]" />
                </div>
              </div>
              <div>
                <label className="text-xs text-[#64748b] mb-1 block">Description *</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  placeholder="What are you building?" required rows={2}
                  className="w-full border border-[#c8d8e8] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#4a90d9] resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#64748b] mb-1 block">URL *</label>
                  <input value={form.url} onChange={e => setForm({...form, url: e.target.value})}
                    placeholder="https://..." required type="url"
                    className="w-full border border-[#c8d8e8] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#4a90d9]" />
                </div>
                <div>
                  <label className="text-xs text-[#64748b] mb-1 block">Twitter/X</label>
                  <input value={form.twitter} onChange={e => setForm({...form, twitter: e.target.value})}
                    placeholder="@project"
                    className="w-full border border-[#c8d8e8] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#4a90d9]" />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button type="submit" disabled={submitting}
                  className="bg-[#4a90d9] text-white px-4 py-2 rounded-lg text-xs hover:bg-[#357abd] transition disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Submit →'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="border border-[#c8d8e8] text-[#64748b] px-4 py-2 rounded-lg text-xs hover:border-[#4a90d9] transition">
                  Cancel
                </button>
              </div>
              <p className="text-xs text-[#64748b]">⚡ Admin will review — you'll receive Telegram notification once approved</p>
            </form>
          </div>
        )}

        {/* Projects list */}
        {loading ? (
          <div className="text-center text-[#64748b] text-sm py-12">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center text-[#64748b] text-sm py-12">
            No projects yet. Be the first to submit!
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.map(p => (
              <div key={p.id} className="bg-white rounded-xl border border-[#c8d8e8] p-5 hover:border-[#4a90d9] transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-[#0a0f1e] text-sm">{p.name}</h3>
                      {p.twitter && (
                        <a href={`https://x.com/${p.twitter}`} target="_blank" className="text-[#4a90d9] text-xs hover:underline">
                          @{p.twitter}
                        </a>
                      )}
                    </div>
                    <p className="text-[#64748b] text-xs mb-3">{p.description}</p>
                    <div className="flex items-center gap-4 text-xs text-[#64748b]">
                      {p.submitterUsername && p.submitterUsername !== 'web' && (
                        <span>👤 @{p.submitterUsername}</span>
                      )}
                      <a href={p.url} target="_blank" className="text-[#4a90d9] hover:underline">🔗 View Project</a>
                      <span>{new Date(p.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center ml-4 border border-[#c8d8e8] rounded-lg px-3 py-2 text-[#64748b] min-w-[48px]">
                    <span className="text-lg">👍</span>
                    <span className="text-xs font-bold">{p.votes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
