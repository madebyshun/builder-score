"use client";

import { useEffect, useState } from "react";

const TOKEN = "0xf895783b2931c919955e18b5e3343e7c7c456ba3";

// Multi-scene chat demos — cycles through all scenes
const CHAT_SCENES = [
  // Scene 1: gm + score
  [
    { from: "user", text: "gm 🟦" },
    { from: "agent", text: "gm! What are you building? 👾" },
    { from: "user", text: "/score @jessepollak" },
    { from: "agent", text: "📊 Builder Score: 98/100\n🔨 Technical: 97\n🌐 Network: 99\n⭐ Community: 98" },
  ],
  // Scene 2: launch token
  [
    { from: "user", text: "/launch" },
    { from: "agent", text: "🚀 Token Launch Wizard\n\nEnter your token name:" },
    { from: "user", text: "Blue Agent" },
    { from: "agent", text: "✅ Deployed on Base!\nCA: 0xf895...456b\nGas free via Bankr 🟦" },
  ],
  // Scene 3: trade + earn
  [
    { from: "user", text: "swap 10 USDC to ETH" },
    { from: "agent", text: "✅ Swapped!\n10 USDC → 0.0034 ETH\non Base via Uniswap v4" },
    { from: "user", text: "/rewards" },
    { from: "agent", text: "⭐ 250 pts available\n= 250,000 $BLUEAGENT\n\nClaim to your wallet?" },
  ],
];

function fmtPrice(p: number): string {
  if (!p) return "…";
  if (p < 0.000001) return "$" + p.toExponential(2);
  if (p < 0.0001) return "$" + p.toFixed(8);
  if (p < 0.01) return "$" + p.toFixed(6);
  return "$" + p.toFixed(4);
}

function fmtNum(n: number): string {
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return "$" + (n / 1e3).toFixed(1) + "K";
  return "$" + n.toFixed(2);
}

export default function HeroSection() {
  const [priceStr, setPriceStr] = useState("…");
  const [change24h, setChange24h] = useState(0);
  const [mcap, setMcap] = useState("");

  // Chat animation state
  const [sceneIdx, setSceneIdx] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(
          `https://api.geckoterminal.com/api/v2/networks/base/tokens/${TOKEN}`
        );
        const data = await res.json();
        const attr = data?.data?.attributes;
        if (!attr) return;
        const p = parseFloat(attr.price_usd || "0");
        const c = parseFloat(attr.price_change_percentage?.h24 || "0");
        const m = parseFloat(attr.market_cap_usd || attr.fdv_usd || "0");
        setPriceStr(fmtPrice(p));
        setChange24h(c);
        if (m) setMcap(fmtNum(m));
      } catch {}
    };
    fetch_();
    const iv = setInterval(fetch_, 30000);
    return () => clearInterval(iv);
  }, []);

  // Chat animation: messages appear one by one, then cycle to next scene
  useEffect(() => {
    const scene = CHAT_SCENES[sceneIdx];
    if (visibleCount < scene.length) {
      const t = setTimeout(() => setVisibleCount(v => v + 1), visibleCount === 0 ? 600 : 1000);
      return () => clearTimeout(t);
    } else {
      // All messages shown — wait 2.5s then next scene
      const t = setTimeout(() => {
        setSceneIdx(s => (s + 1) % CHAT_SCENES.length);
        setVisibleCount(0);
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [sceneIdx, visibleCount]);

  const isUp = change24h >= 0;

  return (
    <section className="max-w-5xl mx-auto px-6 pt-20 pb-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* ── Left: text ── */}
        <div>
          <div className="badge mb-7">Built on Base · Powered by Bankr AI</div>

          <h1
            className="text-5xl md:text-5xl font-black mb-5 leading-[1.15]"
            style={{ color: "var(--text)" }}
          >
            Your AI sidekick for{" "}
            <span style={{ color: "#4a90d9" }}>Base</span> 🟦
          </h1>

          <p className="text-lg mb-3 leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Score builders, trade tokens, earn $BLUEAGENT, launch on Base — all
            through natural language on Telegram.
          </p>

          {/* Live price strip */}
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="price-pill">
              🔵 $BLUEAGENT
            </span>
            {change24h !== 0 && (
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  background: isUp
                    ? "rgba(34,197,94,0.1)"
                    : "rgba(239,68,68,0.1)",
                  color: isUp ? "#16a34a" : "#dc2626",
                }}
              >
                {isUp ? "▲" : "▼"} {Math.abs(change24h).toFixed(2)}% 24h
              </span>
            )}
          </div>

          <p
            className="text-xs mb-10 font-mono break-all"
            style={{ color: "var(--text-muted)" }}
          >
            CA: {TOKEN}
          </p>

          <div className="flex gap-3 flex-wrap">
            <a
              href="https://t.me/blockyagent_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-blue"
            >
              💬 Open Bot
            </a>
            <a
              href="https://t.me/blueagent_hub"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Join Community →
            </a>
          </div>
        </div>

        {/* ── Right: Phone mockup ── */}
        <div className="flex justify-center">
          <div
            style={{
              width: 270,
              background: "var(--surface)",
              borderRadius: 40,
              padding: 12,
              boxShadow:
                "0 30px 80px rgba(74,144,217,0.18), 0 10px 40px rgba(0,0,0,0.10)",
              border: "1.5px solid var(--phone-border)",
            }}
          >
            {/* Screen */}
            <div
              style={{
                background: "var(--surface-2)",
                borderRadius: 30,
                overflow: "hidden",
              }}
            >
              {/* Status bar */}
              <div
                style={{
                  background: "var(--surface-2)",
                  padding: "10px 16px 6px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 11,
                  color: "var(--text-muted)",
                }}
              >
                <span>9:41</span>
                <div
                  style={{
                    width: 80,
                    height: 20,
                    background: "#e2e8f0",
                    borderRadius: 12,
                  }}
                />
                <span>●●●</span>
              </div>

              {/* Chat header */}
              <div
                style={{
                  background: "#4a90d9",
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  borderBottom: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      background: "var(--surface)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                    }}
                  >
                    🔵
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 9,
                      height: 9,
                      background: "#22c55e",
                      borderRadius: "50%",
                      border: "2px solid #4a90d9",
                    }}
                  />
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 13,
                      color: "#ffffff",
                    }}
                  >
                    Blue Agent
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.8)",
                    }}
                  >
                    online
                  </div>
                </div>
              </div>

              {/* Chat messages — animated */}
              <div
                style={{
                  padding: "14px 12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  minHeight: 340,
                  background: "var(--surface-2)",
                  overflow: "hidden",
                }}
              >
                {CHAT_SCENES[sceneIdx].slice(0, visibleCount).map((msg, i) => {
                  const isUser = msg.from === "user";
                  return (
                    <div
                      key={`${sceneIdx}-${i}`}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: isUser ? "flex-end" : "flex-start",
                        animation: "fadeSlideUp 0.3s ease forwards",
                      }}
                    >
                      {!isUser && (
                        <div style={{ fontSize: 10, color: "#4a90d9", marginBottom: 3, fontWeight: 600 }}>
                          Blue Agent
                        </div>
                      )}
                      <div
                        style={{
                          background: isUser ? "#4a90d9" : "var(--chat-bubble-agent)",
                          color: isUser ? "#fff" : "var(--chat-bubble-agent-text)",
                          border: isUser ? "none" : "1px solid var(--chat-bubble-border)",
                          borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                          padding: "8px 12px",
                          fontSize: 12,
                          maxWidth: "85%",
                          lineHeight: 1.6,
                          whiteSpace: "pre-line",
                        }}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input bar */}
              <div
                style={{
                  background: "var(--surface)",
                  padding: "10px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  borderTop: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 20,
                    padding: "8px 14px",
                    fontSize: 12,
                    color: "var(--text-muted)",
                  }}
                >
                  Message Blue Agent...
                </div>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    background: "#4a90d9",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    color: "#fff",
                  }}
                >
                  ↑
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
