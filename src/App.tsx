import { useState } from 'react';
import Cake from './components/Cake';
import './styles.css';

function App() {
  const [started, setStarted] = useState(false);

  return (
    <div className="app">
      {!started && (
        <div className="overlay" onClick={() => setStarted(true)}>
          <div className="overlay-content">
            🎂 Muma üflemek için dokun
          </div>
        </div>
      )}

      <Cake started={started} />
    </div>
  );
}

export default App;
