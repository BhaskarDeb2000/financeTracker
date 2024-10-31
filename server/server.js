// server/server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./database");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// CRUD Operations
app.get("/transactions", (req, res) => {
  db.all("SELECT * FROM transactions", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.put("/transactions/:id", (req, res) => {
  const id = req.params.id;
  const { description, amount, category, date } = req.body;

  db.run(
    `UPDATE transactions SET description = ?, amount = ?, category = ?, date = ? WHERE id = ?`,
    [description, amount, category, date, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: "Transaction updated successfully" });
    }
  );
});

app.delete("/transactions/:id", (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM transactions WHERE id = ?`, [id], function (err) {
    if (err) {
      console.error("Error deleting transaction:", err);
      res.status(500).json({ error: "Failed to delete transaction" });
      return;
    }
    res.json({ message: "Transaction deleted successfully" });
  });
});

app.post("/transactions", (req, res) => {
  const { description, amount, category, date } = req.body;
  db.run(
    `INSERT INTO transactions (description, amount, category, date) VALUES (?, ?, ?, ?)`,
    [description, amount, category, date],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID });
    }
  );
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
