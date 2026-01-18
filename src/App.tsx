import { useEffect, useRef } from 'react';
import Cake from './components/Cake';
import './styles.css';

function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio('/sounds/candle.mp3');
    audio.loop = true;
    audio.volume = 0.1;
    audioRef.current = audio;

    audio.play().catch(() => {
      // Autoplay policy: ilk etkileşime kadar sessizce geç
    });

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  return (
    <div className="app">
      <Cake />
    </div>
  );
}

export default App;
