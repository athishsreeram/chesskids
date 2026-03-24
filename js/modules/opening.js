'use strict';

import { sTick, sOk, sBad, earn, drawBoard, showFB, hideFB, say, confetti } from '../utils.js';
import { OPENINGS } from '../data.js';

export let OP = { cat: 'all', idx: 0, answered: false }; 
let opBuilt = false;

export function initOpening() { if (!opBuilt) { opBuilt = true; buildOpCats() } loadOpening() }

export function buildOpCats() { 
    const nav = document.getElementById('op-cats'); if(!nav) return; nav.innerHTML = '';
    [{ id: 'all', lbl: 'All' }, { id: 'principles', lbl: '📐 Principles' }, { id: 'castling', lbl: '🏰 Castling' }].forEach(cat => { 
        const b = document.createElement('button'); b.className = 'pcat' + (cat.id === 'all' ? ' on' : ''); b.textContent = cat.lbl; 
        b.onclick = () => { 
            document.querySelectorAll('#s-opening .pcat').forEach(x => x.classList.remove('on')); b.classList.add('on'); OP.cat = cat.id; OP.idx = 0; loadOpening() 
        }; nav.appendChild(b) 
    }) 
}

export function getOpList() { return OP.cat === 'all' ? OPENINGS : OPENINGS.filter(o => o.cat === OP.cat) }

export function loadOpening() { 
    const list = getOpList(); if (!list.length) return; 
    const op = list[OP.idx % list.length]; OP.answered = false; 
    document.getElementById('op-kip').textContent = op.q; 
    document.getElementById('op-ctr').textContent = 'Q ' + (OP.idx % list.length + 1) + '/' + list.length; 
    hideFB('op-fb'); 
    document.getElementById('op-next').style.display = 'none'; 
    buildOpChoice(op); say(op.q) 
}

export function buildOpChoice(op) { 
    const div = document.getElementById('op-choices'); div.innerHTML = '';
    [op.o1, op.o2].sort(() => Math.random() - .5).forEach(opt => { 
        const card = document.createElement('div'); card.className = 'op-card'; 
        const bw = document.createElement('div'); bw.className = 'op-bw'; 
        const bd = document.createElement('div'); bd.className = 'op-board board'; 
        const bid = 'opb-' + Math.random().toString(36).slice(2, 8); bd.id = bid; 
        const lbl = document.createElement('div'); lbl.className = 'op-label'; lbl.textContent = opt.label; 
        card.appendChild(lbl); bw.appendChild(bd); card.appendChild(bw); 
        card.onclick = () => { 
            if (OP.answered) return; OP.answered = true; sTick(); 
            if (opt.ok) { 
                sOk(); confetti(30); earn(2, 'opening'); 
                showFB('op-fb', '✅ ' + opt.why, 'ok'); 
                card.classList.add('ok') 
            } else { 
                sBad(); showFB('op-fb', '❌ ' + opt.why, 'no'); 
                card.classList.add('no') 
            }; 
            document.getElementById('op-next').style.display = ''; say(opt.why) 
        }; 
        div.appendChild(card); setTimeout(() => drawBoard(bid, opt.fen, {}), 50) 
    }) 
}

export function nextOpening() { OP.idx = (OP.idx + 1) % Math.max(getOpList().length, 1); loadOpening() }
