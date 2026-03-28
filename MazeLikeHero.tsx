import React, { useEffect, useMemo, useRef } from "react";

type Particle = {
  baseAngle: number;
  baseRadius: number;
  radiusJitter: number;
  size: number;
  alpha: number;
  speed: number;
  orbitDrift: number;
  twinkle: number;
  twinkleSpeed: number;
  depth: number;
};

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function createParticles(count: number): Particle[] {
  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    // Distribución más densa en un anillo/halo central
    const ringBias = Math.random();
    const radiusCore =
      ringBias < 0.7
        ? 0.18 + Math.random() * 0.26
        : 0.42 + Math.random() * 0.18;

    particles.push({
      baseAngle: Math.random() * Math.PI * 2,
      baseRadius: radiusCore,
      radiusJitter: 0.008 + Math.random() * 0.035,
      size: 0.7 + Math.random() * 2.8,
      alpha: 0.07 + Math.random() * 0.35,
      speed: 0.08 + Math.random() * 0.22,
      orbitDrift: (Math.random() - 0.5) * 0.45,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.6 + Math.random() * 1.6,
      depth: 0.35 + Math.random() * 1.1,
    });
  }

  return particles;
}

export default function MazeLikeHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const particles = useMemo(() => createParticles(1800), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    let lastTime = performance.now();

    function resize() {
      const rect = wrapper.getBoundingClientRect();
      width = Math.floor(rect.width);
      height = Math.floor(rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function onPointerMove(e: PointerEvent) {
      const rect = wrapper.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      targetMouseX = (x - 0.5) * 2;
      targetMouseY = (y - 0.5) * 2;
    }

    function onPointerLeave() {
      targetMouseX = 0;
      targetMouseY = 0;
    }

    function drawBackgroundGlow(time: number) {
      const cx = width * 0.5 + mouseX * 18;
      const cy = height * 0.46 + mouseY * 10;

      // Fondo base
      const bg = ctx.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, "#07111f");
      bg.addColorStop(0.45, "#081425");
      bg.addColorStop(1, "#060d18");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // Gran halo difuso
      const outerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(width, height) * 0.42);
      outerGlow.addColorStop(0, "rgba(42, 138, 255, 0.11)");
      outerGlow.addColorStop(0.28, "rgba(38, 118, 255, 0.08)");
      outerGlow.addColorStop(0.5, "rgba(25, 79, 180, 0.05)");
      outerGlow.addColorStop(0.75, "rgba(9, 28, 58, 0.025)");
      outerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = outerGlow;
      ctx.fillRect(0, 0, width, height);

      // Núcleo luminoso central
      const pulse = 1 + Math.sin(time * 0.00035) * 0.04;
      const innerGlow = ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        Math.min(width, height) * 0.22 * pulse
      );
      innerGlow.addColorStop(0, "rgba(115, 190, 255, 0.095)");
      innerGlow.addColorStop(0.2, "rgba(52, 153, 255, 0.085)");
      innerGlow.addColorStop(0.55, "rgba(18, 65, 146, 0.045)");
      innerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = innerGlow;
      ctx.fillRect(0, 0, width, height);
    }

    function drawParticles(time: number) {
      const cx = width * 0.5 + mouseX * 22;
      const cy = height * 0.46 + mouseY * 12;

      ctx.save();
      ctx.globalCompositeOperation = "screen";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const t = time * 0.001;
        const angle =
          p.baseAngle +
          t * p.speed +
          Math.sin(t * 0.27 + p.twinkle) * 0.06 +
          p.orbitDrift * 0.12;

        const radialBreath =
          p.baseRadius +
          Math.sin(t * (0.45 + p.depth * 0.15) + p.twinkle) * p.radiusJitter;

        // Halo elíptico para parecer más cinematográfico
        const radiusX = Math.min(width, height) * radialBreath * 0.95;
        const radiusY = Math.min(width, height) * radialBreath * 0.68;

        const parallaxX = mouseX * 8 * p.depth;
        const parallaxY = mouseY * 5 * p.depth;

        const x = cx + Math.cos(angle) * radiusX + parallaxX;
        const y = cy + Math.sin(angle) * radiusY + parallaxY;

        // Fade por distancia al centro para que se vea “halo”
        const dx = (x - cx) / Math.max(1, Math.min(width, height) * 0.5);
        const dy = (y - cy) / Math.max(1, Math.min(width, height) * 0.36);
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ringFade = 1 - easeOutCubic(clamp(Math.abs(dist - 0.55) * 1.55, 0, 1));

        if (ringFade <= 0.01) continue;

        const twinkle = 0.72 + 0.45 * (0.5 + 0.5 * Math.sin(t * p.twinkleSpeed + p.twinkle));
        const alpha = p.alpha * twinkle * ringFade;

        const r = p.size * (0.75 + p.depth * 0.35);

        // Brillo
        const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3.2);
        g.addColorStop(0, `rgba(165, 225, 255, ${alpha})`);
        g.addColorStop(0.35, `rgba(78, 176, 255, ${alpha * 0.7})`);
        g.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r * 3.2, 0, Math.PI * 2);
        ctx.fill();

        // Núcleo
        ctx.fillStyle = `rgba(196, 236, 255, ${alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    function drawCenterMist(time: number) {
      const cx = width * 0.5 + mouseX * 12;
      const cy = height * 0.46 + mouseY * 6;

      ctx.save();
      ctx.globalCompositeOperation = "screen";

      for (let i = 0; i < 5; i++) {
        const phase = time * 0.00018 + i * 1.37;
        const rr = Math.min(width, height) * (0.11 + i * 0.022 + Math.sin(phase) * 0.004);
        const x = cx + Math.cos(phase * 1.2) * 8;
        const y = cy + Math.sin(phase * 0.9) * 6;

        const g = ctx.createRadialGradient(x, y, 0, x, y, rr);
        g.addColorStop(0, `rgba(98, 185, 255, ${0.028 - i * 0.004})`);
        g.addColorStop(0.55, `rgba(33, 106, 232, ${0.018 - i * 0.0025})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(x - rr, y - rr, rr * 2, rr * 2);
      }

      ctx.restore();
    }

    function drawVignette() {
      const g = ctx.createRadialGradient(
        width * 0.5,
        height * 0.42,
        Math.min(width, height) * 0.15,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.72
      );
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(0.72, "rgba(0,0,0,0.14)");
      g.addColorStop(1, "rgba(0,0,0,0.44)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
    }

    function drawNoise(time: number) {
      // Grano sutil para acabado premium
      const density = Math.floor((width * height) / 9000);
      ctx.save();
      ctx.globalAlpha = 0.045;

      for (let i = 0; i < density; i++) {
        const x = (Math.sin(i * 127.1 + time * 0.002) * 0.5 + 0.5) * width;
        const y = (Math.cos(i * 311.7 + time * 0.0017) * 0.5 + 0.5) * height;
        const s = i % 3 === 0 ? 1 : 0.8;
        ctx.fillStyle = i % 5 === 0 ? "#9ecfff" : "#7fb5ff";
        ctx.fillRect(x, y, s, s);
      }

      ctx.restore();
    }

    function render(now: number) {
      const dt = Math.min(40, now - lastTime);
      lastTime = now;

      mouseX = lerp(mouseX, targetMouseX, 0.035 * (dt / 16.666 + 1));
      mouseY = lerp(mouseY, targetMouseY, 0.035 * (dt / 16.666 + 1));

      drawBackgroundGlow(now);
      drawParticles(now);
      drawCenterMist(now);
      drawNoise(now);
      drawVignette();

      raf = requestAnimationFrame(render);
    }

    resize();
    raf = requestAnimationFrame(render);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrapper);

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", resize);
    };
  }, [particles]);

  return (
    <section
      ref={wrapperRef}
      className="relative min-h-screen overflow-hidden bg-[#07111f] text-white"
    >
      {/* Canvas del fondo */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      />

      {/* Overlay superior/inferior extra para profundidad */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(80,150,255,0.03),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(4,8,14,0.08),rgba(4,8,14,0.18)_45%,rgba(2,6,10,0.35))]" />

      {/* Contenido */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70 backdrop-blur-md">
          AI vulnerability platform
        </div>

        <h1 className="max-w-5xl text-balance text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl">
          Get cloud vulnerabilities
          <span className="block text-white/92">under control</span>
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-base leading-7 text-white/62 sm:text-lg">
          AI agents that investigate and resolve cloud vulnerabilities with a calm,
          premium, cinematic background effect inspired by Maze.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button className="rounded-full bg-white px-6 py-3 text-sm font-medium text-slate-950 transition hover:scale-[1.02]">
            Book Demo
          </button>
          <button className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white/86 backdrop-blur-md transition hover:bg-white/8">
            Learn More
          </button>
        </div>

        <div className="mt-16 text-sm tracking-[0.2em] text-white/35">
          SCROLL DOWN
        </div>
      </div>
    </section>
  );
}