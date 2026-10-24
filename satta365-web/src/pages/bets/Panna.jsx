import React, { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { homeService } from '../../services/homeService';
import { isValidSinglePanna, isValidDoublePanna, isValidPoints } from '../../utils/validators';
import { PRESET_POINTS, MIN_BET_AMOUNT } from '../../utils/constants';
import { ArrowLeft, Trash2, Plus, CheckCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';

export const Panna = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { userPhone, balance, refreshBalance } = useAuth();

  const pannaType = searchParams.get('type') === 'double' ? 'Double Panna' : 'Single Panna';

  const game = location.state?.game || {
    GameName: 'KALYAN',
    GameId: '1',
  };

  const [session, setSession] = useState('Open');
  const [pannaInput, setPannaInput] = useState('');
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

    if (pannaType === 'Single Panna') {
      if (!isValidSinglePanna(pannaInput)) {
        setErrorMsg('Please enter a valid 3-digit Single Panna (all digits unique in ascending order, e.g. 128).');
        return;
      }
    } else {
      if (!isValidDoublePanna(pannaInput)) {
        setErrorMsg('Please enter a valid 3-digit Double Panna (exactly 2 repeating digits, e.g. 112).');
        return;
      }
    }

    const numPoints = parseInt(points, 10);
    if (!isValidPoints(numPoints)) {
      setErrorMsg(`Minimum bet amount is ₹${MIN_BET_AMOUNT}.`);
      return;
    }

    if (totalPoints + numPoints > balance.total) {
      setErrorMsg('Insufficient balance.');
      return;
    }

    const existingIndex = basket.findIndex((b) => b.number === pannaInput && b.session === session);
    if (existingIndex > -1) {
      const updated = [...basket];
      updated[existingIndex].points = Number(updated[existingIndex].points) + numPoints;
      setBasket(updated);
    } else {
      setBasket([...basket, { number: pannaInput, session, points: numPoints, type: pannaType }]);
    }

    setPannaInput('');
    setPoints('');
  };

  const handleRemoveBet = (index) => {
    setBasket(basket.filter((_, idx) => idx !== index));
  };

  const handleSubmitBids = async () => {
    if (basket.length === 0) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const betsPayload = basket.map((b) => ({
        GameName: game.GameName || game.name,
        GameId: game.GameId || '1',
        Number: b.number,
        Points: b.points,
        GameType: pannaType,
        Session: b.session,
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
            onClick={() => navigate(-1)}
            className="header-icon-btn"
            style={{ background: '#e2e8f0', color: '#1e293b' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-color)' }}>
              {game.GameName || 'MARKET'}
            </h2>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
              {pannaType.toUpperCase()}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Balance</div>
          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#15803d' }}>
            ₹{balance.total.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {errorMsg && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', padding: '8px 12px', borderRadius: 6, color: '#b91c1c', fontSize: '0.82rem', marginBottom: 12 }}>
          {errorMsg}
        </div>
      )}

      {/* Session Toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {['Open', 'Close'].map((sess) => (
          <button
            key={sess}
            type="button"
            onClick={() => setSession(sess)}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 8,
              border: session === sess ? '2px solid var(--primary-color)' : '1px solid #cbd5e1',
              background: session === sess ? 'var(--primary-color)' : 'white',
              color: session === sess ? '#fff' : '#475569',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            {sess} Session
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleAddBet} style={{ background: 'white', padding: 14, borderRadius: 10, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Input
            label={`${pannaType} (3 Digits)`}
            placeholder="e.g. 128"
            maxLength={3}
            value={pannaInput}
            onChange={(e) => setPannaInput(e.target.value.replace(/\D/g, '').slice(0, 3))}
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
            No bids added yet. Enter panna & points above.
          </div>
        ) : (
          <div>
            <table className="bet-basket-table">
              <thead>
                <tr>
                  <th>Panna</th>
                  <th>Session</th>
                  <th>Points</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {basket.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 700 }}>{item.number}</td>
                    <td>{item.session}</td>
                    <td>₹{item.points}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleRemoveBet(idx)}
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

      {/* Confirmation */}
      <Modal
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}
        title="Confirm Bids"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmModal(false)}>Cancel</Button>
            <Button variant="gold" loading={loading} onClick={handleSubmitBids}>Submit</Button>
          </>
        }
      >
        <p style={{ textAlign: 'center', fontSize: '0.95rem', color: '#334155' }}>
          Submit <strong>{basket.length}</strong> {pannaType} bids totaling{' '}
          <strong style={{ color: '#15803d' }}>₹{totalPoints}</strong>?
        </p>
      </Modal>

      {/* Success */}
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

export default Panna;

