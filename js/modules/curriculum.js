'use strict';

import { sOk, sBad, confetti } from '../utils.js';
import { drawBoard } from '../board.js';
import { CURR_DATA } from '../data.js';

let currBuilt = false;

export function buildCurriculum() {
  if (currBuilt) return; currBuilt = true; const cont = document.getElementById('curr-levels'); if(!cont) return; cont.innerHTML = '';
  CURR_DATA.forEach(level => {
    const card = document.createElement('div'); card.className = 'level-card';
    card.innerHTML = `<div class="level-head ${level.color}"><div class="level-badge">${level.label}</div><div class="level-info"><h3>${level.title}</h3><p>${level.subtitle}</p></div><div class="level-arrow">▶</div></div><div class="level-body"><p style="font-size:.8rem;font-weight:700;color:#666;margin-bottom:10px">🎯 ${level.goal}</p><div id="sl-${level.id}"></div></div>`;
    card.querySelector('.level-head').onclick = () => { card.classList.toggle('open'); if (card.classList.contains('open')) buildSessions(level) };
    cont.appendChild(card);
  });
}

export function buildSessions(level) { 
    const cont = document.getElementById('sl-' + level.id); 
    if (!cont || cont.children.length > 0) return; 
    level.sessions.forEach(s => { 
        const item = document.createElement('div'); 
        item.className = 'session-card'; 
        item.innerHTML = `<div class="session-title">Session ${s.num}: ${s.title}</div><div class="session-topics">${s.topics}</div>`; 
        const body = document.createElement('div'); 
        body.style.display = 'none'; 
        item.onclick = () => { 
            body.style.display = body.style.display === 'none' ? 'block' : 'none'; 
            if (body.style.display === 'block' && !body.children.length) buildConceptCard(s.concept, body) 
        }; 
        cont.appendChild(item); cont.appendChild(body) 
    }) 
}

export function buildConceptCard(c, container) {
  container.innerHTML = ''; 
  const card = document.createElement('div'); 
  card.className = 'concept-card'; 
  card.innerHTML = `<div style="font-size:2rem;margin-bottom:4px">${c.emoji}</div><div class="cc-title">${c.title}</div><div class="cc-explain">${c.explain}</div>`;
  const bw = document.createElement('div'); 
  bw.className = 'cc-board-wrap'; 
  const bd = document.createElement('div'); 
  bd.className = 'cc-board board'; 
  bd.id = 'ccb-' + Math.random().toString(36).slice(2); 
  bw.appendChild(bd); card.appendChild(bw); container.appendChild(card);
  setTimeout(() => drawBoard(bd.id, c.fen, { g: c.hl.green || [], y: c.hl.yellow || [] }), 30);
  const qDiv = document.createElement('div'); qDiv.style.marginTop = '8px'; qDiv.innerHTML = `<div style="font-weight:800;font-size:.85rem;color:#666;margin-bottom:6px">✅ Quiz: ${c.quiz.q}</div>`;
  const opts = document.createElement('div'); opts.className = 'quiz-opts'; let done = false;
  c.quiz.opts.forEach(opt => { 
      const b = document.createElement('button'); 
      b.className = 'quiz-opt'; b.textContent = opt; 
      b.onclick = () => { if (done) return; done = true; const ok = opt === c.quiz.ans; b.classList.add(ok ? 'ok' : 'no'); opts.querySelectorAll('.quiz-opt').forEach(x => { if (x.textContent === c.quiz.ans) x.classList.add('ok') }); const fb = document.createElement('div'); fb.className = 'quiz-feedback show ' + (ok ? 'ok' : 'no'); fb.textContent = ok ? c.quiz.right : c.quiz.wrong; qDiv.appendChild(fb); if (ok) { sOk(); confetti(20) } else sBad() }; opts.appendChild(b) 
  });
  qDiv.appendChild(opts); container.appendChild(qDiv);
  const pDiv = document.createElement('div'); pDiv.style.marginTop = '8px'; pDiv.innerHTML = `<div class="puzzle-instr">${c.puzzle.instr}</div>`;
  const pbw = document.createElement('div'); pbw.className = 'cc-board-wrap'; const pbd = document.createElement('div'); pbd.className = 'cc-board board'; const pbId = 'pzb-' + Math.random().toString(36).slice(2, 8); pbd.id = pbId; pbw.appendChild(pbd); pDiv.appendChild(pbw);
  const pr = document.createElement('div'); pr.className = 'puzzle-result'; pDiv.appendChild(pr); let pandswered = false;
  setTimeout(() => { drawBoard(pbId, c.puzzle.fen, { y: c.puzzle.hl.yellow || [], g: c.puzzle.hl.green || [], click: (sn) => { if (pandswered) return; if (c.puzzle.ans.includes(sn)) { pandswered = true; pr.textContent = '🎉 Correct!'; pr.className = 'puzzle-result show ok'; sOk(); confetti(20); drawBoard(pbId, c.puzzle.fen, { g: [sn] }) } else { pr.textContent = '❌ Try again!'; pr.className = 'puzzle-result show no'; sBad(); setTimeout(() => { pr.className = 'puzzle-result' }, 1000) } } }) }, 30);
  container.appendChild(pDiv);
}
