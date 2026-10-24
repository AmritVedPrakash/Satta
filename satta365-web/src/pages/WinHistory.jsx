import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { homeService } from '../services/homeService';
import { ArrowLeft, RefreshCw, Trophy } from 'lucide-react';
import Loader from '../components/common/Loader';

export const WinHistory = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userPhone } = useAuth();

  const [wins, setWins] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!userPhone) return;
    setLoading(true);
    try {
      const res = await homeService.getWinHistory(userPhone);
      if (Array.isArray(res)) {
        setWins(res);
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
              WIN HISTORY
            </h2>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Your Winning Bids & Payouts</div>
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
        <Loader message="Loading winning history..." />
      ) : wins.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 30, color: '#94a3b8' }}>
          No winning records yet. Keep playing!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {wins.map((w, idx) => (
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
                borderLeft: '4px solid #16a34a',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: '#fef9c3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Trophy size={18} color="#eab308" />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1e293b' }}>
                    {w.GameName || w.gameName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                    Number: <strong>{w.WinningNumber || w.number}</strong> ({w.GameType || w.type || 'Win'})
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 2 }}>
                    {w.Date || w.date || 'Recent'}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#16a34a' }}>
                  +₹{w.WinPoints || w.points}
                </div>
                <span style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 700 }}>
                  CREDITED
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WinHistory;

