import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Share2, Copy, Check, Gift, Users } from 'lucide-react';
import Button from '../components/common/Button';

export const Refer = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userPhone } = useAuth();
  const [copied, setCopied] = useState(false);

  const refCode = userPhone ? `REF${userPhone.slice(-4)}${userPhone.slice(0, 3)}` : 'SATTA365';
  const shareText = `Play India's most trusted Satta Matka games on SATTA365! Instant withdrawals, best rates, and live Roulette Matka. Register using my referral code: ${refCode} and get bonus points! https://satta365.co`;

  const handleCopy = () => {
    navigator.clipboard.writeText(refCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join SATTA365',
        text: shareText,
        url: 'https://satta365.co',
      }).catch(() => {});
    } else {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(waUrl, '_blank');
    }
  };

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
            REFER & EARN
          </h2>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Invite Friends & Earn Commission</div>
        </div>
      </div>

      <div
        style={{
          background: 'var(--primary-gradient)',
          borderRadius: 12,
          padding: 24,
          color: 'white',
          textAlign: 'center',
          boxShadow: 'var(--shadow-md)',
          borderBottom: '3px solid var(--gold-color)',
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            border: '2px solid var(--gold-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
          }}
        >
          <Gift size={32} color="var(--gold-light)" />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gold-light)' }}>
          Earn 5% Commission on Deposits!
        </h3>
        <p style={{ fontSize: '0.82rem', color: '#e2e8f0', marginTop: 4 }}>
          Share your referral code with friends. Whenever they join and deposit, you earn bonus reward points instantly!
        </p>

        {/* Code Box */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            background: 'rgba(0,0,0,0.3)',
            border: '1px dashed var(--gold-color)',
            padding: '10px 18px',
            borderRadius: 8,
            marginTop: 16,
          }}
        >
          <div>
            <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>YOUR REFERRAL CODE</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: 2, color: 'var(--gold-color)' }}>
              {refCode}
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            style={{ background: 'none', border: 'none', color: copied ? '#4ade80' : 'white', cursor: 'pointer' }}
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>
      </div>

      {/* Share Button */}
      <Button
        type="button"
        variant="gold"
        fullWidth
        onClick={handleShare}
        icon={<Share2 size={18} />}
        style={{ marginBottom: 16 }}
      >
        Share on WhatsApp / Social Media
      </Button>

      {/* Benefits info */}
      <div style={{ background: 'white', borderRadius: 10, padding: 16, boxShadow: 'var(--shadow-sm)' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: 10 }}>
          How Referral Program Works
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.8rem', color: '#475569' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>1</div>
            <div>Invite friends using your unique referral code or link.</div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>2</div>
            <div>Your friend registers and makes their first deposit.</div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>3</div>
            <div>Bonus points are credited automatically to your wallet.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Refer;

