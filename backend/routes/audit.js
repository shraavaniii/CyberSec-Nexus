import express from "express"
import db from "../db.js"
const router = express.Router()

// LOG AN ACTION
router.post("/audit", (req, res) => {
  const { action, detail } = req.body
  const sql =
    "INSERT INTO audit_logs (action, detail) VALUES (?, ?)"
  db.query(sql, [action, detail], (err, result) => {
    if (err) {
      console.log(err)
      return res.status(500).json("Failed to Log Action")
    }
    return res.json("Action Logged")
  })
})

// GET ALL AUDIT LOGS
router.get("/audit", (req, res) => {
  const sql =
    "SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 20"
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
      return res.status(500).json("Failed to Fetch Logs")
    }
    return res.json(result)
  })
})

export default router
