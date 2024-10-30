// server/database.js
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./finance.db", (err) => {
  if (err) {
    console.error("Database opening error: " + err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL
  )`);
});

module.exports = db;
