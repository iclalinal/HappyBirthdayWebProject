import { useState } from 'react';
import Cake from './components/Cake';
import LightRays from './components/LightRays';
import HeartConfetti from './components/HeartConfetti';
import Envelope from './components/Envelope';
import { useMicrophone } from './hooks/useMicrophone';
import './styles.css';

function App() {
  const [started, setStarted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const { volume, start, stop } = useMicrophone();

  const handleStart = () => {
    setStarted(true);
    start();
  };

  const handleAllBlown = () => {
    // Start confetti immediately and keep it running in background
    setShowConfetti(true);

    // After 3s, bring the envelope while confetti continues
    setTimeout(() => {
      stop(); // stop mic when celebration starts
      setShowCard(true);
    }, 3000);
  };

  return (
    <div className="app">
      {showConfetti && <HeartConfetti />}
      {showCard && <Envelope />}

      <div className="background-rays">
        <LightRays
          raysOrigin="top-center"
          raysColor="#6b9eff"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
        />
      </div>

      <div className="content">
        {!started && (
          <div className="overlay" onClick={handleStart}>
            <div className="overlay-content">
              🎂 Muma üflemek için dokun
            </div>
          </div>
        )}

        <Cake
          started={started}
          volume={volume}
          onAllBlown={handleAllBlown}
        />
      </div>
    </div>
  );
}

export default App;
