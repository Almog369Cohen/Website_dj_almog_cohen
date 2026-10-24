"use client";

import { useEffect, useRef } from "react";

const BPM = 124;
const BEAT = 60 / BPM;
type RGB = [number, number, number];
const PATTERNS: { name: string; colors: RGB[] }[] = [
  { name: "fan", colors: [[57, 255, 20], [57, 255, 20]] },
  { name: "cross", colors: [[0, 229, 255], [255, 46, 196]] },
  { name: "floor", colors: [[255, 40, 60], [255, 196, 90]] },
  { name: "tunnel", colors: [[140, 80, 255], [0, 229, 255]] },
];
const HEADS: RGB[] = [[255, 70, 190], [90, 150, 255], [170, 90, 255], [255, 190, 90]];

/**
 * Real-time light show on a canvas: lasers that change pattern every 8 beats,
 * moving-head cones, a pulsing dance floor and a dancing crowd silhouette.
 * Lasers aim at the pointer (or a tap) when the visitor interacts.
 * Pauses when inactive, off screen or the tab is hidden. No strobing.
 */
export function LightShow({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host || !active) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1, raf = 0, visible = true;
    const aim = { x: 0, y: 0, t: -10 };
    let crowd: { x: number; r: number; phase: number; hands: number }[] = [];

    const resize = () => {
      const mobile = innerWidth < 768;
      dpr = Math.min(devicePixelRatio || 1, mobile ? 1.25 : 1.5);
      w = host.clientWidth;
      h = host.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      crowd = [];
      let x = -20;
      let k = 0;
      while (x < w + 40) {
        const r = (mobile ? 13 : 17) + ((k * 7919) % 9);
        crowd.push({ x, r, phase: (k * 0.37) % 1, hands: k % 3 === 0 ? 2 : k % 4 === 1 ? 1 : 0 });
        x += r * (1.6 + ((k * 31) % 7) / 10);
        k++;
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const onPointer = (e: PointerEvent) => {
      if (e.type === "pointermove" && e.pointerType !== "mouse") return;
      const r = host.getBoundingClientRect();
      aim.x = e.clientX - r.left;
      aim.y = e.clientY - r.top;
      aim.t = performance.now() / 1000;
    };
    host.addEventListener("pointermove", onPointer, { passive: true });
    host.addEventListener("pointerdown", onPointer, { passive: true });
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(host);

    const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

    const beam = (x0: number, y0: number, ang: number, c: RGB, k: number) => {
      const len = Math.hypot(w, h) * 1.3;
      const x1 = x0 + Math.sin(ang) * len;
      const y1 = y0 + Math.cos(ang) * len;
      ctx.strokeStyle = rgba(c, 0.07 * k);
      ctx.lineWidth = 9;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      ctx.strokeStyle = rgba(c, 0.28 * k);
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.strokeStyle = rgba([255, 255, 255], 0.5 * k);
      ctx.lineWidth = 0.8;
      ctx.stroke();
    };

    const draw = (ms: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible || document.hidden) return;
      const t = ms / 1000;
      const beatPos = (t % BEAT) / BEAT;
      const kick = Math.exp(-beatPos * 5);
      const phrase = Math.floor(t / BEAT / 8) % PATTERNS.length;
      const pat = PATTERNS[phrase];
      const aiming = t - aim.t < 2.5;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      // moving heads
      HEADS.forEach((c, i) => {
        const x0 = w * (0.12 + i * 0.25);
        const sway = Math.sin(t * (0.5 + i * 0.13) + i * 1.7) * 0.55;
        const spread = 0.13;
        const len = h * 1.25;
        const g = ctx.createLinearGradient(x0, 0, x0 + Math.sin(sway) * len, len);
        g.addColorStop(0, rgba(c, 0.32 + 0.12 * kick));
        g.addColorStop(1, rgba(c, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(x0, -10);
        ctx.lineTo(x0 + Math.sin(sway - spread) * len, Math.cos(sway - spread) * len);
        ctx.lineTo(x0 + Math.sin(sway + spread) * len, Math.cos(sway + spread) * len);
        ctx.closePath();
        ctx.fill();
      });

      // lasers
      const k = 0.75 + 0.25 * kick;
      const n = w < 768 ? 7 : 11;
      if (aiming) {
        const emitters: [number, number][] = [[0, h * 0.82], [w, h * 0.82], [w * 0.5, -5], [w * 0.15, -5], [w * 0.85, -5]];
        emitters.forEach(([x0, y0], i) => {
          const base = Math.atan2(aim.x - x0, aim.y - y0);
          for (let j = -1; j <= 1; j++) beam(x0, y0, base + j * 0.015, PATTERNS[(phrase + i) % PATTERNS.length].colors[0], k);
        });
      } else if (pat.name === "fan") {
        const swing = Math.sin(t * 0.9) * 0.35;
        for (let j = 0; j < n; j++) beam(w * 0.5, -5, swing + (j - (n - 1) / 2) * 0.13, pat.colors[0], k);
      } else if (pat.name === "cross") {
        for (let j = 0; j < Math.ceil(n / 2); j++) {
          beam(w * 0.06, -5, 0.35 + Math.sin(t * 1.2) * 0.3 + j * 0.09, pat.colors[0], k);
          beam(w * 0.94, -5, -0.35 - Math.sin(t * 1.2) * 0.3 - j * 0.09, pat.colors[1], k);
        }
      } else if (pat.name === "floor") {
        for (let j = 0; j < Math.ceil(n / 2); j++) {
          beam(0, h * 0.85, Math.PI - 1.0 - j * 0.1 + Math.sin(t) * 0.2, pat.colors[0], k);
          beam(w, h * 0.85, -(Math.PI - 1.0 - j * 0.1 + Math.sin(t) * 0.2), pat.colors[1], k);
        }
      } else {
        for (let j = 0; j < n; j++) {
          const a = t * 0.8 + (j / n) * Math.PI * 2;
          beam(w * 0.5, -5, Math.sin(a) * 0.7, pat.colors[j % 2], k);
        }
      }

      // dance-floor glow, pulsing on the kick
      const fc = pat.colors[Math.floor(t / BEAT) % 2];
      const fg = ctx.createRadialGradient(w / 2, h * 1.05, 0, w / 2, h * 1.05, w * 0.7);
      fg.addColorStop(0, rgba(fc, 0.18 + 0.22 * kick));
      fg.addColorStop(1, rgba(fc, 0));
      ctx.fillStyle = fg;
      ctx.fillRect(0, h * 0.4, w, h * 0.6);

      // crowd silhouette, bouncing on the beat
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#050407";
      ctx.strokeStyle = "#050407";
      ctx.lineCap = "round";
      const floorY = h + 6;
      for (const p of crowd) {
        const bob = Math.max(0, Math.sin((beatPos + p.phase) * Math.PI * 2)) * p.r * 0.35;
        const cy = floorY - p.r * 2.9 - bob;
        ctx.beginPath();
        ctx.arc(p.x, cy, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(p.x - p.r * 1.7, cy + p.r * 0.9, p.r * 3.4, p.r * 4, p.r);
        ctx.fill();
        if (p.hands) {
          ctx.lineWidth = p.r * 0.55;
          for (let s = 0; s < p.hands; s++) {
            const side = p.hands === 1 ? 1 : s === 0 ? -1 : 1;
            const lift = p.r * (3.2 + bob / p.r);
            ctx.beginPath();
            ctx.moveTo(p.x + side * p.r * 1.2, cy + p.r * 1.4);
            ctx.lineTo(p.x + side * p.r * 1.9, cy - lift);
            ctx.stroke();
          }
        }
      }
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onPointer);
      host.removeEventListener("pointerdown", onPointer);
    };
  }, [active]);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
}
