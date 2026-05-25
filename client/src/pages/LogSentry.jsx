import { useState } from "react"
import axios from "axios"

function LogSentry() {
  const [logs, setLogs] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const analyzeLogs = async () => {
    if (!logs.trim()) {
      setResults([{ type: "⚠ Please enter logs", color: "yellow", detail: "" }])
      return
    }
    try {
      setLoading(true)
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/logs`, { logs })
      setResults(res.data.results)

      // LOG TO AUDIT
      await axios.post(`${import.meta.env.VITE_API_URL}/api/audit`, {
        action: "Log Check",
        detail: `Log analyzed → ${res.data.results[0].type}`
      })
    } catch (error) {
      console.log(error)
      setResults([{ type: "🚨 Log Analysis Failed", color: "red", detail: "Server error" }])
    } finally {
      setLoading(false)
    }
  }

  const getColors = (color) => {
    switch (color) {
      case "red":    return { border: "rgba(255,50,50,0.4)",   bg: "rgba(255,50,50,0.08)",   text: "text-red-400" }
      case "orange": return { border: "rgba(255,150,0,0.4)",   bg: "rgba(255,150,0,0.08)",   text: "text-orange-400" }
      case "yellow": return { border: "rgba(255,220,0,0.4)",   bg: "rgba(255,220,0,0.06)",   text: "text-yellow-400" }
      case "blue":   return { border: "rgba(0,150,255,0.4)",   bg: "rgba(0,150,255,0.08)",   text: "text-blue-300" }
      case "green":  return { border: "rgba(0,255,150,0.4)",   bg: "rgba(0,255,150,0.08)",   text: "text-green-400" }
      default:       return { border: "rgba(255,255,255,0.2)", bg: "rgba(255,255,255,0.05)", text: "text-white" }
    }
  }

  return (
    <div className="p-2">
      <h1 className="text-4xl font-bold text-white mb-2">Log Monitoring</h1>
      <p className="text-blue-300 text-sm mb-8 opacity-70">
        Detect brute force, SQL injection, XSS, port scans, DDoS and more
      </p>

      <div className="glass rounded-2xl p-8 max-w-4xl"
        style={{ border: "1px solid rgba(0,150,255,0.2)" }}>

        <textarea
          rows="10"
          placeholder={`Paste server logs here...\n\nExamples to try:\n→ failed login attempt from 192.168.1.10\n→ ' OR 1=1 --\n→ <script>alert('xss')</script>\n→ nmap port scan detected from 10.0.0.1`}
          value={logs}
          onChange={(e) => setLogs(e.target.value)}
          className="w-full p-4 rounded-xl font-mono text-sm mb-4"
          style={{ minHeight: "200px" }}
        />

        <div className="flex items-center gap-4">
          <button
            onClick={analyzeLogs}
            className="btn-glow px-8 py-3 rounded-xl font-bold text-base"
          >
            Analyze Logs
          </button>
          {results.length > 0 && (
            <button
              onClick={() => setResults([])}
              className="px-6 py-3 rounded-xl font-bold text-sm text-blue-300 hover:text-white transition-colors"
              style={{ border: "1px solid rgba(0,150,255,0.3)", background: "rgba(0,100,255,0.1)" }}
            >
              Clear
            </button>
          )}
        </div>

        {loading && (
          <div className="mt-6 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <p className="text-blue-300 animate-pulse">Monitoring Logs...</p>
          </div>
        )}

        {results.length > 0 && !loading && (
          <div className="mt-6">
            <h2 className="text-blue-300 text-base font-bold mb-4 uppercase tracking-widest opacity-70">
              Analysis Result — {results.length} finding{results.length > 1 ? "s" : ""}
            </h2>
            <div className="flex flex-col gap-3">
              {results.map((item, index) => {
                const c = getColors(item.color)
                return (
                  <div key={index} className="rounded-xl p-4"
                    style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                    <p className={`font-bold text-sm mb-1 ${c.text}`}>{item.type}</p>
                    {item.detail && (
                      <p className="text-blue-200 text-xs font-mono opacity-80">{item.detail}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LogSentry
