'use strict';

import { sTick, sWin, sBad, earn, showFB, hideFB, say, confetti } from '../utils.js';
import { parseFEN, drawBoard, applyMove, getLegalMovesFiltered } from '../board.js';
import { PAT_DATA } from '../data.js';

export let PAT = { learned: new Set(), current: null, solSel: null, solSolved: false };

export function initPatterns() { if (document.getElementById('pat-grid').children.length === 0) buildPatGrid() }

export function buildPatGrid() { 
    const grid = document.getElementById('pat-grid'); if(!grid) return; grid.innerHTML = ''; 
    PAT_DATA.forEach(pat => { 
        const card = document.createElement('div'); card.className = 'pat-card' + (PAT.learned.has(pat.id) ? ' learned' : ''); card.innerHTML = `<div class="pi">${pat.icon}</div><div class="pn">${pat.name}</div><div class="pb2">${PAT.learned.has(pat.id) ? '✅ Learned!' : 'Tap to learn'}</div>`; card.onclick = () => openPat(pat); grid.appendChild(card) 
    }) 
}

export function openPat(pat) { 
    PAT.current = pat; PAT.solSel = null; PAT.solSolved = false; 
    document.getElementById('pat-grid').classList.add('hidden'); 
    document.getElementById('pat-lesson').classList.remove('hidden'); 
    document.getElementById('pat-lesson-title').textContent = pat.icon + ' ' + pat.name; 
    document.getElementById('pat-explain').textContent = pat.explain; 
    hideFB('pat-fb'); 
    document.getElementById('pat-next').style.display = 'none'; 
    document.getElementById('pat-quiz-area').innerHTML = `<div class="card-sm" style="margin-bottom:8px"><div style="font-weight:800;font-size:.88rem">🎯 ${pat.task}</div></div>`; 
    drawBoard('pat-board', pat.fen, { click: (sn, r, f) => handlePatClick(sn, r, f, pat) }); 
    say(pat.explain) 
}

export function handlePatClick(sn, r, f, pat) { 
    if (PAT.solSolved) return; 
    sTick(); 
    const bd = parseFEN(pat.fen); const p = bd[r][f]; 
    if (!PAT.solSel) { 
        if (p && p[0] === 'w') { 
            PAT.solSel = sn; 
            const lm = getLegalMovesFiltered(bd, r, f); 
            drawBoard('pat-board', pat.fen, { sel: sn, dot: lm, click: (s2, r2, f2) => handlePatClick(s2, r2, f2, pat) }) 
        } 
        return 
    } 
    const solArr = Array.isArray(pat.sol) ? pat.sol : [pat.sol]; 
    const mv = PAT.solSel + sn; 
    if (solArr.includes(mv) || solArr.includes(sn)) { 
        PAT.solSolved = true; PAT.learned.add(pat.id); 
        const { r: fr, f: ff } = { r: parseInt(PAT.solSel[1]) - 1, f: PAT.solSel.charCodeAt(0) - 97 }; 
        const nb = applyMove(bd, fr, ff, r, f); 
        drawBoard('pat-board', nb, { g: [sn] }); 
        showFB('pat-fb', '🏆 Checkmate! You know the ' + pat.name + '! ✅', 'ok'); 
        sWin(); confetti(60); earn(3, 'patterns'); 
        document.getElementById('pat-next').style.display = ''; buildPatGrid(); say('Checkmate!') 
    } else { 
        showFB('pat-fb', '❌ Not checkmate! ' + pat.hint, 'no'); 
        sBad(); PAT.solSel = null; 
        drawBoard('pat-board', pat.fen, { click: (s2, r2, f2) => handlePatClick(s2, r2, f2, pat) }) 
    } 
}

export function nextPatternChallenge() { const u = PAT_DATA.filter(p => !PAT.learned.has(p.id)); openPat(u.length ? u[0] : PAT_DATA[Math.random() * PAT_DATA.length | 0]) }
export function closePat() { document.getElementById('pat-lesson').classList.add('hidden'); document.getElementById('pat-grid').classList.remove('hidden') }
