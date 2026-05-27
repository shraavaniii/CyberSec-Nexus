import { useNavigate } from "react-router-dom"

function Navbar({ onToggleSidebar, sidebarOpen }) {
  const navigate = useNavigate()
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
  const username = localStorage.getItem("username")
  const role = localStorage.getItem("role")

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  return (
    <div
      className="glass-dark text-white p-4 flex items-center justify-between sticky top-0 z-50"
      style={{ borderBottom: "1px solid rgba(0,150,255,0.2)", height: "65px" }}
    >
      {/* LEFT — HAMBURGER + BRAND */}
      <div className="flex items-center gap-4">
        {/* HAMBURGER BUTTON */}
        <button
          onClick={onToggleSidebar}
          className="flex flex-col gap-1.5 p-2 rounded-lg hover:bg-blue-900 hover:bg-opacity-40 transition-all duration-200 group"
          title={sidebarOpen ? "Close Menu" : "Open Menu"}
        >
          <span className={`block w-5 h-0.5 bg-blue-300 transition-all duration-300 group-hover:bg-white ${sidebarOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-blue-300 transition-all duration-300 group-hover:bg-white ${sidebarOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-blue-300 transition-all duration-300 group-hover:bg-white ${sidebarOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>

        {/* BRAND */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <span className="text-2xl animate-shield">🛡️</span>
          <div>
            <p className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors leading-tight">
              CyberSec Nexus
            </p>
            <p className="text-xs text-blue-400 opacity-60 leading-tight hidden md:block">
              Threat Intelligence Platform
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT — USER AREA */}
      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <>
            {role === "admin" && (
              <span className="text-xs glass px-3 py-1 rounded-full font-bold text-blue-300 hidden md:block"
                style={{ border: "1px solid rgba(0,150,255,0.3)" }}>
                🔑 ADMIN
              </span>
            )}
            <div className="flex items-center gap-2 glass px-3 py-2 rounded-full"
              style={{ border: "1px solid rgba(0,150,255,0.2)" }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs"
                style={{ background: "linear-gradient(135deg, #0078ff, #00c8ff)" }}>
                {username ? username.charAt(0).toUpperCase() : "U"}
              </div>
              <span className="text-blue-200 font-semibold text-sm hidden md:block">{username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 bg-opacity-80 text-white px-4 py-2 rounded-full font-bold hover:bg-red-500 text-sm transition-all duration-200 hover:scale-105"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 glass px-3 py-2 rounded-full"
              style={{ border: "1px solid rgba(100,100,100,0.2)" }}>
              <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-xs font-bold">?</div>
              <span className="text-gray-400 text-sm hidden md:block">Guest</span>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="border border-blue-500 text-blue-300 px-4 py-2 rounded-full font-bold hover:bg-blue-500 hover:text-white text-sm transition-all duration-200 hover:scale-105"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="btn-glow px-4 py-2 rounded-full text-sm"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default Navbar
