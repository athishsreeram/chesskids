'use strict';

export const PM = { wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙', bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟' };
export const PN = { K: 'King', Q: 'Queen', R: 'Rook', B: 'Bishop', N: 'Knight', P: 'Pawn' };
export const VALID_CODES = ['CHESS2024', 'PARENT100', 'KIPVIP99', 'EARLYBIRD', 'CHESSKIDS'];

export let ST = { 
    stars: 0, 
    streak: 0, 
    lastDate: null, 
    mods: { puzzle: 0, bot: 0, threat: 0, dojo: 0, capture: 0, defend: 0, blunder: 0, patterns: 0, combo: 0, endcoach: 0, opening: 0, eval: 0, pawn: 0, ladder: 0, fork: 0 }, 
    premium: false, 
    user: { name: '', age: '', level: '' }, 
    onboarded: false 
};

export let resultNext = null;
export function setResultNext(val) { resultNext = val; }

export function sqName(r, f) { return String.fromCharCode(97 + f) + (r + 1) }
export function sqRF(sn) { return { r: parseInt(sn[1]) - 1, f: sn.charCodeAt(0) - 97 } }
export function srf(sn) { return sqRF(sn) }

// ── STORAGE ──
export function save() { try { localStorage.setItem('ck_w1', JSON.stringify(ST)) } catch (e) { } }
export function load() {
  try { const r = localStorage.getItem('ck_w1'); if (r) Object.assign(ST, JSON.parse(r)) } catch (e) { }
  if (!ST.mods) ST.mods = { puzzle: 0, bot: 0, threat: 0, dojo: 0, capture: 0, defend: 0, blunder: 0, patterns: 0, combo: 0, endcoach: 0, opening: 0, eval: 0, pawn: 0, ladder: 0, fork: 0 };
  if (!ST.user) ST.user = { name: '', age: '', level: '' };
  updateStarDisplay();
}
export function earn(n, mod) { ST.stars += n; if (mod) ST.mods[mod] = (ST.mods[mod] || 0) + n; ST.lastDate = new Date().toDateString(); save(); updateStarDisplay(); showToast('⭐ +' + n + ' stars!') }
export function earnStars(n, mod) { earn(n, mod) }

export function updateStarDisplay() {
  ['nav-star-count', 'h-stars'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = ST.stars });
  const h = document.getElementById('h-streak'); if (h) h.textContent = (ST.streak || 0) + '🔥';
  const ps = document.getElementById('puz-stars'); if (ps) ps.textContent = ST.mods.puzzle || 0;
  const ds = document.getElementById('dojo-stars'); if (ds) ds.textContent = ST.mods.dojo || 0;
  const ts = document.getElementById('thr-stars'); if (ts) ts.textContent = ST.mods.threat || 0;
  const cs = document.getElementById('cap-stars'); if (cs) cs.textContent = ST.mods.capture || 0;
  document.querySelectorAll('.mc-star-val').forEach(el => { const mod = el.dataset.mod; if (mod) el.textContent = ST.mods[mod] || 0 });
}

export function resetProgress() { ST = { stars: 0, streak: 0, lastDate: null, mods: { puzzle: 0, bot: 0, threat: 0, dojo: 0, capture: 0, defend: 0, blunder: 0, patterns: 0, combo: 0, endcoach: 0, opening: 0, eval: 0, pawn: 0, ladder: 0, fork: 0 }, premium: ST.premium, user: ST.user, onboarded: ST.onboarded }; save(); updateStarDisplay(); showToast('Progress reset!') }

// ── AUDIO ──
let AC = null;
export function tone(f, t, d, dl) { try { if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)(); const o = AC.createOscillator(), g = AC.createGain(); o.connect(g); g.connect(AC.destination); o.type = t || 'sine'; o.frequency.value = f; g.gain.setValueAtTime(.25, AC.currentTime + (dl || 0)); g.gain.exponentialRampToValueAtTime(.001, AC.currentTime + (dl || 0) + (d || .18)); o.start(AC.currentTime + (dl || 0)); o.stop(AC.currentTime + (dl || 0) + (d || .18)) } catch (e) { } }
export const sOk = () => { tone(523, 'sine', .1); tone(659, 'sine', .1, .1); tone(784, 'sine', .15, .2) };
export const sBad = () => { tone(280, 'sawtooth', .18); tone(220, 'sawtooth', .12, .15) };
export const sWin = () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, 'sine', .2, i * .13)) };
export const sTick = () => tone(440, 'sine', .06);

// ── FX ──
export function confetti(n = 60) { const c = ['#7C5CBF', '#FFD93D', '#52C41A', '#FF6B6B', '#48CAE4', '#F5A623']; for (let i = 0; i < n; i++) { const e = document.createElement('div'); e.className = 'cp'; e.style.cssText = `left:${Math.random() * 100}vw;top:-20px;background:${c[Math.random() * c.length | 0]};width:${6 + Math.random() * 8}px;height:${6 + Math.random() * 8}px;border-radius:${Math.random() > .5 ? '50%' : '3px'};animation-duration:${1.5 + Math.random() * 2}s;animation-delay:${Math.random() * .5}s`; document.body.appendChild(e); e.addEventListener('animationend', () => e.remove()) } }
let _tt = null;
export function showToast(msg) { const t = document.getElementById('toast'); if(!t) return; t.textContent = msg; t.classList.add('show'); clearTimeout(_tt); _tt = setTimeout(() => t.classList.remove('show'), 2200) }
export function say(text) { try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.rate = .88; u.pitch = 1.15; speechSynthesis.speak(u) } catch (e) { } }

export function showResult(emoji, title, sub, onAgain) { 
    document.getElementById('r-emoji').textContent = emoji; 
    document.getElementById('r-title').textContent = title; 
    document.getElementById('r-sub').textContent = sub; 
    document.getElementById('rover').classList.add('show'); 
    setResultNext(onAgain); 
}

export function showFeedback(id, msg, type) { const el = document.getElementById(id); if (!el) return; el.textContent = msg; el.className = 'feedback-box show fb-' + (type || 'ok') }
export function hideFeedback(id) { const el = document.getElementById(id); if (el) el.classList.remove('show') }
export function showFB(id, msg, type) { const el = document.getElementById(id); if (!el) return; el.textContent = msg; el.className = 'fb show fb-' + (type || 'ok') }
export function hideFB(id) { const el = document.getElementById(id); if (el) el.classList.remove('show') }
