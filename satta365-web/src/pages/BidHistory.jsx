import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { homeService } from '../services/homeService';
import { ArrowLeft, RefreshCw, Clock } from 'lucide-react';
import Loader from '../components/common/Loader';

export const BidHistory = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userPhone } = useAuth();

  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!userPhone) return;
    setLoading(true);
    try {
      const res = await homeService.getBidHistory(userPhone);
      if (Array.isArray(res)) {
        setBids(res);
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
              BID HISTORY
            </h2>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Your Placed Bids & Status</div>
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

      {loading ? (
        <Loader message="Loading bids..." />
      ) : bids.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 30, color: '#94a3b8' }}>
          No bids placed yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {bids.map((b, idx) => (
            <div
              key={idx}
              style={{
                background: 'white',
                borderRadius: 8,
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)',
                borderLeft: '4px solid var(--primary-light)',
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1e293b' }}>
                  {b.GameName || b.gameName}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                  {b.GameType || b.gameType} • Digit: <strong>{b.Number || b.number}</strong> ({b.Session || b.session || 'Close'})
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 2 }}>
                  {b.Date || b.date || 'Today'}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#15803d' }}>
                  ₹{b.Points || b.points}
                </div>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: 4,
                    background: (b.Status || '').toLowerCase() === 'won' ? '#dcfce7' : '#f1f5f9',
                    color: (b.Status || '').toLowerCase() === 'won' ? '#16a34a' : '#64748b',
                  }}
                >
                  {b.Status || 'Active'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BidHistory;

