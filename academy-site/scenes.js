/*
 * Drawings for the opening journey ("מ-0 לעמדה"): eight stations from the student's shoes to the booth,
 * drawn on a 390 x 844 phone canvas and coloured through CSS variables (--g0..--g3, --acc, --acc2).
 * journey.js puts each one into its scene unless the scene has an AI image (data-src-p / data-src-l).
 *
 * focus: the round thing at the centre of each station, [x, y, r] on the 390 x 844 canvas.
 * journey.js centres it in the window and scales the drawing so roughly 2.4 r shows around it.
 */
(function () {
  "use strict";

  function svg(i, body) {
    return '<svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>' +
      '<radialGradient id="gl' + i + '"><stop offset="0" style="stop-color:var(--acc);stop-opacity:.9"/><stop offset="1" style="stop-color:var(--acc);stop-opacity:0"/></radialGradient>' +
      '<linearGradient id="sky' + i + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--acc);stop-opacity:.35"/><stop offset=".55" style="stop-color:var(--g0);stop-opacity:1"/></linearGradient>' +
      '</defs>' + body + '</svg>';
  }
  function circleRing(cx, cy, r, cls, sw, extra) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" class="' + cls + '" stroke-width="' + sw + '" ' + (extra || '') + '/>';
  }
  function shoe(flip) {
    var g = '<g' + (flip ? ' transform="translate(390,0) scale(-1,1)"' : '') + '>' +
      '<path class="shoe-sole" d="M112 850 C 98 762 100 670 122 630 C 140 600 178 602 188 638 C 197 676 193 762 190 850 Z"/>' +
      '<path class="shoe-up" d="M120 850 C 108 768 112 678 130 644 C 145 618 172 620 180 650 C 187 684 184 768 182 850 Z"/>' +
      '<path class="lace" d="M138 690 L168 684 M137 712 L170 706 M137 734 L170 728 M138 756 L170 750"/>' +
      '</g>';
    return g;
  }
  var DRAW = [
    function (i) { // shoes
      return svg(i,
        '<rect class="g0" width="390" height="844"/>' +
        '<rect class="g1" x="-10" y="0" width="410" height="54"/>' +
        '<path class="cable" d="M-20 262 C 80 330, 160 230, 260 300 S 400 362, 420 330"/>' +
        '<path class="cable" d="M410 560 C 330 600, 340 700, 262 780"/>' +
        '<path class="cable" d="M-20 600 C 40 560, 70 640, 96 700" />' +
        '<circle cx="195" cy="470" r="170" fill="url(#gl' + i + ')" opacity=".5"/>' +
        '<circle cx="195" cy="470" r="48" class="g2"/><circle cx="195" cy="470" r="36" class="ac"/><circle cx="195" cy="470" r="15" fill="#fff" opacity=".55"/>' +
        shoe(false) + shoe(true));
    },
    function (i) { // desk, gear off
      var b = '<rect class="g0" width="390" height="844"/>';
      for (var y = 40; y < 844; y += 46) b += '<path d="M0 ' + y + ' C 120 ' + (y + 8) + ', 260 ' + (y - 8) + ', 390 ' + (y + 4) + '" class="st2" stroke-width="1" fill="none" opacity=".45"/>';
      b += '<rect x="34" y="120" width="230" height="150" rx="10" class="g2"/><rect x="34" y="262" width="230" height="8" class="g3"/>' +
        '<path d="M282 250 C 282 150, 380 150, 380 230" class="st2" stroke-width="12" fill="none" stroke-linecap="round"/>' +
        '<circle cx="290" cy="252" r="30" class="g2"/><circle cx="375" cy="236" r="30" class="g2"/>' +
        '<rect x="18" y="360" width="354" height="330" rx="24" class="g1 st2" stroke-width="3"/>' +
        '<circle cx="105" cy="540" r="74" class="g0 st2" stroke-width="4"/><circle cx="105" cy="540" r="56" class="g1"/><circle cx="105" cy="540" r="20" class="g0"/>' +
        '<circle cx="285" cy="540" r="74" class="g0 st2" stroke-width="4"/><circle cx="285" cy="540" r="56" class="g1"/><circle cx="285" cy="540" r="20" class="g0"/>' +
        '<rect x="166" y="380" width="58" height="290" rx="6" class="g0"/>';
      [410, 448, 486].forEach(function (yy) { b += '<circle cx="182" cy="' + yy + '" r="8" class="g2"/><circle cx="208" cy="' + yy + '" r="8" class="g2"/>'; });
      b += '<path d="M182 540 V 640 M208 540 V 640" class="st2" stroke-width="3"/><rect x="174" y="600" width="16" height="10" rx="2" class="g3"/><rect x="200" y="570" width="16" height="10" rx="2" class="g3"/>' +
        '<circle cx="195" cy="374" r="7" class="g2"/>';
      [40, 72, 104, 136].forEach(function (x) { b += '<rect x="' + x + '" y="636" width="26" height="26" rx="4" class="g2"/><rect x="' + (x + 190) + '" y="636" width="26" height="26" rx="4" class="g2"/>'; });
      return svg(i, b);
    },
    function (i) { // power on
      var b = '<rect class="g1" width="390" height="844"/>' +
        '<path d="M0 230 H390 M0 760 H390" class="st0" stroke-width="3"/>' +
        circleRing(30, 210, 170, 'st2', 14, 'stroke-dasharray="3 6"') + '<circle cx="30" cy="210" r="150" class="g0"/>';
      for (var k = 0; k < 9; k++) b += '<circle cx="' + (150 + k * 24) + '" cy="300" r="5" class="ac" opacity="' + (0.35 + k * 0.07).toFixed(2) + '"/>';
      for (var p = 0; p < 4; p++) b += '<rect x="' + (52 + p * 74) + '" y="690" width="60" height="54" rx="8" class="ac" opacity="' + [0.95, 0.6, 0.35, 0.8][p] + '"/>';
      b += '<circle cx="195" cy="540" r="150" fill="url(#gl' + i + ')" opacity=".6"/>' +
        '<circle cx="195" cy="540" r="46" class="g0 stA" stroke-width="6"/>' +
        '<path d="M195 516 V 540" class="stA" stroke-width="6" stroke-linecap="round"/>' +
        '<path d="M180 526 A 22 22 0 1 0 210 526" class="stA" stroke-width="6" fill="none" stroke-linecap="round"/>' +
        '<text x="195" y="620" text-anchor="middle" class="lbl">POWER</text>';
      return svg(i, b);
    },
    function (i) { // headphones
      var b = '<rect class="g0" width="390" height="844"/>';
      [[60, 140, 40], [330, 210, 28], [80, 720, 34], [320, 760, 46], [190, 110, 20]].forEach(function (c) { b += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '" class="ac" opacity=".16"/>'; });
      b += '<path d="M48 520 C 48 150, 342 150, 342 520" class="st2" stroke-width="30" fill="none" stroke-linecap="round"/>' +
        '<path d="M52 500 C 56 180, 334 180, 338 500" class="st3" stroke-width="3" fill="none"/>' +
        '<circle cx="195" cy="470" r="152" class="g1"/><circle cx="195" cy="470" r="134" class="g2"/>' +
        '<circle cx="195" cy="470" r="114" class="g3"/><circle cx="195" cy="470" r="92" class="g0"/>' +
        '<path d="M260 360 A 134 134 0 0 1 328 470" class="stA" stroke-width="3" fill="none" opacity=".8"/>';
      return svg(i, b);
    },
    function (i) { // jog
      var b = '<rect class="g1" width="390" height="844"/>' +
        '<circle cx="195" cy="430" r="174" class="g0"/>' + circleRing(195, 430, 160, 'st2', 16, 'stroke-dasharray="3 5"') +
        '<circle cx="195" cy="430" r="140" class="g1"/>' + circleRing(195, 430, 118, 'st0', 1.5, 'opacity=".7"') + circleRing(195, 430, 96, 'st0', 1.5, 'opacity=".7"') +
        '<circle cx="195" cy="430" r="100" fill="url(#gl' + i + ')" opacity=".5"/>' +
        '<circle cx="195" cy="430" r="52" class="g0 stA" stroke-width="6"/>' +
        '<path d="M195 430 L 195 380" class="stA" stroke-width="5" stroke-linecap="round" transform="rotate(35 195 430)"/>';
      for (var p = 0; p < 4; p++) b += '<rect x="' + (40 + p * 82) + '" y="680" width="66" height="56" rx="8" class="ac" opacity="' + [0.9, 0.45, 0.7, 0.3][p] + '"/>';
      b += '<circle cx="70" cy="782" r="26" fill="none" class="stA" stroke-width="3"/><text x="70" y="787" text-anchor="middle" class="lbl">CUE</text>' +
        '<circle cx="320" cy="782" r="26" fill="none" class="st3" stroke-width="3"/><path d="M312 770 L 334 782 L 312 794 Z" class="g3"/>';
      return svg(i, b);
    },
    function (i) { // fader
      var b = '<rect class="g1" width="390" height="844"/>';
      [105, 195, 285].forEach(function (x, c) {
        b += '<circle cx="' + x + '" cy="140" r="18" class="g0 st2" stroke-width="2"/><circle cx="' + x + '" cy="196" r="18" class="g0 st2" stroke-width="2"/>';
        var lit = [9, 12, 6][c];
        for (var s = 0; s < 14; s++) {
          var on = s < lit;
          b += '<rect x="' + (x + 30) + '" y="' + (640 - s * 18) + '" width="12" height="13" rx="2" class="' + (on ? (s >= 11 ? 'ac2' : 'ac') : 'g0') + '" opacity="' + (on ? (0.5 + s * 0.035).toFixed(2) : 1) + '"/>';
        }
        b += '<rect x="' + (x - 4) + '" y="380" width="8" height="300" rx="4" class="g0"/>';
        var cy = [600, 525, 470][c];
        b += '<rect x="' + (x - 28) + '" y="' + cy + '" width="56" height="30" rx="4" class="g3"/><rect x="' + (x - 26) + '" y="' + (cy + 13) + '" width="52" height="4" class="ac"/>';
      });
      b += '<circle cx="195" cy="270" r="40" class="g0 stA" stroke-width="4"/><path d="M195 270 L 195 238" class="stA" stroke-width="5" stroke-linecap="round" transform="rotate(-30 195 270)"/>' +
        '<text x="195" y="330" text-anchor="middle" class="lbl">FILTER</text>' +
        '<rect x="90" y="752" width="210" height="10" rx="5" class="g0"/><rect x="170" y="740" width="40" height="34" rx="5" class="g3"/>';
      return svg(i, b);
    },
    function (i) { // eq knob
      var b = '<rect class="g1" width="390" height="844"/>';
      for (var k = 0; k <= 30; k++) {
        var a = (-135 + k * 9) * Math.PI / 180, on = k <= 12;
        var x1 = 195 + Math.sin(a) * 172, y1 = 470 - Math.cos(a) * 172, x2 = 195 + Math.sin(a) * 190, y2 = 470 - Math.cos(a) * 190;
        b += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" class="' + (on ? 'stA' : 'st3') + '" stroke-width="4" stroke-linecap="round"/>';
      }
      b += '<circle cx="195" cy="470" r="142" class="g0"/>' + circleRing(195, 470, 128, 'st2', 14, 'stroke-dasharray="2 4"') +
        '<circle cx="195" cy="470" r="98" class="g2"/><circle cx="195" cy="470" r="70" class="g3"/>' +
        '<path d="M195 470 L 195 392" class="stA" stroke-width="8" stroke-linecap="round" transform="rotate(-40 195 470)"/>' +
        '<text x="195" y="700" text-anchor="middle" class="lbl">LOW</text><text x="60" y="660" class="lbl">-</text><text x="322" y="660" class="lbl">+</text>';
      return svg(i, b);
    },
    function (i) { // crowd
      var b = '<rect width="390" height="844" fill="url(#sky' + i + ')"/><rect class="g0" width="390" height="844" opacity=".35"/>';
      [[60, -260], [150, -80], [240, 80], [330, 260]].forEach(function (bm) { b += '<polygon points="' + bm[0] + ',0 ' + (bm[0] + 18) + ',0 ' + (195 + bm[1]) + ',700 ' + (195 + bm[1] - 90) + ',700" class="ac" opacity=".12"/>'; });
      b += '<ellipse cx="195" cy="420" rx="260" ry="120" fill="#fff" opacity=".06"/>';
      var seed = 7;
      function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
      for (var x = -10; x < 400; x += 24) {
        var hy = 600 + rnd() * 40;
        b += '<circle cx="' + x + '" cy="' + hy.toFixed(0) + '" r="15" fill="#050505"/><rect x="' + (x - 22) + '" y="' + (hy + 12).toFixed(0) + '" width="44" height="260" rx="18" fill="#050505"/>';
        if (rnd() > 0.45) { var ax = x + (rnd() > 0.5 ? 14 : -14); b += '<path d="M' + x + ' ' + (hy + 20).toFixed(0) + ' L ' + ax + ' ' + (hy - 70 - rnd() * 40).toFixed(0) + '" stroke="#050505" stroke-width="9" stroke-linecap="round"/>'; }
      }
      b += '<rect y="772" width="390" height="72" class="g1"/>';
      for (var l = 0; l < 10; l++) b += '<rect x="' + (24 + l * 36) + '" y="790" width="18" height="6" rx="2" class="ac" opacity="' + (0.3 + (l % 3) * 0.3).toFixed(1) + '"/>';
      return svg(i, b);
    }
  ];

  window.ACADEMY_SCENES = {
    width: 390,
    height: 844,
    draw: DRAW,
    focus: [[195, 470, 46], [195, 500, 110], [195, 540, 46], [195, 470, 92], [195, 430, 52], [195, 270, 40], [195, 470, 70], [195, 430, 90]]
  };
})();
