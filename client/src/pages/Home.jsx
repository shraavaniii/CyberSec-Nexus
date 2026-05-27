import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

// MATRIX RAIN CANVAS
function MatrixRain() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&"
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops = Array(columns).fill(1)

    const draw = () => {
      // DARK BLUE FADE EFFECT
      ctx.fillStyle = "rgba(2, 8, 24, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize

        // BRIGHT HEAD CHARACTER
        if (Math.random() > 0.95) {
          ctx.fillStyle = "#ffffff"
          ctx.shadowColor = "#00c8ff"
          ctx.shadowBlur = 10
        } else {
          // BLUE MATRIX CHARACTERS
          const opacity = Math.random() * 0.5 + 0.3
          ctx.fillStyle = `rgba(0, ${Math.floor(150 + Math.random() * 105)}, 255, ${opacity})`
          ctx.shadowColor = "#0078ff"
          ctx.shadowBlur = 4
        }

        ctx.font = `${fontSize}px monospace`
        ctx.fillText(char, x, y * fontSize)
        ctx.shadowBlur = 0

        // RESET DROP RANDOMLY
        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      })
    }

    const interval = setInterval(draw, 40)

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener("resize", handleResize)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full"
      style={{ zIndex: 0, opacity: 0.4 }}
    />
  )
}

// TYPEWRITER HOOK
function useTypewriter(texts, speed = 80) {
  const [displayText, setDisplayText] = useState("")
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = texts[textIndex]
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplayText(current.slice(0, charIndex + 1))
        if (charIndex + 1 === current.length) {
          setTimeout(() => setDeleting(true), 2000)
        } else {
          setCharIndex(c => c + 1)
        }
      } else {
        setDisplayText(current.slice(0, charIndex - 1))
        if (charIndex - 1 === 0) {
          setDeleting(false)
          setTextIndex(i => (i + 1) % texts.length)
          setCharIndex(0)
        } else {
          setCharIndex(c => c - 1)
        }
      }
    }, deleting ? speed / 2 : speed)

    return () => clearTimeout(timeout)
  }, [charIndex, deleting, textIndex, texts, speed])

  return displayText
}

function Home() {
  const navigate = useNavigate()
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
  const username = localStorage.getItem("username")

  const typewriterText = useTypewriter([
    "Threat Intelligence Platform",
    "Security Operations Dashboard",
    "Cyber Attack Detection System",
    "Real-Time Log Monitoring",
    "Phishing URL Analyzer",
  ])

  const modules = [
    { icon: "🔍", title: "ThreatLens", desc: "Analyze URLs, IPs, and emails for phishing and malware threats.", path: "/threatlens", color: "rgba(255,150,0,0.12)", border: "rgba(255,150,0,0.35)" },
    { icon: "📋", title: "LogSentry", desc: "Monitor server logs for brute force and distributed attacks.", path: "/logsentry", color: "rgba(0,150,255,0.12)", border: "rgba(0,150,255,0.35)" },
    { icon: "📁", title: "SecureVault", desc: "Securely upload and store investigation reports and files.", path: "/secure-reports", color: "rgba(150,0,255,0.12)", border: "rgba(150,0,255,0.35)" },
    { icon: "🖥️", title: "Analyst Portal", desc: "Command center — timeline, reports overview, live threat intel.", path: "/analyst-portal", color: "rgba(0,200,150,0.1)", border: "rgba(0,200,150,0.3)" },
  ]

  const features = [
    { icon: "⚡", title: "Real-Time Detection", desc: "Instant threat analysis on URLs, IPs and emails" },
    { icon: "🔐", title: "Role-Based Access", desc: "Admin and user roles with protected routes" },
    { icon: "📡", title: "Live Threat Intel", desc: "Latest cybersecurity news feed from around the world" },
    { icon: "🗂️", title: "Audit Timeline", desc: "Every action logged with timestamp for full traceability" },
    { icon: "📧", title: "Admin Alerts", desc: "Instant email notification when new users register" },
    { icon: "🛡️", title: "Secure Storage", desc: "Upload and manage security reports safely" },
  ]

  return (
    <div className="min-h-screen flex flex-col relative">

      {/* MATRIX RAIN BACKGROUND */}
      <MatrixRain />

      {/* DARK OVERLAY for readability */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: "linear-gradient(135deg, rgba(2,8,24,0.85) 0%, rgba(10,22,64,0.80) 50%, rgba(2,8,24,0.85) 100%)"
        }}
      />

      {/* CONTENT — above matrix */}
      <div className="relative" style={{ zIndex: 2 }}>

        {/* HERO SECTION */}
        <div className="flex flex-col items-center justify-center text-center pt-10 pb-16 px-6">

          {/* GLOWING SHIELD */}
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full animate-ping"
              style={{ background: "rgba(0,120,255,0.15)", transform: "scale(1.5)" }} />
            <div className="text-8xl animate-shield relative">🛡️</div>
          </div>

          {/* TITLE */}
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            CyberSec{" "}
            <span style={{
              color: "#00c8ff",
              textShadow: "0 0 30px rgba(0,200,255,0.5), 0 0 60px rgba(0,200,255,0.2)"
            }}>
              Nexus
            </span>
          </h1>

          {/* TYPEWRITER */}
          <div className="h-8 mb-6">
            <p className="text-blue-300 text-xl font-mono">
              {typewriterText}
              <span className="animate-flicker" style={{ color: "#00c8ff" }}>|</span>
            </p>
          </div>

          <p className="text-blue-400 text-sm max-w-xl mb-10 opacity-70 leading-relaxed">
            Detect threats, monitor logs, store reports securely, and stay updated
            with live cyber intelligence — all in one place.
          </p>

          {/* CTA BUTTONS */}
          {isLoggedIn ? (
            <div className="flex flex-col items-center gap-4">
              <p className="text-blue-200 text-lg">
                Welcome back,{" "}
                <span className="text-white font-bold"
                  style={{ textShadow: "0 0 10px rgba(0,200,255,0.5)" }}>
                  {username}
                </span>! 👋
              </p>
              <button onClick={() => navigate("/dashboard")}
                className="btn-glow px-10 py-4 rounded-xl text-base font-bold"
                style={{ boxShadow: "0 0 20px rgba(0,120,255,0.3)" }}>
                Go to Dashboard →
              </button>
            </div>
          ) : (
            <div className="flex gap-4 flex-wrap justify-center">
              <button onClick={() => navigate("/register")}
                className="btn-glow px-8 py-4 rounded-xl text-base font-bold"
                style={{ boxShadow: "0 0 20px rgba(0,120,255,0.3)" }}>
                Get Started Free
              </button>
              <button onClick={() => navigate("/login")}
                className="px-8 py-4 rounded-xl font-bold text-base text-blue-300 transition-all hover:text-white hover:scale-105"
                style={{ border: "1px solid rgba(0,150,255,0.4)", background: "rgba(0,100,255,0.1)" }}>
                Sign In
              </button>
            </div>
          )}

          {/* SCROLL INDICATOR */}
          <div className="mt-16 flex flex-col items-center gap-2 opacity-40">
            <p className="text-blue-400 text-xs uppercase tracking-widest">Scroll to explore</p>
            <div className="w-px h-8 bg-gradient-to-b from-blue-400 to-transparent" />
          </div>
        </div>

        {/* MODULES SECTION */}
        <div className="px-6 pb-16">
          <div className="text-center mb-10">
            <p className="text-blue-400 text-xs uppercase tracking-widest mb-2 opacity-60">What's inside</p>
            <h2 className="text-3xl font-bold text-white">Platform Modules</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {modules.map((mod, i) => (
              <div key={i} onClick={() => navigate(mod.path)}
                className="p-6 rounded-2xl cursor-pointer group transition-all duration-300 hover:-translate-y-3"
                style={{
                  background: mod.color,
                  border: `1px solid ${mod.border}`,
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 20px 60px ${mod.border}`}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)"}
              >
                <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">{mod.icon}</div>
                <h3 className="text-white text-lg font-bold mb-2 group-hover:text-blue-200 transition-colors">{mod.title}</h3>
                <p className="text-blue-300 text-sm opacity-80 leading-relaxed">{mod.desc}</p>
                <div className="mt-4 text-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 text-blue-300 flex items-center gap-1">
                  Open Module <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FEATURES SECTION */}
        <div className="px-6 pb-16"
          style={{ borderTop: "1px solid rgba(0,150,255,0.1)" }}>
          <div className="text-center mb-10 pt-12">
            <p className="text-blue-400 text-xs uppercase tracking-widest mb-2 opacity-60">Why CyberSec Nexus?</p>
            <h2 className="text-3xl font-bold text-white">Platform Features</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-xl transition-all duration-300 hover:-translate-y-1"
                style={{ background: "rgba(0,100,255,0.06)", border: "1px solid rgba(0,150,255,0.12)" }}>
                <span className="text-2xl flex-shrink-0">{f.icon}</span>
                <div>
                  <h3 className="text-white font-bold mb-1 text-sm">{f.title}</h3>
                  <p className="text-blue-300 text-xs opacity-70 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* STATS */}
        <div className="py-12 px-6"
          style={{ borderTop: "1px solid rgba(0,150,255,0.1)", borderBottom: "1px solid rgba(0,150,255,0.1)" }}>
          <div className="grid grid-cols-3 max-w-2xl mx-auto text-center gap-6">
            {[["4", "Security Modules"], ["24/7", "Threat Monitoring"], ["100%", "Secure Storage"]].map(([val, label], i) => (
              <div key={i}>
                <p className="text-4xl font-bold mb-1"
                  style={{ color: "#00c8ff", textShadow: "0 0 20px rgba(0,200,255,0.4)" }}>
                  {val}
                </p>
                <p className="text-blue-400 text-sm opacity-70">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center py-6">
          <p className="text-blue-500 text-xs opacity-40">
            CyberSec Nexus © 2025 — Threat Intelligence & Security Operations Dashboard
          </p>
        </div>

      </div>
    </div>
  )
}

export default Home
