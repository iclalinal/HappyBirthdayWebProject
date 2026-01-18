import { useEffect, useState } from 'react';
import BirthdayCard from './BirthdayCard.tsx';
import CardBook from './CardBook.tsx';
import '../styles/envelope.css';

interface EnvelopeProps {
  onOpen?: () => void;
}

export default function Envelope({ onOpen }: EnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showBook, setShowBook] = useState(false);
  const [startTyping, setStartTyping] = useState(false);

  useEffect(() => {
    // when flap opens, reveal book after a short delay
    if (isOpen) {
      const t = setTimeout(() => setShowBook(true), 400);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const handleClick = () => {
    setIsOpen(true);
    onOpen?.();
  };

  return (
    <div className="envelope-container">
      {!showBook ? (
        <div className="envelope-wrapper envelope-fly-in" onClick={handleClick}>
          {/* Zarf body */}
          <div className={`envelope-body ${isOpen ? 'open' : ''}`}>
            {/* Ön taraf */}
            <div className="envelope-front">
              <div className={`envelope-flap ${isOpen ? 'flap-open' : ''}`}></div>
              <div className="envelope-base">
                <div className="envelope-design">
                  <span className="design-icon">💌</span>
                </div>
              </div>
            </div>
          </div>

          {/* Click indicator */}
          {!isOpen && <div className="click-hint">Tıkla ✨</div>}
        </div>
      ) : (
        <div className="card-reveal">
          <CardBook onOpened={() => setStartTyping(true)} />
          <div className="card-message-overlay">
            <BirthdayCard start={startTyping} message={undefined} />
          </div>
        </div>
      )}
    </div>
  );
}
