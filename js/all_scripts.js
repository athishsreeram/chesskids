    'use strict';
    const PM = { wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙', bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟' };
    const PN = { K: 'King', Q: 'Queen', R: 'Rook', B: 'Bishop', N: 'Knight', P: 'Pawn' };
    const VALID_CODES = ['CHESS2024', 'PARENT100', 'KIPVIP99', 'EARLYBIRD', 'CHESSKIDS'];
    let ST = { stars: 0, streak: 0, lastDate: null, mods: { puzzle: 0, bot: 0, threat: 0, dojo: 0, capture: 0, defend: 0, blunder: 0, patterns: 0, combo: 0, endcoach: 0, opening: 0, eval: 0, pawn: 0, ladder: 0, fork: 0 }, premium: false, user: { name: '', age: '', level: '' }, onboarded: false };
    let resultNext = null;

    // ── ONBOARDING ──
    let ob_age = '', ob_level = '';
    function ob_next(step) {
      if (step === 1) {
        const name = document.getElementById('ob-name-input').value.trim();
        if (!name) { showToast('Tell me your name! 😊'); return }
        ST.user.name = name;
        document.getElementById('ob-age-title').textContent = 'How old are you, ' + name + '?';
      }
      if (step === 2) {
        if (!ob_age) { showToast('Pick your age group! 🎂'); return }
      }
      document.getElementById('ob-' + step).classList.remove('ob-active');
      document.getElementById('ob-' + (step + 1)).classList.add('ob-active');
    }
    function ob_setAge(age, btn) { ob_age = age; document.querySelectorAll('#ob-2 .ob-choice').forEach(b => b.classList.remove('selected')); btn.classList.add('selected') }
    function ob_setLevel(level, btn) { ob_level = level; document.querySelectorAll('#ob-3 .ob-choice').forEach(b => b.classList.remove('selected')); btn.classList.add('selected') }
    function ob_finish() {
      if (!ob_age) { showToast('Pick your age group! 🎂'); return }
      if (!ob_level) { showToast('Pick your chess level! ♟'); return }
      ST.user.age = ob_age; ST.user.level = ob_level; ST.onboarded = true; save();
      document.getElementById('onboarding').style.display = 'none'; updateHomePersonalization();
      const msgs = { beginner: 'Start with Piece Dojo!', some: 'Try Play vs Bot!', experienced: 'Tackle the Puzzle Trainer!' };
      say('Welcome ' + ST.user.name + '! ' + msgs[ob_level]); showToast('Welcome, ' + ST.user.name + '! 🎉');
    }
    function updateHomePersonalization() {
      const el = document.getElementById('hero-name'); if (el) el.textContent = ST.user.name || 'friend';
      const lv = document.getElementById('h-level'); if (lv) lv.textContent = { beginner: 'Beginner', some: 'Explorer', experienced: 'Improver', '': '—' }[ST.user.level] || '—';
      const msgs = {
        beginner: "Hi <strong>" + ST.user.name + "</strong>! Start with <strong>Piece Dojo</strong> to learn how every piece moves! 🐴",
        some: "Welcome <strong>" + ST.user.name + "</strong>! Try <strong>Play vs Bot</strong> to test your skills! 🤖",
        experienced: "Ready to level up, <strong>" + ST.user.name + "</strong>? Tackle the <strong>Puzzle Trainer</strong>! 🎯",
        "": "Hi! I'm <strong>Kip</strong>! Pick any game to start learning chess! 🎉"
      };
      const kipEl = document.getElementById('home-kip-msg'); if (kipEl) kipEl.innerHTML = msgs[ST.user.level] || msgs[''];
      updatePremiumUI();
    }
    function updatePremiumUI() {
      const banner = document.getElementById('premium-banner'); const navBtn = document.getElementById('nav-premium-btn');
      const l2 = document.getElementById('step-l2'), l3 = document.getElementById('step-l3');
      if (ST.premium) {
        if (banner) banner.style.display = 'none'; if (navBtn) navBtn.style.display = 'none';
        if (l2) {
          l2.classList.remove('path-locked'); l2.onclick = () => { tabTo('s-curriculum', 'tab-curr'); buildCurriculum() };
          const t2 = document.getElementById('step-l2-tag'), i2 = document.getElementById('step-l2-icon');
          if (t2) { t2.className = 'ps-tag ps-tag-free'; t2.textContent = 'UNLOCKED' }
          if (i2) { i2.innerHTML = '▶'; i2.style.color = 'var(--purple)' }
        }
        if (l3) {
          l3.classList.remove('path-locked'); l3.onclick = () => { tabTo('s-curriculum', 'tab-curr'); buildCurriculum() };
          const t3 = document.getElementById('step-l3-tag'), i3 = document.getElementById('step-l3-icon');
          if (t3) { t3.className = 'ps-tag ps-tag-free'; t3.textContent = 'UNLOCKED' }
          if (i3) { i3.innerHTML = '▶'; i3.style.color = 'var(--purple)' }
        }
      } else {
        if (banner) banner.style.display = ''; if (navBtn) navBtn.style.display = '';
        if (l2) {
          l2.classList.add('path-locked'); l2.onclick = () => requirePremium('s-curriculum');
          const t2 = document.getElementById('step-l2-tag'), i2 = document.getElementById('step-l2-icon');
          if (t2) { t2.className = 'ps-tag ps-tag-pro'; t2.textContent = '👑 PRO' }
          if (i2) { i2.innerHTML = '🔒'; i2.style.color = '#ddd' }
        }
        if (l3) {
          l3.classList.add('path-locked'); l3.onclick = () => requirePremium('s-curriculum');
          const t3 = document.getElementById('step-l3-tag'), i3 = document.getElementById('step-l3-icon');
          if (t3) { t3.className = 'ps-tag ps-tag-pro'; t3.textContent = '👑 PRO' }
          if (i3) { i3.innerHTML = '🔒'; i3.style.color = '#ddd' }
        }
      }
    }

    // ── PREMIUM ──
    let _pendingScreen = null;
    function requirePremium(screenId) { if (ST.premium) { goScreen(screenId); return } showPremiumGate(screenId) }
    function showPremiumGate(screenId) { _pendingScreen = screenId || null; document.getElementById('premium-gate').classList.add('show'); document.getElementById('pg-code-msg').textContent = ''; document.getElementById('pg-code-input').value = '' }
    function closePremiumGate() { document.getElementById('premium-gate').classList.remove('show'); _pendingScreen = null }
    function redeemCode() {
      const code = document.getElementById('pg-code-input').value.trim().toUpperCase(); const msg = document.getElementById('pg-code-msg');
      if (!code) { msg.style.color = '#dc2626'; msg.textContent = 'Enter a code first!'; return }
      if (VALID_CODES.includes(code)) { ST.premium = true; save(); msg.style.color = '#16a34a'; msg.textContent = '✅ Premium unlocked!'; confetti(80); sWin(); setTimeout(() => { closePremiumGate(); updatePremiumUI(); if (_pendingScreen) goScreen(_pendingScreen) }, 1200) }
      else { msg.style.color = '#dc2626'; msg.textContent = '❌ Invalid code. Check your email.'; sBad() }
    }

    // ── STORAGE ──
    function save() { try { localStorage.setItem('ck_w1', JSON.stringify(ST)) } catch (e) { } }
    function load() {
      try { const r = localStorage.getItem('ck_w1'); if (r) Object.assign(ST, JSON.parse(r)) } catch (e) { }
      if (!ST.mods) ST.mods = { puzzle: 0, bot: 0, threat: 0, dojo: 0, capture: 0, defend: 0, blunder: 0, patterns: 0, combo: 0, endcoach: 0, opening: 0, eval: 0, pawn: 0, ladder: 0, fork: 0 };
      if (!ST.user) ST.user = { name: '', age: '', level: '' };
      updateStarDisplay();
    }
    function earn(n, mod) { ST.stars += n; if (mod) ST.mods[mod] = (ST.mods[mod] || 0) + n; ST.lastDate = new Date().toDateString(); save(); updateStarDisplay(); showToast('⭐ +' + n + ' stars!') }
    function earnStars(n, mod) { earn(n, mod) }
    function updateStarDisplay() {
      ['nav-star-count', 'h-stars'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = ST.stars });
      const h = document.getElementById('h-streak'); if (h) h.textContent = (ST.streak || 0) + '🔥';
      const ps = document.getElementById('puz-stars'); if (ps) ps.textContent = ST.mods.puzzle || 0;
      const ds = document.getElementById('dojo-stars'); if (ds) ds.textContent = ST.mods.dojo || 0;
      const ts = document.getElementById('thr-stars'); if (ts) ts.textContent = ST.mods.threat || 0;
      const cs = document.getElementById('cap-stars'); if (cs) cs.textContent = ST.mods.capture || 0;
      document.querySelectorAll('.mc-star-val').forEach(el => { const mod = el.dataset.mod; if (mod) el.textContent = ST.mods[mod] || 0 });
    }
    function resetProgress() { ST = { stars: 0, streak: 0, lastDate: null, mods: { puzzle: 0, bot: 0, threat: 0, dojo: 0, capture: 0, defend: 0, blunder: 0, patterns: 0, combo: 0, endcoach: 0, opening: 0, eval: 0, pawn: 0, ladder: 0, fork: 0 }, premium: ST.premium, user: ST.user, onboarded: ST.onboarded }; save(); updateStarDisplay(); showToast('Progress reset!') }

    // ── NAVIGATION ──
    function goScreen(id) {
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      const el = document.getElementById(id); if (el) el.classList.add('active'); window.scrollTo(0, 0);
      if (id === 's-puzzle') initPuzzle(); if (id === 's-threat') initThreat(); if (id === 's-dojo') initDojo();
      if (id === 's-capture') initCapture(); if (id === 's-defend') initDefend(); if (id === 's-curriculum') buildCurriculum();
      if (id === 's-progress') renderProgress(); if (id === 's-blunder') initBlunder(); if (id === 's-patterns') initPatterns();
      if (id === 's-combo') initCombo(); if (id === 's-endcoach') initEndCoach(); if (id === 's-opening') initOpening();
      if (id === 's-eval') initEval(); if (id === 's-pawn') initPawn(); if (id === 's-defend-check') initDefendCheck();
      if (id === 's-ladder-method') initLadder(); if (id === 's-fork-train') initForkTrain();
      if (id === 's-home') updateHomePersonalization();
    }
    function gs(id) { goScreen(id) }
    function tabTo(screenId, tabId) { document.querySelectorAll('.tab').forEach(t => t.classList.remove('on')); const t = document.getElementById(tabId); if (t) t.classList.add('on'); goScreen(screenId) }

    // ── BOARD HELPERS ──
    function parseFEN(fen) { const b = Array.from({ length: 8 }, () => Array(8).fill(null)); fen.split(' ')[0].split('/').forEach((row, ri) => { let fi = 0; for (const ch of row) { if (/\d/.test(ch)) { fi += +ch } else { b[7 - ri][fi] = (ch === ch.toUpperCase() ? 'w' : 'b') + ch.toUpperCase(); fi++ } } }); return b }
    function drawBoard(boardId, fen, opts) {
      const c = document.getElementById(boardId); if (!c) return; c.innerHTML = ''; opts = opts || {};
      const bd = typeof fen === 'string' ? parseFEN(fen) : fen;
      const green = opts.green || opts.g || []; const yellow = opts.yellow || opts.y || []; const red = opts.red || opts.r || []; const blue = opts.blue || opts.b_ || [];
      for (let r = 7; r >= 0; r--) {
        for (let f = 0; f < 8; f++) {
          const el = document.createElement('div'); el.className = 'sq ' + ((r + f) % 2 === 0 ? 'lt' : 'dk');
          const sn = String.fromCharCode(97 + f) + (r + 1); el.dataset.sq = sn; el.dataset.r = r; el.dataset.f = f;
          if (f === 0) { const l = document.createElement('span'); l.className = 'coord-r'; l.textContent = r + 1; el.appendChild(l) }
          if (r === 0) { const l = document.createElement('span'); l.className = 'coord-f'; l.textContent = String.fromCharCode(97 + f); el.appendChild(l) }
          const p = bd[r][f];
          if (p && PM[p]) { const sp = document.createElement('span'); sp.className = 'piece ' + (p[0] === 'w' ? 'piece-w' : 'piece-b'); sp.textContent = PM[p]; el.appendChild(sp) }
          if (opts.dot && opts.dot.includes(sn)) { el.classList.add('sq-dot'); if (p) el.classList.add('sq-occ') }
          if (green.includes(sn)) el.classList.add('sq-green'); if (yellow.includes(sn)) el.classList.add('sq-yellow');
          if (red.includes(sn)) el.classList.add('sq-red'); if (blue.includes(sn)) el.classList.add('sq-blue');
          if (opts.sel && opts.sel === sn) el.classList.add('sq-sel');
          if (opts.click) el.addEventListener('click', () => opts.click(sn, r, f, el));
          c.appendChild(el);
        }
      }
    }
    function sqName(r, f) { return String.fromCharCode(97 + f) + (r + 1) }
    function sqRF(sn) { return { r: parseInt(sn[1]) - 1, f: sn.charCodeAt(0) - 97 } }
    function srf(sn) { return sqRF(sn) }

    // ── CHESS LOGIC ──
    function getLegalMoves(bd, r, f) {
      const p = bd[r][f]; if (!p) return []; const col = p[0], type = p[1], enemy = col === 'w' ? 'b' : 'w'; const moves = [];
      const addIf = (tr, tf) => { if (tr < 0 || tr > 7 || tf < 0 || tf > 7) return false; const tp = bd[tr][tf]; if (tp && tp[0] === col) return false; moves.push(sqName(tr, tf)); return !tp };
      const slide = (dr, df) => { let cr = r + dr, cf = f + df; while (cr >= 0 && cr < 8 && cf >= 0 && cf < 8) { const tp = bd[cr][cf]; if (tp && tp[0] === col) break; moves.push(sqName(cr, cf)); if (tp) break; cr += dr; cf += df } };
      if (type === 'R') { [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, df]) => slide(dr, df)) }
      else if (type === 'B') { [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([dr, df]) => slide(dr, df)) }
      else if (type === 'Q') { [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([dr, df]) => slide(dr, df)) }
      else if (type === 'N') { [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]].forEach(([dr, df]) => addIf(r + dr, f + df)) }
      else if (type === 'K') { [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]].forEach(([dr, df]) => addIf(r + dr, f + df)) }
      else if (type === 'P') { const dir = col === 'w' ? 1 : -1, start = col === 'w' ? 1 : 6; if (!bd[r + dir]?.[f]) moves.push(sqName(r + dir, f)); if (r === start && !bd[r + dir]?.[f] && !bd[r + 2 * dir]?.[f]) moves.push(sqName(r + 2 * dir, f));[-1, 1].forEach(df => { const tp = bd[r + dir]?.[f + df]; if (tp && tp[0] === enemy) moves.push(sqName(r + dir, f + df)) }) }
      return moves;
    }
    function isInCheck(bd, col) {
      let kr = -1, kf = -1; for (let r = 0; r < 8; r++)for (let f = 0; f < 8; f++) { if (bd[r][f] === col + 'K') { kr = r; kf = f } } if (kr === -1) return false;
      const enemy = col === 'w' ? 'b' : 'w'; for (let r = 0; r < 8; r++)for (let f = 0; f < 8; f++) { if (bd[r][f] && bd[r][f][0] === enemy) { if (getLegalMoves(bd, r, f).includes(sqName(kr, kf))) return true } } return false;
    }
    function getLegalMovesFiltered(bd, r, f) {
      const moves = getLegalMoves(bd, r, f); const col = bd[r][f]?.[0]; if (!col) return [];
      return moves.filter(sq => { const { r: tr, f: tf } = sqRF(sq); const nb = bd.map(row => [...row]); nb[tr][tf] = nb[r][f]; nb[r][f] = null; return !isInCheck(nb, col) });
    }
    function getLegalF(bd, r, f) { return getLegalMovesFiltered(bd, r, f) }
    function applyMove(bd, fr, ff, tr, tf) { const nb = bd.map(row => [...row]); const p = nb[fr][ff]; nb[tr][tf] = p; nb[fr][ff] = null; if (p === 'wP' && tr === 7) nb[tr][tf] = 'wQ'; if (p === 'bP' && tr === 0) nb[tr][tf] = 'bQ'; return nb }
    function getAllMoves(bd, col) { const moves = []; for (let r = 0; r < 8; r++)for (let f = 0; f < 8; f++) { if (bd[r][f] && bd[r][f][0] === col) getLegalMovesFiltered(bd, r, f).forEach(sq => moves.push({ fr: r, ff: f, to: sq })) } return moves }
    function isCheckmate(bd, col) { return getAllMoves(bd, col).length === 0 && isInCheck(bd, col) }
    function isStalemate(bd, col) { return getAllMoves(bd, col).length === 0 && !isInCheck(bd, col) }
    function evalBoard(bd) { const vals = { K: 0, Q: 9, R: 5, B: 3, N: 3, P: 1 }; let s = 0; for (let r = 0; r < 8; r++)for (let f = 0; f < 8; f++) { const p = bd[r][f]; if (p) { const v = vals[p[1]] || 0; s += p[0] === 'w' ? v : -v } } return s }
    function botMove(bd, diff) {
      const moves = getAllMoves(bd, 'b'); if (!moves.length) return null;
      if (diff === 0) return moves[Math.random() * moves.length | 0];
      if (diff === 1) { const caps = moves.filter(m => { const { r, f } = sqRF(m.to); return bd[r][f] && bd[r][f][0] === 'w' }); if (caps.length && Math.random() > .3) return caps[Math.random() * caps.length | 0]; return moves[Math.random() * moves.length | 0] }
      let best = null, bestScore = Infinity; const sample = moves.length > 20 ? moves.sort(() => Math.random() - .5).slice(0, 20) : moves;
      sample.forEach(m => { const { r, f } = sqRF(m.to); const nb = applyMove(bd, m.fr, m.ff, r, f); const sc = evalBoard(nb); if (sc < bestScore) { bestScore = sc; best = m } }); return best || moves[0];
    }

    // ── AUDIO ──
    let AC = null;
    function tone(f, t, d, dl) { try { if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)(); const o = AC.createOscillator(), g = AC.createGain(); o.connect(g); g.connect(AC.destination); o.type = t || 'sine'; o.frequency.value = f; g.gain.setValueAtTime(.25, AC.currentTime + (dl || 0)); g.gain.exponentialRampToValueAtTime(.001, AC.currentTime + (dl || 0) + (d || .18)); o.start(AC.currentTime + (dl || 0)); o.stop(AC.currentTime + (dl || 0) + (d || .18)) } catch (e) { } }
    const sOk = () => { tone(523, 'sine', .1); tone(659, 'sine', .1, .1); tone(784, 'sine', .15, .2) };
    const sBad = () => { tone(280, 'sawtooth', .18); tone(220, 'sawtooth', .12, .15) };
    const sWin = () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, 'sine', .2, i * .13)) };
    const sTick = () => tone(440, 'sine', .06);

    // ── FX ──
    function confetti(n = 60) { const c = ['#7C5CBF', '#FFD93D', '#52C41A', '#FF6B6B', '#48CAE4', '#F5A623']; for (let i = 0; i < n; i++) { const e = document.createElement('div'); e.className = 'cp'; e.style.cssText = `left:${Math.random() * 100}vw;top:-20px;background:${c[Math.random() * c.length | 0]};width:${6 + Math.random() * 8}px;height:${6 + Math.random() * 8}px;border-radius:${Math.random() > .5 ? '50%' : '3px'};animation-duration:${1.5 + Math.random() * 2}s;animation-delay:${Math.random() * .5}s`; document.body.appendChild(e); e.addEventListener('animationend', () => e.remove()) } }
    let _tt = null;
    function showToast(msg) { const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(_tt); _tt = setTimeout(() => t.classList.remove('show'), 2200) }
    function say(text) { try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.rate = .88; u.pitch = 1.15; speechSynthesis.speak(u) } catch (e) { } }
    function showResult(emoji, title, sub, onAgain) { document.getElementById('r-emoji').textContent = emoji; document.getElementById('r-title').textContent = title; document.getElementById('r-sub').textContent = sub; document.getElementById('rover').classList.add('show'); resultNext = onAgain }
    function closeResult(again) { document.getElementById('rover').classList.remove('show'); if (again && resultNext) resultNext(); else goScreen('s-home') }
    function showFeedback(id, msg, type) { const el = document.getElementById(id); if (!el) return; el.textContent = msg; el.className = 'feedback-box show fb-' + (type || 'ok') }
    function hideFeedback(id) { const el = document.getElementById(id); if (el) el.classList.remove('show') }
    function showFB(id, msg, type) { const el = document.getElementById(id); if (!el) return; el.textContent = msg; el.className = 'fb show fb-' + (type || 'ok') }
    function hideFB(id) { const el = document.getElementById(id); if (el) el.classList.remove('show') }

    // ── MODULE A: PUZZLE TRAINER ──
    const PUZZLES = [
      { id: 'cm1', cat: 'mate1', fen: '6k1/5Q2/6K1/8/8/8/8/8 w - - 0 1', task: 'White to move — CHECKMATE in one!', hint: 'Move the Queen close to the King.', solution: ['f7f8', 'f7g7', 'f7h7'], wrongMsg: 'King escaped! No escape squares needed.', okMsg: 'Checkmate! ♛', turn: 'w' },
      { id: 'cm2', cat: 'mate1', fen: '8/8/8/8/8/8/1R6/k1K5 w - - 0 1', task: 'Rook to give checkmate! King is cornered!', hint: 'Rook on B2 slides to A2.', solution: ['b2a2'], wrongMsg: 'Not checkmate! Try Rook to A2.', okMsg: 'Rook to A2 is checkmate! 🏰', turn: 'w' },
      { id: 'cm3', cat: 'mate1', fen: '5rk1/5ppp/8/8/8/8/8/R5K1 w - - 0 1', task: 'Back rank checkmate! Move the Rook!', hint: 'Slide the Rook all the way to A8!', solution: ['a1a8'], wrongMsg: 'The King still has escape squares!', okMsg: 'Back Rank Mate! 🏆', turn: 'w' },
      { id: 'f1', cat: 'fork', fen: '3k4/8/8/8/8/2N5/8/3K4 w - - 0 1', task: 'Knight Fork! Find the square attacking BOTH the King and another piece!', hint: 'Knights move in L-shapes.', solution: ['c3e4', 'c3b5', 'c3a4', 'c3d5'], wrongMsg: 'Does not attack both pieces!', okMsg: 'Fork! Knight attacks two at once! 🍴', turn: 'w' },
      { id: 'h1', cat: 'hang', fen: '3k4/3q4/8/8/8/3R4/8/3K4 w - - 0 1', task: 'A FREE piece to capture! Find it!', hint: 'The Black Queen on D7 is unprotected.', solution: ['d3d7'], wrongMsg: 'Look for an undefended enemy piece!', okMsg: 'Free Queen captured! 💰', turn: 'w' },
      { id: 'e1', cat: 'escape', fen: '4K3/8/8/8/8/8/8/4r3 w - - 0 1', task: 'King is in CHECK! Move to safety!', hint: 'The E-file is dangerous! Move sideways.', solution: ['e8d7', 'e8f7', 'e8d8', 'e8f8'], wrongMsg: 'King still in danger!', okMsg: 'King escaped! 👑', turn: 'w' },
      { id: 'sk1', cat: 'skewer', fen: '8/3k4/8/8/8/8/8/3R3K w - - 0 1', task: 'Skewer! Attack the King — win the piece behind!', hint: 'Rook up the D-file to attack King on D7!', solution: ['d1d7', 'd1d8'], wrongMsg: 'A skewer attacks the MORE valuable piece first!', okMsg: 'Skewer! 🏰', turn: 'w' },
    ];
    const PCATS = [{ id: 'all', label: 'All Puzzles' }, { id: 'mate1', label: '☠️ Checkmate' }, { id: 'fork', label: '🍴 Fork' }, { id: 'hang', label: '💰 Free Piece' }, { id: 'escape', label: '🏃 Escape' }, { id: 'skewer', label: '⚔️ Skewer' }];
    let puzState = { cat: 'all', idx: 0, sel: null, solved: false, board: null };
    function initPuzzle() {
      const nav = document.getElementById('puz-cats'); if (nav.children.length > 0) return;
      PCATS.forEach(cat => { const b = document.createElement('button'); b.className = 'pcat' + (cat.id === 'all' ? ' on' : ''); b.textContent = cat.label; b.onclick = () => { document.querySelectorAll('.pcat').forEach(x => x.classList.remove('on')); b.classList.add('on'); puzState.cat = cat.id; puzState.idx = 0; loadPuzzle() }; nav.appendChild(b) });
      loadPuzzle();
    }
    function getPuzzleList() { return puzState.cat === 'all' ? [...PUZZLES] : PUZZLES.filter(p => p.cat === puzState.cat) }
    function loadPuzzle() {
      const list = getPuzzleList(); if (!list.length) return; const puz = list[puzState.idx % list.length];
      puzState.solved = false; puzState.sel = null; puzState.board = parseFEN(puz.fen);
      document.getElementById('puz-task').textContent = puz.task;
      document.getElementById('puz-turn').textContent = puz.turn === 'w' ? '⬜ White to move' : '⬛ Black to move';
      document.getElementById('puz-turn').className = 'turn-indicator ' + (puz.turn === 'w' ? 'turn-white' : 'turn-black');
      document.getElementById('puz-counter').textContent = 'Puzzle ' + (puzState.idx % list.length + 1) + ' of ' + list.length;
      hideFeedback('puz-feedback'); document.getElementById('puz-next').style.display = 'none';
      renderPuzzleBoard(); say(puz.task);
    }
    function renderPuzzleBoard() {
      const puz = getPuzzleList()[puzState.idx % getPuzzleList().length]; const highlight = {};
      if (puzState.sel) { const { r, f } = sqRF(puzState.sel); const moves = getLegalMovesFiltered(puzState.board, r, f); highlight.dot = moves; highlight.sel = puzState.sel }
      drawBoard('puz-board', puzState.board, { ...highlight, click: (sn, r, f) => handlePuzzleClick(sn, r, f, puz) });
    }
    function handlePuzzleClick(sn, r, f, puz) {
      if (puzState.solved) return; sTick(); const p = puzState.board[r][f]; const turnCol = puz.turn;
      if (!puzState.sel) { if (p && p[0] === turnCol) { puzState.sel = sn; renderPuzzleBoard() } else if (p) showFeedback('puz-feedback', 'Tap a ' + (turnCol === 'w' ? 'White ⬜' : 'Black ⬛') + ' piece!', 'info'); return }
      const { r: fr, f: ff } = sqRF(puzState.sel); const moveStr = puzState.sel + sn;
      if (sn === puzState.sel) { puzState.sel = null; renderPuzzleBoard(); return }
      const legal = getLegalMovesFiltered(puzState.board, fr, ff);
      if (!legal.includes(sn)) { if (p && p[0] === turnCol) { puzState.sel = sn; renderPuzzleBoard(); return } showFeedback('puz-feedback', "Can't move there!", 'no'); sBad(); puzState.sel = null; renderPuzzleBoard(); return }
      const isSolution = puz.solution.some(s => s === moveStr || s === puzState.sel + sn);
      if (isSolution) { puzState.board = applyMove(puzState.board, fr, ff, r, f); puzState.sel = null; puzState.solved = true; drawBoard('puz-board', puzState.board, { g: [sqName(r, f)] }); showFeedback('puz-feedback', '🎉 ' + puz.okMsg, 'ok'); sWin(); confetti(50); earn(3, 'puzzle'); say(puz.okMsg); document.getElementById('puz-next').style.display = '' }
      else { const nb = applyMove(puzState.board, fr, ff, r, f); puzState.board = nb; puzState.sel = null; renderPuzzleBoard(); showFeedback('puz-feedback', '❌ ' + puz.wrongMsg, 'no'); sBad(); setTimeout(() => { puzState.board = parseFEN(puz.fen); puzState.sel = null; hideFeedback('puz-feedback'); renderPuzzleBoard() }, 2200) }
    }
    function nextPuzzle() { puzState.idx = (puzState.idx + 1) % Math.max(getPuzzleList().length, 1); loadPuzzle() }
    function showPuzzleHint() { const puz = getPuzzleList()[puzState.idx % getPuzzleList().length]; showFeedback('puz-feedback', '💡 ' + puz.hint, 'info'); say(puz.hint) }

    // ── MODULE B: PLAY VS BOT ──
    let botState = { board: null, sel: null, diff: 0, gameOver: false, whiteCap: [], blackCap: [], moves: [], moveCount: 0 };
    function setDiff(d) { botState.diff = d;[0, 1, 2].forEach(i => { const el = document.getElementById('diff-' + i); if (el) el.classList.toggle('on', i === d) }) }
    function startBotGame() {
      botState.board = parseFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
      botState.sel = null; botState.gameOver = false; botState.whiteCap = []; botState.blackCap = []; botState.moves = []; botState.moveCount = 0;
      document.getElementById('bot-setup').classList.add('hidden'); document.getElementById('bot-game').classList.remove('hidden');
      setBotMsg('Your turn! Tap a White piece. ⬜'); document.getElementById('bot-status').textContent = 'Your turn ⬜'; renderBotBoard(); updateCaptured();
    }
    function setBotMsg(msg) { const el = document.getElementById('bot-msg'); if (el) el.textContent = msg }
    function renderBotBoard(opts) { if (!botState.board) return; drawBoard('bot-board', botState.board, { ...(opts || {}), click: (sn, r, f) => handleBotClick(sn, r, f) }) }
    function handleBotClick(sn, r, f) {
      if (botState.gameOver) return; sTick(); const p = botState.board[r][f];
      if (!botState.sel) {
        if (p && p[0] === 'w') { const moves = getLegalMovesFiltered(botState.board, r, f); if (!moves.length) { setBotMsg('That piece has no moves!'); return } botState.sel = sn; renderBotBoard({ sel: sn, dot: moves }); setBotMsg('Now tap where to move!') }
        else if (p && p[0] === 'b') setBotMsg("That's the bot's piece!"); else setBotMsg('Tap a White ⬜ piece!'); return;
      }
      if (sn === botState.sel) { botState.sel = null; renderBotBoard(); setBotMsg('Deselected. Pick again!'); return }
      const { r: fr, f: ff } = sqRF(botState.sel); const legal = getLegalMovesFiltered(botState.board, fr, ff);
      if (!legal.includes(sn)) { if (p && p[0] === 'w') { const moves = getLegalMovesFiltered(botState.board, r, f); botState.sel = sn; renderBotBoard({ sel: sn, dot: moves }); setBotMsg('Switched!'); return } setBotMsg('Not reachable!'); return }
      const captured = botState.board[r][f]; const nb = applyMove(botState.board, fr, ff, r, f); botState.moveCount++;
      addMoveToList(botState.sel, sn, 'w', botState.moveCount); if (captured) { botState.blackCap.push(captured); updateCaptured() }
      botState.board = nb; botState.sel = null;
      if (isCheckmate(nb, 'b')) { renderBotBoard({ g: [sn] }); sWin(); confetti(100); setBotMsg('CHECKMATE! You win! 🏆'); earn(10, 'bot'); showResult('🏆', 'You Win!', 'Checkmate! +10 stars', startBotGame); botState.gameOver = true; return }
      if (isStalemate(nb, 'b')) { renderBotBoard(); setBotMsg('Stalemate! Draw!'); botState.gameOver = true; return }
      if (isInCheck(nb, 'b')) { renderBotBoard({ y: [sn] }); setBotMsg('Check! 🔔') } else renderBotBoard();
      document.getElementById('bot-status').textContent = 'Bot thinking...'; document.getElementById('bot-thinking').classList.remove('hidden');
      setBotMsg('🤔 Bot is thinking...'); setTimeout(() => doBotMove(), 600 + Math.random() * 400);
    }
    function doBotMove() {
      if (botState.gameOver) return; document.getElementById('bot-thinking').classList.add('hidden');
      const mv = botMove(botState.board, botState.diff); if (!mv) { botState.gameOver = true; return }
      const { r: tr, f: tf } = sqRF(mv.to); const captured = botState.board[tr][tf]; if (captured) { botState.whiteCap.push(captured); updateCaptured() }
      botState.board = applyMove(botState.board, mv.fr, mv.ff, tr, tf); addMoveToList(sqName(mv.fr, mv.ff), mv.to, 'b', botState.moveCount);
      document.getElementById('bot-status').textContent = 'Your turn ⬜';
      if (isCheckmate(botState.board, 'w')) { renderBotBoard({ r: [mv.to] }); sBad(); setBotMsg('Bot checkmated you! 💪'); showResult('💪', 'Good Try!', 'Play again!', startBotGame); botState.gameOver = true; earn(2, 'bot'); return }
      if (isStalemate(botState.board, 'w')) { renderBotBoard(); setBotMsg('Stalemate!'); botState.gameOver = true; return }
      if (isInCheck(botState.board, 'w')) { renderBotBoard({ y: [mv.to] }); sBad(); setBotMsg('⚠️ Your King is in CHECK!') }
      else { renderBotBoard({ b_: [mv.to] }); setBotMsg('Bot moved to ' + mv.to + '. Your turn!') }
    }
    function addMoveToList(from, to, col, num) {
      const list = document.getElementById('bot-moves');
      if (col === 'w') { const row = document.createElement('div'); row.className = 'move-row'; row.id = 'mr-' + num; row.innerHTML = `<span class="mn">${num}.</span><span class="mw">${from}-${to}</span><span class="mb"></span>`; list.appendChild(row) }
      else { const row = document.getElementById('mr-' + num); if (row) row.querySelector('.mb').textContent = from + '-' + to }
      list.scrollTop = list.scrollHeight;
    }
    function updateCaptured() { const wb = document.getElementById('bot-cap-white'); const bb = document.getElementById('bot-cap-black'); if (wb) wb.textContent = botState.whiteCap.map(p => PM[p]).join(''); if (bb) bb.textContent = botState.blackCap.map(p => PM[p]).join('') }
    function showBotHint() { const moves = getAllMoves(botState.board, 'w'); if (!moves.length) return; const good = moves.filter(m => { const { r, f } = sqRF(m.to); return botState.board[r][f] }); const hint = good.length ? good[0] : moves[Math.random() * moves.length | 0]; renderBotBoard({ sel: sqName(hint.fr, hint.ff), dot: getLegalMovesFiltered(botState.board, hint.fr, hint.ff) }); setBotMsg('💡 Try the piece on ' + sqName(hint.fr, hint.ff) + '!') }
    function resetBotGame() { botState.board = null; botState.gameOver = false; botState.sel = null; document.getElementById('bot-game').classList.add('hidden'); document.getElementById('bot-setup').classList.remove('hidden'); document.getElementById('bot-moves').innerHTML = '' }

    // ── MODULE C: THREAT SPOTTER ──
    const THREATS = [
      { fen: '8/8/8/3q4/8/8/3Q4/3K4 w - - 0 1', task: 'Black Queen on D5 is threatening a White piece! Tap it!', hint: 'Black Queen on D5 can move to D2.', answers: ['d2'], explanation: 'Queen on D5 threatens the White Queen on D2!', level: 'easy' },
      { fen: '3k4/8/8/5b2/8/3R4/8/3K4 w - - 0 1', task: 'Black Bishop on F5 threatens a White piece! Tap it!', hint: 'Bishops move diagonally from F5.', answers: ['d3'], explanation: 'Bishop on F5 threatens Rook on D3!', level: 'easy' },
      { fen: '3k4/8/8/8/8/2n5/8/3K1R2 w - - 0 1', task: 'Black Knight on C3 can fork! Which White piece is threatened?', hint: 'From C3, Knight can jump to D1.', answers: ['d1'], explanation: 'Knight from C3 jumps to D1 — a fork!', level: 'medium' },
      { fen: '6k1/8/8/8/3r4/8/3R4/3K4 w - - 0 1', task: 'Black Rook on D4 threatens a White piece! Tap it!', hint: 'Rook can slide down the D-file.', answers: ['d2'], explanation: 'Black Rook threatens White Rook on D2!', level: 'easy' },
      { fen: '3k4/8/8/8/4b3/8/8/4K2R w - - 0 1', task: 'Black Bishop on E4 eyes a White piece! Tap it!', hint: 'Bishop moves diagonally toward H.', answers: ['h1'], explanation: 'Bishop on E4 threatens Rook on H1!', level: 'easy' },
    ];
    let thrState = { idx: 0, correct: 0, total: 0, answered: false };
    function initThreat() { thrState.idx = Math.floor(Math.random() * THREATS.length); thrState.correct = 0; thrState.total = 0; loadThreat() }
    function loadThreat() { const t = THREATS[thrState.idx]; thrState.answered = false; document.getElementById('thr-task').textContent = t.task; document.getElementById('thr-progress').textContent = thrState.correct + ' / ' + thrState.total + ' correct'; hideFeedback('thr-feedback'); document.getElementById('thr-next').style.display = 'none'; say(t.task); drawBoard('thr-board', t.fen, { click: (sn) => handleThreatClick(sn, t) }) }
    function handleThreatClick(sn, t) { if (thrState.answered) return; sTick(); thrState.total++; thrState.answered = true; if (t.answers.includes(sn)) { thrState.correct++; showFeedback('thr-feedback', '🎉 ' + t.explanation, 'ok'); sOk(); earn(2, 'threat'); confetti(30); drawBoard('thr-board', t.fen, { g: [sn] }) } else { showFeedback('thr-feedback', '❌ ' + t.explanation, 'no'); sBad(); drawBoard('thr-board', t.fen, { r: [sn], y: t.answers }) }; document.getElementById('thr-progress').textContent = thrState.correct + ' / ' + thrState.total + ' correct'; document.getElementById('thr-next').style.display = '' }
    function nextThreat() { thrState.idx = (thrState.idx + 1) % THREATS.length; loadThreat() }
    function showThreatHint() { showFeedback('thr-feedback', '💡 ' + THREATS[thrState.idx].hint, 'info') }

    // ── MODULE D: PIECE DOJO ──
    const DOJO_PIECES = [{ code: 'wN', label: 'Knight', icon: '♘', fact: 'The Knight jumps in an L-shape: 2+1 squares!' }, { code: 'wR', label: 'Rook', icon: '♖', fact: 'The Rook slides in straight lines!' }, { code: 'wB', label: 'Bishop', icon: '♗', fact: 'The Bishop slides diagonally!' }, { code: 'wQ', label: 'Queen', icon: '♕', fact: 'The Queen combines Rook + Bishop!' }, { code: 'wK', label: 'King', icon: '♔', fact: 'The King moves one square any direction!' }, { code: 'wP', label: 'Pawn', icon: '♙', fact: 'Pawns move forward but capture diagonally!' }];
    let dojoState = { piece: null, from: null, target: null, moves: 0, best: null, done: 0, sel: null, trail: [] };
    function initDojo() { const btns = document.getElementById('dojo-piece-btns'); if (btns.children.length > 0) return; DOJO_PIECES.forEach(p => { const b = document.createElement('button'); b.className = 'dojo-piece-btn'; b.textContent = p.icon; b.title = p.label; b.onclick = () => selectDojoPiece(p, b); btns.appendChild(b) }) }
    function selectDojoPiece(p, btn) { sTick(); document.querySelectorAll('.dojo-piece-btn').forEach(b => b.classList.remove('on')); btn.classList.add('on'); dojoState.piece = p; dojoState.moves = 0; dojoState.trail = []; dojoState.sel = null; document.getElementById('dojo-msg').textContent = p.fact + ' Navigate to the 🌟 target!'; say(p.fact); hideFeedback('dojo-feedback'); newDojoChallenge() }
    function newDojoChallenge() { if (!dojoState.piece) return; let fr, ff, tr, tf; do { fr = Math.random() * 8 | 0; ff = Math.random() * 8 | 0; tr = Math.random() * 8 | 0; tf = Math.random() * 8 | 0 } while (fr === tr && ff === tf); dojoState.from = { r: fr, f: ff }; dojoState.target = { r: tr, f: tf }; dojoState.moves = 0; dojoState.trail = []; dojoState.sel = null; dojoState.best = calcMinMoves(dojoState.piece.code, fr, ff, tr, tf); updateDojoStats(); renderDojo() }
    function calcMinMoves(code, fr, ff, tr, tf) { const visited = new Set(); const queue = [{ r: fr, f: ff, moves: 0 }]; visited.add(fr + ',' + ff); while (queue.length) { const { r, f, moves } = queue.shift(); if (r === tr && f === tf) return moves; const tmpBd = Array.from({ length: 8 }, () => Array(8).fill(null)); tmpBd[r][f] = code; getLegalMoves(tmpBd, r, f).forEach(sn => { const { r: nr, f: nf } = sqRF(sn); const k = nr + ',' + nf; if (!visited.has(k)) { visited.add(k); queue.push({ r: nr, f: nf, moves: moves + 1 }) } }) } return null }
    function renderDojo() {
      if (!dojoState.piece || !dojoState.from) return; const bd = Array.from({ length: 8 }, () => Array(8).fill(null));
      const cur = dojoState.sel || sqName(dojoState.from.r, dojoState.from.f); const { r: cr, f: cf } = sqRF(cur); bd[cr][cf] = dojoState.piece.code;
      const tgt = sqName(dojoState.target.r, dojoState.target.f); let validMoves = []; if (!dojoState.sel) validMoves = getLegalMoves(bd, cr, cf);
      drawBoard('dojo-board', bd, { y: [tgt], b_: dojoState.trail.map(t => sqName(t.r, t.f)), dot: validMoves, sel: dojoState.sel, click: (sn, r, f) => handleDojoClick(sn, r, f) });
      const tEl = document.querySelector('#dojo-board [data-sq="' + tgt + '"]');
      if (tEl) { const s = document.createElement('span'); s.style.cssText = 'position:absolute;font-size:1.2rem;z-index:3;pointer-events:none'; s.textContent = '🌟'; tEl.appendChild(s) }
    }
    function handleDojoClick(sn, r, f) {
      if (!dojoState.piece || !dojoState.from) return; sTick(); const cur = dojoState.sel || sqName(dojoState.from.r, dojoState.from.f); const { r: cr, f: cf } = sqRF(cur); const bd = Array.from({ length: 8 }, () => Array(8).fill(null)); bd[cr][cf] = dojoState.piece.code; const legal = getLegalMoves(bd, cr, cf);
      if (!legal.includes(sn)) { showFeedback('dojo-feedback', '❌ The ' + dojoState.piece.label + ' cannot move there! ' + dojoState.piece.fact, 'no'); sBad(); return }
      hideFeedback('dojo-feedback'); dojoState.trail.push({ r: cr, f: cf }); dojoState.from = { r, f }; dojoState.sel = null; dojoState.moves++; updateDojoStats();
      if (r === dojoState.target.r && f === dojoState.target.f) { sWin(); confetti(40); dojoState.done++; const stars = dojoState.best && dojoState.moves <= dojoState.best ? 3 : dojoState.moves <= dojoState.best + 2 ? 2 : 1; earn(stars, 'dojo'); showFeedback('dojo-feedback', '🌟 Target reached in ' + dojoState.moves + ' moves! Best: ' + dojoState.best + '. +' + stars + ' stars!', 'ok'); say('Target reached!'); setTimeout(() => { hideFeedback('dojo-feedback'); newDojoChallenge() }, 2000) } else renderDojo();
    }
    function updateDojoStats() { document.getElementById('dojo-moves').textContent = dojoState.moves; document.getElementById('dojo-best').textContent = dojoState.best !== null ? dojoState.best : '?'; document.getElementById('dojo-done').textContent = dojoState.done + '/10' }

    // ── MODULE E: CAPTURE CHALLENGE ──
    const CAP_POSITIONS = [
      { fen: '3k4/8/5n2/3p4/3R4/2B5/8/3K4 w - - 0 1', task: 'Capture FREE Black pieces in 3 moves!', moves: 3, hint: 'Rook can take D5 pawn. Knight on F6 is defended!' },
      { fen: '3k4/3q4/8/2p1p3/3R4/8/8/3K4 w - - 0 1', task: 'Three pieces! Capture only the undefended ones!', moves: 3, hint: 'C5 and E5 pawns are free. Queen on D7 is protected.' },
      { fen: '2bk4/8/8/3r4/2B5/8/8/3K2R1 w - - 0 1', task: 'Find the free piece and capture it!', moves: 2, hint: 'Rook on D5 is undefended! Bishop on C8 is protected.' },
    ];
    let capState = { pos: null, board: null, sel: null, movesLeft: 3, captured: 0, lost: 0, done: false };
    function initCapture() { nextCapture() }
    function nextCapture() { capState.pos = CAP_POSITIONS[Math.random() * CAP_POSITIONS.length | 0]; capState.board = parseFEN(capState.pos.fen); capState.sel = null; capState.movesLeft = capState.pos.moves; capState.captured = 0; capState.lost = 0; capState.done = false; document.getElementById('cap-task').textContent = capState.pos.task; document.getElementById('cap-moves').textContent = capState.pos.moves; hideFeedback('cap-feedback'); document.getElementById('cap-next').style.display = 'none'; updateCapScores(); say(capState.pos.task); renderCapBoard() }
    function renderCapBoard() { drawBoard('cap-board', capState.board, { sel: capState.sel, dot: capState.sel ? getLegalMovesFiltered(capState.board, ...Object.values(sqRF(capState.sel))) : [], click: (sn, r, f) => handleCapClick(sn, r, f) }) }
    function handleCapClick(sn, r, f) { if (capState.done) return; sTick(); const p = capState.board[r][f]; if (!capState.sel) { if (p && p[0] === 'w') { capState.sel = sn; renderCapBoard() } return } if (sn === capState.sel) { capState.sel = null; renderCapBoard(); return } const { r: fr, f: ff } = sqRF(capState.sel); const legal = getLegalMovesFiltered(capState.board, fr, ff); if (!legal.includes(sn)) { if (p && p[0] === 'w') { capState.sel = sn; renderCapBoard(); return } showFeedback('cap-feedback', "Can't move there!", 'no'); capState.sel = null; renderCapBoard(); return } const target = capState.board[r][f]; const nb = applyMove(capState.board, fr, ff, r, f); if (target && target[0] === 'b') { capState.captured++; sOk(); showFeedback('cap-feedback', '✅ Captured ' + PN[target[1]] + '!', 'ok'); earn(1, 'capture') } else showFeedback('cap-feedback', 'Moved!', 'info'); capState.board = nb; capState.sel = null; capState.movesLeft--; updateCapScores(); if (capState.movesLeft <= 0) { capState.done = true; const t = capState.captured; showFeedback('cap-feedback', 'Done! Captured ' + t + '! 💰', 'ok'); sWin(); earn(t, 'capture'); document.getElementById('cap-next').style.display = '' }; renderCapBoard() }
    function updateCapScores() { document.getElementById('cap-captured').textContent = capState.captured; document.getElementById('cap-lost').textContent = capState.lost; document.getElementById('cap-moves').textContent = capState.movesLeft }

    // ── MODULE F: BUILD & DEFEND ──
    const DEFEND_ATTACKS = [{ name: 'Rook Attack', positions: { bR: { r: 7, f: 3 }, bK: { r: 7, f: 4 } }, description: 'A Rook charges toward your King!' }, { name: 'Bishop Assault', positions: { bB: { r: 6, f: 5 }, bK: { r: 7, f: 7 } }, description: 'A Bishop aims diagonally!' }, { name: 'Queen Rush', positions: { bQ: { r: 7, f: 7 }, bK: { r: 7, f: 5 } }, description: 'The enemy Queen approaches!' }];
    const ARMY_PIECES = [{ code: 'wR', icon: '♖' }, { code: 'wB', icon: '♗' }, { code: 'wN', icon: '♘' }, { code: 'wP', icon: '♙' }, { code: 'wP2', icon: '♙' }];
    let defState = { setupBoard: null, armySel: null, placedPieces: [], battle: null, sel: null, turn: 0, maxTurns: 5, attack: null, gameOver: false };
    function initDefend() { defState.attack = DEFEND_ATTACKS[Math.random() * DEFEND_ATTACKS.length | 0]; defState.setupBoard = Array.from({ length: 8 }, () => Array(8).fill(null)); defState.setupBoard[0][4] = 'wK'; defState.placedPieces = ['wK']; defState.armySel = null; buildArmyPalette(); renderSetupBoard() }
    function buildArmyPalette() { const div = document.getElementById('def-army'); div.innerHTML = ''; ARMY_PIECES.forEach(p => { const btn = document.createElement('button'); btn.className = 'army-piece'; btn.id = 'ap-' + p.code; btn.textContent = p.icon; btn.onclick = () => { sTick(); defState.armySel = defState.armySel === p.code ? null : p.code; document.querySelectorAll('.army-piece').forEach(b => b.classList.remove('selected-army')); if (defState.armySel) btn.classList.add('selected-army') }; div.appendChild(btn) }) }
    function renderSetupBoard() { drawBoard('def-setup-board', defState.setupBoard, { g: ['e1'], click: (sn, r, f) => handleSetupClick(sn, r, f) }) }
    function handleSetupClick(sn, r, f) { if (!defState.armySel) return; if (r > 3) { showToast('Place on rows 1-4!'); return } if (defState.setupBoard[r][f] === 'wK') { showToast("That's the King's square!"); return } sTick(); const code = defState.armySel === 'wP2' ? 'wP' : defState.armySel; defState.setupBoard[r][f] = code; defState.placedPieces.push(defState.armySel); const btn = document.getElementById('ap-' + defState.armySel); if (btn) btn.classList.add('placed'); defState.armySel = null; document.querySelectorAll('.army-piece').forEach(b => b.classList.remove('selected-army')); renderSetupBoard() }
    function startDefend() { if (defState.placedPieces.length < 2) { showToast('Place at least 1 defending piece!'); return } defState.battle = defState.setupBoard.map(r => [...r]); const atk = defState.attack; Object.entries(atk.positions).forEach(([pc, pos]) => { defState.battle[pos.r][pos.f] = pc.replace('2', '') }); defState.sel = null; defState.turn = 0; defState.gameOver = false; document.getElementById('def-setup').classList.add('hidden'); document.getElementById('def-battle').classList.remove('hidden'); document.getElementById('def-msg').textContent = 'Defend your King!'; document.getElementById('def-hint-text').textContent = '💡 ' + atk.description; document.getElementById('def-moves').textContent = defState.maxTurns; say(atk.description); renderDefBoard() }
    function renderDefBoard(opts) { drawBoard('def-board', defState.battle, { ...(opts || {}), click: (sn, r, f) => handleDefClick(sn, r, f) }) }
    function handleDefClick(sn, r, f) { if (defState.gameOver) return; sTick(); const p = defState.battle[r][f]; if (!defState.sel) { if (p && p[0] === 'w') { defState.sel = sn; const moves = getLegalMovesFiltered(defState.battle, r, f); renderDefBoard({ sel: sn, dot: moves }) } return } if (sn === defState.sel) { defState.sel = null; renderDefBoard(); return } const { r: fr, f: ff } = sqRF(defState.sel); const legal = getLegalMovesFiltered(defState.battle, fr, ff); if (!legal.includes(sn)) { if (p && p[0] === 'w') { defState.sel = sn; const mv = getLegalMovesFiltered(defState.battle, r, f); renderDefBoard({ sel: sn, dot: mv }); return } showFeedback('def-feedback', "Can't move there!", 'no'); defState.sel = null; renderDefBoard(); return } const captured = defState.battle[r][f]; defState.battle = applyMove(defState.battle, fr, ff, r, f); defState.sel = null; defState.turn++; document.getElementById('def-turn-num').textContent = defState.turn; if (captured && captured[0] === 'b') { showFeedback('def-feedback', '⚔️ Captured enemy ' + PN[captured[1]] + '!', 'ok'); sOk() } if (isCheckmate(defState.battle, 'w')) { defState.gameOver = true; sBad(); showFeedback('def-feedback', '❌ Your King was checkmated!', 'no'); showResult('💪', 'Keep Trying!', 'Try again!', resetDefend); return } if (defState.turn >= defState.maxTurns) { defState.gameOver = true; sWin(); confetti(60); earn(5, 'defend'); document.getElementById('def-msg').textContent = '🛡️ You survived!'; showResult('🛡️', 'You Survived!', '5 turns defended! +5 stars', resetDefend); return } renderDefBoard({ b_: [sn] }); setTimeout(() => doDefendBotMove(), 700) }
    function doDefendBotMove() { if (defState.gameOver) return; const mv = botMove(defState.battle, 1); if (!mv) return; const { r: tr, f: tf } = sqRF(mv.to); defState.battle = applyMove(defState.battle, mv.fr, mv.ff, tr, tf); if (isInCheck(defState.battle, 'w')) { renderDefBoard({ r: [mv.to] }); sBad(); document.getElementById('def-msg').textContent = '⚠️ CHECK! Defend!' } else { renderDefBoard({ y: [mv.to] }); document.getElementById('def-msg').textContent = 'Bot moved! Defend!' } }
    function showDefendHint() { const moves = getAllMoves(defState.battle, 'w'); if (!moves.length) return; const m = moves[Math.random() * moves.length | 0]; renderDefBoard({ sel: sqName(m.fr, m.ff), dot: getLegalMovesFiltered(defState.battle, m.fr, m.ff) }); document.getElementById('def-msg').textContent = '💡 Try moving from ' + sqName(m.fr, m.ff) + '!' }
    function resetDefend() { document.getElementById('def-battle').classList.add('hidden'); document.getElementById('def-setup').classList.remove('hidden'); initDefend() }

    // ── CURRICULUM ──
    const CURR_DATA = [
      {
        id: 'l1', label: 'L1', title: 'Beginner', subtitle: 'Foundations · 20 Sessions', color: 'lc1', goal: 'Learn the pieces, rules, and play your first game!', sessions: [
          { num: 1, title: 'The Chessboard', topics: '64 squares, files, ranks', concept: { emoji: '♟', title: 'Meet the Board!', explain: '64 squares — 32 light, 32 dark! Columns=FILES (a-h), Rows=RANKS (1-8). Every square has a unique name like "e4"!', fen: '8/8/8/8/8/8/8/8 w - - 0 1', hl: { yellow: ['e4', 'd5', 'a1', 'h8'] }, quiz: { q: 'How many squares?', opts: ['32', '64', '48', '16'], ans: '64', right: 'Yes! 64!', wrong: '8×8=64!' }, puzzle: { instr: 'Tap E4!', fen: '8/8/8/8/8/8/8/8 w - - 0 1', ans: ['e4'], hl: { yellow: ['e4'] } } } },
          { num: 2, title: 'The King', topics: 'Most important piece', concept: { emoji: '♔', title: 'The King!', explain: 'The King ♔ is the MOST IMPORTANT piece! If your King is caught (checkmate) you lose. Moves ONE square in ANY direction.', fen: '8/8/8/8/4K3/8/8/8 w - - 0 1', hl: { green: ['d3', 'e3', 'f3', 'd4', 'f4', 'd5', 'e5', 'f5'] }, quiz: { q: 'What happens if your King is checkmated?', opts: ['Lose a turn', 'Lose the game!', 'New King', 'Nothing'], ans: 'Lose the game!', right: 'Protect your King!', wrong: 'Checkmate = lose!' }, puzzle: { instr: 'King on E4. Tap where it can move!', fen: '8/8/8/8/4K3/8/8/8 w - - 0 1', ans: ['d3', 'e3', 'f3', 'd4', 'f4', 'd5', 'e5', 'f5'], hl: { yellow: ['e4'] } } } },
          { num: 3, title: 'The Queen', topics: 'Most powerful piece', concept: { emoji: '♕', title: 'The Queen!', explain: 'The Queen ♕ is the MOST POWERFUL! Moves ANY direction, as many squares. Worth 9 points!', fen: '8/8/8/8/3Q4/8/8/8 w - - 0 1', hl: { green: ['d1', 'd2', 'd3', 'd5', 'd6', 'd7', 'd8', 'a4', 'b4', 'c4', 'e4', 'f4', 'g4', 'h4'] }, quiz: { q: 'How does the Queen move?', opts: ['Only forward', 'Only diagonally', 'Any direction!', 'Only sideways'], ans: 'Any direction!', right: 'SUPER powerful!', wrong: 'Queen goes everywhere!' }, puzzle: { instr: 'Queen on D4. Tap any reachable square!', fen: '8/8/8/8/3Q4/8/8/8 w - - 0 1', ans: ['d1', 'd2', 'd3', 'd5', 'd6', 'd7', 'd8', 'a4', 'b4', 'c4', 'e4', 'f4', 'g4', 'h4'], hl: { yellow: ['d4'] } } } },
          { num: 4, title: 'The Rook', topics: 'Straight lines, worth 5', concept: { emoji: '♖', title: 'The Rook!', explain: 'The Rook ♖ moves in STRAIGHT LINES — forward, backward, sideways. Worth 5 points!', fen: '8/8/8/8/3R4/8/8/8 w - - 0 1', hl: { green: ['d1', 'd2', 'd3', 'd5', 'd6', 'd7', 'd8', 'a4', 'b4', 'c4', 'e4', 'f4', 'g4', 'h4'] }, quiz: { q: 'How does the Rook move?', opts: ['Diagonally', 'Straight lines!', 'L-shape', 'One square only'], ans: 'Straight lines!', right: 'Straight-line sliders!', wrong: 'Rooks go straight!' }, puzzle: { instr: 'Rook on D4. Tap any straight-line square!', fen: '8/8/8/8/3R4/8/8/8 w - - 0 1', ans: ['d1', 'd2', 'd3', 'd5', 'd6', 'd7', 'd8', 'a4', 'b4', 'c4', 'e4', 'f4', 'g4', 'h4'], hl: { yellow: ['d4'] } } } },
          { num: 5, title: 'The Knight', topics: 'L-shape jump, jumps over pieces', concept: { emoji: '♘', title: 'The Knight!', explain: 'The Knight ♘ jumps in an L-shape: 2 squares + 1 sideways. The ONLY piece that jumps over others! Worth 3 points.', fen: '8/8/8/8/3N4/8/8/8 w - - 0 1', hl: { green: ['b3', 'b5', 'c2', 'c6', 'e2', 'e6', 'f3', 'f5'] }, quiz: { q: 'What is special about the Knight?', opts: ['Moves diagonally', 'Jumps over pieces!', 'Goes sideways only', 'Never moves'], ans: 'Jumps over pieces!', right: 'The only jumper!', wrong: 'Knights JUMP in an L!' }, puzzle: { instr: 'Knight on D4. Tap an L-shape square!', fen: '8/8/8/8/3N4/8/8/8 w - - 0 1', ans: ['b3', 'b5', 'c2', 'c6', 'e2', 'e6', 'f3', 'f5'], hl: { yellow: ['d4'] } } } },
        ]
      },
      { id: 'l2', label: 'L2', title: 'Advanced Beginner', subtitle: 'Tactics · 20 Sessions', color: 'lc2', goal: 'Spot simple tactics and avoid blunders!', sessions: [{ num: 1, title: 'The Fork', topics: 'Attack two pieces at once', concept: { emoji: '🍴', title: 'The Fork!', explain: 'A FORK attacks TWO enemy pieces at once! The opponent can only save ONE — you get the other for free!', fen: '8/8/8/3N4/8/2k5/8/4K3 w - - 0 1', hl: { green: ['c3', 'e3'], yellow: ['d5'] }, quiz: { q: 'In a fork, how many pieces are attacked?', opts: ['One', 'Two!', 'Three', 'All'], ans: 'Two!', right: 'Fork = TWO at once!', wrong: 'Fork attacks TWO!' }, puzzle: { instr: 'Tap the forking Knight!', fen: '8/8/8/3N4/8/2k5/8/4K3 w - - 0 1', ans: ['d5'], hl: { yellow: ['d5'] } } } }] },
      { id: 'l3', label: 'L3', title: 'Intermediate', subtitle: 'Strategy · 20 Sessions', color: 'lc3', goal: 'Think 3-4 moves ahead!', sessions: [{ num: 1, title: 'Open Files', topics: 'Rooks love open files', concept: { emoji: '🚀', title: 'Open Files!', explain: 'An OPEN FILE has no pawns on it. Rooks are MOST powerful on open files!', fen: '8/8/8/8/8/8/PPP1PPPP/R7 w - - 0 1', hl: { green: ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8'] }, quiz: { q: 'What is an open file?', opts: ['Full of pawns', 'No pawns!', 'For Kings', 'Right side'], ans: 'No pawns!', right: 'Open files = Rook highways!', wrong: 'No pawns = open file!' }, puzzle: { instr: 'D-file is open! Tap the Rook!', fen: '8/8/8/8/8/8/PPP1PPPP/R7 w - - 0 1', ans: ['a1'], hl: { green: ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8'] } } } }] },
      { id: 'l4', label: 'L4', title: 'Advanced', subtitle: 'Tournament Thinking', color: 'lc4', goal: 'Learn opening systems!', sessions: [{ num: 1, title: 'Italian Game', topics: '1.e4 e5 2.Nf3 Nc6 3.Bc4', concept: { emoji: '🇮🇹', title: 'Italian Game!', explain: '1.e4 e5 2.Nf3 Nc6 3.Bc4 — Bishop to C4, aiming at the weak F7 square!', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', hl: { yellow: ['c4'], green: ['f7'] }, quiz: { q: 'Where does the Italian Bishop go?', opts: ['B5', 'C4!', 'D3', 'E2'], ans: 'C4!', right: 'Bc4 eyes F7!', wrong: 'Italian = Bc4!' }, puzzle: { instr: 'Tap the Italian Bishop!', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', ans: ['c4'], hl: { yellow: ['c4'] } } } }] },
      { id: 'l5', label: 'L5', title: 'Advanced Part 2', subtitle: 'Competitive', color: 'lc5', goal: 'Develop strong competitive skills!', sessions: [{ num: 1, title: 'Deep Calculation', topics: '4-5 moves ahead', concept: { emoji: '🔭', title: 'Calculate Deeper!', explain: 'CALCULATION means seeing moves in your head! Order: Checks → Captures → Threats. Aim for 4-5 moves ahead!', fen: 'r3k2r/ppp2ppp/2n1bn2/3qp3/3PP3/2PBBN2/PP3PPP/R2QK2R w KQkq - 0 10', hl: {}, quiz: { q: 'Calculate in what order?', opts: ['Pawns first', 'Checks, captures, threats!', 'Pretty moves', 'Random'], ans: 'Checks, captures, threats!', right: 'Checks → Captures → Threats!', wrong: 'Always: Checks first!' }, puzzle: { instr: 'Tap the Black Queen!', fen: 'r3k2r/ppp2ppp/2n1bn2/3qp3/3PP3/2PBBN2/PP3PPP/R2QK2R w KQkq - 0 10', ans: ['d5'], hl: { yellow: ['d5'] } } } }] },
      { id: 'lm', label: '★', title: 'Master Course', subtitle: 'Performance Track', color: 'lcm', goal: 'Compete in rated tournaments!', sessions: [{ num: 1, title: 'Opening Repertoire', topics: '15-20 moves deep', concept: { emoji: '🏆', title: 'Build Your Repertoire!', explain: 'At Master level you need your openings 15-20 moves deep and ALL the plans memorized!', fen: 'r2qkb1r/ppp1pppp/2n2n2/3p1b2/2PP4/2N1PN2/PP3PPP/R1BQKB1R w KQkq - 0 7', hl: {}, quiz: { q: 'How deep should a Master know openings?', opts: ['3 moves', '5 moves', '15-20 moves!', 'Just move 1'], ans: '15-20 moves!', right: 'Masters know 15-20 moves deep!', wrong: 'Masters go 15-20 moves!' }, puzzle: { instr: 'Tap the Black Queen!', fen: 'r2qkb1r/ppp1pppp/2n2n2/3p1b2/2PP4/2N1PN2/PP3PPP/R1BQKB1R w KQkq - 0 7', ans: ['d8'], hl: { yellow: ['d8'] } } } }] },
    ];
    let currBuilt = false;
    function buildCurriculum() {
      if (currBuilt) return; currBuilt = true; const cont = document.getElementById('curr-levels'); cont.innerHTML = '';
      CURR_DATA.forEach(level => {
        const card = document.createElement('div'); card.className = 'level-card';
        card.innerHTML = `<div class="level-head ${level.color}"><div class="level-badge">${level.label}</div><div class="level-info"><h3>${level.title}</h3><p>${level.subtitle}</p></div><div class="level-arrow">▶</div></div><div class="level-body"><p style="font-size:.8rem;font-weight:700;color:#666;margin-bottom:10px">🎯 ${level.goal}</p><div id="sl-${level.id}"></div></div>`;
        card.querySelector('.level-head').onclick = () => { card.classList.toggle('open'); if (card.classList.contains('open')) buildSessions(level) };
        cont.appendChild(card);
      });
    }
    function buildSessions(level) { const cont = document.getElementById('sl-' + level.id); if (cont.children.length > 0) return; level.sessions.forEach(s => { const item = document.createElement('div'); item.className = 'session-card'; item.innerHTML = `<div class="session-title">Session ${s.num}: ${s.title}</div><div class="session-topics">${s.topics}</div>`; const body = document.createElement('div'); body.style.display = 'none'; item.onclick = () => { body.style.display = body.style.display === 'none' ? 'block' : 'none'; if (body.style.display === 'block' && !body.children.length) buildConceptCard(s.concept, body) }; cont.appendChild(item); cont.appendChild(body) }) }
    function buildConceptCard(c, container) {
      container.innerHTML = ''; const card = document.createElement('div'); card.className = 'concept-card'; card.innerHTML = `<div style="font-size:2rem;margin-bottom:4px">${c.emoji}</div><div class="cc-title">${c.title}</div><div class="cc-explain">${c.explain}</div>`;
      const bw = document.createElement('div'); bw.className = 'cc-board-wrap'; const bd = document.createElement('div'); bd.className = 'cc-board board'; bd.id = 'ccb-' + Math.random().toString(36).slice(2); bw.appendChild(bd); card.appendChild(bw); container.appendChild(card);
      setTimeout(() => drawBoard(bd.id, c.fen, { g: c.hl.green || [], y: c.hl.yellow || [] }), 30);
      const qDiv = document.createElement('div'); qDiv.style.marginTop = '8px'; qDiv.innerHTML = `<div style="font-weight:800;font-size:.85rem;color:#666;margin-bottom:6px">✅ Quiz: ${c.quiz.q}</div>`;
      const opts = document.createElement('div'); opts.className = 'quiz-opts'; let done = false;
      c.quiz.opts.forEach(opt => { const b = document.createElement('button'); b.className = 'quiz-opt'; b.textContent = opt; b.onclick = () => { if (done) return; done = true; const ok = opt === c.quiz.ans; b.classList.add(ok ? 'ok' : 'no'); opts.querySelectorAll('.quiz-opt').forEach(x => { if (x.textContent === c.quiz.ans) x.classList.add('ok') }); const fb = document.createElement('div'); fb.className = 'quiz-feedback show ' + (ok ? 'ok' : 'no'); fb.textContent = ok ? c.quiz.right : c.quiz.wrong; qDiv.appendChild(fb); if (ok) { sOk(); confetti(20) } else sBad() }; opts.appendChild(b) });
      qDiv.appendChild(opts); container.appendChild(qDiv);
      const pDiv = document.createElement('div'); pDiv.style.marginTop = '8px'; pDiv.innerHTML = `<div class="puzzle-instr">${c.puzzle.instr}</div>`;
      const pbw = document.createElement('div'); pbw.className = 'cc-board-wrap'; const pbd = document.createElement('div'); pbd.className = 'cc-board board'; const pbId = 'pzb-' + Math.random().toString(36).slice(2, 8); pbd.id = pbId; pbw.appendChild(pbd); pDiv.appendChild(pbw);
      const pr = document.createElement('div'); pr.className = 'puzzle-result'; pDiv.appendChild(pr); let pandswered = false;
      setTimeout(() => { drawBoard(pbId, c.puzzle.fen, { y: c.puzzle.hl.yellow || [], g: c.puzzle.hl.green || [], click: (sn) => { if (pandswered) return; if (c.puzzle.ans.includes(sn)) { pandswered = true; pr.textContent = '🎉 Correct!'; pr.className = 'puzzle-result show ok'; sOk(); confetti(20); drawBoard(pbId, c.puzzle.fen, { g: [sn] }) } else { pr.textContent = '❌ Try again!'; pr.className = 'puzzle-result show no'; sBad(); setTimeout(() => { pr.className = 'puzzle-result' }, 1000) } } }) }, 30);
      container.appendChild(pDiv);
    }

    // ── PROGRESS ──
    function renderProgress() {
      document.getElementById('prog-stars').textContent = ST.stars; document.getElementById('prog-streak').textContent = (ST.streak || 0) + '🔥';
      const cont = document.getElementById('prog-modules'); cont.innerHTML = '';
      [
        ['dojo', '🐴 Piece Dojo'],
        ['bot', '🤖 Play vs Bot'],
        ['puzzle', '🎯 Puzzle Trainer'],
        ['threat', '👁 Threat Spotter'],
        ['capture', '💥 Capture Challenge'],
        ['defend', '🛡️ Build & Defend'],
        ['blunder', '🔍 Blunder Check'],
        ['patterns', '🏆 Checkmate Patterns'],
        ['combo', '🔗 Combo Builder'],
        ['endcoach', '👑 Endgame Coach'],
        ['opening', '🌅 Opening Lab'],
        ['eval', "⚖️ Who's Winning"],
        ['pawn', '📐 Pawn School'],
        ['ladder', '🪜 Double Ladder'],
        ['fork', '🍴 Fork & Attack']
      ].forEach(([id, lbl]) => { const row = document.createElement('div'); row.className = 'card-sm'; row.style.cssText = 'margin-bottom:6px;display:flex;align-items:center;gap:10px'; const stars = ST.mods[id] || 0; row.innerHTML = `<span style="flex:1;font-weight:700;font-size:.82rem">${lbl}</span><span style="font-weight:900;color:${stars > 0 ? '#F5A623' : '#ccc'}">⭐ ${stars}</span>`; cont.appendChild(row) });
    }

    // ── BLUNDER CHECK ──
    const BLUNDERS = [
      { fen: '3k4/8/8/8/3R4/8/3q4/3K4 w - - 0 1', isB: true, hang: ['d4'], hint: 'Black Queen on D2 attacks White Rook on D4!', exp: 'BLUNDER! Rook D4 is attacked by Black Queen D2!', moved: 'Rook to D4' },
      { fen: '3k4/8/8/3r4/8/8/8/3RK3 w - - 0 1', isB: false, hang: [], hint: 'Black Rook cannot reach D1 in one move.', exp: 'Safe! The Black Rook cannot reach D1 directly.', moved: 'King to E1' },
      { fen: '3k4/3q4/8/3N4/8/8/8/3K4 w - - 0 1', isB: true, hang: ['d5'], hint: 'Black Queen D7 attacks Knight on D5!', exp: 'BLUNDER! Knight D5 attacked by Black Queen D7!', moved: 'Knight to D5' },
      { fen: 'r3k3/8/8/8/8/8/8/R3K3 w - - 0 1', isB: false, hang: [], hint: 'No Black piece can reach A1 in one move.', exp: 'Safe!', moved: 'Rook to A1' },
      { fen: '3k4/8/8/8/2b5/8/8/3BK3 w - - 0 1', isB: true, hang: ['d1'], hint: 'Black Bishop C4 attacks White Bishop D1!', exp: 'BLUNDER! Black Bishop C4 attacks White Bishop D1!', moved: 'Bishop to D1' },
    ];
    let BLU = { idx: 0, correct: 0, total: 0, phase: 0, answered: false };
    function initBlunder() { BLU = { idx: Math.floor(Math.random() * BLUNDERS.length), correct: 0, total: 0, phase: 0, answered: false }; loadBlunder() }
    function loadBlunder() { const b = BLUNDERS[BLU.idx]; BLU.answered = false; BLU.phase = 0; document.getElementById('blu-kip').innerHTML = 'White just played: <b>' + b.moved + '</b>. Is this a BLUNDER?'; document.getElementById('blu-ctr').textContent = 'Position ' + (BLU.idx + 1) + '/' + BLUNDERS.length; document.getElementById('blu-prog').textContent = BLU.correct + ' / ' + BLU.total; hideFB('blu-fb'); document.getElementById('blu-next').style.display = 'none'; document.getElementById('blu-tap-inst').classList.add('hidden'); document.getElementById('blu-yes').className = 'yn-btn yn-yes'; document.getElementById('blu-no').className = 'yn-btn yn-no'; drawBoard('blu-board', b.fen, {}); say(document.getElementById('blu-kip').textContent) }
    function blunderAnswer(saidSafe) { if (BLU.answered) return; sTick(); const b = BLUNDERS[BLU.idx]; const correct = (saidSafe && !b.isB) || (!saidSafe && b.isB); BLU.total++; if (correct) BLU.correct++; BLU.answered = true; document.getElementById(saidSafe ? 'blu-yes' : 'blu-no').className = 'yn-btn ' + (correct ? 'ok' : 'wrong'); document.getElementById(saidSafe ? 'blu-no' : 'blu-yes').className = 'yn-btn ' + (correct ? '' : 'ok'); if (correct && b.isB && b.hang.length > 0) { showFB('blu-fb', '✅ Correct! Tap the hanging piece for bonus!', 'ok'); document.getElementById('blu-tap-inst').classList.remove('hidden'); BLU.phase = 1; earn(1, 'blunder'); drawBoard('blu-board', b.fen, { click: (sn) => blunderTap(sn, b) }) } else if (correct) { showFB('blu-fb', '✅ ' + b.exp, 'ok'); sOk(); confetti(30); earn(2, 'blunder'); document.getElementById('blu-next').style.display = '' } else { showFB('blu-fb', '❌ ' + b.exp, 'no'); sBad(); document.getElementById('blu-next').style.display = '' }; document.getElementById('blu-prog').textContent = BLU.correct + ' / ' + BLU.total }
    function blunderTap(sn, b) { if (BLU.phase !== 1) return; sTick(); if (b.hang.includes(sn)) { BLU.phase = 2; sWin(); confetti(40); earn(2, 'blunder'); showFB('blu-fb', '🎉 Found it! ' + b.exp, 'ok'); drawBoard('blu-board', b.fen, { r: b.hang }); document.getElementById('blu-tap-inst').classList.add('hidden'); document.getElementById('blu-next').style.display = '' } else { showFB('blu-fb', 'Not that one!', 'info'); sBad() } }
    function nextBlunder() { BLU.idx = (BLU.idx + 1) % BLUNDERS.length; loadBlunder() }
    function blunderHint() { showFB('blu-fb', '💡 ' + BLUNDERS[BLU.idx].hint, 'info') }

    // ── CHECKMATE PATTERNS ──
    const PAT_DATA = [
      { id: 'backrank', name: 'Back Rank Mate', icon: '🏰', explain: 'The enemy King is trapped on its back rank by its OWN pawns! Rook or Queen slides in.', fen: '5rk1/5ppp/8/8/8/8/8/R5K1 w - - 0 1', sol: 'a1a8', hint: 'Rook to A8!', task: 'Deliver the Back Rank Mate!' },
      { id: 'smothered', name: 'Smothered Mate', icon: '😤', explain: 'The King is smothered by its OWN pieces! Only a Knight delivers this special mate!', fen: '6rk/6pp/7N/8/8/8/8/6K1 w - - 0 1', sol: 'h6f7', hint: 'Knight to F7!', task: 'Find the Smothered Mate!' },
      { id: 'ladder', name: 'Ladder Mate', icon: '🪜', explain: 'Two Rooks take turns pushing the King to the edge — like climbing a ladder!', fen: '6k1/8/6RR/8/8/8/8/6K1 w - - 0 1', sol: 'h6h8', hint: 'Move one Rook to H8!', task: 'Ladder Mate!' },
      { id: 'arabian', name: 'Arabian Mate', icon: '🐎', explain: 'Rook and Knight team up in the corner! Knight covers escapes, Rook delivers check.', fen: '5Rrk/8/6N1/8/8/8/8/6K1 w - - 0 1', sol: 'f8g8', hint: 'Rook to G8!', task: 'Arabian Mate!' },
      { id: 'scholars', name: "Scholar's Mate", icon: '🎓', explain: "Learn this to AVOID it — Queen+Bishop attack F7! Defend with Nf6!", fen: 'r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4', sol: 'f7', hint: 'Queen on F7 is checkmate.', task: "Scholar's Mate — tap the Queen!" },
    ];
    let PAT = { learned: new Set(), current: null, solSel: null, solSolved: false };
    function initPatterns() { if (document.getElementById('pat-grid').children.length === 0) buildPatGrid() }
    function buildPatGrid() { const grid = document.getElementById('pat-grid'); grid.innerHTML = ''; PAT_DATA.forEach(pat => { const card = document.createElement('div'); card.className = 'pat-card' + (PAT.learned.has(pat.id) ? ' learned' : ''); card.innerHTML = `<div class="pi">${pat.icon}</div><div class="pn">${pat.name}</div><div class="pb2">${PAT.learned.has(pat.id) ? '✅ Learned!' : 'Tap to learn'}</div>`; card.onclick = () => openPat(pat); grid.appendChild(card) }) }
    function openPat(pat) { PAT.current = pat; PAT.solSel = null; PAT.solSolved = false; document.getElementById('pat-grid').classList.add('hidden'); document.getElementById('pat-lesson').classList.remove('hidden'); document.getElementById('pat-lesson-title').textContent = pat.icon + ' ' + pat.name; document.getElementById('pat-explain').textContent = pat.explain; hideFB('pat-fb'); document.getElementById('pat-next').style.display = 'none'; document.getElementById('pat-quiz-area').innerHTML = `<div class="card-sm" style="margin-bottom:8px"><div style="font-weight:800;font-size:.88rem">🎯 ${pat.task}</div></div>`; drawBoard('pat-board', pat.fen, { click: (sn, r, f) => handlePatClick(sn, r, f, pat) }); say(pat.explain) }
    function handlePatClick(sn, r, f, pat) { if (PAT.solSolved) return; sTick(); const bd = parseFEN(pat.fen); const p = bd[r][f]; if (!PAT.solSel) { if (p && p[0] === 'w') { PAT.solSel = sn; const lm = getLegalMovesFiltered(bd, r, f); drawBoard('pat-board', pat.fen, { sel: sn, dot: lm, click: (s2, r2, f2) => handlePatClick(s2, r2, f2, pat) }) } return } const solArr = Array.isArray(pat.sol) ? pat.sol : [pat.sol]; const mv = PAT.solSel + sn; if (solArr.includes(mv) || solArr.includes(sn)) { PAT.solSolved = true; PAT.learned.add(pat.id); const { r: fr, f: ff } = srf(PAT.solSel); const nb = applyMove(bd, fr, ff, r, f); drawBoard('pat-board', nb, { g: [sn] }); showFB('pat-fb', '🏆 Checkmate! You know the ' + pat.name + '! ✅', 'ok'); sWin(); confetti(60); earn(3, 'patterns'); document.getElementById('pat-next').style.display = ''; buildPatGrid(); say('Checkmate!') } else { showFB('pat-fb', '❌ Not checkmate! ' + pat.hint, 'no'); sBad(); PAT.solSel = null; drawBoard('pat-board', pat.fen, { click: (s2, r2, f2) => handlePatClick(s2, r2, f2, pat) }) } }
    function nextPatternChallenge() { const u = PAT_DATA.filter(p => !PAT.learned.has(p.id)); openPat(u.length ? u[0] : PAT_DATA[Math.random() * PAT_DATA.length | 0]) }
    function closePat() { document.getElementById('pat-lesson').classList.add('hidden'); document.getElementById('pat-grid').classList.remove('hidden') }

    // ── COMBINATION BUILDER ──
    const COMBOS = [
      { fen: '6k1/5ppp/8/8/8/8/5PPP/4RRK1 w - - 0 1', m1: { f: 'e1', t: 'e8' }, m1r: { f: 'g8', t: 'h7' }, m2: { f: 'f1', t: 'f7' }, task: 'Mate in 2! Both Rooks cooperate!', h1: 'Rook E1 to E8 — check!', h2: 'Rook F1 to F7 — checkmate!' },
      { fen: '3k4/3Q4/3K4/8/8/8/8/8 w - - 0 1', m1: { f: 'd7', t: 'd8' }, m1r: null, m2: null, task: 'Mate in 1! Queen + King!', h1: 'Queen to D8 is checkmate!', h2: '' },
      { fen: 'r5k1/5ppp/8/8/8/5Q2/8/6K1 w - - 0 1', m1: { f: 'f3', t: 'f7' }, m1r: { f: 'g8', t: 'h8' }, m2: { f: 'f7', t: 'h7' }, task: 'Mate in 2! Queen drives the King to the corner!', h1: 'Queen to F7 — King must retreat!', h2: 'Queen to H7 is checkmate!' },
    ];
    let CMB = { idx: 0, bd: null, step: 1, sel: null, solved: false };
    function initCombo() { CMB.idx = Math.floor(Math.random() * COMBOS.length); loadCombo() }
    function loadCombo() { const c = COMBOS[CMB.idx]; CMB.bd = parseFEN(c.fen); CMB.step = 1; CMB.sel = null; CMB.solved = false; document.getElementById('cmb-kip').textContent = c.task; document.getElementById('cmb-turn').textContent = '⬜ Move 1 of ' + (c.m1r ? 2 : 1); hideFB('cmb-fb'); document.getElementById('cmb-next').style.display = 'none'; buildComboSteps(c); drawBoard('cmb-board', CMB.bd, { click: (sn, r, f) => handleCombo(sn, r, f, c) }); say(c.task) }
    function buildComboSteps(c) { const div = document.getElementById('cmb-steps'); div.innerHTML = ''; const steps = c.m1r ? ['Move 1 ⬜', 'Bot responds ⬛', 'Move 2 ⬜ — Checkmate!'] : ['Move 1 ⬜ — Checkmate!']; steps.forEach((s, i) => { const span = document.createElement('span'); span.className = 'combo-step' + (i === 0 ? ' active' : ''); span.id = 'cs-' + i; span.textContent = s; div.appendChild(span) }) }
    function handleCombo(sn, r, f, c) { if (CMB.solved) return; sTick(); const p = CMB.bd[r][f]; if (!CMB.sel) { if (p && p[0] === 'w') { CMB.sel = sn; const lm = getLegalMovesFiltered(CMB.bd, r, f); drawBoard('cmb-board', CMB.bd, { sel: sn, dot: lm, click: (s2, r2, f2) => handleCombo(s2, r2, f2, c) }) } return } if (sn === CMB.sel) { CMB.sel = null; drawBoard('cmb-board', CMB.bd, { click: (s2, r2, f2) => handleCombo(s2, r2, f2, c) }); return } const move = CMB.step === 1 ? c.m1 : c.m2; const { r: fr, f: ff } = srf(CMB.sel); const legal = getLegalMovesFiltered(CMB.bd, fr, ff); if (!legal.includes(sn)) { showFB('cmb-fb', "Can't move there!", 'no'); sBad(); CMB.sel = null; drawBoard('cmb-board', CMB.bd, { click: (s2, r2, f2) => handleCombo(s2, r2, f2, c) }); return } if (CMB.sel === move.f && sn === move.t) { CMB.bd = applyMove(CMB.bd, fr, ff, r, f); CMB.sel = null; const cs = document.getElementById('cs-' + (CMB.step - 1)); if (cs) cs.className = 'combo-step done'; if (CMB.step === 1 && c.m1r) { showFB('cmb-fb', '✅ Perfect! Watch the bot...', 'ok'); sOk(); CMB.step = 2; document.getElementById('cmb-turn').textContent = '⬛ Bot responds...'; drawBoard('cmb-board', CMB.bd, { g: [sn] }); const cs1 = document.getElementById('cs-1'); if (cs1) cs1.className = 'combo-step active'; setTimeout(() => { const resp = c.m1r; const { r: rr, f: rf } = srf(resp.t); CMB.bd = applyMove(CMB.bd, ...Object.values(srf(resp.f)), rr, rf); drawBoard('cmb-board', CMB.bd, { y: [resp.t], click: (s2, r2, f2) => handleCombo(s2, r2, f2, c) }); showFB('cmb-fb', 'Bot played! Find Move 2!', 'info'); document.getElementById('cmb-turn').textContent = '⬜ Move 2 — Checkmate!'; const cs1b = document.getElementById('cs-1'); if (cs1b) cs1b.className = 'combo-step done'; const cs2 = document.getElementById('cs-2'); if (cs2) cs2.className = 'combo-step active' }, 900) } else { if (isCheckmate(CMB.bd, 'b')) { CMB.solved = true; drawBoard('cmb-board', CMB.bd, { g: [sn] }); showFB('cmb-fb', '🏆 CHECKMATE! +5 stars!', 'ok'); sWin(); confetti(80); earn(5, 'combo'); document.getElementById('cmb-next').style.display = ''; say('Checkmate!') } else { showFB('cmb-fb', 'Good! But find checkmate!', 'info'); sOk(); drawBoard('cmb-board', CMB.bd, { click: (s2, r2, f2) => handleCombo(s2, r2, f2, c) }) } } } else { showFB('cmb-fb', '❌ Wrong move! ' + (CMB.step === 1 ? c.h1 : c.h2), 'no'); sBad(); CMB.sel = null; drawBoard('cmb-board', CMB.bd, { click: (s2, r2, f2) => handleCombo(s2, r2, f2, c) }) } }
    function nextCombo() { CMB.idx = (CMB.idx + 1) % COMBOS.length; loadCombo() }
    function comboHint() { const c = COMBOS[CMB.idx]; showFB('cmb-fb', '💡 ' + (CMB.step === 1 ? c.h1 : c.h2), 'info') }

    // ── ENDGAME COACH ──
    const ENDGAMES = {
      kqk: {
        title: 'King + Queen vs King', steps: [
          { instr: 'Step 1: Queen to D5 — restrict the enemy King!', task: 'Move Queen to D5.', fen: '3k4/8/8/8/8/8/8/3QK3 w - - 0 1', tf: 'd1', tt: 'd5' },
          { instr: 'Step 2: King to E2 — march forward!', task: 'King to E2.', fen: '3k4/8/8/3Q4/8/8/8/4K3 w - - 0 1', tf: 'e1', tt: 'e2' },
          { instr: 'Step 3: Queen to D7 — push the King to the back rank!', task: 'Queen to D7!', fen: '3k4/8/8/3Q4/8/8/4K3/8 w - - 0 1', tf: 'd5', tt: 'd7' },
          { instr: 'Step 4: Checkmate! Queen to D8!', task: 'Queen to D8!', fen: '3k4/3Q4/3K4/8/8/8/8/8 w - - 0 1', tf: 'd7', tt: 'd8' },
        ]
      },
      krk: {
        title: 'King + Rook vs King', steps: [
          { instr: 'Step 1: Rook to A7 — cut off the enemy King!', task: 'Rook to A7!', fen: '3k4/8/8/8/8/8/8/R3K3 w - - 0 1', tf: 'a1', tt: 'a7' },
          { instr: 'Step 2: King to E2 — advance!', task: 'King to E2.', fen: '3k4/R7/8/8/8/8/8/4K3 w - - 0 1', tf: 'e1', tt: 'e2' },
          { instr: 'Step 3: Rook to A8!', task: 'Rook to A8!', fen: '2k5/R7/8/8/8/3K4/8/8 w - - 0 1', tf: 'a7', tt: 'a8' },
          { instr: 'Step 4: Checkmate!', task: 'Rook to A8 — checkmate!', fen: '2k5/8/2K5/8/8/8/8/R7 w - - 0 1', tf: 'a1', tt: 'a8' },
        ]
      },
      kpk: {
        title: 'King + Pawn vs King', steps: [
          { instr: 'Step 1: KING LEADS! King to D5 — in front of the pawn!', task: 'King to D5!', fen: '8/8/3k4/8/3K4/3P4/8/8 w - - 0 1', tf: 'd4', tt: 'd5' },
          { instr: 'Step 2: Push the pawn to D4!', task: 'Pawn to D4!', fen: '8/8/8/2kK4/8/3P4/8/8 w - - 0 1', tf: 'd3', tt: 'd4' },
          { instr: 'Step 3: King to D6!', task: 'King to D6!', fen: '8/8/8/3K4/3k4/3P4/8/8 w - - 0 1', tf: 'd5', tt: 'd6' },
          { instr: 'Step 4: Pawn to D5!', task: 'Pawn to D5!', fen: '8/8/3K4/8/3k4/3P4/8/8 w - - 0 1', tf: 'd3', tt: 'd5' },
        ]
      },
    };
    let END = { type: null, step: 0, bd: null, sel: null, done: false };
    function initEndCoach() { document.getElementById('end-menu').classList.remove('hidden'); document.getElementById('end-lesson').classList.add('hidden') }
    function startEndgame(type) { END = { type, step: 0, bd: null, sel: null, done: false }; const eg = ENDGAMES[type]; document.getElementById('end-kip').textContent = eg.title + ' — Follow the steps!'; document.getElementById('end-menu').classList.add('hidden'); document.getElementById('end-lesson').classList.remove('hidden'); buildEndSteps(eg); loadEndStep() }
    function buildEndSteps(eg) { const div = document.getElementById('end-steps'); div.innerHTML = ''; eg.steps.forEach((s, i) => { const item = document.createElement('div'); item.className = 'step-item' + (i === 0 ? ' active' : ''); item.id = 'es-' + i; item.innerHTML = `<div class="step-num">${i + 1}</div><span>${s.instr}</span>`; div.appendChild(item) }) }
    function loadEndStep() { const eg = ENDGAMES[END.type]; if (!eg) return; const step = eg.steps[END.step]; if (!step) return; END.bd = parseFEN(step.fen); END.sel = null; showFB('end-fb', step.task, 'info'); document.getElementById('end-next').style.display = 'none'; document.getElementById('end-steps').querySelectorAll('.step-item').forEach((el, i) => { el.className = 'step-item' + (i < END.step ? ' done' : i === END.step ? ' active' : '') }); drawBoard('end-board', END.bd, { click: (sn, r, f) => handleEnd(sn, r, f, step) }); say(step.instr) }
    function handleEnd(sn, r, f, step) { if (END.done) return; sTick(); const p = END.bd[r][f]; if (!END.sel) { if (p && p[0] === 'w') { END.sel = sn; drawBoard('end-board', END.bd, { sel: sn, dot: getLegalMovesFiltered(END.bd, r, f), click: (s2, r2, f2) => handleEnd(s2, r2, f2, step) }) } return } if (sn === END.sel) { END.sel = null; drawBoard('end-board', END.bd, { click: (s2, r2, f2) => handleEnd(s2, r2, f2, step) }); return } const { r: fr, f: ff } = srf(END.sel); const legal = getLegalMovesFiltered(END.bd, fr, ff); if (!legal.includes(sn)) { showFB('end-fb', 'Cannot! ' + step.task, 'no'); sBad(); END.sel = null; drawBoard('end-board', END.bd, { click: (s2, r2, f2) => handleEnd(s2, r2, f2, step) }); return } if (END.sel === step.tf && sn === step.tt) { END.bd = applyMove(END.bd, fr, ff, r, f); END.sel = null; drawBoard('end-board', END.bd, { g: [sn] }); sOk(); earn(2, 'endcoach'); document.getElementById('es-' + END.step).className = 'step-item done'; END.step++; const eg = ENDGAMES[END.type]; if (END.step >= eg.steps.length) { END.done = true; showFB('end-fb', '🏆 Lesson complete! +5 bonus!', 'ok'); sWin(); confetti(60); earn(5, 'endcoach'); say('Endgame complete!') } else { showFB('end-fb', '✅ ' + eg.steps[END.step].instr, 'ok'); document.getElementById('end-next').style.display = '' } } else { showFB('end-fb', '❌ Move ' + step.tf + ' to ' + step.tt, 'no'); sBad(); END.sel = null; drawBoard('end-board', END.bd, { click: (s2, r2, f2) => handleEnd(s2, r2, f2, step) }) } }
    function endgameNext() { loadEndStep() }
    function endgameHint() { const step = ENDGAMES[END.type]?.steps[END.step]; if (step) showFB('end-fb', '💡 Move ' + step.tf + ' to ' + step.tt, 'info') }
    function resetEndgame() { END.step = 0; loadEndStep() }

    // ── OPENING LAB ──
    const OPENINGS = [
      { cat: 'principles', q: 'Which first move is BETTER for White?', hint: 'Control the center!', o1: { label: '1. e4 ✅', fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', ok: true, why: 'E4 controls the center!' }, o2: { label: '1. a4 ❌', fen: 'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR b KQkq - 0 1', ok: false, why: 'A4 does nothing for center!' } },
      { cat: 'principles', q: 'After 1.e4 e5, which move is better?', hint: 'Develop toward center!', o1: { label: '2. Nf3 ✅', fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2', ok: true, why: 'Knight develops AND attacks!' }, o2: { label: '2. h3 ❌', fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/7P/PPPP1PP1/RNBQKBNR b KQkq - 0 2', ok: false, why: 'H3 wastes a move!' } },
      { cat: 'castling', q: 'Your King is in the center. What should you do?', hint: 'Castle early for safety!', o1: { label: 'Castle Kingside ✅', fen: 'r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 w - - 0 6', ok: true, why: 'Castle! King to safety!' }, o2: { label: 'Keep King in center ❌', fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5', ok: false, why: 'King in center is dangerous!' } },
    ];
    let OP = { cat: 'all', idx: 0, answered: false }; let opBuilt = false;
    function initOpening() { if (!opBuilt) { opBuilt = true; buildOpCats() } loadOpening() }
    function buildOpCats() { const nav = document.getElementById('op-cats'); nav.innerHTML = '';[{ id: 'all', lbl: 'All' }, { id: 'principles', lbl: '📐 Principles' }, { id: 'castling', lbl: '🏰 Castling' }].forEach(cat => { const b = document.createElement('button'); b.className = 'pcat' + (cat.id === 'all' ? ' on' : ''); b.textContent = cat.lbl; b.onclick = () => { document.querySelectorAll('#s-opening .pcat').forEach(x => x.classList.remove('on')); b.classList.add('on'); OP.cat = cat.id; OP.idx = 0; loadOpening() }; nav.appendChild(b) }) }
    function getOpList() { return OP.cat === 'all' ? OPENINGS : OPENINGS.filter(o => o.cat === OP.cat) }
    function loadOpening() { const list = getOpList(); if (!list.length) return; const op = list[OP.idx % list.length]; OP.answered = false; document.getElementById('op-kip').textContent = op.q; document.getElementById('op-ctr').textContent = 'Q ' + (OP.idx % list.length + 1) + '/' + list.length; hideFB('op-fb'); document.getElementById('op-next').style.display = 'none'; buildOpChoice(op); say(op.q) }
    function buildOpChoice(op) { const div = document.getElementById('op-choices'); div.innerHTML = '';[op.o1, op.o2].sort(() => Math.random() - .5).forEach(opt => { const card = document.createElement('div'); card.className = 'op-card'; const bw = document.createElement('div'); bw.className = 'op-bw'; const bd = document.createElement('div'); bd.className = 'op-board board'; const bid = 'opb-' + Math.random().toString(36).slice(2, 8); bd.id = bid; const lbl = document.createElement('div'); lbl.className = 'op-label'; lbl.textContent = opt.label; card.appendChild(lbl); bw.appendChild(bd); card.appendChild(bw); card.onclick = () => { if (OP.answered) return; OP.answered = true; sTick(); if (opt.ok) { sOk(); confetti(30); earn(2, 'opening'); showFB('op-fb', '✅ ' + opt.why, 'ok'); card.classList.add('ok') } else { sBad(); showFB('op-fb', '❌ ' + opt.why, 'no'); card.classList.add('no') }; document.getElementById('op-next').style.display = ''; say(opt.why) }; div.appendChild(card); setTimeout(() => drawBoard(bid, opt.fen, {}), 50) }) }
    function nextOpening() { OP.idx = (OP.idx + 1) % Math.max(getOpList().length, 1); loadOpening() }

    // ── WHO'S WINNING ──
    const EVALS = [
      { fen: '3k4/3q4/8/8/8/8/3Q4/3K4 w - - 0 1', ans: 'equal', w: 9, b: 9, hint: 'Both have a Queen!', exp: 'Equal! Both have a Queen (9 pts each).' },
      { fen: '3k4/8/8/8/3R4/8/8/3K4 w - - 0 1', ans: 'white', w: 5, b: 0, hint: 'White Rook=5, Black has nothing.', exp: 'White is winning! Rook (5) vs nothing!' },
      { fen: '3k4/3q4/8/8/8/8/8/3K4 w - - 0 1', ans: 'black', w: 0, b: 9, hint: 'Black Queen=9, White has nothing.', exp: 'Black is winning! Queen (9) vs nothing!' },
      { fen: '3k4/3p4/8/3P4/8/8/8/3K4 w - - 0 1', ans: 'equal', w: 1, b: 1, hint: 'Both have one pawn!', exp: 'Equal! One pawn each.' },
      { fen: '3k4/3r4/8/8/3RR3/8/8/3K4 w - - 0 1', ans: 'white', w: 10, b: 5, hint: 'White: 2 Rooks=10. Black: 1 Rook=5.', exp: 'White winning! Two Rooks (10) vs one Rook (5)!' },
    ];
    let EV = { idx: 0, correct: 0, total: 0, answered: false };
    function initEval() { EV = { idx: Math.floor(Math.random() * EVALS.length), correct: 0, total: 0, answered: false }; loadEval() }
    function loadEval() { const e = EVALS[EV.idx]; EV.answered = false; document.getElementById('ev-ctr').textContent = 'Position ' + (EV.idx + 1) + '/' + EVALS.length; document.getElementById('ev-mat').textContent = '⬜ White: ' + e.w + ' pts | ⬛ Black: ' + e.b + ' pts'; document.getElementById('ev-prog').textContent = EV.correct + ' / ' + EV.total; hideFB('ev-fb'); document.getElementById('ev-next').style.display = 'none';['ev-w', 'ev-e', 'ev-b'].forEach(id => { const el = document.getElementById(id); if (el) el.className = 'eval-opt' }); drawBoard('ev-board', e.fen, {}); say('Who is winning?') }
    function evalAnswer(ans) { if (EV.answered) return; sTick(); EV.answered = true; EV.total++; const e = EVALS[EV.idx]; const correct = ans === e.ans; if (correct) EV.correct++; const map = { white: 'ev-w', equal: 'ev-e', black: 'ev-b' }; document.getElementById(map[ans]).classList.add(correct ? 'ok' : 'no'); document.getElementById(map[e.ans]).classList.add('ok'); if (correct) { showFB('ev-fb', '✅ ' + e.exp, 'ok'); sOk(); confetti(25); earn(2, 'eval') } else { showFB('ev-fb', '❌ ' + e.exp, 'no'); sBad() }; document.getElementById('ev-prog').textContent = EV.correct + ' / ' + EV.total; document.getElementById('ev-next').style.display = ''; say(e.exp) }
    function nextEval() { EV.idx = (EV.idx + 1) % EVALS.length; loadEval() }
    function evalHint() { showFB('ev-fb', '💡 ' + EVALS[EV.idx].hint, 'info') }

    // ── PAWN SCHOOL ──
    const PAWNS = [
      { cat: 'passed', fen: '3k4/8/8/3P4/8/8/8/3K4 w - - 0 1', task: 'Which pawn is a PASSED PAWN? Tap it!', hint: 'No enemy pawns on same or adjacent files in front!', ans: ['d5'], type: 'spot', exp: 'D5 is passed! No Black pawn can stop it!' },
      { cat: 'promotion', fen: '3k4/3P4/8/8/8/8/8/3K4 w - - 0 1', task: 'Tap where the D7 pawn should go to promote!', hint: 'Pawns promote on the last rank!', ans: ['d8'], type: 'spot', exp: 'D8! Pawn becomes a Queen!' },
      { cat: 'race', fen: '3k4/8/3p4/8/3P4/8/8/3K4 w - - 0 1', task: 'Who promotes first — White D4 or Black D6?', hint: 'White needs 4 moves, Black needs 5.', ans: [], type: 'yn', q: 'Does White win this pawn race?', ya: true, exp: 'Yes! White promotes in 4 moves, Black needs 5!' },
      { cat: 'structure', fen: '3k4/pp6/8/8/8/8/PP6/3K4 w - - 0 1', task: 'Are connected A+B pawns stronger than isolated ones?', hint: 'Connected pawns defend each other!', ans: [], type: 'yn', q: 'Are connected pawns stronger than isolated?', ya: true, exp: 'Yes! Connected pawns defend each other!' },
    ];
    const PWCATS = [{ id: 'all', lbl: 'All' }, { id: 'passed', lbl: '🏃 Passed' }, { id: 'promotion', lbl: '⬆️ Promote' }, { id: 'race', lbl: '🏁 Race' }, { id: 'structure', lbl: '🏗️ Structure' }];
    let PW = { cat: 'all', idx: 0, answered: false }; let pwBuilt = false;
    function initPawn() { if (!pwBuilt) { pwBuilt = true; buildPwCats() } loadPawn() }
    function buildPwCats() { const nav = document.getElementById('pw-cats'); nav.innerHTML = ''; PWCATS.forEach(cat => { const b = document.createElement('button'); b.className = 'pcat' + (cat.id === 'all' ? ' on' : ''); b.textContent = cat.lbl; b.onclick = () => { document.querySelectorAll('#s-pawn .pcat').forEach(x => x.classList.remove('on')); b.classList.add('on'); PW.cat = cat.id; PW.idx = 0; loadPawn() }; nav.appendChild(b) }) }
    function getPwList() { return PW.cat === 'all' ? PAWNS : PAWNS.filter(p => p.cat === PW.cat) }
    function loadPawn() { const list = getPwList(); if (!list.length) return; const pw = list[PW.idx % list.length]; PW.answered = false; document.getElementById('pw-kip').textContent = pw.task; document.getElementById('pw-ctr').textContent = 'Q ' + (PW.idx % list.length + 1) + '/' + list.length; hideFB('pw-fb'); document.getElementById('pw-next').style.display = 'none'; const ch = document.getElementById('pw-choices'); ch.innerHTML = ''; say(pw.task); if (pw.type === 'spot') { drawBoard('pw-board', pw.fen, { click: (sn) => handlePawnSpot(sn, pw) }) } else { drawBoard('pw-board', pw.fen, {}); if (pw.q) { const q = document.createElement('div'); q.style.cssText = 'font-weight:800;font-size:.88rem;margin-bottom:8px;padding:9px 12px;background:var(--card);border:2.5px solid var(--ink);border-radius:var(--r-sm)'; q.textContent = pw.q; ch.appendChild(q) } const yn = document.createElement('div'); yn.className = 'yn-row';['Yes ✅', 'No ❌'].forEach((lbl, i) => { const b = document.createElement('button'); b.className = 'yn-btn ' + (i === 0 ? 'yn-yes' : 'yn-no'); b.textContent = lbl; b.onclick = () => { if (PW.answered) return; PW.answered = true; sTick(); const ok = (i === 0) === pw.ya; if (ok) { sOk(); confetti(25); earn(2, 'pawn'); showFB('pw-fb', '✅ ' + pw.exp, 'ok'); b.className = 'yn-btn ok' } else { sBad(); showFB('pw-fb', '❌ ' + pw.exp, 'no'); b.className = 'yn-btn wrong' }; document.getElementById('pw-next').style.display = ''; say(pw.exp) }; yn.appendChild(b) }); ch.appendChild(yn) } }
    function handlePawnSpot(sn, pw) { if (PW.answered) return; sTick(); PW.answered = true; if (pw.ans.includes(sn)) { sOk(); confetti(25); earn(2, 'pawn'); showFB('pw-fb', '✅ ' + pw.exp, 'ok'); drawBoard('pw-board', pw.fen, { g: [sn] }) } else { sBad(); showFB('pw-fb', '❌ ' + pw.exp, 'no'); drawBoard('pw-board', pw.fen, { r: [sn], g: pw.ans }) }; document.getElementById('pw-next').style.display = '' }
    function nextPawn() { PW.idx = (PW.idx + 1) % Math.max(getPwList().length, 1); loadPawn() }
    function pawnHint() { showFB('pw-fb', '💡 ' + getPwList()[PW.idx % getPwList().length].hint, 'info') }

    // ── DEFEND THE KING ──
    const DK_CONCEPTS = {
      move: { em: '🏃', name: 'Move Away!', exp: 'When your King is attacked, MOVE it to a safe square the enemy cannot reach!' },
      block: { em: '🧱', name: 'Block!', exp: 'If a Rook, Bishop or Queen attacks your King in a straight line, PUT A PIECE IN BETWEEN to block!' },
      capture: { em: '⚔️', name: 'Capture!', exp: 'Sometimes you can TAKE the piece attacking your King! Capture it and the check is over!' },
      protect: { em: '🛡️', name: 'Protect!', exp: 'Before the enemy takes your piece, DEFEND it so if they capture, you can recapture back.' }
    };
    const DK_SCENARIOS = {
      move: [
        { fen: '4K3/8/8/8/8/8/8/4r3 w - - 0 1', task: 'King on E8 is in CHECK from Rook on E1! Move to safety!', hint: 'E-file is dangerous! Try D7, D8, F7 or F8.', answers: ['d7', 'f7', 'd8', 'f8'], bad: ['e7'], explain: 'King escaped the E-file!' },
        { fen: '7k/8/7R/8/8/8/8/7K w - - 0 1', task: 'Black King on H8 is in CHECK from Rook H6! Escape!', hint: 'H-file is dangerous! Move to G8 or G7.', answers: ['g8', 'g7'], bad: ['h7'], explain: 'G8 or G7 — off the H-file!' },
        { fen: '3K4/8/3q4/8/8/8/8/7k w - - 0 1', task: 'King on D8 in CHECK from Queen D6! Find a safe escape!', hint: 'D-file is dangerous! Try C7 or E7.', answers: ['c7', 'e7'], bad: ['d7'], explain: 'King to C7 or E7 escapes!' },
      ],
      block: [
        { fen: '6k1/8/6R1/8/8/8/8/6K1 w - - 0 1', task: 'Black King on G8 in CHECK from Rook G6! Tap the BLOCKING square!', hint: 'Only G7 sits between G6 and G8.', answers: ['g7'], bad: ['g8', 'g6'], type: 'block-sq', explain: 'G7 is the only blocking square!' },
        { fen: '3k4/3R4/8/8/8/8/8/3r3K w - - 0 1', task: 'White King on H1 in CHECK from Black Rook D1! Tap a BLOCKING square!', hint: 'Tap E1, F1 or G1.', answers: ['e1', 'f1', 'g1'], bad: ['h1', 'd1'], type: 'block-sq', explain: 'Placing a piece on E1-G1 blocks the check!' },
        { fen: '4K3/8/8/8/8/8/4r3/4q3 w - - 0 1', task: 'King on E8 in CHECK from Queen E1! Tap a BLOCKING square!', hint: 'Any square between E2-E7 blocks it.', answers: ['e7', 'e6', 'e5', 'e4', 'e3', 'e2'], bad: ['e8'], type: 'block-sq', explain: 'Blocking puts a piece between attacker and King!' },
      ],
      capture: [
        { fen: '6k1/8/8/8/8/8/6r1/6K1 w - - 0 1', task: 'King on G1 in CHECK from Rook G2! King can CAPTURE it — tap the Rook!', hint: 'Rook on G2 is right next to the King — step to G2!', answers: ['g2'], bad: ['g1', 'h1'], type: 'capture-piece', explain: 'King captured the Rook on G2!' },
        { fen: '5k2/8/5q2/8/8/8/5R2/5K2 w - - 0 1', task: 'King in CHECK from Queen F6! White Rook can CAPTURE it! Tap the Queen!', hint: 'Rook on F2 slides up to F6!', answers: ['f6'], bad: ['f1', 'f2'], type: 'capture-piece', explain: 'Rook takes Queen — check gone AND you win the Queen!' },
        { fen: '3k4/8/8/3r4/8/3K4/8/8 w - - 0 1', task: 'King in CHECK from Rook D5! Go sideways — D4 is still dangerous!', hint: 'Move to C3, E3, C4 or E4.', answers: ['c3', 'e3', 'c4', 'e4'], bad: ['d4'], type: 'capture-piece', explain: 'Moving sideways escapes the D-file check!' },
      ],
      protect: [
        { fen: '3k4/3q4/8/8/8/3R4/8/3K4 w - - 0 1', task: 'Black Queen threatens your Rook D3! PROTECT the Rook — tap a defending piece!', hint: 'King can step closer to D3 to defend it.', answers: ['d1'], protect_sq: 'd3', type: 'protect-piece', explain: 'King defends the Rook! Now Queen taking Rook loses to King recapture!' },
        { fen: '3k4/8/8/5b2/5P3/8/8/3K4 w - - 0 1', task: 'Black Bishop threatens your Pawn F4! PROTECT it!', hint: 'King on D1 can step to E2 to defend.', answers: ['d1', 'e2'], protect_sq: 'f4', type: 'protect-piece', explain: 'King stepping to E3 defends the F4 pawn!' },
        { fen: '3k4/8/8/3r4/3P4/8/8/3K4 w - - 0 1', task: 'Black Rook attacks your Pawn D4! PROTECT it!', hint: 'King needs to advance toward D3.', answers: ['d1', 'e1', 'c1'], protect_sq: 'd4', type: 'protect-piece', explain: 'Moving the King toward D3 protects the pawn!' },
      ],
    };
    let DK = { skill: 'move', idx: 0, answered: false, hintUsed: 0 };
    function initDefendCheck() { dkSetSkill('move') }
    function dkSetSkill(skill) { DK.skill = skill; DK.idx = 0; DK.answered = false; DK.hintUsed = 0;['move', 'block', 'capture', 'protect'].forEach(s => { const btn = document.getElementById('dk-tab-' + s); if (btn) btn.classList.toggle('on', s === skill) }); const con = DK_CONCEPTS[skill]; document.getElementById('dk-con-em').textContent = con.em; document.getElementById('dk-con-name').textContent = con.name; document.getElementById('dk-con-exp').textContent = con.exp; dkLoad() }
    function dkLoad() { const scenarios = DK_SCENARIOS[DK.skill]; const sc = scenarios[DK.idx % scenarios.length]; DK.answered = false; DK.hintUsed = 0; document.getElementById('dk-ctr').textContent = 'Scenario ' + (DK.idx % scenarios.length + 1) + '/' + scenarios.length; document.getElementById('dk-kip').textContent = sc.task; hideFB('dk-fb'); document.getElementById('dk-next').style.display = 'none'; const dots = document.getElementById('dk-dots'); dots.innerHTML = ''; for (let i = 0; i < 3; i++) { const d = document.createElement('div'); d.className = 'hint-dot'; d.id = 'dk-dot-' + i; dots.appendChild(d) } const oldYn = document.getElementById('dk-yn'); if (oldYn) oldYn.remove(); say(sc.task); drawBoard('dk-board', sc.fen, { click: (sn, r, f) => dkClick(sn, r, f, sc) }) }
    function dkClick(sn, r, f, sc) { if (DK.answered) return; sTick(); const correct = sc.answers && sc.answers.includes(sn); const isBad = sc.bad && sc.bad.includes(sn); if (correct) { DK.answered = true; drawBoard('dk-board', sc.fen, { g: [sn] }); showFB('dk-fb', '🎉 ' + sc.explain, 'ok'); sOk(); confetti(40); earn(2, 'defend'); document.getElementById('dk-next').style.display = ''; say(sc.explain) } else if (isBad) { showFB('dk-fb', '❌ Dangerous! ' + sc.hint, 'no'); sBad(); drawBoard('dk-board', sc.fen, { r: [sn], click: (sn2, r2, f2) => dkClick(sn2, r2, f2, sc) }) } else { showFB('dk-fb', 'Not quite! Try again.', 'info'); sBad() } }
    function dkHint() { const sc = DK_SCENARIOS[DK.skill][DK.idx % DK_SCENARIOS[DK.skill].length]; showFB('dk-fb', '💡 ' + sc.hint, 'info'); DK.hintUsed++; const dot = document.getElementById('dk-dot-' + (DK.hintUsed - 1)); if (dot) dot.classList.add('used'); if (sc.answers && sc.answers.length > 0) drawBoard('dk-board', sc.fen, { y: sc.answers, r: sc.bad || [], click: (sn, r, f) => dkClick(sn, r, f, sc) }); say(sc.hint) }
    function dkNext() { DK.idx++; dkLoad() }

    // ── DOUBLE LADDER ──
    const LD_MODES = {
      learn: {
        steps: [
          { fen: '6k1/8/6R1/8/8/R7/8/6K1 w - - 0 1', task: '📖 Rook on G6 leaps to G7 — leapfrogging ahead! Tap G6 Rook.', from: 'g6', to: 'g7', explain: 'One Rook holds the rank while the other leaps ONE rank ahead!', hint: 'G6 → G7' },
          { fen: '6k1/6R1/8/8/R7/8/8/6K1 w - - 0 1', task: 'A4 Rook to A8 — check! Tap the A4 Rook.', from: 'a4', to: 'a8', explain: 'Second Rook leaps to the 8th rank — check! King must move.', hint: 'A4 → A8' },
          { fen: '6k1/R7/6R1/8/8/8/8/6K1 w - - 0 1', task: 'G6 Rook to H6 — cut off all escapes!', from: 'g6', to: 'h6', explain: 'Adjust Rooks to cover all corner escape squares!', hint: 'G6 → H6' },
        ]
      },
      practice: {
        steps: [
          { fen: '4k3/8/4R3/8/R7/8/8/4K3 w - - 0 1', task: '🎯 E6 Rook to E7 — push the King back!', from: 'e6', to: 'e7', explain: 'Push the King rank by rank!', hint: 'E6 → E7' },
          { fen: '4k3/4R3/8/R7/8/8/8/4K3 w - - 0 1', task: 'A5 Rook to A8 — check!', from: 'a5', to: 'a8', explain: 'Check forces King to move!', hint: 'A5 → A8' },
          { fen: '3k4/4R3/R7/8/8/8/8/4K3 w - - 0 1', task: 'E7 Rook to E8!', from: 'e7', to: 'e8', explain: 'Push the King to the back!', hint: 'E7 → E8' },
        ]
      },
      challenge: {
        steps: [
          { fen: '7k/8/6R1/8/R7/8/8/7K w - - 0 1', task: '🏆 A4 Rook to A8 — check!', from: 'a4', to: 'a8', explain: 'Check! King must move.', hint: 'A4 → A8' },
          { fen: '6k1/8/R5R1/8/8/8/8/7K w - - 0 1', task: 'G6 Rook to G7 — check!', from: 'g6', to: 'g7', explain: 'Ladder step 2!', hint: 'G6 → G7' },
          { fen: '7k/6R1/R7/8/8/8/8/7K w - - 0 1', task: 'A6 Rook to A8 — check!', from: 'a6', to: 'a8', explain: 'Ladder step 3!', hint: 'A6 → A8' },
          { fen: '6k1/6R1/R7/8/8/8/8/7K w - - 0 1', task: 'G7 Rook to G8 — CHECKMATE!', from: 'g7', to: 'g8', explain: 'Checkmate! Perfect Double Ladder!', hint: 'G7 → G8' },
        ]
      },
    };
    let LD = { mode: 'learn', step: 0, sel: null, done: false };
    function initLadder() { ldSetMode('learn') }
    function ldSetMode(mode) { LD = { mode, step: 0, sel: null, done: false };['learn', 'practice', 'challenge'].forEach(m => { const btn = document.getElementById('ld-tab-' + m); if (btn) btn.classList.toggle('on', m === mode) }); ldLoad() }
    function ldLoad() { const modeData = LD_MODES[LD.mode]; if (!modeData) return; const step = modeData.steps[LD.step]; if (!step) return; LD.sel = null; LD.done = false; document.getElementById('ld-task').textContent = step.task; hideFB('ld-fb'); document.getElementById('ld-next').style.display = 'none'; ldBuildProgress(modeData.steps.length); drawBoard('ld-board', step.fen, { click: (sn, r, f) => handleLadder(sn, r, f, step) }); say(step.task) }
    function ldBuildProgress(total) { const div = document.getElementById('ld-progress'); div.innerHTML = ''; const lbl = document.createElement('span'); lbl.style.cssText = 'font-weight:800;font-size:.78rem;color:#888;margin-right:4px'; lbl.textContent = 'Step:'; div.appendChild(lbl); for (let i = 0; i < total; i++) { const d = document.createElement('div'); d.className = 'lp-rank' + (i < LD.step ? ' done' : i === LD.step ? ' active' : ''); d.textContent = i + 1; div.appendChild(d) } }
    function handleLadder(sn, r, f, step) { if (LD.done) return; sTick(); const bd = parseFEN(step.fen); const p = bd[r][f]; if (!LD.sel) { if (p && p[0] === 'w' && p[1] === 'R') { LD.sel = sn; const lm = getLegalMovesFiltered(bd, r, f); drawBoard('ld-board', step.fen, { sel: sn, dot: lm, click: (s2, r2, f2) => handleLadder(s2, r2, f2, step) }) } return } if (sn === LD.sel) { LD.sel = null; drawBoard('ld-board', step.fen, { click: (s2, r2, f2) => handleLadder(s2, r2, f2, step) }); return } const { r: fr, f: ff } = srf(LD.sel); const legal = getLegalMovesFiltered(bd, fr, ff); if (!legal.includes(sn)) { showFB('ld-fb', 'Cannot! ' + step.hint, 'no'); sBad(); LD.sel = null; drawBoard('ld-board', step.fen, { click: (s2, r2, f2) => handleLadder(s2, r2, f2, step) }); return } if (LD.sel === step.from && sn === step.to) { LD.done = true; const nb = applyMove(bd, fr, ff, r, f); drawBoard('ld-board', nb, { g: [sn] }); showFB('ld-fb', '✅ ' + step.explain, 'ok'); sOk(); earn(2, 'ladder'); document.getElementById('ld-next').style.display = ''; say(step.explain); if (isCheckmate(nb, 'b')) { sWin(); confetti(80); earn(5, 'ladder'); showFB('ld-fb', '🏆 CHECKMATE! Perfect Double Ladder!', 'ok') } } else { showFB('ld-fb', 'Wrong! ' + step.hint, 'no'); sBad(); LD.sel = null; drawBoard('ld-board', step.fen, { click: (s2, r2, f2) => handleLadder(s2, r2, f2, step) }) } }
    function ldNext() { const modeData = LD_MODES[LD.mode]; LD.step = (LD.step + 1) % modeData.steps.length; ldLoad() }
    function ldHint() { const step = LD_MODES[LD.mode].steps[LD.step]; showFB('ld-fb', '💡 ' + step.hint, 'info'); drawBoard('ld-board', step.fen, { y: [step.to], sel: step.from, click: (sn, r, f) => handleLadder(sn, r, f, step) }); say(step.hint) }
    function ldReset() { LD.step = 0; ldLoad() }

    // ── FORK & DOUBLE ATTACK ──
    const FT_SCENARIOS = {
      fork: [
        { fen: '3k4/8/8/8/8/2N5/8/3K4 w - - 0 1', task: 'Knight C3 — fork the King AND another piece!', from: 'c3', answers: ['e4', 'b5', 'd5', 'a4'], hint: 'From C3: B1,D1,A2,E2,A4,E4,B5,D5. Which is near the King?', explain: 'Knight forks two pieces at once!', pairs: [['bK', 'd8']] },
        { fen: 'r3k3/8/8/8/8/8/3N4/3K4 w - - 0 1', task: 'Knight D2 — fork King E8 AND Rook A8!', from: 'd2', answers: ['c4', 'e4', 'b3', 'f3'], hint: 'Find the L-shape that threatens both pieces!', explain: 'Knight forks King and Rook!', pairs: [['bK', 'e8'], ['bR', 'a8']] },
        { fen: '3k4/3q4/8/8/8/2N5/8/3K4 w - - 0 1', task: 'Knight C3 — fork King D8 AND Queen D7!', from: 'c3', answers: ['e4', 'b5'], hint: 'Which jump from C3 attacks both D8 and D7 area?', explain: 'Knight attacks two Black pieces!', pairs: [['bK', 'd8'], ['bQ', 'd7']] },
      ],
      double: [
        { fen: '3k4/3q4/8/8/8/3R4/8/3K4 w - - 0 1', task: 'DOUBLE ATTACK! Move the Rook to attack Queen AND King!', from: 'd3', answers: ['d7'], hint: 'Rook to D7 — captures Queen AND attacks King!', explain: 'Rook on D7 — double attack!', targets: ['bQ'] },
        { fen: '4k3/8/8/4r3/8/8/4R3/4K3 w - - 0 1', task: 'DOUBLE ATTACK! Rook to E5 — captures Rook AND attacks King!', from: 'e2', answers: ['e5'], hint: 'Rook E2 to E5 — takes Black Rook AND attacks King above!', explain: 'Double threat — takes Rook and attacks King!', targets: ['bR', 'bK'] },
        { fen: '3k4/3p4/8/8/8/3Q4/8/3K4 w - - 0 1', task: 'DOUBLE ATTACK with the Queen! Attack King AND Pawn!', from: 'd3', answers: ['d7'], hint: 'Queen to D7 — captures pawn AND gives check!', explain: 'Queen takes pawn on D7 — check AND win material!', targets: ['bK', 'bP'] },
      ],
    };
    let FT = { skill: 'fork', idx: 0, sel: null, answered: false };
    function initForkTrain() { ftSetSkill('fork') }
    function ftSetSkill(skill) { FT = { skill, idx: 0, sel: null, answered: false };['fork', 'double'].forEach(s => { const btn = document.getElementById('ft-tab-' + s); if (btn) btn.classList.toggle('on', s === skill) }); const concepts = { fork: { em: '🍴', name: 'Fork!', exp: 'ONE piece jumps to attack TWO enemy pieces at once!' }, double: { em: '💥', name: 'Double Attack!', exp: 'ONE MOVE creates TWO threats — opponent can only handle one!' } }; const con = concepts[skill]; document.querySelector('#ft-concept .tc-emoji').textContent = con.em; document.querySelector('#ft-concept .tc-name').textContent = con.name; document.getElementById('ft-con-exp').textContent = con.exp; ftLoad() }
    function ftLoad() { const list = FT_SCENARIOS[FT.skill]; const sc = list[FT.idx % list.length]; FT.sel = null; FT.answered = false; document.getElementById('ft-ctr').textContent = 'Scenario ' + (FT.idx % list.length + 1) + '/' + list.length; document.getElementById('ft-kip').textContent = sc.task; hideFB('ft-fb'); document.getElementById('ft-next').style.display = 'none'; const div = document.getElementById('ft-targets'); div.innerHTML = ''; if (sc.pairs) { sc.pairs.forEach(([code]) => { const tag = document.createElement('div'); tag.className = 'fork-target'; tag.id = 'ft-tgt-' + code; tag.textContent = PM[code] || code; div.appendChild(tag) }) }; say(sc.task); drawBoard('ft-board', sc.fen, { click: (sn, r, f) => handleFork(sn, r, f, sc) }) }
    function handleFork(sn, r, f, sc) { if (FT.answered) return; sTick(); const bd = parseFEN(sc.fen); const p = bd[r][f]; if (!FT.sel) { if (p && p[0] === 'w') { FT.sel = sn; const lm = getLegalMovesFiltered(bd, r, f); drawBoard('ft-board', sc.fen, { sel: sn, dot: lm, click: (s2, r2, f2) => handleFork(s2, r2, f2, sc) }) } return } if (sn === FT.sel) { FT.sel = null; drawBoard('ft-board', sc.fen, { click: (s2, r2, f2) => handleFork(s2, r2, f2, sc) }); return } const { r: fr, f: ff } = srf(FT.sel); const legal = getLegalMovesFiltered(bd, fr, ff); if (!legal.includes(sn)) { if (p && p[0] === 'w') { FT.sel = sn; drawBoard('ft-board', sc.fen, { sel: sn, dot: getLegalMovesFiltered(bd, r, f), click: (s2, r2, f2) => handleFork(s2, r2, f2, sc) }); return } showFB('ft-fb', 'Cannot! ' + sc.hint, 'no'); sBad(); FT.sel = null; drawBoard('ft-board', sc.fen, { click: (s2, r2, f2) => handleFork(s2, r2, f2, sc) }); return } if (sc.answers.includes(sn)) { FT.answered = true; const nb = applyMove(bd, fr, ff, r, f); drawBoard('ft-board', nb, { g: [sn] }); if (sc.pairs) sc.pairs.forEach(([code]) => { const el = document.getElementById('ft-tgt-' + code); if (el) el.classList.add('found') }); showFB('ft-fb', '🍴 ' + sc.explain, 'ok'); sOk(); confetti(50); earn(3, 'fork'); document.getElementById('ft-next').style.display = ''; say(sc.explain) } else { showFB('ft-fb', '❌ Not two pieces! ' + sc.hint, 'no'); sBad(); FT.sel = null; drawBoard('ft-board', sc.fen, { click: (s2, r2, f2) => handleFork(s2, r2, f2, sc) }) } }
    function ftNext() { FT.idx = (FT.idx + 1) % FT_SCENARIOS[FT.skill].length; ftLoad() }
    function ftHint() { const sc = FT_SCENARIOS[FT.skill][FT.idx % FT_SCENARIOS[FT.skill].length]; showFB('ft-fb', '💡 ' + sc.hint, 'info'); drawBoard('ft-board', sc.fen, { y: sc.answers, sel: sc.from, click: (sn, r, f) => handleFork(sn, r, f, sc) }); say(sc.hint) }

    // ── BOOT ──
    load();
    if (!ST.onboarded) {
      document.getElementById('onboarding').style.display = 'flex';
    } else {
      document.getElementById('onboarding').style.display = 'none';
      updateHomePersonalization();
      setTimeout(() => say('Welcome back ' + (ST.user.name || 'friend') + '! Ready to play chess?'), 500);
    }
