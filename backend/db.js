import pkg from "pg"
const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

pool.connect()
  .then(() => console.log("PostgreSQL Connected"))
  .catch(err => console.log("Database Error:", err))

export default pool