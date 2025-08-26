import React, { useEffect, useState, useCallback } from "react";
import { fetchTransactions, searchTransactions } from "./api";
import TransactionTable from "./components/TransactionTable";
import Pagination from "./components/Pagination";
import SearchBar from "./components/SearchBar";
import "./App.css";

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [currentAccountId, setCurrentAccountId] = useState(null);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [currentSearchQuery, setCurrentSearchQuery] = useState("");

  const itemsPerPage = 10;

  // Load transactions with pagination
  const loadTransactions = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchTransactions(page, itemsPerPage);



      setTransactions(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotalTransactions(data.total || 0);
      setCurrentAccountId(data.currentUserAccountId);
      setCurrentPage(page);
    } catch (err) {
      console.error("Failed to load transactions:", err);
      setError(err.message || "Failed to load transactions");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]);

  // Search transactions
  const handleSearch = useCallback(async (query, page = 1) => {
    if (!query.trim()) {
      // If empty query, switch back to normal mode
      setIsSearchMode(false);
      setCurrentSearchQuery("");
      await loadTransactions(1);
      return;
    }

    try {
      setSearching(true);
      setError("");
      setIsSearchMode(true);
      setCurrentSearchQuery(query);

      const data = await searchTransactions(query, page, itemsPerPage);

      setTransactions(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotalTransactions(data.total || 0);
      setCurrentPage(page);
    } catch (err) {
      console.error("Failed to search transactions:", err);
      setError(err.message || "Failed to search transactions");
      setTransactions([]);
    } finally {
      setSearching(false);
    }
  }, [itemsPerPage, loadTransactions]);

  // Handle page change
  const handlePageChange = useCallback((page) => {
    console.log('handlePageChange called with page:', page);
    console.log('isSearchMode:', isSearchMode, 'currentSearchQuery:', currentSearchQuery);

    if (isSearchMode && currentSearchQuery) {
      console.log('Calling handleSearch for page:', page);
      handleSearch(currentSearchQuery, page);
    } else {
      console.log('Calling loadTransactions for page:', page);
      loadTransactions(page);
    }
  }, [isSearchMode, currentSearchQuery, handleSearch, loadTransactions]);

  // Initial load
  useEffect(() => {
    loadTransactions(1);
  }, [loadTransactions]);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          marginBottom: '32px',
          textAlign: 'center',
          padding: '24px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          color: 'white',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{
            margin: '0 0 8px 0',
            fontSize: '32px',
            fontWeight: '700',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            YaYa Wallet Transaction Dashboard
          </h1>
          <p style={{
            margin: 0,
            fontSize: '16px',
            opacity: 0.9,
            fontWeight: '400'
          }}>
            Monitor and search your transaction history
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} isSearching={searching} />

        {/* Status Messages */}
        {error && (
          <div style={{
            padding: '16px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#dc2626',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {isSearchMode && currentSearchQuery && (
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            color: '#1d4ed8',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            Search results for: <strong>"{currentSearchQuery}"</strong>
            {totalTransactions > 0 && ` (${totalTransactions} results found)`}
          </div>
        )}

        {/* Transaction Table */}
        <TransactionTable
          transactions={transactions}
          currentAccountId={currentAccountId}
          isLoading={loading || searching}
        />

        {/* Pagination */}
        {!loading && !searching && transactions.length > 0 && (
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            total={totalTransactions}
            limit={itemsPerPage}
            onChange={handlePageChange}
          />
        )}

        {/* Footer */}
        <div style={{
          marginTop: '40px',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '14px',
          padding: '20px'
        }}>
          <p>YaYa Wallet Transaction Dashboard - Built with React.js and Node.js</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px' }}>
            Secure API integration with proper authentication
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
