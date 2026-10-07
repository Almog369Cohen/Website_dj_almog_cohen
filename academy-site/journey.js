/*
 * Opening journey: "מ-0 לעמדה", the record window.
 *
 * The vinyl 0 in the heading grows into a round window. Scrolling plays eight stations inside it, from
 * the student's shoes to the booth. Each new station sweeps in clockwise like a tonearm passing over
 * a label, the record behind the window keeps turning, and at the last station the window opens to the
 * full screen with the three tracks.
 *
 * Markup: #journey holds .jr-rec, .jr-layers > .jr-scene x 8, .jr-ring, .jr-arm, the hero (.scene-zero
 * with its .zero), .journey-caps > .cap x 8 and .journey-hud. Scenes are drawn by scenes.js, unless a
 * scene carries an AI image:
 *   data-src-p / data-src-l       portrait / landscape image
 *   data-size-p / data-size-l     its size ("w,h")
 *   data-focus-p / data-focus-l   the round thing to centre in the window ("x,y,r", normalised, r relative to width)
 * tools/zoom-crops.py makes the crops and prints these numbers.
 *
 * Without GSAP, or with reduced motion, the static hero stays and the stations are not shown.
 */
(function () {
  "use strict";

  var journey = document.getElementById("journey");
  if (!journey || !window.ACADEMY_SCENES) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  var DRAW = window.ACADEMY_SCENES;
  var stage = journey.querySelector(".journey-stage");
  var scenes = Array.prototype.slice.call(journey.querySelectorAll(".jr-scene"));
  var caps = Array.prototype.slice.call(journey.querySelectorAll(".journey-caps .cap"));
  var hero = journey.querySelector(".scene-zero");
  var zero = journey.querySelector(".zero");
  var rec = journey.querySelector(".jr-rec");
  var ring = journey.querySelector(".jr-ring");
  var arm = journey.querySelector(".jr-arm");
  var flash = journey.querySelector(".fx-flash");
  var hud = journey.querySelector(".journey-hud");
  var hudCount = journey.querySelector(".hud-count");
  var hudBar = journey.querySelector(".hud-bar i");
  var N = scenes.length;

  var HERO = 1.2;          // scroll length (in stations) of the 0 growing into the window
  var FINAL_HOLD = 0.7;    // extra length for the last station
  var SWEEP_FROM = 0.3, SWEEP_TO = 0.92;   // part of each station spent sweeping in the next one

  journey.classList.add("jr-on");

  // Draw the stations, or place their AI images
  var inner = scenes.map(function (el, k) {
    var box = document.createElement("div");
    box.className = "jr-in";
    if (el.hasAttribute("data-src-p") || el.hasAttribute("data-src-l")) {
      box.appendChild(document.createElement("img"));
      box.firstChild.alt = "";
      box.firstChild.decoding = "async";
    } else {
      box.innerHTML = DRAW.draw[k](k);
    }
    el.appendChild(box);
    return box;
  });

  function clamp(v, lo, hi) { return Math.min(Math.max(v, lo), hi); }
  function smooth(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }
  function nums(str) { return str ? str.split(",").map(Number) : null; }

  var W = 0, H = 0, top0 = 0, win = null, layout = [];

  function measure() {
    var sr = stage.getBoundingClientRect();
    W = sr.width; H = sr.height;
    var bar = document.querySelector(".bar");
    top0 = bar ? bar.offsetHeight : 0;
    var avail = H - top0;
    var portrait = W / H < 0.9;
    journey.classList.toggle("jr-wide", !portrait);
    // The window: below the caption on a phone, beside it on a wide screen
    win = portrait
      ? { x: W / 2, y: top0 + avail * 0.62, r: Math.min(W * 0.38, avail * 0.21) }
      : { x: W * 0.3, y: top0 + avail * 0.52, r: Math.min(avail * 0.36, W * 0.2) };
    var key = portrait ? "p" : "l";

    layout = scenes.map(function (el, k) {
      el.style.transform = "none";
      var src = el.getAttribute("data-src-" + key);
      var size = nums(el.getAttribute("data-size-" + key));
      var foc = nums(el.getAttribute("data-focus-" + key));
      var f, r;
      if (src && size && foc) {
        // Cover the stage with the image, its round thing as close to the window as the edges allow
        var s = Math.max(W / size[0], H / size[1]);
        var dw = size[0] * s, dh = size[1] * s;
        var left = clamp(win.x - foc[0] * dw, W - dw, 0);
        var top = clamp(win.y - foc[1] * dh, H - dh, 0);
        var img = inner[k].firstChild;
        if (img.getAttribute("src") !== src) {
          img.src = src;
          // decode now, so a station never sweeps in onto an empty window
          if (img.decode) img.decode().catch(function () {});
        }
        img.style.width = dw + "px"; img.style.height = dh + "px";
        img.style.left = left + "px"; img.style.top = top + "px";
        f = [left + foc[0] * dw, top + foc[1] * dh];
        r = foc[2] * dw;
        return { f: f, k0: clamp(win.r / (2.4 * r), 1, 1.5) };   // photos never zoom past x1.5
      }
      // Drawings cover the stage (like the final, opened window). Inside the window they show about 2.4 r
      // around their focus, but never less than their own width can fill.
      var sc = Math.max(W / DRAW.width, H / DRAW.height);
      var ox = (W - DRAW.width * sc) / 2, oy = (H - DRAW.height * sc) / 2;
      var P = DRAW.focus[k];
      f = [ox + P[0] * sc, oy + P[1] * sc];
      var eff = clamp(Math.max(win.r / (2.4 * P[2]), 2.05 * win.r / DRAW.width), 0, 1.5);
      return { f: f, k0: eff / sc };
    });

    var RR = win.r * (portrait ? 1 : 0.6) + (portrait ? 160 : win.r);
    rec.style.width = rec.style.height = 2 * RR + "px";
    rec.style.left = win.x - RR + "px";
    rec.style.top = win.y - RR + "px";
  }

  // Place station k so its focus sits in the window (wx, wy, radius R on screen); open = 1 is the whole,
  // unmoved scene. sweep < 360 reveals it clockwise from 12 o'clock.
  function place(k, open, wx, wy, R, sweep) {
    var L = layout[k], el = scenes[k];
    var kz = L.k0 + (1 - L.k0) * open;
    var tx = (wx - L.f[0]) * (1 - open), ty = (wy - L.f[1]) * (1 - open);
    el.style.transformOrigin = L.f[0].toFixed(1) + "px " + L.f[1].toFixed(1) + "px";
    el.style.transform = "translate(" + tx.toFixed(1) + "px," + ty.toFixed(1) + "px) scale(" + kz.toFixed(4) + ")";
    // clip shapes are in the scene's own (untransformed) coordinates
    var lx = L.f[0] + (wx - L.f[0] - tx) / kz, ly = L.f[1] + (wy - L.f[1] - ty) / kz;
    el.style.clipPath = "circle(" + (R / kz).toFixed(1) + "px at " + lx.toFixed(1) + "px " + ly.toFixed(1) + "px)";
    inner[k].style.clipPath = sweep < 360 ? sector(lx, ly, sweep) : "none";
  }

  function sector(cx, cy, deg) {
    var big = 4 * Math.max(W, H);
    var pts = [cx + "px " + cy + "px"];
    for (var a = 0; a < deg; a += 30) pts.push(edge(a));
    pts.push(edge(deg));
    return "polygon(" + pts.join(",") + ")";
    function edge(d) {
      var rad = d * Math.PI / 180;
      return (cx + Math.sin(rad) * big).toFixed(1) + "px " + (cy - Math.cos(rad) * big).toFixed(1) + "px";
    }
  }

  var shown = [];
  function show(k, on) {
    if (shown[k] === on) return;
    shown[k] = on;
    scenes[k].style.visibility = on ? "visible" : "hidden";
  }

  var lastIndex = -1;
  function render(tRaw) {
    var heroT = Math.min(tRaw, 0);
    var t = Math.max(tRaw, 0);
    var i = Math.min(Math.floor(t), N - 1), p = t - i, last = i === N - 1;

    // The heading's 0 grows into the window
    var hp = smooth((heroT + HERO) / (HERO * 0.8));
    var wx = win.x, wy = win.y, wr = win.r;
    if (hp < 1) {
      var zr = zero.getBoundingClientRect(), sr = stage.getBoundingClientRect();
      var zx = zr.left - sr.left + zr.width / 2, zy = zr.top - sr.top + zr.height / 2, zrad = zr.width / 2;
      wx = zx + (win.x - zx) * hp; wy = zy + (win.y - zy) * hp; wr = zrad + (win.r - zrad) * hp;
    }
    var heroOp = clamp(1 - hp / 0.45, 0, 1);
    hero.style.opacity = heroOp.toFixed(3);
    hero.style.visibility = heroOp > 0.01 ? "visible" : "hidden";
    zero.style.opacity = clamp(1 - hp / 0.12, 0, 1).toFixed(3);

    var open = last ? smooth(p / 0.45) : 0;
    var far = Math.sqrt(Math.pow(Math.max(wx, W - wx), 2) + Math.pow(Math.max(wy, H - wy), 2));
    var R = wr + (far - wr) * open;
    var sweep = last ? 0 : smooth((p - SWEEP_FROM) / (SWEEP_TO - SWEEP_FROM));

    for (var k = 0; k < N; k++) show(k, k === i || (k === i + 1 && sweep > 0));
    scenes[i].style.zIndex = 1;
    place(i, open, wx, wy, R, 360);
    if (!last && sweep > 0) {
      scenes[i + 1].style.zIndex = 2;
      place(i + 1, 0, wx, wy, R, sweep * 360);
    }

    rec.style.transform = "rotate(" + (tRaw * 50).toFixed(2) + "deg) scale(" + (1 + 0.4 * open).toFixed(3) + ")";
    rec.style.opacity = ((0.35 + 0.65 * hp) * (1 - open)).toFixed(3);
    ring.style.width = ring.style.height = 2 * R + "px";
    ring.style.left = wx - R + "px"; ring.style.top = wy - R + "px";
    ring.style.opacity = ((1 - open) * Math.min(1, hp * 2)).toFixed(3);
    arm.style.left = wx + "px"; arm.style.top = wy - wr + "px"; arm.style.height = wr + "px";
    arm.style.transform = "rotate(" + (sweep * 360).toFixed(1) + "deg)";
    arm.style.opacity = (sweep > 0 && sweep < 1 ? Math.min(1, sweep / 0.04, (1 - sweep) / 0.04) : 0).toFixed(3);
    var nr = Math.round(t);
    flash.style.opacity = (nr >= 1 && nr <= N - 1 && tRaw > 0 ? 0.22 * Math.max(0, 1 - Math.abs(t - nr) / 0.03) : 0).toFixed(3);

    caps.forEach(function (c, k) {
      var local = tRaw - k, o;
      if (k === N - 1) o = clamp((local + 0.02) / 0.12, 0, 1);
      else if (local < 0 || local >= 1) o = 0;
      else o = Math.min(clamp(local / 0.08, 0, 1), 1 - clamp((local - 0.42) / 0.14, 0, 1));
      c.style.opacity = o.toFixed(3);
      c.style.transform = "translateY(" + ((1 - o) * 16).toFixed(1) + "px)";
      c.style.visibility = o > 0.01 ? "visible" : "hidden";
    });

    if (i !== lastIndex) {
      lastIndex = i;
      hudCount.textContent = String(i + 1).padStart(2, "0") + " / " + String(N).padStart(2, "0");
    }
    hud.style.opacity = hp.toFixed(3);
    hud.style.visibility = hp > 0.01 ? "visible" : "hidden";
    hudBar.style.transform = "scaleX(" + clamp((tRaw + HERO) / (N - 1 + HERO), 0, 1).toFixed(4) + ")";
  }

  function trackHeight() {
    var seg = H * (W / H < 0.9 ? 0.9 : 1);
    journey.style.height = (H + (HERO + N - 1 + FINAL_HOLD) * seg) + "px";
  }

  measure();
  trackHeight();
  var proxy = { t: -HERO };
  var touch = window.matchMedia("(pointer: coarse)").matches;
  gsap.to(proxy, {
    t: N - 1 + FINAL_HOLD,
    ease: "none",
    onUpdate: function () { render(proxy.t); },
    scrollTrigger: {
      trigger: journey, start: "top top", end: "bottom bottom", scrub: touch ? 0.5 : 0.3,
      onToggle: function (self) { document.documentElement.classList.toggle("in-journey", self.isActive); }
    }
  });
  render(-HERO);

  // The three doors at the last station pick that track in the finder below
  journey.querySelectorAll("[data-goal]").forEach(function (a) {
    a.addEventListener("click", function () {
      var btn = document.getElementById("goal-" + a.getAttribute("data-goal"));
      if (btn) btn.click();
    });
  });

  var lastW = W, lastH = H, timer;
  window.addEventListener("resize", function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      var r = stage.getBoundingClientRect();
      if (Math.abs(r.width - lastW) < 2 && Math.abs(r.height - lastH) < 2) return;
      measure(); trackHeight();
      lastW = W; lastH = H;
      ScrollTrigger.refresh();
      render(proxy.t);
    }, 150);
  });
  window.addEventListener("load", function () { measure(); ScrollTrigger.refresh(); render(proxy.t); });
})();
