import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import BASE_URL from "../api/config"

function Register() {
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ username: "", email: "", password: "" })

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { username, email, password } = formData

    if (!username || !email || !password) {
      setSuccess(false); setMessage("All fields are required")
      setTimeout(() => setMessage(""), 3000); return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setSuccess(false); setMessage("Please enter a valid email")
      setTimeout(() => setMessage(""), 3000); return
    }
    if (password.length < 6) {
      setSuccess(false); setMessage("Password must be at least 6 characters")
      setTimeout(() => setMessage(""), 3000); return
    }

    setLoading(true)
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/register`,
        { ...formData, username: username.replace(/[<>]/g, "") }
      )
      setSuccess(true)
      setMessage(res.data.message)
      setFormData({ username: "", email: "", password: "" })
    } catch (error) {
      setSuccess(false)
      setMessage(error.response?.data?.message || "Registration Failed")
      setTimeout(() => setMessage(""), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      {message && !success && (
        <div className="fixed top-5 right-5 px-6 py-4 rounded-xl shadow-2xl font-bold z-50 bg-red-500 text-white animate-fade-up">
          {message}
        </div>
      )}

      <div className="flex w-full max-w-4xl mx-4 glass rounded-2xl overflow-hidden shadow-2xl animate-fade-up"
        style={{ minHeight: "500px" }}>

        {/* LEFT — VISUAL */}
        <div className="hidden md:flex flex-1 items-center justify-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #020d2e, #0a1a4a)" }}>
          <div className="absolute w-72 h-72 rounded-full border border-blue-500 border-opacity-20 animate-spin-slow" />
          <div className="absolute w-56 h-56 rounded-full border border-blue-400 border-opacity-30"
            style={{ animation: "spin-slow 8s linear infinite reverse" }} />
          <div className="absolute w-48 h-48 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(0,120,255,0.2) 0%, transparent 70%)" }} />
          <div className="relative text-center z-10">
            <div className="text-8xl mb-4 animate-shield">🔐</div>
            <p className="text-blue-300 font-bold text-lg">Join the Platform</p>
            <p className="text-blue-400 text-xs mt-1 opacity-70">Create your analyst account</p>
          </div>
        </div>

        {/* RIGHT — FORM */}
        <div className="flex-1 p-10 flex flex-col justify-center">
          {success ? (
            <div className="flex flex-col items-center text-center gap-6 animate-bounce-in">
              <div className="text-7xl">✅</div>
              <h2 className="text-2xl text-white font-bold">Registration Successful!</h2>
              <p className="text-blue-300 text-sm">
                Your account has been created. You can now log in to access CyberSec Nexus.
              </p>
              <Link to="/login"
                className="btn-glow w-full py-3 rounded-xl text-center text-base font-bold block">
                Go to Login →
              </Link>
              <button
                onClick={() => { setSuccess(false); setMessage("") }}
                className="text-blue-400 text-sm hover:text-white transition-colors"
              >
                Register another account
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                <p className="text-blue-300 text-sm">Already have an account?{" "}
                  <Link to="/login" className="text-blue-400 font-bold hover:text-white transition-colors">Sign In</Link>
                </p>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-blue-300 text-xs uppercase tracking-widest">Username</label>
                  <input type="text" name="username" placeholder="Enter Username"
                    value={formData.username} onChange={handleChange}
                    className="p-3 text-sm" disabled={loading} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-blue-300 text-xs uppercase tracking-widest">Email</label>
                  <input type="email" name="email" placeholder="example@email.com"
                    value={formData.email} onChange={handleChange}
                    className="p-3 text-sm" disabled={loading} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-blue-300 text-xs uppercase tracking-widest">Password</label>
                  <input type="password" name="password" placeholder="Min. 6 characters"
                    value={formData.password} onChange={handleChange}
                    className="p-3 text-sm" disabled={loading} />
                </div>
                <button
                  className="btn-glow p-3 mt-2 text-base flex items-center justify-center gap-3 disabled:opacity-70"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Register
