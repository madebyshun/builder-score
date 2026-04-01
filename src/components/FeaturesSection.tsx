const FEATURES = [
  {
    icon: "🤖",
    title: "AI Chat",
    desc: "Ask anything about the Base ecosystem. Protocols, grants, builders, alpha — all in natural language.",
  },
  {
    icon: "📊",
    title: "Builder Score",
    desc: "Score any builder 0–100 across 4 dimensions: consistency, technical, builder focus & community.",
  },
  {
    icon: "💱",
    title: "Trade & Wallet",
    desc: "Swap, DCA, bridge — all via natural language. Your wallet, created instantly on start.",
  },
  {
    icon: "⭐",
    title: "Earn $BLUEAGENT",
    desc: "Show up daily, earn points, claim onchain. Every action builds your balance.",
  },

  {
    icon: "🚀",
    title: "Launch Token",
    desc: "Deploy an ERC20 on Base in seconds — no code, no complexity, no excuses.",
  },
  {
    icon: "🔁",
    title: "Community Auto-Pilot",
    desc: "Runs 24/7 in your group. GM tracking, trivia, trade alerts, leaderboard — all automatic.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 mb-24">
      <h2
        className="text-3xl font-bold text-center mb-3"
        style={{ color: "var(--text)" }}
      >
        Everything in one bot
      </h2>
      <p className="text-center mb-12" style={{ color: "var(--text-muted)" }}>
        One Telegram chat. Every tool you need to build and earn on Base.
      </p>

      <div className="grid md:grid-cols-3 gap-5">
        {FEATURES.map((f) => (
          <div key={f.title} className="card p-7">
            <div className="text-3xl mb-4">{f.icon}</div>
            <h3
              className="font-semibold text-base mb-2"
              style={{ color: "var(--text)" }}
            >
              {f.title}
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
