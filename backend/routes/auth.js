import express from "express"
import bcrypt from "bcryptjs"
import nodemailer from "nodemailer"
import db from "../db.js"

const router = express.Router()

// EMAIL TRANSPORTER
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shravanihendr@gmail.com",
    pass: "gpbh ylwv bccr mcgc"
  }
})

// SEND ADMIN ALERT EMAIL
const sendAdminAlert = (username, email) => {
  const mailOptions = {
    from: "CyberSec Nexus <shravanihendr@gmail.com>",
    to: "shravanihendr@gmail.com, revadeogade@gmail.com, tejaswinidaine@gmail.com",
    subject: "🚨 New User Registered — CyberSec Nexus",
    html: `
      <div style="font-family: Arial, sans-serif; background: #0a0a0a; color: #fff; padding: 30px; border-radius: 10px;">
        <h2 style="color: #00ff46;">🛡️ CyberSec Nexus</h2>
        <h3 style="color: #fff;">New User Registration Alert</h3>
        <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; border-left: 4px solid #00ff46; margin: 20px 0;">
          <p style="margin: 8px 0;"><strong style="color: #00ff46;">Username:</strong> ${username}</p>
          <p style="margin: 8px 0;"><strong style="color: #00ff46;">Email:</strong> ${email}</p>
          <p style="margin: 8px 0;"><strong style="color: #00ff46;">Time:</strong> ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
          <p style="margin: 8px 0;"><strong style="color: #00ff46;">Role:</strong> User</p>
        </div>
        <p style="color: #888; font-size: 12px;">
          Please verify if this user is legitimate. If suspicious, take appropriate action.
        </p>
        <p style="color: #555; font-size: 11px;">— CyberSec Nexus Admin System</p>
      </div>
    `
  }
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("Email Error:", err)
    } else {
      console.log("Admin alert sent:", info.response)
    }
  })
}

// REGISTER
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All Fields Required" })
  }
  try {
    const checkSql = "SELECT * FROM users WHERE email = ?"
    db.query(checkSql, [email], async (err, result) => {
      if (err) {
        console.log(err)
        return res.status(500).json({ message: "Database Error" })
      }
      if (result.length > 0) {
        return res.status(400).json({ message: "Email Already Registered" })
      }
      try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const role = "user"
        const sql =
          "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)"
        db.query(sql, [username, email, hashedPassword, role], (err, insertResult) => {
          if (err) {
            console.log(err)
            return res.status(500).json({ message: "Database Error" })
          }
          // SEND ADMIN ALERT
          sendAdminAlert(username, email)
          return res.json({ message: "User Registered Successfully" })
        })
      } catch (hashError) {
        console.log(hashError)
        return res.status(500).json({ message: "Server Error" })
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Server Error" })
  }
})

// LOGIN
router.post("/login", (req, res) => {

  const { email, password } = req.body

  const sql = "SELECT * FROM users WHERE email = ?"

  // PostgreSQL syntax: result.rows holds the data array
  db.query(sql, [email], async (err, result) => {

    if (err) {
      console.log(err) // This prints any hidden errors to your Render backend logs
      return res.status(500).json("Database Error")
    }

    // FIX 1: Check result.rows.length instead of result.length
    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json("User Not Found")
    }

    // FIX 2: Extract the user object from result.rows array
    const user = result.rows[0]

    const isMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!isMatch) {
      return res.status(401).json("Invalid Credentials")
    }

    return res.json("Login Successful")
  })
})

export default router
