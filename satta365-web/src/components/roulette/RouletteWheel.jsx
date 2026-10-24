import React, { useEffect, useState } from 'react';

export const RouletteWheel = ({ spinning, winningNumber, onSpinComplete }) => {
  const [rotation, setRotation] = useState(0);

  // Numbers on wheel 0-9 (10 slices, 36 deg each)
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const sliceAngle = 360 / numbers.length;

  useEffect(() => {
    if (spinning) {
      // Calculate target angle based on winning number
      const targetIndex = winningNumber !== null ? numbers.indexOf(Number(winningNumber)) : Math.floor(Math.random() * 10);
      // Spin at least 5 full rotations (1800 deg) + offset
      const targetRotation = rotation + 1800 + (360 - targetIndex * sliceAngle);
      setRotation(targetRotation);

      const timer = setTimeout(() => {
        if (onSpinComplete) onSpinComplete();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [spinning]);

  return (
    <div className="wheel-container" style={{ position: 'relative', width: 240, height: 240 }}>
      {/* Pointer at the top */}
      <div
        style={{
          position: 'absolute',
          top: -10,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderTop: '18px solid #f5ba22',
          zIndex: 10,
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
        }}
      />

      {/* Outer rim */}
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: '6px solid #d4af37',
          boxShadow: '0 0 20px rgba(245, 186, 34, 0.4), inset 0 0 15px rgba(0,0,0,0.8)',
          position: 'relative',
          overflow: 'hidden',
          transition: spinning ? 'transform 4s cubic-bezier(0.12, 0.8, 0.32, 1)' : 'none',
          transform: `rotate(${rotation}deg)`,
          background: '#04220b',
        }}
      >
        <svg viewBox="0 0 200 200" width="100%" height="100%">
          {numbers.map((num, i) => {
            const startAngle = (i * sliceAngle - 90) * (Math.PI / 180);
            const endAngle = ((i + 1) * sliceAngle - 90) * (Math.PI / 180);
            const x1 = 100 + 100 * Math.cos(startAngle);
            const y1 = 100 + 100 * Math.sin(startAngle);
            const x2 = 100 + 100 * Math.cos(endAngle);
            const y2 = 100 + 100 * Math.sin(endAngle);

            const pathData = `M 100 100 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z`;
            const fillColor = num === 0 ? '#15803d' : num % 2 === 0 ? '#dc2626' : '#1e293b';

            // Text coordinates
            const textAngle = ((i + 0.5) * sliceAngle - 90) * (Math.PI / 180);
            const tx = 100 + 70 * Math.cos(textAngle);
            const ty = 100 + 70 * Math.sin(textAngle);

            return (
              <g key={num}>
                <path d={pathData} fill={fillColor} stroke="#d4af37" strokeWidth="1" />
                <text
                  x={tx}
                  y={ty}
                  fill="#ffffff"
                  fontSize="16"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="central"
                  transform={`rotate(${(i + 0.5) * sliceAngle}, ${tx}, ${ty})`}
                >
                  {num}
                </text>
              </g>
            );
          })}
          {/* Center Hub */}
          <circle cx="100" cy="100" r="28" fill="#d4af37" stroke="#ffffff" strokeWidth="2" />
          <circle cx="100" cy="100" r="16" fill="#002906" />
        </svg>
      </div>
    </div>
  );
};

export default RouletteWheel;

