import mysql from "mysql2"

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Hendre@123",
  database: "cybersec_nexus"
})

db.connect((err) => {
  if (err) {
    console.log("Database Error")
  } else {
    console.log("MySQL Connected")
  }
})

export default db