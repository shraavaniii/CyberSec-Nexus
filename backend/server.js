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

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})