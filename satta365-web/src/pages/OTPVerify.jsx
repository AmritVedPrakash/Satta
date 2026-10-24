import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { KeyRound, CheckCircle } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import ErrorMessage from '../components/common/ErrorMessage';

export const OTPVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const flowState = location.state || {};
  const { flow, phone = '', otp: expectedOtp = '' } = flowState;
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [info, setInfo] = useState(
    phone ? `OTP sent to +91 ${phone}` : 'Return to registration or password reset to request an OTP.'
  );

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');

    if (!phone || !expectedOtp) {
      setError('OTP session expired. Please request a new OTP.');
      return;
    }
    if (otp !== expectedOtp) {
      setError('Invalid OTP. Please check and try again.');
      return;
    }

    setLoading(true);
    try {
      if (flow === 'register') {
        const regRes = await authService.register({
          name: flowState.name,
          phone,
          password: flowState.password,
        });
        loginUser(phone, regRes?.randomKey || `key_${Date.now()}`);
        navigate('/', { replace: true });
      } else if (flow === 'forgot-password') {
        await authService.forgotPassword(phone, flowState.password);
        navigate('/login', {
          replace: true,
          state: { success: 'Password reset successfully. Please sign in with your new password.' },
        });
      } else {
        setError('Invalid OTP flow. Please start again.');
      }
    } catch (err) {
      setError(err.message || 'Could not complete your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!phone) return;
    setResending(true);
    setError('');
    try {
      const nextOtp = await authService.sendOtp(phone);
      navigate('/otp-verify', {
        replace: true,
        state: { ...flowState, otp: nextOtp },
      });
      setInfo('A new OTP has been sent to your phone.');
    } catch (err) {
      setError(err.message || 'Failed to resend OTP. Please try again in 1 minute.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={{ padding: '24px 16px', maxWidth: 400, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: '1.4rem', color: 'var(--primary-color)', fontWeight: 800 }}>
          Verify OTP
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          {info}
          {expectedOtp && (
            <span style={{ display: 'block', marginTop: 6, color: '#b45309', background: '#fef3c7', padding: '4px 8px', borderRadius: 6, fontWeight: 700 }}>
              Verification Code: {expectedOtp}
            </span>
          )}
        </p>
      </div>

      <ErrorMessage message={error} />

      <form onSubmit={handleVerify} style={{ background: 'white', padding: 20, borderRadius: 12, boxShadow: 'var(--shadow-md)' }}>
        <Input
          label="Enter OTP"
          name="otp"
          type="number"
          placeholder="Enter 4 or 6 digit code"
          value={otp}
          onChange={(e) => setOtp(e.target.value.slice(0, 6))}
          icon={<KeyRound size={18} />}
          required
        />

        <Button
          type="submit"
          variant="gold"
          fullWidth
          loading={loading}
          icon={<CheckCircle size={18} />}
        >
          {flow === 'forgot-password' ? 'Verify & Reset Password' : 'Verify & Continue'}
        </Button>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || !phone}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary-light)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            {resending ? 'Sending...' : "Didn't receive OTP? Resend"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OTPVerify;
