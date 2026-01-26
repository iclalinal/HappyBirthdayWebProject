import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  twinkle: number;
  twinkleSpeed: number;
}

interface Props {
  themeColor?: string;
}

export default function StarConfetti({ themeColor = '#f48c06' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stars = useRef<Star[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const createStar = (): Star => ({
      x: Math.random() * canvas.width,
      y: -20,
      size: 6 + Math.random() * 10,
      speed: 0.4 + Math.random() * 1.2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.04,
      opacity: 0.6 + Math.random() * 0.4,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: (Math.random() - 0.5) * 0.1,
    });

    stars.current = Array.from({ length: 80 }, createStar);

    const drawStar = (s: Star, ctx: CanvasRenderingContext2D) => {
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rotation);
      
      // Twinkling effect
      const twinkleAlpha = (Math.sin(s.twinkle) + 1) / 2;
      ctx.globalAlpha = s.opacity * (0.5 + twinkleAlpha * 0.5);
      ctx.fillStyle = themeColor;

      // Draw 5-pointed star
      const points = 5;
      const innerRadius = s.size / 2;
      const outerRadius = s.size;

      ctx.beginPath();
      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / points - Math.PI / 2;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.current.forEach(s => {
        s.y += s.speed;
        s.rotation += s.rotationSpeed;
        s.twinkle += s.twinkleSpeed;
        drawStar(s, ctx);

        // Respawn at top when off-screen
        if (s.y > canvas.height + 50) {
          s.y = -20;
          s.x = Math.random() * canvas.width;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current!);
    };
  }, [themeColor]);

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
