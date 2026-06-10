import { useState, useEffect } from "react";

const AGENTS = [
  {
    id: "pure-agent-dev",
    name: "Pure Agent Dev",
    description: "Python-based automation agent — LINE alerts, link monitoring, GitHub Actions deploy.",
    repo: "https://github.com/Zyntro-Media-AI/pure-agent-dev",
    status: "active",
    lastDeploy: "2025-04-26",
  },
  {
    id: "crystalcastle-ai",
    name: "CrystalCastle AI",
    description: "Core workflow governance system — Supabase, Vercel, CI/CD, design system.",
    repo: "https://github.com/Zyntro-Media-AI/crystalcastle-ai",
    status: "building",
    lastDeploy: "2025-04-27",
  },
  {
    id: "claude-code",
    name: "Claude Code",
    description: "Agentic coding layer — Termux-native CLI integration with Claude API.",
    repo: "https://github.com/Zyntro-Media-AI/claude-code",
    status: "idle",
    lastDeploy: "2025-04-25",
  },
];

const STATUS = {
  active:   { label: "Active",   color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  idle:     { label: "Idle",     color: "#94a3b8", bg: "rgba(148,163,184,0.12)" },
  building: { label: "Building", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
};

const STATS = [
  { label: "Total Tasks",   value: 142 },
  { label: "Active Agents", value: 1 },
  { label: "CI Runs (30d)", value: 38 },
  { label: "DB Tables",     value: 12 },
];

const NAV = ["Agents", "Logs", "Settings"];

/**
 * Render a small pill-shaped status badge for an agent.
 *
 * @param {{status: string}} props - Component props.
 * @param {('active'|'idle'|'building'|string)} props.status - Status key used to look up the badge label and styling; commonly one of `"active"`, `"idle"`, or `"building"`.
 * @returns {JSX.Element} A styled inline badge element that displays a colored dot and the human-readable status label.
 */
function StatusBadge({ status }) {
  const c = STATUS[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "3px 10px", borderRadius: 99,
      fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
      color: c.color, background: c.bg, border: `1px solid ${c.color}33`,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%", background: c.color,
        boxShadow: status === "active" ? `0 0 6px ${c.color}` : "none",
        animation: status === "building" ? "pulse 1.4s ease-in-out infinite" : "none",
      }} />
      {c.label}
    </span>
  );
}

/**
 * Render an interactive agent card showing the agent's name, status badge, description, repo link, and optional deployment timestamp, with hover styling and a staggered entrance animation.
 *
 * @param {Object} props
 * @param {Object} props.agent - Agent data; should include `name` (string), `description` (string), `repo` (string URL), `status` (string), and optional `lastDeploy` (string).
 * @param {number} props.delay - Delay in seconds used to stagger the card's entrance animation.
 * @returns {JSX.Element} A React element representing the agent card.
 */
function Card({ agent, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(196,160,80,0.07)" : "rgba(255,255,255,0.025)",
        border: `1px solid ${hovered ? "rgba(196,160,80,0.35)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 14, padding: "22px 24px",
        transition: "all 0.2s ease", position: "relative", overflow: "hidden",
        animation: `fadeUp 0.4s ease ${delay}s both`,
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 24, right: 24, height: 1,
        background: hovered ? "linear-gradient(90deg,transparent,rgba(196,160,80,0.6),transparent)" : "transparent",
        transition: "all 0.3s ease",
      }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#f1ead8", letterSpacing: "-0.01em" }}>
          {agent.name}
        </h3>
        <StatusBadge status={agent.status} />
      </div>
      <p style={{ margin: "0 0 16px", fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>
        {agent.description}
      </p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href={agent.repo} target="_blank" rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "#c4a050", textDecoration: "none", fontWeight: 600 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          View Repo
        </a>
        {agent.lastDeploy && (
          <span style={{ fontSize: 11, color: "#475569" }}>Deployed {agent.lastDeploy}</span>
        )}
      </div>
    </div>
  );
}

/**
 * Render the Agent Hub dashboard page containing the top navigation, hero section,
 * Supabase stats panel, setup checklist, and a responsive grid of agent cards.
 * @returns {JSX.Element} The rendered Agent Hub dashboard component.
 */
export default function AgentHub() {
  const [activeNav, setActiveNav] = useState("Agents");
  const [statsLoaded, setStatsLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStatsLoaded(true), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes shimmer { 0%,100%{opacity:0.35} 50%{opacity:0.6} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0a0c10", fontFamily: "'Inter',system-ui,sans-serif", color: "#e2e8f0" }}>

        {/* Nav */}
        <nav style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "0 28px", height: 54,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "rgba(10,12,16,0.9)", backdropFilter: "blur(12px)",
          position: "sticky", top: 0, zIndex: 50,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: "linear-gradient(135deg,#c4a050,#8b6914)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, color: "#fff",
            }}>⬡</div>
            <span style={{ fontWeight: 700, fontSize: 14, color: "#f1ead8", letterSpacing: "-0.01em" }}>
              Agent Hub
            </span>
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
              color: "#c4a050", background: "rgba(196,160,80,0.12)",
              padding: "2px 7px", borderRadius: 4,
            }}>BETA</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {NAV.map(item => (
              <button key={item} onClick={() => setActiveNav(item)} style={{
                background: activeNav === item ? "rgba(196,160,80,0.12)" : "transparent",
                border: activeNav === item ? "1px solid rgba(196,160,80,0.25)" : "1px solid transparent",
                borderRadius: 8, padding: "5px 12px",
                fontSize: 12, fontWeight: 500,
                color: activeNav === item ? "#c4a050" : "#64748b",
                cursor: "pointer", transition: "all 0.15s",
              }}>{item}</button>
            ))}
          </div>
        </nav>

        <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 28px 64px" }}>

          {/* Hero */}
          <div style={{ animation: "fadeUp 0.45s ease both", marginBottom: 36 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "#c4a050",
              padding: "4px 12px", borderRadius: 99,
              border: "1px solid rgba(196,160,80,0.25)", background: "rgba(196,160,80,0.06)",
              marginBottom: 18,
            }}>
              ZYNTRO MEDIA AI · CRYSTALCASTLE
            </div>
            <h1 style={{
              fontSize: "clamp(26px,4vw,38px)", fontWeight: 800,
              letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 14,
              background: "linear-gradient(135deg,#f1ead8 30%,#c4a050 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              รวม pure-agent-dev<br />+ crystalcastle-ai + claude-code
            </h1>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, maxWidth: 520 }}>
              Unified control plane สำหรับ agent ecosystem — monitor สถานะ, navigate repos,
              และ track metrics ได้จากที่เดียว
            </p>
          </div>

          {/* Supabase stats */}
          <div style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(196,160,80,0.15)",
            borderRadius: 14, padding: "20px 24px", marginBottom: 28,
            animation: "fadeUp 0.45s ease 0.1s both",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3ecf8e" strokeWidth={2.5}>
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
              </svg>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#3ecf8e" }}>
                SUPABASE
              </span>
              <span style={{
                marginLeft: "auto", fontSize: 11,
                color: statsLoaded ? "#22c55e" : "#64748b",
              }}>
                {statsLoaded ? "● Connected" : "Connecting…"}
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
              {STATS.map((s, i) => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  {statsLoaded ? (
                    <>
                      <div style={{ fontSize: 22, fontWeight: 700, color: "#e8d5a0", lineHeight: 1 }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{s.label}</div>
                    </>
                  ) : (
                    <div style={{
                      height: 44, borderRadius: 8,
                      background: "rgba(255,255,255,0.04)",
                      animation: `shimmer 1.2s ease-in-out ${i * 0.1}s infinite`,
                    }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Setup checklist */}
          <div style={{
            background: "rgba(196,160,80,0.04)",
            border: "1px solid rgba(196,160,80,0.13)",
            borderRadius: 14, padding: "18px 24px", marginBottom: 28,
            animation: "fadeUp 0.45s ease 0.15s both",
          }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#c4a050", marginBottom: 12 }}>
              SETUP CHECKLIST
            </p>
            <ol style={{ paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                "วางโค้ด private ลง packages/crystalcastle",
                "ตั้งค่า Supabase (NEXT_PUBLIC_SUPABASE_URL + ANON_KEY)",
                "pnpm dev",
              ].map((s, i) => (
                <li key={i} style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{s}</li>
              ))}
            </ol>
          </div>

          {/* Agent cards */}
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#475569", marginBottom: 14 }}>
            AGENTS · {AGENTS.length}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 14 }}>
            {AGENTS.map((agent, i) => (
              <Card key={agent.id} agent={agent} delay={0.2 + i * 0.08} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}