import React, { useState } from "react";

const SearchBar = ({ onSearch, isSearching }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm.trim());
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div style={{ marginBottom: '20px', padding: '16px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by sender, receiver, cause, or transaction ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: '12px 16px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
          onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
        />
        <button
          type="submit"
          disabled={isSearching}
          style={{
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: isSearching ? 'not-allowed' : 'pointer',
            opacity: isSearching ? 0.6 : 1,
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => !isSearching && (e.target.style.backgroundColor = '#2563eb')}
          onMouseOut={(e) => !isSearching && (e.target.style.backgroundColor = '#3b82f6')}
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              padding: '12px 16px',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#4b5563'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#6b7280'}
          >
            Clear
          </button>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
