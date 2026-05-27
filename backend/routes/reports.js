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
  // FIX 1: Changed to match standard naming convention CLOUDINARY_API_SECRET
  api_secret: process.env.CLOUDINARY_API_SECRET 
})

// MULTER CLOUDINARY STORAGE
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // FIX 2: Dynamic function required by Cloudinary for 'raw' files (PDFs, docs)
    return {
      folder: "cybersec-nexus-reports",
      resource_type: "raw", 
      // FIX 3: Do NOT use allowed_formats with resource_type: "raw". It crashes Cloudinary.
      public_id: Date.now() + "-" + file.originalname.replace(/\s/g, "_")
    };
  }
})

const upload = multer({ storage })

// UPLOAD REPORT
router.post("/reports", upload.single("file"), async (req, res) => {
  try {
    // FIX 4: Check if file actually reached the server
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" })
    }

    const { title } = req.body
    const filename = req.file.originalname
    const fileurl = req.file.path

    await db.query(
      "INSERT INTO reports (title, filename, fileurl) VALUES ($1, $2, $3)",
      [title, filename, fileurl]
    )

    return res.json({ message: "Report Uploaded Successfully", url: fileurl })
  } catch (error) {
    console.error("Upload Error:", error)
    return res.status(500).json({ message: "Upload Failed", error: error.message })
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