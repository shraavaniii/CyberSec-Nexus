import { useState } from "react"
import axios from "axios"

function ThreatLens() {
  const [input, setInput] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const analyzeThreat = async () => {
    if (!input.trim()) {
      setResult({ message: "Please enter a URL, IP or Email", level: "LOW", riskScore: 0, reasons: [], color: "low" })
      return
    }
    try {
      setLoading(true)
      const res = await axios.post(
        "http://localhost:5000/api/analyze",
        { input }
      )

      setResult(res.data)

      // LOG TO AUDIT
      await axios.post(`${import.meta.env.VITE_API_URL}/api/audit`, {
        action: "Threat Scan",
        detail: `Scanned: ${input} → ${res.data.message}`
      })
    } catch (error) {
      console.log(error)
      setResult({ message: "Analysis Failed", level: "LOW", riskScore: 0, reasons: [], color: "low" })
    } finally {
      setLoading(false)
    }
  }

  const getLevelStyle = (color) => {
    switch (color) {
      case "critical": return { bg: "rgba(180,0,0,0.2)",   border: "rgba(255,50,50,0.5)",  text: "text-red-400",    bar: "#ff3333", label: "bg-red-600" }
      case "high":     return { bg: "rgba(200,50,0,0.15)", border: "rgba(255,100,50,0.5)", text: "text-orange-400", bar: "#ff6633", label: "bg-orange-600" }
      case "medium":   return { bg: "rgba(180,130,0,0.15)",border: "rgba(255,200,0,0.4)",  text: "text-yellow-400", bar: "#ffcc00", label: "bg-yellow-600" }
      case "low":      return { bg: "rgba(0,150,50,0.1)",  border: "rgba(0,255,100,0.3)",  text: "text-green-400",  bar: "#00ff88", label: "bg-green-600" }
      default:         return { bg: "rgba(0,100,200,0.1)", border: "rgba(0,150,255,0.3)",  text: "text-blue-300",   bar: "#0096ff", label: "bg-blue-600" }
    }
  }

  const getBarWidth = (score) => {
    const max = 10
    const pct = Math.min((score / max) * 100, 100)
    return pct + "%"
  }

  const style = result ? getLevelStyle(result.color) : null

  return (
    <div className="p-2">
      <h1 className="text-4xl font-bold text-white mb-2">Threat Analysis</h1>
      <p className="text-blue-300 text-sm mb-8 opacity-70">
        Analyze URLs, IPs, and emails for phishing, homograph attacks, and malware threats
      </p>

      <div className="glass rounded-2xl p-8 max-w-3xl"
        style={{ border: "1px solid rgba(0,150,255,0.2)" }}>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter URL, IP address, or Email"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && analyzeThreat()}
            className="flex-1 p-4 rounded-xl text-sm"
          />
          <button
            onClick={analyzeThreat}
            className="btn-glow px-6 py-4 rounded-xl font-bold text-sm whitespace-nowrap"
          >
            Analyze
          </button>
        </div>

        {/* EXAMPLE CHIPS */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            "http://fake-paypaI.com/login",
            "support@amaz0n.com",
            "http://192.168.1.1/admin",
            "https://google.com"
          ].map((example, i) => (
            <button key={i} onClick={() => setInput(example)}
              className="text-xs px-3 py-1 rounded-full text-blue-300 hover:text-white transition-colors"
              style={{ border: "1px solid rgba(0,150,255,0.25)", background: "rgba(0,100,255,0.08)" }}>
              {example}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <p className="text-blue-300 animate-pulse">Scanning...</p>
          </div>
        )}

        {result && !loading && (
          <div className="rounded-2xl p-6 animate-fade-up"
            style={{ background: style.bg, border: `1px solid ${style.border}` }}>

            {/* LEVEL BADGE + MESSAGE */}
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xs font-bold px-3 py-1 rounded-full text-white ${style.label}`}>
                {result.level}
              </span>
              <p className={`font-bold text-base ${style.text}`}>{result.message}</p>
            </div>

            {/* RISK SCORE BAR */}
            <div className="mb-5">
              <div className="flex justify-between text-xs text-blue-300 mb-1">
                <span>Risk Score</span>
                <span className={`font-bold ${style.text}`}>{result.riskScore} / 10</span>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden"
                style={{ background: "rgba(0,0,0,0.3)" }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: getBarWidth(result.riskScore), background: style.bar,
                    boxShadow: `0 0 10px ${style.bar}` }}
                />
              </div>
            </div>

            {/* REASONS */}
            {result.reasons && result.reasons.length > 0 && (
              <div>
                <p className="text-blue-300 text-xs uppercase tracking-widest mb-2 opacity-70">
                  Detection Details
                </p>
                <div className="flex flex-col gap-2">
                  {result.reasons.map((reason, i) => (
                    <p key={i} className="text-sm text-blue-100 font-mono opacity-80">
                      {reason}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ThreatLens
