'use strict';

import { sTick, sWin, sBad, earn, showFeedback, hideFeedback, say, confetti } from '../utils.js';
import { parseFEN, drawBoard, applyMove, getLegalMovesFiltered, sqName, sqRF } from '../board.js';
import { PUZZLES, PCATS } from '../data.js';

export let puzState = { cat: 'all', idx: 0, sel: null, solved: false, board: null };

export function initPuzzle() {
  const nav = document.getElementById('puz-cats'); if (nav.children.length > 0) return;
  PCATS.forEach(cat => { const b = document.createElement('button'); b.className = 'pcat' + (cat.id === 'all' ? ' on' : ''); b.textContent = cat.label; b.onclick = () => { document.querySelectorAll('.pcat').forEach(x => x.classList.remove('on')); b.classList.add('on'); puzState.cat = cat.id; puzState.idx = 0; loadPuzzle() }; nav.appendChild(b) });
  loadPuzzle();
}

export function getPuzzleList() { return puzState.cat === 'all' ? [...PUZZLES] : PUZZLES.filter(p => p.cat === puzState.cat) }

export function loadPuzzle() {
  const list = getPuzzleList(); if (!list.length) return; const puz = list[puzState.idx % list.length];
  puzState.solved = false; puzState.sel = null; puzState.board = parseFEN(puz.fen);
  document.getElementById('puz-task').textContent = puz.task;
  document.getElementById('puz-turn').textContent = puz.turn === 'w' ? '⬜ White to move' : '⬛ Black to move';
  document.getElementById('puz-turn').className = 'turn-indicator ' + (puz.turn === 'w' ? 'turn-white' : 'turn-black');
  document.getElementById('puz-counter').textContent = 'Puzzle ' + (puzState.idx % list.length + 1) + ' of ' + list.length;
  hideFeedback('puz-feedback'); document.getElementById('puz-next').style.display = 'none';
  renderPuzzleBoard(); say(puz.task);
}

export function renderPuzzleBoard() {
  const puz = getPuzzleList()[puzState.idx % getPuzzleList().length]; const highlight = {};
  if (puzState.sel) { const { r, f } = sqRF(puzState.sel); const moves = getLegalMovesFiltered(puzState.board, r, f); highlight.dot = moves; highlight.sel = puzState.sel }
  drawBoard('puz-board', puzState.board, { ...highlight, click: (sn, r, f) => handlePuzzleClick(sn, r, f, puz) });
}

export function handlePuzzleClick(sn, r, f, puz) {
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

export function nextPuzzle() { puzState.idx = (puzState.idx + 1) % Math.max(getPuzzleList().length, 1); loadPuzzle() }
export function showPuzzleHint() { const puz = getPuzzleList()[puzState.idx % getPuzzleList().length]; showFeedback('puz-feedback', '💡 ' + puz.hint, 'info'); say(puz.hint) }
