import express from "express"
import bcrypt from "bcryptjs"
import db from "../db.js"

const router = express.Router()

// SEND ADMIN ALERT EMAIL VIA RESEND
const sendAdminAlert = async (username, email) => {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "CyberSec Nexus <onboarding@resend.dev>",
        to: ["shravanihendr@gmail.com"],
        subject: "🚨 New User Registered — CyberSec Nexus",
        html: `
          <div style="font-family: Arial, sans-serif; background: #0a0a0a; color: #fff; padding: 30px; border-radius: 10px;">
            <h2 style="color: #00c8ff;">🛡️ CyberSec Nexus</h2>
            <h3 style="color: #fff;">New User Registration Alert</h3>
            <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; border-left: 4px solid #00c8ff; margin: 20px 0;">
              <p style="margin: 8px 0;"><strong style="color: #00c8ff;">Username:</strong> ${username}</p>
              <p style="margin: 8px 0;"><strong style="color: #00c8ff;">Email:</strong> ${email}</p>
              <p style="margin: 8px 0;"><strong style="color: #00c8ff;">Time:</strong> ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
              <p style="margin: 8px 0;"><strong style="color: #00c8ff;">Role:</strong> User</p>
            </div>
            <p style="color: #888; font-size: 12px;">
              Please verify if this user is legitimate. If suspicious, take appropriate action.
            </p>
            <p style="color: #555; font-size: 11px;">— CyberSec Nexus Admin System</p>
          </div>
        `
      })
    })

    const data = await response.json()
    if (data.id) {
      console.log("Admin alert sent via Resend:", data.id)
    } else {
      console.log("Resend Error:", data)
    }
  } catch (error) {
    console.log("Email Error:", error)
  }
}

// REGISTER
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All Fields Required" })
  }
  try {
    const checkResult = await db.query(
      "SELECT * FROM users WHERE email = $1", [email]
    )
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: "Email Already Registered" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await db.query(
      "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)",
      [username, email, hashedPassword, "user"]
    )

    // SEND ADMIN ALERT
    sendAdminAlert(username, email)

    return res.json({ message: "User Registered Successfully" })

  } catch (error) {
    console.error("Register Error:", error)
    return res.status(500).json({ message: "Server Error" })
  }
})

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body
  try {
    const result = await db.query(
      "SELECT * FROM users WHERE email = $1", [email]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User Not Found" })
    }
    const user = result.rows[0]
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials" })
    }
    return res.json({
      message: "Login Successful",
      username: user.username,
      email: user.email,
      role: user.role
    })
  } catch (error) {
    console.error("Login Error:", error)
    return res.status(500).json({ message: "Database Error" })
  }
})

export default router