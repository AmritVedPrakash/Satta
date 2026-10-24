import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { homeService } from '../../services/homeService';
import { isValidPoints } from '../../utils/validators';
import { PRESET_POINTS, MIN_BET_AMOUNT } from '../../utils/constants';
import { ArrowLeft, Trash2, CheckCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';

const TRIPLES = ['000', '111', '222', '333', '444', '555', '666', '777', '888', '999'];

export const TriplePanna = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userPhone, balance, refreshBalance } = useAuth();

  const game = location.state?.game || {
    GameName: 'KALYAN',
    GameId: '1',
  };

  const [session, setSession] = useState('Open');
  const [selectedTriples, setSelectedTriples] = useState({});
  const [allPoints, setAllPoints] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTriplePointChange = (trip, val) => {
    const pts = val.replace(/\D/g, '');
    setSelectedTriples((prev) => ({
      ...prev,
      [trip]: pts,
    }));
  };

  const handleApplyAll = () => {
    const pts = parseInt(allPoints, 10);
    if (!isValidPoints(pts)) {
      setErrorMsg(`Minimum bet amount is ₹${MIN_BET_AMOUNT}.`);
      return;
    }
    const updated = {};
    TRIPLES.forEach((t) => {
      updated[t] = String(pts);
    });
    setSelectedTriples(updated);
    setErrorMsg('');
  };

  const activeBets = Object.entries(selectedTriples)
    .filter(([_, pts]) => parseInt(pts, 10) >= MIN_BET_AMOUNT)
    .map(([num, pts]) => ({
      number: num,
      points: parseInt(pts, 10),
      session,
      type: 'Triple Panna',
    }));

  const totalPoints = activeBets.reduce((acc, curr) => acc + curr.points, 0);

  const handleSubmitBids = async () => {
    if (activeBets.length === 0) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const betsPayload = activeBets.map((b) => ({
        GameName: game.GameName || game.name,
        GameId: game.GameId || '1',
        Number: b.number,
        Points: b.points,
        GameType: 'Triple Panna',
        Session: b.session,
        UserPhone: userPhone,
        Date: new Date().toISOString().split('T')[0],
      }));

      await homeService.placeMultipleBets(betsPayload);
      await refreshBalance();
      setConfirmModal(false);
      setSuccessModal(true);
      setSelectedTriples({});
      setAllPoints('');
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
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>TRIPLE PANNA</div>
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

      {/* Quick Fill All */}
      <div style={{ background: 'white', padding: 12, borderRadius: 10, boxShadow: 'var(--shadow-sm)', marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          type="number"
          placeholder="Points for all 10 Triples"
          value={allPoints}
          onChange={(e) => setAllPoints(e.target.value.replace(/\D/g, ''))}
          className="form-input"
          style={{ flex: 1 }}
        />
        <Button variant="primary" onClick={handleApplyAll}>
          Apply All
        </Button>
      </div>

      {/* Triples Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
        {TRIPLES.map((trip) => (
          <div
            key={trip}
            style={{
              background: 'white',
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontWeight: 800, fontSize: '1rem', color: '#1e293b' }}>{trip}</span>
            <input
              type="number"
              placeholder="₹"
              value={selectedTriples[trip] || ''}
              onChange={(e) => handleTriplePointChange(trip, e.target.value)}
              className="form-input"
              style={{ width: 80, padding: '6px 8px', textAlign: 'center', fontWeight: 600 }}
            />
          </div>
        ))}
      </div>

      {/* Total summary and submit */}
      <div style={{ background: 'white', padding: 14, borderRadius: 10, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Selected Triples: </span>
            <strong>{activeBets.length}</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Total Points: </span>
            <strong style={{ color: 'var(--primary-light)', fontSize: '1.05rem' }}>₹{totalPoints}</strong>
          </div>
        </div>

        <Button
          type="button"
          variant="gold"
          fullWidth
          onClick={() => setConfirmModal(true)}
          disabled={activeBets.length === 0 || totalPoints > balance.total}
        >
          Confirm & Submit ({activeBets.length} Bids - ₹{totalPoints})
        </Button>
      </div>

      {/* Confirm Modal */}
      <Modal
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}
        title="Confirm Triple Panna"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmModal(false)}>Cancel</Button>
            <Button variant="gold" loading={loading} onClick={handleSubmitBids}>Submit</Button>
          </>
        }
      >
        <p style={{ textAlign: 'center', fontSize: '0.95rem', color: '#334155' }}>
          Submit <strong>{activeBets.length}</strong> Triple Panna bids totaling{' '}
          <strong style={{ color: '#15803d' }}>₹{totalPoints}</strong> on{' '}
          <strong>{game.GameName || 'Market'}</strong>?
        </p>
      </Modal>

      {/* Success Modal */}
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

export default TriplePanna;

