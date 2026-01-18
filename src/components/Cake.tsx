import { useRef } from 'react';
import Candle from './Candle';

interface Props {
  started: boolean;
  volume: number;
  onAllBlown: () => void;
}

export default function Cake({ volume, onAllBlown }: Props) {
  const candleRefs = useRef([false, false, false]);

  const handleCandleBlown = (index: number) => {
    candleRefs.current[index] = true;
    // Check if all 3 candles are blown
    if (candleRefs.current.every(Boolean)) {
      onAllBlown();
    }
  };

  return (
    <div className="cake-container">
      {/* Pasta Katmanları */}
      <div className="cake">
        {/* Top Dekorasyon */}
        <div className="cake-decoration" />
        
        {/* Üst Katman */}
        <div className="cake-layer cake-layer-1" />
        
        {/* Orta Katman */}
        <div className="cake-layer cake-layer-2" />
        
        {/* Alt Katman */}
        <div className="cake-layer cake-layer-3" />

        {/* Mumlar Grid - Pastanın üstünde */}
        <div className="candles-grid">
          <Candle index={0} volume={volume} onBlown={() => handleCandleBlown(0)} />
          <Candle index={1} volume={volume} onBlown={() => handleCandleBlown(1)} />
          <Candle index={2} volume={volume} onBlown={() => handleCandleBlown(2)} />
        </div>
      </div>
    </div>
  );
}

