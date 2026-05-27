import { Link, useLocation } from "react-router-dom"

function Sidebar({ onClose }) {
  const location = useLocation()
  const role = localStorage.getItem("role")
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

  const links = [
    { to: "/", label: "Home", icon: "🏠" },
    { to: "/register", label: "Register", icon: "📝" },
    { to: "/login", label: "Login", icon: "🔐" },
    { to: "/dashboard", label: "Dashboard", icon: "📊", protected: true },
    { to: "/threatlens", label: "Threat Analysis", icon: "🔍", protected: true },
    { to: "/logsentry", label: "Log Monitoring", icon: "📋", protected: true },
    { to: "/secure-reports", label: "Secure Reports", icon: "📁", protected: true },
    { to: "/analyst-portal", label: "Analyst Portal", icon: "🖥️", adminOnly: true },
  ]

  const visibleLinks = links.filter(link => {
    if (link.adminOnly) return isLoggedIn && role === "admin"
    return true
  })

  return (
    <div
      className="glass-dark flex flex-col"
      style={{
        width: "240px",
        minHeight: "calc(100vh - 65px)",
        borderRight: "1px solid rgba(0,150,255,0.15)",
        borderBottom: "1px solid rgba(0,150,255,0.15)",
        borderRadius: "0 0 16px 0"
      }}
    >
      {/* HEADER */}
      <div className="px-4 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(0,150,255,0.1)" }}>
        <p className="text-blue-400 text-xs uppercase tracking-widest font-bold opacity-70">
          Navigation
        </p>
        <button
          onClick={onClose}
          className="text-blue-400 hover:text-white transition-colors text-lg leading-none"
        >
          ✕
        </button>
      </div>

      {/* LINKS */}
      <div className="flex flex-col gap-1 p-3 flex-1">
        {visibleLinks.map((link) => {
          const isActive = location.pathname === link.to
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl
                transition-all duration-200 group
                ${isActive ? "text-white font-bold" : "text-blue-200 hover:text-white"}
              `}
              style={isActive ? {
                background: "linear-gradient(135deg, rgba(0,120,255,0.3), rgba(0,200,255,0.15))",
                border: "1px solid rgba(0,150,255,0.4)"
              } : {}}
            >
              <span className="text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                {link.icon}
              </span>
              <span className="text-sm">{link.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
              )}
            </Link>
          )
        })}
      </div>

      {/* BOTTOM STATUS */}
      <div className="p-4" style={{ borderTop: "1px solid rgba(0,150,255,0.1)" }}>
        <div className="glass rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <p className="text-xs text-blue-300 font-bold">System Online</p>
          </div>
          <p className="text-xs text-blue-400 opacity-50">CyberSec Nexus v1.0</p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
