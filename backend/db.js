import mysql from "mysql2/promise"

let db

try {
  db = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: false
    },
    connectTimeout: 10000
  })

  console.log("MySQL Connected")
} catch (err) {
  console.log("Database Error:", err)
}

export default db