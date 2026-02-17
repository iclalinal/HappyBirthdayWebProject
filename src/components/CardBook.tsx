import { useEffect, useRef, useState } from 'react';
import '../styles/card-book.css';

interface CardBookProps {
  messages?: string[][]; // paginateMessage'dan gelen yapı
  onOpened?: () => void;
}

export default function CardBook({ messages = [[]], onOpened }: CardBookProps) {
  const [opened, setOpened] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [startTyping, setStartTyping] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const bookRef = useRef<HTMLDivElement>(null);
  const safeMessages = Array.isArray(messages) ? messages : [[]];
  const currentPageMessages = safeMessages[currentPageIndex] || [];

  // Kitap açılış animasyonu
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpened(true);
      setTimeout(() => setStartTyping(true), 600);
      onOpened?.();
    }, 300);
    return () => clearTimeout(timer);
  }, [onOpened]);

  // Stabilize Daktilo Efekti
  useEffect(() => {
    if (!startTyping || currentLineIndex >= currentPageMessages.length) return;

    const targetLine = currentPageMessages[currentLineIndex];
    let charIndex = 0;

    const interval = setInterval(() => {
      setDisplayedText(targetLine.slice(0, charIndex + 1));
      charIndex++;

      if (charIndex >= targetLine.length) {
        clearInterval(interval);
        // Satır bittiğinde bekle ve sonrakine geç
        setTimeout(() => {
          setCurrentLineIndex(prev => prev + 1);
          setDisplayedText('');
        }, 500); // Satır arası bekleme
      }
    }, 45); // Karakter hızı

    return () => clearInterval(interval);
  }, [currentLineIndex, currentPageIndex, startTyping, currentPageMessages]);

  const changePage = (direction: 'next' | 'prev') => {
    setFadeOut(true);
    setTimeout(() => {
      setCurrentPageIndex(prev => direction === 'next' ? prev + 1 : prev - 1);
      setCurrentLineIndex(0);
      setDisplayedText('');
      setFadeOut(false);
    }, 350);
  };

  return (
    <div className="book-stage">
      <div ref={bookRef} className={`book ${opened ? 'opened' : ''}`}>
        {/* Ön Kapak */}
        <div className="book-cover-front">
          <div className="cover-design">🎂</div>
        </div>

        {/* Sol Sayfa (Sayfa Numarası) */}
        <div className="page left">
          <div className="page-footer">{currentPageIndex + 1} / {safeMessages.length}</div>
        </div>

        {/* Sağ Sayfa (İçerik) */}
        <div className="page right">
          <div className={`page-content ${fadeOut ? 'fade-out' : 'fade-in'}`}>
            {currentPageMessages.map((line, idx) => (
              <div key={`${currentPageIndex}-${idx}`} className="message-line">
                {idx < currentLineIndex ? line : idx === currentLineIndex ? displayedText : ''}
                {idx === currentLineIndex && startTyping && currentLineIndex < currentPageMessages.length && (
                  <span className="cursor">|</span>
                )}
              </div>
            ))}
          </div>
          
          <div className="page-navigation">
            {currentPageIndex > 0 && (
              <button className="nav-btn" onClick={() => changePage('prev')}>←</button>
            )}
            <div className="nav-spacer" />
            {currentPageIndex < safeMessages.length - 1 && (
              <button className="nav-btn" onClick={() => changePage('next')}>→</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
