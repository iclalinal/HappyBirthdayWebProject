import { useState } from 'react';
import Cake from './components/Cake';
import LightRays from './components/LightRays';
import { useMicrophone } from './hooks/useMicrophone';
import './styles.css';

function App() {
  const [started, setStarted] = useState(false);
  const { volume, start, stop } = useMicrophone();

  const handleStart = () => {
    setStarted(true);
    start();
  };

  return (
    <div className="app">
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

        <Cake started={started} volume={volume} onAllBlown={stop} />
      </div>
    </div>
  );
}

export default App;
