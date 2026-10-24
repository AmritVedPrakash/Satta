import React from 'react';
import { Modal } from '../common/Modal';
import { useLanguage } from '../../context/LanguageContext';
import { Check } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
];

export const LanguageModal = ({ isOpen, onClose }) => {
  const { language, changeLanguage, t } = useLanguage();

  const handleSelect = (code) => {
    changeLanguage(code);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('select_language') || 'Select Language'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {LANGUAGES.map((lang) => {
          const isSelected = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleSelect(lang.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 8,
                border: isSelected ? '2px solid var(--primary-color)' : '1px solid #cbd5e1',
                background: isSelected ? '#f0fdf4' : 'white',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: isSelected ? 700 : 500,
                color: isSelected ? 'var(--primary-color)' : '#1e293b',
                transition: 'all 0.15s ease',
              }}
            >
              <span>
                {lang.native} <span style={{ color: '#64748b', fontSize: '0.85rem' }}>({lang.label})</span>
              </span>
              {isSelected && <Check size={20} color="var(--primary-color)" />}
            </button>
          );
        })}
      </div>
    </Modal>
  );
};

export default LanguageModal;

