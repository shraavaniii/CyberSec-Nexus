import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useMemo } from "react"
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
  return (
    <BrowserRouter>
      <div className="grid-overlay" />
      <Particles />
      <div className="relative z-10 min-h-screen">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 p-6 text-white">
            <Routes>
              {/* PUBLIC */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* PROTECTED — ANY LOGGED IN USER */}
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
