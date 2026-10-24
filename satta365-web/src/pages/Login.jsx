import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { isValidPhone, isValidPassword } from '../utils/validators';
import { Phone, Lock, LogIn } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import ErrorMessage from '../components/common/ErrorMessage';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useAuth();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(location.state?.success || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isValidPhone(phone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.login(phone, password);
      const randomKey = res?.[0]?.RandomKey || res?.RandomKey || `key_${Date.now()}`;
      loginUser(phone, randomKey);
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px 16px', maxWidth: 400, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <img
          src="/images/logo.png"
          alt="Satta365"
          style={{ width: 80, height: 80, objectFit: 'contain', margin: '0 auto 12px' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <h1 style={{ fontSize: '1.4rem', color: 'var(--primary-color)', fontWeight: 800 }}>
          Welcome to SATTA365
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Enter your login credentials to continue
        </p>
      </div>

      <ErrorMessage message={error} />
      {success && (
        <div style={{ padding: 12, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, color: '#16a34a', fontSize: '0.85rem', marginBottom: 14 }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: 'white', padding: 20, borderRadius: 12, boxShadow: 'var(--shadow-md)' }}>
        <Input
          label="Mobile Number"
          name="phone"
          type="tel"
          placeholder="10-digit phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
          icon={<Phone size={18} />}
          required
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock size={18} />}
          required
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Link
            to="/forgot-password"
            style={{ color: 'var(--primary-light)', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="gold"
          fullWidth
          loading={loading}
          icon={<LogIn size={18} />}
        >
          Sign In
        </Button>
      </form>

      <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
        Don't have an account?{' '}
        <Link
          to="/register"
          style={{ color: 'var(--primary-light)', fontWeight: 700, textDecoration: 'none' }}
        >
          Register Now
        </Link>
      </div>
    </div>
  );
};

export default Login;
