import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { homeService } from '../services/homeService';
import { ArrowLeft, RefreshCw, BarChart2 } from 'lucide-react';
import Loader from '../components/common/Loader';

export const RouletteChart = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadChart = async () => {
    setLoading(true);
    try {
      const res = await homeService.getRouletteChart();
      if (Array.isArray(res)) {
        setData(res);
      }
    } catch (e) {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChart();
  }, []);

  return (
    <div style={{ padding: '14px 12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={() => navigate('/roulette')}
            className="header-icon-btn"
            style={{ background: '#e2e8f0', color: '#1e293b' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-color)' }}>
              ROULETTE HISTORY CHART
            </h2>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Past rounds and winning numbers</div>
          </div>
        </div>

        <button
          type="button"
          onClick={loadChart}
          style={{ background: 'none', border: 'none', color: 'var(--primary-light)', cursor: 'pointer' }}
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {loading ? (
        <Loader message="Loading chart history..." />
      ) : data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 30, color: '#94a3b8' }}>
          No round history available.
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: 10, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--primary-color)', color: 'white' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Date / Time</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Round #</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Winning #</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Color</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => {
                const num = parseInt(item.Result || item.Number || item.winningNumber || 0, 10);
                const isGreen = num === 0;
                const isRed = num !== 0 && num % 2 === 0;

                return (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '10px 12px', color: '#64748b' }}>
                      {item.Date || item.time || 'Today'}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600 }}>
                      #{item.Round || (100 - idx)}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          width: 28,
                          height: 28,
                          lineHeight: '28px',
                          borderRadius: '50%',
                          background: isGreen ? '#16a34a' : isRed ? '#dc2626' : '#1e293b',
                          color: 'white',
                          fontWeight: 800,
                          textAlign: 'center',
                        }}
                      >
                        {num}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', fontSize: '0.78rem', fontWeight: 700 }}>
                      <span style={{ color: isGreen ? '#16a34a' : isRed ? '#dc2626' : '#1e293b' }}>
                        {isGreen ? 'GREEN' : isRed ? 'RED' : 'BLACK'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RouletteChart;

