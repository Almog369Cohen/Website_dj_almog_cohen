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
 * The landscape set is optional; without it wide screens use the portrait image.
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

  // Each caption's title arrives word by word
  var words = caps.map(function (c) {
    var title = c.querySelector(".cap-title");
    if (!title) return [];
    title.innerHTML = title.textContent.trim().split(/\s+/).map(function (w) { return '<span class="w">' + w + "</span>"; }).join(" ");
    return Array.prototype.slice.call(title.querySelectorAll(".w"));
  });
  // and a giant outlined station number drifts behind it
  var ghost = document.createElement("div");
  ghost.className = "jr-num";
  ghost.setAttribute("aria-hidden", "true");
  stage.insertBefore(ghost, stage.querySelector(".journey-fx"));

  var HERO = 1.0;          // scroll length (in stations) of the hero diving into the window
  var FINAL_HOLD = 0.6;    // extra length for the last station
  var SEG_P = 0.62, SEG_L = 0.72;   // one station's scroll length, as a part of the screen height (phone, wide)
  var SWEEP_FROM = 0.3, SWEEP_TO = 0.92;   // part of each station spent sweeping in the next one
  var DOLLY = 0.08;        // each station keeps pushing in while it plays, like a camera move

  // stage-gl.js (club-gl.js) and club-audio.js follow the journey through this
  var api = window.AcademyJourney = { state: null, win: null, layout: [], recR: 0, origin: null, listeners: [] };

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
      // a scene without its own wide image uses the portrait one on wide screens too
      var use = el.hasAttribute("data-src-" + key) ? key : "p";
      var src = el.getAttribute("data-src-" + use);
      var size = nums(el.getAttribute("data-size-" + use));
      var foc = nums(el.getAttribute("data-focus-" + use));
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
        // The window shows about 2.4 r around the focus, but between 0.21 and 0.31 of the image's short side,
        // so a station frames the same part of the photo on a phone and on a wide screen
        var side = Math.min(dw, dh);
        var k0 = win.r / clamp(2.4 * r, 0.21 * side, 0.31 * side);
        // and never so far out that the window runs past the photo's edge, even pulled back by the dolly
        var edge = Math.min(f[0] - left, left + dw - f[0], f[1] - top, top + dh - f[1]);
        return { f: f, k0: Math.max(k0, win.r / edge / (1 - DOLLY)), src: src, img: [left, top, dw, dh] };
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
    api.win = win; api.layout = layout; api.recR = RR; api.W = W; api.H = H;
  }

  // Where station k sits: its focus in the window (wx, wy); open = 1 is the whole, unmoved scene. u is the
  // station's own progress (-1 .. 1), which drives the dolly.
  function xform(k, open, wx, wy, u) {
    var L = layout[k];
    var kz = (L.k0 + (1 - L.k0) * open) * (1 + DOLLY * u * (1 - open));
    return { k: k, f: L.f, kz: kz, tx: (wx - L.f[0]) * (1 - open), ty: (wy - L.f[1]) * (1 - open) };
  }

  // Draw it with CSS (without WebGL): R is the window radius on screen, sweep < 360 reveals it clockwise
  // from 12 o'clock
  function place(X, wx, wy, R, sweep) {
    var k = X.k, el = scenes[k], kz = X.kz, tx = X.tx, ty = X.ty, F = X.f;
    el.style.transformOrigin = F[0].toFixed(1) + "px " + F[1].toFixed(1) + "px";
    el.style.transform = "translate(" + tx.toFixed(1) + "px," + ty.toFixed(1) + "px) scale(" + kz.toFixed(4) + ")";
    // clip shapes are in the scene's own (untransformed) coordinates
    var lx = F[0] + (wx - F[0] - tx) / kz, ly = F[1] + (wy - F[1] - ty) / kz;
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

  function domRecord(tRaw, hp, open, wx, wy, wr, R, sweep) {
    rec.style.transform = "rotate(" + (tRaw * 50).toFixed(2) + "deg) scale(" + (1 + 0.4 * open).toFixed(3) + ")";
    rec.style.opacity = ((0.35 + 0.65 * hp) * (1 - open)).toFixed(3);
    ring.style.width = ring.style.height = 2 * R + "px";
    ring.style.left = wx - R + "px"; ring.style.top = wy - R + "px";
    ring.style.opacity = ((1 - open) * Math.min(1, hp * 2)).toFixed(3);
    arm.style.left = wx + "px"; arm.style.top = wy - wr + "px"; arm.style.height = wr + "px";
    arm.style.transform = "rotate(" + (sweep * 360).toFixed(1) + "deg)";
    arm.style.opacity = (sweep > 0 && sweep < 1 ? Math.min(1, sweep / 0.04, (1 - sweep) / 0.04) : 0).toFixed(3);
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
      // from the heading's 0, or from wherever stage-gl says the window starts (the 3D jog)
      var o = api.origin && api.origin(hp);
      if (!o) {
        var zr = zero.getBoundingClientRect(), sr = stage.getBoundingClientRect();
        o = { x: zr.left - sr.left + zr.width / 2, y: zr.top - sr.top + zr.height / 2, r: zr.width / 2 };
      }
      wx = o.x + (win.x - o.x) * hp; wy = o.y + (win.y - o.y) * hp; wr = o.r + (win.r - o.r) * hp;
    }
    var heroOp = clamp(1 - hp / 0.45, 0, 1);
    hero.style.opacity = heroOp.toFixed(3);
    hero.style.visibility = heroOp > 0.01 ? "visible" : "hidden";
    zero.style.opacity = clamp(1 - hp / 0.12, 0, 1).toFixed(3);

    var open = last ? smooth(p / 0.45) : 0;
    var far = Math.sqrt(Math.pow(Math.max(wx, W - wx), 2) + Math.pow(Math.max(wy, H - wy), 2));
    var R = wr + (far - wr) * open;
    var sweep = last ? 0 : smooth((p - SWEEP_FROM) / (SWEEP_TO - SWEEP_FROM));

    var A = xform(i, open, wx, wy, t - i);
    var B = !last && sweep > 0 ? xform(i + 1, 0, wx, wy, t - i - 1) : null;
    api.state = {
      tRaw: tRaw, t: t, i: i, p: p, last: last, hp: hp, open: open, sweep: sweep,
      wx: wx, wy: wy, wr: wr, R: R, A: A, B: B, at: performance.now()
    };
    for (var n = 0; n < api.listeners.length; n++) api.listeners[n](api.state);
    if (window.ClubAudio) ClubAudio.setJourney(tRaw);

    if (!journey.classList.contains("gl-on")) {
      for (var k = 0; k < N; k++) show(k, k === i || (k === i + 1 && sweep > 0));
      scenes[i].style.zIndex = 1;
      place(A, wx, wy, R, 360);
      if (B) {
        scenes[i + 1].style.zIndex = 2;
        place(B, wx, wy, R, sweep * 360);
      }
      domRecord(tRaw, hp, open, wx, wy, wr, R, sweep);
    }
    var nr = Math.round(t);
    // a white flash on each station change (the WebGL stage sends a shockwave instead)
    var fl = nr >= 1 && nr <= N - 1 && tRaw > 0 && !journey.classList.contains("gl-on") ? 0.22 * Math.max(0, 1 - Math.abs(t - nr) / 0.03) : 0;
    flash.style.opacity = fl.toFixed(3);

    caps.forEach(function (c, k) {
      var local = tRaw - k, o;
      if (k === N - 1) o = clamp((local + 0.02) / 0.12, 0, 1);
      else if (local < 0 || local >= 1) o = 0;
      else o = Math.min(clamp(local / 0.08, 0, 1), 1 - clamp((local - 0.42) / 0.14, 0, 1));
      c.style.opacity = o.toFixed(3);
      c.style.transform = "translateY(" + ((1 - o) * 16).toFixed(1) + "px)";
      c.style.visibility = o > 0.01 ? "visible" : "hidden";
      if (o > 0.01) {
        var ws = words[k], start = k === N - 1 ? -0.02 : 0;
        for (var j = 0; j < ws.length; j++) {
          var e = smooth((local - start - j * 0.025) / 0.08);
          ws[j].style.opacity = e.toFixed(3);
          ws[j].style.transform = "translateY(" + ((1 - e) * 0.5).toFixed(3) + "em) rotate(" + ((1 - e) * -7).toFixed(2) + "deg) scale(" + (0.86 + 0.14 * e).toFixed(3) + ")";
        }
      }
    });
    var go = tRaw < -0.05 ? 0 : clamp(1 - Math.abs(p - 0.2) / 0.5, 0, 1) * (last ? 1 : 1 - sweep);
    ghost.textContent = String(i + 1).padStart(2, "0");
    ghost.style.opacity = (go * 0.9).toFixed(3);
    ghost.style.transform = "translateY(" + ((0.25 - p) * 90).toFixed(1) + "px)";

    if (i !== lastIndex) {
      lastIndex = i;
      hudCount.textContent = String(i + 1).padStart(2, "0") + " / " + String(N).padStart(2, "0");
    }
    hud.style.opacity = hp.toFixed(3);
    hud.style.visibility = hp > 0.01 ? "visible" : "hidden";
    hudBar.style.transform = "scaleX(" + clamp((tRaw + HERO) / (N - 1 + HERO), 0, 1).toFixed(4) + ")";
  }

  var segPx = 0;
  function trackHeight() {
    segPx = H * (W / H < 0.9 ? SEG_P : SEG_L);
    journey.style.height = (H + (HERO + N - 1 + FINAL_HOLD) * segPx) + "px";
  }

  // Snap: when the scroll comes to rest inside the journey, it settles on the nearest station in the
  // direction it was going, so one swipe is one station (the hero, each station, the opened booth)
  var rests = [-HERO];
  for (var r = 0; r < N - 1; r++) rests.push(r + 0.12);
  rests.push(N - 1 + 0.5);
  function setupSnap() {
    var from = 0, holding = false, snapping = false, settle = 0, aim = 0, release = 0, input = -1e9;
    // only the reader's own scrolling snaps; a jump from a link or a script just passes through
    var mark = function () { input = performance.now(); };
    window.addEventListener("wheel", mark, { passive: true });
    window.addEventListener("touchmove", mark, { passive: true });
    window.addEventListener("keydown", function (e) {
      if (/^(ArrowUp|ArrowDown|PageUp|PageDown|Home|End| )$/.test(e.key)) mark();
    });
    function top0() { return journey.getBoundingClientRect().top + window.scrollY; }
    function tAtScroll() { return (window.scrollY - top0()) / segPx - HERO; }
    function go(j) {
      var y = top0() + (rests[j] + HERO) * segPx;
      from = j;
      if (Math.abs(window.scrollY - y) < 2) return;
      snapping = true; aim = y;
      var done = function () { snapping = false; clearTimeout(release); };
      var lenis = window.AcademyLenis;
      if (lenis) lenis.scrollTo(y, { duration: 0.6, easing: function (x) { return 1 - Math.pow(1 - x, 3); }, onComplete: done });
      else window.scrollTo({ top: y, behavior: "smooth" });
      clearTimeout(release);
      release = setTimeout(done, 1600);   // in case the browser never quite gets there
    }
    function onRest() {
      if (holding || snapping || performance.now() - input > 4000) return;
      var tt = tAtScroll();
      if (tt < -HERO - 0.02 || tt > rests[rests.length - 1] + 0.3) return;   // outside: scroll freely
      var moved = tt - rests[from], j;
      if (Math.abs(moved) < 0.12) j = from;
      else if (moved > 0) { for (j = 0; j < rests.length - 1 && rests[j] < tt - 0.12; j++); }
      else { for (j = rests.length - 1; j > 0 && rests[j] > tt + 0.12; j--); }
      go(j);
    }
    var lastY = window.scrollY;
    window.addEventListener("scroll", function () {
      if (snapping && Math.abs(window.scrollY - aim) < 3) { snapping = false; clearTimeout(release); }
      // the tail of a smooth scroll creeps a pixel at a time: that already counts as resting
      if (Math.abs(window.scrollY - lastY) > 1.5) {
        lastY = window.scrollY;
        clearTimeout(settle);
        settle = setTimeout(onRest, 140);
      }
      if (!snapping) {
        // keep `from` on the station the reader is passing
        var tt = tAtScroll(), best = 0;
        for (var j = 1; j < rests.length; j++) if (Math.abs(rests[j] - tt) < Math.abs(rests[best] - tt)) best = j;
        if (Math.abs(rests[best] - tt) < 0.06) from = best;
      }
    }, { passive: true });
    var down = function () { holding = true; clearTimeout(settle); };
    var up = function () { holding = false; clearTimeout(settle); settle = setTimeout(onRest, 160); };
    window.addEventListener("touchstart", down, { passive: true });
    window.addEventListener("touchend", up, { passive: true });
    window.addEventListener("touchcancel", up, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
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
      trigger: journey, start: "top top", end: "bottom bottom", scrub: touch ? 0.2 : 0.25,
      onToggle: function (self) {
        document.documentElement.classList.toggle("in-journey", self.isActive);
        if (window.ClubAudio) ClubAudio.leaveJourney(!self.isActive && self.progress > 0.5);
      }
    }
  });
  render(-HERO);
  setupSnap();
  api.render = function () { render(proxy.t); };
  api.renderAt = function (tt) { proxy.t = tt; render(tt); };   // for recordings and tests

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
