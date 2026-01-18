import { useEffect, useRef } from 'react';

interface Heart {
  x: number;
  y: number;
  size: number;
  speed: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

export default function HeartConfetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hearts = useRef<Heart[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const createHeart = (): Heart => ({
      x: Math.random() * canvas.width,
      y: -20,
      size: 8 + Math.random() * 8,
      speed: 0.3 + Math.random() * 1,
      rotation: Math.random() * Math.PI,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      opacity: 0.5 + Math.random() * 0.4,
    });

    hearts.current = Array.from({ length: 120 }, createHeart);

    const drawHeart = (h: Heart) => {
      ctx.save();
      ctx.translate(h.x, h.y);
      ctx.rotate(h.rotation);
      ctx.globalAlpha = h.opacity;
      ctx.fillStyle = '#c9a89f';

      ctx.beginPath();
      ctx.moveTo(0, h.size / 4);
      ctx.bezierCurveTo(
        -h.size / 2, -h.size / 2,
        -h.size, h.size / 3,
        0, h.size
      );
      ctx.bezierCurveTo(
        h.size, h.size / 3,
        h.size / 2, -h.size / 2,
        0, h.size / 4
      );
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      hearts.current.forEach(h => {
        h.y += h.speed;
        h.rotation += h.rotationSpeed;
        drawHeart(h);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current!);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 20,
      }}
    />
  );
}
