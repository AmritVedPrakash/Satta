import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { homeService } from '../services/homeService';
import { ArrowLeft, Bell, AlertCircle, Info } from 'lucide-react';
import Loader from '../components/common/Loader';

export const Notice = () => {
  const navigate = useNavigate();
  const [alertText, setAlertText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotice();
  }, []);

  const loadNotice = async () => {
    try {
      setLoading(true);
      const res = await homeService.getAlert();
      if (res && res.length > 0) {
        setAlertText(res[0].AlertText || res[0].alert || '');
      }
    } catch (e) {
      //
    } finally {
      setLoading(false);
    }
  };

  const noticesList = [
    {
      title: 'Withdrawal Operating Hours',
      text: 'Withdrawal requests are processed daily between 09:00 AM and 11:30 PM. Minimum withdrawal is ₹460.',
      type: 'info',
    },
    {
      title: 'Deposit Guidelines',
      text: 'Please always verify the UPI ID displayed in the Add Cash screen before transferring funds. Always enter the accurate 12-digit UTR number.',
      type: 'warning',
    },
    {
      title: 'Single Device Login Policy',
      text: 'For account security and fair play, logging in on another device will automatically log out your existing session.',
      type: 'security',
    },
  ];

  return (
    <div style={{ padding: '14px 12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
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
            NOTICE BOARD
          </h2>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>App News & Important Rules</div>
        </div>
      </div>

      {/* Main Broadcast Notice */}
      {loading ? (
        <Loader message="Loading notices..." />
      ) : (
        <>
          {alertText && (
            <div
              style={{
                background: '#fef9c3',
                border: '1px solid #fde047',
                borderRadius: 10,
                padding: 16,
                marginBottom: 16,
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#854d0e', marginBottom: 6 }}>
                <Bell size={20} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800 }}>LIVE BROADCAST</h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#713f12', lineHeight: 1.5, fontWeight: 500 }}>
                {alertText}
              </p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {noticesList.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'white',
                  borderRadius: 10,
                  padding: 16,
                  boxShadow: 'var(--shadow-sm)',
                  borderLeft: `4px solid ${item.type === 'warning' ? '#f59e0b' : 'var(--primary-color)'}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Info size={18} color="var(--primary-color)" />
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
                    {item.title}
                  </h4>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Notice;

