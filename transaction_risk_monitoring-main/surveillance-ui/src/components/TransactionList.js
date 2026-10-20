import React, { useEffect, useState } from "react";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [hints, setHints] = useState({});

  useEffect(() => {
    fetch("http://localhost:8080/api/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((err) => console.error(err));
  }, []);

  const getHint = async (transaction) => {
    try {
      setLoadingId(transaction.id);

      const response = await fetch(
        "http://localhost:8080/api/transactions/evaluate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transaction),
        }
      );

      const data = await response.json();

      setHints((prev) => ({
        ...prev,
        [transaction.id]: data.managerHint,
      }));
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Transactions</h2>

      {transactions.map((t) => (
        <div
          key={t.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "15px",
          }}
        >
          <p><b>From:</b> {t.fromAccount}</p>
          <p><b>To:</b> {t.toAccount}</p>
          <p><b>Amount:</b> {t.amount}</p>
          <p><b>Type:</b> {t.transactionType}</p>

          <button onClick={() => getHint(t)}>
            {loadingId === t.id ? "Loading..." : "Get Hint"}
          </button>

          {hints[t.id] && (
            <div style={{ marginTop: "10px" }}>
              <b>Manager Hint:</b>
              <p>{hints[t.id]}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
