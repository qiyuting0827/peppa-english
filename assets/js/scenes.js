/* Peppa English — original inline SVG scenes (400 x 240) */
(function () {
  'use strict';

  var P = {
    pink: '#F2A0B5',
    pinkDeep: '#E77F9B',
    pinkLight: '#F9C4D2',
    line: '#5B3A2E',
    dressRed: '#E14B5E',
    dressOrange: '#E98A3A',
    dressGreen: '#6FAF8F',
    dressBlue: '#5B9BD5',
    grass: '#8CCB6B',
    grassDark: '#6FB552',
    sky1: '#BFE3F7',
    sky2: '#E8F5FC'
  };

  function cloud(x, y, s, op) {
    s = s || 1;
    op = op === undefined ? 1 : op;
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" opacity="' + op + '">' +
      '<ellipse cx="0" cy="0" rx="22" ry="11" fill="#fff"/>' +
      '<ellipse cx="18" cy="-4" rx="16" ry="10" fill="#fff"/>' +
      '<ellipse cx="-18" cy="1" rx="14" ry="8" fill="#fff"/>' +
      '<ellipse cx="4" cy="-9" rx="14" ry="9" fill="#fff"/>' +
      '</g>';
  }

  function pig(x, y, s, dress, opt) {
    opt = opt || {};
    var glasses = opt.glasses ? (
      '<g fill="#fff" fill-opacity="0.35" stroke="' + P.line + '" stroke-width="1.6">' +
      '<circle cx="-8" cy="-49" r="5.2"/><circle cx="8" cy="-49" r="5.2"/>' +
      '<path d="M-2.8 -49 H2.8" fill="none"/>' +
      '</g>'
    ) : '';
    var lashes = opt.lashes ? (
      '<g stroke="' + P.line + '" stroke-width="1.5" stroke-linecap="round">' +
      '<path d="M-11 -55 l-3 -3"/><path d="M11 -55 l3 -3"/>' +
      '</g>'
    ) : '';
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
      '<ellipse cx="0" cy="1" rx="23" ry="5" fill="#3F6B34" opacity="0.16"/>' +
      /* legs */
      '<rect x="-12" y="-3" width="7" height="15" rx="3.5" fill="' + P.pinkDeep + '"/>' +
      '<rect x="5" y="-3" width="7" height="15" rx="3.5" fill="' + P.pinkDeep + '"/>' +
      '<ellipse cx="-8.5" cy="13" rx="6" ry="4" fill="#4B3A32"/>' +
      '<ellipse cx="8.5" cy="13" rx="6" ry="4" fill="#4B3A32"/>' +
      /* dress */
      '<path d="M-20 -20 Q0 -32 20 -20 L16 6 Q0 14 -16 6 Z" fill="' + dress + '"/>' +
      '<path d="M-16 4 Q0 11 16 4 L16 8 Q0 17 -16 8 Z" fill="#000" opacity="0.08"/>' +
      /* arms */
      '<path d="M-19 -15 Q-30 -6 -27 5" fill="none" stroke="' + P.pink + '" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M19 -15 Q30 -6 27 5" fill="none" stroke="' + P.pink + '" stroke-width="6" stroke-linecap="round"/>' +
      /* ears */
      '<path d="M-18 -58 Q-24 -74 -8 -68 Z" fill="' + P.pink + '"/>' +
      '<path d="M18 -58 Q24 -74 8 -68 Z" fill="' + P.pink + '"/>' +
      /* head */
      '<ellipse cx="0" cy="-44" rx="23" ry="20" fill="' + P.pink + '"/>' +
      '<path d="M-23 -44 Q-23 -64 0 -64 Q23 -64 23 -44" fill="' + P.pinkLight + '" opacity="0.45"/>' +
      /* eyes */
      '<ellipse cx="-8" cy="-49" rx="2.3" ry="3.1" fill="' + P.line + '"/>' +
      '<ellipse cx="8" cy="-49" rx="2.3" ry="3.1" fill="' + P.line + '"/>' +
      '<circle cx="-7.2" cy="-50" r="0.8" fill="#fff"/><circle cx="8.8" cy="-50" r="0.8" fill="#fff"/>' +
      lashes + glasses +
      /* snout */
      '<ellipse cx="0" cy="-34" rx="9" ry="5.5" fill="' + P.pinkDeep + '"/>' +
      '<ellipse cx="-2.8" cy="-34" rx="1.3" ry="1.7" fill="' + P.line + '"/>' +
      '<ellipse cx="2.8" cy="-34" rx="1.3" ry="1.7" fill="' + P.line + '"/>' +
      /* smile + blush */
      '<path d="M-6 -27 Q0 -22 6 -27" fill="none" stroke="' + P.line + '" stroke-width="1.7" stroke-linecap="round"/>' +
      '<ellipse cx="-15" cy="-34" rx="4" ry="2.4" fill="#E77F9B" opacity="0.55"/>' +
      '<ellipse cx="15" cy="-34" rx="4" ry="2.4" fill="#E77F9B" opacity="0.55"/>' +
      '</g>';
  }

  function family(y, opt) {
    opt = opt || {};
    return pig(108, y, 0.94, P.dressOrange, { glasses: true }) +
      pig(232, y, 0.9, P.dressGreen, { lashes: true }) +
      pig(170, y, 0.72, P.dressRed, { lashes: true }) +
      pig(290, y, 0.58, P.dressBlue, {});
  }

  function frame(key, skyTop, skyBottom, extraDefs, body) {
    var id = 'pe-sky-' + key;
    return '<svg class="scene-svg" viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Peppa Pig scene">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="' + skyTop + '"/><stop offset="1" stop-color="' + skyBottom + '"/>' +
      '</linearGradient>' + (extraDefs || '') + '</defs>' +
      '<rect width="400" height="240" fill="url(#' + id + ')"/>' +
      body +
      '</svg>';
  }

  var scenes = {};

  scenes.muddy = function () {
    return frame('muddy', '#9FD7F2', '#E8F7FF', '',
      '<circle cx="340" cy="42" r="24" fill="#FFD76A"/><circle cx="340" cy="42" r="16" fill="#FFE69A"/>' +
      cloud(72, 38, 1.05) + cloud(210, 26, 0.7, 0.9) +
      '<path d="M0 165 Q80 118 168 162 Q250 118 400 160 V240 H0 Z" fill="#A6D98A"/>' +
      '<path d="M0 188 Q120 150 240 188 Q330 160 400 184 V240 H0 Z" fill="' + P.grass + '"/>' +
      '<ellipse cx="80" cy="218" rx="52" ry="14" fill="#8A6242"/>' +
      '<ellipse cx="80" cy="215" rx="43" ry="10" fill="#6E4A31"/>' +
      '<ellipse cx="256" cy="228" rx="42" ry="11" fill="#8A6242"/>' +
      '<ellipse cx="256" cy="225" rx="34" ry="8" fill="#6E4A31"/>' +
      '<ellipse cx="342" cy="205" rx="30" ry="9" fill="#8A6242"/>' +
      '<ellipse cx="342" cy="203" rx="24" ry="6" fill="#6E4A31"/>' +
      '<g fill="#7A5138"><ellipse cx="62" cy="190" rx="4" ry="6"/><ellipse cx="104" cy="184" rx="3" ry="5"/><ellipse cx="280" cy="200" rx="4" ry="6"/><ellipse cx="320" cy="190" rx="3" ry="4"/></g>' +
      '<g fill="#8CCB6B"><path d="M32 224 q4 -18 10 -24 q-2 16 2 24 Z"/><path d="M368 228 q-5 -16 -11 -22 q3 14 0 22 Z"/></g>' +
      family(196, {}) +
      '<g transform="translate(168 186) rotate(-12)"><ellipse cx="0" cy="0" rx="6" ry="9" fill="#FFD34E"/><ellipse cx="0" cy="-7" rx="6" ry="3" fill="#F2B93B"/></g>'
    );
  };

  scenes.rain = function () {
    var drops = '';
    for (var i = 0; i < 24; i++) {
      var x = 12 + (i * 37) % 386;
      var y = 14 + (i * 53) % 150;
      drops += '<line x1="' + x + '" y1="' + y + '" x2="' + (x - 4) + '" y2="' + (y + 11) + '" stroke="#7FB4D8" stroke-width="2" stroke-linecap="round" opacity="0.65"/>';
    }
    return frame('rain', '#8FA9C8', '#DDE6EF', '',
      '<ellipse cx="90" cy="44" rx="54" ry="22" fill="#6F87A6" opacity="0.75"/>' +
      '<ellipse cx="132" cy="36" rx="38" ry="17" fill="#7C93AF" opacity="0.8"/>' +
      '<ellipse cx="300" cy="48" rx="60" ry="20" fill="#6F87A6" opacity="0.65"/>' +
      drops +
      '<path d="M0 172 Q90 138 180 170 Q270 140 400 168 V240 H0 Z" fill="#7DB268"/>' +
      '<path d="M0 194 Q140 166 280 196 Q350 180 400 192 V240 H0 Z" fill="#6DA559"/>' +
      '<ellipse cx="72" cy="220" rx="44" ry="10" fill="#8A9FB5"/><ellipse cx="72" cy="218" rx="34" ry="7" fill="#7190AA"/>' +
      '<ellipse cx="305" cy="226" rx="50" ry="11" fill="#8A9FB5"/><ellipse cx="305" cy="224" rx="38" ry="7" fill="#7190AA"/>' +
      /* umbrella */
      '<g transform="translate(202 142)">' +
      '<path d="M-56 8 Q0 -46 56 8 Q28 -2 0 8 Q-28 -2 -56 8 Z" fill="#E14B5E"/>' +
      '<path d="M0 -38 V42" stroke="#6B4A3A" stroke-width="3"/>' +
      '<path d="M0 42 q0 8 -9 8" fill="none" stroke="#6B4A3A" stroke-width="3" stroke-linecap="round"/>' +
      '</g>' +
      family(202, {}) +
      '<g transform="translate(322 190)"><ellipse cx="0" cy="0" rx="12" ry="6" fill="#FFD34E"/><path d="M-8 -4 Q0 -14 8 -4" fill="none" stroke="#F2B93B" stroke-width="3"/></g>'
    );
  };

  scenes.picnic = function () {
    return frame('picnic', '#A8DCF4', '#F0FAF6', '',
      '<circle cx="56" cy="40" r="22" fill="#FFD76A"/>' +
      cloud(142, 34, 0.9) + cloud(308, 54, 1.1, 0.95) +
      '<path d="M0 170 Q80 132 170 168 Q260 130 400 164 V240 H0 Z" fill="#9CD47E"/>' +
      '<path d="M0 196 Q120 170 250 198 Q330 182 400 194 V240 H0 Z" fill="' + P.grass + '"/>' +
      /* blanket */
      '<g transform="translate(80 204) skewX(-8)"><rect width="116" height="34" rx="6" fill="#FFF4E4"/>' +
      '<path d="M0 0 H116 V11 H0 Z M0 23 H116 V34 H0 Z" fill="#E86A6A" opacity="0.75"/>' +
      '<path d="M14 0 H26 V34 H14 Z M52 0 H64 V34 H52 Z M90 0 H102 V34 H90 Z" fill="#E86A6A" opacity="0.55"/></g>' +
      /* basket */
      '<g transform="translate(238 188)"><path d="M-22 0 h44 l-5 26 h-34 Z" fill="#C98B52"/>' +
      '<path d="M-18 2 q18 -24 36 0" fill="none" stroke="#A86E3B" stroke-width="4"/>' +
      '<path d="M-22 8 h44 M-20 17 h40" stroke="#A86E3B" stroke-width="2" opacity="0.7"/></g>' +
      /* balloons */
      '<g><path d="M300 76 q6 40 -8 68" fill="none" stroke="#8E6B57" stroke-width="1.4"/>' +
      '<ellipse cx="300" cy="64" rx="14" ry="17" fill="#F27C8D"/><path d="M296 80 l4 6 l4 -6" fill="#D95E70"/>' +
      '<path d="M334 84 q-2 30 8 48" fill="none" stroke="#8E6B57" stroke-width="1.4"/>' +
      '<ellipse cx="334" cy="72" rx="12" ry="15" fill="#FFD34E"/><path d="M330 86 l4 6 l4 -6" fill="#E8B93B"/></g>' +
      '<g transform="translate(60 188)"><ellipse cx="0" cy="0" rx="16" ry="7" fill="#FFF0D2"/><path d="M-12 -4 q12 -8 24 0" fill="#F2C14E"/></g>' +
      family(200, {}) +
      '<g fill="#F7E28A"><circle cx="42" cy="222" r="3"/><circle cx="150" cy="230" r="2.5"/><circle cx="362" cy="226" r="3"/></g>'
    );
  };

  scenes.beach = function () {
    return frame('beach', '#8FD3F1', '#FFF3DE', '',
      '<circle cx="330" cy="42" r="24" fill="#FFD76A"/>' +
      cloud(86, 42, 1) + cloud(222, 28, 0.7, 0.9) +
      '<rect y="132" width="400" height="52" fill="#5FB6D9"/>' +
      '<path d="M0 144 q25 -7 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 V184 H0 Z" fill="#7CCAE6" opacity="0.8"/>' +
      '<path d="M0 176 Q100 164 200 176 Q300 188 400 174 V240 H0 Z" fill="#F6DFAE"/>' +
      '<path d="M0 196 Q120 184 250 198 Q330 206 400 194 V240 H0 Z" fill="#EFD09A"/>' +
      /* sandcastle */
      '<g transform="translate(72 198)"><path d="M-24 0 h48 v22 h-48 Z" fill="#E0B979"/>' +
      '<path d="M-24 -6 h8 v6 h-8 Z M-8 -6 h8 v6 h-8 Z M8 -6 h8 v6 h-8 Z M24 -6 h8 v6 h-8 Z" fill="#E0B979"/>' +
      '<rect x="-5" y="-18" width="10" height="18" fill="#D3A967"/><rect x="-4" y="-26" width="1.6" height="10" fill="#8E6B57"/>' +
      '<path d="M-2 -26 h12 l-6 4 Z" fill="#E14B5E"/></g>' +
      '<g fill="#F7A8B8"><path d="M320 218 q8 -8 16 0 q-8 8 -16 0 Z"/></g>' +
      '<g fill="#FFF1CF"><path d="M348 206 q7 -7 14 0 q-7 7 -14 0 Z"/></g>' +
      family(200, {}) +
      '<g transform="translate(212 214)"><ellipse cx="0" cy="0" rx="11" ry="6" fill="#E76B5E"/><path d="M-8 2 l-4 3 M8 2 l4 3" stroke="#C94F43" stroke-width="2"/></g>'
    );
  };

  scenes.snow = function () {
    var flakes = '';
    for (var i = 0; i < 22; i++) {
      var x = 15 + (i * 41) % 372;
      var y = 18 + (i * 59) % 150;
      flakes += '<circle cx="' + x + '" cy="' + y + '" r="' + (1.6 + (i % 3) * 0.7) + '" fill="#fff" opacity="0.85"/>';
    }
    return frame('snow', '#B9D4EC', '#F7FBFF', '',
      '<path d="M0 168 Q90 128 180 166 Q270 130 400 164 V240 H0 Z" fill="#EAF4FC"/>' +
      '<path d="M0 194 Q120 174 240 198 Q330 184 400 192 V240 H0 Z" fill="#FFFDF7"/>' +
      /* trees */
      '<g stroke="#7A5138" stroke-width="4"><path d="M28 200 V154"/><path d="M372 202 V150"/></g>' +
      '<g fill="#8FBFA3"><path d="M28 158 l-16 22 h32 Z"/><path d="M28 144 l-13 20 h26 Z"/><path d="M372 156 l-16 22 h32 Z"/><path d="M372 140 l-13 20 h26 Z"/></g>' +
      /* snowman */
      '<g transform="translate(318 198)">' +
      '<circle cx="0" cy="-2" r="17" fill="#FFFDF7"/><circle cx="0" cy="-25" r="12" fill="#FFFDF7"/><circle cx="0" cy="-41" r="8" fill="#FFFDF7"/>' +
      '<circle cx="-3" cy="-43" r="1.4" fill="#4A342A"/><circle cx="3" cy="-43" r="1.4" fill="#4A342A"/>' +
      '<path d="M0 -40 l7 2 l-7 2 Z" fill="#F08A2E"/>' +
      '<path d="M-9 -52 q9 -8 18 0" fill="none" stroke="#4A342A" stroke-width="2"/>' +
      '<path d="M-13 -52 h26" stroke="#4A342A" stroke-width="2"/>' +
      '<path d="M-11 -22 h22" stroke="#E14B5E" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M8 -31 l18 -10" stroke="#7A5138" stroke-width="2.5"/></g>' +
      flakes +
      family(204, {}) +
      '<g transform="translate(110 218)"><ellipse cx="0" cy="0" rx="14" ry="4" fill="#B7D3E8"/><path d="M-12 0 h24" stroke="#7A5138" stroke-width="2"/></g>'
    );
  };

  scenes.night = function () {
    var stars = '';
    var pts = [[28, 28, 2.2], [64, 70, 1.5], [122, 26, 1.8], [170, 52, 1.4], [210, 22, 2], [258, 64, 1.6], [312, 34, 1.8], [360, 90, 1.5], [380, 28, 2.2], [92, 104, 1.4], [286, 104, 1.7], [148, 90, 1.3], [24, 120, 1.5], [344, 130, 1.3]];
    for (var i = 0; i < pts.length; i++) {
      stars += '<circle cx="' + pts[i][0] + '" cy="' + pts[i][1] + '" r="' + pts[i][2] + '" fill="#FFF3C4"/>';
    }
    return frame('night', '#2D3766', '#7C6D9E', '',
      stars +
      '<circle cx="322" cy="56" r="24" fill="#FFF2C4"/><circle cx="313" cy="49" r="24" fill="#3A4372"/>' +
      '<path d="M0 174 Q90 142 180 172 Q270 138 400 170 V240 H0 Z" fill="#3D4A72"/>' +
      '<path d="M0 202 Q120 176 240 202 Q330 188 400 198 V240 H0 Z" fill="#2F3A5C"/>' +
      /* little campfire */
      '<g transform="translate(52 212)"><ellipse cx="0" cy="6" rx="20" ry="5" fill="#202945"/>' +
      '<path d="M-10 4 q0 -12 10 -18 q10 6 10 18 Z" fill="#F08A2E"/>' +
      '<path d="M-5 4 q0 -8 5 -12 q5 4 5 12 Z" fill="#FFD34E"/></g>' +
      family(202, {}) +
      '<g transform="translate(202 122)">' +
      '<path d="M0 0 q-8 -16 0 -30 q8 14 0 30 Z" fill="#FFF3C4" opacity="0.9"/>' +
      '<path d="M-14 8 q-6 -10 0 -20 q6 10 0 20 Z" fill="#FFF3C4" opacity="0.55"/>' +
      '</g>'
    );
  };

  scenes.garden = function () {
    return frame('garden', '#A9DDF3', '#EEFAF1', '',
      '<circle cx="346" cy="42" r="22" fill="#FFD76A"/>' +
      cloud(90, 38, 0.95) + cloud(232, 26, 0.65, 0.85) +
      '<path d="M0 168 Q80 132 172 166 Q266 130 400 162 V240 H0 Z" fill="#9CD47E"/>' +
      '<path d="M0 194 Q120 172 250 198 Q330 184 400 194 V240 H0 Z" fill="' + P.grass + '"/>' +
      /* fence */
      '<g stroke="#F3E3C9" stroke-width="7" stroke-linecap="round">' +
      '<path d="M14 176 V132 M44 176 V132 M74 176 V132 M104 176 V132"/>' +
      '<path d="M6 144 H114 M6 164 H114"/></g>' +
      /* flowers */
      '<g transform="translate(300 196)"><path d="M0 0 V-34" stroke="#4F8B45" stroke-width="3"/>' +
      '<g fill="#F27C8D"><circle cx="-8" cy="-36" r="6"/><circle cx="8" cy="-36" r="6"/><circle cx="0" cy="-44" r="6"/><circle cx="0" cy="-28" r="6"/></g><circle cx="0" cy="-36" r="4" fill="#FFD34E"/></g>' +
      '<g transform="translate(344 202)"><path d="M0 0 V-28" stroke="#4F8B45" stroke-width="2.5"/>' +
      '<g fill="#B48BE0"><circle cx="-6" cy="-30" r="5"/><circle cx="6" cy="-30" r="5"/><circle cx="0" cy="-36" r="5"/></g><circle cx="0" cy="-30" r="3" fill="#FFD34E"/></g>' +
      /* carrots */
      '<g transform="translate(250 224)"><path d="M0 0 l-6 12 h12 Z" fill="#F08A2E"/><path d="M-2 -3 q-4 -12 2 -16 q6 4 2 16" fill="#4F8B45"/></g>' +
      '<g transform="translate(274 230)"><path d="M0 0 l-5 10 h10 Z" fill="#F08A2E"/><path d="M-2 -3 q-4 -10 2 -13 q5 3 2 13" fill="#4F8B45"/></g>' +
      /* watering can */
      '<g transform="translate(54 214)"><rect x="-12" y="-12" width="24" height="18" rx="4" fill="#5B9BD5"/>' +
      '<path d="M12 -6 q10 -2 12 8" fill="none" stroke="#5B9BD5" stroke-width="4"/>' +
      '<path d="M-12 -12 q6 -8 12 0" fill="none" stroke="#447FB5" stroke-width="3"/></g>' +
      family(200, {}) +
      '<g fill="#F7E28A"><circle cx="130" cy="228" r="2.6"/><circle cx="318" cy="230" r="2.4"/></g>'
    );
  };

  scenes.home = function () {
    return frame('home', '#A9DDF3', '#F6FBF4', '',
      '<circle cx="62" cy="42" r="21" fill="#FFD76A"/>' + cloud(180, 34, 0.9) + cloud(322, 52, 0.75, 0.9) +
      '<path d="M0 170 Q90 138 180 168 Q270 136 400 166 V240 H0 Z" fill="#9CD47E"/>' +
      '<path d="M0 198 Q120 178 250 200 Q330 188 400 196 V240 H0 Z" fill="' + P.grass + '"/>' +
      /* house */
      '<g transform="translate(108 130)">' +
      '<rect x="0" y="30" width="150" height="86" rx="5" fill="#FFF2DB"/>' +
      '<path d="M-12 34 L75 -18 L162 34 Z" fill="#D96B5F"/>' +
      '<path d="M-12 34 L75 -18 L75 6 L8 34 Z" fill="#C25A4F" opacity="0.55"/>' +
      '<rect x="62" y="72" width="26" height="44" rx="3" fill="#8B5E3C"/>' +
      '<circle cx="82" cy="95" r="2.4" fill="#FFD34E"/>' +
      '<rect x="20" y="52" width="28" height="26" rx="3" fill="#8FD3F1" stroke="#FFF2DB" stroke-width="4"/>' +
      '<rect x="104" y="52" width="28" height="26" rx="3" fill="#8FD3F1" stroke="#FFF2DB" stroke-width="4"/>' +
      '<path d="M34 52 V78 M20 65 H48 M118 52 V78 M104 65 H132" stroke="#FFF2DB" stroke-width="2"/>' +
      '<rect x="112" y="4" width="12" height="24" fill="#C25A4F"/><ellipse cx="118" cy="0" rx="8" ry="4" fill="#E8DCCB" opacity="0.8"/>' +
      '</g>' +
      '<path d="M0 232 Q80 220 120 226" fill="none" stroke="#E8DCCB" stroke-width="10" opacity="0.6"/>' +
      family(214, {}) +
      '<g transform="translate(354 208)"><circle cx="0" cy="0" r="12" fill="#6FB552"/><circle cx="10" cy="4" r="9" fill="#7DBE5D"/></g>'
    );
  };

  scenes.school = function () {
    return frame('school', '#A9DDF3', '#F6FBF4', '',
      '<circle cx="348" cy="38" r="21" fill="#FFD76A"/>' + cloud(84, 36, 1) + cloud(228, 24, 0.7, 0.85) +
      '<path d="M0 172 Q90 140 180 168 Q270 138 400 166 V240 H0 Z" fill="#9CD47E"/>' +
      '<path d="M0 198 Q120 176 250 200 Q330 186 400 196 V240 H0 Z" fill="' + P.grass + '"/>' +
      /* schoolhouse */
      '<g transform="translate(96 96)">' +
      '<rect x="0" y="40" width="206" height="86" rx="4" fill="#FFF1D9"/>' +
      '<path d="M-12 44 L103 -8 L218 44 Z" fill="#D96B5F"/>' +
      '<rect x="88" y="90" width="30" height="38" rx="3" fill="#8B5E3C"/>' +
      '<g fill="#8FD3F1" stroke="#FFF1D9" stroke-width="4"><rect x="20" y="62" width="28" height="24" rx="2"/><rect x="158" y="62" width="28" height="24" rx="2"/></g>' +
      '<path d="M34 62 V86 M20 74 H48 M172 62 V86 M158 74 H186" stroke="#FFF1D9" stroke-width="2"/>' +
      '<circle cx="103" cy="32" r="12" fill="#FFF8EC" stroke="#8B5E3C" stroke-width="2"/>' +
      '<path d="M103 32 V25 M103 32 L108 36" stroke="#8B5E3C" stroke-width="2" stroke-linecap="round"/>' +
      '<rect x="99" y="-34" width="2.5" height="30" fill="#8E6B57"/>' +
      '<path d="M101 -34 h24 l-6 7 l6 7 h-24 Z" fill="#28BEA0"/>' +
      '</g>' +
      family(216, {}) +
      '<g transform="translate(52 216)"><rect x="-16" y="-8" width="32" height="10" rx="3" fill="#E8B93B"/><path d="M-12 2 l-3 8 M12 2 l3 8" stroke="#8B5E3C" stroke-width="3"/></g>'
    );
  };

  scenes.boat = function () {
    return frame('boat', '#9FD9F4', '#EDF9FF', '',
      '<circle cx="330" cy="40" r="23" fill="#FFD76A"/>' + cloud(86, 36, 0.95) + cloud(214, 26, 0.65, 0.9) +
      '<path d="M0 156 Q100 132 200 156 Q300 178 400 152 V240 H0 Z" fill="#5FB6D9"/>' +
      '<path d="M0 174 q25 -8 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 V240 H0 Z" fill="#7CCAE6"/>' +
      '<path d="M0 198 q25 -7 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 V240 H0 Z" fill="#5AAFD2" opacity="0.8"/>' +
      /* boat */
      '<g transform="translate(196 168)">' +
      '<path d="M-58 0 h116 l-16 28 h-84 Z" fill="#C98B52"/>' +
      '<path d="M-50 6 h100 l-10 16 h-80 Z" fill="#E0A96E"/>' +
      '<path d="M0 -4 V-78" stroke="#8B5E3C" stroke-width="4"/>' +
      '<path d="M4 -78 Q54 -54 4 -20 Z" fill="#FFF8EC"/>' +
      '<path d="M-4 -70 Q-44 -50 -4 -22 Z" fill="#F6E6C8"/>' +
      '<path d="M4 -78 Q54 -54 4 -20" fill="none" stroke="#D8C3A0" stroke-width="1.5"/>' +
      '</g>' +
      /* family on boat */
      pig(170, 166, 0.55, P.dressRed, { lashes: true }) +
      pig(222, 166, 0.5, P.dressBlue, {}) +
      /* water sparkle */
      '<g stroke="#EAF8FF" stroke-width="2" stroke-linecap="round" opacity="0.8"><path d="M40 188 h16"/><path d="M80 210 h22"/><path d="M300 190 h18"/><path d="M336 214 h20"/><path d="M250 226 h16"/></g>'
    );
  };

  var fallback = scenes.garden;

  window.PE_SCENES = {
    keys: ['muddy', 'rain', 'picnic', 'beach', 'snow', 'night', 'garden', 'home', 'school', 'boat'],
    render: function (key) {
      return (scenes[key] || fallback)();
    }
  };
})();
