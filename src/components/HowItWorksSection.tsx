const STEPS = [
  {
    num: "01",
    icon: "☀️",
    cmd: "gm",
    title: "Show up daily",
    desc: "Type gm every day in the community. +5 pts/day. Hit 7-day streak → +10 pts/day. Consistency is how you climb.",
  },
  {
    num: "02",
    icon: "⚡",
    cmd: "build & engage",
    title: "Stack your points",
    desc: "Win trivia (+25), refer builders (+50), submit projects (+20), get voted (+2 each), top weekly leaderboard (+100).",
  },
  {
    num: "03",
    icon: "🔵",
    cmd: "/rewards",
    title: "Claim $BLUEAGENT onchain",
    desc: "1 pt = 1,000 $BLUEAGENT. Minimum 100 pts. Claim directly to your Base wallet. 5% burned automatically 🔥",
  },
];

const EARN_ROWS = [
  { action: "Daily check-in (gm)",     pts: "+5 pts",   note: "+10/day at 7-day streak" },
  { action: "Refer a builder",          pts: "+50 pts",  note: "They get +10 pts too" },
  { action: "Submit a project",         pts: "+20 pts",  note: "After admin approval" },
  { action: "Get voted on project",     pts: "+2 pts",   note: "Per vote received" },
  { action: "Win trivia",               pts: "+25 pts",  note: "Daily in community" },
  { action: "Top 3 weekly leaderboard", pts: "+100 pts", note: "Every Monday 🏆" },
];

export default function HowItWorksSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 mb-24">
      <div className="text-center mb-14">
        <div className="badge mb-5">Earn $BLUEAGENT</div>
        <h2
          className="text-4xl font-black mb-4 leading-snug"
          style={{ color: "var(--text)" }}
        >
          Show up. Build. Earn.
        </h2>
        <p className="max-w-xl mx-auto" style={{ color: "var(--text-muted)" }}>
          Blue Agent rewards builders for showing up. Every day, every action — points that turn into real $BLUEAGENT onchain.
        </p>
      </div>

      {/* 3 steps */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {STEPS.map((step) => (
          <div key={step.num} className="card p-7 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                style={{
                  background: "rgba(74,144,217,0.1)",
                  border: "1px solid rgba(74,144,217,0.3)",
                  color: "#4a90d9",
                }}
              >
                {step.num}
              </div>
              <div className="text-2xl">{step.icon}</div>
            </div>
            <div
              className="text-xs font-mono px-2 py-1.5 rounded-lg self-start"
              style={{
                background: "rgba(74,144,217,0.07)",
                border: "1px solid rgba(74,144,217,0.2)",
                color: "#4a90d9",
              }}
            >
              {step.cmd}
            </div>
            <h3 className="font-bold text-base" style={{ color: "var(--text)" }}>
              {step.title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Earn table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--border)", background: "rgba(74,144,217,0.04)" }}>
          <div className="font-bold text-base" style={{ color: "var(--text)" }}>How to earn points</div>
          <div className="text-sm" style={{ color: "var(--text-muted)" }}>1 pt = 1,000 $BLUEAGENT · Min claim: 100 pts · Cooldown: 7 days</div>
        </div>
        {EARN_ROWS.map(({ action, pts, note }, i) => (
          <div
            key={action}
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: i < EARN_ROWS.length - 1 ? "1px solid #e2e8f0" : "none" }}
          >
            <div>
              <div className="text-sm font-medium" style={{ color: "var(--text)" }}>{action}</div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>{note}</div>
            </div>
            <div
              className="text-sm font-bold"
              style={{ color: "#4a90d9" }}
            >
              {pts}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
