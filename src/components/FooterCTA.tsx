export default function FooterCTA() {
  return (
    <section className="max-w-5xl mx-auto px-6 mb-20">
      <div
        className="glow"
        style={{
          background: "var(--surface)",
          border: "1.5px solid rgba(74,144,217,0.25)",
          borderRadius: 20,
          padding: "64px 48px",
          textAlign: "center",
        }}
      >
        <h2
          className="text-4xl font-black mb-4"
          style={{ color: "var(--text)" }}
        >
          Start building on Base
        </h2>
        <p className="mb-3 text-lg" style={{ color: "var(--text-muted)" }}>
          Blue Agent is free. Open a chat and start building.
        </p>
        <p className="text-sm mb-10" style={{ color: "var(--text-muted)" }}>
          No signup. No wallet required. Works in Telegram right now.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="https://t.me/blockyagent_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-blue"
            style={{ fontSize: 16, padding: "16px 36px" }}
          >
            💬 Open Blue Agent Bot
          </a>
          <a
            href="https://t.me/blueagent_hub"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
            style={{ fontSize: 16, padding: "16px 36px" }}
          >
            Join Community →
          </a>
        </div>
      </div>
    </section>
  );
}
