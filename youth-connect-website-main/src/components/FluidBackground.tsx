import React, { useEffect, useRef } from 'react';

interface FluidNode {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  colorR: number;
  colorG: number;
  colorB: number;
  alpha: number;
  baseAlpha: number;
  freqX: number;
  freqY: number;
  freqR: number;
  phase: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
  lineWidth: number;
}

export const FluidBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Dark Cosmic Crystal & Electric Blue/Indigo/Cyan Palette
    const PALETTE = [
      { r: 59, g: 130, b: 246, a: 0.28 }, // Electric Blue (#3B82F6)
      { r: 6, g: 182, b: 212, a: 0.26 },  // Radiant Cyan (#06B6D4)
      { r: 99, g: 102, b: 241, a: 0.28 }, // Deep Indigo (#6366F1)
      { r: 139, g: 92, b: 246, a: 0.25 }, // Royal Violet/Purple (#8B5CF6)
      { r: 37, g: 99, b: 235, a: 0.26 },  // Sapphire Blue (#2563EB)
      { r: 79, g: 70, b: 229, a: 0.24 },  // Electric Indigo (#4F46E5)
    ];

    // Initialize Autonomous Fluid Nodes (Harmonic metaballs)
    const nodeCount = 7;
    const nodes: FluidNode[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const color = PALETTE[i % PALETTE.length];
      const baseRadius = Math.min(width, height) * (0.35 + Math.random() * 0.25);
      nodes.push({
        baseX: (0.15 + 0.7 * Math.random()) * width,
        baseY: (0.15 + 0.7 * Math.random()) * height,
        x: width * 0.5,
        y: height * 0.5,
        vx: 0,
        vy: 0,
        radius: baseRadius,
        baseRadius,
        colorR: color.r,
        colorG: color.g,
        colorB: color.b,
        alpha: color.a,
        baseAlpha: color.a,
        freqX: 0.0003 + Math.random() * 0.0005,
        freqY: 0.0003 + Math.random() * 0.0005,
        freqR: 0.0004 + Math.random() * 0.0004,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Interactive pointer state with smooth interpolation (lerp)
    const pointer = {
      x: width * 0.5,
      y: height * 0.5,
      targetX: width * 0.5,
      targetY: height * 0.5,
      prevX: width * 0.5,
      prevY: height * 0.5,
      vx: 0,
      vy: 0,
      speed: 0,
      isInteracting: false,
      lastMoveTime: performance.now(),
    };

    // Expanding crystal displacement ripples
    const ripples: Ripple[] = [];

    const handlePointerMove = (clientX: number, clientY: number) => {
      pointer.targetX = clientX;
      pointer.targetY = clientY;
      pointer.isInteracting = true;
      pointer.lastMoveTime = performance.now();

      const dx = clientX - pointer.prevX;
      const dy = clientY - pointer.prevY;
      const dist = Math.hypot(dx, dy);

      if (dist > 18 && ripples.length < 12) {
        const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        ripples.push({
          x: clientX,
          y: clientY,
          radius: 12,
          maxRadius: Math.min(width, height) * 0.32,
          alpha: 0.35,
          color: `rgba(${color.r}, ${color.g}, ${color.b}`,
          lineWidth: 2.5,
        });
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      handlePointerMove(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    const onVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    let lastTime = performance.now();

    const render = (time: number) => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const dt = Math.min(time - lastTime, 40);
      lastTime = time;

      const lerpFactor = 0.08;
      pointer.x += (pointer.targetX - pointer.x) * lerpFactor;
      pointer.y += (pointer.targetY - pointer.y) * lerpFactor;

      pointer.vx = pointer.x - pointer.prevX;
      pointer.vy = pointer.y - pointer.prevY;
      pointer.speed = Math.hypot(pointer.vx, pointer.vy);

      pointer.prevX = pointer.x;
      pointer.prevY = pointer.y;

      const idleTime = time - pointer.lastMoveTime;
      const pointerInfluence = idleTime > 3000 ? Math.max(0, 1 - (idleTime - 3000) / 2000) : 1;

      // Transparent clear to let atmospheric background shine through
      ctx.clearRect(0, 0, width, height);

      // Render autonomous iridescent fluid nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const t = time + node.phase * 1000;
        const targetX =
          node.baseX +
          Math.sin(t * node.freqX) * (width * 0.2) +
          Math.cos(t * node.freqY * 0.7) * (width * 0.09);
        const targetY =
          node.baseY +
          Math.cos(t * node.freqY) * (height * 0.2) +
          Math.sin(t * node.freqX * 0.6) * (height * 0.09);

        const dx = targetX - pointer.x;
        const dy = targetY - pointer.y;
        const dist = Math.hypot(dx, dy);
        const maxDist = Math.min(width, height) * 0.45;

        let pushX = 0;
        let pushY = 0;

        if (dist < maxDist && dist > 1) {
          const force = (1 - dist / maxDist) * pointerInfluence;
          const angle = Math.atan2(dy, dx);
          const swirlAngle = angle + Math.PI * 0.25;
          const pushMag = force * (65 + pointer.speed * 8);

          pushX = Math.cos(swirlAngle) * pushMag;
          pushY = Math.sin(swirlAngle) * pushMag;
        }

        node.vx = (node.vx + (targetX + pushX - node.x) * 0.03) * 0.88;
        node.vy = (node.vy + (targetY + pushY - node.y) * 0.03) * 0.88;
        node.x += node.vx;
        node.y += node.vy;

        node.radius =
          node.baseRadius +
          Math.sin(t * node.freqR) * (node.baseRadius * 0.2) +
          (dist < maxDist ? (1 - dist / maxDist) * 40 * pointerInfluence : 0);

        const currentAlpha =
          node.baseAlpha *
          (0.85 + 0.3 * Math.sin(t * 0.0008 + node.phase));

        const gradient = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          Math.max(node.radius, 10)
        );

        gradient.addColorStop(0, `rgba(${node.colorR}, ${node.colorG}, ${node.colorB}, ${currentAlpha.toFixed(3)})`);
        gradient.addColorStop(0.5, `rgba(${node.colorR}, ${node.colorG}, ${node.colorB}, ${(currentAlpha * 0.55).toFixed(3)})`);
        gradient.addColorStop(1, `rgba(${node.colorR}, ${node.colorG}, ${node.colorB}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Cursor Fluid Center (Interactive Glow)
      if (pointerInfluence > 0.05) {
        const cursorRadius = Math.min(width, height) * 0.24 + pointer.speed * 14;
        const cursorAlpha = (0.2 + Math.min(pointer.speed * 0.02, 0.15)) * pointerInfluence;

        const cursorGradient = ctx.createRadialGradient(
          pointer.x,
          pointer.y,
          0,
          pointer.x,
          pointer.y,
          cursorRadius
        );

        cursorGradient.addColorStop(0, `rgba(59, 130, 246, ${cursorAlpha.toFixed(3)})`);
        cursorGradient.addColorStop(0.4, `rgba(99, 102, 241, ${(cursorAlpha * 0.65).toFixed(3)})`);
        cursorGradient.addColorStop(0.8, `rgba(6, 182, 212, ${(cursorAlpha * 0.3).toFixed(3)})`);
        cursorGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = cursorGradient;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, cursorRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Displacement Ripples
      for (let r = ripples.length - 1; r >= 0; r--) {
        const ripple = ripples[r];
        ripple.radius += (ripple.maxRadius - ripple.radius) * 0.045 + 1.2;
        ripple.alpha *= 0.94;

        if (ripple.alpha <= 0.01 || ripple.radius >= ripple.maxRadius) {
          ripples.splice(r, 1);
          continue;
        }

        ctx.strokeStyle = `${ripple.color}, ${ripple.alpha.toFixed(3)})`;
        ctx.lineWidth = ripple.lineWidth * (ripple.alpha / 0.35);
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return (
    <div
      id="fluid-interactive-canvas-container"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden w-full h-full"
      aria-hidden="true"
    >
      {/* 1. Atmospheric Cosmic & Crystal Deep Space Nebula Backdrop Asset */}
      <div 
        className="fixed inset-0 w-full h-full object-cover -z-30 bg-cover bg-center opacity-80"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=2000&q=85')`,
          backgroundColor: '#070913',
        }}
      />

      {/* Dark Ambient Vignette & Contrast Harmonizer */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070913]/60 via-transparent to-[#070913]/80 -z-25 pointer-events-none" />

      {/* 2. Dynamic Ambient Color Spheres in Electric Blue and Royal Purple */}
      <div className="absolute top-1/4 left-1/5 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-blue-600/25 via-indigo-500/20 to-purple-600/20 blur-3xl pointer-events-none -z-20 animate-pulse" />
      <div 
        className="absolute bottom-1/4 right-1/6 w-[580px] h-[580px] rounded-full bg-gradient-to-br from-indigo-600/25 via-blue-500/20 to-cyan-500/20 blur-3xl pointer-events-none -z-20 animate-pulse" 
        style={{ animationDuration: '7s' }} 
      />

      {/* 3. Interactive Physics Liquid Crystal Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block -z-15"
      />

      {/* 4. Optical Silk / Crystal Glass Diffuser */}
      <div className="absolute inset-0 backdrop-blur-[36px] pointer-events-none opacity-90 -z-10" />

      {/* 5. Subtle specular shimmer grain */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay -z-5"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.9) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />
    </div>
  );
};

