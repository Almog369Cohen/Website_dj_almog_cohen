"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { initSource } from "@/lib/source";
import { track } from "@/lib/analytics";
import { waContextMessage, waHref } from "@/lib/whatsapp";

/**
 * One scroll loop for the whole site. It reads the page from data attributes and ids, so the sections
 * stay plain server components. Every scene has a static fallback in CSS (html[data-scenes="off"]).
 */
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const range = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeIn = (t: number) => t * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

type LenisLike = { stop: () => void; start: () => void; destroy: () => void };

export function Engine() {
  const path = usePathname();

  useEffect(() => {
    initSource();
    const root = document.documentElement;
    const scenes = root.dataset.scenes === "on";
    const desktop = () => window.innerWidth >= 1024;
    const $ = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s);
    const $$ = <T extends Element = HTMLElement>(s: string) => Array.from(document.querySelectorAll<T>(s));
    let vh = window.innerHeight, vw = window.innerWidth;
    const probe = document.createElement("div");
    probe.style.cssText = "position:absolute;visibility:hidden;height:100svh;width:1px;top:0;pointer-events:none";
    document.body.appendChild(probe);
    let svh = probe.offsetHeight || vh;
    const cleanups: (() => void)[] = [() => probe.remove()];

    /* WhatsApp: every link says what the couple was looking at when they tapped */
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest<HTMLAnchorElement>("a[data-wa-link]");
      if (!a) return;
      a.href = waHref(waContextMessage());
      track("click_whatsapp", { location: a.dataset.waLink || "" });
    };
    document.addEventListener("click", onClick, true);
    cleanups.push(() => document.removeEventListener("click", onClick, true));

    /* Smooth wheel scrolling on desktop only; touch stays native */
    let lenis: LenisLike | null = null;
    let alive = true;
    if (scenes && matchMedia("(hover: hover) and (pointer: fine)").matches) {
      import("lenis").then(({ default: Lenis }) => {
        if (!alive) return;
        lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: { offset: -72 }, autoRaf: true }) as unknown as LenisLike;
        (window as Window & { __lenis?: LenisLike }).__lenis = lenis;
      });
    }
    cleanups.push(() => {
      alive = false;
      lenis?.destroy();
      (window as Window & { __lenis?: LenisLike }).__lenis = undefined;
    });

    /* Hero: the window opens to full screen, then the paper rises over it */
    const hero = $("#top");
    const heroInner = $("#heroInner"), media = $("#heroMedia"), video = $<HTMLVideoElement>("#heroVideo"), shade = $("#heroShade");
    const mw1 = $(".mw1"), mw2 = $(".mw2"), slot = $("#slot"), rest = $("#heroRest"), copy = $("#heroCopy"), dim = $("#heroDim");
    let geo: { d: boolean; tx0: number; t: number; b: number; l: number; rr: number; travel: number } | null = null;
    let heroOpened = false;
    const heroGeometry = () => {
      if (!hero || !slot) return;
      const stage = hero.querySelector(".hero-stage")!.getBoundingClientRect();
      const r = slot.getBoundingClientRect();
      const top = r.top - stage.top, bottom = stage.bottom - r.bottom;
      if (desktop()) {
        const pw = 0.5625 * vh, tx0 = r.left - stage.left + r.width / 2 - pw / 2;
        geo = { d: true, tx0, t: top, b: bottom, l: r.left - stage.left - tx0, rr: tx0 + pw - (r.right - stage.left), travel: 1.3 * vh };
      } else {
        geo = { d: false, tx0: 0, t: top, b: bottom, l: r.left - stage.left, rr: stage.right - r.right, travel: svh };
      }
    };
    const heroUpdate = () => {
      if (!hero || !media || !video || !mw1 || !mw2 || !rest || !copy || !heroInner || !dim || !shade) return;
      if (!geo) heroGeometry();
      if (!geo) return;
      const scrolled = -hero.getBoundingClientRect().top;
      const z = clamp(scrolled / geo.travel, 0, 1);
      const cover = clamp((scrolled - geo.travel) / vh, 0, 1);
      const e = easeInOut(range(z, 0, 0.7)), k = 1 - e;
      media.style.clipPath = `inset(${(geo.t * k).toFixed(1)}px ${(geo.rr * k).toFixed(1)}px ${(geo.b * k).toFixed(1)}px ${(geo.l * k).toFixed(1)}px round ${(4 * k).toFixed(2)}px)`;
      media.style.transform = geo.d ? `translate3d(${(geo.tx0 * k).toFixed(1)}px,0,0)` : "none";
      video.style.transform = `scale(${lerp(1.18, 1, e).toFixed(4)})`;
      const w = easeIn(range(z, 0, 0.55)), wo = String(1 - range(z, 0.25, 0.55));
      mw1.style.transform = geo.d ? `translate3d(${w * 120}%,0,0)` : `translate3d(0,${-w * 110}%,0)`;
      mw2.style.transform = geo.d ? `translate3d(${-w * 120}%,0,0)` : `translate3d(0,${w * 110}%,0)`;
      mw1.style.opacity = mw2.style.opacity = wo;
      rest.style.opacity = String(1 - range(z, 0.08, 0.3));
      shade.style.opacity = geo.d ? "0" : String(range(z, 0.35, 0.7));
      const c = easeOut(range(z, 0.55, 0.9));
      copy.style.opacity = String(c);
      copy.style.visibility = c > 0.01 ? "visible" : "hidden";
      copy.style.transform = `translate3d(0,${((1 - c) * 28).toFixed(1)}px,0)`;
      heroInner.style.transform = `scale(${lerp(1, 0.94, cover).toFixed(4)})`;
      dim.style.opacity = (cover * 0.6).toFixed(3);
      if (z >= 1 && !heroOpened) { heroOpened = true; track("hero_opened"); }
    };
    // The opening video loads after the page itself, so the poster is the first thing painted
    if (video && !video.querySelector("source") && video.dataset.webm) {
      const startVideo = () => {
        if (!alive || video.querySelector("source")) return;
        for (const [src, type] of [[video.dataset.webm!, "video/webm"], [video.dataset.mp4!, "video/mp4"]]) {
          const s = document.createElement("source");
          s.src = src;
          s.type = type;
          video.appendChild(s);
        }
        video.preload = "auto";
        video.load();
        if (!video.closest("[data-paused]")) void video.play().catch(() => {});
      };
      if (document.readyState === "complete") setTimeout(startVideo, 200);
      else window.addEventListener("load", () => setTimeout(startVideo, 200), { once: true });
    }
    const pause = $("#pause");
    if (pause && video) {
      const toggle = () => {
        const paused = !video.paused;
        if (paused) video.pause(); else void video.play();
        pause.setAttribute("aria-pressed", String(paused));
        pause.setAttribute("aria-label", paused ? "הפעלת הסרטון" : "עצירת הסרטון");
        pause.classList.toggle("is-paused", paused);
      };
      pause.addEventListener("click", toggle);
      cleanups.push(() => pause.removeEventListener("click", toggle));
    }

    /* Manifesto: the seven tasks light up one by one */
    const says = $("#says");
    const words = says ? $$(".w").filter((w) => says.contains(w)) : [];
    const saysUpdate = () => {
      if (!says) return;
      const r = says.getBoundingClientRect();
      const p = clamp((vh * 0.82 - r.top) / (r.height + vh * 0.3), 0, 1);
      // the unlit words stay at 55% so the large text keeps a 3:1 contrast even before it lights up
      words.forEach((w, i) => (w.style.opacity = (0.55 + 0.45 * clamp(p * words.length * 1.15 - i, 0, 1)).toFixed(3)));
    };

    /* The wipe: from "all with us" to "you keep the evening" */
    const wipe = $("#wipe"), wOver = $("#wipeOver"), wUnder = $("#wipeUnder"), capOne = $("#capOne"), capTwo = $("#capTwo");
    const wipeUpdate = () => {
      if (!wipe || !wOver || !wUnder || !capOne || !capTwo) return;
      const r = wipe.getBoundingClientRect();
      const P = clamp(-r.top / (r.height - vh), 0, 1);
      const e = easeInOut(range(P, 0.2, 0.7));
      wOver.style.clipPath = `inset(${((1 - e) * 100).toFixed(2)}% 0 0 0)`;
      wUnder.style.transform = `scale(${lerp(1, 1.08, range(P, 0, 0.7)).toFixed(4)})`;
      capOne.style.opacity = String(1 - range(P, 0.35, 0.5));
      const t = range(P, 0.6, 0.8);
      capTwo.style.opacity = String(t);
      capTwo.style.transform = `translate3d(0,${((1 - t) * 24).toFixed(1)}px,0)`;
    };

    /* Marquee moves only while you scroll */
    const mq = $("#marquee");
    const marqueeUpdate = () => {
      if (!mq) return;
      const r = mq.getBoundingClientRect();
      const p = clamp((vh - r.top) / (vh + r.height), 0, 1);
      const room = Math.max(0, Math.min(mq.scrollWidth - vw, mq.scrollWidth * 0.3));
      mq.style.transform = `translate3d(${(p * room).toFixed(1)}px,0,0)`;
    };

    /* The night: vertical scroll drives the sideways track; the lights go down before the dance floor */
    const night = $("#night"), pin = $("#trackPin"), stage = $("#trackStage"), trackEl = $("#track"), bar = $("#trackBar");
    const cards = $$(".card");
    let travel = 0, nightDone = false;
    const trackGeometry = () => {
      if (!trackEl || !stage || !pin) return;
      travel = Math.max(0, trackEl.scrollWidth - stage.clientWidth);
      pin.style.height = scenes ? `${vh + travel * (desktop() ? 1 : 0.9)}px` : "";
    };
    const dusk = [21, 17, 13], deep = [7, 6, 8];
    const trackUpdate = () => {
      if (!pin || !trackEl || !bar || !night) return;
      const r = pin.getBoundingClientRect();
      const P = clamp(-r.top / Math.max(1, r.height - vh), 0, 1);
      trackEl.style.transform = `translate3d(${(P * travel).toFixed(1)}px,0,0)`;
      bar.style.transform = `scaleX(${P.toFixed(4)})`;
      const d = range(P, 0.55, 0.7);
      night.style.backgroundColor = `rgb(${dusk.map((c, i) => Math.round(lerp(c, deep[i], d))).join(",")})`;
      cards.forEach((card) => {
        const cr = card.getBoundingClientRect();
        const off = clamp((cr.left + cr.width / 2 - vw / 2) / vw, -1, 1);
        const img = card.querySelector<HTMLElement>("img");
        if (img) img.style.transform = `translate3d(${(-off * 6).toFixed(2)}%,0,0)`;
        const txt = card.querySelector<HTMLElement>(".txt");
        if (txt) txt.style.opacity = (1 - clamp(Math.abs(off) * 0.6, 0, 0.25)).toFixed(3);
      });
      if (P >= 0.99 && !nightDone) { nightDone = true; track("night_finished"); }
    };

    /* How it works: the photo beside the steps changes with each step (desktop) */
    const steps = $$(".step"), frameImgs = $$("#howFrame img"), howCap = $("#howCap");
    let active = 0;
    const stepsUpdate = () => {
      if (!desktop() || !steps.length) return;
      let i = 0;
      steps.forEach((s, k) => { if (s.getBoundingClientRect().top < vh * 0.55) i = k; });
      if (i === active) return;
      active = i;
      frameImgs.forEach((im, k) => { im.classList.toggle("on", k <= i); im.style.zIndex = String(k); });
      if (howCap) howCap.textContent = steps[i].querySelector(".label")?.textContent ?? "";
    };

    /* Photo reveals, parallax bands, rising names, gallery columns and the closing zoom */
    const photosUpdate = () => {
      $$("[data-reveal]").forEach((el) => {
        const r = el.getBoundingClientRect();
        const e = easeOut(clamp((vh - r.top) / (vh * 0.7), 0, 1));
        el.style.clipPath = `inset(${((1 - e) * 16).toFixed(2)}% ${((1 - e) * 10).toFixed(2)}%)`;
        const img = el.querySelector<HTMLElement>("img");
        if (img) img.style.transform = `scale(${lerp(1.25, 1, e).toFixed(4)})`;
      });
      $$("[data-par]").forEach((el) => {
        const r = el.getBoundingClientRect();
        const p = clamp((vh - r.top) / (vh + r.height), 0, 1);
        const img = el.querySelector<HTMLElement>("img");
        if (img) img.style.transform = `translate3d(0,${lerp(-6, 6, p).toFixed(2)}%,0)`;
      });
      $$("[data-rise]").forEach((el) => {
        const r = el.getBoundingClientRect();
        const e = easeOut(clamp((vh - r.top) / (vh * 0.5), 0, 1));
        el.style.transform = `translate3d(0,${((1 - e) * 40).toFixed(1)}px,0)`;
      });
      $$("[data-zoom]").forEach((el) => {
        const r = el.getBoundingClientRect();
        const e = easeOut(clamp((vh - r.top) / (vh * 0.9), 0, 1));
        const img = el.querySelector<HTMLElement>("img");
        if (img) img.style.transform = `scale(${lerp(1.12, 1, e).toFixed(4)})`;
      });
      const cols = $("#cols");
      if (cols) {
        const r = cols.getBoundingClientRect();
        const p = clamp((vh - r.top) / (vh + r.height), 0, 1);
        const s = desktop() ? [-50, -120, -30] : [-20, -60];
        Array.from(cols.children).forEach((c, k) => ((c as HTMLElement).style.transform = `translate3d(0,${((s[k] || 0) * p).toFixed(1)}px,0)`));
      }
    };

    /* Header tone, hide on scroll down, the floating button and the footer wordmark */
    const head = $("#head"), headWa = $("#headWa"), fab = $("#fab"), manifesto = $("#difference");
    const bigmark = $("#bigmark"), footer = $(".closing");
    let lastY = window.scrollY;
    const chromeUpdate = () => {
      const y = window.scrollY;
      let tone = "paper";
      $$("[data-tone]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= 32 && r.bottom > 32) tone = el.dataset.tone || tone;
      });
      if (head) {
        head.classList.toggle("over-hero", tone === "hero");
        head.classList.toggle("is-paper", tone === "paper");
        head.classList.toggle("is-dark", tone === "dark");
        const menuOpen = !document.getElementById("menu")?.hidden;
        if (y > lastY + 2 && y > vh * 1.2 && !menuOpen) head.classList.add("is-hidden");
        if (y < lastY - 2 || y < vh * 1.2) head.classList.remove("is-hidden");
      }
      lastY = y;
      const started = manifesto ? manifesto.getBoundingClientRect().top < vh * 0.5 : y > vh * 0.6;
      const at = vh - 40;
      const hidden = $$("[data-hide-fab]").some((el) => { const r = el.getBoundingClientRect(); return r.top < at && r.bottom > at; });
      const on = started && !hidden;
      fab?.classList.toggle("on", on);
      headWa?.classList.toggle("gone", on);
      if (bigmark && footer) {
        const fr = footer.getBoundingClientRect();
        const fp = scenes ? clamp((vh - fr.top) / fr.height, 0, 1) : 1;
        bigmark.style.transform = `translate3d(0,${((1 - fp) * 45).toFixed(2)}%,0)`;
      }
    };

    let ticking = false;
    const frame = () => {
      ticking = false;
      chromeUpdate();
      if (!scenes) return;
      heroUpdate(); saysUpdate(); wipeUpdate(); marqueeUpdate(); trackUpdate(); stepsUpdate(); photosUpdate();
    };
    const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
    let lastDesk = desktop();
    const measure = () => {
      vh = window.innerHeight; vw = window.innerWidth; svh = probe.offsetHeight || vh;
      if (scenes) { heroGeometry(); trackGeometry(); }
      if (desktop() !== lastDesk) { lastDesk = desktop(); window.dispatchEvent(new Event("rever:breakpoint")); }
      request();
    };
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    window.addEventListener("rever:layout", measure);
    document.fonts?.ready.then(measure);
    cleanups.push(() => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
      window.removeEventListener("rever:layout", measure);
    });
    measure();

    return () => cleanups.forEach((f) => f());
  }, [path]);

  return null;
}
