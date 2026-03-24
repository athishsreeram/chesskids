'use strict';

import { sTick, sWin, sBad, earn, showResult, PM, sqName, sqRF, confetti } from '../utils.js';
import { parseFEN, drawBoard, applyMove, getLegalMovesFiltered, getAllMoves, isCheckmate, isStalemate, isInCheck, botMove } from '../board.js';

export let botState = { board: null, sel: null, diff: 0, gameOver: false, whiteCap: [], blackCap: [], moves: [], moveCount: 0 };

export function setDiff(d) { botState.diff = d;[0, 1, 2].forEach(i => { const el = document.getElementById('diff-' + i); if (el) el.classList.toggle('on', i === d) }) }

export function startBotGame() {
  botState.board = parseFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  botState.sel = null; botState.gameOver = false; botState.whiteCap = []; botState.blackCap = []; botState.moves = []; botState.moveCount = 0;
  document.getElementById('bot-setup').classList.add('hidden'); document.getElementById('bot-game').classList.remove('hidden');
  setBotMsg('Your turn! Tap a White piece. ⬜'); document.getElementById('bot-status').textContent = 'Your turn ⬜'; renderBotBoard(); updateCaptured();
}

export function setBotMsg(msg) { const el = document.getElementById('bot-msg'); if (el) el.textContent = msg }

export function renderBotBoard(opts) { if (!botState.board) return; drawBoard('bot-board', botState.board, { ...(opts || {}), click: (sn, r, f) => handleBotClick(sn, r, f) }) }

export function handleBotClick(sn, r, f) {
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

export function doBotMove() {
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

export function addMoveToList(from, to, col, num) {
  const list = document.getElementById('bot-moves');
  if (col === 'w') { const row = document.createElement('div'); row.className = 'move-row'; row.id = 'mr-' + num; row.innerHTML = `<span class="mn">${num}.</span><span class="mw">${from}-${to}</span><span class="mb"></span>`; list.appendChild(row) }
  else { const row = document.getElementById('mr-' + num); if (row) row.querySelector('.mb').textContent = from + '-' + to }
  list.scrollTop = list.scrollHeight;
}

export function updateCaptured() { const wb = document.getElementById('bot-cap-white'); const bb = document.getElementById('bot-cap-black'); if (wb) wb.textContent = botState.whiteCap.map(p => PM[p]).join(''); if (bb) bb.textContent = botState.blackCap.map(p => PM[p]).join('') }

export function showBotHint() { const moves = getAllMoves(botState.board, 'w'); if (!moves.length) return; const good = moves.filter(m => { const { r, f } = sqRF(m.to); return botState.board[r][f] }); const hint = good.length ? good[0] : moves[Math.random() * moves.length | 0]; renderBotBoard({ sel: sqName(hint.fr, hint.ff), dot: getLegalMovesFiltered(botState.board, hint.fr, hint.ff) }); setBotMsg('💡 Try the piece on ' + sqName(hint.fr, hint.ff) + '!') }

export function resetBotGame() { botState.board = null; botState.gameOver = false; botState.sel = null; document.getElementById('bot-game').classList.add('hidden'); document.getElementById('bot-setup').classList.remove('hidden'); document.getElementById('bot-moves').innerHTML = '' }
