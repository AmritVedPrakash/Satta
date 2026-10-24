import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { drawerService } from '../services/drawerService';
import { homeService } from '../services/homeService';
import { isValidPoints, isValidUtr } from '../utils/validators';
import { MIN_DEPOSIT_POINTS } from '../utils/constants';
import { ArrowLeft, Copy, Check, QrCode, ShieldCheck, CheckCircle } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';

export const AddFunds = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userPhone, balance, refreshBalance } = useAuth();

  const [upiData, setUpiData] = useState({ upiId: 'satta365@upi', name: 'SATTA 365' });
  const [points, setPoints] = useState('500');
  const [utr, setUtr] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    loadUpi();
  }, [isLoggedIn]);

  const loadUpi = async () => {
    try {
      const res = await drawerService.getUpi();
      if (Array.isArray(res) && res.length > 0) {
        setUpiData({
          upiId: res[0].UpiId || res[0].UPI || 'satta365@upi',
          name: res[0].Name || 'SATTA 365',
        });
      }
    } catch (e) {
      //
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiData.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const numPoints = parseInt(points, 10);
    if (isNaN(numPoints) || numPoints < MIN_DEPOSIT_POINTS) {
      setErrorMsg(`Minimum deposit amount is ₹${MIN_DEPOSIT_POINTS}.`);
      return;
    }

    if (!isValidUtr(utr)) {
      setErrorMsg('Please enter a valid 12-digit UTR / UPI Reference Number.');
      return;
    }

    setLoading(true);
    try {
      await drawerService.addPoints(userPhone, numPoints, utr);
      try {
        await homeService.sendNotification(
          'Money Add Request!',
          'Someone wants to send you a Add Money Request'
        );
      } catch (notificationError) {
        console.warn('Deposit notification request failed:', notificationError.message);
      }
      await refreshBalance();
      setSuccessModal(true);
      setUtr('');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit payment request.');
    } finally {
      setLoading(false);
    }
  };

  const upiIntentUrl = `upi://pay?pa=${upiData.upiId}&pn=${encodeURIComponent(upiData.name)}&am=${points || 100}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiIntentUrl)}`;

  return (
    <div style={{ padding: '14px 12px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
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
              ADD CASH / POINTS
            </h2>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Instant UPI Deposit</div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Current Balance</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#15803d' }}>
            ₹{balance.total.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {errorMsg && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', padding: '8px 12px', borderRadius: 6, color: '#b91c1c', fontSize: '0.82rem', marginBottom: 12 }}>
          {errorMsg}
        </div>
      )}

      {/* UPI Details Box */}
      <div style={{ background: 'white', borderRadius: 12, padding: 16, boxShadow: 'var(--shadow-sm)', marginBottom: 14 }}>
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>STEP 1: PAY TO ADMIN UPI</div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              padding: '8px 14px',
              borderRadius: 8,
              marginTop: 8,
            }}
          >
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary-color)' }}>
              {upiData.upiId}
            </span>
            <button
              type="button"
              onClick={handleCopyUpi}
              style={{
                background: 'none',
                border: 'none',
                color: copied ? '#16a34a' : 'var(--primary-light)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
        </div>

        {/* QR Code */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, margin: '10px 0' }}>
          <div style={{ padding: 6, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, boxShadow: 'var(--shadow-sm)' }}>
            <img
              src={qrCodeUrl}
              alt="UPI QR Code"
              style={{ width: 150, height: 150, display: 'block' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Scan with GPay, PhonePe, or Paytm</span>
        </div>

        <a
          href={upiIntentUrl}
          style={{
            display: 'block',
            textAlign: 'center',
            background: 'var(--primary-color)',
            color: 'white',
            textDecoration: 'none',
            padding: '10px',
            borderRadius: 6,
            fontSize: '0.85rem',
            fontWeight: 700,
            marginTop: 6,
          }}
        >
          Open UPI Payment App Directly
        </a>
      </div>

      {/* Step 2 Form */}
      <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: 12, padding: 16, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600, marginBottom: 12 }}>
          STEP 2: SUBMIT TRANSACTION DETAILS
        </div>

        <Input
          label="Deposit Amount (₹)"
          type="number"
          placeholder="Min ₹100"
          value={points}
          onChange={(e) => setPoints(e.target.value.replace(/\D/g, ''))}
          required
        />

        {/* Preset Amounts */}
        <div style={{ display: 'flex', gap: 6, margin: '6px 0 14px', overflowX: 'auto' }}>
          {[100, 200, 500, 1000, 2000, 5000].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setPoints(String(amt))}
              style={{
                padding: '4px 8px',
                borderRadius: 4,
                border: points === String(amt) ? '1px solid var(--gold-color)' : '1px solid #cbd5e1',
                background: points === String(amt) ? '#fef9c3' : '#f8fafc',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ₹{amt}
            </button>
          ))}
        </div>

        <Input
          label="12-Digit UTR / Transaction ID"
          placeholder="e.g. 402837194829"
          maxLength={12}
          value={utr}
          onChange={(e) => setUtr(e.target.value.replace(/\D/g, '').slice(0, 12))}
          required
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '10px 0 14px', fontSize: '0.75rem', color: '#64748b' }}>
          <ShieldCheck size={16} color="#16a34a" />
          <span>Points will be credited automatically within 5-10 minutes after verification.</span>
        </div>

        <Button
          type="submit"
          variant="gold"
          fullWidth
          loading={loading}
        >
          Submit Deposit Request
        </Button>
      </form>

      {/* Success Modal */}
      <Modal
        isOpen={successModal}
        onClose={() => setSuccessModal(false)}
        title="Deposit Request Submitted"
        footer={
          <Button
            variant="primary"
            fullWidth
            onClick={() => {
              setSuccessModal(false);
              navigate('/wallet/statement');
            }}
          >
            View Statement
          </Button>
        }
      >
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <CheckCircle size={48} color="#16a34a" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#16a34a' }}>Request Received!</h4>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 6 }}>
            Your deposit request has been submitted. Our automated system is verifying the transaction reference.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default AddFunds;
