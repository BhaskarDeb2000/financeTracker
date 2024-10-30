// client/src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await axios.get("http://localhost:5001/transactions");
      setTransactions(response.data);
    };
    fetchTransactions();
  }, []);

  const addTransaction = async () => {
    await axios.post("http://localhost:5001/transactions", {
      description,
      amount,
      category,
      date,
    });
    setDescription("");
    setAmount("");
    setCategory("");
    setDate("");
    // Refresh transactions
    const response = await axios.get("http://localhost:5001/transactions");
    setTransactions(response.data);
  };

  return (
    <div className="App">
      <h1>Personal Finance Tracker</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTransaction();
        }}
      >
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button type="submit">Add Transaction</button>
      </form>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            <div>
              <strong>{transaction.description}</strong> - ${transaction.amount}
            </div>
            <span>{transaction.date}</span>
          </li>
        ))}
      </ul>
      <div className="footer">© 2024 Finance Tracker. All rights reserved.</div>
    </div>
  );
}

export default App;
