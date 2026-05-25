import express from "express"
const router = express.Router()

router.post("/logs", (req, res) => {
  const { logs } = req.body
  const lines = logs.split("\n")

  const results = []

  // TRACKERS
  const ipFailureMap = {}
  const ipRequestMap = {}

  lines.forEach((line, index) => {
    const lower = line.toLowerCase()
    const lineNum = `Line ${index + 1}`

    // ─── FAILED LOGIN TRACKING ───
    if (lower.includes("failed login")) {
      const ipMatch = line.match(/\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/)
      const ip = ipMatch ? ipMatch[1] : "unknown"
      ipFailureMap[ip] = (ipFailureMap[ip] || 0) + 1
    }

    // ─── REQUEST COUNT TRACKING PER IP ───
    const ipMatch = line.match(
      /\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/
    )

    if (ipMatch) {

      const ip = ipMatch[1]

      ipRequestMap[ip] =
        (ipRequestMap[ip] || 0) + 1
    }

    // ─── SQL INJECTION ───
    const sqlRegex =
        /(or.*=.*|union\s+select|drop\s+table|insert\s+into|delete\s+from|--)/i
    if (sqlRegex.test(lower)) {

      results.push({
        type: "💉 SQL Injection Attempt",
        color: "red",
        detail:
          `[${lineNum}] SQL Injection pattern detected → ${line.trim()}`
      })
    }

    // ─── XSS ATTACK ───
    const xssPatterns = [
      "<script", "</script>", "javascript:", "onerror=",
      "onload=", "onclick=", "alert(", "document.cookie",
      "eval(", "innerhtml", "<iframe", "<img src="
    ]
    const foundXSS = xssPatterns.find(p => lower.includes(p))
    if (foundXSS) {
      results.push({
        type: "🕸️ XSS Attack Attempt",
        color: "orange",
        detail: `[${lineNum}] Pattern "${foundXSS}" detected → ${line.trim()}`
      })
    }

    // ─── PORT SCANNING ───
    const portPatterns = [
      "nmap", "port scan", "syn scan", "fin scan", "xmas scan",
      "null scan", "portscan", "port sweep", "masscan", "zmap"
    ]
    const foundPort = portPatterns.find(p => lower.includes(p))
    if (foundPort) {
      results.push({
        type: "🔎 Port Scan Detected",
        color: "yellow",
        detail: `[${lineNum}] Tool/pattern "${foundPort}" detected → ${line.trim()}`
      })
    }

    // ─── UNAUTHORIZED / ACCESS DENIED ───
    if (lower.includes("unauthorized")) {
      results.push({
        type: "⚠ Unauthorized Access Attempt",
        color: "yellow",
        detail: `[${lineNum}] → ${line.trim()}`
      })
    }
    if (lower.includes("access denied")) {
      results.push({
        type: "⚠ Access Denied Event",
        color: "yellow",
        detail: `[${lineNum}] → ${line.trim()}`
      })
    }
  })

  // ─── BRUTE FORCE / DISTRIBUTED ATTACK ───
  const attackingIPs = Object.keys(ipFailureMap)
  attackingIPs.forEach((ip) => {
    const count = ipFailureMap[ip]
    if (count >= 3) {
      results.push({
        type: "🚨 Brute Force Attack",
        color: "red",
        detail: `${count} failed login attempts from ${ip}`
      })
    } else if (count === 2) {
      results.push({
        type: "⚠ Suspicious Login Activity",
        color: "yellow",
        detail: `2 failed login attempts from ${ip}`
      })
    } else {
      results.push({
        type: "ℹ Single Failed Login",
        color: "blue",
        detail: `1 failed attempt from ${ip}`
      })
    }
  })

  // ─── DISTRIBUTED LOGIN ATTACK ───
  const bruteIPs = attackingIPs.filter(ip => ipFailureMap[ip] >= 2)
  if (bruteIPs.length >= 3) {
    results.unshift({
      type: "🚨 Distributed Attack Detected",
      color: "red",
      detail: `Multiple IPs attacking simultaneously — ${bruteIPs.length} sources: ${bruteIPs.join(", ")}`
    })
  }

  // ─── DDoS DETECTION (MULTIPLE IPs HIGH TRAFFIC) ───
  const highTrafficIPs = Object.keys(ipRequestMap).filter(
    ip => ipRequestMap[ip] >= 5
  )

  if (highTrafficIPs.length >= 3) {
    const totalRequests = highTrafficIPs.reduce(
      (sum, ip) => sum + ipRequestMap[ip], 0
    )
    results.push({
      type: "🚨 DDoS Attack Detected",
      color: "red",
      detail: `${highTrafficIPs.length} IPs sending high traffic simultaneously — ${totalRequests} total requests from: ${highTrafficIPs.join(", ")}`
    })
  } else if (highTrafficIPs.length === 2) {
    results.push({
      type: "⚠ Possible DDoS — Multiple High Traffic IPs",
      color: "orange",
      detail: `2 IPs with high request volume — ${highTrafficIPs.join(", ")} — monitor closely`
    })
  }

  // ─── ALL CLEAR ───
  if (results.length === 0) {
    return res.json({
      results: [{
        type: "✔ Logs Appear Normal",
        color: "green",
        detail: "No threats or suspicious patterns detected"
      }]
    })
  }

  return res.json({ results })
})

export default router