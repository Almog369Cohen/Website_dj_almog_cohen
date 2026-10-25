"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { initSource } from "@/lib/source";
import { track } from "@/lib/analytics";
import { waContextMessage, waHref } from "@/lib/whatsapp";
import { journey } from "@/content/site";

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

    /*
     * Hero: the first photo opens from the window to full screen, then the journey. Every layer is a
     * full-screen box that is only ever transformed. The next stage is that same box scaled down by 1/S
     * around an anchor on something real in the current photo, so its crop is exactly its full-screen crop
     * and it lands with no jump. Layers are siblings and the transforms are composed here.
     */
    const hero = $("#top");
    const heroInner = $("#heroInner"), media = $("#heroMedia"), video = $<HTMLVideoElement>("#heroVideo"), shade = $("#heroShade");
    const mw1 = $(".mw1"), mw2 = $(".mw2"), slot = $("#slot"), rest = $("#heroRest"), copy = $("#heroCopy"), dim = $("#heroDim");
    const jcap = $("#jcap"), jnum = $("#jnum"), jname = $("#jname"), jline = $("#jline"), jskip = $("#jskip"), pause = $("#pause");
    const segs = $$(".jbar b");
    const nums = (v?: string) => (v ? v.split(",").map(Number) : null);
    const layers = $$(".jl").map((el) => ({
      el, img: el.querySelector<HTMLElement>("img, video"), w: +(el.dataset.w || 1), h: +(el.dataset.h || 1),
      crop: nums(el.dataset.crop), at: nums(el.dataset.at) ?? [0.5, 0.5], pos: nums(el.dataset.pos) ?? [0.5, 0.5],
      pan: nums(el.dataset.pan), desk: nums(el.dataset.desk) ?? [0.5, 0.5], S: +(el.dataset.s || 3),
    }));
    const N = layers.length;
    const phoneQ = matchMedia("(max-aspect-ratio: 3/4)");
    type Aff = { k: number; x: number; y: number };
    const about = (k: number, P: number[]): Aff => ({ k, x: P[0] * (1 - k), y: P[1] * (1 - k) });
    const comp = (a: Aff, b: Aff): Aff => ({ k: a.k * b.k, x: a.k * b.x + a.x, y: a.k * b.y + a.y });
    let geo: { t: number; b: number; l: number; rr: number; travel: number; j0: number; per: number; end: number; cover: number; W: number; H: number } | null = null;
    let heroOpened = false, shown = -1, userPaused = false, journeyStage = -1;
    const seen = new Set<number>();
    /** Where layer k's anchor sits on screen, for its object-position (panned by `pan` on a phone). */
    const anchor = (k: number, panT: number) => {
      const l = layers[k], phone = phoneQ.matches;
      let iw = l.w, ax = l.at[0];
      if (phone && l.crop) { iw = l.w * (l.crop[1] - l.crop[0]); ax = (ax - l.crop[0]) / (l.crop[1] - l.crop[0]); }
      const base = phone ? l.pos : l.desk;
      const p = phone && l.pan ? [lerp(base[0], l.pan[0], panT), lerp(base[1], l.pan[1], panT)] : base;
      const c = Math.max(geo!.W / iw, geo!.H / l.h), dw = iw * c, dh = l.h * c;
      return { P: [(geo!.W - dw) * p[0] + ax * dw, (geo!.H - dh) * p[1] + l.at[1] * dh], p };
    };
    const place = (k: number, p: number[]) => { const im = layers[k]?.img; if (im) im.style.objectPosition = `${(p[0] * 100).toFixed(2)}% ${(p[1] * 100).toFixed(2)}%`; };
    const heroGeometry = () => {
      if (!hero || !slot) return;
      const stage = hero.querySelector(".hero-stage")!.getBoundingClientRect();
      const r = slot.getBoundingClientRect();
      const travel = desktop() ? vh : svh, per = desktop() ? 0.85 * vh : 0.7 * svh, j0 = 0.72 * travel;
      const end = j0 + (N - 1) * per;
      // the section is as tall as the journey; the paper rises over the copy once it has settled
      const height = end + 0.6 * per + 2 * vh;
      hero.style.height = `${Math.round(height)}px`;
      geo = { t: r.top - stage.top, b: stage.bottom - r.bottom, l: r.left - stage.left, rr: stage.right - r.right, travel, j0, per, end, cover: height - 2 * vh, W: stage.width, H: stage.height };
      layers.forEach((_, k) => place(k, anchor(k, 0).p));
    };
    const setCaption = (k: number) => {
      if (k === shown) return;
      shown = k;
      const s = journey[k];
      if (s) {
        if (jnum) jnum.textContent = String(k + 1).padStart(2, "0");
        if (jname) jname.textContent = s.label;
        if (jline) jline.textContent = s.line;
        jcap?.classList.remove("swap");
        void jcap?.offsetWidth;
        jcap?.classList.add("swap");
        if (!seen.has(k)) { seen.add(k); track("journey_stage", { stage: s.id }); }
      }
      if (hero) hero.dataset.wa = s?.wa ?? "";
    };
    const heroUpdate = () => {
      if (!hero || !media || !mw1 || !mw2 || !rest || !copy || !heroInner || !dim || !shade || !layers.length) return;
      if (!geo) heroGeometry();
      if (!geo) return;
      const scrolled = -hero.getBoundingClientRect().top;
      if (scrolled > geo.cover + vh * 1.2) return;
      // the opening: the first photo's window opens to full screen
      const z = clamp(scrolled / geo.travel, 0, 1);
      const e0 = easeInOut(range(z, 0, 0.7)), k0 = 1 - e0;
      media.style.clipPath = k0 > 0 ? `inset(${(geo.t * k0).toFixed(1)}px ${(geo.rr * k0).toFixed(1)}px ${(geo.b * k0).toFixed(1)}px ${(geo.l * k0).toFixed(1)}px round ${(4 * k0).toFixed(2)}px)` : "none";
      media.style.willChange = k0 > 0 ? "clip-path" : "auto";
      const w = easeIn(range(z, 0, 0.55)), wo = String(1 - range(z, 0.25, 0.55));
      mw1.style.transform = `translate3d(0,${-w * 110}%,0)`;
      mw2.style.transform = `translate3d(0,${w * 110}%,0)`;
      if (desktop()) { mw1.style.transform = `translate3d(${w * 120}%,0,0)`; mw2.style.transform = `translate3d(${-w * 120}%,0,0)`; }
      mw1.style.opacity = mw2.style.opacity = wo;
      rest.style.opacity = String(1 - range(z, 0.08, 0.3));
      if (z >= 1 && !heroOpened) { heroOpened = true; track("hero_opened"); }

      // the journey: stage i zooms into its window, which becomes stage i + 1
      const p = clamp((scrolled - geo.j0) / geo.per, 0, N - 1);
      const i = Math.min(Math.floor(p), N - 2), t = p - i;
      const cur = layers[i], phone = phoneQ.matches;
      const hold = phone && cur.pan ? 0.35 : 0.15;
      const panT = easeInOut(range(t, 0, hold * 0.9));
      const e = easeInOut(range(t, hold, 0.94));
      const a = anchor(i, panT);
      if (cur.pan) place(i, a.p);
      const windowIn = range(scrolled, geo.j0 - 0.35 * geo.travel, geo.j0);
      let m = about(Math.pow(cur.S, e), a.P);
      layers.forEach((l, j) => {
        const d = j - i;
        if (d < 0 || d > 2) { if (l.el.dataset.v) { l.el.style.visibility = "hidden"; delete l.el.dataset.v; } return; }
        if (d === 1) m = comp(m, about(1 / cur.S, a.P));
        if (d === 2) m = comp(m, about(1 / layers[i + 1].S, anchor(i + 1, 0).P));
        l.el.dataset.v = "1";
        l.el.style.visibility = "visible";
        l.el.style.transform = `translate3d(${m.x.toFixed(2)}px,${m.y.toFixed(2)}px,0) scale(${m.k.toFixed(5)})`;
        l.el.style.opacity = d === 0 ? "1" : String(windowIn);
        l.el.style.setProperty("--dk", d === 0 ? (0.35 * range(e, 0.4, 0.88)).toFixed(3) : "0");
        l.el.style.setProperty("--f", d === 1 ? (1 - range(e, 0.6, 0.95)).toFixed(3) : d === 2 ? "1" : "0");
        if (l.img && j > 0) l.img.style.transform = d === 0 ? "none" : `scale(${(d === 1 ? lerp(1.15, 1, e) : 1.15).toFixed(4)})`;
      });
      if (layers[0].img) layers[0].img.style.transform = i === 0 && p === 0 ? `scale(${lerp(1.18, 1, e0).toFixed(4)})` : "none";

      // caption, progress, WhatsApp context and the floating button
      const label = Math.min(i + (e > 0.55 ? 1 : 0), N - 1);
      setCaption(label);
      const capOn = range(scrolled, geo.j0 - 0.2 * geo.travel, geo.j0) * (1 - range(p, N - 1.6, N - 1.3));
      if (jcap) { jcap.style.opacity = capOn.toFixed(3); jcap.style.visibility = capOn > 0.01 ? "visible" : "hidden"; }
      if (jskip) { jskip.style.opacity = capOn.toFixed(3); jskip.style.visibility = capOn > 0.01 ? "visible" : "hidden"; }
      segs.forEach((b, k) => (b.style.transform = `scaleX(${clamp(p - k, 0, 1).toFixed(4)})`));
      journeyStage = scrolled < geo.cover ? label : -1;

      // the end: the lotus video plays as its window opens, then the copy
      const toVideo = p - (N - 2);
      if (video && !userPaused) {
        if (toVideo > 0.6 && scrolled < geo.cover + vh && video.paused && video.querySelector("source")) void video.play().catch(() => {});
        if ((toVideo < 0.4 || scrolled > geo.cover + vh) && !video.paused) video.pause();
      }
      if (pause) { const on = toVideo > 0.9; pause.style.opacity = on ? "1" : "0"; pause.style.visibility = on ? "visible" : "hidden"; }
      const c = easeOut(range(scrolled, geo.end - 0.15 * geo.per, geo.end + 0.35 * geo.per));
      copy.style.opacity = String(c);
      copy.style.visibility = c > 0.01 ? "visible" : "hidden";
      copy.style.transform = `translate3d(0,${((1 - c) * 28).toFixed(1)}px,0)`;
      shade.style.opacity = String(c);
      const cover = clamp((scrolled - geo.cover) / vh, 0, 1);
      heroInner.style.transform = `scale(${lerp(1, 0.94, cover).toFixed(4)})`;
      dim.style.opacity = (cover * 0.6).toFixed(3);
    };
    // The later stages and the video load after the page itself, so the first photo is painted first;
    // each stage is decoded before it can be reached, so a window never opens empty
    const upgrade = (el: HTMLElement) => {
      el.querySelectorAll<HTMLElement>("[data-srcset]").forEach((n) => {
        n.setAttribute("sizes", n.dataset.sizes || "100vw");
        n.setAttribute("srcset", n.dataset.srcset!);
        n.removeAttribute("data-srcset");
      });
      const im = el.querySelector("img");
      if (im) void im.decode?.().catch(() => {});
    };
    // the first photo moves to its sharper phone file once the visitor starts scrolling into the journey
    const first = layers[0]?.el;
    if (first) {
      const once = () => { window.removeEventListener("scroll", once); upgrade(first); };
      window.addEventListener("scroll", once, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", once));
    }
    const loadLater = () => {
      if (!alive) return;
      layers.slice(1).forEach(({ el }) => upgrade(el));
      if (video && !video.querySelector("source") && video.dataset.webm) {
        // on desktop the portrait clip is a tall panel beside the copy, so it gets the sharper file
        const wide = desktop() && video.dataset.webmWide;
        const files = wide ? [video.dataset.webmWide!, video.dataset.mp4Wide!] : [video.dataset.webm!, video.dataset.mp4!];
        for (const [src, type] of [[files[0], "video/webm"], [files[1], "video/mp4"]]) {
          const s = document.createElement("source");
          s.src = src;
          s.type = type;
          video.appendChild(s);
        }
        video.preload = "auto";
        video.load();
        if (!scenes) void video.play().catch(() => {});
      }
    };
    if (video && !scenes && video.dataset.poster) video.poster = video.dataset.poster;
    if (document.readyState === "complete") setTimeout(loadLater, 200);
    else window.addEventListener("load", () => setTimeout(loadLater, 200), { once: true });
    if (pause && video) {
      const toggle = () => {
        const paused = !video.paused;
        userPaused = paused;
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
      // the button is there from the second stage of the journey on
      const started = journeyStage >= 1 || (manifesto ? manifesto.getBoundingClientRect().top < vh * 0.5 : y > vh * 0.6);
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
      heroUpdate(); saysUpdate(); wipeUpdate(); marqueeUpdate(); stepsUpdate(); photosUpdate();
    };
    const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
    let lastDesk = desktop();
    let lastW = vw;
    const measure = (ev?: Event) => {
      // a phone's toolbar collapsing changes only the height a little: keep the geometry, or the zoom would jump
      const toolbar = ev?.type === "resize" && window.innerWidth === lastW && Math.abs(window.innerHeight - vh) < 150 && matchMedia("(pointer: coarse)").matches;
      lastW = window.innerWidth;
      if (toolbar) { request(); return; }
      vh = window.innerHeight; vw = window.innerWidth; svh = probe.offsetHeight || vh;
      if (scenes) heroGeometry();
      if (desktop() !== lastDesk) { lastDesk = desktop(); window.dispatchEvent(new Event("rever:breakpoint")); }
      request();
    };
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    window.addEventListener("rever:layout", measure);
    document.fonts?.ready.then(() => measure());
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
