import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { homeService } from '../services/homeService';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import Loader from '../components/common/Loader';

export const StarlineChart = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await homeService.getStarlineChart();
      if (Array.isArray(res)) {
        setData(res);
      }
    } catch (e) {
      //
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div style={{ padding: '14px 12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={() => navigate('/starline')}
            className="header-icon-btn"
            style={{ background: '#e2e8f0', color: '#1e293b' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-color)' }}>
              STARLINE HISTORY CHART
            </h2>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Hourly Results Record</div>
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
        <Loader message="Loading starline charts..." />
      ) : data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 30, color: '#94a3b8' }}>
          No records found.
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: 10, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--primary-color)', color: 'white' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Time</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Panna</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Digit</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px 12px', color: '#64748b' }}>{item.Date || 'Today'}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600 }}>{item.Time || '12:00 PM'}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700 }}>{item.Panna || '128'}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, color: '#16a34a' }}>
                    {item.Digit || '1'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StarlineChart;

