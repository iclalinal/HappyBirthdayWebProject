import { useEffect, useState } from 'react';
import { useMicrophone } from '../hooks/useMicrophone';

interface Props {
  started: boolean;
}

export default function Candle({ started }: Props) {
  const { volume, start, playSound } = useMicrophone();
  const [isOut, setIsOut] = useState(false);

  useEffect(() => {
    if (started) start();
  }, [started, start]);

  useEffect(() => {
    if (!isOut && volume > 60) {
      setIsOut(true);
      playSound(); // Mum söndüğünde ses çal
    }
  }, [volume, isOut, playSound]);

  const scale = Math.max(0.6, 1 - volume / 100);

  return (
    <div className="candle">
      {!isOut && <div className="flame" style={{ transform: `scale(${scale})` }} />}
      {isOut && <div className="smoke" />}
      <div className="wick" />
      <div className="candle-body" />
    </div>
  );
}
