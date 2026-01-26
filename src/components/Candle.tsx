import { useEffect, useState } from 'react';

interface Props {
  index?: number;
  volume: number;
  onBlown: () => void;
  themeColor?: string;
}

export default function Candle({ index = 0, volume, onBlown, themeColor }: Props) {
  const [isOut, setIsOut] = useState(false);
  const accent = themeColor || '#cd7f32';

  useEffect(() => {
    if (!isOut && volume > 60) {
      setIsOut(true);
      onBlown();
    }
  }, [volume, isOut, onBlown]);

  const scale = Math.max(0.6, 1 - volume / 100);

  return (
    <div className="candle" style={{ gridColumn: index + 1 }}>
      {!isOut && (
        <div 
          className="flame" 
          style={{ 
            transform: `scale(${scale})`,
            backgroundColor: accent,
            boxShadow: `0 0 20px ${accent}80`
          }} 
        />
      )}
      {isOut && <div className="smoke" />}
      <div className="wick" style={{ backgroundColor: accent }} />
      <div className="candle-body" style={{ borderColor: accent }} />
    </div>
  );
}
