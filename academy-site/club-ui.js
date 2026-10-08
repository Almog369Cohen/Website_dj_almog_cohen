/*
 * The rest of the page in club mode: marquees that run with the scroll (faster, leaning, and backwards when
 * you scroll up), the path's line filling as you read with light turning on its record windows, the
 * teacher's record and the final disc spinning (faster on the beat when the sound is on), and, with a
 * mouse, a soft UV light, magnetic buttons and channel strips that tilt. Nothing here runs with reduced motion.
 */
(function () {
  "use strict";
  if (!window.matchMedia || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  function clamp(v, lo, hi) { return Math.min(Math.max(v, lo), hi); }

  // only work on what is on screen
  var seen = new WeakMap();
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (en) {
    en.forEach(function (e) { seen.set(e.target, e.isIntersecting); });
  }, { rootMargin: "120px 0px" }) : null;
  function watch(el) { if (el && io) io.observe(el); return el; }
  function onScreen(el) { return !io || seen.get(el); }

  var marquees = Array.prototype.map.call(document.querySelectorAll(".marquee"), function (m, k) {
    var track = m.querySelector(".marquee-track");
    return { el: watch(m), track: track, x: 0, dir: k % 2 ? 1 : -1, w: 0 };
  });
  function measure() { marquees.forEach(function (m) { m.w = m.track.scrollWidth / 2; }); }
  measure();
  window.addEventListener("resize", measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

  var path = watch(document.querySelector(".path"));
  var vinyl = document.querySelector(".vinyl");
  var deck = watch(document.querySelector(".teacher-deck"));
  var finalDisc = watch(document.querySelector(".final-disc"));

  var lastY = window.scrollY, vel = 0, last = performance.now(), spin = 0, vAngle = 0, fAngle = 0;

  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    var y = window.scrollY, dy = y - lastY;
    lastY = y;
    vel = vel * 0.86 + dy * 0.14;
    var sound = window.ClubAudio && window.ClubAudio.on, beat = sound ? window.ClubAudio.pulse() : 0;

    marquees.forEach(function (m) {
      if (!onScreen(m.el) || !m.w) return;
      var speed = 45 + Math.abs(vel) * 7;
      m.x += m.dir * speed * dt * (vel < -0.5 ? -1 : 1);
      if (m.x <= -m.w) m.x += m.w;
      if (m.x > 0) m.x -= m.w;
      m.track.style.transform = "translate3d(" + m.x.toFixed(1) + "px,0,0) skewX(" + clamp(-vel * 0.35, -12, 12).toFixed(2) + "deg)";
    });

    if (path && onScreen(path)) {
      var r = path.getBoundingClientRect();
      path.style.setProperty("--fill", clamp((innerHeight * 0.62 - r.top) / r.height, 0, 1).toFixed(4));
      spin += dt * 40 + Math.abs(dy) * 0.6;
      path.style.setProperty("--spin", (spin % 360).toFixed(1) + "deg");
    }
    // 33 rpm is 200 degrees a second; scrolling pushes the record like a hand on the platter
    var rpm = sound ? 200 * (1 + beat * 0.15) : 70;
    if (vinyl && onScreen(deck)) {
      vAngle += rpm * dt + dy * 0.45;
      vinyl.style.rotate = (vAngle % 360).toFixed(2) + "deg";
    }
    if (finalDisc && onScreen(finalDisc)) {
      fAngle += rpm * 0.35 * dt + dy * 0.2;
      finalDisc.style.rotate = (fAngle % 360).toFixed(2) + "deg";
    }

    if (light) {
      lx += (px - lx) * 0.16; ly += (py - ly) * 0.16;
      light.style.transform = "translate3d(" + lx.toFixed(1) + "px," + ly.toFixed(1) + "px,0)";
    }
    raf = document.hidden ? 0 : requestAnimationFrame(frame);
  }
  var raf = requestAnimationFrame(frame);
  document.addEventListener("visibilitychange", function () { if (!document.hidden && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); } });

  // ---- mouse only ----
  var light = null, px = -999, py = -999, lx = -999, ly = -999;
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  light = document.createElement("div");
  light.className = "cursor-light";
  light.setAttribute("aria-hidden", "true");
  document.body.appendChild(light);
  window.addEventListener("pointermove", function (e) {
    px = e.clientX; py = e.clientY;
    if (lx < -900) { lx = px; ly = py; }
    document.documentElement.classList.add("has-cursor");
  }, { passive: true });
  document.addEventListener("pointerleave", function () { document.documentElement.classList.remove("has-cursor"); });

  // buttons lean towards the pointer
  Array.prototype.forEach.call(document.querySelectorAll(".btn-primary, .sound-btn, .jam-loop"), function (b) {
    if (b.closest(".dock")) return;
    b.style.transition = "transform .25s cubic-bezier(.2,.8,.2,1)";
    b.addEventListener("pointermove", function (e) {
      var r = b.getBoundingClientRect();
      var x = (e.clientX - r.left - r.width / 2) / r.width, yy = (e.clientY - r.top - r.height / 2) / r.height;
      b.style.transform = "translate(" + (x * 10).toFixed(1) + "px," + (yy * 8).toFixed(1) + "px)";
    });
    b.addEventListener("pointerleave", function () { b.style.transform = ""; });
  });

  // channel strips tilt under the pointer, with a light that follows it
  Array.prototype.forEach.call(document.querySelectorAll(".strip"), function (s) {
    s.addEventListener("pointermove", function (e) {
      var r = s.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width, yy = (e.clientY - r.top) / r.height;
      s.style.transform = "rotateY(" + ((x - 0.5) * 7).toFixed(2) + "deg) rotateX(" + ((0.5 - yy) * 6).toFixed(2) + "deg) translateZ(0)";
      s.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
      s.style.setProperty("--my", (yy * 100).toFixed(1) + "%");
    });
    s.addEventListener("pointerleave", function () { s.style.transform = ""; });
  });
})();
