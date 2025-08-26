import React from 'react';

export default function Pagination({ page, totalPages, onChange, total, limit }) {

  const startItem = ((page - 1) * limit) + 1;
  const endItem = Math.min(page * limit, total);

  const buttonStyle = {
    padding: '8px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '6px',
    backgroundColor: 'white',
    color: '#374151',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#f9fafb',
    color: '#9ca3af',
    cursor: 'not-allowed',
    borderColor: '#f3f4f6'
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#3b82f6',
    color: 'white',
    borderColor: '#3b82f6'
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, page - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      alignItems: 'center',
      marginTop: '20px',
      padding: '16px',
      background: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
    }}>
      {/* Results info */}
      <div style={{ fontSize: '14px', color: '#6b7280' }}>
        Showing {startItem} to {endItem} of {total} transactions
      </div>

      {/* Pagination controls */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          onClick={() => {
            console.log('Previous button clicked, current page:', page);
            onChange(page - 1);
          }}
          disabled={page <= 1}
          style={page <= 1 ? disabledButtonStyle : buttonStyle}
          onMouseOver={(e) => page > 1 && (e.target.style.backgroundColor = '#f3f4f6')}
          onMouseOut={(e) => page > 1 && (e.target.style.backgroundColor = 'white')}
        >
          Previous
        </button>

        {getPageNumbers().map(pageNum => (
          <button
            key={pageNum}
            onClick={() => {
              console.log('Page number clicked:', pageNum, 'current page:', page);
              onChange(pageNum);
            }}
            style={pageNum === page ? activeButtonStyle : buttonStyle}
            onMouseOver={(e) => pageNum !== page && (e.target.style.backgroundColor = '#f3f4f6')}
            onMouseOut={(e) => pageNum !== page && (e.target.style.backgroundColor = 'white')}
          >
            {pageNum}
          </button>
        ))}

        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          style={page >= totalPages ? disabledButtonStyle : buttonStyle}
          onMouseOver={(e) => page < totalPages && (e.target.style.backgroundColor = '#f3f4f6')}
          onMouseOut={(e) => page < totalPages && (e.target.style.backgroundColor = 'white')}
        >
          Next
        </button>
      </div>
    </div>
  );
}
