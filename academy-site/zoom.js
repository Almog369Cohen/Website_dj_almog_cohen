/*
 * Zoom journey: "מ-0 לעמדה".
 *
 * Every scene ends in a circle (the vinyl label, the booth logo, an ear cup, a jog wheel).
 * Scrolling scales the scene into that circle while the next scene opens inside it,
 * until the circle covers the screen and the next scene takes over.
 *
 * Scenes are the [data-scene] children of #journey. Image scenes carry:
 *   data-size-p / data-size-l      image size of the portrait / landscape crop ("w,h")
 *   data-portal-p / data-portal-l  circle in that crop, normalised ("x,y,r", r relative to width)
 * Crops and numbers come from tools/zoom-crops.py. Open the page with #portal to mark circles by hand.
 *
 * Without GSAP, or with reduced motion, the scenes stay a plain vertical sequence.
 */
(function () {
  "use strict";

  var journey = document.getElementById("journey");
  if (!journey) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  var stage = journey.querySelector(".journey-stage");
  var scenes = Array.prototype.slice.call(journey.querySelectorAll("[data-scene]"));
  var N = scenes.length;
  var capLayer = journey.querySelector(".journey-caps");
  var caps = scenes.map(function (el) { return el.querySelector(".cap"); });
  var vignette = journey.querySelector(".fx-vignette");
  var flash = journey.querySelector(".fx-flash");
  var hudCount = journey.querySelector(".hud-count");
  var hudBar = journey.querySelector(".hud-bar i");

  var HOLD = 0.32;          // share of each segment spent on a scene before diving in
  var FINAL_HOLD = 0.7;     // extra segment length for the last scene
  var LABEL = 0.16;         // vinyl label radius relative to the record's width
  var portalMode = window.location.hash === "#portal";

  journey.classList.add("zoom-on");
  caps.forEach(function (c) { if (c) capLayer.appendChild(c); });

  var W = 0, H = 0, portrait = false, layout = [];

  function clamp(v, lo, hi) { return Math.min(Math.max(v, lo), hi); }
  function pair(str) { return str ? str.split(",").map(Number) : null; }

  // Size every image so it covers the stage with its own circle as close to the centre as possible.
  function measure() {
    var sr = stage.getBoundingClientRect();
    W = sr.width;
    H = sr.height;
    portrait = window.matchMedia("(orientation: portrait)").matches;
    var key = portrait ? "p" : "l";
    layout = scenes.map(function (el) {
      el.style.transform = "none";
      el.style.clipPath = "none";
      var zero = el.querySelector(".zero");
      if (zero) {
        var z = zero.getBoundingClientRect();
        return { portal: { x: z.left - sr.left + z.width / 2, y: z.top - sr.top + z.height / 2, r: z.width * LABEL } };
      }
      var size = pair(el.getAttribute("data-size-" + key));
      var pt = pair(el.getAttribute("data-portal-" + key));
      var s = Math.max(W / size[0], H / size[1]);
      var dw = size[0] * s;
      var dh = size[1] * s;
      var fx = pt ? pt[0] : 0.5;
      var fy = pt ? pt[1] : 0.5;
      var left = clamp(W / 2 - fx * dw, W - dw, 0);
      var top = clamp(H / 2 - fy * dh, H - dh, 0);
      var img = el.querySelector("img");
      img.style.width = dw + "px";
      img.style.height = dh + "px";
      img.style.left = left + "px";
      img.style.top = top + "px";
      return {
        left: left, top: top, dw: dw, dh: dh, key: key, pt: pt,
        portal: pt ? { x: left + pt[0] * dw, y: top + pt[1] * dh, r: pt[2] * dw } : null
      };
    });
    // Keep the caption away from the circle we are about to dive into
    caps.forEach(function (c, k) {
      if (c) c.classList.toggle("cap-top", !!(layout[k].portal && layout[k].portal.y > H * 0.55));
    });
  }

  function farthestCorner(p) {
    var dx = Math.max(p.x, W - p.x);
    var dy = Math.max(p.y, H - p.y);
    return Math.sqrt(dx * dx + dy * dy);
  }

  function show(el, on) {
    el.style.visibility = on ? "visible" : "hidden";
    el.style.willChange = on ? "transform" : "auto";
  }

  var lastIndex = -1;
  function render(t) {
    var i = Math.min(Math.floor(t), N - 1);
    var p = t - i;
    var last = i === N - 1;
    var dive = last ? 0 : clamp((p - HOLD) / (1 - HOLD), 0, 1);
    var d = dive * dive * (3 - 2 * dive);          // smoothstep: ease into and out of the dive
    var idle = 1 + 0.05 * clamp(p / HOLD, 0, 1);   // slow push-in while holding
    if (last) idle = 1 + 0.05 * clamp(p / FINAL_HOLD, 0, 1);

    scenes.forEach(function (el, k) {
      var on = k === i || (k === i + 1 && !last);
      show(el, on);
      el.style.zIndex = k === i + 1 ? 2 : 1;
    });

    var cur = scenes[i];
    var L = layout[i];
    cur.style.clipPath = "none";
    if (!last && L.portal) {
      var P = L.portal;
      var S = farthestCorner(P) / P.r;
      var z = Math.pow(S, d);
      var origin = P.x + "px " + P.y + "px";
      cur.style.transformOrigin = origin;
      cur.style.transform = "scale(" + (idle * z) + ")";

      // The next scene, seen through the circle, flying forward as the circle opens
      var nxt = scenes[i + 1];
      var sc = 1 + 0.35 * (1 - d);
      var rad = (P.r * idle * z) / sc;
      nxt.style.transformOrigin = origin;
      nxt.style.transform = "scale(" + sc + ")";
      nxt.style.clipPath = "circle(" + rad.toFixed(2) + "px at " + P.x.toFixed(1) + "px " + P.y.toFixed(1) + "px)";
      nxt.style.opacity = clamp((p - 0.04) / (HOLD - 0.04), 0, 1);
    } else {
      cur.style.transformOrigin = "50% 50%";
      cur.style.transform = "scale(" + idle + ")";
    }
    cur.style.opacity = 1;

    // Atmosphere: darker edges while diving, a strobe blink when a new scene lands
    vignette.style.opacity = (0.8 * d).toFixed(3);
    var nearest = Math.round(t);
    var blink = nearest >= 1 && nearest <= N - 1 ? Math.max(0, 1 - Math.abs(t - nearest) / 0.035) : 0;
    flash.style.opacity = (0.55 * blink).toFixed(3);

    caps.forEach(function (c, k) {
      if (!c) return;
      var local = t - k;
      var o;
      if (k === N - 1) {
        o = clamp((local + 0.02) / 0.12, 0, 1);
      } else if (local < 0 || local >= 1) {
        o = 0;
      } else {
        var fadeIn = k === 0 ? 1 : clamp(local / 0.08, 0, 1);
        var fadeOut = 1 - clamp((local - (HOLD - 0.08)) / 0.16, 0, 1);
        o = Math.min(fadeIn, fadeOut);
      }
      c.style.opacity = o.toFixed(3);
      c.style.transform = "translateY(" + ((1 - o) * 18).toFixed(1) + "px)";
      c.style.visibility = o > 0.01 ? "visible" : "hidden";
    });

    if (i !== lastIndex) {
      lastIndex = i;
      hudCount.textContent = String(i).padStart(2, "0") + " / " + String(N - 1).padStart(2, "0");
    }
    hudBar.style.transform = "scaleX(" + clamp(t / (N - 1), 0, 1).toFixed(4) + ")";
  }

  function trackHeight() {
    var seg = H * (portrait ? 0.9 : 1.1);
    journey.style.height = (H + (N - 1 + FINAL_HOLD) * seg) + "px";
  }

  if (portalMode) { portalTool(); return; }

  measure();
  trackHeight();
  var total = N - 1 + FINAL_HOLD;
  var proxy = { t: 0 };
  var touch = window.matchMedia("(pointer: coarse)").matches;
  gsap.to(proxy, {
    t: total,
    ease: "none",
    onUpdate: function () { render(proxy.t); },
    scrollTrigger: {
      trigger: journey, start: "top top", end: "bottom bottom", scrub: touch ? 0.5 : 0.3,
      onToggle: function (self) { document.documentElement.classList.toggle("in-journey", self.isActive); }
    }
  });
  render(0);

  // Decode upcoming images early so a dive never opens onto an empty circle
  scenes.forEach(function (el) {
    var img = el.querySelector("img");
    if (img && img.decode) img.decode().catch(function () {});
  });

  var lastW = W, lastH = H, timer;
  window.addEventListener("resize", function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      var r = stage.getBoundingClientRect();
      if (Math.abs(r.width - lastW) < 2 && Math.abs(r.height - lastH) < 2) return;
      measure();
      trackHeight();
      lastW = W; lastH = H;
      ScrollTrigger.refresh();
    }, 150);
  });
  window.addEventListener("load", function () { measure(); ScrollTrigger.refresh(); });

  // #portal: click the centre of the circle, drag out to its edge, copy the attribute
  function portalTool() {
    journey.style.height = "auto";
    journey.classList.add("portal-mode");
    measure();
    var idx = 1;
    var ui = document.createElement("div");
    ui.className = "ptool";
    ui.innerHTML =
      '<button type="button" data-step="-1">→ הקודמת</button>' +
      '<output aria-live="polite"></output>' +
      '<button type="button" data-step="1">הבאה ←</button>' +
      '<button type="button" data-copy>העתקה</button>';
    var ring = document.createElement("div");
    ring.className = "pring";
    stage.appendChild(ring);
    stage.appendChild(ui);
    var out = ui.querySelector("output");

    function draw(x, y, r) {
      ring.style.left = x - r + "px";
      ring.style.top = y - r + "px";
      ring.style.width = ring.style.height = 2 * r + "px";
    }
    function attr(x, y, r) {
      var L = layout[idx];
      return 'data-portal-' + L.key + '="' +
        ((x - L.left) / L.dw).toFixed(4) + "," + ((y - L.top) / L.dh).toFixed(4) + "," + (r / L.dw).toFixed(4) + '"';
    }
    function select(k) {
      idx = clamp(k, 1, N - 1);
      scenes.forEach(function (el, j) { show(el, j === idx); el.style.transform = "none"; el.style.clipPath = "none"; el.style.opacity = 1; });
      caps.forEach(function (c) { if (c) c.style.visibility = "hidden"; });
      var P = layout[idx].portal;
      if (P) { draw(P.x, P.y, P.r); out.textContent = attr(P.x, P.y, P.r); }
      else { ring.style.width = "0"; out.textContent = "סצנה " + idx + ": אין עיגול (סצנה אחרונה)"; }
    }
    ui.addEventListener("click", function (e) {
      var step = e.target.getAttribute("data-step");
      if (step) select(idx + Number(step));
      if (e.target.hasAttribute("data-copy")) {
        try { navigator.clipboard.writeText(out.textContent).catch(function () {}); } catch (err) { /* select manually */ }
      }
    });
    var start = null;
    stage.addEventListener("pointerdown", function (e) {
      if (ui.contains(e.target)) return;
      var sr = stage.getBoundingClientRect();
      start = { x: e.clientX - sr.left, y: e.clientY - sr.top };
      draw(start.x, start.y, 4);
    });
    stage.addEventListener("pointermove", function (e) {
      if (!start) return;
      var sr = stage.getBoundingClientRect();
      var r = Math.hypot(e.clientX - sr.left - start.x, e.clientY - sr.top - start.y);
      draw(start.x, start.y, Math.max(r, 4));
      out.textContent = attr(start.x, start.y, Math.max(r, 4));
    });
    window.addEventListener("pointerup", function () { start = null; });
    select(1);
  }
})();
