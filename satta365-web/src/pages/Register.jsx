import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { isValidPhone, isValidPassword, isValidName } from '../utils/validators';
import { User, Phone, Lock, Tag, UserPlus } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import ErrorMessage from '../components/common/ErrorMessage';

export const Register = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidName(formData.name)) {
      setError('Please enter a valid full name (at least 3 characters).');
      return;
    }
    if (!isValidPhone(formData.phone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!isValidPassword(formData.password)) {
      setError('Password must be at least 4 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const otp = await authService.sendOtp(formData.phone);

      navigate('/otp-verify', {
        state: {
          flow: 'register',
          phone: formData.phone,
          name: formData.name,
          password: formData.password,
          otp,
        },
      });
    } catch (err) {
      setError(err.message || 'Could not send the OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px 16px', maxWidth: 400, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: '1.4rem', color: 'var(--primary-color)', fontWeight: 800 }}>
          Create New Account
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Join SATTA365 and start playing today
        </p>
      </div>

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} style={{ background: 'white', padding: 20, borderRadius: 12, boxShadow: 'var(--shadow-md)' }}>
        <Input
          label="Full Name"
          name="name"
          placeholder="Enter full name"
          value={formData.name}
          onChange={handleChange}
          icon={<User size={18} />}
          required
        />

        <Input
          label="Mobile Number"
          name="phone"
          type="tel"
          placeholder="10-digit phone number"
          value={formData.phone}
          onChange={handleChange}
          icon={<Phone size={18} />}
          required
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Create password"
          value={formData.password}
          onChange={handleChange}
          icon={<Lock size={18} />}
          required
        />

        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Re-enter password"
          value={formData.confirmPassword}
          onChange={handleChange}
          icon={<Lock size={18} />}
          required
        />

        <Input
          label="Referral Code (Optional)"
          name="referralCode"
          placeholder="Enter referral code"
          value={formData.referralCode}
          onChange={handleChange}
          icon={<Tag size={18} />}
        />

        <Button
          type="submit"
          variant="gold"
          fullWidth
          loading={loading}
          icon={<UserPlus size={18} />}
        >
          Register & Continue
        </Button>
      </form>

      <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
        Already have an account?{' '}
        <Link
          to="/login"
          style={{ color: 'var(--primary-light)', fontWeight: 700, textDecoration: 'none' }}
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Register;
