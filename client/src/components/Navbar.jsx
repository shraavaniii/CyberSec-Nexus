import { useNavigate } from "react-router-dom"

function Navbar() {
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
      style={{ borderBottom: "1px solid rgba(0,150,255,0.2)" }}
    >
      {/* BRAND */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <span className="text-3xl animate-shield">🛡️</span>
        <div>
          <span className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
            CyberSec Nexus
          </span>
          <p className="text-xs text-blue-400 opacity-70">
            Threat Intelligence & Security Operations
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <>
            {role === "admin" && (
              <span className="text-xs bg-blue-900 bg-opacity-60 border border-blue-500 text-blue-300 px-3 py-1 rounded-full font-bold">
                🔑 ADMIN
              </span>
            )}
            <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ background: "linear-gradient(135deg, #0078ff, #00c8ff)" }}>
                {username ? username.charAt(0).toUpperCase() : "U"}
              </div>
              <span className="text-blue-200 font-semibold text-sm">{username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 bg-opacity-80 text-white px-5 py-2 rounded-full font-bold hover:bg-red-500 text-sm transition-all duration-200 hover:scale-105"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-sm font-bold">
                ?
              </div>
              <span className="text-gray-400 text-sm">Guest</span>
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
