'use strict';

import { PM, sqName, sqRF } from './utils.js';

export function parseFEN(fen) { 
    const b = Array.from({ length: 8 }, () => Array(8).fill(null)); 
    fen.split(' ')[0].split('/').forEach((row, ri) => { 
        let fi = 0; for (const ch of row) { 
            if (/\d/.test(ch)) { fi += +ch } 
            else { b[7 - ri][fi] = (ch === ch.toUpperCase() ? 'w' : 'b') + ch.toUpperCase(); fi++ } 
        } 
    }); 
    return b; 
}

export function drawBoard(boardId, fen, opts) {
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

// ── CHESS LOGIC ──
export function getLegalMoves(bd, r, f) {
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

export function isInCheck(bd, col) {
  let kr = -1, kf = -1; for (let r = 0; r < 8; r++)for (let f = 0; f < 8; f++) { if (bd[r][f] === col + 'K') { kr = r; kf = f } } if (kr === -1) return false;
  const enemy = col === 'w' ? 'b' : 'w'; for (let r = 0; r < 8; r++)for (let f = 0; f < 8; f++) { if (bd[r][f] && bd[r][f][0] === enemy) { if (getLegalMoves(bd, r, f).includes(sqName(kr, kf))) return true } } return false;
}

export function getLegalMovesFiltered(bd, r, f) {
  const moves = getLegalMoves(bd, r, f); const col = bd[r][f]?.[0]; if (!col) return [];
  return moves.filter(sq => { const { r: tr, f: tf } = sqRF(sq); const nb = bd.map(row => [...row]); nb[tr][tf] = nb[r][f]; nb[r][f] = null; return !isInCheck(nb, col) });
}

export function getLegalF(bd, r, f) { return getLegalMovesFiltered(bd, r, f) }

export function applyMove(bd, fr, ff, tr, tf) { const nb = bd.map(row => [...row]); const p = nb[fr][ff]; nb[tr][tf] = p; nb[fr][ff] = null; if (p === 'wP' && tr === 7) nb[tr][tf] = 'wQ'; if (p === 'bP' && tr === 0) nb[tr][tf] = 'bQ'; return nb }

export function getAllMoves(bd, col) { const moves = []; for (let r = 0; r < 8; r++)for (let f = 0; f < 8; f++) { if (bd[r][f] && bd[r][f][0] === col) getLegalMovesFiltered(bd, r, f).forEach(sq => moves.push({ fr: r, ff: f, to: sq })) } return moves }

export function isCheckmate(bd, col) { return getAllMoves(bd, col).length === 0 && isInCheck(bd, col) }
export function isStalemate(bd, col) { return getAllMoves(bd, col).length === 0 && !isInCheck(bd, col) }

export function evalBoard(bd) { 
    const vals = { K: 0, Q: 9, R: 5, B: 3, N: 3, P: 1 }; 
    let s = 0; for (let r = 0; r < 8; r++)for (let f = 0; f < 8; f++) { const p = bd[r][f]; if (p) { const v = vals[p[1]] || 0; s += p[0] === 'w' ? v : -v } } return s; 
}

export function botMove(bd, diff) {
  const moves = getAllMoves(bd, 'b'); if (!moves.length) return null;
  if (diff === 0) return moves[Math.random() * moves.length | 0];
  if (diff === 1) { const caps = moves.filter(m => { const { r, f } = sqRF(m.to); return bd[r][f] && bd[r][f][0] === 'w' }); if (caps.length && Math.random() > .3) return caps[Math.random() * caps.length | 0]; return moves[Math.random() * moves.length | 0] }
  let best = null, bestScore = Infinity; const sample = moves.length > 20 ? moves.sort(() => Math.random() - .5).slice(0, 20) : moves;
  sample.forEach(m => { const { r, f } = sqRF(m.to); const nb = applyMove(bd, m.fr, m.ff, r, f); const sc = evalBoard(nb); if (sc < bestScore) { bestScore = sc; best = m } }); return best || moves[0];
}
