import { useEffect, useRef, useState } from 'react';
import BirthdayCard from './BirthdayCard';
import '../styles/card-book.css';

interface CardBookProps {
  onOpened?: () => void;
  message?: string[];
}

export default function CardBook({ onOpened, message = [] }: CardBookProps) {
  const [opened, setOpened] = useState(false);
  const [startTyping, setStartTyping] = useState(false);
  const bookRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setOpened(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!opened || !bookRef.current) return;
    const handler = () => {
      setStartTyping(true);
      onOpened?.();
    };
    const el = bookRef.current;
    el.addEventListener('transitionend', handler, { once: true });
    return () => el.removeEventListener('transitionend', handler);
  }, [opened, onOpened]);

  return (
    <div className="book-stage">
      <div ref={bookRef} className={`book ${opened ? 'opened' : ''}`}>
        <div className="page left"></div>
        <div className="page right"></div>
      </div>
      <div className="card-message-overlay">
        <BirthdayCard start={startTyping} message={message} />
      </div>
    </div>
  );
}
