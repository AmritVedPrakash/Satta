import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { drawerService } from '../services/drawerService';
import { MIN_WITHDRAW_POINTS } from '../utils/constants';
import { isWithdrawalOpen } from '../utils/validators';
import { ArrowLeft, Clock, AlertTriangle, CheckCircle, Landmark, Smartphone } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';

export const WithdrawFunds = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userPhone, balance, refreshBalance } = useAuth();

  const [points, setPoints] = useState('');
  const [method, setMethod] = useState('UPI'); // 'UPI' | 'BANK' | 'PAYTM'
  const [upiId, setUpiId] = useState('');
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    ifsc: '',
    holderName: '',
  });
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isOpenNow = isWithdrawalOpen();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isOpenNow) {
      setErrorMsg('Withdrawal window is closed. Operating hours are 9:00 AM to 11:30 PM daily.');
      return;
    }

    const numPoints = parseInt(points, 10);
    if (isNaN(numPoints) || numPoints < MIN_WITHDRAW_POINTS) {
      setErrorMsg(`Minimum withdrawal amount is ₹${MIN_WITHDRAW_POINTS}.`);
      return;
    }

    if (numPoints > balance.withdraw) {
      setErrorMsg(
        `Insufficient winning balance. Available for withdrawal: ₹${balance.withdraw}. (Deposit cash cannot be directly withdrawn).`
      );
      return;
    }

    let detailString = '';
    if (method === 'UPI' || method === 'PAYTM') {
      if (!upiId) {
        setErrorMsg('Please enter your UPI ID or number.');
        return;
      }
      detailString = `${method}: ${upiId}`;
    } else {
      if (!bankDetails.accountNumber || !bankDetails.ifsc || !bankDetails.holderName) {
        setErrorMsg('Please fill in complete bank account details.');
        return;
      }
      detailString = `Bank: ${bankDetails.accountNumber}, IFSC: ${bankDetails.ifsc}, Name: ${bankDetails.holderName}`;
    }

    setLoading(true);
    try {
      await drawerService.withdrawPoints(userPhone, numPoints, method, detailString);
      await refreshBalance();
      setSuccessModal(true);
      setPoints('');
    } catch (err) {
      setErrorMsg(err.message || 'Withdrawal request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '14px 12px' }}>
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
              WITHDRAW CASH
            </h2>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Fast Direct Payouts</div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Withdrawable</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#15803d' }}>
            ₹{balance.withdraw.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Withdrawal Window Timing Notice */}
      <div
        style={{
          background: isOpenNow ? '#f0fdf4' : '#fffbeb',
          border: `1px solid ${isOpenNow ? '#bbf7d0' : '#fde68a'}`,
          borderRadius: 8,
          padding: '10px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 12,
        }}
      >
        <Clock size={20} color={isOpenNow ? '#16a34a' : '#d97706'} />
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isOpenNow ? '#16a34a' : '#d97706' }}>
            Timing: 09:00 AM - 11:30 PM Everyday
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {isOpenNow ? 'Withdrawal requests are currently being processed.' : 'Window currently closed. Please request during open hours.'}
          </div>
        </div>
      </div>

      {errorMsg && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', padding: '8px 12px', borderRadius: 6, color: '#b91c1c', fontSize: '0.82rem', marginBottom: 12 }}>
          {errorMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: 12, padding: 16, boxShadow: 'var(--shadow-sm)' }}>
        <Input
          label="Withdrawal Amount (₹)"
          type="number"
          placeholder="Min ₹460"
          value={points}
          onChange={(e) => setPoints(e.target.value.replace(/\D/g, ''))}
          required
        />

        {/* Payment Method Selector */}
        <div style={{ marginBottom: 14 }}>
          <label className="form-label">Select Payout Method</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[
              { id: 'UPI', label: 'UPI / VPA' },
              { id: 'PAYTM', label: 'Paytm Wallet' },
              { id: 'BANK', label: 'Bank Transfer' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                style={{
                  padding: '10px 4px',
                  borderRadius: 8,
                  border: method === m.id ? '2px solid var(--primary-color)' : '1px solid #cbd5e1',
                  background: method === m.id ? '#ecfdf5' : 'white',
                  color: method === m.id ? 'var(--primary-color)' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {method === 'UPI' || method === 'PAYTM' ? (
          <Input
            label={method === 'UPI' ? 'Enter UPI ID (e.g. name@okhdfcbank)' : 'Enter Paytm Registered Mobile'}
            placeholder={method === 'UPI' ? 'username@upi' : '10-digit mobile number'}
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            required
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Input
              label="Account Holder Name"
              placeholder="As on passbook"
              value={bankDetails.holderName}
              onChange={(e) => setBankDetails({ ...bankDetails, holderName: e.target.value })}
              required
            />
            <Input
              label="Account Number"
              placeholder="Bank account number"
              value={bankDetails.accountNumber}
              onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
              required
            />
            <Input
              label="IFSC Code"
              placeholder="e.g. SBIN0001234"
              value={bankDetails.ifsc}
              onChange={(e) => setBankDetails({ ...bankDetails, ifsc: e.target.value.toUpperCase() })}
              required
            />
          </div>
        )}

        <Button
          type="submit"
          variant="gold"
          fullWidth
          loading={loading}
          disabled={!isOpenNow || balance.withdraw < MIN_WITHDRAW_POINTS}
        >
          Request Withdrawal
        </Button>
      </form>

      {/* Success Modal */}
      <Modal
        isOpen={successModal}
        onClose={() => setSuccessModal(false)}
        title="Request Submitted"
        footer={
          <Button
            variant="primary"
            fullWidth
            onClick={() => {
              setSuccessModal(false);
              navigate('/wallet/statement');
            }}
          >
            Check Status
          </Button>
        }
      >
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <CheckCircle size={48} color="#16a34a" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#16a34a' }}>Withdrawal Processing!</h4>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 6 }}>
            Your withdrawal request has been placed. Amount will be credited to your payout destination promptly.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default WithdrawFunds;

