import React from 'react';

function formatAmount(amount, currency) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency || 'ETB',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(amount) || 0);
  } catch (error) {
    return `${currency || 'ETB'} ${Number(amount) || 0}`;
  }
}

function formatDate(dateInput) {
  try {
    let date;

    // Handle Unix timestamp (seconds)
    if (typeof dateInput === 'number') {
      date = new Date(dateInput * 1000); // Convert seconds to milliseconds
    } else if (typeof dateInput === 'string') {
      date = new Date(dateInput);
    } else {
      return 'Invalid Date';
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Invalid Date';
  }
}

export default function TransactionTable({ transactions, currentAccountId, isLoading }) {
  const th = {
    textAlign: 'left',
    padding: '16px 12px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    borderBottom: '2px solid #e5e7eb'
  };

  const td = {
    padding: '16px 12px',
    fontSize: '14px',
    borderBottom: '1px solid #f3f4f6',
    verticalAlign: 'top'
  };

  if (isLoading) {
    return (
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '40px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '16px', color: '#6b7280' }}>Loading transactions...</div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '40px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '16px', color: '#6b7280', marginBottom: '8px' }}>No transactions found</div>
        <div style={{ fontSize: '14px', color: '#9ca3af' }}>Try adjusting your search criteria</div>
      </div>
    );
  }

  return (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '0',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      overflow: 'hidden'
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={th}>Transaction ID</th>
              <th style={th}>Sender</th>
              <th style={th}>Receiver</th>
              <th style={th}>Amount</th>
              <th style={th}>Currency</th>
              <th style={th}>Cause</th>
              <th style={th}>Created At</th>
              <th style={th}>Direction</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => {
              // Extract transaction data with fallbacks
              const transactionId = tx.id || tx.transactionId || tx.transaction_id || '-';
              const sender = tx.sender?.name || tx.sender_name || tx.sender || '-';
              const receiver = tx.receiver?.name || tx.receiver_name || tx.receiver || '-';
              const amount = tx.amount || 0;
              const currency = tx.currency || 'ETB';
              const cause = tx.cause || tx.note || tx.description || '-';
              const createdAt = tx.created_at_time || tx.createdAt || tx.created_at || tx.date || tx.timestamp;

              // Determine transaction direction
              const isTopUp = sender === receiver && sender !== '-';
              const isIncoming = isTopUp || (receiver && receiver.toString() === currentAccountId?.toString());

              const directionColor = isIncoming ? '#059669' : '#dc2626';
              const directionBg = isIncoming ? '#ecfdf5' : '#fef2f2';
              const directionText = isIncoming ? 'Incoming' : 'Outgoing';

              return (
                <tr
                  key={`${transactionId}-${index}`}
                  style={{
                    transition: 'background-color 0.2s',
                    cursor: 'default'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ ...td, fontFamily: 'monospace', fontSize: '13px' }}>
                    {transactionId}
                  </td>
                  <td style={td}>{sender}</td>
                  <td style={td}>{receiver}</td>
                  <td style={{ ...td, fontWeight: '600', textAlign: 'right' }}>
                    {formatAmount(amount, currency)}
                  </td>
                  <td style={{ ...td, fontWeight: '500' }}>{currency}</td>
                  <td style={td}>{cause}</td>
                  <td style={{ ...td, fontSize: '13px', color: '#6b7280' }}>
                    {formatDate(createdAt)}
                  </td>
                  <td style={td}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: directionColor,
                      backgroundColor: directionBg,
                      border: `1px solid ${directionColor}20`
                    }}>
                      {directionText}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
