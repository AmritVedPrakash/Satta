import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { drawerService } from '../services/drawerService';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import Loader from '../components/common/Loader';

export const WalletStatement = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userPhone, balance, refreshBalance } = useAuth();

  const [statement, setStatement] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!userPhone) return;
    setLoading(true);
    try {
      const res = await drawerService.displayStatement(userPhone);
      if (Array.isArray(res)) {
        setStatement(res);
      }
    } catch (e) {
      //
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    loadData();
    refreshBalance();
  }, [isLoggedIn, userPhone]);

  return (
    <div style={{ padding: '14px 12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="header-icon-btn"
            style={{ background: '#e2e8f0', color: '#1e293b' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-color)' }}>
              WALLET STATEMENT
            </h2>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Account Transaction History</div>
          </div>
        </div>

        <button
          type="button"
          onClick={loadData}
          style={{ background: 'none', border: 'none', color: 'var(--primary-light)', cursor: 'pointer' }}
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Balance Summary Card */}
      <div
        style={{
          background: 'var(--primary-gradient)',
          borderRadius: 10,
          padding: 16,
          color: 'white',
          marginBottom: 14,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-md)',
          borderBottom: '2px solid var(--gold-color)',
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Total Available Balance</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold-light)' }}>
            ₹{balance.total.toLocaleString('en-IN')}
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.75rem' }}>
          <div>Deposit: ₹{balance.deposit}</div>
          <div style={{ color: 'var(--gold-color)', fontWeight: 700 }}>Winning: ₹{balance.withdraw}</div>
        </div>
      </div>

      {loading ? (
        <Loader message="Loading statement..." />
      ) : statement.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 30, color: '#94a3b8' }}>
          No transaction history available.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {statement.map((item, idx) => {
            const remark = item.remark || item.Remark || item.TransactionId || 'Transaction';
            const date = item.date || item.Date || item.TransactionAmt || '';
            const points = item.points || item.Points || item.TransactionStatus || '0';
            const status = item.status || item.Status || item.TransactionDateandTime || '';
            const isDeducted = item.isDeducted ?? (
              status.toLowerCase().includes('deduct') ||
              remark.toLowerCase().includes('bet') ||
              remark.toLowerCase().includes('round')
            );

            // Display title matching Android app logic
            const displayTitle = remark.includes('Round')
              ? remark
              : (remark.includes('+') ? remark : `${remark} +${points}`);

            return (
              <div
                key={item.id || idx}
                style={{
                  background: 'white',
                  borderRadius: 10,
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
                  border: '1px solid #f1f5f9',
                  borderLeft: `4px solid ${isDeducted ? '#ef4444' : '#1FAA00'}`,
                  transition: 'transform 0.15s ease',
                }}
              >
                <div style={{ flex: 1, paddingRight: 12 }}>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      color: '#0f172a',
                      lineHeight: 1.35,
                      wordBreak: 'break-word',
                    }}
                  >
                    {displayTitle}
                  </div>
                  {date && (
                    <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 4, fontWeight: 500 }}>
                      {date}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'right', whiteSpace: 'nowrap', minWidth: 90 }}>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: '1rem',
                      color: '#1FAA00',
                    }}
                  >
                    {points}
                  </div>
                  {status && (
                    <div
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        color: '#1FAA00',
                        marginTop: 2,
                      }}
                    >
                      {status}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WalletStatement;

