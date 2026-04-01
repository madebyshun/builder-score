type Product = {
  icon: string
  title: string
  desc: string
  price: string
  href: string
  live?: boolean
}

const PRODUCTS: Product[] = [
  {
    icon: "🤖",
    title: "Community Kit",
    desc: "Bot automation for any Base token project. Deploy in 5 minutes, no code.",
    price: "$49–$499/mo",
    href: "https://t.me/blueagent_hub",
  },
  {
    icon: "📊",
    title: "Builder Score API",
    desc: "Reputation API for Base builders. Score any X handle on-demand via x402 — AI agents pay automatically.",
    price: "$0.01/call",
    href: "https://github.com/madebyshun/builder-score-api",
    live: true,
  },
  {
    icon: "🎨",
    title: "Creative Hub",
    desc: "Specialized AI agents for Web3 builders. Copywriter, UX, tokenomics & more.",
    price: "Coming soon",
    href: "https://t.me/blueagent_hub",
  },
];

export default function ComingSoonSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 mb-24">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="badge mb-4">What we&apos;re building</div>
        <h2 className="text-3xl font-bold" style={{ color: "var(--text)" }}>
          More products coming
        </h2>
        <p className="mt-3 text-base" style={{ color: "var(--text-muted)" }}>
          Blue Agent is just the start. Join the waitlist to get early access.
        </p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-5">
        {PRODUCTS.map(({ icon, title, desc, price, href, live }) => (
          <div key={title} className="card p-7 flex flex-col gap-4">
            {/* Icon + badge */}
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 32 }}>{icon}</span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: live ? "#22c55e" : "#4a90d9",
                  background: live ? "rgba(34,197,94,0.08)" : "rgba(74,144,217,0.08)",
                  border: `1px solid ${live ? "rgba(34,197,94,0.2)" : "rgba(74,144,217,0.2)"}`,
                  borderRadius: 999,
                  padding: "3px 10px",
                }}
              >
                {live ? "Live 🟢" : "Soon"}
              </span>
            </div>

            {/* Title */}
            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>
              {title}
            </div>

            {/* Desc */}
            <div style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.6, flex: 1 }}>
              {desc}
            </div>

            {/* Price + CTA */}
            <div className="flex items-center justify-between mt-2">
              <span style={{ fontSize: 14, fontWeight: 600, color: "#4a90d9" }}>
                {price}
              </span>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#4a90d9",
                  textDecoration: "none",
                  border: "1px solid rgba(74,144,217,0.3)",
                  borderRadius: 8,
                  padding: "10px 16px",
                  minHeight: 40,
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                {live ? "Try it →" : "Join waitlist →"}
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
