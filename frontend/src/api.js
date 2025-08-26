// api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export async function fetchTransactions(page = 1, limit = 10) {
  const res = await fetch(`${API_BASE_URL}/api/transactions?p=${page}&limit=${limit}`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to load transactions");
  }
  return res.json();
}

export async function searchTransactions(query, page = 1, limit = 10) {
  const res = await fetch(`${API_BASE_URL}/api/transactions/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, p: page, limit }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to search transactions");
  }
  return res.json();
}
