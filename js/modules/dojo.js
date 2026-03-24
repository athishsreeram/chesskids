'use strict';

import { sTick, sWin, sBad, earn, showFeedback, hideFeedback, say, confetti } from '../utils.js';
import { drawBoard, getLegalMoves, sqName, sqRF } from '../board.js';
import { DOJO_PIECES } from '../data.js';

export let dojoState = { piece: null, from: null, target: null, moves: 0, best: null, done: 0, sel: null, trail: [] };

export function initDojo() { 
    const btns = document.getElementById('dojo-piece-btns'); 
    if (btns.children.length > 0) return; 
    DOJO_PIECES.forEach(p => { 
        const b = document.createElement('button'); 
        b.className = 'dojo-piece-btn'; 
        b.textContent = p.icon; 
        b.title = p.label; 
        b.onclick = () => selectDojoPiece(p, b); 
        btns.appendChild(b) 
    }) 
}

export function selectDojoPiece(p, btn) { 
    sTick(); 
    document.querySelectorAll('.dojo-piece-btn').forEach(b => b.classList.remove('on')); 
    btn.classList.add('on'); 
    dojoState.piece = p; 
    dojoState.moves = 0; 
    dojoState.trail = []; 
    dojoState.sel = null; 
    document.getElementById('dojo-msg').textContent = p.fact + ' Navigate to the 🌟 target!'; 
    say(p.fact); 
    hideFeedback('dojo-feedback'); 
    newDojoChallenge() 
}

export function newDojoChallenge() { 
    if (!dojoState.piece) return; 
    let fr, ff, tr, tf; 
    do { 
        fr = Math.random() * 8 | 0; 
        ff = Math.random() * 8 | 0; 
        tr = Math.random() * 8 | 0; 
        tf = Math.random() * 8 | 0 
    } while (fr === tr && ff === tf); 
    dojoState.from = { r: fr, f: ff }; 
    dojoState.target = { r: tr, f: tf }; 
    dojoState.moves = 0; 
    dojoState.trail = []; 
    dojoState.sel = null; 
    dojoState.best = calcMinMoves(dojoState.piece.code, fr, ff, tr, tf); 
    updateDojoStats(); 
    renderDojo() 
}

export function calcMinMoves(code, fr, ff, tr, tf) { 
    const visited = new Set(); 
    const queue = [{ r: fr, f: ff, moves: 0 }]; 
    visited.add(fr + ',' + ff); 
    while (queue.length) { 
        const { r, f, moves } = queue.shift(); 
        if (r === tr && f === tf) return moves; 
        const tmpBd = Array.from({ length: 8 }, () => Array(8).fill(null)); 
        tmpBd[r][f] = code; 
        getLegalMoves(tmpBd, r, f).forEach(sn => { 
            const { r: nr, f: nf } = sqRF(sn); 
            const k = nr + ',' + nf; 
            if (!visited.has(k)) { 
                visited.add(k); 
                queue.push({ r: nr, f: nf, moves: moves + 1 }) 
            } 
        }) 
    } 
    return null 
}

export function renderDojo() {
  if (!dojoState.piece || !dojoState.from) return; 
  const bd = Array.from({ length: 8 }, () => Array(8).fill(null));
  const cur = dojoState.sel || sqName(dojoState.from.r, dojoState.from.f); 
  const { r: cr, f: cf } = sqRF(cur); 
  bd[cr][cf] = dojoState.piece.code;
  const tgt = sqName(dojoState.target.r, dojoState.target.f); 
  let validMoves = []; if (!dojoState.sel) validMoves = getLegalMoves(bd, cr, cf);
  drawBoard('dojo-board', bd, { y: [tgt], b_: dojoState.trail.map(t => sqName(t.r, t.f)), dot: validMoves, sel: dojoState.sel, click: (sn, r, f) => handleDojoClick(sn, r, f) });
  const tEl = document.querySelector('#dojo-board [data-sq="' + tgt + '"]');
  if (tEl) { 
      const s = document.createElement('span'); 
      s.style.cssText = 'position:absolute;font-size:1.2rem;z-index:3;pointer-events:none'; 
      s.textContent = '🌟'; 
      tEl.appendChild(s) 
  }
}

export function handleDojoClick(sn, r, f) {
  if (!dojoState.piece || !dojoState.from) return; 
  sTick(); 
  const cur = dojoState.sel || sqName(dojoState.from.r, dojoState.from.f); 
  const { r: cr, f: cf } = sqRF(cur); 
  const bd = Array.from({ length: 8 }, () => Array(8).fill(null)); 
  bd[cr][cf] = dojoState.piece.code; 
  const legal = getLegalMoves(bd, cr, cf);
  if (!legal.includes(sn)) { 
      showFeedback('dojo-feedback', '❌ The ' + dojoState.piece.label + ' cannot move there! ' + dojoState.piece.fact, 'no'); 
      sBad(); return 
  }
  hideFeedback('dojo-feedback'); 
  dojoState.trail.push({ r: cr, f: cf }); 
  dojoState.from = { r, f }; 
  dojoState.sel = null; 
  dojoState.moves++; 
  updateDojoStats();
  if (r === dojoState.target.r && f === dojoState.target.f) { 
      sWin(); confetti(40); dojoState.done++; 
      const stars = dojoState.best && dojoState.moves <= dojoState.best ? 3 : dojoState.moves <= dojoState.best + 2 ? 2 : 1; 
      earn(stars, 'dojo'); 
      showFeedback('dojo-feedback', '🌟 Target reached in ' + dojoState.moves + ' moves! Best: ' + dojoState.best + '. +' + stars + ' stars!', 'ok'); 
      say('Target reached!'); 
      setTimeout(() => { hideFeedback('dojo-feedback'); newDojoChallenge() }, 2000) 
  } else renderDojo();
}

export function updateDojoStats() { 
    document.getElementById('dojo-moves').textContent = dojoState.moves; 
    document.getElementById('dojo-best').textContent = dojoState.best !== null ? dojoState.best : '?'; 
    document.getElementById('dojo-done').textContent = dojoState.done + '/10' 
}
