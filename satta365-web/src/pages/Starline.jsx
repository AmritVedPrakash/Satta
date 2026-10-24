import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { homeService } from '../services/homeService';
import { PRESET_POINTS, MIN_BET_AMOUNT } from '../utils/constants';
import { isValidHaruf, isValidSinglePanna, isValidPoints } from '../utils/validators';
import { ArrowLeft, Clock, BarChart2, Plus, Trash2, CheckCircle, Sparkles } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';

const STARLINE_HOURS = [
  { time: '10:00 AM', result: '128-1', status: 'Closed' },
  { time: '11:00 AM', result: '456-5', status: 'Closed' },
  { time: '12:00 PM', result: '***-*', status: 'Open' },
  { time: '01:00 PM', result: '***-*', status: 'Open' },
  { time: '02:00 PM', result: '***-*', status: 'Open' },
  { time: '03:00 PM', result: '***-*', status: 'Open' },
  { time: '04:00 PM', result: '***-*', status: 'Open' },
  { time: '05:00 PM', result: '***-*', status: 'Open' },
];

export const Starline = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userPhone, balance, refreshBalance } = useAuth();

  const [selectedHour, setSelectedHour] = useState('12:00 PM');
  const [betType, setBetType] = useState('Single Ank'); // 'Single Ank' | 'Single Panna'
  const [digit, setDigit] = useState('');
  const [points, setPoints] = useState('');
  const [basket, setBasket] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const totalPoints = basket.reduce((acc, curr) => acc + Number(curr.points), 0);

  const handleAddBet = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (betType === 'Single Ank') {
      if (!isValidHaruf(digit)) {
        setErrorMsg('Please enter a single digit (0-9).');
        return;
      }
    } else {
      if (!isValidSinglePanna(digit)) {
        setErrorMsg('Please enter a valid 3-digit Single Panna (e.g. 128).');
        return;
      }
    }

    const pts = parseInt(points, 10);
    if (!isValidPoints(pts)) {
      setErrorMsg(`Minimum amount is ₹${MIN_BET_AMOUNT}.`);
      return;
    }

    if (totalPoints + pts > balance.total) {
      setErrorMsg('Insufficient balance.');
      return;
    }

    setBasket([
      ...basket,
      {
        market: `STARLINE ${selectedHour}`,
        type: betType,
        number: digit,
        points: pts,
      },
    ]);

    setDigit('');
    setPoints('');
  };

  const handleSubmitBids = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (basket.length === 0) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const betsPayload = basket.map((b) => ({
        GameName: b.market,
        GameId: 'STARLINE',
        Number: b.number,
        Points: b.points,
        GameType: b.type,
        Session: 'Close',
        UserPhone: userPhone,
        Date: new Date().toISOString().split('T')[0],
      }));

      await homeService.placeMultipleBets(betsPayload);
      await refreshBalance();
      setConfirmModal(false);
      setSuccessModal(true);
      setBasket([]);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit bids.');
      setConfirmModal(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '12px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="header-icon-btn"
            style={{ background: '#e2e8f0', color: '#1e293b' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-color)' }}>
              STARLINE GAMES
            </h2>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Hourly Results</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={() => navigate('/starline/chart')}
            style={{
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              color: '#334155',
              borderRadius: 6,
              padding: '4px 8px',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              cursor: 'pointer',
            }}
          >
            <BarChart2 size={14} />
            <span>Chart</span>
          </button>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Wallet</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#15803d' }}>
              ₹{balance.total}
            </div>
          </div>
        </div>
      </div>

      {/* Hourly Schedule Carousel / Strip */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 6, marginBottom: 12 }}>
        {STARLINE_HOURS.map((h) => {
          const isSelected = selectedHour === h.time;
          const isOpen = h.status === 'Open';

          return (
            <button
              key={h.time}
              type="button"
              onClick={() => isOpen && setSelectedHour(h.time)}
              disabled={!isOpen}
              style={{
                minWidth: 84,
                padding: '8px 4px',
                borderRadius: 8,
                border: isSelected ? '2px solid var(--primary-color)' : '1px solid #cbd5e1',
                background: isSelected ? 'var(--primary-color)' : isOpen ? 'white' : '#f1f5f9',
                color: isSelected ? '#fff' : isOpen ? '#1e293b' : '#94a3b8',
                cursor: isOpen ? 'pointer' : 'not-allowed',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>{h.time}</div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: isSelected ? 'var(--gold-light)' : '#16a34a' }}>
                {h.result}
              </div>
            </button>
          );
        })}
      </div>

      {errorMsg && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', padding: '8px 12px', borderRadius: 6, color: '#b91c1c', fontSize: '0.82rem', marginBottom: 12 }}>
          {errorMsg}
        </div>
      )}

      {/* Bet Type */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
        {['Single Ank', 'Single Panna'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setBetType(t); setDigit(''); }}
            style={{
              padding: '10px 0',
              borderRadius: 8,
              border: betType === t ? '2px solid var(--primary-light)' : '1px solid #cbd5e1',
              background: betType === t ? '#ecfdf5' : 'white',
              color: betType === t ? 'var(--primary-color)' : '#475569',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleAddBet} style={{ background: 'white', padding: 14, borderRadius: 10, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Input
            label={betType === 'Single Ank' ? 'Single Digit (0-9)' : 'Single Panna (3 Digits)'}
            placeholder={betType === 'Single Ank' ? '7' : '128'}
            maxLength={betType === 'Single Ank' ? 1 : 3}
            value={digit}
            onChange={(e) => setDigit(e.target.value.replace(/\D/g, '').slice(0, betType === 'Single Ank' ? 1 : 3))}
            required
          />
          <Input
            label="Points / Amount"
            type="number"
            placeholder="Min ₹10"
            value={points}
            onChange={(e) => setPoints(e.target.value.replace(/\D/g, ''))}
            required
          />
        </div>

        <div style={{ display: 'flex', gap: 6, margin: '8px 0 12px', overflowX: 'auto' }}>
          {PRESET_POINTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPoints(String(p))}
              style={{
                padding: '4px 10px',
                borderRadius: 4,
                border: points === String(p) ? '1px solid var(--gold-color)' : '1px solid #cbd5e1',
                background: points === String(p) ? '#fef9c3' : '#f8fafc',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              +₹{p}
            </button>
          ))}
        </div>

        <Button type="submit" variant="primary" fullWidth icon={<Plus size={16} />}>
          Add to Slip ({selectedHour})
        </Button>
      </form>

      {/* Slip */}
      <div style={{ marginTop: 14, background: 'white', borderRadius: 10, padding: 14, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>
            Bid Slip ({basket.length})
          </h3>
          {basket.length > 0 && (
            <button
              type="button"
              onClick={() => setBasket([])}
              style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Clear All
            </button>
          )}
        </div>

        {basket.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8', fontSize: '0.85rem' }}>
            No bids added yet.
          </div>
        ) : (
          <div>
            <table className="bet-basket-table">
              <thead>
                <tr>
                  <th>Market</th>
                  <th>Type</th>
                  <th>Digit</th>
                  <th>Points</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {basket.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 700 }}>{item.market}</td>
                    <td style={{ fontSize: '0.78rem' }}>{item.type}</td>
                    <td style={{ fontWeight: 700 }}>{item.number}</td>
                    <td>₹{item.points}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => setBasket(basket.filter((_, i) => i !== idx))}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Total Bids: </span>
                <strong>{basket.length}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Total Points: </span>
                <strong style={{ color: 'var(--primary-light)', fontSize: '1rem' }}>₹{totalPoints}</strong>
              </div>
            </div>

            <Button
              type="button"
              variant="gold"
              fullWidth
              onClick={() => setConfirmModal(true)}
              disabled={totalPoints > balance.total || basket.length === 0}
            >
              Confirm & Submit ({basket.length} Bids - ₹{totalPoints})
            </Button>
          </div>
        )}
      </div>

      <Modal
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}
        title="Confirm Starline Bids"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmModal(false)}>Cancel</Button>
            <Button variant="gold" loading={loading} onClick={handleSubmitBids}>Submit</Button>
          </>
        }
      >
        <p style={{ textAlign: 'center', fontSize: '0.95rem', color: '#334155' }}>
          Submit <strong>{basket.length}</strong> Starline bids totaling{' '}
          <strong style={{ color: '#15803d' }}>₹{totalPoints}</strong>?
        </p>
      </Modal>

      <Modal
        isOpen={successModal}
        onClose={() => setSuccessModal(false)}
        title="Success"
        footer={
          <Button variant="primary" fullWidth onClick={() => { setSuccessModal(false); navigate(-1); }}>Done</Button>
        }
      >
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <CheckCircle size={48} color="#16a34a" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#16a34a' }}>Bids Submitted!</h4>
        </div>
      </Modal>
    </div>
  );
};

export default Starline;

