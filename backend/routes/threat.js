import express from "express"
const router = express.Router()

// Trusted Domain Whitelist
const trustedDomains = [ 
  "google.com", "www.google.com", "microsoft.com", "www.microsft.com", 
  "apple.com", "www.apple.com", "amazon.com", "www.amazon.com", 
  "netflix.com", "www.netflix.com", "paypal.com", "www.paypal.com", 
  "facebook.com", "www.facebook.com", "instagram.com", "www.instagram.com", 
  "telegram.com", "www.telegram.com", "twitter.com", "www.twitter.com", 
  "linkedin.com", "www.linkedin.com", "github.com", "www.github.com", 
  "youtube.com", "www.youtube.com", "wikipedia.com", "www.wikipedia.com", 
  "stackoverflow.com", "gmail.com", "outlook.com", "yahoo.com"
]

// Extract Domain from Input
const extractDomain = (input) => {
  try {
    const url = input.startsWith("http") ? input : "https://" + input
    const hostname = new URL(url).hostname.toLowerCase()
    return hostname
  } catch {
    return input.toLowerCase()
  }
}

router.post("/analyze", (req, res) => {
  const { input } = req.body
  const value = input.toLowerCase()

  // Extract Domain
  const domain = extractDomain(value)

  // Check Whitelist first
  const isTrusted = trustedDomains.some(
    trusted => domain === trusted || domain.endsWith("." + trusted)
  )

  if (isTrusted){
    return res.json({
      message: "✅ Input appears Safe - Trusted Domain", 
      level : "LOW", 
      color : "low", 
      riskScore : 0, 
      reasons : [`✅ "${domain}" is a verified trusted domain`]
    })
  }

  // NORMALIZE HOMOGRAPH CHARACTERS
  const normalized = value
    .replace(/0/g, "o")      // 0 → o  (g00gle → google)
    .replace(/1/g, "l")      // 1 → l  (paypa1 → paypal)
    .replace(/3/g, "e")      // 3 → e  (s3cure → secure)
    .replace(/4/g, "a")      // 4 → a  (p4ypal → paypal)
    .replace(/5/g, "s")      // 5 → s  (5ecure → secure)
    .replace(/6/g, "g")      // 6 → g  (6oogle → google)
    .replace(/8/g, "b")      // 8 → b  (8ank → bank)
    .replace(/\|/g, "l")     // | → l  (pay|pal → paypal)
    .replace(/i/g, "i")      // normalize i variants
    .replace(/vv/g, "w")     // vv → w  (tvvitter → twitter)

  let riskScore = 0
  const detectedReasons = []

  // ─── CHECK HTTP vs HTTPS ───
  if (value.startsWith("http://")) {
    riskScore += 2
    detectedReasons.push("⚠ Unencrypted HTTP connection (not HTTPS)")
  }

  // ─── HIGH RISK KEYWORDS (on normalized) ───
  const riskyWords = [
    "l0gin", "verify", "secure", "update", "bank",
    "paypaI", "payment", "crypto", "wallet", "account",
    "c0nfirm", "passw0rd", "signin", "billing", "ebay",
    "amaz0n", "apple", "g00gle", "microsotf", "netflix"
  ]
  riskyWords.forEach((word) => {
    if (normalized.includes(word)) {
      riskScore += 1
      detectedReasons.push(`⚠ Risky keyword detected: "${word}"`)
    }
  })

  // ─── SUSPICIOUS DOMAIN PATTERNS ───
  const suspiciousPatterns = [
    { pattern: "--", label: "Multiple hyphens in domain" },
    { pattern: "@", label: "@ symbol in URL (redirection trick)" },
    { pattern: ".xyz", label: "Suspicious TLD (.xyz)" },
    { pattern: ".ru", label: "Suspicious TLD (.ru)" },
    { pattern: ".tk", label: "Suspicious TLD (.tk)" },
    { pattern: ".ml", label: "Suspicious TLD (.ml)" },
    { pattern: ".cf", label: "Suspicious TLD (.cf)" },
    { pattern: "free", label: 'Lure word "free"' },
    { pattern: "bonus", label: 'Lure word "bonus"' },
    { pattern: "win", label: 'Lure word "win"' },
    { pattern: "lucky", label: 'Lure word "lucky"' },
    { pattern: "click", label: 'Lure word "click"' },
  ]
  suspiciousPatterns.forEach(({ pattern, label }) => {
    if (value.includes(pattern)) {
      riskScore += 1
      detectedReasons.push(`⚠ ${label}`)
    }
  })

  // ─── HOMOGRAPH DETECTION ───
  // If normalized version contains risky words but original didn't
  const homographCheck = [
    "paypal", "google", "amazon", "microsoft",
    "apple", "netflix", "bank", "secure", "login"
  ]
  homographCheck.forEach((word) => {
    if (normalized.includes(word) && !value.includes(word)) {
      riskScore += 3
      detectedReasons.push(`🚨 Homograph/Typosquatting attack detected — "${word}" disguised using lookalike characters`)
    }
  })

  // ─── IP ADDRESS AS URL ───
  const ipPattern = /^https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/
  if (ipPattern.test(value)) {
    riskScore += 3
    detectedReasons.push("🚨 IP address used instead of domain name — highly suspicious")
  }

  // ─── EMAIL PHISHING ───
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (emailPattern.test(value)) {
    const emailPrefix = value.split("@") [0]
    const emailDomain = value.split("@")[1]
    const fakeDomainPatterns = ["support", "help", "service", "noreply", "security", "alert", "verify"]
    const fakePrefix = fakeDomainPatterns.find(p => emailPrefix.includes(p))
    if (fakePrefix) {
      riskScore += 2
      detectedReasons.push(`⚠ Phishing email prefix detected: "${fakePrefix}"`)
    }
    // CHECK HOMOGRAPH IN EMAIL DOMAIN
    const normalizedDomain = emailDomain
      .replace(/0/g, "o").replace(/1/g, "l").replace(/3/g, "e")
    const knownDomains = ["paypal", "google", "amazon", "microsoft", "apple", "netflix"]
    knownDomains.forEach(domain => {
      if (normalizedDomain.includes(domain) && !emailDomain.includes(domain)) {
        riskScore += 3
        detectedReasons.push(`🚨 Email domain spoofing — "${domain}" disguised in domain`)
      }
    })
  }

  // ─── EXCESSIVE HYPHENS ───
  const hyphenCount = (value.match(/-/g) || []).length
  if (hyphenCount >= 2) {
    riskScore += 2
    detectedReasons.push(`⚠ Excessive hyphens in URL (${hyphenCount} found)`)
  }

  // ─── LONG SUBDOMAIN ───
  const subdomainMatch = value.match(/^https?:\/\/([^/]+)/)
  if (subdomainMatch) {
    const parts = subdomainMatch[1].split(".")
    if (parts.length > 4) {
      riskScore += 2
      detectedReasons.push("⚠ Unusually long subdomain chain — phishing indicator")
    }
  }

  // ─── FINAL RESULT ───
  let level, message, color

  if (riskScore >= 6) {
    level = "CRITICAL"
    message = "🚨 Critical Threat Detected — Do NOT visit this URL"
    color = "critical"
  } else if (riskScore >= 4) {
    level = "HIGH"
    message = "🚨 High-Risk Phishing Threat Detected"
    color = "high"
  } else if (riskScore >= 2) {
    level = "MEDIUM"
    message = "⚠ Suspicious Input Detected — Proceed with Caution"
    color = "medium"
  } else {
    level = "LOW"
    message = "✔ Input Appears Safe"
    color = "low"
  }

  return res.json({
    message,
    level,
    color,
    riskScore,
    reasons: detectedReasons
  })
})

export default router
