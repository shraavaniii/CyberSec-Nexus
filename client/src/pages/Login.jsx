import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import BASE_URL from "../api/config"

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(true)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, formData)
      setSuccess(true)
      setMessage(res.data.message)
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("username", res.data.username)
      localStorage.setItem("email", res.data.email)
      localStorage.setItem("role", res.data.role)
      setTimeout(() => navigate("/dashboard"), 1000)
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setSuccess(false)
      setMessage(error.response?.data?.message || "Login Failed")
      setTimeout(() => setMessage(""), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      {message && (
        <div className={`fixed top-5 right-5 px-6 py-4 rounded-xl shadow-2xl font-bold z-50 animate-fade-up ${
          success ? "bg-green-500 text-black" : "bg-red-500 text-white"
        }`}>
          {message}
        </div>
      )}

      <div className="flex w-full max-w-4xl mx-4 glass rounded-2xl overflow-hidden shadow-2xl animate-fade-up"
        style={{ minHeight: "500px" }}>

        {/* LEFT — FORM */}
        <div className="flex-1 p-10 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Sign In</h1>
            <p className="text-blue-300 text-sm">Don't have an account?{" "}
              <Link to="/register" className="text-blue-400 font-bold hover:text-white transition-colors">Create one</Link>
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-blue-300 text-xs uppercase tracking-widest">Email</label>
              <input type="email" name="email" placeholder="example@email.com"
                onChange={handleChange} className="p-3 text-sm" disabled={loading} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-blue-300 text-xs uppercase tracking-widest">Password</label>
              <input type="password" name="password" placeholder="••••••••"
                onChange={handleChange} className="p-3 text-sm" disabled={loading} />
            </div>
            <button
              className="btn-glow p-3 mt-2 text-base flex items-center justify-center gap-3 disabled:opacity-70"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        {/* RIGHT — VISUAL */}
        <div className="hidden md:flex flex-1 items-center justify-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #020d2e, #0a1a4a)" }}>
          <div className="absolute w-72 h-72 rounded-full border border-blue-500 border-opacity-20 animate-spin-slow" />
          <div className="absolute w-56 h-56 rounded-full border border-blue-400 border-opacity-30"
            style={{ animation: "spin-slow 8s linear infinite reverse" }} />
          <div className="absolute w-48 h-48 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(0,120,255,0.2) 0%, transparent 70%)" }} />
          <div className="relative text-center z-10">
            <div className="text-8xl mb-4 animate-shield">🛡️</div>
            <p className="text-blue-300 font-bold text-lg">CyberSec Nexus</p>
            <p className="text-blue-400 text-xs mt-1 opacity-70">Threat Intelligence Platform</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
