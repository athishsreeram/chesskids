'use strict';

import { sTick, sOk, sBad, sWin, earn, showFeedback, showResult, showToast, say, PN, sqRF, confetti } from '../utils.js';
import { drawBoard, applyMove, getLegalMovesFiltered, isInCheck, isCheckmate, botMove, getAllMoves } from '../board.js';
import { DEFEND_ATTACKS, ARMY_PIECES } from '../data.js';

export let defState = { setupBoard: null, armySel: null, placedPieces: [], battle: null, sel: null, turn: 0, maxTurns: 5, attack: null, gameOver: false };

export function initDefend() { 
    defState.attack = DEFEND_ATTACKS[Math.random() * DEFEND_ATTACKS.length | 0]; 
    defState.setupBoard = Array.from({ length: 8 }, () => Array(8).fill(null)); 
    defState.setupBoard[0][4] = 'wK'; 
    defState.placedPieces = ['wK']; 
    defState.armySel = null; 
    buildArmyPalette(); 
    renderSetupBoard() 
}

export function buildArmyPalette() { 
    const div = document.getElementById('def-army'); 
    div.innerHTML = ''; 
    ARMY_PIECES.forEach(p => { 
        const btn = document.createElement('button'); 
        btn.className = 'army-piece'; 
        btn.id = 'ap-' + p.code; 
        btn.textContent = p.icon; 
        btn.onclick = () => { 
            sTick(); 
            defState.armySel = defState.armySel === p.code ? null : p.code; 
            document.querySelectorAll('.army-piece').forEach(b => b.classList.remove('selected-army')); 
            if (defState.armySel) btn.classList.add('selected-army') 
        }; 
        div.appendChild(btn) 
    }) 
}

export function renderSetupBoard() { drawBoard('def-setup-board', defState.setupBoard, { g: ['e1'], click: (sn, r, f) => handleSetupClick(sn, r, f) }) }

export function handleSetupClick(sn, r, f) { 
    if (!defState.armySel) return; 
    if (r > 3) { showToast('Place on rows 1-4!'); return } 
    if (defState.setupBoard[r][f] === 'wK') { showToast("That's the King's square!"); return } 
    sTick(); 
    const code = defState.armySel === 'wP2' ? 'wP' : defState.armySel; 
    defState.setupBoard[r][f] = code; 
    defState.placedPieces.push(defState.armySel); 
    const btn = document.getElementById('ap-' + defState.armySel); 
    if (btn) btn.classList.add('placed'); 
    defState.armySel = null; 
    document.querySelectorAll('.army-piece').forEach(b => b.classList.remove('selected-army')); 
    renderSetupBoard() 
}

export function startDefend() { 
    if (defState.placedPieces.length < 2) { showToast('Place at least 1 defending piece!'); return } 
    defState.battle = defState.setupBoard.map(r => [...r]); 
    const atk = defState.attack; 
    Object.entries(atk.positions).forEach(([pc, pos]) => { defState.battle[pos.r][pos.f] = pc.replace('2', '') }); 
    defState.sel = null; 
    defState.turn = 0; 
    defState.gameOver = false; 
    document.getElementById('def-setup').classList.add('hidden'); 
    document.getElementById('def-battle').classList.remove('hidden'); 
    document.getElementById('def-msg').textContent = 'Defend your King!'; 
    document.getElementById('def-hint-text').textContent = '💡 ' + atk.description; 
    document.getElementById('def-moves').textContent = defState.maxTurns; 
    say(atk.description); 
    renderDefBoard() 
}

export function renderDefBoard(opts) { drawBoard('def-board', defState.battle, { ...(opts || {}), click: (sn, r, f) => handleDefClick(sn, r, f) }) }

export function handleDefClick(sn, r, f) { 
    if (defState.gameOver) return; 
    sTick(); 
    const p = defState.battle[r][f]; 
    if (!defState.sel) { 
        if (p && p[0] === 'w') { 
            defState.sel = sn; 
            const moves = getLegalMovesFiltered(defState.battle, r, f); 
            renderDefBoard({ sel: sn, dot: moves }) 
        } 
        return 
    } 
    if (sn === defState.sel) { defState.sel = null; renderDefBoard(); return } 
    const { r: fr, f: ff } = sqRF(defState.sel); 
    const legal = getLegalMovesFiltered(defState.battle, fr, ff); 
    if (!legal.includes(sn)) { 
        if (p && p[0] === 'w') { 
            defState.sel = sn; 
            const mv = getLegalMovesFiltered(defState.battle, r, f); 
            renderDefBoard({ sel: sn, dot: mv }); return 
        } 
        showFeedback('def-feedback', "Can't move there!", 'no'); 
        defState.sel = null; renderDefBoard(); return 
    } 
    const captured = defState.battle[r][f]; 
    defState.battle = applyMove(defState.battle, fr, ff, r, f); 
    defState.sel = null; 
    defState.turn++; 
    document.getElementById('def-turn-num').textContent = defState.turn; 
    if (captured && captured[0] === 'b') { 
        showFeedback('def-feedback', '⚔️ Captured enemy ' + PN[captured[1]] + '!', 'ok'); 
        sOk() 
    } 
    if (isCheckmate(defState.battle, 'w')) { 
        defState.gameOver = true; 
        sBad(); 
        showFeedback('def-feedback', '❌ Your King was checkmated!', 'no'); 
        showResult('💪', 'Keep Trying!', 'Try again!', resetDefend); return 
    } 
    if (defState.turn >= defState.maxTurns) { 
        defState.gameOver = true; 
        sWin(); 
        confetti(60); 
        earn(5, 'defend'); 
        document.getElementById('def-msg').textContent = '🛡️ You survived!'; 
        showResult('🛡️', 'You Survived!', '5 turns defended! +5 stars', resetDefend); return 
    } 
    renderDefBoard({ b_: [sn] }); setTimeout(() => doDefendBotMove(), 700) 
}

export function doDefendBotMove() { 
    if (defState.gameOver) return; 
    const mv = botMove(defState.battle, 1); 
    if (!mv) return; 
    const { r: tr, f: tf } = sqRF(mv.to); 
    defState.battle = applyMove(defState.battle, mv.fr, mv.ff, tr, tf); 
    if (isInCheck(defState.battle, 'w')) { 
        renderDefBoard({ r: [mv.to] }); 
        sBad(); 
        document.getElementById('def-msg').textContent = '⚠️ CHECK! Defend!' 
    } else { 
        renderDefBoard({ y: [mv.to] }); 
        document.getElementById('def-msg').textContent = 'Bot moved! Defend!' 
    } 
}

export function showDefendHint() { 
    const moves = getAllMoves(defState.battle, 'w'); 
    if (!moves.length) return; 
    const m = moves[Math.random() * moves.length | 0]; 
    renderDefBoard({ sel: sqName(m.fr, m.ff), dot: getLegalMovesFiltered(defState.battle, m.fr, m.ff) }); 
    document.getElementById('def-msg').textContent = '💡 Try moving from ' + sqName(m.fr, m.ff) + '!' 
}

export function resetDefend() { document.getElementById('def-battle').classList.add('hidden'); document.getElementById('def-setup').classList.remove('hidden'); initDefend() }
