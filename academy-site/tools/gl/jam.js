// "נגנו עכשיו": the same booth, close up and playable. Tapping a 3D pad plays it (through club-audio.js, which
// also lights the HTML pad under it); dragging a jog scratches. Renders only while the section is on screen.
import { ACESFilmicToneMapping, MathUtils, PerspectiveCamera, Raycaster, Scene, SRGBColorSpace, Vector2, Vector3, WebGLRenderer } from "three";
import { createBooth, addLights, JOG } from "./booth.js";

export function createJam(host) {
  const canvas = document.createElement("canvas");
  host.appendChild(canvas);
  let renderer;
  try { renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" }); }
  catch (e) { canvas.remove(); return null; }
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.setClearColor(0x000000, 0);
  host.classList.add("is-3d");

  const scene = new Scene();
  const booth = createBooth();
  scene.add(booth.group);
  const lights = addLights(scene, renderer);
  const camera = new PerspectiveCamera(30, 1, 0.01, 10);
  const C = new Vector3(0, 0.03, 0.02);

  let W = 1, H = 1, maxDpr = Math.min(window.devicePixelRatio || 1, 2);
  function size() {
    const r = host.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    renderer.setPixelRatio(maxDpr);
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    // fit the booth's width (and depth) into the view, from above and in front
    const tanH = Math.tan(MathUtils.degToRad(camera.fov / 2));
    const d = Math.max(0.62 / (2 * tanH * camera.aspect), 0.46 / (2 * tanH));
    camera.position.set(0, 0.86, 0.5).normalize().multiplyScalar(d).add(C);
    camera.lookAt(C);
    camera.updateProjectionMatrix();
  }
  size();
  new ResizeObserver(size).observe(host);

  // pads: club-audio plays them and tells us, so the 3D pad lights whichever way it was hit
  document.addEventListener("clubpad", (e) => { booth.flash(e.detail); booth.flash(e.detail + 8); });

  const ray = new Raycaster(), ndc = new Vector2();
  const discs = booth.decks.map((d) => d.platter.children[0]);
  let drag = null, spin = 0, lastScratch = 0;
  function pick(e) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
  }
  function angle(e, k) {
    const c = new Vector3((k ? -1 : 1) * JOG.x, JOG.y, JOG.z).project(camera), r = canvas.getBoundingClientRect();
    return Math.atan2(e.clientY - r.top - (1 - c.y) / 2 * r.height, e.clientX - r.left - (c.x + 1) / 2 * r.width);
  }
  canvas.addEventListener("pointerdown", (e) => {
    pick(e);
    const hitPad = ray.intersectObject(booth.pads)[0];
    if (hitPad) { document.dispatchEvent(new CustomEvent("clubpad3d", { detail: hitPad.instanceId % 8 })); return; }
    const k = discs.findIndex((d) => ray.intersectObject(d).length);
    if (k >= 0) { drag = { k, a: angle(e, k), t: performance.now() }; canvas.setPointerCapture(e.pointerId); e.preventDefault(); }
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const a = angle(e, drag.k), now = performance.now();
    let da = a - drag.a;
    if (da > Math.PI) da -= Math.PI * 2; if (da < -Math.PI) da += Math.PI * 2;
    spin -= da;
    const speed = Math.abs(da) / Math.max(1, now - drag.t) * 1000;
    if (speed > 6 && now - lastScratch > 160 && window.ClubAudio) { lastScratch = now; window.ClubAudio.pad(5); }
    drag.a = a; drag.t = now;
  });
  const end = () => { drag = null; };
  canvas.addEventListener("pointerup", end);
  canvas.addEventListener("pointercancel", end);

  let visible = false, raf = 0;
  function frame(now) {
    raf = 0;
    if (!visible || document.hidden) return;
    const t = now / 1000, beat = window.ClubAudio ? window.ClubAudio.pulse() : 0;
    booth.group.rotation.y = Math.sin(t * 0.3) * 0.06;
    booth.update(t, beat, window.ClubAudio ? window.ClubAudio.level() : 0, spin);
    lights(beat);
    renderer.render(scene, camera);
    watch(now);
    raf = requestAnimationFrame(frame);
  }

  // a slow device gets fewer pixels
  const times = [];
  let settled = false;
  function watch(now) {
    if (settled || maxDpr <= 0.75) return;
    times.push(now);
    if (times.length < 60) return;
    const d = times.slice(1).map((v, i) => v - times[i]).sort((a, b) => a - b);
    times.length = 0;
    if (d[d.length >> 1] > 28) { maxDpr = maxDpr > 1 ? 1 : 0.75; size(); }
    else settled = true;
  }
  const wake = () => { if (!raf && visible) raf = requestAnimationFrame(frame); };
  new IntersectionObserver((en) => { visible = en[0].isIntersecting; wake(); }).observe(host);
  document.addEventListener("visibilitychange", wake);
  return { renderer };
}
