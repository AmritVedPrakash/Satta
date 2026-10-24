import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { homeService } from '../../services/homeService';
import { isValidCrossing, isValidPoints } from '../../utils/validators';
import { PRESET_POINTS, MIN_BET_AMOUNT } from '../../utils/constants';
import { ArrowLeft, Shuffle, CheckCircle, Trash2 } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';

export const Crossing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userPhone, balance, refreshBalance } = useAuth();

  const game = location.state?.game || {
    GameName: 'KALYAN',
    GameId: '1',
  };

  const [digits, setDigits] = useState('');
  const [includeJora, setIncludeJora] = useState(true);
  const [pointsPerJodi, setPointsPerJodi] = useState('');
  const [generatedJodis, setGeneratedJodis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGenerate = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isValidCrossing(digits)) {
      setErrorMsg('Please enter between 2 to 10 unique digits (0-9).');
      return;
    }

    const numPoints = parseInt(pointsPerJodi, 10);
    if (!isValidPoints(numPoints)) {
      setErrorMsg(`Minimum bet per Jodi is ₹${MIN_BET_AMOUNT}.`);
      return;
    }

    // Split digits and remove duplicates
    const digitArr = Array.from(new Set(digits.replace(/\D/g, '').split('')));
    if (digitArr.length < 2) {
      setErrorMsg('At least 2 unique digits are required.');
      return;
    }

    const list = [];
    for (let i = 0; i < digitArr.length; i++) {
      for (let j = 0; j < digitArr.length; j++) {
        if (!includeJora && digitArr[i] === digitArr[j]) {
          continue;
        }
        list.push({
          number: `${digitArr[i]}${digitArr[j]}`,
          points: numPoints,
        });
      }
    }

    const totalNeeded = list.length * numPoints;
    if (totalNeeded > balance.total) {
      setErrorMsg(`Insufficient balance. Required: ₹${totalNeeded}, Available: ₹${balance.total}`);
      return;
    }

    setGeneratedJodis(list);
  };

  const totalPoints = generatedJodis.reduce((acc, curr) => acc + curr.points, 0);

  const handleSubmitBids = async () => {
    if (generatedJodis.length === 0) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const betsPayload = generatedJodis.map((b) => ({
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
      setGeneratedJodis([]);
      setDigits('');
      setPointsPerJodi('');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit crossing bids.');
      setConfirmModal(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '12px 14px' }}>
      {/* Top Header */}
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
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>CROSSING GENERATOR</div>
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

      {/* Generator Form */}
      <form onSubmit={handleGenerate} style={{ background: 'white', padding: 14, borderRadius: 10, boxShadow: 'var(--shadow-sm)' }}>
        <Input
          label="Enter Digits (e.g. 12345)"
          placeholder="Enter 2 to 10 unique digits"
          value={digits}
          onChange={(e) => setDigits(e.target.value.replace(/\D/g, '').slice(0, 10))}
          required
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0' }}>
          <input
            type="checkbox"
            id="jora"
            checked={includeJora}
            onChange={(e) => setIncludeJora(e.target.checked)}
            style={{ width: 18, height: 18, accentColor: 'var(--primary-color)', cursor: 'pointer' }}
          />
          <label htmlFor="jora" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
            Include Jora (e.g. 11, 22, 33...)
          </label>
        </div>

        <Input
          label="Points Per Jodi"
          type="number"
          placeholder="Min ₹10"
          value={pointsPerJodi}
          onChange={(e) => setPointsPerJodi(e.target.value.replace(/\D/g, ''))}
          required
        />

        <div style={{ display: 'flex', gap: 6, margin: '8px 0 12px', overflowX: 'auto' }}>
          {PRESET_POINTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPointsPerJodi(String(p))}
              style={{
                padding: '4px 10px',
                borderRadius: 4,
                border: pointsPerJodi === String(p) ? '1px solid var(--gold-color)' : '1px solid #cbd5e1',
                background: pointsPerJodi === String(p) ? '#fef9c3' : '#f8fafc',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              +₹{p}
            </button>
          ))}
        </div>

        <Button type="submit" variant="primary" fullWidth icon={<Shuffle size={16} />}>
          Generate All Jodis
        </Button>
      </form>

      {/* Generated Results */}
      {generatedJodis.length > 0 && (
        <div style={{ marginTop: 14, background: 'white', borderRadius: 10, padding: 14, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#334155' }}>
                Generated ({generatedJodis.length} Jodis)
              </h3>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Total: <strong>₹{totalPoints}</strong> (₹{pointsPerJodi} each)
              </div>
            </div>
            <button
              type="button"
              onClick={() => setGeneratedJodis([])}
              style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Clear
            </button>
          </div>

          {/* Chips grid */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 180, overflowY: 'auto', padding: 4, marginBottom: 12 }}>
            {generatedJodis.map((item, idx) => (
              <span
                key={idx}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: 6,
                  padding: '4px 8px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#1e293b',
                }}
              >
                {item.number}
              </span>
            ))}
          </div>

          <Button
            type="button"
            variant="gold"
            fullWidth
            onClick={() => setConfirmModal(true)}
            disabled={totalPoints > balance.total}
          >
            Confirm & Place {generatedJodis.length} Bids (₹{totalPoints})
          </Button>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}
        title="Confirm Crossing Bids"
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
        <p style={{ textAlign: 'center', fontSize: '0.95rem', color: '#334155' }}>
          Submit <strong>{generatedJodis.length}</strong> Jodi bids totaling{' '}
          <strong style={{ color: '#15803d' }}>₹{totalPoints}</strong> on{' '}
          <strong>{game.GameName || 'Market'}</strong>?
        </p>
      </Modal>

      {/* Success */}
      <Modal
        isOpen={successModal}
        onClose={() => setSuccessModal(false)}
        title="Success"
        footer={
          <Button variant="primary" fullWidth onClick={() => { setSuccessModal(false); navigate(-1); }}>
            Done
          </Button>
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

export default Crossing;

