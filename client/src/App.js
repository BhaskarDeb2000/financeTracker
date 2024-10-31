import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [date, setDate] = useState("");
  const [editing, setEditing] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState({});
  const [viewBy, setViewBy] = useState("category");

  const categories = [
    { id: 1, name: "Food" },
    { id: 2, name: "Transportation" },
    { id: 3, name: "Entertainment" },
    { id: 4, name: "Shopping" },
    { id: 5, name: "Rent" },
    { id: 6, name: "Utilities" },
  ];

  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await axios.get("http://localhost:5001/transactions");
      setTransactions(response.data);
    };
    fetchTransactions();
  }, []);

  const addTransaction = async () => {
    let finalCategory = category !== "other" ? category : customCategory;
    await axios.post("http://localhost:5001/transactions", {
      description,
      amount,
      category: finalCategory,
      date,
    });
    setDescription("");
    setAmount("");
    setCategory("");
    setCustomCategory("");
    setDate("");

    // Refresh transactions
    const response = await axios.get("http://localhost:5001/transactions");
    setTransactions(response.data);
  };

  const updateTransaction = async () => {
    let finalCategory = category !== "other" ? category : customCategory;
    await axios.put(
      `http://localhost:5001/transactions/${currentTransaction.id}`,
      {
        description,
        amount,
        category: finalCategory,
        date,
      }
    );
    setEditing(false);
    setDescription("");
    setAmount("");
    setCategory("");
    setCustomCategory("");
    setDate("");

    // Refresh transactions
    const response = await axios.get("http://localhost:5001/transactions");
    setTransactions(response.data);
  };

  const handleEdit = (transaction) => {
    setEditing(true);
    setCurrentTransaction(transaction);
    setDescription(transaction.description);
    setAmount(transaction.amount);
    setCategory(transaction.category);
    setDate(transaction.date);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5001/transactions/${id}`);
    // Refresh transactions
    const response = await axios.get("http://localhost:5001/transactions");
    setTransactions(response.data);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    if (e.target.value === "other") {
      setCustomCategory("");
    }
  };

  // Helper function to capitalize the first letter of each word
  const capitalize = (str) => {
    return str.replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  // Calculate total spendings and categorize transactions
  const totalSpendings = transactions.reduce((total, transaction) => {
    return total + parseFloat(transaction.amount);
  }, 0);

  const categorizeTransactionsByCategory = transactions.reduce(
    (categories, transaction) => {
      const category = transaction.category.toLowerCase();
      if (!categories[category]) {
        categories[category] = 0;
      }
      categories[category] += parseFloat(transaction.amount);
      return categories;
    },
    {}
  );

  const categorizeTransactionsByMonth = transactions.reduce(
    (months, transaction) => {
      const date = new Date(transaction.date);
      const monthYear = `${date.toLocaleString("default", {
        month: "long",
      })} ${date.getFullYear()}`;
      if (!months[monthYear]) {
        months[monthYear] = 0;
      }
      months[monthYear] += parseFloat(transaction.amount);
      return months;
    },
    {}
  );

  return (
    <div className="App">
      <h1>Personal Finance Tracker</h1>
      <div className="form-and-stats">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (editing) {
              updateTransaction();
            } else {
              addTransaction();
            }
          }}
        >
          <input
            type="text"
            placeholder="Item Name"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Total price"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <div className="select-wrapper">
            <select
              value={category}
              onChange={handleCategoryChange}
              className="stylish-select"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
              <option value="other">Other</option>
            </select>
          </div>
          {category === "other" && (
            <input
              type="text"
              placeholder="Enter Category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="custom-category-input"
            />
          )}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <button type="submit">
            {editing ? "Update" : "Add"} Transaction
          </button>
        </form>
        <div className="stats">
          <div className="total-spendings">
            <h2>Total Spendings: ${totalSpendings.toFixed(2)}</h2>
            <div className="view-by-buttons">
              <button onClick={() => setViewBy("category")}>
                View by Category
              </button>
              <button onClick={() => setViewBy("month")}>View by Month</button>
            </div>
          </div>
          {viewBy === "category" && (
            <div>
              <h3>Spendings by Category:</h3>
              <ul>
                {Object.keys(categorizeTransactionsByCategory).map(
                  (category) => (
                    <li key={category}>
                      {capitalize(category)}: $
                      {categorizeTransactionsByCategory[category].toFixed(2)}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
          {viewBy === "month" && (
            <div>
              <h3>Spendings by Month:</h3>
              <ul>
                {Object.keys(categorizeTransactionsByMonth).map((month) => (
                  <li key={month}>
                    {month}: ${categorizeTransactionsByMonth[month].toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            <div>
              <strong>{transaction.description}</strong> - ${transaction.amount}
            </div>
            <span>{transaction.date}</span>
            <button
              style={{ padding: "5px", fontSize: "12px", maxWidth: "50px" }}
              onClick={() => handleEdit(transaction)}
            >
              Edit
            </button>
            <button
              style={{
                padding: "5px",
                fontSize: "12px",
                backgroundColor: "red",
                color: "white",
                maxWidth: "50px",
              }}
              onClick={() => handleDelete(transaction.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div className="footer">© 2024 Finance Tracker. All rights reserved.</div>
    </div>
  );
}

export default App;
