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
router.post(
  "/reports",
  upload.single("file"),
  (req, res) => {
    const { title } = req.body
    const filename = req.file.filename
    const sql =
      "INSERT INTO reports (title, filename) VALUES (?, ?)"
    db.query(
      sql,
      [title, filename],
      (err, result) => {
        if (err) {
          console.log(err)
          return res.status(500).json("Upload Failed")
        }
        return res.json("Report Uploaded Successfully")
      }
    )
  }
)

// GET ALL REPORTS
router.get("/reports", (req, res) => {
  const sql = "SELECT * FROM reports ORDER BY id DESC"
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
      return res.status(500).json("Failed to Fetch Reports")
    }
    return res.json(result)
  })
})

export default router