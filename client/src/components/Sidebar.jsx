import { useState } from "react"
import { Link, useLocation } from "react-router-dom"

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
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
      className="glass-dark min-h-screen flex flex-col transition-all duration-300 ease-in-out"
      style={{
        width: isOpen ? "220px" : "60px",
        borderRight: "1px solid rgba(0,150,255,0.15)",
        flexShrink: 0
      }}
    >
      {/* TOGGLE BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-blue-300 text-xl p-4 hover:text-white transition-colors text-left"
        title={isOpen ? "Close" : "Open"}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* LABEL */}
      {isOpen && (
        <p className="text-blue-400 text-xs uppercase tracking-widest px-4 mb-3 font-bold opacity-70">
          Navigation
        </p>
      )}

      {/* LINKS */}
      <div className="flex flex-col gap-1 px-2">
        {visibleLinks.map((link) => {
          const isActive = location.pathname === link.to
          return (
            <Link
              key={link.to}
              to={link.to}
              title={!isOpen ? link.label : ""}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg
                transition-all duration-200 group
                ${isActive
                  ? "text-white font-bold"
                  : "text-blue-200 hover:text-white"
                }
              `}
              style={isActive ? {
                background: "linear-gradient(135deg, rgba(0,120,255,0.3), rgba(0,200,255,0.15))",
                border: "1px solid rgba(0,150,255,0.4)"
              } : {}}
            >
              <span className="text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                {link.icon}
              </span>
              {isOpen && (
                <span className="text-sm whitespace-nowrap overflow-hidden">
                  {link.label}
                </span>
              )}
              {isOpen && isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
              )}
            </Link>
          )
        })}
      </div>

      {/* BOTTOM STATUS */}
      {isOpen && (
        <div className="mt-auto p-4">
          <div className="glass rounded-lg p-3 text-center">
            <div className="w-2 h-2 rounded-full bg-green-400 mx-auto mb-1 animate-pulse" />
            <p className="text-xs text-blue-300">System Online</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar
