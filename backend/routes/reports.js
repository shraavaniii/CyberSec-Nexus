import express from "express"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import db from "../db.js"

const router = express.Router()

// CLOUDINARY CONFIG
cloudinary.config({
  cloud_name: "ddo7ya2i2",
  api_key: "224613951879694",
  api_secret: process.env.CLOUDINARY_SECRET
})

// MULTER CLOUDINARY STORAGE
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "cybersec-nexus-reports",
    resource_type: "raw",
    allowed_formats: ["pdf", "txt", "doc", "docx", "png", "jpg", "jpeg"],
    public_id: (req, file) => Date.now() + "-" + file.originalname.replace(/\s/g, "_")
  }
})

const upload = multer({ storage })

// UPLOAD REPORT
router.post("/reports", upload.single("file"), async (req, res) => {
  try {
    const { title, uploaded_by } = req.body
    const filename = req.file.originalname
    const fileurl = req.file.path

    await db.query(
      "INSERT INTO reports (title, filename, fileurl, uploaded_by) VALUES ($1, $2, $3, $4)",
      [title, filename, fileurl, uploaded_by]
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

// GET ALL REPORTS (admin - analyst portal)
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