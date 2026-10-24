import React from 'react';
import { Volume2 } from 'lucide-react';

export const Marquee = ({ text }) => {
  if (!text) return null;

  return (
    <div className="marquee-bar">
      <Volume2 size={16} style={{ minWidth: 16, marginRight: 8, color: '#ca8a04' }} />
      <div style={{ overflow: 'hidden', width: '100%' }}>
        <div className="marquee-content">{text}</div>
      </div>
    </div>
  );
};

export default Marquee;

