import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import Button from '../components/common/Button';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '60px 16px', textAlign: 'center' }}>
      <AlertTriangle size={64} color="var(--gold-color)" style={{ margin: '0 auto 16px' }} />
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-color)' }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#334155', marginTop: 4 }}>
        Page Not Found
      </h2>
      <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '8px auto 24px', maxWidth: 300 }}>
        The page you are looking for does not exist or may have been moved.
      </p>

      <Button variant="gold" onClick={() => navigate('/')} icon={<Home size={18} />}>
        Back to Home
      </Button>
    </div>
  );
};

export default NotFound;

