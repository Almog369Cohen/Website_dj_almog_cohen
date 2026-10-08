/*
 * Club mode: the scroll builds the track.
 *
 * A 124 BPM house loop synthesised with WebAudio: no samples, nothing licensed. Sound only starts from a tap on a
 * [data-sound] button. Each station of the opening journey adds a layer:
 *   before the stations   a muffled thump and a pad, like hearing a club from outside
 *   01 shoes, 02 desk     + vinyl crackle, then chord stabs; the filter opens as you walk in
 *   03 play               + kick and clap, from the next beat
 *   04 headphones         + hats, and the next track's arpeggio in the left ear only
 *   05 jog                + open hats; scrolling fast scratches
 *   06 fader              + bass; the next track crossfades from the left ear to the middle
 *   07 EQ                 a high-pass build and a noise riser, both following the scroll
 *   08 the booth          the drop: an impact on the beat, everything open, and the crowd
 * Scrolling fast pulls the filter down a little, like riding a filter knob. Past the opening the loop keeps playing
 * quietly until it is muted.
 *
 * window.ClubAudio
 *   toggle(), start()        sound on / off (start() also resumes after a mute)
 *   setJourney(t)            journey position in stations (-1.2 .. 7.7, from journey.js)
 *   leaveJourney(bool)       true once the opening is scrolled past
 *   pad(n)                   one-shots for the playable booth: 0 kick, 1 clap, 2 hat, 3 stab, 4 bass, 5 scratch, 6 drop, 7 horn
 *   jam(bool)                the full loop at full volume under the playable booth ("נגנו עכשיו")
 *   pulse()                  0..1, peaks on every beat and decays; a quiet 124 BPM clock while the sound is off
 *   level()                  0..1 loudness of the mix
 *   on, started
 *   render(seconds, tAt)     offline render (OfflineAudioContext) of a scripted journey, tAt(seconds) -> t; for tests
 */
(function () {
  "use strict";

  var AC = window.AudioContext || window.webkitAudioContext;
  var BPM = 124, SPB = 60 / BPM, S16 = SPB / 4;
  var CHORDS = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]];   // Am F C G
  var ROOTS = [33, 29, 36, 31];
  var ARP = [0, 1, 2, 1];

  function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function clamp(v, lo, hi) { return Math.min(Math.max(v, lo), hi); }
  function smooth(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }

  // What plays at journey position t
  function mixAt(t, out) {
    var i = t < 0 ? -1 : Math.min(Math.floor(t), 7), p = t < 0 ? 0 : t - Math.floor(t);
    // the filter opens as you walk in: 450 Hz outside, fully open from the headphones on
    var pts = [[-1.2, 450], [0, 650], [1, 1100], [2, 5200], [3, 18000]];
    var cut = 18000;
    for (var k = 0; k < pts.length - 1; k++) {
      if (t <= pts[k + 1][0]) {
        var a = pts[k], b = pts[k + 1], q = clamp((t - a[0]) / (b[0] - a[0]), 0, 1);
        cut = a[1] * Math.pow(b[1] / a[1], q);
        break;
      }
    }
    return {
      i: i, p: p,
      pad: true, crackle: i <= 1, stabs: i >= 1, stabCut: i >= 2 ? 1900 : 900,
      kick: i >= 2, thump: i < 0, clap: i >= 2, hats: i >= 3, cue: i >= 3, ohats: i >= 4, bass: i >= 5,
      cuePan: i < 5 ? -0.85 : i === 5 ? -0.85 * (1 - smooth(p / 0.8)) : 0,
      cut: cut,
      hp: i === 6 ? 20 * Math.pow(40, smooth((p - 0.1) / 0.85)) : 20,
      riser: i === 6 ? smooth((p - 0.25) / 0.7) : 0,
      crowd: i === 7 ? 1 : 0,
      out: out
    };
  }

  // One engine per AudioContext (the live one, or an offline one for tests)
  function Engine(ctx, dest) {
    var self = this;
    this.ctx = ctx;
    var noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    var nd = noise.getChannelData(0);
    for (var n = 0; n < nd.length; n++) nd[n] = Math.random() * 2 - 1;
    var crackle = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
    var cd = crackle.getChannelData(0);
    for (n = 0; n < cd.length; n++) cd[n] = (Math.random() < 0.0004 ? (Math.random() - 0.5) * 1.6 : 0) + (Math.random() - 0.5) * 0.012;

    // drums + music -> low-pass -> high-pass -> master -> compressor -> analyser -> out
    var mix = ctx.createGain();
    this.lp = ctx.createBiquadFilter(); this.lp.type = "lowpass"; this.lp.frequency.value = 450; this.lp.Q.value = 0.9;
    this.hp = ctx.createBiquadFilter(); this.hp.type = "highpass"; this.hp.frequency.value = 20; this.hp.Q.value = 0.7;
    this.master = ctx.createGain(); this.master.gain.value = 0.85;
    var comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 4; comp.attack.value = 0.004; comp.release.value = 0.18;
    var limit = ctx.createDynamicsCompressor();
    limit.threshold.value = -2; limit.knee.value = 0; limit.ratio.value = 20; limit.attack.value = 0.001; limit.release.value = 0.1;
    this.analyser = ctx.createAnalyser(); this.analyser.fftSize = 512;
    mix.connect(this.lp).connect(this.hp).connect(this.master).connect(comp).connect(limit).connect(this.analyser).connect(dest);
    var drums = ctx.createGain(); drums.connect(mix);
    var music = ctx.createGain(); music.connect(mix);
    // a short room: the music and the claps get some space, the kick stays dry
    var verb = ctx.createConvolver(), irLen = Math.round(ctx.sampleRate * 1.6), ir = ctx.createBuffer(2, irLen, ctx.sampleRate);
    for (var c = 0; c < 2; c++) {
      var id = ir.getChannelData(c);
      for (n = 0; n < irLen; n++) id[n] = (Math.random() * 2 - 1) * Math.pow(1 - n / irLen, 3);
    }
    verb.buffer = ir;
    var send = ctx.createGain(); send.gain.value = 0.2; send.connect(verb).connect(mix);
    music.connect(send);
    var claps = ctx.createGain(); claps.connect(drums); claps.connect(send);

    // the next track's arpeggio, panned
    this.cuePan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    var cueIn = ctx.createGain(); cueIn.gain.value = 1;
    if (this.cuePan) { this.cuePan.pan.value = -0.85; cueIn.connect(this.cuePan).connect(music); } else cueIn.connect(music);

    function loop(buf, filterType, freq, q, destNode) {
      var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), am = ctx.createGain(), g = ctx.createGain();
      s.buffer = buf; s.loop = true; f.type = filterType; f.frequency.value = freq; f.Q.value = q; g.gain.value = 0;
      s.connect(f).connect(am).connect(g).connect(destNode); s.start();
      return { f: f, am: am, g: g };
    }
    this.crackle = loop(crackle, "highpass", 700, 0.7, music);
    this.riser = loop(noise, "bandpass", 300, 1.6, music);
    this.crowd = loop(noise, "bandpass", 950, 0.55, mix);
    // the crowd breathes
    var lfo = ctx.createOscillator(), lfoG = ctx.createGain();
    lfo.frequency.value = 0.35; lfoG.gain.value = 0.35; lfo.connect(lfoG).connect(this.crowd.am.gain); lfo.start();

    function noiseHit(at, dur, freq, type, amp, to, q) {
      var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      s.buffer = noise; s.loop = true; f.type = type; f.frequency.value = freq; if (q) f.Q.value = q;
      g.gain.setValueAtTime(amp, at); g.gain.exponentialRampToValueAtTime(0.0008, at + dur);
      s.connect(f).connect(g).connect(to); s.start(at, Math.random() * 1.5); s.stop(at + dur + 0.03);
    }
    function synth(at, freqs, dur, type, cutoff, amp, to, detune) {
      var f = ctx.createBiquadFilter(), g = ctx.createGain();
      f.type = "lowpass"; f.frequency.value = cutoff; f.Q.value = 0.8;
      g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(amp, at + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
      f.connect(g).connect(to);
      freqs.forEach(function (fr) {
        (detune ? [-detune, detune] : [0]).forEach(function (d) {
          var o = ctx.createOscillator(); o.type = type; o.frequency.value = fr; o.detune.value = d;
          o.connect(f); o.start(at); o.stop(at + dur + 0.05);
        });
      });
    }
    this.kick = function (at, amp) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.setValueAtTime(165, at); o.frequency.exponentialRampToValueAtTime(47, at + 0.11);
      g.gain.setValueAtTime(amp, at); g.gain.exponentialRampToValueAtTime(0.001, at + 0.45);
      o.connect(g).connect(drums); o.start(at); o.stop(at + 0.48);
      noiseHit(at, 0.012, 3500, "highpass", amp * 0.25, drums);
    };
    this.clap = function (at) { for (var k = 0; k < 3; k++) noiseHit(at + k * 0.011, k === 2 ? 0.2 : 0.022, 1400, "bandpass", 0.6, claps, 1.1); };
    this.hat = function (at, amp, open) { noiseHit(at, open ? 0.24 : 0.045, 8200, "highpass", amp, drums); };
    this.pad = function (at, chord) {
      var f = ctx.createBiquadFilter(), g = ctx.createGain(), len = SPB * 4;
      f.type = "lowpass"; f.frequency.value = 1000;
      g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(0.07, at + 0.7);
      g.gain.setValueAtTime(0.07, at + len - 0.05); g.gain.linearRampToValueAtTime(0, at + len + 0.8);
      f.connect(g).connect(music);
      chord.forEach(function (m) {
        [-9, 9].forEach(function (d) {
          var o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = hz(m - 12); o.detune.value = d;
          o.connect(f); o.start(at); o.stop(at + len + 0.85);
        });
      });
    };
    this.stab = function (at, chord, cutoff) { synth(at, chord.map(hz), 0.16, "sawtooth", cutoff, 0.06, music, 10); };
    this.bass = function (at, root) { synth(at, [hz(root)], 0.21, "sawtooth", 430, 0.22, music, 3); synth(at, [hz(root)], 0.21, "sine", 200, 0.16, music, 0); };
    this.cue = function (at, m) { synth(at, [hz(m)], 0.11, "square", 2600, 0.1, cueIn, 0); };
    this.impact = function (at) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.setValueAtTime(70, at); o.frequency.exponentialRampToValueAtTime(30, at + 1.2);
      g.gain.setValueAtTime(0.55, at); g.gain.exponentialRampToValueAtTime(0.001, at + 1.3);
      o.connect(g).connect(drums); o.start(at); o.stop(at + 1.35);
      noiseHit(at, 1.9, 2600, "highpass", 0.22, mix);
      self.kick(at, 0.8);
    };
    this.scratch = function (at) {
      var dur = 0.2, f = ctx.createBiquadFilter(), g = ctx.createGain(), s = ctx.createBufferSource(), o = ctx.createOscillator();
      f.type = "bandpass"; f.Q.value = 3;
      var curve = new Float32Array([700, 2600, 500, 2300, 600]);
      f.frequency.setValueCurveAtTime(curve, at, dur);
      o.type = "sawtooth"; o.frequency.setValueCurveAtTime(new Float32Array([260, 900, 180, 800, 220]), at, dur);
      g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(0.22, at + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
      s.buffer = noise; s.loop = true; s.connect(f); o.connect(f); f.connect(g).connect(mix);
      s.start(at); s.stop(at + dur + 0.02); o.start(at); o.stop(at + dur + 0.02);
    };
    this.horn = function (at) {
      for (var k = 0; k < 3; k++) {
        var o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter(), t0 = at + k * 0.2;
        o.type = "sawtooth"; o.frequency.setValueAtTime(466, t0); o.frequency.exponentialRampToValueAtTime(k === 2 ? 330 : 440, t0 + 0.18);
        f.type = "lowpass"; f.frequency.value = 3200;
        g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.13, t0 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + (k === 2 ? 0.5 : 0.17));
        o.connect(f).connect(g).connect(mix); o.start(t0); o.stop(t0 + 0.55);
      }
    };

    this.step = 0; this.bar = 0; this.next = 0; this.mix = mixAt(-1.2, false); this.dropPending = false; this.beats = [];
  }

  Engine.prototype.playStep = function (s, at) {
    var L = this.mix, ci = this.bar % 4, chord = CHORDS[ci];
    if (s === 0 && L.pad) this.pad(at, chord);
    if (s % 4 === 0) {
      if (this.dropPending) { this.impact(at); this.dropPending = false; this.beats.push([at, 1.6]); }
      else this.beats.push([at, L.kick ? 1 : L.thump ? 0.6 : 0.35]);
      if (L.kick) this.kick(at, 0.9);
      else if (L.thump) this.kick(at, 0.5);   // outside, the club is a muffled thump
    }
    if (L.clap && (s === 4 || s === 12)) this.clap(at);
    if (L.hats) this.hat(at, s % 2 ? 0.045 : 0.1, false);
    if (L.ohats && s % 4 === 2) this.hat(at, 0.07, true);
    if (L.stabs && s % 4 === 2) this.stab(at, chord, L.stabCut);
    if (L.bass && s % 4 === 2) this.bass(at, ROOTS[ci]);
    if (L.cue) this.cue(at, chord[ARP[s % 4]] + 12);
  };

  // Schedule everything due before `until`
  Engine.prototype.schedule = function (until) {
    while (this.next < until) {
      this.playStep(this.step, this.next);
      this.next += S16;
      this.step = (this.step + 1) % 16;
      if (this.step === 0) this.bar++;
    }
  };

  // Follow the journey: the layers switch on the next step, the filters glide
  Engine.prototype.follow = function (t, vel, out, at, glide) {
    var prev = this.mix.i, L = mixAt(t, out);
    if (L.i === 7 && prev >= 5 && prev < 7) this.dropPending = true;   // the drop lands on the next beat
    this.mix = L;
    var cut = L.cut * (1 - 0.5 * clamp(Math.abs(vel) / 2.5, 0, 1));
    if (out) cut = Math.min(cut, 2400);
    var g = glide || 0.06;
    this.lp.frequency.setTargetAtTime(cut, at, g);
    this.hp.frequency.setTargetAtTime(L.hp, at, L.i === 7 ? 0.01 : g);
    this.master.gain.setTargetAtTime(out ? 0.3 : 0.85, at, 0.4);
    this.crackle.g.gain.setTargetAtTime(L.crackle ? 0.5 : 0, at, 0.3);
    this.riser.g.gain.setTargetAtTime(L.riser * 0.35, at, 0.05);
    this.riser.f.frequency.setTargetAtTime(300 * Math.pow(18, L.riser), at, 0.05);
    this.crowd.g.gain.setTargetAtTime(L.crowd && !out ? 0.12 : 0, at, L.crowd ? 0.25 : 0.6);
    if (this.cuePan) this.cuePan.pan.setTargetAtTime(L.cuePan, at, 0.1);
  };

  Engine.prototype.oneShot = function (n, at) {
    var ci = this.bar % 4;
    [function (e) { e.kick(at, 1); }, function (e) { e.clap(at); }, function (e) { e.hat(at, 0.12, true); },
     function (e) { e.stab(at, CHORDS[ci], 2400); }, function (e) { e.bass(at, ROOTS[ci]); },
     function (e) { e.scratch(at); }, function (e) { e.impact(at); }, function (e) { e.horn(at); }][n](this);
  };

  // ---- the live sound ----------------------------------------------------------------------------------------

  var api = { on: false, started: false };
  window.ClubAudio = api;
  var ctx = null, eng = null, timer = null, raf = 0;
  var t = -1.2, out = false, vel = 0, lastT = null, lastAt = 0, lastScratch = 0, jamming = false, jamStarted = false;
  var levelBuf = null, sent = { t: NaN, v: 0, o: false };
  var buttons = [], jamButtons = [];
  var pulseEls = [];

  function tick() {
    if (!eng) return;
    // after a pause, skip the steps that were missed instead of playing them all at once
    if (eng.next < ctx.currentTime - 0.05) eng.next = ctx.currentTime + 0.02;
    eng.schedule(ctx.currentTime + 0.12);
  }

  function frame() {
    raf = 0;
    if (!api.on || document.hidden) return;
    // the scroll speed decays when the scroll stops
    var now = performance.now();
    if (now - lastAt > 120) vel *= 0.85;
    // the filters only need new targets when something moved
    var tt = jamming ? 7.4 : t, oo = jamming ? false : out, vv = jamming ? 0 : vel;
    if (Math.abs(tt - sent.t) > 0.002 || Math.abs(vv - sent.v) > 0.05 || oo !== sent.o) {
      eng.follow(tt, vv, oo, ctx.currentTime);
      sent.t = tt; sent.v = vv; sent.o = oo;
    }
    var b = api.pulse().toFixed(3);
    for (var k = 0; k < pulseEls.length; k++) pulseEls[k].style.setProperty("--beat", b);
    raf = requestAnimationFrame(frame);
  }

  function wake() { if (!raf && api.on) raf = requestAnimationFrame(frame); }

  // Safari plays WebAudio through the ringer channel, which the silent switch mutes. A silent <audio>
  // element moves the page to the media channel.
  function unlockIOS() {
    try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch (e) {}
    try {
      var el = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=");
      el.loop = true; el.setAttribute("playsinline", ""); el.volume = 0.01;
      var p = el.play(); if (p && p.catch) p.catch(function () {});
    } catch (e) {}
  }

  function ensure() {
    if (ctx) return true;
    if (!AC) return false;
    unlockIOS();
    ctx = new AC();
    eng = new Engine(ctx, ctx.destination);
    eng.next = ctx.currentTime + 0.08;
    eng.follow(t, 0, out, ctx.currentTime, 0.01);
    levelBuf = new Uint8Array(eng.analyser.fftSize);
    api.started = true;
    return true;
  }

  function start() {
    if (!ensure()) return;
    if (ctx.state !== "running") ctx.resume();
    if (eng.next < ctx.currentTime) eng.next = ctx.currentTime + 0.05;
    sent.t = NaN;
    eng.master.gain.cancelScheduledValues(ctx.currentTime);
    eng.master.gain.setValueAtTime(0, ctx.currentTime);
    eng.master.gain.linearRampToValueAtTime(out ? 0.3 : 0.85, ctx.currentTime + 0.4);
    api.on = true;
    if (!timer) timer = setInterval(tick, 25);
    tick();
    wake();
    sync();
  }

  function stop() {
    if (!ctx) return;
    api.on = false;
    eng.master.gain.setTargetAtTime(0, ctx.currentTime, 0.08);
    setTimeout(function () { if (!api.on && ctx.state === "running") ctx.suspend(); }, 400);
    eng.crackle.g.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
    eng.crowd.g.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
    eng.riser.g.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
    clearInterval(timer); timer = null;
    sync();
  }

  function sync() {
    if (!api.on) { jamming = false; jamStarted = false; }
    document.documentElement.classList.toggle("sound-on", api.on);
    document.documentElement.classList.toggle("jam-on", jamming);
    jamButtons.forEach(function (b) {
      b.setAttribute("aria-pressed", jamming ? "true" : "false");
      var label = b.querySelector("[data-sound-label]");
      if (label) label.textContent = jamming ? label.getAttribute("data-on") : label.getAttribute("data-off");
    });
    if (!api.on) pulseEls.forEach(function (el) { el.style.setProperty("--beat", "0"); });
    buttons.forEach(function (b) {
      b.setAttribute("aria-pressed", api.on ? "true" : "false");
      var label = b.querySelector("[data-sound-label]");
      if (label) label.textContent = api.on ? label.getAttribute("data-on") : label.getAttribute("data-off");
    });
  }

  api.start = start;
  api.toggle = function () { if (api.on) stop(); else start(); };

  api.setJourney = function (tt) {
    var now = performance.now();
    if (lastT !== null) {
      var dt = (now - lastAt) / 1000;
      if (dt > 0.001) vel = vel * 0.7 + 0.3 * ((tt - lastT) / dt);
    }
    lastT = tt; lastAt = now; t = tt;
    // a fast scroll over the jog scratches
    if (api.on && t >= 4 && t < 5 && Math.abs(vel) > 1.1 && now - lastScratch > 240) {
      lastScratch = now;
      eng.scratch(ctx.currentTime + 0.01);
    }
    wake();
  };
  api.leaveJourney = function (gone) { out = !!gone; wake(); };

  // a pad plays on its own; it doesn't start the loop
  api.pad = function (n) {
    if (!ensure()) return;
    if (ctx.state !== "running") ctx.resume();
    if (!api.on) {
      var now = ctx.currentTime;
      [[eng.lp.frequency, 18000], [eng.hp.frequency, 20], [eng.master.gain, 0.85]].forEach(function (pv) {
        pv[0].cancelScheduledValues(now); pv[0].setValueAtTime(pv[1], now);
      });
      sent.t = NaN;
    }
    eng.oneShot(n, ctx.currentTime + 0.005);
    document.dispatchEvent(new CustomEvent("clubpad", { detail: n }));
  };

  api.jam = function (on) {
    if (on) {
      if (!api.on) { start(); jamStarted = true; }
      jamming = true;
    } else {
      jamming = false;
      if (jamStarted && api.on) stop();
      jamStarted = false;
    }
    sent.t = NaN;
    wake();
    sync();
  };

  api.pulse = function () {
    if (api.on && eng) {
      var now = ctx.currentTime, b = eng.beats, last = null;
      while (b.length > 1 && b[1][0] <= now) b.shift();
      if (b.length && b[0][0] <= now) last = b[0];
      return last ? Math.min(1, last[1] * Math.exp(-(now - last[0]) * 7)) : 0;
    }
    var ph = (performance.now() / 1000) % SPB;
    return 0.3 * Math.exp(-ph * 7);
  };

  api.level = function () {
    if (!api.on || !eng) return 0;
    eng.analyser.getByteTimeDomainData(levelBuf);
    var sum = 0;
    for (var k = 0; k < levelBuf.length; k++) { var v = (levelBuf[k] - 128) / 128; sum += v * v; }
    return Math.min(1, Math.sqrt(sum / levelBuf.length) * 3);
  };

  // Offline render of a scripted scroll, for tests and the demo video
  api.render = function (seconds, tAt, sampleRate) {
    var sr = sampleRate || 44100;
    var OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    var octx = new OAC(2, Math.ceil(seconds * sr), sr);
    var e = new Engine(octx, octx.destination);
    e.next = 0.05;
    var dt = 1 / 30, prevT = tAt(0);
    for (var s = 0; s < seconds; s += dt) {
      var tt = tAt(s), v = (tt - prevT) / dt;
      prevT = tt;
      e.follow(tt, v, tt > 7.7, s, 0.06);
      if (tt >= 4 && tt < 5 && Math.abs(v) > 1.1 && (!e._ls || s - e._ls > 0.24)) { e._ls = s; e.scratch(s + 0.01); }
      e.schedule(s + dt);
    }
    return octx.startRendering().then(function (buf) { return { buffer: buf, beats: e.beats }; });
  };

  document.addEventListener("visibilitychange", function () {
    if (!ctx) return;
    if (document.hidden) ctx.suspend();
    else if (api.on) { ctx.resume(); wake(); }
  });

  function init() {
    buttons = Array.prototype.slice.call(document.querySelectorAll("[data-sound]"));
    // the sound follows the moving journey, so it goes with it when motion is reduced
    var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!AC) {
      buttons.forEach(function (b) { b.hidden = true; });
      var jamEl = document.getElementById("jam");
      if (jamEl) jamEl.hidden = true;
      return;
    }
    buttons.forEach(function (b) { if (still) b.hidden = true; else b.addEventListener("click", api.toggle); });
    // the playable booth: eight pads (also keys 1-8), and the beat under them
    jamButtons = Array.prototype.slice.call(document.querySelectorAll("[data-jam]"));
    jamButtons.forEach(function (b) { b.addEventListener("click", function () { api.jam(!jamming); }); });
    var pads = Array.prototype.slice.call(document.querySelectorAll("[data-pad]"));
    function hit(n) {
      api.pad(n);
      var el = pads[n];
      if (el) { el.classList.remove("hit"); void el.offsetWidth; el.classList.add("hit"); }
    }
    pads.forEach(function (el) {
      el.addEventListener("pointerdown", function (e) { e.preventDefault(); hit(+el.getAttribute("data-pad")); });
      el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); hit(+el.getAttribute("data-pad")); } });
    });
    var jam = document.getElementById("jam"), jamVisible = false;
    if (jam && "IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        jamVisible = en[0].isIntersecting;
        if (!jamVisible && jamming) api.jam(false);
      }).observe(jam);
    }
    document.addEventListener("keydown", function (e) {
      if (!jamVisible || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      var n = "12345678".indexOf(e.key);
      if (n >= 0) hit(n);
    });
    document.addEventListener("clubpad3d", function (e) { hit(e.detail); });
    pulseEls = Array.prototype.slice.call(document.querySelectorAll("[data-pulse]"));
    sync();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
