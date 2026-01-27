import { useRef } from 'react';
import Candle from './Candle';

interface CakeProps {
  started: boolean;
  volume: number;
  onAllBlown: () => void;
  themeColor?: string;
}

export default function Cake({ volume, onAllBlown, themeColor }: CakeProps) {
  const candleRefs = useRef([false, false, false]);
  const accent = themeColor || '#cd7f32';

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
        <div
          className="cake-decoration"
          style={{ background: `linear-gradient(90deg, transparent, ${accent} 50%, transparent)` }}
        />
        
        {/* Üst Katman */}
        <div
          className="cake-layer cake-layer-1"
          style={{
            borderColor: accent,
            background: `linear-gradient(to bottom, ${accent}1f, ${accent}0f)`,
          }}
        />
        
        {/* Orta Katman */}
        <div
          className="cake-layer cake-layer-2"
          style={{
            borderColor: accent,
            background: `linear-gradient(to bottom, ${accent}26, ${accent}10)`,
          }}
        />
        
        {/* Alt Katman */}
        <div
          className="cake-layer cake-layer-3"
          style={{
            borderColor: accent,
            background: `linear-gradient(to bottom, ${accent}33, ${accent}12)`,
          }}
        />

        {/* Mumlar Grid - Pastanın üstünde */}
        <div className="candles-grid">
          <Candle index={0} volume={volume} onBlown={() => handleCandleBlown(0)} themeColor={accent} />
          <Candle index={1} volume={volume} onBlown={() => handleCandleBlown(1)} themeColor={accent} />
          <Candle index={2} volume={volume} onBlown={() => handleCandleBlown(2)} themeColor={accent} />
        </div>
      </div>
    </div>
  );
}

