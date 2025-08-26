// Simple test script to verify YaYa Wallet API integration

import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env' });

const API_KEY = process.env.YAYA_API_KEY;
const API_SECRET = process.env.YAYA_API_SECRET;
const BASE_URL = process.env.YAYA_BASE_URL || "https://sandbox.yayawallet.com";

console.log('🧪 Testing YaYa Wallet API Integration...\n');

// Function to sign requests
function signRequest(method, endpoint, body = "") {
  const timestamp = Date.now().toString();
  const prehash = timestamp + method.toUpperCase() + endpoint + body;

  const hmac = crypto.createHmac("sha256", API_SECRET);
  hmac.update(prehash);
  const signature = hmac.digest("base64");

  return { timestamp, signature };
}

// Test function
async function testAPI() {
  console.log('📋 Configuration:');
  console.log(`API Key: ${API_KEY ? 'Configured ✅' : 'Missing ❌'}`);
  console.log(`API Secret: ${API_SECRET ? 'Configured ✅' : 'Missing ❌'}`);
  console.log(`Base URL: ${BASE_URL}\n`);

  if (!API_KEY || !API_SECRET) {
    console.log('❌ Missing API credentials. Please check your .env file.');
    return;
  }

  // Test 1: Fetch transactions
  console.log('🔍 Test 1: Fetching transactions...');
  try {
    const endpoint = "/api/en/transaction/find-by-user";
    const method = "GET";
    const { timestamp, signature } = signRequest(method, endpoint);

    const response = await axios.get(BASE_URL + endpoint, {
      headers: {
        "Content-Type": "application/json",
        "YAYA-API-KEY": API_KEY,
        "YAYA-API-TIMESTAMP": timestamp,
        "YAYA-API-SIGN": signature,
      },
      params: {
        page: 1,
        limit: 5
      }
    });

    console.log('✅ Transactions fetched successfully!');
    console.log(`📊 Response status: ${response.status}`);
    console.log(`📦 Data type: ${typeof response.data}`);
    
    if (Array.isArray(response.data)) {
      console.log(`📋 Number of transactions: ${response.data.length}`);
      if (response.data.length > 0) {
        console.log('📄 Sample transaction fields:', Object.keys(response.data[0]));
      }
    } else if (response.data && typeof response.data === 'object') {
      console.log('📄 Response structure:', Object.keys(response.data));
    }
    
  } catch (error) {
    console.log('❌ Failed to fetch transactions');
    console.log('Error:', error.response?.data || error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: Search transactions
  console.log('🔍 Test 2: Searching transactions...');
  try {
    const endpoint = "/api/en/transaction/search";
    const method = "POST";
    const searchBody = { query: "test" };
    const bodyString = JSON.stringify(searchBody);
    const { timestamp, signature } = signRequest(method, endpoint, bodyString);

    const response = await axios.post(BASE_URL + endpoint, searchBody, {
      headers: {
        "Content-Type": "application/json",
        "YAYA-API-KEY": API_KEY,
        "YAYA-API-TIMESTAMP": timestamp,
        "YAYA-API-SIGN": signature,
      }
    });

    console.log('✅ Search completed successfully!');
    console.log(`📊 Response status: ${response.status}`);
    console.log(`📦 Data type: ${typeof response.data}`);
    
    if (Array.isArray(response.data)) {
      console.log(`🔍 Search results: ${response.data.length} transactions found`);
    } else if (response.data && typeof response.data === 'object') {
      console.log('📄 Response structure:', Object.keys(response.data));
    }
    
  } catch (error) {
    console.log('❌ Failed to search transactions');
    console.log('Error:', error.response?.data || error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');
  console.log('🎉 API testing completed!');
  console.log('\n💡 Next steps:');
  console.log('1. Start the backend: cd backend && npm run dev');
  console.log('2. Start the frontend: cd frontend && npm start');
  console.log('3. Open http://localhost:3000 in your browser');
}

// Run the test
testAPI().catch(console.error);
