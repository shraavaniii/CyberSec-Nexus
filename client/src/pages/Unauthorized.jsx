import { useNavigate } from "react-router-dom"

function Unauthorized() {
  const navigate = useNavigate()
  const role = localStorage.getItem("role")
  const username = localStorage.getItem("username")

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">

      {/* ICON */}
      <div className="text-8xl mb-6 animate-bounce-in">🚫</div>

      {/* CARD */}
      <div className="glass rounded-2xl p-10 max-w-md w-full animate-fade-up"
        style={{ border: "1px solid rgba(255,50,50,0.3)" }}>

        <h1 className="text-4xl font-bold text-red-400 mb-3">
          Access Denied
        </h1>

        <p className="text-blue-200 text-base mb-2">
          Sorry, <span className="text-white font-bold">{username}</span>.
        </p>

        <p className="text-blue-300 text-sm mb-6 opacity-80">
          You don't have permission to access this page.
          This area is restricted to <span className="text-yellow-400 font-bold">Admins only</span>.
        </p>

        {/* ROLE BADGE */}
        <div className="glass rounded-lg px-4 py-2 inline-block mb-8"
          style={{ border: "1px solid rgba(255,150,0,0.3)" }}>
          <p className="text-xs text-yellow-400 uppercase tracking-widest">
            Your Role: <span className="font-bold">{role || "user"}</span>
          </p>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="btn-glow py-3 rounded-xl font-bold text-base"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate("/")}
            className="py-3 rounded-xl font-bold text-base text-blue-300 hover:text-white transition-colors"
            style={{ border: "1px solid rgba(0,150,255,0.3)", background: "rgba(0,100,255,0.1)" }}
          >
            Go to Home
          </button>
        </div>
      </div>

      {/* BOTTOM TEXT */}
      <p className="text-blue-500 text-xs mt-6 opacity-50">
        If you believe this is a mistake, contact your system administrator.
      </p>
    </div>
  )
}

export default Unauthorized
