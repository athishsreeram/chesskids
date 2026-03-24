'use strict';

import { sTick, sOk, sBad, earn, showFB, hideFB, say, confetti } from '../utils.js';
import { drawBoard } from '../board.js';
import { EVALS } from '../data.js';

export let EV = { idx: 0, correct: 0, total: 0, answered: false };

export function initEval() { EV = { idx: Math.floor(Math.random() * EVALS.length), correct: 0, total: 0, answered: false }; loadEval() }

export function loadEval() { 
    const e = EVALS[EV.idx]; EV.answered = false; 
    document.getElementById('ev-ctr').textContent = 'Position ' + (EV.idx + 1) + '/' + EVALS.length; 
    document.getElementById('ev-mat').textContent = '⬜ White: ' + e.w + ' pts | ⬛ Black: ' + e.b + ' pts'; 
    document.getElementById('ev-prog').textContent = EV.correct + ' / ' + EV.total; hideFB('ev-fb'); 
    document.getElementById('ev-next').style.display = 'none';
    ['ev-w', 'ev-e', 'ev-b'].forEach(id => { const el = document.getElementById(id); if (el) el.className = 'eval-opt' }); 
    drawBoard('ev-board', e.fen, {}); say('Who is winning?') 
}

export function evalAnswer(ans) { 
    if (EV.answered) return; sTick(); 
    EV.answered = true; EV.total++; 
    const e = EVALS[EV.idx]; const correct = ans === e.ans; 
    if (correct) EV.correct++; 
    const map = { white: 'ev-w', equal: 'ev-e', black: 'ev-b' }; 
    document.getElementById(map[ans]).classList.add(correct ? 'ok' : 'no'); 
    document.getElementById(map[e.ans]).classList.add('ok'); 
    if (correct) { showFB('ev-fb', '✅ ' + e.exp, 'ok'); sOk(); confetti(25); earn(2, 'eval') } 
    else { showFB('ev-fb', '❌ ' + e.exp, 'no'); sBad() }; 
    document.getElementById('ev-prog').textContent = EV.correct + ' / ' + EV.total; 
    document.getElementById('ev-next').style.display = ''; say(e.exp) 
}

export function nextEval() { EV.idx = (EV.idx + 1) % EVALS.length; loadEval() }
export function evalHint() { showFB('ev-fb', '💡 ' + EVALS[EV.idx].hint, 'info') }
