// Club mode, WebGL part (built into ../../club-gl.js by tools/build-gl.sh).
// Takes over the drawing of the opening journey from journey.js's CSS layers when WebGL 2 works, the
// photos have loaded and the device keeps up; otherwise the CSS version simply stays.
import { LinearFilter, LinearMipmapLinearFilter, NoColorSpace, TextureLoader, Vector2, WebGLRenderer } from "three";
import { createStage } from "./stage.js";
import { createBoothHero } from "./booth.js";
import { createJam } from "./jam.js";

const J = window.AcademyJourney;
const journey = document.getElementById("journey");
const stage = journey && journey.querySelector(".journey-stage");

function webgl2() {
  try { return !!document.createElement("canvas").getContext("webgl2"); } catch (e) { return false; }
}

const gl2 = webgl2();
if (gl2 && J && J.state && stage && J.layout.every((L) => L.src)) start();
const jamView = document.querySelector(".jam-view");
if (gl2 && jamView && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  try { createJam(jamView); } catch (e) { /* the HTML pads still play */ }
}

function start() {
  const canvas = document.createElement("canvas");
  canvas.className = "jr-gl";
  canvas.setAttribute("aria-hidden", "true");
  stage.insertBefore(canvas, stage.querySelector(".journey-fx"));

  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
  } catch (e) { canvas.remove(); return; }
  renderer.autoClear = false;

  let W = 0, H = 0, dpr = 1, maxDpr = Math.min(window.devicePixelRatio || 1, 2);
  function size() {
    const r = stage.getBoundingClientRect();
    W = r.width; H = r.height;
    dpr = Math.min(maxDpr, W < 700 ? 1.5 : 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(W, H, false);
    if (booth) booth.resize(W, H, dpr);
  }

  // the station photos, as journey.js measured them
  const loader = new TextureLoader();
  const textures = [];
  const ready = Promise.all(J.layout.map((L, k) => new Promise((res, rej) => {
    const t = textures[k] = loader.load(L.src, res, undefined, rej);
    t.colorSpace = NoColorSpace;
    t.minFilter = LinearMipmapLinearFilter; t.magFilter = LinearFilter;
  })));

  const st = createStage(textures);
  let booth = null;
  try { booth = createBoothHero(renderer, journey); } catch (e) { booth = null; }
  if (booth) J.origin = booth.origin;
  size();

  // pointer and tilt give the photo a little parallax
  const pointer = new Vector2(), target = new Vector2();
  window.addEventListener("pointermove", (e) => { target.set((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1); }, { passive: true });
  let tilt0 = null;
  window.addEventListener("deviceorientation", (e) => {
    if (e.gamma == null) return;
    if (!tilt0) tilt0 = { b: e.beta };
    target.set(Math.max(-1, Math.min(1, e.gamma / 25)), Math.max(-1, Math.min(1, (e.beta - tilt0.b) / 25)));
  }, { passive: true });

  let visible = true, raf = 0, on = false, lastT = J.state.tRaw, lastAt = performance.now(), vel = 0;
  const times = []; let checked = false;

  function frame(now) {
    raf = 0;
    if (!visible || document.hidden) return;
    const s = J.state;
    // scroll speed in stations per second, easing back to 0
    const dt = Math.max(1, now - lastAt) / 1000;
    vel = vel * 0.8 + 0.2 * ((s.tRaw - lastT) / dt);
    lastT = s.tRaw; lastAt = now;
    pointer.lerp(target, 0.06);
    const beat = window.ClubAudio ? window.ClubAudio.pulse() : 0;
    const fx = { time: now / 1000, beat, vel, pointer, winAlpha: 1, booth: null, boothAlpha: 0 };
    renderer.clear();
    if (booth && s.hp < 1) {
      const b = booth.render(s, fx, W, H);
      fx.booth = b.texture; fx.boothAlpha = b.alpha; fx.winAlpha = b.winAlpha;
    }
    st.update(s, fx, W, H, dpr);
    renderer.render(st.scene, st.camera);
    watch(now);
    raf = requestAnimationFrame(frame);
  }

  // If the device can't keep up, render at a lower resolution, and if that doesn't help, hand back to CSS
  function watch(now) {
    if (checked) return;
    times.push(now);
    if (times.length < 90) return;
    const d = [];
    for (let k = 1; k < times.length; k++) d.push(times[k] - times[k - 1]);
    d.sort((a, b) => a - b);
    const med = d[d.length >> 1];
    times.length = 0;
    if (med > 26 && maxDpr > 1) { maxDpr = 1; size(); }
    else if (med > 34) { stop(); }
    else checked = true;
  }

  function stop() {
    journey.classList.remove("gl-on");
    if (booth) { J.origin = null; booth.dispose(); }
    cancelAnimationFrame(raf); raf = 0; visible = false;
    renderer.dispose(); canvas.remove();
    J.render();
  }

  function wake() { if (!raf && visible && on) raf = requestAnimationFrame(frame); }

  ready.then(() => {
    on = true;
    journey.classList.add("gl-on");
    J.render();
    wake();
  }).catch(() => { stop(); });

  new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; wake(); }).observe(journey);
  document.addEventListener("visibilitychange", wake);
  new ResizeObserver(() => { size(); }).observe(stage);
}
