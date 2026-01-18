import { useEffect, useState } from 'react';
import BirthdayCard from './BirthdayCard';
import CardBook from './CardBook';
import '../styles/envelope.css';

interface EnvelopeProps {
  onOpen?: () => void;
}

export default function Envelope({ onOpen }: EnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [showCard, setShowCard] = useState(false);
  const [cardOut, setCardOut] = useState(false);

  const [showBook, setShowBook] = useState(false);
  const [startTyping, setStartTyping] = useState(false);

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
          />

          {/* ÖN YÜZ */}
          <div className="envelope-front">
            <div className="envelope-base">
              <div className="envelope-design">
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
            <div className="card-preview" />
          </div>

        </div>

        {!isOpen && <div className="click-hint">Tıkla ✨</div>}
      </div>
    ) : (
      <div className="card-reveal">
        <CardBook onOpened={() => setStartTyping(true)} />
        <div className="card-message-overlay">
          <BirthdayCard start={startTyping} />
        </div>
      </div>
    )}
  </div>
);
}
