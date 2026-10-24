import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, User, Phone, Wallet, Lock, Share2, LogOut, ShieldCheck } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';

export const Profile = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userPhone, balance, logoutUser } = useAuth();
  const { t } = useLanguage();

  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isLoggedIn) {
    return (
      <div style={{ padding: '40px 16px', textAlign: 'center' }}>
        <User size={64} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
        <h3 style={{ fontSize: '1.2rem', color: '#1e293b', fontWeight: 800 }}>Account Not Logged In</h3>
        <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '8px 0 20px' }}>
          Please sign in to view your profile, balances and history.
        </p>
        <Button variant="gold" onClick={() => navigate('/login')}>
          Sign In / Register
        </Button>
      </div>
    );
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!currentPass || !newPass) {
      setErrorMsg('Please enter both current and new password.');
      return;
    }
    if (newPass.length < 4) {
      setErrorMsg('New password must be at least 4 characters long.');
      return;
    }
    setSuccessMsg('Password changed successfully.');
    setTimeout(() => {
      setChangePasswordModal(false);
      setCurrentPass('');
      setNewPass('');
      setSuccessMsg('');
    }, 1500);
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div style={{ padding: '14px 12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="header-icon-btn"
          style={{ background: '#e2e8f0', color: '#1e293b' }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-color)' }}>
            MY PROFILE
          </h2>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Account Information</div>
        </div>
      </div>

      {/* User Card */}
      <div
        style={{
          background: 'var(--primary-gradient)',
          borderRadius: 12,
          padding: 20,
          color: 'white',
          marginBottom: 16,
          boxShadow: 'var(--shadow-md)',
          borderBottom: '3px solid var(--gold-color)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            border: '2px solid var(--gold-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 10px',
          }}
        >
          <User size={32} color="var(--gold-light)" />
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--gold-light)' }}>
          +91 {userPhone}
        </h3>
        <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Verified User • Active Member</span>

        <div
          style={{
            marginTop: 16,
            background: 'rgba(0,0,0,0.25)',
            borderRadius: 8,
            padding: '10px 14px',
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <div>
            <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Deposit Cash</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>₹{balance.deposit}</div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.2)' }} />
          <div>
            <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Winning Cash</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--gold-color)' }}>
              ₹{balance.withdraw}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links List */}
      <div style={{ background: 'white', borderRadius: 10, overflow: 'hidden', boxShadow: 'var(--shadow-sm)', marginBottom: 16 }}>
        <div
          onClick={() => navigate('/wallet/statement')}
          style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
        >
          <Wallet size={18} color="var(--primary-color)" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>Wallet Statement</span>
        </div>

        <div
          onClick={() => navigate('/refer')}
          style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
        >
          <Share2 size={18} color="#0284c7" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>Refer & Earn</span>
        </div>

        <div
          onClick={() => setChangePasswordModal(true)}
          style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
        >
          <Lock size={18} color="#ca8a04" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>Change Password</span>
        </div>

        <div
          onClick={handleLogout}
          style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', color: '#dc2626' }}
        >
          <LogOut size={18} color="#dc2626" />
          <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Log Out</span>
        </div>
      </div>

      {/* Password Modal */}
      <Modal
        isOpen={changePasswordModal}
        onClose={() => setChangePasswordModal(false)}
        title="Change Password"
      >
        {successMsg && (
          <div style={{ padding: 10, background: '#f0fdf4', color: '#16a34a', borderRadius: 6, fontSize: '0.85rem', marginBottom: 10 }}>
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div style={{ padding: 10, background: '#fef2f2', color: '#b91c1c', borderRadius: 6, fontSize: '0.85rem', marginBottom: 10 }}>
            {errorMsg}
          </div>
        )}
        <form onSubmit={handlePasswordSubmit}>
          <Input
            label="Current Password"
            type="password"
            placeholder="Enter current password"
            value={currentPass}
            onChange={(e) => setCurrentPass(e.target.value)}
            required
          />
          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password (min 4 chars)"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            required
          />
          <Button type="submit" variant="gold" fullWidth>
            Update Password
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;

