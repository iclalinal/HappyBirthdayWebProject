import { useEffect, useState } from 'react';

interface Props {
  index?: number;
  volume: number;
  onBlown: () => void;
}

export default function Candle({ index = 0, volume, onBlown }: Props) {
  const [isOut, setIsOut] = useState(false);

  useEffect(() => {
    if (!isOut && volume > 60) {
      setIsOut(true);
      onBlown();
    }
  }, [volume, isOut, onBlown]);

  const scale = Math.max(0.6, 1 - volume / 100);

  return (
    <div className="candle" style={{ gridColumn: index + 1 }}>
      {!isOut && <div className="flame" style={{ transform: `scale(${scale})` }} />}
      {isOut && <div className="smoke" />}
      <div className="wick" />
      <div className="candle-body" />
    </div>
  );
}
