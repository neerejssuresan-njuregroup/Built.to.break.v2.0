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

interface Debris {
  id: number;
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  type: 'brick' | 'beam' | 'shard' | 'glowing_chunk';
  color: string;
  onFire: boolean;
}

interface FlameTrail {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  decay: number;
}

export default function EmberOverlay({ active }: EmberOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isPastMetricsRef = useRef<boolean>(false);
  const lastScrollYRef = useRef<number>(0);

  // Scroll listener to detect if we have reached the Core Analytical Metrics (scrollytelling) or beyond
  useEffect(() => {
    const handleScroll = () => {
      const scrollytellingSec = document.getElementById("section-scrollytelling");
      if (!scrollytellingSec) return;

      const rect = scrollytellingSec.getBoundingClientRect();
      // True if the scrollytelling section top has crossed or is about to cross the viewport
      isPastMetricsRef.current = rect.top <= window.innerHeight * 0.9;
      
      // Use scroll speed/velocity to dynamically trigger extra debris falling!
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollYRef.current);
      lastScrollYRef.current = currentScrollY;

      // If scrolling fast, shake structural parts and spawn extra debris
      if (isPastMetricsRef.current && scrollDelta > 15 && Math.random() < 0.25) {
        window.dispatchEvent(new CustomEvent("structural-rumble", { detail: { intensity: scrollDelta } }));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Trigger initial check
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    let fallingDebris: Debris[] = [];
    let flameTrails: FlameTrail[] = [];
    let nextDebrisId = 0;

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

    // Floating sparks/embers generator
    const createParticle = (spawnAtBottom = false): Particle => {
      const size = Math.random() * 3.5 + 0.8;
      const x = Math.random() * canvas.width;
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

    // Falling burning building structures generator
    const spawnDebris = (forceIntensity = 0) => {
      const types: Array<'brick' | 'beam' | 'shard' | 'glowing_chunk'> = ['brick', 'beam', 'shard', 'glowing_chunk'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      const size = type === 'beam' 
        ? Math.random() * 18 + 12  // beams are longer
        : Math.random() * 10 + 6;  // bricks/shards are chunky
        
      const x = Math.random() * canvas.width;
      const y = -40; // Spawn just above viewport
      
      const vy = Math.random() * 3.0 + 2.5 + (forceIntensity * 0.05); // falling speed
      const vx = Math.random() * 2.5 - 1.25; // slight sideways draft
      
      // dark burnt carbon gray, charred orange-red, or golden spark
      let color = "#18181b"; // zinc-900 (charred black)
      if (type === 'glowing_chunk') {
        color = "#ea580c"; // orange-600
      } else if (Math.random() > 0.5) {
        color = "#27272a"; // zinc-800
      } else {
        color = "#7f1d1d"; // dark red-900 (burnt clay brick)
      }

      fallingDebris.push({
        id: nextDebrisId++,
        x,
        y,
        size,
        vx,
        vy,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() * 0.06 - 0.03),
        type,
        color,
        onFire: type === 'glowing_chunk' || Math.random() > 0.3
      });
    };

    // Add extra debris when structural rumble occurs
    const handleRumble = (e: Event) => {
      const customEvent = e as CustomEvent;
      const intensity = customEvent.detail?.intensity || 10;
      const count = Math.min(Math.floor(intensity / 12) + 1, 4);
      for (let i = 0; i < count; i++) {
        setTimeout(() => spawnDebris(intensity), i * 150);
      }
    };

    window.addEventListener("structural-rumble", handleRumble);

    // Initialize floaters
    const initialCount = active ? 40 : 15;
    for (let i = 0; i < initialCount; i++) {
      particles.push(createParticle(false));
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isPastMetrics = isPastMetricsRef.current;

      // 1. SPARK EMBER FLUID PHYSICS
      const targetCount = active ? 120 : (isPastMetrics ? 50 : 15);
      if (particles.length < targetCount && Math.random() < (active ? 0.45 : 0.15)) {
        particles.push(createParticle(true));
      }

      particles = particles.filter((p) => {
        p.y += p.vy;
        p.angle += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.angle) * p.wobbleRange;

        if (p.alpha < p.maxAlpha && p.y > canvas.height - 50) {
          p.alpha += 0.04;
        } else {
          p.alpha -= p.decay;
        }

        if (p.y < -20 || p.x < -20 || p.x > canvas.width + 20 || p.alpha <= 0) {
          return false;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        if (p.size > 2.2 && (active || isPastMetrics)) {
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

      // 2. FALLING BUILDING DEBRIS SYSTEM (ACCIDENT ZONE)
      if (isPastMetrics) {
        // Spawn debris randomly based on stress level
        const spawnChance = active ? 0.09 : 0.03;
        if (Math.random() < spawnChance && fallingDebris.length < 15) {
          spawnDebris();
        }

        // Draw and update debris pieces
        fallingDebris = fallingDebris.filter((d) => {
          // Physics: gravity fall
          d.y += d.vy;
          d.x += d.vx;
          d.rotation += d.rotationSpeed;

          // Out of screen bounds
          if (d.y > canvas.height + 40) {
            return false;
          }

          // If on fire, emit fire/spark trail particles
          if (d.onFire && Math.random() < 0.7) {
            flameTrails.push({
              x: d.x + (Math.random() * d.size - d.size / 2),
              y: d.y + (Math.random() * d.size - d.size / 2),
              size: Math.random() * 3 + 2,
              vx: (Math.random() * 1.2 - 0.6) + d.vx * 0.2,
              vy: -(Math.random() * 1.5 + 0.5), // float upwards
              alpha: 1.0,
              color: colors[Math.floor(Math.random() * colors.length)],
              decay: Math.random() * 0.04 + 0.02
            });
          }

          // Render building debris geometry
          ctx.save();
          ctx.translate(d.x, d.y);
          ctx.rotate(d.rotation);
          
          // Draw charred shadow glow
          ctx.shadowColor = "rgba(220, 38, 38, 0.45)";
          ctx.shadowBlur = d.onFire ? 15 : 0;

          ctx.fillStyle = d.color;
          
          if (d.type === 'brick') {
            // Rectangular brick fragment
            ctx.fillRect(-d.size, -d.size / 2, d.size * 2, d.size);
            // Draw some cracks or texture
            ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
            ctx.fillRect(-d.size + 2, -1, d.size - 2, 2);
          } else if (d.type === 'beam') {
            // Long steel/timber structural beam
            ctx.fillRect(-d.size, -2, d.size * 2, 4);
            // Glowing hot end
            if (d.onFire) {
              const grad = ctx.createLinearGradient(-d.size, 0, d.size, 0);
              grad.addColorStop(0, "rgba(239, 68, 68, 0.9)");
              grad.addColorStop(0.3, "rgba(249, 115, 22, 0.8)");
              grad.addColorStop(0.6, d.color);
              ctx.fillStyle = grad;
              ctx.fillRect(-d.size, -2, d.size * 2, 4);
            }
          } else if (d.type === 'shard') {
            // Triangular sharp concrete shard
            ctx.beginPath();
            ctx.moveTo(0, -d.size / 2);
            ctx.lineTo(d.size / 2, d.size / 2);
            ctx.lineTo(-d.size / 2, d.size / 2);
            ctx.closePath();
            ctx.fill();
          } else {
            // Glowing fire chunk (pure combustion)
            ctx.fillStyle = "rgba(251, 191, 36, 1.0)"; // Amber-400
            ctx.beginPath();
            ctx.arc(0, 0, d.size * 0.7, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
          return true;
        });

        // Update & Render Flame Trails
        flameTrails = flameTrails.filter((t) => {
          t.x += t.vx;
          t.y += t.vy;
          t.alpha -= t.decay;

          if (t.alpha <= 0) return false;

          ctx.beginPath();
          ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
          ctx.fillStyle = t.color + t.alpha + ")";
          ctx.fill();
          return true;
        });
      }

      // 3. BOTTOM BUILDING WASTES & FIRE WASTES PILES
      if (isPastMetrics) {
        const height = canvas.height;
        const width = canvas.width;
        const pulse = 0.55 + Math.sin(Date.now() * 0.003) * 0.25;

        // Base glow behind wastes
        const glowGrad = ctx.createLinearGradient(0, height, 0, height - 70);
        glowGrad.addColorStop(0, `rgba(220, 38, 38, ${0.15 * pulse})`);
        glowGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, height - 70, width, 70);

        // Draw irregular layered piles of structural burnt wreckage at the bottom
        ctx.fillStyle = "#0c0c0e"; // extremely dark zinc
        ctx.strokeStyle = `rgba(127, 29, 29, ${0.5 + pulse * 0.2})`; // deep red
        ctx.lineWidth = 1.5;

        // Left wreckage pile
        ctx.beginPath();
        ctx.moveTo(-10, height);
        ctx.lineTo(10, height - 25);
        ctx.lineTo(width * 0.12, height - 45);
        ctx.lineTo(width * 0.22, height - 20);
        ctx.lineTo(width * 0.32, height - 35);
        ctx.lineTo(width * 0.42, height);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Right wreckage pile
        ctx.beginPath();
        ctx.moveTo(width * 0.62, height);
        ctx.lineTo(width * 0.72, height - 30);
        ctx.lineTo(width * 0.85, height - 55);
        ctx.lineTo(width * 0.92, height - 22);
        ctx.lineTo(width + 10, height - 40);
        ctx.lineTo(width + 10, height);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Glowing red-hot thermal fracture lines in the structural wastes
        ctx.strokeStyle = `rgba(239, 68, 68, ${0.4 + pulse * 0.4})`; // pulsing vibrant red
        ctx.lineWidth = 2.0;
        
        // Fracture 1
        ctx.beginPath();
        ctx.moveTo(width * 0.08, height - 12);
        ctx.lineTo(width * 0.13, height - 28);
        ctx.lineTo(width * 0.17, height - 18);
        ctx.stroke();

        // Fracture 2
        ctx.strokeStyle = `rgba(249, 115, 22, ${0.3 + pulse * 0.5})`; // orange
        ctx.beginPath();
        ctx.moveTo(width * 0.81, height - 15);
        ctx.lineTo(width * 0.85, height - 38);
        ctx.lineTo(width * 0.89, height - 24);
        ctx.stroke();

        // Spawn small flickering flames randomly from the bottom rubble
        const time = Date.now() * 0.01;
        const flameCount = active ? 10 : 5;
        const flamePositions = [
          width * 0.05, width * 0.11, width * 0.16, width * 0.25,
          width * 0.68, width * 0.76, width * 0.84, width * 0.91
        ];

        for (let i = 0; i < Math.min(flameCount, flamePositions.length); i++) {
          const fx = flamePositions[i];
          const flameHeight = (12 + Math.sin(time + i * 1.5) * 6) * (active ? 1.8 : 1.0);
          
          ctx.beginPath();
          ctx.moveTo(fx - 4, height);
          ctx.quadraticCurveTo(fx, height - flameHeight, fx + 4, height);
          ctx.closePath();
          
          const grad = ctx.createLinearGradient(fx, height, fx, height - flameHeight);
          grad.addColorStop(0, "rgba(220, 38, 38, 0.8)"); // Red
          grad.addColorStop(0.5, "rgba(249, 115, 22, 0.9)"); // Orange
          grad.addColorStop(1, "rgba(253, 224, 71, 0)"); // Amber transparent
          
          ctx.fillStyle = grad;
          ctx.fill();
        }
      }

      // 4. GLOBAL HEAT VIGNETTE (Active High Tension Overlay)
      if (active) {
        const grad = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, canvas.width * 0.35,
          canvas.width / 2, canvas.height / 2, canvas.width * 0.8
        );
        grad.addColorStop(0, "rgba(239, 68, 68, 0)");
        grad.addColorStop(1, "rgba(239, 68, 68, 0.14)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Heat pulse overlay representing extreme danger state
        const time = Date.now() * 0.0015;
        const bottomPulse = 0.04 + Math.sin(time) * 0.03;
        const bottomGrad = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - 200);
        bottomGrad.addColorStop(0, `rgba(239, 68, 68, ${bottomPulse})`);
        bottomGrad.addColorStop(1, "rgba(239, 68, 68, 0)");
        ctx.fillStyle = bottomGrad;
        ctx.fillRect(0, canvas.height - 200, canvas.width, 200);
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("structural-rumble", handleRumble);
      cancelAnimationFrame(animationId);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 w-full h-full ${
        active ? "z-30 opacity-100" : "z-10 opacity-40 pointer-events-none"
      }`}
      style={{ mixBlendMode: "screen" }}
      id="canvas-ember-overlay"
    />
  );
}
