/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from "react";

interface EmberOverlayProps {
  active: boolean;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  maxAlpha: number;
  decay: number;
  color: string;
  wobbleSpeed: number;
  wobbleRange: number;
  angle: number;
}

export default function EmberOverlay({ active }: EmberOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    const colors = [
      "rgba(249, 115, 22, ", // Orange-500
      "rgba(239, 68, 68, ",  // Red-500
      "rgba(251, 191, 36, ", // Amber-400
      "rgba(220, 38, 38, ",  // Red-600
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const createParticle = (spawnAtBottom = false): Particle => {
      const size = Math.random() * 3.5 + 0.8;
      const x = Math.random() * canvas.width;
      // Start below screen or randomly distributed if initial
      const y = spawnAtBottom ? canvas.height + 20 : Math.random() * canvas.height;
      const maxAlpha = Math.random() * 0.7 + 0.3;

      return {
        x,
        y,
        size,
        vx: (Math.random() * 1.5 - 0.75), // slow drift sideways
        vy: -(Math.random() * 2.2 + 1.2),  // drift upwards
        alpha: spawnAtBottom ? 0 : Math.random() * maxAlpha,
        maxAlpha,
        decay: Math.random() * 0.003 + 0.0015,
        color: colors[Math.floor(Math.random() * colors.length)],
        wobbleSpeed: Math.random() * 0.03 + 0.01,
        wobbleRange: Math.random() * 1.5 + 0.5,
        angle: Math.random() * Math.PI * 2,
      };
    };

    // Initialize with some particles
    const initialCount = active ? 40 : 10;
    for (let i = 0; i < initialCount; i++) {
      particles.push(createParticle(false));
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Target particle count based on active state
      const targetCount = active ? 120 : 0;

      // Spawn new particles if below target
      if (particles.length < targetCount && Math.random() < (active ? 0.45 : 0.05)) {
        particles.push(createParticle(true));
      }

      // Update and draw particles
      particles = particles.filter((p) => {
        // Upward floating physics
        p.y += p.vy;
        p.angle += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.angle) * p.wobbleRange;

        // Fade in if spawning, then fade out
        if (p.alpha < p.maxAlpha && p.y > canvas.height - 50) {
          p.alpha += 0.04;
        } else {
          p.alpha -= p.decay;
        }

        // Out of bounds or faded check
        if (p.y < -20 || p.x < -20 || p.x > canvas.width + 20 || p.alpha <= 0) {
          return false;
        }

        // Render glowing ember
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        // Add subtle radial glow for larger embers
        if (p.size > 2.2 && active) {
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3.5);
          glow.addColorStop(0, p.color + p.alpha + ")");
          glow.addColorStop(0.3, p.color + (p.alpha * 0.4) + ")");
          glow.addColorStop(1, p.color + "0)");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = p.color + p.alpha + ")";
          ctx.fill();
        }

        return true;
      });

      // Overlay high-stress heat haze / warning overlay around the borders
      if (active) {
        // Red-orange heat vignette
        const grad = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, canvas.width * 0.35,
          canvas.width / 2, canvas.height / 2, canvas.width * 0.8
        );
        grad.addColorStop(0, "rgba(239, 68, 68, 0)");
        grad.addColorStop(1, "rgba(239, 68, 68, 0.12)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Pulsing overlay glow representing rising smoke or heat
        const time = Date.now() * 0.0015;
        const bottomPulse = 0.03 + Math.sin(time) * 0.02;
        const bottomGrad = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - 180);
        bottomGrad.addColorStop(0, `rgba(239, 68, 68, ${bottomPulse})`);
        bottomGrad.addColorStop(1, "rgba(239, 68, 68, 0)");
        ctx.fillStyle = bottomGrad;
        ctx.fillRect(0, canvas.height - 180, canvas.width, 180);
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 w-full h-full ${
        active ? "z-30 opacity-100" : "z-10 opacity-30 pointer-events-none"
      }`}
      style={{ mixBlendMode: "screen" }}
      id="canvas-ember-overlay"
    />
  );
}
