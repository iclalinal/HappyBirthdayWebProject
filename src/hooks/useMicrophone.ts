import { useRef, useState } from 'react';

// iOS webkit desteği
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export function useMicrophone() {
  const [volume, setVolume] = useState(0);
  const [started, setStarted] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const rafRef = useRef<number | null>(null);

  const start = async () => {
    if (started) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const audioContext = new AudioContext();
    await audioContext.resume(); // iOS için kritik

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    const update = () => {
      analyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }

      setVolume(sum / bufferLength);
      rafRef.current = requestAnimationFrame(update);
    };

    update();
    setStarted(true);
  };

  const stop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    audioContextRef.current?.close();
    setStarted(false);
  };

  const playSound = async () => {
    try {
      // iOS uyumlu ses oynatma
      const audioContext = audioContextRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const response = await fetch('/sounds/candle.mp3');
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start(0);
    } catch (error) {
      console.error('Ses oynatma hatası:', error);
    }
  };

  return { volume, start, started, stop, playSound };
}
