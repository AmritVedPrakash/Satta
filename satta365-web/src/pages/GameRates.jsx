import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { drawerService } from '../services/drawerService';
import { ArrowLeft, Percent } from 'lucide-react';
import Loader from '../components/common/Loader';

const DEFAULT_RATES = [
  { name: 'Jodi Rate', rate: '10 - 950' },
  { name: 'Haruf Andar', rate: '10 - 95' },
  { name: 'Haruf Bahar', rate: '10 - 95' },
  { name: 'Roulette Matka', rate: '10 - 95' },
];

export const GameRates = () => {
  const navigate = useNavigate();
  const [rates, setRates] = useState(DEFAULT_RATES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRates();
  }, []);

  const loadRates = async () => {
    try {
      setLoading(true);
      const res = await drawerService.getRates();
      if (Array.isArray(res) && res.length > 0) {
        setRates(
          res.map((r) => ({
            name: r.Name || r.name || r.Gamename || r.GameName || r.Sessionname || 'Game Rate',
            rate: r.Points || r.points || r.Rate || r.rate || '10 - 95',
          }))
        );
      }
    } catch (e) {
      console.warn('Could not load game rates from backend:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '16px 12px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="header-icon-btn"
          style={{ background: '#e2e8f0', color: '#1e293b' }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary-color)' }}>
            GAME RATES
          </h1>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Official Winning Payout Rates</div>
        </div>
      </div>

      {loading ? (
        <Loader message="Loading rates..." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {rates.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'linear-gradient(135deg, #022b0a 0%, #064512 100%)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                borderRadius: 10,
                padding: '16px 22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffd700' }} />
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.3px' }}>
                  {item.name}
                </span>
              </div>
              <div
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  color: '#ffd700',
                  letterSpacing: '1px',
                  background: 'rgba(0, 0, 0, 0.35)',
                  padding: '5px 16px',
                  borderRadius: 6,
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                }}
              >
                {item.rate}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameRates;
