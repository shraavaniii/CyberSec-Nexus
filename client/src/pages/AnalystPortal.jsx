import { useState, useEffect } from "react"

function AnalystPortal() {
  const role = localStorage.getItem("role")
  const [news, setNews] = useState([])

  // Simulated live cyber threat data feeds
  useEffect(() => {
    setNews([
      { id: 1, title: "Critical Zero-Day Vulnerability Found in OpenSSL Systems", severity: "High", date: "May 27, 2026" },
      { id: 2, title: "Active Ransomware Campaign Targeting Cloud Database Environments", severity: "Critical", date: "May 27, 2026" },
      { id: 3, title: "Phishing Wave Exploiting New Multi-Factor Authentication Bypass Techniques", severity: "Medium", date: "May 26, 2026" }
    ])
  }, [])

  return (
    <div className="p-6 text-white min-h-screen bg-slate-950">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-400 flex items-center gap-2">
          🌐 Global Threat Intelligence
        </h1>
        <p className="text-slate-400 text-sm mt-1">Live information stream regarding modern security vulnerabilities and worldwide exploits.</p>
      </div>

      {/* 📰 NEWS GRID FEED */}
      <div className="grid gap-4 mb-8">
        {news.map(item => (
          <div 
            key={item.id} 
            className="p-5 rounded-xl border border-blue-500/10 bg-slate-900/60 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                  item.severity === "Critical" ? "bg-red-500 text-white" : 
                  item.severity === "High" ? "bg-orange-500 text-black" : "bg-yellow-500 text-black"
                }`}>
                  {item.severity}
                </span>
                <span className="text-xs text-slate-500">{item.date}</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-200">{item.title}</h3>
            </div>
            <button className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors border border-blue-400/20 px-3 py-1.5 rounded-lg whitespace-nowrap bg-blue-500/5">
              Read Analysis
            </button>
          </div>
        ))}
      </div>

      {/* 🔐 CONTEXTUAL ADMINISTRATION AREA */}
      {role === "admin" ? (
        <div className="p-6 rounded-xl border border-red-500/20 bg-red-950/10 backdrop-blur-md">
          <h2 className="text-xl font-bold text-red-400 mb-1 flex items-center gap-2">
            🛡️ Administrative Control Matrix
          </h2>
          <p className="text-xs text-slate-400 mb-4">Authorized administrative personnel only. System alterations will change live telemetry tracking parameters.</p>
          
          <div className="flex flex-wrap gap-3">
            <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold transition-all text-sm shadow-md shadow-red-900/20">
              Broadcast Emergency Advisory
            </button>
            <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg font-bold transition-all text-sm border border-slate-700">
              Flush Audit Registries
            </button>
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-xl bg-slate-900/20 border border-slate-900 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
          <span>🔒 Administrative overrides restricted. Log in as an administrator to change global network alert configuration settings.</span>
        </div>
      )}
    </div>
  )
}

export default AnalystPortal
