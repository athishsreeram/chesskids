'use strict';

import { sTick, sOk, sBad, earn, drawBoard, showFB, hideFB, say, confetti } from '../utils.js';
import { DK_CONCEPTS, DK_SCENARIOS } from '../data.js';

export let DK = { skill: 'move', idx: 0, answered: false, hintUsed: 0 };

export function initDefendCheck() { dkSetSkill('move') }

export function dkSetSkill(skill) { 
    DK.skill = skill; DK.idx = 0; DK.answered = false; DK.hintUsed = 0;
    ['move', 'block', 'capture', 'protect'].forEach(s => { 
        const btn = document.getElementById('dk-tab-' + s); if (btn) btn.classList.toggle('on', s === skill) 
    }); 
    const con = DK_CONCEPTS[skill]; 
    document.getElementById('dk-con-em').textContent = con.em; 
    document.getElementById('dk-con-name').textContent = con.name; 
    document.getElementById('dk-con-exp').textContent = con.exp; dkLoad() 
}

export function dkLoad() { 
    const scenarios = DK_SCENARIOS[DK.skill]; 
    const sc = scenarios[DK.idx % scenarios.length]; 
    DK.answered = false; DK.hintUsed = 0; 
    document.getElementById('dk-ctr').textContent = 'Scenario ' + (DK.idx % scenarios.length + 1) + '/' + scenarios.length; 
    document.getElementById('dk-kip').textContent = sc.task; hideFB('dk-fb'); 
    document.getElementById('dk-next').style.display = 'none'; 
    const dots = document.getElementById('dk-dots'); dots.innerHTML = ''; 
    for (let i = 0; i < 3; i++) { const d = document.createElement('div'); d.className = 'hint-dot'; d.id = 'dk-dot-' + i; dots.appendChild(d) } 
    say(sc.task); drawBoard('dk-board', sc.fen, { click: (sn, r, f) => dkClick(sn, r, f, sc) }) 
}

export function dkClick(sn, r, f, sc) { 
    if (DK.answered) return; sTick(); 
    const correct = sc.answers && sc.answers.includes(sn); 
    const isBad = sc.bad && sc.bad.includes(sn); 
    if (correct) { 
        DK.answered = true; drawBoard('dk-board', sc.fen, { g: [sn] }); 
        showFB('dk-fb', '🎉 ' + sc.explain, 'ok'); sOk(); confetti(40); earn(2, 'defend'); 
        document.getElementById('dk-next').style.display = ''; say(sc.explain) 
    } else if (isBad) { 
        showFB('dk-fb', '❌ Dangerous! ' + sc.hint, 'no'); sBad(); 
        drawBoard('dk-board', sc.fen, { r: [sn], click: (sn2, r2, f2) => dkClick(sn2, r2, f2, sc) }) 
    } else { showFB('dk-fb', 'Not quite! Try again.', 'info'); sBad() } 
}

export function dkHint() { 
    const sc = DK_SCENARIOS[DK.skill][DK.idx % DK_SCENARIOS[DK.skill].length]; 
    showFB('dk-fb', '💡 ' + sc.hint, 'info'); DK.hintUsed++; 
    const dot = document.getElementById('dk-dot-' + (DK.hintUsed - 1)); if (dot) dot.classList.add('used'); 
    if (sc.answers && sc.answers.length > 0) drawBoard('dk-board', sc.fen, { y: sc.answers, r: sc.bad || [], click: (sn, r, f) => dkClick(sn, r, f, sc) }); 
    say(sc.hint) 
}

export function dkNext() { DK.idx++; dkLoad() }
