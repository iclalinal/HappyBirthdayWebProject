import Candle from './Candle';

interface Props {
  started: boolean;
}

export default function Cake({ started }: Props) {
  return (
    <div className="cake-container">
      <Candle started={started} />
      <div className="cake">
        <div className="cake-top" />
        <div className="cake-body" />
      </div>
    </div>
  );
}
