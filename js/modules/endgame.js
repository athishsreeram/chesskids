'use strict';

import { sTick, sOk, sWin, sBad, earn, showFB, say, confetti, srf } from '../utils.js';
import { parseFEN, drawBoard, applyMove, getLegalMovesFiltered } from '../board.js';
import { ENDGAMES } from '../data.js';

export let END = { type: null, step: 0, bd: null, sel: null, done: false };

export function initEndCoach() { 
    document.getElementById('end-menu').classList.remove('hidden'); 
    document.getElementById('end-lesson').classList.add('hidden') 
}

export function startEndgame(type) { 
    END = { type, step: 0, bd: null, sel: null, done: false }; 
    const eg = ENDGAMES[type]; 
    document.getElementById('end-kip').textContent = eg.title + ' — Follow the steps!'; 
    document.getElementById('end-menu').classList.add('hidden'); 
    document.getElementById('end-lesson').classList.remove('hidden'); 
    buildEndSteps(eg); loadEndStep() 
}

export function buildEndSteps(eg) { 
    const div = document.getElementById('end-steps'); div.innerHTML = ''; 
    eg.steps.forEach((s, i) => { 
        const item = document.createElement('div'); 
        item.className = 'step-item' + (i === 0 ? ' active' : ''); 
        item.id = 'es-' + i; 
        item.innerHTML = `<div class="step-num">${i + 1}</div><span>${s.instr}</span>`; div.appendChild(item) 
    }) 
}

export function loadEndStep() { 
    const eg = ENDGAMES[END.type]; if (!eg) return; 
    const step = eg.steps[END.step]; if (!step) return; 
    END.bd = parseFEN(step.fen); END.sel = null; 
    showFB('end-fb', step.task, 'info'); 
    document.getElementById('end-next').style.display = 'none'; 
    document.getElementById('end-steps').querySelectorAll('.step-item').forEach((el, i) => { 
        el.className = 'step-item' + (i < END.step ? ' done' : i === END.step ? ' active' : '') 
    }); 
    drawBoard('end-board', END.bd, { click: (sn, r, f) => handleEnd(sn, r, f, step) }); 
    say(step.instr) 
}

export function handleEnd(sn, r, f, step) { 
    if (END.done) return; 
    sTick(); const p = END.bd[r][f]; 
    if (!END.sel) { 
        if (p && p[0] === 'w') { 
            END.sel = sn; 
            drawBoard('end-board', END.bd, { sel: sn, dot: getLegalMovesFiltered(END.bd, r, f), click: (s2, r2, f2) => handleEnd(s2, r2, f2, step) }) 
        } 
        return 
    } 
    if (sn === END.sel) { 
        END.sel = null; 
        drawBoard('end-board', END.bd, { click: (s2, r2, f2) => handleEnd(s2, r2, f2, step) }); return 
    } 
    const { r: fr, f: ff } = srf(END.sel); 
    const legal = getLegalMovesFiltered(END.bd, fr, ff); 
    if (!legal.includes(sn)) { 
        showFB('end-fb', 'Cannot! ' + step.task, 'no'); sBad(); END.sel = null; 
        drawBoard('end-board', END.bd, { click: (s2, r2, f2) => handleEnd(s2, r2, f2, step) }); return 
    } 
    if (END.sel === step.tf && sn === step.tt) { 
        END.bd = applyMove(END.bd, fr, ff, r, f); END.sel = null; 
        drawBoard('end-board', END.bd, { g: [sn] }); sOk(); earn(2, 'endcoach'); 
        document.getElementById('es-' + END.step).className = 'step-item done'; END.step++; 
        const eg = ENDGAMES[END.type]; 
        if (END.step >= eg.steps.length) { 
            END.done = true; showFB('end-fb', '🏆 Lesson complete! +5 bonus!', 'ok'); 
            sWin(); confetti(60); earn(5, 'endcoach'); say('Endgame complete!') 
        } else { 
            showFB('end-fb', '✅ ' + eg.steps[END.step].instr, 'ok'); 
            document.getElementById('end-next').style.display = '' 
        } 
    } else { 
        showFB('end-fb', '❌ Move ' + step.tf + ' to ' + step.tt, 'no'); 
        sBad(); END.sel = null; 
        drawBoard('end-board', END.bd, { click: (s2, r2, f2) => handleEnd(s2, r2, f2, step) }) 
    } 
}

export function endgameNext() { loadEndStep() }
export function endgameHint() { const step = ENDGAMES[END.type]?.steps[END.step]; if (step) showFB('end-fb', '💡 Move ' + step.tf + ' to ' + step.tt, 'info') }
export function resetEndgame() { END.step = 0; loadEndStep() }
