import { useState } from 'react';
import Cake from './components/Cake';
import LightRays from './components/LightRays';
import HeartConfetti from './components/HeartConfetti';
import { useMicrophone } from './hooks/useMicrophone';
import './styles.css';

function App() {
  const [started, setStarted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { volume, start, stop } = useMicrophone();

  const handleStart = () => {
    setStarted(true);
    start();
  };

  const handleAllBlown = () => {
    setShowConfetti(true);

    setTimeout(() => {
      setShowConfetti(false);
      stop();
      // Overlay kapanır ama sayfa açık kalır
    }, 6000);
  };

  return (
    <div className="app">
      {showConfetti && <HeartConfetti />}

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
