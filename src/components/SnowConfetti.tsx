import { useEffect, useRef } from 'react';

interface Snowflake {
  x: number;
  y: number;
  size: number;
  speed: number;
  angle: number;
  angleSpeed: number;
  opacity: number;
  wobbleAmount: number;
}

interface Props {
  themeColor?: string;
}

export default function SnowConfetti({ themeColor = '#2b84ea' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snowflakes = useRef<Snowflake[]>([]);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const createSnowflake = (): Snowflake => ({
      x: Math.random() * canvas.width,
      y: -20,
      size: 4 + Math.random() * 8,
      speed: 0.1 + Math.random() * 0.4,
      angle: Math.random() * Math.PI * 2,
      angleSpeed: (Math.random() - 0.5) * 0.02,
      opacity: 0.4 + Math.random() * 0.5,
      wobbleAmount: 1 + Math.random() * 2,
    });

    snowflakes.current = Array.from({ length: 100 }, createSnowflake);

    const drawSnowflake = (snow: Snowflake, ctx: CanvasRenderingContext2D, time: number) => {
      ctx.save();
      ctx.translate(snow.x + Math.sin(time * 0.005) * snow.wobbleAmount, snow.y);
      ctx.rotate(snow.angle);
      ctx.globalAlpha = snow.opacity;
      ctx.fillStyle = themeColor;
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 1;

      // Draw 6-pointed snowflake
      for (let i = 0; i < 6; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI) / 3);
        
        // Main branch
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -snow.size);
        ctx.stroke();

        // Side branches
        for (let j = 0; j < 3; j++) {
          const branchLength = snow.size * (1 - (j + 1) * 0.3);
          const branchPos = snow.size * (0.3 + j * 0.35);
          
          ctx.beginPath();
          ctx.moveTo(0, -branchPos);
          ctx.lineTo(-branchLength / 2, -branchPos - branchLength * 0.5);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(0, -branchPos);
          ctx.lineTo(branchLength / 2, -branchPos - branchLength * 0.5);
          ctx.stroke();
        }

        ctx.restore();
      }

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      timeRef.current += 1;

      snowflakes.current.forEach(snow => {
        snow.y += snow.speed;
        snow.angle += snow.angleSpeed;
        drawSnowflake(snow, ctx, timeRef.current);

        // Respawn at top when off-screen
        if (snow.y > canvas.height + 50) {
          snow.y = -20;
          snow.x = Math.random() * canvas.width;
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
