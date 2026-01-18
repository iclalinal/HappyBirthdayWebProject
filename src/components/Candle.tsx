import { useState } from 'react';
import { useMicrophone } from '../hooks/useMicrophone';

export default function Candle() {
  const volume = useMicrophone();
  const [isOut, setIsOut] = useState(false);

  if (!isOut && volume > 60) {
    setIsOut(true);
  }

  const flameStyle = isOut
    ? { opacity: 0 }
    : {
        transform: `scale(${Math.max(0.6, 1 - volume / 100)})`,
      };

  return (
    <div className="candle">
      {!isOut && (
        <div className="flame" style={flameStyle} />
      )}
      {isOut && <div className="smoke" />}
      <div className="wick" />
      <div className="candle-body" />
    </div>
  );
}
