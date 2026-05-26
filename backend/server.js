import express from "express"
import cors from "cors"
import db from "./db.js"
import authRoutes from "./routes/auth.js"
import threatRoutes from "./routes/threat.js"
import logRoutes from "./routes/logs.js"
import reportRoutes from "./routes/reports.js"
import auditRoutes from "./routes/audit.js"
import dashboardRoutes from "./routes/dashboard.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api", threatRoutes)
app.use("/api", logRoutes)
app.use("/api", reportRoutes)
app.use("/api", auditRoutes)
app.use("/api", dashboardRoutes)

app.get("/", (req, res) => {
  res.send("Backend Running")
})

await db.query(`
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role VARCHAR(20) DEFAULT 'user'
)
`)

await db.query(`
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  filename VARCHAR(255)
)
`)

await db.query(`
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  action VARCHAR(255),
  detail TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})