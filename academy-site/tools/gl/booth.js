// The 3D booth: a generic two-deck DJ controller built from primitives (no brand, no model files).
// createBooth()      the model, with update(time, beat, level) for the lights, pads, meters and platters
// createBoothHero()  the hero: the booth turning under the heading; on scroll the camera dives into the left jog,
//                    whose platter lands exactly on journey.js's record window and becomes it
import {
  AmbientLight, CanvasTexture, CircleGeometry, Color, CustomBlending, CylinderGeometry, DirectionalLight,
  DynamicDrawUsage, Group, HalfFloatType, InstancedMesh, MathUtils, Matrix4, Mesh, MeshBasicMaterial, MeshStandardMaterial,
  NoColorSpace, OneFactor, PerspectiveCamera, PMREMGenerator, PointLight, Quaternion, Scene,
  SRGBColorSpace, SpriteMaterial, Sprite, SrcAlphaFactor, TorusGeometry, UnsignedByteType, Vector3, WebGLRenderTarget, ZeroFactor,
  BoxGeometry, AddEquation,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const ACC = new Color("#8b6cff"), ACC2 = new Color("#ff4fd8"), HOT = new Color("#ffc857");
const PAD_COLORS = ["#ff4fd8", "#8b6cff", "#ffc857", "#4fd1ff"].map((c) => new Color(c));
const TOP = 0.045;                 // height of the deck surface
export const JOG = { x: -0.175, z: -0.015, r: 0.086, y: TOP + 0.018 };

function canvasTex(size, draw) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  draw(c.getContext("2d"), size);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function platterTexture() {
  return canvasTex(512, (g, s) => {
    const c = s / 2;
    g.fillStyle = "#0e0c16"; g.fillRect(0, 0, s, s);
    for (let r = 70; r < c; r += 2.2) {
      g.strokeStyle = `rgba(${40 + (r % 7) * 4},${36 + (r % 5) * 4},${62 + (r % 9) * 5},0.9)`;
      g.lineWidth = 1; g.beginPath(); g.arc(c, c, r, 0, Math.PI * 2); g.stroke();
    }
    // two soft highlights, like light catching the grooves
    for (const [a, col] of [[0.9, "rgba(139,108,255,0.28)"], [4.0, "rgba(255,79,216,0.2)"]]) {
      const grd = g.createConicGradient(a, c, c);
      grd.addColorStop(0, "rgba(0,0,0,0)"); grd.addColorStop(0.04, col); grd.addColorStop(0.08, "rgba(0,0,0,0)"); grd.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = grd; g.beginPath(); g.arc(c, c, c, 0, Math.PI * 2); g.arc(c, c, 70, 0, Math.PI * 2, true); g.fill();
    }
    g.strokeStyle = "rgba(255,255,255,0.12)"; g.lineWidth = 3; g.beginPath(); g.arc(c, c, c - 3, 0, Math.PI * 2); g.stroke();
  });
}

function displayTexture() {
  return canvasTex(256, (g, s) => {
    const c = s / 2;
    g.fillStyle = "#07060c"; g.beginPath(); g.arc(c, c, c, 0, Math.PI * 2); g.fill();
    const grd = g.createLinearGradient(0, 0, s, s);
    grd.addColorStop(0, "#8b6cff"); grd.addColorStop(1, "#ff4fd8");
    g.strokeStyle = grd; g.lineWidth = 16; g.beginPath(); g.arc(c, c, c - 22, 0, Math.PI * 2); g.stroke();
    g.fillStyle = "#ffffff"; g.fillRect(c - 3, 8, 6, 34);           // the position marker
    g.fillStyle = "#efedf8"; g.font = "700 46px 'IBM Plex Mono', monospace"; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText("124", c, c - 6);
    g.fillStyle = "#a8a3bf"; g.font = "500 20px 'IBM Plex Mono', monospace"; g.fillText("BPM", c, c + 30);
  });
}

function glowTexture() {
  return canvasTex(128, (g, s) => {
    const grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    grd.addColorStop(0, "rgba(255,255,255,1)"); grd.addColorStop(0.25, "rgba(255,255,255,0.45)"); grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd; g.fillRect(0, 0, s, s);
  });
}

// additive light that leaves the alpha alone, so the hero composite can add it over the page
function glowMaterial(color, tex, opacity) {
  return new SpriteMaterial({
    map: tex, color, transparent: true, opacity, depthWrite: false,
    blending: CustomBlending, blendEquation: AddEquation, blendSrc: SrcAlphaFactor, blendDst: OneFactor,
    blendSrcAlpha: ZeroFactor, blendDstAlpha: OneFactor,
  });
}

export function createBooth() {
  const group = new Group();
  const metal = new MeshStandardMaterial({ color: "#0e0c15", roughness: 0.36, metalness: 0.45 });
  const plate = new MeshStandardMaterial({ color: "#13101c", roughness: 0.72, metalness: 0.2 });
  const black = new MeshStandardMaterial({ color: "#09080d", roughness: 0.5, metalness: 0.2 });
  const cap = new MeshStandardMaterial({ color: "#c9c4d8", roughness: 0.3, metalness: 0.8 });
  const glowTex = glowTexture();

  const body = new Mesh(new RoundedBoxGeometry(0.64, TOP, 0.36, 4, 0.012), metal);
  body.position.y = TOP / 2;
  group.add(body);
  const top = new Mesh(new BoxGeometry(0.616, 0.002, 0.336), plate);
  top.position.y = TOP + 0.001;
  group.add(top);
  // a light strip along the front edge
  const strip = new Mesh(new BoxGeometry(0.6, 0.003, 0.003), new MeshBasicMaterial({ color: ACC }));
  strip.position.set(0, TOP * 0.55, 0.181);
  group.add(strip);

  const platterMat = new MeshStandardMaterial({ map: platterTexture(), roughness: 0.35, metalness: 0.4 });
  const sideMat = new MeshStandardMaterial({ color: "#2a2540", roughness: 0.35, metalness: 0.6 });
  const displayMat = new MeshBasicMaterial({ map: displayTexture() });
  const decks = [-1, 1].map((side) => {
    const x = side * Math.abs(JOG.x), deck = new Group();
    deck.position.set(x, TOP, JOG.z);
    group.add(deck);
    const base = new Mesh(new CylinderGeometry(0.1, 0.102, 0.006, 64), black);
    base.position.y = 0.003;
    deck.add(base);
    const ringMat = new MeshBasicMaterial({ color: ACC.clone() });
    const ring = new Mesh(new TorusGeometry(0.093, 0.0022, 8, 96), ringMat);
    ring.rotation.x = Math.PI / 2; ring.position.y = 0.007;
    deck.add(ring);
    const platter = new Group();
    platter.position.y = 0.006;
    deck.add(platter);
    const disc = new Mesh(new CylinderGeometry(JOG.r, JOG.r, 0.012, 96), [sideMat, platterMat, sideMat]);
    disc.position.y = 0.006;
    platter.add(disc);
    const screen = new Mesh(new CircleGeometry(0.031, 48), displayMat);
    screen.rotation.x = -Math.PI / 2; screen.position.y = 0.0125;
    platter.add(screen);
    const glow = new Sprite(glowMaterial(ACC, glowTex, 0.35));
    glow.scale.set(0.34, 0.34, 1); glow.position.y = 0.004;
    deck.add(glow);

    // CUE and PLAY, on the outer side
    const buttons = [["#ffb340", 0.098], ["#3dff8a", 0.134]].map(([col, z]) => {
      const b = new Mesh(new CylinderGeometry(0.0115, 0.0115, 0.005, 32), black);
      b.position.set(x - side * 0.108, TOP + 0.0025, z);
      group.add(b);
      const r = new Mesh(new TorusGeometry(0.0118, 0.0018, 6, 40), new MeshBasicMaterial({ color: new Color(col) }));
      r.rotation.x = Math.PI / 2; r.position.set(b.position.x, TOP + 0.0052, z);
      group.add(r);
      return r;
    });
    return { deck, platter, ringMat, glow, buttons, side };
  });

  // 16 performance pads (2 x 4 per deck)
  const padGeo = new RoundedBoxGeometry(0.027, 0.006, 0.027, 2, 0.003);
  const pads = new InstancedMesh(padGeo, new MeshBasicMaterial({ color: "#ffffff" }), 16);
  pads.instanceMatrix.setUsage(DynamicDrawUsage);
  const m = new Matrix4(), col = new Color();
  const padPos = [];
  for (let d = 0; d < 2; d++) for (let row = 0; row < 2; row++) for (let c = 0; c < 4; c++) {
    const x = (d ? 1 : -1) * Math.abs(JOG.x) + (c - 1.5) * 0.034, z = 0.116 + row * 0.034;
    padPos.push([x, z]);
    m.makeTranslation(x, TOP + 0.003, z);
    pads.setMatrixAt(padPos.length - 1, m);
    pads.setColorAt(padPos.length - 1, col.set("#222"));
  }
  group.add(pads);

  // mixer: knobs, channel faders, crossfader, level meters
  const knobGeo = new CylinderGeometry(0.0085, 0.0095, 0.012, 24);
  const knobs = new InstancedMesh(knobGeo, black, 10);
  let kn = 0;
  for (const x of [-0.035, 0.035]) for (const z of [-0.135, -0.105, -0.075, -0.045, -0.015]) {
    m.makeTranslation(x, TOP + 0.006, z); knobs.setMatrixAt(kn++, m);
  }
  group.add(knobs);
  const ticks = new InstancedMesh(new BoxGeometry(0.0016, 0.0013, 0.007), new MeshBasicMaterial({ color: "#efedf8" }), 10);
  kn = 0;
  for (const x of [-0.035, 0.035]) for (const z of [-0.135, -0.105, -0.075, -0.045, -0.015]) {
    m.makeTranslation(x, TOP + 0.0127, z - 0.004); ticks.setMatrixAt(kn++, m);
  }
  group.add(ticks);
  const faders = [-0.035, 0.035].map((x) => {
    const slot = new Mesh(new BoxGeometry(0.004, 0.001, 0.07), black);
    slot.position.set(x, TOP + 0.0025, 0.085);
    group.add(slot);
    const c = new Mesh(new BoxGeometry(0.016, 0.009, 0.009), cap);
    c.position.set(x, TOP + 0.007, 0.085);
    group.add(c);
    return c;
  });
  const xslot = new Mesh(new BoxGeometry(0.07, 0.001, 0.004), black);
  xslot.position.set(0, TOP + 0.0025, 0.155);
  group.add(xslot);
  const xfader = new Mesh(new BoxGeometry(0.009, 0.009, 0.016), cap);
  xfader.position.set(0, TOP + 0.007, 0.155);
  group.add(xfader);
  const meters = new InstancedMesh(new BoxGeometry(0.006, 0.002, 0.0045), new MeshBasicMaterial({ color: "#ffffff" }), 24);
  meters.instanceMatrix.setUsage(DynamicDrawUsage);
  for (let k = 0; k < 24; k++) {
    m.makeTranslation(k < 12 ? -0.009 : 0.009, TOP + 0.002, 0.11 - (k % 12) * 0.0085);
    meters.setMatrixAt(k, m);
    meters.setColorAt(k, col.set("#111"));
  }
  group.add(meters);

  const meterCols = [];
  for (let k = 0; k < 12; k++) meterCols.push(new Color(k < 7 ? "#3dff8a" : k < 10 ? "#ffc857" : "#ff4f6a"));
  const dark = new Color("#14121c");
  const padLevel = new Float32Array(16);

  let lastBeatStep = -1;
  function update(time, beat, level, spin) {
    const b = Math.min(1, beat);
    decks.forEach((d, k) => {
      d.platter.rotation.y = -(time * 1.4 + spin) * (k ? 1.1 : 1);
      d.ringMat.color.copy(ACC).lerp(ACC2, b * 0.6).multiplyScalar(0.55 + 0.9 * b);
      d.glow.material.opacity = 0.18 + 0.45 * b;
      d.buttons[1].material.color.set("#3dff8a").multiplyScalar(0.6 + 0.6 * b);
    });
    // a pad pattern that moves on with every beat
    const step = Math.floor(time * 124 / 60);
    if (step !== lastBeatStep && b > 0.5) {
      lastBeatStep = step;
      for (let k = 0; k < 4; k++) padLevel[(step * 5 + k * 7) % 16] = 1;
    }
    for (let k = 0; k < 16; k++) {
      padLevel[k] *= 0.9;
      col.copy(PAD_COLORS[(k + (k >> 2)) % 4]).multiplyScalar(0.18 + 0.95 * padLevel[k]);
      pads.setColorAt(k, col);
    }
    pads.instanceColor.needsUpdate = true;
    const lv = Math.max(level, b * 0.55);
    for (let k = 0; k < 24; k++) {
      const n = k % 12, on = n < Math.round((k < 12 ? lv : lv * 0.92) * 12);
      meters.setColorAt(k, on ? meterCols[n] : dark);
    }
    meters.instanceColor.needsUpdate = true;
    faders[0].position.z = 0.085 + Math.sin(time * 0.5) * 0.02;
    faders[1].position.z = 0.085 + Math.cos(time * 0.43) * 0.02;
    xfader.position.x = Math.sin(time * 0.31) * 0.026;
  }

  return { group, update, padPos, decks, pads, flash: (k) => { padLevel[k] = 1.4; } };
}

// The booth's lights: a soft purple fill, a white key from the front left, purple and magenta rims behind,
// and reflections from a neutral room
export function addLights(scene, renderer) {
  scene.add(new AmbientLight("#6b5aa8", 0.22));
  const key = new DirectionalLight("#ffffff", 1.1);
  key.position.set(-0.4, 1, 0.5);
  scene.add(key);
  const rimL = new PointLight(ACC, 2.5, 2, 1.5); rimL.position.set(-0.45, 0.25, -0.35); scene.add(rimL);
  const rimR = new PointLight(ACC2, 2, 2, 1.5); rimR.position.set(0.45, 0.25, -0.35); scene.add(rimR);
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.4;
  pmrem.dispose();
  return (beat) => { rimL.intensity = 2 + 3 * beat; rimR.intensity = 1.6 + 2.5 * beat; };
}

export function createBoothHero(renderer, journey) {
  const J = window.AcademyJourney;
  const scene = new Scene();
  const booth = createBooth();
  scene.add(booth.group);
  const lights = addLights(scene, renderer);

  const camera = new PerspectiveCamera(30, 1, 0.01, 10);
  const tmp = new PerspectiveCamera(30, 1, 0.01, 10);
  let rt = null, W = 1, H = 1;
  const floatOk = renderer.extensions.has("EXT_color_buffer_float") || renderer.extensions.has("EXT_color_buffer_half_float");

  function resize(w, h, dpr) {
    W = w; H = h;
    if (rt) rt.dispose();
    rt = new WebGLRenderTarget(Math.round(W * dpr), Math.round(H * dpr), { samples: dpr < 2 ? 4 : 2, type: floatOk ? HalfFloatType : UnsignedByteType });
    rt.texture.colorSpace = NoColorSpace;
    camera.aspect = tmp.aspect = W / H;
  }

  // the camera for hero progress hp: from looking at the whole booth under the heading (0) to straight above
  // the left jog, its platter filling the record window (1)
  const C = new Vector3(0, 0.03, 0.01), up0 = new Vector3(0, 1, 0), up1 = new Vector3(0, 0, -1);
  const q0 = new Quaternion(), q1 = new Quaternion(), P0 = new Vector3(), P1 = new Vector3();
  const jogTop = new Vector3(JOG.x, JOG.y, JOG.z);
  function pose(hp, cam) {
    const e = MathUtils.smootherstep(hp, 0, 1);
    const tanH = Math.tan(MathUtils.degToRad(cam.fov / 2)), aspect = W / H, phone = W < 700;
    // hero: the booth fills the width of a phone, about 60% of a wide screen, low on the screen
    const targetW = phone ? W * 1.12 : Math.min(W * 0.6, 900);
    const d = 0.64 * W / (targetW * 2 * tanH * aspect);
    P0.set(0, 0.78, 0.62).normalize().multiplyScalar(d).add(C);
    cam.position.copy(P0); cam.up.copy(up0); cam.lookAt(C); q0.copy(cam.quaternion);
    // dive: straight above the jog, at the height where its platter matches the window
    const win = J.win, pr = win.r * 1.04;
    const h1 = JOG.r * (H / 2) / (pr * tanH);
    P1.set(JOG.x, JOG.y + h1, JOG.z);
    cam.position.copy(P1); cam.up.copy(up1); cam.lookAt(jogTop); q1.copy(cam.quaternion);
    cam.position.lerpVectors(P0, P1, e);
    cam.quaternion.slerpQuaternions(q0, q1, e);
    // where on screen the subject sits: the booth low and centred, then the jog on the window
    const ox = (win.x - W / 2) * e, oy = (phone ? 0.8 : 0.82) * H * (1 - e) + win.y * e - H / 2;
    cam.setViewOffset(W, H, -ox, -oy, W, H);
    cam.updateMatrixWorld();
    return e;
  }

  const v = new Vector3(), v2 = new Vector3();
  function project(cam, p) { v.copy(p).project(cam); return [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H]; }
  function origin(hp) {
    pose(hp, tmp);
    const c = project(tmp, jogTop), e = project(tmp, v2.set(JOG.x + JOG.r, JOG.y, JOG.z));
    return { x: c[0], y: c[1], r: Math.hypot(e[0] - c[0], e[1] - c[1]) };
  }

  // drag sideways to turn the booth
  let yawDrag = 0, yawTarget = 0, startX = null;
  const zone = journey.querySelector(".scene-zero");
  zone.addEventListener("pointerdown", (e) => { startX = e.clientX - yawTarget * 300; });
  window.addEventListener("pointerup", () => { startX = null; });
  zone.addEventListener("pointermove", (e) => {
    if (startX === null || e.pointerType === "mouse" && !e.buttons) return;
    yawTarget = MathUtils.clamp((e.clientX - startX) / 300, -0.8, 0.8);
  });

  let spin = 0, lastHp = 0;
  function render(st, fx) {
    const e = pose(st.hp, camera);
    yawDrag += (yawTarget - yawDrag) * 0.08;
    booth.group.rotation.y = (Math.sin(fx.time * 0.35) * 0.2 + yawDrag) * (1 - e);
    spin += (st.hp - lastHp) * 6; lastHp = st.hp;
    const level = window.ClubAudio ? window.ClubAudio.level() : 0;
    booth.update(fx.time, fx.beat, level, spin);
    lights(fx.beat);
    renderer.setRenderTarget(rt);
    renderer.setClearColor(0x000000, 0);
    renderer.clear();
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    return {
      texture: rt.texture,
      alpha: 1 - MathUtils.smoothstep(st.hp, 0.9, 1),
      winAlpha: MathUtils.smoothstep(st.hp, 0.7, 1),
    };
  }

  function dispose() {
    if (rt) rt.dispose();
    scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
  }

  return { render, resize, origin, dispose };
}
