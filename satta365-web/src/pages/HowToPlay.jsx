import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, BookOpen, CheckCircle } from 'lucide-react';

export const HowToPlay = () => {
  const navigate = useNavigate();

  const guides = [
    {
      title: '1. Single Digit (Haruf)',
      desc: 'Predict any single digit from 0 to 9. You can place your bet on the Open session or Close session. Payout is 10 ka 95.',
      example: 'Example: If you bid ₹10 on digit 7 for Kalyan Open and 7 opens, you win ₹95.',
    },
    {
      title: '2. Jodi Digit',
      desc: 'Predict a 2-digit combination from 00 to 99. The first digit represents the Open result, and the second digit represents the Close result. Payout is 10 ka 950.',
      example: 'Example: If you bid ₹10 on Jodi 47 and Kalyan result is 47, you win ₹950.',
    },
    {
      title: '3. Single Panna',
      desc: 'Predict a 3-digit combination where all 3 digits are unique and strictly in ascending order (e.g. 128, 359). Payout is 10 ka 1400.',
      example: 'Example: ₹10 bet on 128 wins ₹1400.',
    },
    {
      title: '4. Double Panna',
      desc: 'Predict a 3-digit combination where 2 digits repeat (e.g. 112, 223, 779). Payout is 10 ka 2800.',
      example: 'Example: ₹10 bet on 112 wins ₹2800.',
    },
    {
      title: '5. Triple Panna',
      desc: 'Predict all 3 identical digits (000, 111, 222, ... 999). There are only 10 possible combinations. Payout is 10 ka 7000.',
      example: 'Example: ₹10 bet on 777 wins ₹7000.',
    },
    {
      title: '6. Half Sangam & Full Sangam',
      desc: 'Half Sangam combines an Open Panna with Close Ank (or Open Ank with Close Panna). Full Sangam combines Open Panna with Close Panna.',
      example: 'Payout: Half Sangam 10 ka 10,000 | Full Sangam 10 ka 100,000.',
    },
    {
      title: '7. Roulette Matka',
      desc: '30-minute quick rounds with live spinning wheel. Bet on 0-9 for 9x payout, or outside bets (Even, Odd, Red, Black). Bidding locks out 60 seconds before spin.',
      example: 'Example: ₹100 bet on number 5 wins ₹900.',
    },
  ];

  return (
    <div style={{ padding: '14px 12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="header-icon-btn"
          style={{ background: '#e2e8f0', color: '#1e293b' }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-color)' }}>
            HOW TO PLAY
          </h2>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Complete Game Rules & Guide</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {guides.map((g, idx) => (
          <div
            key={idx}
            style={{
              background: 'white',
              borderRadius: 10,
              padding: 16,
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid #e2e8f0',
            }}
          >
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: 6 }}>
              {g.title}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.5, marginBottom: 8 }}>
              {g.desc}
            </p>
            <div
              style={{
                background: '#f8fafc',
                borderLeft: '3px solid var(--gold-color)',
                padding: '6px 10px',
                fontSize: '0.78rem',
                color: '#475569',
                borderRadius: '0 4px 4px 0',
              }}
            >
              {g.example}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowToPlay;

