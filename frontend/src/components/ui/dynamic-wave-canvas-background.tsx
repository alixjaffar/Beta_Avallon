import React, { useEffect, useRef } from 'react';

const HeroWave = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width: number, height: number, imageData: ImageData, data: Uint8ClampedArray;
    const SCALE = 4; // Higher scale = better performance

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      width = Math.floor(canvas.width / SCALE);
      height = Math.floor(canvas.height / SCALE);
      imageData = ctx.createImageData(width, height);
      data = imageData.data;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const startTime = Date.now();

    // Larger lookup tables for smoother interpolation
    const TABLE_SIZE = 2048;
    const SIN_TABLE = new Float32Array(TABLE_SIZE);
    const COS_TABLE = new Float32Array(TABLE_SIZE);
    for (let i = 0; i < TABLE_SIZE; i++) {
      const angle = (i / TABLE_SIZE) * Math.PI * 2;
      SIN_TABLE[i] = Math.sin(angle);
      COS_TABLE[i] = Math.cos(angle);
    }

    const fastSin = (x: number) => {
      const normalized = ((x % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const index = Math.floor((normalized / (Math.PI * 2)) * TABLE_SIZE) & (TABLE_SIZE - 1);
      return SIN_TABLE[index];
    };

    const fastCos = (x: number) => {
      const normalized = ((x % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const index = Math.floor((normalized / (Math.PI * 2)) * TABLE_SIZE) & (TABLE_SIZE - 1);
      return COS_TABLE[index];
    };

    let animationId: number;
    let lastTime = 0;
    const targetFPS = 30;
    const animationSpeed = 1.2; // Slightly faster motion
    const frameInterval = 1000 / targetFPS;

    const render = (currentTime: number) => {
      animationId = requestAnimationFrame(render);
      
      const deltaTime = currentTime - lastTime;
      if (deltaTime < frameInterval) return;
      lastTime = currentTime - (deltaTime % frameInterval);

      const time = (Date.now() - startTime) * 0.001 * animationSpeed;

      for (let y = 0; y < height; y++) {
        const u_y = (2 * y - height) / height;
        for (let x = 0; x < width; x++) {
          const u_x = (2 * x - width) / height;

          let a = 0;
          let d = 0;

          // Reduced iterations for performance
          for (let i = 0; i < 3; i++) {
            a += fastCos(i - d + time * 0.4 - a * u_x);
            d += fastSin(i * u_y + a);
          }

          const wave = (fastSin(a) + fastCos(d)) * 0.5;
          const intensity = 0.3 + 0.4 * wave;
          const baseVal = 0.1 + 0.15 * fastCos(u_x + u_y + time * 0.25);
          const blueAccent = 0.2 * fastSin(a * 1.5 + time * 0.15);
          const purpleAccent = 0.15 * fastCos(d * 2 + time * 0.08);

          const r = Math.max(0, Math.min(1, baseVal + purpleAccent * 0.8)) * intensity;
          const g = Math.max(0, Math.min(1, baseVal + blueAccent * 0.6)) * intensity;
          const b = Math.max(0, Math.min(1, baseVal + blueAccent * 1.2 + purpleAccent * 0.4)) * intensity;

          const index = (y * width + x) * 4;
          data[index] = r * 255;
          data[index + 1] = g * 255;
          data[index + 2] = b * 255;
          data[index + 3] = 255;
        }
      }

      // Create offscreen canvas for smooth scaling
      const offscreen = new OffscreenCanvas(width, height);
      const offCtx = offscreen.getContext('2d');
      if (offCtx) {
        offCtx.putImageData(imageData, 0, 0);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'medium';
        ctx.drawImage(offscreen, 0, 0, canvas.width, canvas.height);
      }
    };

    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

export default HeroWave;
