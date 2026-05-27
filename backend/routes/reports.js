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
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// STORAGE
const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {

    return {
      folder: "cybersec-nexus-reports",

      // AUTO DETECT FILE TYPE
      resource_type: "auto",

      public_id:
        Date.now() +
        "-" +
        file.originalname.replace(/\s/g, "_")
    }
  }
})

// MULTER
const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024
  }
})

// UPLOAD REPORT
router.post(
  "/reports",
  upload.single("file"),
  async (req, res) => {

    try {

      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded"
        })
      }

      const { title } = req.body

      const filename = req.file.originalname

      const fileurl = req.file.path

      await db.query(
        `
        INSERT INTO reports
        (title, filename, fileurl)
        VALUES ($1, $2, $3)
        `,
        [title, filename, fileurl]
      )

      return res.json({
        message: "Report Uploaded Successfully"
      })

    } catch (error) {

      console.error("UPLOAD ERROR:")
      console.error(error)

      return res.status(500).json({
        message: error.message || "Upload failed"
      })
    }
  }
)

// GET REPORTS
router.get("/reports", async (req, res) => {

  try {

    const result = await db.query(
      `
      SELECT *
      FROM reports
      ORDER BY id DESC
      `
    )

    return res.json(result.rows)

  } catch (error) {

    console.error("FETCH REPORTS ERROR:")
    console.error(error)

    return res.status(500).json({
      message: "Failed to fetch reports"
    })
  }
})

export default router