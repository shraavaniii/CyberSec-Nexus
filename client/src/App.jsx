import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useMemo, useState } from "react"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import ProtectedRoute from "./components/ProtectedRoute"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import ThreatLens from "./pages/ThreatLens"
import LogSentry from "./pages/LogSentry"
import SecureReports from "./pages/SecureReports"
import AnalystPortal from "./pages/AnalystPortal"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Unauthorized from "./pages/Unauthorized"
import NotFound from "./pages/NotFound"

function Particles() {
  const particles = useMemo(() =>
    [...Array(30)].map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      left: Math.random() * 100,
      duration: Math.random() * 20 + 12,
      delay: Math.random() * 15,
      opacity: Math.random() * 0.2 + 0.05,
      blue: Math.random() > 0.5
    })), []
  )

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size + "px",
            height: p.size + "px",
            left: p.left + "%",
            bottom: "-10px",
            opacity: p.opacity,
            background: p.blue ? "#00c8ff" : "#0078ff",
            animation: `float-up ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <BrowserRouter>
      <div className="grid-overlay" />
      <Particles />
      <div className="relative z-10 min-h-screen">

        {/* NAVBAR — passes toggle function */}
        <Navbar onToggleSidebar={() => setSidebarOpen(o => !o)} sidebarOpen={sidebarOpen} />

        <div className="flex relative">

          {/* SIDEBAR OVERLAY — clicking outside closes it */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-20"
              style={{ background: "rgba(0,0,0,0.4)" }}
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* SIDEBAR — slides in from left */}
          <div
            className="fixed top-0 left-0 h-full z-30 transition-transform duration-300 ease-in-out"
            style={{
              transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
              marginTop: "65px"
            }}
          >
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>

          {/* MAIN CONTENT — full width always */}
          <div className="flex-1 p-6 text-white w-full">
            <Routes>
              {/* PUBLIC */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* PROTECTED */}
              <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
              <Route path="/threatlens" element={
                <ProtectedRoute><ThreatLens /></ProtectedRoute>
              } />
              <Route path="/logsentry" element={
                <ProtectedRoute><LogSentry /></ProtectedRoute>
              } />
              <Route path="/secure-reports" element={
                <ProtectedRoute><SecureReports /></ProtectedRoute>
              } />

              {/* ADMIN ONLY */}
              <Route path="/analyst-portal" element={
                <ProtectedRoute adminOnly={true}>
                  <AnalystPortal />
                </ProtectedRoute>
              } />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
