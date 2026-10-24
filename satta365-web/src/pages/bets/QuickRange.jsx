import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { homeService } from '../../services/homeService';
import { isValidPoints } from '../../utils/validators';
import { PRESET_POINTS, MIN_BET_AMOUNT } from '../../utils/constants';
import { ArrowLeft, Grid, CheckCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';

export const QuickRange = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userPhone, balance, refreshBalance } = useAuth();

  const game = location.state?.game || {
    GameName: 'KALYAN',
    GameId: '1',
  };

  const [fromRange, setFromRange] = useState('');
  const [toRange, setToRange] = useState('');
  const [pointsPerNumber, setPointsPerNumber] = useState('');
  const [generatedList, setGeneratedList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGenerate = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const from = parseInt(fromRange, 10);
    const to = parseInt(toRange, 10);
    const pts = parseInt(pointsPerNumber, 10);

    if (isNaN(from) || from < 0 || from > 99) {
      setErrorMsg('Please enter a valid start number (00 to 99).');
      return;
    }
    if (isNaN(to) || to < 0 || to > 99) {
      setErrorMsg('Please enter a valid end number (00 to 99).');
      return;
    }
    if (to < from) {
      setErrorMsg('End number must be greater than or equal to start number.');
      return;
    }
    if (!isValidPoints(pts)) {
      setErrorMsg(`Minimum amount per number is ₹${MIN_BET_AMOUNT}.`);
      return;
    }

    const items = [];
    for (let i = from; i <= to; i++) {
      const formatted = i < 10 ? `0${i}` : String(i);
      items.push({
        number: formatted,
        points: pts,
      });
    }

    const totalNeeded = items.length * pts;
    if (totalNeeded > balance.total) {
      setErrorMsg(`Insufficient balance. Required: ₹${totalNeeded}, Available: ₹${balance.total}`);
      return;
    }

    setGeneratedList(items);
  };

  const totalPoints = generatedList.reduce((acc, curr) => acc + curr.points, 0);

  const handleSubmitBids = async () => {
    if (generatedList.length === 0) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const betsPayload = generatedList.map((b) => ({
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
      setGeneratedList([]);
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
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>QUICK RANGE</div>
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

      {/* Range Form */}
      <form onSubmit={handleGenerate} style={{ background: 'white', padding: 14, borderRadius: 10, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Input
            label="From (00-99)"
            placeholder="e.g. 10"
            maxLength={2}
            value={fromRange}
            onChange={(e) => setFromRange(e.target.value.replace(/\D/g, '').slice(0, 2))}
            required
          />
          <Input
            label="To (00-99)"
            placeholder="e.g. 25"
            maxLength={2}
            value={toRange}
            onChange={(e) => setToRange(e.target.value.replace(/\D/g, '').slice(0, 2))}
            required
          />
        </div>

        <Input
          label="Points Per Number"
          type="number"
          placeholder="Min ₹10"
          value={pointsPerNumber}
          onChange={(e) => setPointsPerNumber(e.target.value.replace(/\D/g, ''))}
          required
        />

        <div style={{ display: 'flex', gap: 6, margin: '8px 0 12px', overflowX: 'auto' }}>
          {PRESET_POINTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPointsPerNumber(String(p))}
              style={{
                padding: '4px 10px',
                borderRadius: 4,
                border: pointsPerNumber === String(p) ? '1px solid var(--gold-color)' : '1px solid #cbd5e1',
                background: pointsPerNumber === String(p) ? '#fef9c3' : '#f8fafc',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              +₹{p}
            </button>
          ))}
        </div>

        <Button type="submit" variant="primary" fullWidth icon={<Grid size={16} />}>
          Generate Range Bids
        </Button>
      </form>

      {/* Generated list */}
      {generatedList.length > 0 && (
        <div style={{ marginTop: 14, background: 'white', borderRadius: 10, padding: 14, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#334155' }}>
                Range ({generatedList.length} Bids)
              </h3>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Total: <strong>₹{totalPoints}</strong> (₹{pointsPerNumber} each)
              </div>
            </div>
            <button
              type="button"
              onClick={() => setGeneratedList([])}
              style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Clear
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 180, overflowY: 'auto', padding: 4, marginBottom: 12 }}>
            {generatedList.map((item, idx) => (
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
            Confirm & Place {generatedList.length} Bids (₹{totalPoints})
          </Button>
        </div>
      )}

      {/* Confirm */}
      <Modal
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}
        title="Confirm Range Bids"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmModal(false)}>Cancel</Button>
            <Button variant="gold" loading={loading} onClick={handleSubmitBids}>Submit Now</Button>
          </>
        }
      >
        <p style={{ textAlign: 'center', fontSize: '0.95rem', color: '#334155' }}>
          Submit <strong>{generatedList.length}</strong> range bids totaling{' '}
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

export default QuickRange;

