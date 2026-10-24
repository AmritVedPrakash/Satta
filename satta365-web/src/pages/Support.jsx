import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { drawerService } from '../services/drawerService';
import { ArrowLeft, Headphones, MessageCircle, Phone, Clock, ShieldCheck } from 'lucide-react';
import Button from '../components/common/Button';

export const Support = () => {
  const navigate = useNavigate();
  const [supportInfo, setSupportInfo] = useState({
    phone: '9876543210',
    whatsapp: '9876543210',
    timing: '24 Hours Open',
  });

  useEffect(() => {
    loadSupport();
  }, []);

  const loadSupport = async () => {
    try {
      const res = await drawerService.getSupport();
      if (Array.isArray(res) && res.length > 0) {
        setSupportInfo({
          phone: res[0].Phone || res[0].Mobile || '9876543210',
          whatsapp: res[0].Whatsapp || res[0].Phone || '9876543210',
          timing: res[0].Timing || '24 Hours Open',
        });
      }
    } catch (e) {
      //
    }
  };

  const handleWhatsApp = () => {
    const cleanNumber = supportInfo.whatsapp.replace(/\D/g, '');
    const url = `https://wa.me/91${cleanNumber}?text=${encodeURIComponent('Hello Satta365 Support, I need assistance.')}`;
    window.open(url, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:+91${supportInfo.phone.replace(/\D/g, '')}`;
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
            CUSTOMER SUPPORT
          </h2>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>24x7 Help & Assistance</div>
        </div>
      </div>

      {/* Support Card */}
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
          <Headphones size={32} color="var(--gold-light)" />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gold-light)' }}>
          Need Help? We Are Here!
        </h3>
        <p style={{ fontSize: '0.82rem', color: '#e2e8f0', marginTop: 4 }}>
          Our customer service team is available 24/7 to resolve deposit, withdrawal or betting questions.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12, fontSize: '0.78rem', color: 'var(--gold-color)' }}>
          <Clock size={16} />
          <span>Timing: {supportInfo.timing}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          type="button"
          onClick={handleWhatsApp}
          style={{
            background: '#25d366',
            color: 'white',
            border: 'none',
            borderRadius: 10,
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(37, 211, 102, 0.4)',
          }}
        >
          <MessageCircle size={22} />
          <span>Chat on WhatsApp (+91 {supportInfo.whatsapp})</span>
        </button>

        <button
          type="button"
          onClick={handleCall}
          style={{
            background: 'white',
            color: 'var(--primary-color)',
            border: '2px solid var(--primary-color)',
            borderRadius: 10,
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Phone size={22} color="var(--primary-color)" />
          <span>Call Support (+91 {supportInfo.phone})</span>
        </button>
      </div>

      {/* Safety & Trust info */}
      <div
        style={{
          marginTop: 20,
          background: 'white',
          borderRadius: 10,
          padding: 16,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <ShieldCheck size={20} color="#16a34a" />
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
            Important Support Guidelines
          </h4>
        </div>
        <ul style={{ paddingLeft: 18, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.6 }}>
          <li>Never share your password or OTP with anyone, including support staff.</li>
          <li>For deposit issues, keep your 12-digit UTR reference number ready.</li>
          <li>Withdrawals are processed automatically between 09:00 AM and 11:30 PM.</li>
        </ul>
      </div>
    </div>
  );
};

export default Support;

