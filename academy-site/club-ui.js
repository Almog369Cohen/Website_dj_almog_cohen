/*
 * The rest of the page in club mode: marquees that run with the scroll (faster, leaning, and backwards when
 * you scroll up), the path's line filling as you read with light turning on its record windows, the
 * teacher's record and the final disc spinning (faster on the beat when the sound is on), and, with a
 * mouse, a soft UV light, magnetic buttons and channel strips that tilt. Nothing here runs with reduced motion.
 */
(function () {
  "use strict";

  // The track builder in the final section: three choices and a name become a ready WhatsApp message.
  // (This part is not motion, so it runs for everyone.)
  var form = document.getElementById("builder");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = new FormData(form), name = String(f.get("name") || "").trim();
      var msg = "היי" + (name ? ", אני " + name : "") + ". הגעתי מהאתר של Compaktt School.\n" +
        "המטרה שלי: " + f.get("goal") + ".\n" +
        "נוח לי: " + f.get("where") + ", " + f.get("when") + ".\n" +
        "אשמח לשמוע פרטים ולבנות מסלול.";
      var url = "https://wa.me/972502427616?text=" + encodeURIComponent(msg);
      var w = window.open(url, "_blank");
      if (w) w.opener = null; else location.href = url;
    });
    // a goal picked in the finder above carries over
    Array.prototype.forEach.call(document.querySelectorAll(".seg [data-goal]"), function (b) {
      b.addEventListener("click", function () {
        var r = form.querySelector('[data-goal-for="' + b.getAttribute("data-goal") + '"]');
        if (r) r.checked = true;
      });
    });
  }

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
  var now = document.querySelector(".now"), vu = now ? now.querySelectorAll(".now-vu i") : [], nowText = now && now.querySelector(".now-t");
  var caps = document.querySelectorAll(".journey-caps .cap"), nowLabel = "";

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

    // the now-playing pill in the header: where you are in the mix, and a VU meter
    if (now && sound) {
      var lv = Math.max(window.ClubAudio.level(), beat * 0.6);
      for (var k = 0; k < vu.length; k++) {
        var v = clamp(lv * (1.25 - Math.abs(k - 2) * 0.18) + (Math.random() - 0.5) * 0.08, 0.12, 1);
        vu[k].style.transform = "scaleY(" + v.toFixed(3) + ")";
      }
      var label = "Club Mix", J = window.AcademyJourney, root = document.documentElement;
      if (root.classList.contains("jam-on")) label = "נגנו עכשיו";
      else if (J && J.state && root.classList.contains("in-journey")) {
        if (J.state.tRaw < 0) label = "מבחוץ";
        else {
          var cap = caps[J.state.i];
          var bb = cap && cap.querySelector(".cap-label b");
          if (bb) label = bb.textContent + " · " + cap.querySelector(".cap-label").textContent.replace(bb.textContent, "").trim();
        }
      }
      if (label !== nowLabel) {
        nowLabel = label;
        nowText.textContent = label + " · ";
        var bpm = document.createElement("b");
        bpm.textContent = "124 BPM";
        nowText.appendChild(bpm);
      }
    }

    if (light) {
      lx += (px - lx) * 0.16; ly += (py - ly) * 0.16;
      light.style.transform = "translate3d(" + lx.toFixed(1) + "px," + ly.toFixed(1) + "px,0)";
    }
    raf = document.hidden ? 0 : requestAnimationFrame(frame);
  }
  var raf = requestAnimationFrame(frame);
  document.addEventListener("visibilitychange", function () { if (!document.hidden && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); } });

  // The crossfader picks the track: drag it (or tap a stop) and the matching goal button is pressed
  var xf = document.querySelector(".xf");
  var goals = Array.prototype.slice.call(document.querySelectorAll(".seg [data-goal]"));
  if (xf && goals.length === 3) {
    xf.hidden = false;
    var stops = [0, 0.5, 1];   // from the right: basic, field, pro
    var cap = xf.querySelector(".xf-cap"), dragging = false, at = -1;
    var setPos = function (v) { xf.style.setProperty("--pos", v.toFixed(3)); };
    var fromGoals = function () {
      var k = goals.findIndex(function (g) { return g.getAttribute("aria-pressed") === "true"; });
      if (k >= 0) { xf.classList.add("snap"); setPos(stops[k]); at = k; }
    };
    var posAt = function (e) {
      var r = xf.getBoundingClientRect();
      return clamp((r.right - 22 - e.clientX) / (r.width - 44), 0, 1);
    };
    var nearest = function (v) { return v < 0.25 ? 0 : v < 0.75 ? 1 : 2; };
    var pick = function (k) {
      if (k === at) return;
      at = k;
      goals[k].click();
      if (window.ClubAudio) window.ClubAudio.tick();
      if (navigator.vibrate) try { navigator.vibrate(8); } catch (e2) {}
    };
    fromGoals();
    goals.forEach(function (g) { g.addEventListener("click", function () { if (!dragging) setTimeout(fromGoals, 0); }); });
    xf.addEventListener("pointerdown", function (e) {
      dragging = true; xf.classList.remove("snap"); xf.classList.add("dragging");
      xf.setPointerCapture(e.pointerId);
      var v = posAt(e); setPos(v); pick(nearest(v));
    });
    xf.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var v = posAt(e); setPos(v); pick(nearest(v));
    });
    var drop = function () {
      if (!dragging) return;
      dragging = false; xf.classList.remove("dragging"); xf.classList.add("snap");
      setPos(stops[at]);
    };
    xf.addEventListener("pointerup", drop);
    xf.addEventListener("pointercancel", drop);
  }

  // Itay's recording: while it plays, the bars around the playhead dance to the sound itself
  var rec = document.getElementById("audio"), wave = document.getElementById("wave");
  if (rec && wave && (window.AudioContext || window.webkitAudioContext)) {
    var actx = null, an = null, bins = null, vraf = 0, touched = [];
    var dance = function () {
      vraf = 0;
      if (rec.paused) { touched.forEach(function (b) { b.style.transform = ""; }); touched = []; return; }
      an.getByteFrequencyData(bins);
      var bars = wave.children, lit = wave.querySelectorAll("i.on").length;
      touched.forEach(function (b) { b.style.transform = ""; });
      touched = [];
      for (var j = 0; j < 16; j++) {
        var b = bars[lit - 4 + j];
        if (!b) continue;
        var v = bins[2 + j * 4] / 255;
        b.style.transform = "scaleY(" + (0.55 + v * 1.1).toFixed(3) + ")";
        touched.push(b);
      }
      vraf = requestAnimationFrame(dance);
    };
    rec.addEventListener("play", function () {
      try {
        if (!actx) {
          actx = new (window.AudioContext || window.webkitAudioContext)();
          an = actx.createAnalyser(); an.fftSize = 256; bins = new Uint8Array(an.frequencyBinCount);
          actx.createMediaElementSource(rec).connect(an);
          an.connect(actx.destination);
        }
        if (actx.state !== "running") actx.resume();
      } catch (e) { return; }
      if (!vraf) vraf = requestAnimationFrame(dance);
    });
  }

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
