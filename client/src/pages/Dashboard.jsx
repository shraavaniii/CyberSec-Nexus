import { useState, useEffect } from "react"
import axios from "axios"

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const username = localStorage.getItem("username")
  const role = localStorage.getItem("role")

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/dashboard/stats`)
      .then((res) => {
        setStats(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }, [])

  const cards = stats ? [
    { label: "Total Users", value: stats.totalUsers, icon: "👥", color: "rgba(0,150,255,0.15)", border: "rgba(0,150,255,0.3)" },
    { label: "Uploaded Reports", value: stats.totalReports, icon: "📁", color: "rgba(150,0,255,0.15)", border: "rgba(150,0,255,0.3)" },
    { label: "Threat Scans", value: stats.threatScans, icon: "🔍", color: "rgba(255,150,0,0.15)", border: "rgba(255,150,0,0.3)" },
    { label: "Log Checks", value: stats.logChecks, icon: "📋", color: "rgba(0,255,150,0.1)", border: "rgba(0,255,150,0.25)" },
  ] : []

  return (
    <div className="p-2">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-2">
          Security Dashboard
        </h1>
        <p className="text-blue-300 text-sm opacity-70">
          Welcome back, <span className="text-white font-bold">{username}</span> —{" "}
          <span className="text-yellow-400 font-bold uppercase text-xs">
            {role === "admin" ? "🔑 Admin" : "👤 User"}
          </span>
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {loading ? (
          // SKELETON LOADERS
          [...Array(4)].map((_, i) => (
            <div key={i} className="glass rounded-2xl p-6 animate-pulse"
              style={{ border: "1px solid rgba(0,150,255,0.15)" }}>
              <div className="h-4 bg-blue-900 rounded mb-4 w-2/3" />
              <div className="h-10 bg-blue-900 rounded w-1/2" />
            </div>
          ))
        ) : (
          cards.map((card, i) => (
            <div key={i} className="rounded-2xl p-6 card-hover"
              style={{ background: card.color, border: `1px solid ${card.border}` }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-blue-200 text-sm font-semibold">{card.label}</h2>
                <span className="text-2xl">{card.icon}</span>
              </div>
              <p className="text-5xl font-bold text-white">{card.value}</p>
            </div>
          ))
        )}
      </div>

      {/* QUICK ACCESS */}
      <div className="glass rounded-2xl p-6 mb-6"
        style={{ border: "1px solid rgba(0,150,255,0.15)" }}>
        <h2 className="text-blue-300 text-lg font-bold mb-4 uppercase tracking-widest text-sm opacity-70">
          Quick Access
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Run Threat Scan", icon: "🔍", path: "/threatlens", color: "rgba(255,150,0,0.1)", border: "rgba(255,150,0,0.3)" },
            { label: "Analyze Logs", icon: "📋", path: "/logsentry", color: "rgba(0,150,255,0.1)", border: "rgba(0,150,255,0.3)" },
            { label: "Upload Report", icon: "📁", path: "/secure-reports", color: "rgba(150,0,255,0.1)", border: "rgba(150,0,255,0.3)" },
          ].map((item, i) => (
            <a key={i} href={item.path}
              className="flex items-center gap-3 p-4 rounded-xl transition-all hover:-translate-y-1 cursor-pointer"
              style={{ background: item.color, border: `1px solid ${item.border}` }}>
              <span className="text-2xl">{item.icon}</span>
              <span className="text-white font-semibold text-sm">{item.label}</span>
              <span className="ml-auto text-blue-400">→</span>
            </a>
          ))}
        </div>
      </div>

      {/* SYSTEM STATUS */}
      <div className="glass rounded-2xl p-6"
        style={{ border: "1px solid rgba(0,150,255,0.15)" }}>
        <h2 className="text-blue-300 text-sm font-bold mb-4 uppercase tracking-widest opacity-70">
          System Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Threat Engine", status: "Online" },
            { label: "Log Monitor", status: "Online" },
            { label: "Secure Storage", status: "Online" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-blue-200 text-sm">{item.label}</span>
              <span className="ml-auto text-green-400 text-xs font-bold">{item.status}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Dashboard
