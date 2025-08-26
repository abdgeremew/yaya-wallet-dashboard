# YaYa Wallet Transaction Dashboard

A full-stack web application for monitoring and searching YaYa Wallet transactions. Built with React.js frontend and Node.js backend with secure API integration.

## Features

### Core Requirements ✅
- **Transaction List**: Displays transactions in a tabular format with all required fields
- **Pagination**: Navigate through transactions using "p" query parameter with proper page isolation
- **Search Functionality**: Search by sender account name, receiver account name, cause, or transaction ID
- **Transaction Direction**: Visual indicators for incoming/outgoing transactions
- **Responsive Design**: Adapts to different screen sizes
- **Security**: API credentials are securely stored and handled

## Technical Architecture

### Pagination Implementation
**Approach**: Hybrid pagination system that ensures complete data access and optimal user experience.

**Implementation Strategy**:
1. **Complete Data Retrieval**: Fetch all available transactions from YaYa API across multiple pages
2. **Client-Side Pagination**: Implement efficient pagination logic on the complete dataset
3. **Consistent User Experience**: Ensure smooth navigation with proper page isolation

### Backend Implementation

#### Data Aggregation (`backend/server.js`)
```javascript
// Fetch all transactions from YaYa API
async function fetchAllTransactions() {
  let allTransactions = [];
  let currentPage = 1;
  let hasMorePages = true;

  while (hasMorePages) {
    const data = await makeYaYaRequest("GET", endpoint, null, { page: currentPage });
    allTransactions = allTransactions.concat(data.data || []);
    hasMorePages = currentPage < (data.lastPage || 1) && data.data?.length > 0;
    currentPage++;
    if (currentPage > 10) break; // Safety check
  }

  return allTransactions;
}

// Implement pagination on complete dataset
const startIndex = (page - 1) * pageLimit;
const endIndex = startIndex + pageLimit;
const paginatedTransactions = allTransactions.slice(startIndex, endIndex);
```

#### Frontend Components
- React-based pagination components with smooth navigation
- Proper `totalPages` calculation based on actual transaction count
- Responsive design with mobile-friendly controls

### Transaction Fields Displayed
- Transaction ID
- Sender
- Receiver  
- Amount (formatted with currency)
- Currency
- Cause/Description
- Created At (formatted date/time)
- Direction (Incoming/Outgoing with visual indicators)

### Transaction Direction Logic
- **Incoming**: When the receiver is the current user OR when sender equals receiver (top-up)
- **Outgoing**: When the sender is the current user and receiver is different
- **Visual Indicators**: Green badge for incoming, red badge for outgoing transactions

## Technology Stack

### Frontend
- **React.js 19.1.1**: Modern UI framework
- **CSS3**: Custom responsive styling
- **Axios**: HTTP client for API calls

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **Axios**: HTTP client for YaYa Wallet API
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **crypto**: HMAC signature generation for API authentication

## Project Structure

```
yaya-wallet-dashboard/
├── backend/
│   ├── server.js          # Main server file with API routes
│   ├── package.json       # Backend dependencies
│   └── .env              # Environment variables (API credentials)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TransactionTable.js  # Transaction display component
│   │   │   ├── Pagination.js        # Pagination component
│   │   │   └── SearchBar.js         # Search functionality
│   │   ├── App.js         # Main application component
│   │   ├── App.css        # Application styles
│   │   └── api.js         # API communication functions
│   └── package.json       # Frontend dependencies
└── README.md             # This file
```

## API Integration

### YaYa Wallet API Endpoints Used
1. **GET /api/en/transaction/find-by-user**: Fetch user transactions with pagination
2. **POST /api/en/transaction/search**: Search transactions by query

### Authentication
- Uses HMAC SHA256 signature authentication as per YaYa Wallet documentation
- Secure credential storage in environment variables
- Proper request signing with timestamp and signature headers

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment variables are already configured in `.env` with test credentials

4. Start the backend server:
   ```bash
   npm run dev
   ```
   Server will run on http://localhost:5000

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   Application will open at http://localhost:3000

## Usage

### Viewing Transactions
1. Open the application in your browser
2. Transactions are automatically loaded on page load
3. Use pagination controls to navigate through pages

### Searching Transactions
1. Enter search terms in the search bar
2. Search supports:
   - Sender account names
   - Receiver account names  
   - Transaction causes/descriptions
   - Transaction IDs
3. Click "Search" or press Enter
4. Use "Clear" to return to normal view

### Pagination
- Navigate using Previous/Next buttons
- Click page numbers for direct navigation
- Shows current page info and total results

## Security Considerations

### API Security
- API credentials stored in environment variables
- HMAC SHA256 signature authentication
- Request signing with timestamp to prevent replay attacks
- No sensitive data exposed in frontend code

### Data Protection
- No user authentication implemented (as per requirements)
- API proxy pattern to hide credentials from frontend
- CORS properly configured for cross-origin requests

## Testing Approach

### API Integration Testing

#### 1. Backend Endpoint Testing
```bash
# Test pagination endpoints
curl "http://localhost:5000/api/transactions?p=1&limit=10"
curl "http://localhost:5000/api/transactions?p=2&limit=10"
curl "http://localhost:5000/api/transactions?p=3&limit=10"

# Test search functionality
curl -X POST "http://localhost:5000/api/transactions/search" -H "Content-Type: application/json" -d '{"query":"test"}'
```

#### 2. YaYa API Integration
```bash
# Test YaYa API connectivity
node test-api.js

# Verify API authentication and data retrieval
```

#### 3. Pagination Validation
```bash
# Verify pagination functionality
powershell -Command "
  Write-Host 'Page 1:'; (Invoke-RestMethod -Uri 'http://localhost:5000/api/transactions?p=1&limit=10').data.Count;
  Write-Host 'Page 2:'; (Invoke-RestMethod -Uri 'http://localhost:5000/api/transactions?p=2&limit=10').data.Count;
  Write-Host 'Page 3:'; (Invoke-RestMethod -Uri 'http://localhost:5000/api/transactions?p=3&limit=10').data.Count
"

# Expected Output: 10, 10, 10 (transactions per page)
```

### Comprehensive Testing Strategy

#### Manual Testing Approach
1. **Transaction Loading**: Verify transactions load correctly on page load
2. **Pagination Navigation**: Test page navigation and transaction display
3. **Search Functionality**: Test various search terms and edge cases
4. **Responsive Design**: Test on different screen sizes
5. **Error Handling**: Test with invalid API responses
6. **Direction Logic**: Verify incoming/outgoing indicators are correct

#### API Integration Testing
```bash
# Test YaYa API connectivity
node test-api.js

# Test backend endpoints
curl "http://localhost:5000/api/transactions"
curl -X POST "http://localhost:5000/api/transactions/search" -H "Content-Type: application/json" -d '{"query":"test"}'

# Test pagination metadata
curl "http://localhost:5000/api/transactions?p=1&limit=5" | jq '.totalPages'
```

#### Frontend Testing
1. **Browser Console**: Monitor for JavaScript errors and API responses
2. **Network Tab**: Verify correct API calls and response data
3. **Responsive Testing**: Test on mobile, tablet, and desktop viewports
4. **User Interaction**: Test all buttons, search, and navigation elements

### Test Cases Covered
- ✅ Empty search results
- ✅ Invalid search queries
- ✅ Network errors
- ✅ Large transaction lists
- ✅ Mobile responsiveness
- ✅ API authentication failures
- ✅ Pagination functionality and navigation
- ✅ Total page calculation accuracy
- ✅ Edge cases (last page with fewer items)

## Problem-Solving Approach

### 1. API Integration Challenge
**Problem**: YaYa Wallet API requires HMAC SHA256 authentication
**Solution**: Implemented proper request signing in backend with crypto module

### 2. Security Requirements
**Problem**: Keep API credentials secure
**Solution**: Backend proxy pattern with environment variables

### 3. Responsive Design
**Problem**: Transaction table needs to work on mobile
**Solution**: Horizontal scrolling for table with responsive pagination

### 4. Search Implementation
**Problem**: API search endpoint returns different structure than list endpoint
**Solution**: Unified data handling with fallback field mapping

## Assumptions Made

### API Behavior Assumptions
1. **YaYa API Pagination**: The API uses server-side pagination with `lastPage` indicating total pages (not a boolean)
2. **Data Consistency**: Transaction data structure remains consistent across all API pages
3. **API Reliability**: The YaYa API is stable enough for multiple sequential requests during data fetching
4. **Rate Limiting**: No aggressive rate limiting that would prevent fetching multiple pages in sequence

### Application Assumptions
1. **Current User Account**: Used environment variable for demo purposes
2. **Transaction Structure**: Handled multiple possible field names for robustness
3. **Currency Display**: Defaulted to ETB (Ethiopian Birr) when not specified
4. **Date Formatting**: Used locale-aware formatting for better UX
5. **Error Handling**: Graceful degradation with user-friendly messages
6. **Performance**: Fetching all transactions on each request is acceptable for the current dataset size
7. **Data Freshness**: Real-time updates are not required; data can be fetched per request

### Technical Assumptions
1. **Browser Compatibility**: Modern browsers with ES6+ support
2. **Network Stability**: Reliable internet connection for API calls
3. **Memory Constraints**: Client can handle the complete transaction dataset in memory
4. **Concurrent Users**: Single-user application (no concurrent access considerations)

## API Credentials

The application uses the provided test credentials:
- API Key: `key-test_13817e87-33a9-4756-82e0-e6ac74be5f77`
- API Secret: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcGlfa2V5Ijoia2V5LXRlc3RfMTM4MTdlODctMzNhOS00NzU2LTgyZTAtZTZhYzc0YmU1Zjc3Iiwic2VjcmV0IjoiY2E5ZjJhMGM5ZGI1ZmRjZWUxMTlhNjNiMzNkMzVlMWQ4YTVkNGZiYyJ9.HesEEFWkY55B8JhxSJT4VPJTXZ-4a18wWDRacTcimNw`
- Base URL: `https://sandbox.yayawallet.com`

## Solution Summary


### Performance Characteristics
- **Data Fetching**: Fetches all YaYa API pages on each request (2 API calls for current dataset)
- **Memory Usage**: Holds complete transaction dataset in backend memory temporarily
- **Response Time**: ~2-3 seconds for initial load (includes multiple API calls)
- **Scalability**: Suitable for current dataset size; may need optimization for larger datasets

### Key Technical Decisions
1. **Hybrid Pagination**: Server-side data aggregation + client-side pagination
2. **Complete Data Fetching**: Ensures data consistency and eliminates pagination gaps
3. **Safety Mechanisms**: Loop limits and error handling prevent infinite API calls
4. **Backward Compatibility**: No frontend changes required; existing components work seamlessly


