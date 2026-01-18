import { useEffect, useState } from 'react';
import '../styles/birthday-card.css';

interface BirthdayCardProps {
  message?: string[];
  start?: boolean;
}

export default function BirthdayCard({
  message = [
    'İyi ki doğdun 🎉',
    'Hayatıma kattığın her şey için teşekkür ederim.',
    'Nice mutlu yaşlara 💖',
  ],
  start = true,
}: BirthdayCardProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const fullText = message[currentLineIndex] || '';

  useEffect(() => {
    if (!start) return;
    if (currentLineIndex >= message.length) return;

    let charIndex = 0;
    const interval = setInterval(() => {
      if (charIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(interval);
        // Move to next line after 800ms
        setTimeout(() => {
          setCurrentLineIndex(prev => prev + 1);
          setDisplayedText('');
        }, 800);
      }
    }, 50); // Typewriter hızı

    return () => clearInterval(interval);
  }, [currentLineIndex, fullText, message.length, start]);

  return (
    <div className="birthday-card">
      <div className="card-content">
        <div className="card-message">
          {message.map((line, idx) => (
            <div
              key={idx}
              className={`message-line ${
                idx < currentLineIndex ? 'completed' : idx === currentLineIndex ? 'typing' : ''
              }`}
            >
              {idx < currentLineIndex ? line : idx === currentLineIndex ? displayedText : ''}
              {idx === currentLineIndex && <span className="cursor">|</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
