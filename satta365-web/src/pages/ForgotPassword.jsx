import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { isValidPhone, isValidPassword } from '../utils/validators';
import { Phone, ArrowLeft, Send, Lock } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import ErrorMessage from '../components/common/ErrorMessage';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidPhone(phone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!isValidPassword(password)) {
      setError('Password must be at least 4 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const otp = await authService.sendOtp(phone);
      navigate('/otp-verify', {
        state: { flow: 'forgot-password', phone, password, otp },
      });
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px 16px', maxWidth: 400, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <button
          type="button"
          onClick={() => navigate('/login')}
          style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} /> Back to Login
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: '1.4rem', color: 'var(--primary-color)', fontWeight: 800 }}>
          Reset Password
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Enter your registered mobile number and new password. We will send an OTP before resetting it.
        </p>
      </div>

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} style={{ background: 'white', padding: 20, borderRadius: 12, boxShadow: 'var(--shadow-md)' }}>
        <Input
          label="Registered Mobile Number"
          name="phone"
          type="tel"
          placeholder="10-digit phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
          icon={<Phone size={18} />}
          required
        />

        <Input
          label="New Password"
          name="password"
          type="password"
          placeholder="Create a new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock size={18} />}
          required
        />

        <Input
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          placeholder="Re-enter your new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          icon={<Lock size={18} />}
          required
        />

        <Button
          type="submit"
          variant="gold"
          fullWidth
          loading={loading}
          icon={<Send size={18} />}
        >
          Send OTP Code
        </Button>
      </form>
    </div>
  );
};

export default ForgotPassword;
