/* ════════════════════════════════════════
   ChessPlayground – Core App Engine
   ════════════════════════════════════════ */

'use strict';

// ─── State ───────────────────────────────
const APP = {
  currentScreen: 'home',
  currentGame: null,
  currentLevel: 1,
  stars: 0,
  streak: 0,
  lastPlayDate: null,
  gameStats: {},
  puzzleData: null,
  speechEnabled: true,
  audioCtx: null,
};

// ─── Piece Unicode Map ───────────────────
const PIECES = {
  wK:'♔', wQ:'♕', wR:'♖', wB:'♗', wN:'♘', wP:'♙',
  bK:'♚', bQ:'♛', bR:'♜', bB:'♝', bN:'♞', bP:'♟',
};
const PIECE_NAMES = {
  K:'King', Q:'Queen', R:'Rook', B:'Bishop', N:'Knight', P:'Pawn'
};

// ─── Storage ─────────────────────────────
function saveState() {
  const s = {
    stars: APP.stars,
    streak: APP.streak,
    lastPlayDate: APP.lastPlayDate,
    gameStats: APP.gameStats,
  };
  try { localStorage.setItem('chessplayground', JSON.stringify(s)); } catch(e) {}
}
function loadState() {
  try {
    const raw = localStorage.getItem('chessplayground');
    if (!raw) return;
    const s = JSON.parse(raw);
    APP.stars = s.stars || 0;
    APP.streak = s.streak || 0;
    APP.lastPlayDate = s.lastPlayDate || null;
    APP.gameStats = s.gameStats || {};
    updateStreakCheck();
  } catch(e) {}
}
function updateStreakCheck() {
  const today = new Date().toDateString();
  if (APP.lastPlayDate === today) return;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (APP.lastPlayDate === yesterday) {
    APP.streak += 1;
  } else if (APP.lastPlayDate !== today) {
    APP.streak = APP.lastPlayDate ? 0 : (APP.streak || 0);
  }
  APP.lastPlayDate = today;
  saveState();
}
function recordGameStat(gameId, starsEarned) {
  if (!APP.gameStats[gameId]) APP.gameStats[gameId] = { plays:0, totalStars:0, highScore:0 };
  const g = APP.gameStats[gameId];
  g.plays++;
  g.totalStars += starsEarned;
  g.highScore = Math.max(g.highScore, starsEarned);
  APP.stars += starsEarned;
  APP.lastPlayDate = new Date().toDateString();
  saveState();
  updateStarsDisplay();
}

// ─── Audio Engine ────────────────────────
function getAudioCtx() {
  if (!APP.audioCtx) APP.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return APP.audioCtx;
}
function playTone(freq, type='sine', duration=0.18, vol=0.4, delay=0) {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    gain.gain.setValueAtTime(vol, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration);
  } catch(e) {}
}
function soundCorrect() {
  playTone(523, 'sine', 0.12, 0.3);
  playTone(659, 'sine', 0.12, 0.3, 0.1);
  playTone(784, 'sine', 0.2,  0.3, 0.2);
}
function soundWrong() {
  playTone(300, 'sawtooth', 0.2, 0.3);
  playTone(250, 'sawtooth', 0.2, 0.3, 0.15);
}
function soundWin() {
  const melody = [523,659,784,1047];
  melody.forEach((f,i) => playTone(f,'sine',0.22,0.35,i*0.14));
}
function soundClick() { playTone(440,'sine',0.08,0.15); }
function soundFlip()  { playTone(350,'sine',0.15,0.2); }

// ─── Voice Prompts ───────────────────────
function speak(text, rate=0.85) {
  if (!APP.speechEnabled || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = rate;
  utt.pitch = 1.15;
  utt.volume = 1;
  window.speechSynthesis.speak(utt);
}

// ─── Confetti ────────────────────────────
function launchConfetti(count=80) {
  const colors = ['#1a1a1a','#f59e0b','#22c55e','#ef4444','#3b82f6','#a855f7','#f97316'];
  for (let i=0; i<count; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.cssText = `
      left:${Math.random()*100}vw;
      top:-20px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      width:${6+Math.random()*8}px;
      height:${6+Math.random()*8}px;
      border-radius:${Math.random()>0.5?'50%':'2px'};
      animation-duration:${1.5+Math.random()*2}s;
      animation-delay:${Math.random()*0.6}s;
    `;
    document.body.appendChild(el);
    el.addEventListener('animationend', ()=>el.remove());
  }
}
function starRain(count=20) {
  for (let i=0; i<count; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.cssText = `
      left:${Math.random()*100}vw; top:-20px;
      background:transparent;
      font-size:${16+Math.random()*16}px;
      animation-duration:${1.2+Math.random()*1.5}s;
      animation-delay:${Math.random()*0.8}s;
    `;
    el.textContent = '⭐';
    document.body.appendChild(el);
    el.addEventListener('animationend', ()=>el.remove());
  }
}
function bigWinCelebration() {
  launchConfetti(100);
  starRain(25);
  soundWin();
}

// ─── Screen Navigation ───────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) { el.classList.add('active'); APP.currentScreen = id; }
  window.scrollTo(0,0);
}

// ─── Chess Board Builder ─────────────────
// FEN parser → 8x8 piece array [rank8..rank1][file a..h]
function parseFEN(fen) {
  const board = Array.from({length:8}, ()=>Array(8).fill(null));
  const rows = fen.split(' ')[0].split('/');
  rows.forEach((row, ri) => {
    let fi = 0;
    for (const ch of row) {
      if (/\d/.test(ch)) { fi += parseInt(ch); }
      else {
        const color = ch === ch.toUpperCase() ? 'w' : 'b';
        board[ri][fi] = color + ch.toUpperCase();
        fi++;
      }
    }
  });
  return board;
}

function buildBoard(containerId, fen, opts={}) {
  // opts: { onSquareClick, highlighted:Set, selectedSquare, showCoords, pieceClass }
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  const board = parseFEN(fen);
  const showCoords = opts.showCoords !== false;

  for (let r=0; r<8; r++) {
    for (let f=0; f<8; f++) {
      const sq = document.createElement('div');
      const isLight = (r+f)%2===0;
      sq.className = 'chess-square ' + (isLight?'light':'dark');
      const squareName = String.fromCharCode(97+f) + (8-r);
      sq.dataset.square = squareName;

      // coords
      if (showCoords) {
        if (f===7) { const l=document.createElement('span'); l.className='coord-label rank'; l.textContent=8-r; sq.appendChild(l); }
        if (r===7) { const l=document.createElement('span'); l.className='coord-label file'; l.textContent=String.fromCharCode(97+f); sq.appendChild(l); }
      }

      // piece
      const piece = board[r][f];
      if (piece && !(opts.hidePieces)) {
        const p = document.createElement('span');
        p.className = 'piece' + (opts.pieceClass?' '+opts.pieceClass:'');
        p.textContent = PIECES[piece] || '';
        sq.appendChild(p);
      }

      // highlights
      if (opts.highlighted && opts.highlighted.has(squareName)) {
        sq.classList.add('highlight-correct');
      }
      if (opts.selectedSquare === squareName) sq.classList.add('selected');
      if (opts.targetSquares && opts.targetSquares.has(squareName)) sq.classList.add('highlight-target');

      if (opts.onSquareClick) {
        sq.addEventListener('click', () => opts.onSquareClick(squareName, sq, piece));
        sq.addEventListener('touchend', (e)=>{ e.preventDefault(); opts.onSquareClick(squareName, sq, piece); });
      }
      container.appendChild(sq);
    }
  }
}

// Get piece on square from FEN
function getPieceOnSquare(fen, square) {
  const board = parseFEN(fen);
  const file = square.charCodeAt(0) - 97;
  const rank = 8 - parseInt(square[1]);
  return board[rank][file];
}

// ─── Result Overlay ──────────────────────
function showResult(opts) {
  // opts: { emoji, title, starsEarned, scoreText, onNext }
  const overlay = document.getElementById('result-overlay');
  document.getElementById('result-emoji').textContent = opts.emoji || '🎉';
  document.getElementById('result-title').textContent = opts.title || 'Great Job!';
  document.getElementById('result-stars').textContent = '⭐'.repeat(opts.starsEarned||0) + '☆'.repeat(3-(opts.starsEarned||0));
  document.getElementById('result-score').textContent = opts.scoreText || '';
  overlay.classList.add('show');

  if (opts.starsEarned >= 2) bigWinCelebration();
  else if (opts.starsEarned === 1) { launchConfetti(30); soundCorrect(); }

  document.getElementById('result-next-btn').onclick = () => {
    overlay.classList.remove('show');
    if (opts.onNext) opts.onNext();
  };
  document.getElementById('result-home-btn').onclick = () => {
    overlay.classList.remove('show');
    showScreen('home-screen');
  };
}

// ─── Stars Display ───────────────────────
function updateStarsDisplay() {
  document.querySelectorAll('.total-stars').forEach(el=>el.textContent=APP.stars);
}

// ─── Level Selector Helper ───────────────
function initLevelSelector(containerId, onChange) {
  const btns = document.querySelectorAll(`#${containerId} .level-btn`);
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      APP.currentLevel = parseInt(btn.dataset.level);
      soundClick();
      onChange(APP.currentLevel);
    });
  });
}

// ─── PIN Auth for Parent Dashboard ───────
const PIN_QUESTIONS = [
  {q:'What is 3 + 4?', a:'7'},
  {q:'What is 5 + 2?', a:'7'},
  {q:'What is 6 + 3?', a:'9'},
  {q:'What is 8 - 3?', a:'5'},
  {q:'What is 2 × 4?', a:'8'},
];
let currentPINQ = null;
function showPINOverlay(onSuccess) {
  currentPINQ = PIN_QUESTIONS[Math.floor(Math.random()*PIN_QUESTIONS.length)];
  document.getElementById('pin-question').textContent = currentPINQ.q;
  document.getElementById('pin-input').value = '';
  const overlay = document.getElementById('pin-overlay');
  overlay.classList.add('show');
  document.getElementById('pin-submit').onclick = () => {
    const val = document.getElementById('pin-input').value.trim();
    if (val === currentPINQ.a) {
      overlay.classList.remove('show');
      onSuccess();
    } else {
      document.getElementById('pin-input').style.borderColor='#ef4444';
      soundWrong();
      speak('Try again!');
      setTimeout(()=>document.getElementById('pin-input').style.borderColor='',600);
    }
  };
  document.getElementById('pin-cancel').onclick = () => overlay.classList.remove('show');
}

// ─── Parent Dashboard ────────────────────
function renderDashboard() {
  const gameNames = {
    memory:'🎯 Memory', blindfold:'👀 Blindfold', pieceFinder:'♟ Piece Finder',
    patternMatch:'🧩 Patterns', openingTree:'🌳 Openings', endgame:'👑 Endgame',
    vision:'🔎 Board Vision', calculation:'🧠 Calculation', thinking:'✅ Thinking', focus:'🎮 Focus Flash'
  };
  document.getElementById('dash-total-stars').textContent = APP.stars;
  document.getElementById('dash-streak').textContent = APP.streak + '🔥';
  const totalPlays = Object.values(APP.gameStats).reduce((a,g)=>a+g.plays,0);
  document.getElementById('dash-plays').textContent = totalPlays;
  const avgStars = totalPlays>0
    ? (Object.values(APP.gameStats).reduce((a,g)=>a+g.totalStars,0)/totalPlays).toFixed(1)
    : '0';
  document.getElementById('dash-avg').textContent = avgStars + '⭐';

  const list = document.getElementById('dash-game-list');
  list.innerHTML = '';
  Object.entries(gameNames).forEach(([id,name])=>{
    const s = APP.gameStats[id];
    const row = document.createElement('div');
    row.className = 'game-stat-row';
    row.innerHTML = `<span class="gs-name">${name}</span>
      <span>${s?s.plays:0} plays</span>
      <span class="gs-stars">${'⭐'.repeat(Math.min(s?s.highScore:0,3))}</span>`;
    list.appendChild(row);
  });
}

// ─── Load Puzzle Data ────────────────────
async function loadPuzzleData() {
  try {
    const r = await fetch('data/puzzles.json');
    APP.puzzleData = await r.json();
  } catch(e) {
    APP.puzzleData = {};
    console.warn('Could not load puzzles.json');
  }
}

// ─── Init ────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  loadState();
  updateStarsDisplay();
  await loadPuzzleData();

  // Game card clicks
  document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', () => {
      const game = card.dataset.game;
      if (!game) return;
      soundClick();
      APP.currentGame = game;
      APP.currentLevel = 1;
      openGame(game);
    });
  });

  // Back buttons
  document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      soundClick();
      window.speechSynthesis && window.speechSynthesis.cancel();
      showScreen('home-screen');
    });
  });

  // Parent button
  document.getElementById('parent-btn')?.addEventListener('click', () => {
    soundClick();
    showPINOverlay(() => {
      renderDashboard();
      showScreen('dashboard-screen');
    });
  });

  // Reset stats button
  document.getElementById('reset-stats-btn')?.addEventListener('click', () => {
    if (confirm('Reset all progress?')) {
      APP.stars=0; APP.streak=0; APP.gameStats={};
      saveState(); renderDashboard(); updateStarsDisplay();
    }
  });

  // PIN overlay
  document.getElementById('pin-input')?.addEventListener('keydown', e => {
    if (e.key==='Enter') document.getElementById('pin-submit')?.click();
  });

  showScreen('home-screen');
  speak('Welcome to Chess Playground! Tap a game to start!', 0.9);
});

// ─── Game Router ────────────────────────
function openGame(game) {
  const gameMap = {
    memory:       ()=>{ showScreen('memory-screen');      initMemoryGame(); },
    blindfold:    ()=>{ showScreen('blindfold-screen');   initBlindFold(); },
    pieceFinder:  ()=>{ showScreen('piecefinder-screen'); initPieceFinder(); },
    patternMatch: ()=>{ showScreen('pattern-screen');     initPatternMatch(); },
    openingTree:  ()=>{ showScreen('opening-screen');     initOpeningTree(); },
    endgame:      ()=>{ showScreen('endgame-screen');     initEndgame(); },
    vision:       ()=>{ showScreen('vision-screen');      initVision(); },
    calculation:  ()=>{ showScreen('calc-screen');        initCalculation(); },
    thinking:     ()=>{ showScreen('thinking-screen');    initThinking(); },
    focus:        ()=>{ showScreen('focus-screen');       initFocus(); },
  };
  if (gameMap[game]) gameMap[game]();
}
