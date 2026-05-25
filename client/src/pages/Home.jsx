import { useNavigate } from "react-router-dom"

function Home() {
  const navigate = useNavigate()
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
  const username = localStorage.getItem("username")

  const modules = [
    { icon: "🔍", title: "ThreatLens", desc: "Analyze URLs, IPs, and emails for phishing and malware threats.", path: "/threatlens", color: "rgba(255,150,0,0.15)", border: "rgba(255,150,0,0.4)" },
    { icon: "📋", title: "LogSentry", desc: "Monitor server logs for brute force and distributed attacks.", path: "/logsentry", color: "rgba(0,150,255,0.15)", border: "rgba(0,150,255,0.4)" },
    { icon: "📁", title: "SecureVault", desc: "Securely upload and store investigation reports and files.", path: "/secure-reports", color: "rgba(150,0,255,0.15)", border: "rgba(150,0,255,0.4)" },
    { icon: "🖥️", title: "Analyst Portal", desc: "Command center — timeline, reports overview, live threat intel.", path: "/analyst-portal", color: "rgba(0,255,150,0.1)", border: "rgba(0,255,150,0.3)" },
  ]

  return (
    <div className="min-h-screen flex flex-col">

      {/* HERO */}
      <div className="flex flex-col items-center justify-center text-center py-24 px-6 relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #0078ff 0%, transparent 70%)" }} />
        </div>
        <div className="text-7xl mb-6 animate-shield relative z-10">🛡️</div>
        <h1 className="text-6xl font-bold text-white mb-3 relative z-10">
          CyberSec <span style={{ color: "#00c8ff" }}>Nexus</span>
        </h1>
        <p className="text-blue-300 text-lg mb-2 relative z-10">
          Threat Intelligence & Security Operations Dashboard
        </p>
        <p className="text-blue-400 text-sm max-w-xl mb-10 opacity-70 relative z-10">
          Detect threats, monitor logs, store reports securely, and stay updated with live cyber intelligence.
        </p>

        {isLoggedIn ? (
          <div className="flex flex-col items-center gap-4 relative z-10">
            <p className="text-blue-200 text-lg">Welcome back, <span className="text-white font-bold">{username}</span>! 👋</p>
            <button onClick={() => navigate("/dashboard")} className="btn-glow px-10 py-3 rounded-xl text-base">
              Go to Dashboard →
            </button>
          </div>
        ) : (
          <div className="flex gap-4 relative z-10">
            <button onClick={() => navigate("/register")} className="btn-glow px-8 py-3 rounded-xl text-base">
              Get Started
            </button>
            <button onClick={() => navigate("/login")}
              className="px-8 py-3 rounded-xl font-bold text-base text-blue-300 transition-all hover:text-white hover:scale-105"
              style={{ border: "1px solid rgba(0,150,255,0.4)", background: "rgba(0,100,255,0.1)" }}>
              Sign In
            </button>
          </div>
        )}
      </div>

      {/* MODULES */}
      <div className="px-6 pb-16">
        <h2 className="text-2xl text-blue-300 font-bold text-center mb-10 uppercase tracking-widest opacity-80">
          Platform Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {modules.map((mod, i) => (
            <div key={i} onClick={() => navigate(mod.path)}
              className="p-6 rounded-2xl cursor-pointer card-hover group"
              style={{ background: mod.color, border: `1px solid ${mod.border}`, backdropFilter: "blur(10px)" }}>
              <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">{mod.icon}</div>
              <h3 className="text-white text-lg font-bold mb-2 group-hover:text-blue-200 transition-colors">{mod.title}</h3>
              <p className="text-blue-300 text-sm opacity-80">{mod.desc}</p>
              <div className="mt-4 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity text-blue-300">
                Open Module →
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="py-10 px-6" style={{ borderTop: "1px solid rgba(0,150,255,0.1)" }}>
        <div className="grid grid-cols-3 max-w-2xl mx-auto text-center gap-6">
          {[["4", "Security Modules"], ["24/7", "Threat Monitoring"], ["100%", "Secure Storage"]].map(([val, label], i) => (
            <div key={i}>
              <p className="text-4xl font-bold" style={{ color: "#00c8ff" }}>{val}</p>
              <p className="text-blue-400 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="text-center text-blue-500 text-xs pb-6 opacity-50">
        CyberSec Nexus © 2025 — Threat Intelligence & Security Operations Dashboard
      </div>
    </div>
  )
}

export default Home
