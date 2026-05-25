import express from "express"
import db from "../db.js"

const router = express.Router()

// GET DASHBOARD STATS
router.get("/dashboard/stats", (req, res) => {
  const stats = {}

  // COUNT USERS
  db.query("SELECT COUNT(*) AS count FROM users", (err, result) => {
    if (err) return res.status(500).json({ message: "Database Error" })
    stats.totalUsers = result[0].count

    // COUNT REPORTS
    db.query("SELECT COUNT(*) AS count FROM reports", (err, result) => {
      if (err) return res.status(500).json({ message: "Database Error" })
      stats.totalReports = result[0].count

      // COUNT THREAT SCANS
      db.query(
        "SELECT COUNT(*) AS count FROM audit_logs WHERE action = 'Threat Scan'",
        (err, result) => {
          if (err) return res.status(500).json({ message: "Database Error" })
          stats.threatScans = result[0].count

          // COUNT LOG CHECKS
          db.query(
            "SELECT COUNT(*) AS count FROM audit_logs WHERE action = 'Log Check'",
            (err, result) => {
              if (err) return res.status(500).json({ message: "Database Error" })
              stats.logChecks = result[0].count

              return res.json(stats)
            }
          )
        }
      )
    })
  })
})

export default router
