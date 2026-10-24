import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { homeService } from '../../services/homeService';
import { isValidJodi, isValidPoints } from '../../utils/validators';
import { PRESET_POINTS, MIN_BET_AMOUNT } from '../../utils/constants';
import { ArrowLeft, Trash2, Plus, CheckCircle, AlertTriangle } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';

export const Jodi = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userPhone, balance, refreshBalance } = useAuth();

  const game = location.state?.game || {
    GameName: 'KALYAN',
    GameId: '1',
  };

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

    if (!isValidJodi(digit)) {
      setErrorMsg('Please enter a valid 2-digit number (00 to 99).');
      return;
    }

    const numPoints = parseInt(points, 10);
    if (!isValidPoints(numPoints)) {
      setErrorMsg(`Minimum bet amount is ₹${MIN_BET_AMOUNT}.`);
      return;
    }

    if (totalPoints + numPoints > balance.total) {
      setErrorMsg('Insufficient wallet balance to add this bet.');
      return;
    }

    const existingIndex = basket.findIndex((b) => b.number === digit);
    if (existingIndex > -1) {
      const updated = [...basket];
      updated[existingIndex].points = Number(updated[existingIndex].points) + numPoints;
      setBasket(updated);
    } else {
      setBasket([...basket, { number: digit, points: numPoints, type: 'Jodi' }]);
    }

    setDigit('');
    setPoints('');
  };

  const handleRemoveBet = (index) => {
    setBasket(basket.filter((_, idx) => idx !== index));
  };

  const handleClearAll = () => {
    setBasket([]);
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
        GameType: 'Jodi',
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
      setErrorMsg(err.message || 'Failed to submit bids. Please try again.');
      setConfirmModal(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="header-icon-btn"
            style={{ background: '#e2e8f0', color: '#1e293b' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-color)' }}>
              {game.GameName || 'MARKET'}
            </h2>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>JODI DIGIT (00-99)</div>
          </div>
        </div>

        <div style={{ textAlign: 'right', background: 'white', padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Wallet Balance</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#15803d' }}>
            ₹{balance.total.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {errorMsg && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', padding: '10px 14px', borderRadius: 8, color: '#b91c1c', fontSize: '0.85rem', marginBottom: 16 }}>
          {errorMsg}
        </div>
      )}

      {/* Desktop 2-Column Split Layout */}
      <div className="bet-split-container">
        {/* Left: Input Form & Presets */}
        <div className="bet-input-panel">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: 14 }}>
            Enter Jodi & Points
          </h3>

          <form onSubmit={handleAddBet}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Input
                label="Jodi Digit (00-99)"
                placeholder="e.g. 45"
                maxLength={2}
                value={digit}
                onChange={(e) => setDigit(e.target.value.replace(/\D/g, '').slice(0, 2))}
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

            {/* Quick Points Preset */}
            <div style={{ margin: '8px 0 16px' }}>
              <label className="form-label">Quick Amount Chips:</label>
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
                {PRESET_POINTS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPoints(String(p))}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 6,
                      border: points === String(p) ? '2px solid var(--gold-color)' : '1px solid #cbd5e1',
                      background: points === String(p) ? '#fef9c3' : '#f8fafc',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    +₹{p}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" variant="primary" fullWidth icon={<Plus size={16} />}>
              Add to Bid Slip
            </Button>
          </form>

          {/* Quick info */}
          <div style={{ marginTop: 20, padding: 12, background: '#f8fafc', borderRadius: 8, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>
            💡 <strong>Rules:</strong> Select any 2-digit number from 00 to 99. The winning rate is <strong>10 KA 950</strong>. Bids can be placed up to the closing time of the market.
          </div>
        </div>

        {/* Right: Live Desktop Bet Slip */}
        <div className="bet-slip-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>
              Current Bet Slip ({basket.length})
            </h3>
            {basket.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Clear All
              </button>
            )}
          </div>

          {basket.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 0', color: '#94a3b8', fontSize: '0.88rem' }}>
              Your bid slip is empty.<br />Add Jodi numbers from the left.
            </div>
          ) : (
            <div>
              <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                <table className="bet-basket-table">
                  <thead>
                    <tr>
                      <th>Digit</th>
                      <th>Points</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {basket.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--primary-light)' }}>
                          {item.number}
                        </td>
                        <td style={{ fontWeight: 600 }}>₹{item.points}</td>
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
              </div>

              {/* Total summary */}
              <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: 14, margin: '12px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.85rem' }}>
                  <span style={{ color: '#64748b' }}>Total Bids:</span>
                  <strong>{basket.length}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.85rem' }}>
                  <span style={{ color: '#64748b' }}>Total Bet Points:</span>
                  <strong style={{ color: 'var(--primary-light)', fontSize: '1.1rem' }}>₹{totalPoints}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#64748b' }}>
                  <span>Wallet Balance:</span>
                  <span>₹{balance.total}</span>
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
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}
        title="Confirm Your Bids"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmModal(false)}>
              Cancel
            </Button>
            <Button variant="gold" loading={loading} onClick={handleSubmitBids}>
              Submit Now
            </Button>
          </>
        }
      >
        <div style={{ textAlign: 'center', padding: '12px 0' }}>
          <p style={{ fontSize: '1rem', color: '#334155' }}>
            Are you sure you want to place <strong>{basket.length}</strong> bids totaling{' '}
            <strong style={{ color: '#15803d' }}>₹{totalPoints}</strong> on{' '}
            <strong>{game.GameName || 'Market'}</strong>?
          </p>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 8 }}>
            Remaining balance after bid: ₹{balance.total - totalPoints}
          </p>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={successModal}
        onClose={() => setSuccessModal(false)}
        title="Bids Placed Successfully"
        footer={
          <Button
            variant="primary"
            fullWidth
            onClick={() => {
              setSuccessModal(false);
              navigate(-1);
            }}
          >
            Done
          </Button>
        }
      >
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <CheckCircle size={48} color="#16a34a" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#16a34a' }}>Bids Submitted!</h4>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 6 }}>
            Your bids have been placed and your balance has been updated.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Jodi;
