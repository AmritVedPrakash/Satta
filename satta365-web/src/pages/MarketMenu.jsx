import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Hash, Dices, Shuffle, Grid } from 'lucide-react';

const GAME_TYPES = [
  {
    id: 'haruf',
    title: 'Single Digit (Haruf)',
    desc: 'Bet on single numbers (0-9) for Open or Close',
    path: '/bets/haruf',
    icon: <Hash size={24} color="#16a34a" />,
  },
  {
    id: 'jantri',
    title: 'Jodi Digit (Jantri)',
    desc: 'Bet on two-digit combinations (00-99)',
    path: '/bets/jodi',
    icon: <Dices size={24} color="#ea580c" />,
  },
  {
    id: 'crossing',
    title: 'Crossing (Jodi Generator)',
    desc: 'Create all possible jodi combinations quickly',
    path: '/bets/crossing',
    icon: <Shuffle size={24} color="#2563eb" />,
  },
  {
    id: 'quick',
    title: 'Quick Range',
    desc: 'Place bets across digit series instantly',
    path: '/bets/quick-range',
    icon: <Grid size={24} color="#9333ea" />,
  },
];

export const MarketMenu = () => {
  const { gameId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const game = location.state?.game || {
    Gamename: decodeURIComponent(gameId || 'MARKET'),
    GameName: decodeURIComponent(gameId || 'MARKET'),
    GameId: gameId,
  };

  const marketName =
    game.Gamename || game.GameName || game.name || decodeURIComponent(gameId || 'MARKET');

  const handleSelectGame = (item) => {
    navigate(item.path, {
      state: {
        game,
        gameId: game.GameId || gameId,
        gameName: marketName,
      },
    });
  };

  return (
    <div style={{ padding: '14px 12px' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="header-icon-btn"
          style={{ background: '#e2e8f0', color: '#1e293b' }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-color)', margin: 0 }}>
            SELECT GAME TYPE
          </h2>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Choose a game mode to place your bid
          </div>
        </div>
      </div>

      {/* Market Name Badge */}
      <div
        style={{
          background: 'var(--primary-gradient)',
          color: 'white',
          borderRadius: 10,
          padding: '10px 16px',
          marginBottom: 16,
          fontSize: '0.9rem',
          fontWeight: 700,
          borderBottom: '2px solid var(--gold-color)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        📍 {marketName}
      </div>

      {/* Game Type List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {GAME_TYPES.map((item) => (
          <div
            key={item.id}
            onClick={() => handleSelectGame(item)}
            style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--gold-color)';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {item.icon}
            </div>

            {/* Text */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                {item.desc}
              </div>
            </div>

            {/* Arrow */}
            <ChevronRight size={18} color="#94a3b8" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketMenu;
