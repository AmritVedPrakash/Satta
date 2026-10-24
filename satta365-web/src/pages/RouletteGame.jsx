import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import { homeService } from '../services/homeService';
import RouletteWheel from '../components/roulette/RouletteWheel';
import Last15Ticker from '../components/roulette/Last15Ticker';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { ArrowLeft, BarChart2, Clock, CheckCircle, Disc, ShieldCheck, Zap } from 'lucide-react';

export const RouletteGame = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userPhone, balance, refreshBalance } = useAuth();
  const { playEffect } = useSound();

  const [last15, setLast15] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(180);
  const [selectedChips, setSelectedChips] = useState({});
  const [currentChipValue, setCurrentChipValue] = useState(10);
  const [spinning, setSpinning] = useState(false);
  const [winningNumber, setWinningNumber] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isLockedOut = secondsLeft <= 60;

  useEffect(() => {
    loadRouletteData();
  }, []);

  const loadRouletteData = async () => {
    try {
      const res = await homeService.getRouletteLast15();
      if (Array.isArray(res)) {
        setLast15(res);
      }
    } catch (e) {
      //
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          triggerRoundEnd();
          return 1800;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const triggerRoundEnd = () => {
    const randomWin = Math.floor(Math.random() * 10);
    setWinningNumber(randomWin);
    setSpinning(true);
    playEffect('roulette');
  };

  const handleSpinComplete = () => {
    setSpinning(false);
    loadRouletteData();
    refreshBalance();
    setSelectedChips({});
  };

  const handleSelectBet = (key) => {
    if (isLockedOut) {
      setErrorMsg('Betting is closed for this round! Wait for next round.');
      return;
    }
    setErrorMsg('');
    playEffect('click');

    const currentPts = selectedChips[key] || 0;
    const newTotal = Object.values(selectedChips).reduce((a, b) => a + b, 0) + currentChipValue;

    if (newTotal > balance.total) {
      setErrorMsg('Insufficient wallet balance.');
      return;
    }

    setSelectedChips((prev) => ({
      ...prev,
      [key]: currentPts + currentChipValue,
    }));
  };

  const handleClearBets = () => {
    setSelectedChips({});
    setErrorMsg('');
  };

  const totalPoints = Object.values(selectedChips).reduce((a, b) => a + b, 0);

  const handlePlaceBets = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (totalPoints === 0) return;
    if (isLockedOut) {
      setErrorMsg('Betting closed for current round.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const betsArray = Object.entries(selectedChips).map(([num, pts]) => ({
        GameName: 'ROULETTE MATKA',
        GameId: 'ROULETTE',
        Number: num,
        Points: pts,
        GameType: 'Roulette',
        Session: 'Round',
        UserPhone: userPhone,
        Date: new Date().toISOString(),
      }));

      await homeService.placeRouletteBet(userPhone, betsArray);
      await refreshBalance();
      setSelectedChips({});
      setSuccessModal(true);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to place roulette bet.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', background: '#031908', borderRadius: 16, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '1px solid #16401d', color: 'white' }}>
      {/* Top Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #002906, #064e0b)',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #d4af37',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="header-icon-btn"
            style={{ color: '#fff' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--gold-light)' }}>
                ROULETTE MATKA
              </h2>
              <span style={{ background: '#dc2626', color: '#fff', fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: 10 }}>
                9x MULTIPLIER
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>Live 30-Min Rounds • Real-Time Spinning Wheel</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            onClick={() => navigate('/roulette/chart')}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid #cbd5e1',
              color: 'white',
              borderRadius: 8,
              padding: '6px 14px',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            <BarChart2 size={16} />
            <span>Round History</span>
          </button>

          <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--gold-color)', padding: '4px 12px', borderRadius: 8, textAlign: 'right' }}>
            <div style={{ fontSize: '0.68rem', color: '#cbd5e1' }}>Wallet Points</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--gold-color)' }}>
              ₹{balance.total.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Last 15 Ticker */}
      <Last15Ticker results={last15} />

      {/* Countdown Timer Strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 20px',
          background: isLockedOut ? '#7f1d1d' : '#072b0c',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          transition: 'background 0.3s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', fontWeight: 700 }}>
          <Clock size={18} color={isLockedOut ? '#f87171' : 'var(--gold-color)'} />
          <span>{isLockedOut ? 'BETTING LOCKED - SPINNING IMMINENT' : 'NEXT SPIN COUNTDOWN:'}</span>
        </div>
        <div
          style={{
            fontSize: '1.4rem',
            fontWeight: 900,
            letterSpacing: 1.5,
            color: isLockedOut ? '#fee2e2' : 'var(--gold-light)',
          }}
        >
          {formatTimer(secondsLeft)}
        </div>
      </div>

      {/* Desktop 2-Column Split: Wheel on Left, Betting Board on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 24, padding: '24px 20px', alignItems: 'center' }} className="roulette-desktop-split">
        {/* Left Column: Animated Wheel */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.25)', padding: 24, borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
          <RouletteWheel
            spinning={spinning}
            winningNumber={winningNumber}
            onSpinComplete={handleSpinComplete}
          />

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>
              {spinning ? 'Wheel is spinning! Good luck!' : 'Wheel spins automatically at round completion'}
            </span>
          </div>
        </div>

        {/* Right Column: Betting Grid & Controls */}
        <div>
          {errorMsg && (
            <div
              style={{
                marginBottom: 16,
                padding: '10px 14px',
                background: '#7f1d1d',
                border: '1px solid #ef4444',
                borderRadius: 8,
                color: '#fecaca',
                fontSize: '0.85rem',
                textAlign: 'center',
              }}
            >
              {errorMsg}
            </div>
          )}

          {/* Chip Value Picker */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 700, marginBottom: 8 }}>
              SELECT CHIP DENOMINATION:
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {[10, 50, 100, 500, 1000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setCurrentChipValue(val)}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    borderRadius: 20,
                    border: currentChipValue === val ? '2px solid #ffd700' : '1px solid #334155',
                    background:
                      currentChipValue === val
                        ? 'linear-gradient(135deg, #d97706, #b45309)'
                        : '#0f172a',
                    color: 'white',
                    fontWeight: 900,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    boxShadow: currentChipValue === val ? '0 0 12px rgba(255, 215, 0, 0.4)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  ₹{val}
                </button>
              ))}
            </div>
          </div>

          {/* Numbers Board (0-9) */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 700, marginBottom: 8 }}>
              DIRECT NUMBER (9X PAYOUT):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => {
                const betPts = selectedChips[String(num)] || 0;
                const isRed = num !== 0 && num % 2 === 0;
                const isGreen = num === 0;

                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleSelectBet(String(num))}
                    disabled={isLockedOut}
                    style={{
                      position: 'relative',
                      padding: '16px 0',
                      borderRadius: 10,
                      border: betPts > 0 ? '2px solid #ffd700' : '1px solid rgba(255,255,255,0.2)',
                      background: isGreen ? '#15803d' : isRed ? '#dc2626' : '#1e293b',
                      color: 'white',
                      fontWeight: 900,
                      fontSize: '1.35rem',
                      cursor: isLockedOut ? 'not-allowed' : 'pointer',
                      opacity: isLockedOut ? 0.6 : 1,
                      boxShadow: betPts > 0 ? '0 0 10px rgba(255, 215, 0, 0.5)' : 'none',
                    }}
                  >
                    {num}
                    {betPts > 0 && (
                      <span
                        style={{
                          position: 'absolute',
                          top: -6,
                          right: -6,
                          background: '#ffd700',
                          color: '#002906',
                          borderRadius: '50%',
                          padding: '2px 6px',
                          fontSize: '0.72rem',
                          fontWeight: 900,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                        }}
                      >
                        ₹{betPts}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Outside Bets (Even, Odd, Red, Black) */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 700, marginBottom: 8 }}>
              OUTSIDE BETS (2X PAYOUT):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {['EVEN', 'ODD', 'RED', 'BLACK'].map((betKey) => {
                const betPts = selectedChips[betKey] || 0;
                return (
                  <button
                    key={betKey}
                    type="button"
                    onClick={() => handleSelectBet(betKey)}
                    disabled={isLockedOut}
                    style={{
                      position: 'relative',
                      padding: '12px 0',
                      borderRadius: 8,
                      border: betPts > 0 ? '2px solid #ffd700' : '1px solid #334155',
                      background: '#0f172a',
                      color: betKey === 'RED' ? '#ef4444' : 'white',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: isLockedOut ? 'not-allowed' : 'pointer',
                      opacity: isLockedOut ? 0.6 : 1,
                    }}
                  >
                    {betKey}
                    {betPts > 0 && (
                      <span
                        style={{
                          position: 'absolute',
                          top: -6,
                          right: -6,
                          background: '#ffd700',
                          color: '#002906',
                          borderRadius: '50%',
                          padding: '2px 5px',
                          fontSize: '0.68rem',
                          fontWeight: 900,
                        }}
                      >
                        ₹{betPts}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Strip */}
          <div
            style={{
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 12,
              padding: 16,
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Total Bet Points:</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--gold-color)' }}>
                  ₹{totalPoints}
                </div>
              </div>

              {totalPoints > 0 && (
                <button
                  type="button"
                  onClick={handleClearBets}
                  style={{
                    background: 'none',
                    border: '1px solid #ef4444',
                    color: '#ef4444',
                    borderRadius: 8,
                    padding: '6px 14px',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    fontWeight: 700,
                  }}
                >
                  Clear All Bets
                </button>
              )}
            </div>

            <Button
              type="button"
              variant="gold"
              fullWidth
              disabled={totalPoints === 0 || isLockedOut || totalPoints > balance.total}
              loading={submitting}
              onClick={handlePlaceBets}
              style={{ padding: '12px 20px', fontSize: '1rem' }}
            >
              {isLockedOut ? 'Round Locked (Wait for Spin)' : `Place Live Bets (₹${totalPoints})`}
            </Button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={successModal}
        onClose={() => setSuccessModal(false)}
        title="Bet Placed Successfully"
        footer={
          <Button variant="primary" fullWidth onClick={() => setSuccessModal(false)}>
            Continue
          </Button>
        }
      >
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <CheckCircle size={48} color="#16a34a" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#16a34a' }}>Roulette Bets Placed!</h4>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: 6 }}>
            Good luck! Winning number will be revealed when the wheel finishes spinning.
          </p>
        </div>
      </Modal>

      <style>{`
        @media (max-width: 900px) {
          .roulette-desktop-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default RouletteGame;
