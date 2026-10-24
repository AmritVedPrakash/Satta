import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Disc, PlusCircle, Clock, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <nav className="bottom-nav">
      <NavLink
        to="/"
        end
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <Home size={20} />
        <span>{t('home') || 'Home'}</span>
      </NavLink>

      <NavLink
        to="/roulette"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <Disc size={20} />
        <span>Roulette</span>
      </NavLink>

      <NavLink
        to="/wallet/add"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <PlusCircle size={20} color="#16a34a" />
        <span>Add Cash</span>
      </NavLink>

      <NavLink
        to="/history/bids"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <Clock size={20} />
        <span>History</span>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <User size={20} />
        <span>{t('profile') || 'Profile'}</span>
      </NavLink>
    </nav>
  );
};

export default Footer;

