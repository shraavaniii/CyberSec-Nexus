import express from "express"
import db from "../db.js"

const router = express.Router()

// GET DASHBOARD STATS
router.get("/dashboard/stats", async (req, res) => {
  try {
    const [users, reports, threatScans, logChecks] = await Promise.all([
      db.query("SELECT COUNT(*) FROM users"),
      db.query("SELECT COUNT(*) FROM reports"),
      db.query("SELECT COUNT(*) FROM audit_logs WHERE action = 'Threat Scan'"),
      db.query("SELECT COUNT(*) FROM audit_logs WHERE action = 'Log Check'")
    ])

    return res.json({
      totalUsers:  parseInt(users.rows[0].count),
      totalReports: parseInt(reports.rows[0].count),
      threatScans:  parseInt(threatScans.rows[0].count),
      logChecks:    parseInt(logChecks.rows[0].count)
    })
  } catch (error) {
    console.error("Dashboard Stats Error:", error)
    return res.status(500).json({ message: "Failed to Fetch Stats" })
  }
})

export default router