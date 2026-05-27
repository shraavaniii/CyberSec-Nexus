import express from "express"
import db from "../db.js"

const router = express.Router()

// LOG AN ACTION
router.post("/audit", async (req, res) => {
  try {
    const { action, detail } = req.body
    await db.query(
      "INSERT INTO audit_logs (action, detail) VALUES ($1, $2)",
      [action, detail]
    )
    return res.json({ message: "Action Logged" })
  } catch (error) {
    console.error("Audit Log Error:", error)
    return res.status(500).json({ message: "Failed to Log Action" })
  }
})

// GET ALL AUDIT LOGS
router.get("/audit", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 20"
    )
    return res.json(result.rows)
  } catch (error) {
    console.error("Fetch Audit Error:", error)
    return res.status(500).json({ message: "Failed to Fetch Logs" })
  }
})

export default router