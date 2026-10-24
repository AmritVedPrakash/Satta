import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { drawerService } from '../services/drawerService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userPhone, setUserPhone] = useState(() => localStorage.getItem('satta_phone') || null);
  const [randomKey, setRandomKey] = useState(() => localStorage.getItem('satta_random_key') || null);
  const [balance, setBalance] = useState({ total: 1000, deposit: 500, withdraw: 500 });
  const [loading, setLoading] = useState(true);

  const isLoggedIn = Boolean(userPhone);

  const refreshBalance = useCallback(async () => {
    if (!userPhone) return;
    try {
      const res = await drawerService.displayFunds(userPhone);
      if (Array.isArray(res) && res.length > 0) {
        const item = res[0];
        const rawDep = item.Points !== undefined && item.Points !== null ? item.Points : (item.DepositPoints ?? 0);
        const rawWin = item.WithdrawPoints !== undefined && item.WithdrawPoints !== null ? item.WithdrawPoints : (item.WinningPoints ?? 0);
        const dep = parseInt(rawDep, 10) || 0;
        const win = parseInt(rawWin, 10) || 0;
        setBalance({
          total: dep + win,
          deposit: dep,
          withdraw: win,
        });
      }
    } catch (err) {
      // Retain balance on network error
    }
  }, [userPhone]);

  const loginUser = (phone, key = 'active_key') => {
    setUserPhone(phone);
    setRandomKey(key);
    localStorage.setItem('satta_phone', phone);
    localStorage.setItem('satta_random_key', key);
  };

  const logoutUser = (reason = '') => {
    setUserPhone(null);
    setRandomKey(null);
    setBalance({ total: 0, deposit: 0, withdraw: 0 });
    localStorage.removeItem('satta_phone');
    localStorage.removeItem('satta_random_key');
    if (reason) {
      console.warn('Session ended:', reason);
    }
  };

  // Check random key for single-device login enforcement (only when live server returns distinct session)
  useEffect(() => {
    if (!userPhone) {
      setLoading(false);
      return;
    }

    refreshBalance();

    const interval = setInterval(async () => {
      try {
        const res = await authService.getSecure(userPhone);
        if (Array.isArray(res) && res.length > 0) {
          const serverKey = res[0]?.RandomKey;
          const currentLocalKey = localStorage.getItem('satta_random_key');
          
          // Only trigger if a genuine server key exists, is not a local fallback, and differs from current session
          if (
            currentLocalKey &&
            serverKey &&
            serverKey !== 'active_key' &&
            !serverKey.startsWith('fallback_') &&
            currentLocalKey !== 'active_key' &&
            currentLocalKey !== serverKey
          ) {
            logoutUser('Your account was logged in on another device.');
          }
        }
      } catch (e) {
        // Silent fail on network error - never kick user out on network failure
      }
    }, 60000);

    setLoading(false);
    return () => clearInterval(interval);
  }, [userPhone, refreshBalance]);

  return (
    <AuthContext.Provider
      value={{
        userPhone,
        isLoggedIn,
        randomKey,
        balance,
        loginUser,
        logoutUser,
        refreshBalance,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
