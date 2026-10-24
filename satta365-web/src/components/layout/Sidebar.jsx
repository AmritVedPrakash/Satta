import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  User,
  PlusCircle,
  ArrowDownToLine,
  FileText,
  Clock,
  Trophy,
  Percent,
  Bell,
  HelpCircle,
  Share2,
  Headphones,
  LogOut,
  LogIn,
  Disc,
  Sparkles,
  Layers,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { isLoggedIn, userPhone, balance, logoutUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNav = (path) => {
    onClose();
    navigate(path);
  };

  const handleLogout = () => {
    onClose();
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1, color: 'var(--gold-color)' }}>
              Satta365 Official
            </span>
            <button
              type="button"
              className="header-icon-btn"
              onClick={onClose}
              style={{ color: '#fff' }}
            >
              <X size={20} />
            </button>
          </div>

          {isLoggedIn ? (
            <div>
              <div className="drawer-user-phone">+91 {userPhone}</div>
              <div className="drawer-user-balance">
                Total Balance: <strong>₹{balance.total.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: 2 }}>
                Deposit: ₹{balance.deposit} | Win: ₹{balance.withdraw}
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: '0.9rem', color: '#fff' }}>Welcome Guest</div>
              <button
                type="button"
                className="btn btn-gold"
                style={{ marginTop: 8, padding: '4px 12px', fontSize: '0.8rem' }}
                onClick={() => handleNav('/login')}
              >
                <LogIn size={14} /> Login / Register
              </button>
            </div>
          )}
        </div>

        <nav className="drawer-links">
          <div className="drawer-item" onClick={() => handleNav('/')}>
            <Home size={18} /> {t('home') || 'Home'}
          </div>

          <div className="drawer-item" onClick={() => handleNav('/roulette')}>
            <Disc size={18} color="#eab308" /> Roulette Matka
          </div>

          <div className="drawer-item" onClick={() => handleNav('/gali-disawar')}>
            <Layers size={18} color="#3b82f6" /> Gali Disawar
          </div>

          {/* <div className="drawer-item" onClick={() => handleNav('/starline')}>
            <Sparkles size={18} color="#ec4899" /> Starline Games
          </div> */}

          <div style={{ height: 1, background: '#f1f5f9', margin: '6px 0' }} />

          <div className="drawer-item" onClick={() => handleNav('/wallet/add')}>
            <PlusCircle size={18} color="#16a34a" /> {t('add_points') || 'Add Funds'}
          </div>

          <div className="drawer-item" onClick={() => handleNav('/wallet/withdraw')}>
            <ArrowDownToLine size={18} color="#ea580c" /> {t('withdraw_points') || 'Withdraw Funds'}
          </div>

          <div className="drawer-item" onClick={() => handleNav('/wallet/statement')}>
            <FileText size={18} /> {t('wallet_statement') || 'Wallet Statement'}
          </div>

          <div className="drawer-item" onClick={() => handleNav('/history/bids')}>
            <Clock size={18} /> {t('bid_history') || 'Bid History'}
          </div>

          <div className="drawer-item" onClick={() => handleNav('/history/wins')}>
            <Trophy size={18} color="#eab308" /> {t('win_history') || 'Win History'}
          </div>

          <div style={{ height: 1, background: '#f1f5f9', margin: '6px 0' }} />

          <div className="drawer-item" onClick={() => handleNav('/rates')}>
            <Percent size={18} /> {t('game_rates') || 'Game Rates'}
          </div>

          <div className="drawer-item" onClick={() => handleNav('/notice')}>
            <Bell size={18} /> {t('notices') || 'Notice Board'}
          </div>

          <div className="drawer-item" onClick={() => handleNav('/how-to-play')}>
            <HelpCircle size={18} /> {t('how_to_play') || 'How To Play'}
          </div>

          <div className="drawer-item" onClick={() => handleNav('/refer')}>
            <Share2 size={18} /> Refer & Earn
          </div>

          <div className="drawer-item" onClick={() => handleNav('/support')}>
            <Headphones size={18} color="#25d366" /> Customer Support
          </div>

          <div className="drawer-item" onClick={() => handleNav('/profile')}>
            <User size={18} /> {t('profile') || 'My Profile'}
          </div>

          <div style={{ height: 1, background: '#f1f5f9', margin: '6px 0' }} />

          {isLoggedIn ? (
            <div
              className="drawer-item"
              onClick={handleLogout}
              style={{ color: 'var(--accent-red)' }}
            >
              <LogOut size={18} /> {t('logout') || 'Logout'}
            </div>
          ) : (
            <div className="drawer-item" onClick={() => handleNav('/login')}>
              <LogIn size={18} /> Login
            </div>
          )}
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;

