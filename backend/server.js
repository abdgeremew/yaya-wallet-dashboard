// backend/server.js
import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import crypto from "crypto";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = process.env.YAYA_API_KEY;
const API_SECRET = process.env.YAYA_API_SECRET;
const BASE_URL = process.env.YAYA_BASE_URL || "https://sandbox.yayawallet.com";
const CURRENT_USER_ACCOUNT_ID = process.env.CURRENT_USER_ACCOUNT_ID;

// Function to sign requests according to YaYa Wallet documentation
function signRequest(method, endpoint, body = "") {
  const timestamp = Date.now().toString();
  const prehash = timestamp + method.toUpperCase() + endpoint + body;

  const hmac = crypto.createHmac("sha256", API_SECRET);
  hmac.update(prehash);
  const signature = hmac.digest("base64");

  return { timestamp, signature };
}

// Helper function to make authenticated requests to YaYa API
async function makeYaYaRequest(method, endpoint, body = null, queryParams = {}) {
  try {
    const bodyString = body ? JSON.stringify(body) : "";
    const { timestamp, signature } = signRequest(method, endpoint, bodyString);

    const headers = {
      "Content-Type": "application/json",
      "YAYA-API-KEY": API_KEY,
      "YAYA-API-TIMESTAMP": timestamp,
      "YAYA-API-SIGN": signature,
    };

    const config = {
      method: method.toLowerCase(),
      url: BASE_URL + endpoint,
      headers,
      params: queryParams,
    };

    if (body) {
      config.data = body;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("YaYa API error:", error.response?.data || error.message);
    throw error;
  }
}

// API Routes

// Helper function to fetch all transactions from YaYa API
async function fetchAllTransactions() {
  const endpoint = "/api/en/transaction/find-by-user";
  let allTransactions = [];
  let currentPage = 1;
  let hasMorePages = true;
  let totalFromAPI = 0;
  let incomingSum = 0;
  let outgoingSum = 0;

  while (hasMorePages) {
    const data = await makeYaYaRequest("GET", endpoint, null, { page: currentPage });
    const pageTransactions = data.data || [];

    allTransactions = allTransactions.concat(pageTransactions);
    totalFromAPI = data.total || 0;
    incomingSum = data.incomingSum || 0;
    outgoingSum = data.outgoingSum || 0;

    // Check if there are more pages
    // lastPage appears to be the total number of pages, not a boolean
    hasMorePages = currentPage < (data.lastPage || 1) && pageTransactions.length > 0;
    currentPage++;

    // Safety check to prevent infinite loops
    if (currentPage > 10) {
      break;
    }
  }

  return {
    data: allTransactions,
    total: totalFromAPI,
    incomingSum,
    outgoingSum
  };
}

// Get transactions for current user with pagination
app.get("/api/transactions", async (req, res) => {
  try {
    const { p = 1, limit = 10 } = req.query;

    // Fetch all transactions from YaYa API across all pages
    const { data: allTransactions, total: totalFromAPI, incomingSum, outgoingSum } = await fetchAllTransactions();

    // Implement client-side pagination
    const page = parseInt(p);
    const pageLimit = parseInt(limit);
    const startIndex = (page - 1) * pageLimit;
    const endIndex = startIndex + pageLimit;
    const paginatedTransactions = allTransactions.slice(startIndex, endIndex);

    // Calculate pagination metadata using actual fetched data
    const total = allTransactions.length;
    const totalPages = Math.ceil(total / pageLimit);

    res.json({
      data: paginatedTransactions,
      total: total,
      page: page,
      limit: pageLimit,
      totalPages: totalPages,
      lastPage: page >= totalPages,
      perPage: pageLimit,
      incomingSum: incomingSum,
      outgoingSum: outgoingSum,
      currentUserAccountId: CURRENT_USER_ACCOUNT_ID
    });
  } catch (error) {
    console.error("Failed to fetch transactions:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to fetch transactions",
      details: error.response?.data || error.message
    });
  }
});

// Search transactions
app.post("/api/transactions/search", async (req, res) => {
  try {
    const { query, p = 1, limit = 10 } = req.body;

    const endpoint = "/api/en/transaction/search";
    const searchBody = { query };
    const response = await makeYaYaRequest("POST", endpoint, searchBody);
    const transactions = response.data || [];

    // Debug logging
    console.log(`🔍 Search query: "${query}"`);
    console.log(`📊 Total results from YaYa API: ${transactions.length}`);
    console.log(`📄 Requested page: ${p}, limit: ${limit}`);

    // Add pagination logic
    const startIndex = (p - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedResults = transactions.slice(startIndex, endIndex);

    console.log(`📋 Returning ${paginatedResults.length} results for page ${p}`);

    res.json({
      data: paginatedResults,
      total: transactions.length,
      page: parseInt(p),
      limit: parseInt(limit),
      totalPages: Math.ceil(transactions.length / limit),
      currentUserAccountId: CURRENT_USER_ACCOUNT_ID
    });
  } catch (error) {
    console.error("Failed to search transactions:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to search transactions",
      details: error.response?.data || error.message
    });
  }
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "YaYa Wallet Transaction Dashboard API",
    status: "running",
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 YaYa Wallet Dashboard API running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 API Key: ${API_KEY ? 'Configured' : 'Missing'}`);
});
