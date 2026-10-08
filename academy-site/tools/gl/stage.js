// The stations in WebGL: one full-stage shader draws the stage glow, the turning record, the window with the
// two stations (sweep, dolly, chromatic split on fast scrolls, a push on every beat), its glowing rim, light
// leaks and film grain. It replaces journey.js's CSS layers (.jr-rec, .jr-layers, .jr-ring, .jr-arm) and reads
// the same numbers from window.AcademyJourney.state, so both look and move the same.
import { Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, Vector2, Vector4 } from "three";

const vertex = /* glsl */ `
void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const fragment = /* glsl */ `
precision highp float;
uniform vec2 uRes; uniform float uDpr; uniform vec2 uSize;
uniform float uTime, uBeat, uVel; uniform vec2 uPointer;
uniform sampler2D uTexA, uTexB; uniform vec4 uImgA, uImgB, uXfA, uXfB; uniform vec2 uTA, uTB; uniform float uHasB;
uniform vec4 uWin; uniform float uSweep, uWinAlpha, uOpen;
uniform vec4 uRec; uniform float uRecRot, uRingOp;
uniform sampler2D uBooth; uniform float uBoothAlpha;

const vec3 BG = vec3(0.043, 0.039, 0.071);
const vec3 SURF2 = vec3(0.110, 0.098, 0.188);
const vec3 ACC = vec3(0.545, 0.424, 1.0);
const vec3 ACC2 = vec3(1.0, 0.310, 0.847);
const float TAU = 6.2831853;
const float PI = 3.14159265;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float angDist(float a, float b) { return abs(mod(a - b + PI, TAU) - PI); }

// screen point -> the station's own pixels (the inverse of journey.js's translate + scale about the focus)
vec3 layer(sampler2D tex, vec4 img, vec4 xf, vec2 t, vec2 s) {
  vec2 local = xf.xy + (s - t - xf.xy) / xf.z;
  vec2 uv = clamp((local - img.xy) / img.zw, 0.0005, 0.9995);
  return texture2D(tex, vec2(uv.x, 1.0 - uv.y)).rgb;
}
vec3 layerCA(sampler2D tex, vec4 img, vec4 xf, vec2 t, vec2 s, vec2 off) {
  if (dot(off, off) < 0.04) return layer(tex, img, xf, t, s);
  return vec3(layer(tex, img, xf, t, s + off).r, layer(tex, img, xf, t, s).g, layer(tex, img, xf, t, s - off).b);
}

void main() {
  vec2 s = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr;

  // the stage's purple glow
  vec2 q = (s - vec2(0.5, 0.6) * uSize) / (0.75 * uSize);
  vec3 col = mix(mix(BG, ACC, 0.12), BG, clamp(length(q), 0.0, 1.0));

  // the record turning behind the window
  if (uRec.w > 0.001) {
    vec2 rd = s - uRec.xy; float rr = length(rd);
    float disc = smoothstep(uRec.z + 1.0, uRec.z - 1.0, rr);
    vec3 rc = mix(BG, SURF2, 0.5 + 0.5 * sin(rr * TAU / 3.5));
    float a = atan(rd.x, -rd.y) - uRecRot;
    rc += ACC * 0.22 * exp(-pow(angDist(a, 0.96) / 0.22, 2.0)) + ACC2 * 0.16 * exp(-pow(angDist(a, 4.01) / 0.22, 2.0));
    rc *= 1.0 + 0.3 * uBeat;
    col *= 1.0 - 0.5 * (1.0 - disc) * exp(-max(rr - uRec.z, 0.0) / 60.0) * uRec.w;
    col = mix(col, rc, disc * uRec.w);
  }

  // the 3D booth of the hero, rendered to a texture
  if (uBoothAlpha > 0.001) {
    vec4 b = texture2D(uBooth, gl_FragCoord.xy / uRes);
    vec3 bc = pow(1.0 - exp(-b.rgb * 1.3), vec3(1.0 / 2.2));   // the booth is rendered linear: tone map, then to sRGB
    col = col * (1.0 - b.a * uBoothAlpha) + bc * uBoothAlpha;
  }

  // the window
  vec2 c = uWin.xy; float R = uWin.z; vec2 d = s - c; float r = length(d);
  float inside = smoothstep(R + 1.0, R - 1.0, r) * uWinAlpha;
  if (inside > 0.001) {
    vec2 dir = r > 0.5 ? d / r : vec2(0.0);
    vec2 off = dir * clamp(abs(uVel) * 2.5 + uBeat * 1.4, 0.0, 8.0) * (1.0 - 0.6 * uOpen) * smoothstep(0.0, 80.0, r);
    vec2 sb = c + (s - c) / (1.0 + 0.014 * uBeat) + uPointer * 12.0 * (1.0 - uOpen);
    vec3 img = layerCA(uTexA, uImgA, uXfA, uTA, sb, off);
    if (uHasB > 0.5) {
      // the next station sweeps in clockwise from 12 o'clock, with a liquid edge and a light trail
      float ang = atan(d.x, -d.y); if (ang < 0.0) ang += TAU;
      float env = sin(PI * clamp(uSweep / TAU, 0.0, 1.0));
      float edge = uSweep + (vnoise(vec2(r * 0.03, uTime * 0.7)) - 0.5) * 0.5 * env;
      float aa = 1.5 / max(r, 1.0);
      float m = smoothstep(edge + aa, edge - aa, ang);
      img = mix(img, layerCA(uTexB, uImgB, uXfB, uTB, sb, off), m);
      float trail = exp(-abs(ang - edge) * r / 5.0) * smoothstep(0.0, R * 0.3, r) * env;
      img += mix(ACC2, vec3(1.0), 0.35) * trail * 0.9;
      img += ACC2 * 0.16 * exp(-max(edge - ang, 0.0) * r / 40.0) * m * env;
    }
    img *= 1.0 - 0.45 * exp(-max(R - r, 0.0) / 22.0) * (1.0 - uOpen);
    col = mix(col, img, inside);
  }

  // the rim, brighter on the beat
  float rim = exp(-pow((r - R) / 1.3, 2.0)) + 0.45 * exp(-max(r - R, 0.0) / (18.0 + 14.0 * uBeat)) * step(R, r);
  col += ACC * rim * uRingOp * uWinAlpha * (0.9 + 0.8 * uBeat);

  // light leaks on the beat, grain, vignette
  col += ACC * 0.10 * uBeat * smoothstep(1.1, 0.0, length((s - vec2(uSize.x, 0.0)) / uSize.y));
  col += ACC2 * 0.06 * uBeat * smoothstep(1.0, 0.0, length((s - vec2(0.0, uSize.y)) / uSize.y));
  col += (hash(s + fract(uTime * 7.31) * 113.0) - 0.5) * 0.05;
  vec2 v = s / uSize - 0.5;
  col *= 1.0 - 0.38 * pow(clamp(length(v) * 1.25, 0.0, 1.0), 2.2);
  gl_FragColor = vec4(col, 1.0);
}
`;

export function createStage(textures) {
  const u = {
    uRes: { value: new Vector2() }, uDpr: { value: 1 }, uSize: { value: new Vector2() },
    uTime: { value: 0 }, uBeat: { value: 0 }, uVel: { value: 0 }, uPointer: { value: new Vector2() },
    uTexA: { value: textures[0] }, uTexB: { value: textures[1] },
    uImgA: { value: new Vector4() }, uImgB: { value: new Vector4() },
    uXfA: { value: new Vector4(0, 0, 1, 0) }, uXfB: { value: new Vector4(0, 0, 1, 0) },
    uTA: { value: new Vector2() }, uTB: { value: new Vector2() }, uHasB: { value: 0 },
    uWin: { value: new Vector4() }, uSweep: { value: 0 }, uWinAlpha: { value: 1 }, uOpen: { value: 0 },
    uRec: { value: new Vector4() }, uRecRot: { value: 0 }, uRingOp: { value: 1 },
    uBooth: { value: null }, uBoothAlpha: { value: 0 },
  };
  const material = new ShaderMaterial({ uniforms: u, vertexShader: vertex, fragmentShader: fragment, depthTest: false, depthWrite: false });
  const scene = new Scene();
  scene.add(new Mesh(new PlaneGeometry(2, 2), material));
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

  function setLayer(X, img, xf, t, key) {
    const L = window.AcademyJourney.layout[X.k];
    img.set(L.img[0], L.img[1], L.img[2], L.img[3]);
    xf.set(X.f[0], X.f[1], X.kz, 0);
    t.set(X.tx, X.ty);
    u[key].value = textures[X.k];
  }

  // st: AcademyJourney.state; fx: { time, beat, vel, pointer, winAlpha, booth, boothAlpha }
  function update(st, fx, W, H, dpr) {
    const J = window.AcademyJourney;
    u.uRes.value.set(W * dpr, H * dpr); u.uDpr.value = dpr; u.uSize.value.set(W, H);
    u.uTime.value = fx.time; u.uBeat.value = fx.beat; u.uVel.value = fx.vel; u.uPointer.value.copy(fx.pointer);
    setLayer(st.A, u.uImgA.value, u.uXfA.value, u.uTA.value, "uTexA");
    if (st.B) { setLayer(st.B, u.uImgB.value, u.uXfB.value, u.uTB.value, "uTexB"); u.uHasB.value = 1; }
    else u.uHasB.value = 0;
    u.uWin.value.set(st.wx, st.wy, st.R, st.wr);
    u.uSweep.value = st.sweep * Math.PI * 2;
    u.uOpen.value = st.open;
    u.uWinAlpha.value = fx.winAlpha;
    u.uRec.value.set(J.win.x, J.win.y, J.recR * (1 + 0.4 * st.open), (0.35 + 0.65 * st.hp) * (1 - st.open));
    u.uRecRot.value = st.tRaw * 50 * Math.PI / 180 + fx.time * 0.25;
    u.uRingOp.value = (1 - st.open) * Math.min(1, st.hp * 2);
    u.uBooth.value = fx.booth || null;
    u.uBoothAlpha.value = fx.booth ? fx.boothAlpha : 0;
  }

  return { scene, camera, update, material };
}
