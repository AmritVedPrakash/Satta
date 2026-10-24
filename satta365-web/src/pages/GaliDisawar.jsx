import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { homeService } from '../services/homeService';
import { PRESET_POINTS, MIN_BET_AMOUNT } from '../utils/constants';
import { isValidJodi, isValidHaruf, isValidPoints } from '../utils/validators';
import { ArrowLeft, Clock, Plus, Trash2, CheckCircle, Layers } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';

const GALI_MARKETS = [
  { name: 'DISAWAR', openTime: '05:00 AM', result: '45', status: 'Open' },
  { name: 'FARIDABAD', openTime: '06:00 PM', result: '78', status: 'Open' },
  { name: 'GHAZIABAD', openTime: '08:00 PM', result: '12', status: 'Open' },
  { name: 'GALI', openTime: '11:00 PM', result: '**', status: 'Open' },
];

export const GaliDisawar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userPhone, balance, refreshBalance } = useAuth();

  const [selectedMarket, setSelectedMarket] = useState('DISAWAR');
  const [betType, setBetType] = useState('Jodi'); // 'Jodi' | 'Haruf Andar' | 'Haruf Bahar'
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

    if (betType === 'Jodi') {
      if (!isValidJodi(digit)) {
        setErrorMsg('Please enter a 2-digit number (00-99).');
        return;
      }
    } else {
      if (!isValidHaruf(digit)) {
        setErrorMsg('Please enter a 1-digit Haruf (0-9).');
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
        market: selectedMarket,
        number: digit,
        type: betType,
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
        GameId: 'GALI_DISAWAR',
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
              GALI DISAWAR
            </h2>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>North India Markets</div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Balance</div>
          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#15803d' }}>
            ₹{balance.total.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Markets Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 12 }}>
        {GALI_MARKETS.map((m) => (
          <button
            key={m.name}
            type="button"
            onClick={() => setSelectedMarket(m.name)}
            style={{
              padding: '8px 2px',
              borderRadius: 8,
              border: selectedMarket === m.name ? '2px solid var(--primary-color)' : '1px solid #cbd5e1',
              background: selectedMarket === m.name ? 'var(--primary-color)' : 'white',
              color: selectedMarket === m.name ? '#fff' : '#1e293b',
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontWeight: 800, fontSize: '0.75rem' }}>{m.name}</div>
            <div style={{ fontSize: '0.7rem', color: selectedMarket === m.name ? 'var(--gold-light)' : '#15803d', fontWeight: 700 }}>
              {m.result}
            </div>
          </button>
        ))}
      </div>

      {errorMsg && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', padding: '8px 12px', borderRadius: 6, color: '#b91c1c', fontSize: '0.82rem', marginBottom: 12 }}>
          {errorMsg}
        </div>
      )}

      {/* Bet Type Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {['Jodi', 'Haruf Andar', 'Haruf Bahar'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setBetType(t); setDigit(''); }}
            style={{
              flex: 1,
              padding: '8px 0',
              borderRadius: 6,
              border: betType === t ? '2px solid var(--primary-light)' : '1px solid #cbd5e1',
              background: betType === t ? '#ecfdf5' : 'white',
              color: betType === t ? 'var(--primary-color)' : '#475569',
              fontWeight: 700,
              fontSize: '0.8rem',
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
            label={betType === 'Jodi' ? 'Jodi Digit (00-99)' : `${betType} (0-9)`}
            placeholder={betType === 'Jodi' ? '45' : '7'}
            maxLength={betType === 'Jodi' ? 2 : 1}
            value={digit}
            onChange={(e) => setDigit(e.target.value.replace(/\D/g, '').slice(0, betType === 'Jodi' ? 2 : 1))}
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
          Add to Bid Slip
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
        title="Confirm Gali Disawar Bids"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmModal(false)}>Cancel</Button>
            <Button variant="gold" loading={loading} onClick={handleSubmitBids}>Submit</Button>
          </>
        }
      >
        <p style={{ textAlign: 'center', fontSize: '0.95rem', color: '#334155' }}>
          Submit <strong>{basket.length}</strong> bids totaling{' '}
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

export default GaliDisawar;

