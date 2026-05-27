import express from "express"
import multer from "multer"
import db from "../db.js"

const router = express.Router()

// STORAGE CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  }
})
const upload = multer({ storage })

// UPLOAD REPORT
router.post("/reports", upload.single("file"), async (req, res) => {
  try {
    const { title } = req.body
    const filename = req.file.filename
    await db.query(
      "INSERT INTO reports (title, filename) VALUES ($1, $2)",
      [title, filename]
    )
    return res.json({ message: "Report Uploaded Successfully" })
  } catch (error) {
    console.error("Upload Error:", error)
    return res.status(500).json({ message: "Upload Failed" })
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