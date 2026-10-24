import React from 'react';

export const Last15Ticker = ({ results = [] }) => {
  if (!results || results.length === 0) return null;

  const getColorClass = (numStr) => {
    const num = parseInt(numStr, 10);
    if (isNaN(num)) return 'ticker-black';
    if (num === 0) return 'ticker-green';
    // Even is red, odd is black or alternate
    return num % 2 === 0 ? 'ticker-red' : 'ticker-black';
  };

  return (
    <div style={{ background: '#071b0b', padding: '8px 12px', borderBottom: '1px solid #16401d' }}>
      <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginBottom: 4, fontWeight: 600 }}>
        LAST 15 RESULTS:
      </div>
      <div className="ticker-strip">
        {results.map((item, index) => {
          const val = item.Result || item.Number || item.result || (typeof item === 'string' ? item : String(item?.Result ?? item?.result ?? '?'));
          const colorClass = getColorClass(val);
          return (
            <div key={index} className={`ticker-item ${colorClass}`}>
              {val}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Last15Ticker;

