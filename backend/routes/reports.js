import express from "express"
import multer from "multer"
import db from "../db.js"

const router = express.Router()

// MEMORY STORAGE — no disk, no cloud
const upload = multer({ storage: multer.memoryStorage() })

// UPLOAD REPORT
router.post("/reports", upload.single("file"), async (req, res) => {
  try {
    const { title, uploaded_by } = req.body
    const filename = req.file ? req.file.originalname : "unknown"

    await db.query(
      "INSERT INTO reports (title, filename, uploaded_by) VALUES ($1, $2, $3)",
      [title, filename, uploaded_by]
    )

    return res.json({ message: "Report Uploaded Successfully" })
  } catch (error) {
    console.error("Upload Error:", error)
    return res.status(500).json({ message: "Upload Failed" })
  }
})

// GET REPORTS BY USER
router.get("/reports/my/:username", async (req, res) => {
  try {
    const { username } = req.params
    const result = await db.query(
      "SELECT * FROM reports WHERE uploaded_by = $1 ORDER BY id DESC",
      [username]
    )
    return res.json(result.rows)
  } catch (error) {
    console.error("Fetch My Reports Error:", error)
    return res.status(500).json({ message: "Failed to Fetch Reports" })
  }
})

// GET ALL REPORTS
router.get("/reports", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM reports ORDER BY id DESC"
    )
    return res.json(result.rows)
  } catch (error) {
    console.error("Fetch Reports Error:", error)
    return res.status(500).json({ message: "Failed to Fetch Reports" })
  }
})

export default router