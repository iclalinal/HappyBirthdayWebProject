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
  
  // Generate lighter shade for frosting
  const getLighterShade = (hex: string, percent: number = 20) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, ((num >> 16) & 0xff) + percent);
    const g = Math.min(255, ((num >> 8) & 0xff) + percent);
    const b = Math.min(255, (num & 0xff) + percent);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };
  
  const lighterAccent = getLighterShade(accent, 40);

  const handleCandleBlown = (index: number) => {
    candleRefs.current[index] = true;
    if (candleRefs.current.every(Boolean)) {
      onAllBlown();
    }
  };

  return (
    <div className="cake-container">
      <div className="cake">
        {/* Top Layer */}
        <div className="cake-tier-1" style={{
          backgroundColor: `${accent}33`,
          borderColor: accent,
          boxShadow: `0 4px 12px ${accent}40, inset 0 -2px 8px ${accent}20`,
        }}>
          <div className="frosting-drip" style={{ backgroundColor: lighterAccent }} />
        </div>
        
        {/* Middle Layer */}
        <div className="cake-tier-2" style={{
          backgroundColor: `${accent}40`,
          borderColor: accent,
          boxShadow: `0 6px 16px ${accent}50, inset 0 -3px 10px ${accent}25`,
        }}>
          <div className="frosting-drip" style={{ backgroundColor: lighterAccent }} />
        </div>
        
        {/* Bottom Layer / Plate */}
        <div className="cake-tier-3" style={{
          backgroundColor: `${accent}4d`,
          borderColor: accent,
          boxShadow: `0 8px 20px ${accent}60, inset 0 -4px 12px ${accent}30`,
        }}>
          <div className="frosting-drip" style={{ backgroundColor: lighterAccent }} />
        </div>
        
        {/* Plate */}
        <div className="cake-plate" style={{
          backgroundColor: `${accent}1a`,
          borderColor: accent,
          boxShadow: `0 4px 8px ${accent}30`,
        }} />

        {/* Candles on top */}
        <div className="candles-grid">
          <Candle index={0} volume={volume} onBlown={() => handleCandleBlown(0)} themeColor={accent} />
          <Candle index={1} volume={volume} onBlown={() => handleCandleBlown(1)} themeColor={accent} />
          <Candle index={2} volume={volume} onBlown={() => handleCandleBlown(2)} themeColor={accent} />
        </div>
      </div>
    </div>
  );
}