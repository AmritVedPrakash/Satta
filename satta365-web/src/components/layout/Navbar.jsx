import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  Globe,
  Volume2,
  VolumeX,
  RefreshCw,
  Wallet,
  User,
  PlusCircle,
  LogOut,
  Disc,
  Layers,
  Sparkles,
  Percent,
  BarChart2,
  Headphones,
  Home as HomeIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSound } from '../../context/SoundContext';

export const Navbar = ({ onOpenDrawer, onOpenLanguage }) => {
  const navigate = useNavigate();
  const { isLoggedIn, userPhone, balance, refreshBalance, logoutUser } = useAuth();
  const { bgMusicEnabled, toggleBgMusic } = useSound();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async (e) => {
    e.stopPropagation();
    setRefreshing(true);
    await refreshBalance();
    setTimeout(() => setRefreshing(false), 500);
  };

  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Left: Mobile Toggle & Brand Logo */}
        <div className="header-left">
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={onOpenDrawer}
            aria-label="Toggle Navigation"
          >
            <Menu size={22} />
          </button>

          <div
            className="app-title"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          >
            <img
              src="/images/logo.png"
              alt="SattaRaddyAnna"
              className="brand-logo-img"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="brand-text-container">
              <span className="brand-main">SATTA<span className="brand-highlight">RaddyAnna</span></span>
              <span className="brand-tag">OFFICIAL</span>
            </div>
          </div>
        </div>

        {/* Center: Desktop Top Navigation Links */}
        <nav className="desktop-nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `desktop-nav-item ${isActive ? 'active' : ''}`}
          >
            <HomeIcon size={16} />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/roulette"
            className={({ isActive }) => `desktop-nav-item ${isActive ? 'active' : ''}`}
          >
            <Disc size={16} color="#eab308" />
            <span>Roulette</span>
            <span className="hot-pill">HOT</span>
          </NavLink>

          <NavLink
            to="/gali-disawar"
            className={({ isActive }) => `desktop-nav-item ${isActive ? 'active' : ''}`}
          >
            <Layers size={16} color="#38bdf8" />
            <span>Gali Disawar</span>
          </NavLink>

          {/* <NavLink
            to="/starline"
            className={({ isActive }) => `desktop-nav-item ${isActive ? 'active' : ''}`}
          >
            <Sparkles size={16} color="#f472b6" />
            <span>Starline</span>
          </NavLink> */}

          <NavLink
            to="/rates"
            className={({ isActive }) => `desktop-nav-item ${isActive ? 'active' : ''}`}
          >
            <Percent size={16} />
            <span>Game Rates</span>
          </NavLink>

          {/* <NavLink
            to="/charts/KALYAN"
            className={({ isActive }) => `desktop-nav-item ${isActive ? 'active' : ''}`}
          >
            <BarChart2 size={16} />
            <span>Panel Charts</span>
          </NavLink> */}

          <NavLink
            to="/support"
            className={({ isActive }) => `desktop-nav-item ${isActive ? 'active' : ''}`}
          >
            <Headphones size={16} color="#4ade80" />
            <span>Support</span>
          </NavLink>
        </nav>

        {/* Right: Controls, Wallet, User Auth */}
        <div className="header-right">
          {/* Sound Toggle */}
          <button
            type="button"
            className="header-icon-btn"
            onClick={toggleBgMusic}
            title={bgMusicEnabled ? 'Mute Music' : 'Play Music'}
          >
            {bgMusicEnabled ? <Volume2 size={18} color="var(--gold-color)" /> : <VolumeX size={18} />}
          </button>

          {/* Language Selector */}
          <button
            type="button"
            className="header-icon-btn"
            onClick={onOpenLanguage}
            title="Change Language"
          >
            <Globe size={18} />
          </button>

          {/* Wallet / Auth */}
          {isLoggedIn ? (
            <div className="logged-in-controls">
              {/* Wallet Chip */}
              <div
                className="desktop-wallet-card"
                onClick={() => navigate('/wallet/add')}
                title="Click to Add Funds"
              >
                <div className="wallet-icon-box">
                  <Wallet size={16} color="var(--gold-color)" />
                </div>
                <div className="wallet-details">
                  <span className="wallet-label">Balance</span>
                  <span className="wallet-amt">₹{balance.total.toLocaleString('en-IN')}</span>
                </div>
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="refresh-btn"
                  title="Refresh Balance"
                >
                  <RefreshCw
                    size={13}
                    style={{
                      transform: refreshing ? 'rotate(360deg)' : 'none',
                      transition: 'transform 0.5s ease',
                    }}
                  />
                </button>
                <button
                  type="button"
                  className="add-cash-chip-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/wallet/add');
                  }}
                >
                  <PlusCircle size={14} />
                  <span>Add</span>
                </button>
              </div>

              {/* Profile Shortcut */}
              <button
                type="button"
                className="user-profile-btn"
                onClick={() => navigate('/profile')}
                title="My Account"
              >
                <User size={16} />
                {/* <span className="user-phone-text">+91 {userPhone ? userPhone.slice(-4) : ''}</span> */}
              </button>

              {/* Quick Logout */}
              <button
                type="button"
                className="header-icon-btn logout-header-btn"
                onClick={() => logoutUser()}
                title="Logout"
              >
                <LogOut size={16} color="#f87171" />
              </button>
            </div>
          ) : (
            <div className="auth-buttons-group">
              <button
                type="button"
                className="btn btn-gold header-login-btn"
                onClick={() => navigate('/login')}
              >
                <User size={15} />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                className="btn btn-outline-gold desktop-only-btn"
                onClick={() => navigate('/register')}
              >
                <span>Register</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
