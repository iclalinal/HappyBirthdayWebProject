import { useEffect, useState, type ReactNode } from 'react';
import { useLanguage } from '../context/LanguageContext';
import '../styles/envelope.css';

interface EnvelopeProps {
  onOpen?: () => void;
  themeColor?: string;
  renderBook?: ReactNode;
}

export default function Envelope({ onOpen, themeColor, renderBook }: EnvelopeProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const [showCard, setShowCard] = useState(false);
  const [cardOut, setCardOut] = useState(false);

  const [showBook, setShowBook] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const t1 = setTimeout(() => {
      setShowCard(true);
    }, 150);

    const t2 = setTimeout(() => {
      setCardOut(true);
    }, 300);

    const t3 = setTimeout(() => {
      setShowBook(true);
    }, 1100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen]);

  const handleClick = () => {
    if (isOpen) return;
    setIsOpen(true);
    onOpen?.();
  };

  const accent = themeColor || '#e5c4a1';

  return (
  <div className="envelope-container">
    {!showBook ? (
      <div
        className="envelope-wrapper envelope-fly-in"
        onClick={handleClick}
      >
        <div className="envelope-body">

          {/* 🔺 KAPAK — FRONT'TAN AYRI */}
          <div
            className={`envelope-flap ${isOpen ? 'flap-open' : ''}`}
            style={{ 
              background: `linear-gradient(to bottom, ${accent}, ${accent}dd)`,
            }}
          />

          {/* ÖN YÜZ */}
          <div className="envelope-front" style={{ borderColor: accent }}>
            <div className="envelope-base">
              <div className="envelope-design" style={{ color: '#0d0f1a' }}>
                <span className="design-icon">💌</span>
              </div>
            </div>
          </div>

          {/* 📄 CARD SLOT */}
          <div
            className={`card-slot
              ${showCard ? 'card-visible' : ''}
              ${cardOut ? 'card-out' : ''}
            `}
          >
            <div className="card-preview" style={{ borderColor: accent }} />
          </div>

        </div>

        {!isOpen && <div className="click-hint">{t('envelope_click_hint')}</div>}
      </div>
    ) : (
      <div className="card-reveal">
        {renderBook}
      </div>
    )}
  </div>
);
}
