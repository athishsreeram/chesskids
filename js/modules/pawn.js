'use strict';
import { sTick,sOk,sBad,earn,showFB,hideFB,say,confetti } from '../utils.js';
import { drawBoard } from '../board.js';
import { getPawns,getPwcats } from '../data_loader.js';

export let PW={ cat:'all',idx:0,answered:false };
let pwBuilt=false, PAWNS=[], PWCATS=[];

export async function initPawn() {
  PAWNS=await getPawns(); PWCATS=await getPwcats();
  if(!pwBuilt){pwBuilt=true;buildPwCats();} loadPawn();
}

export function buildPwCats() {
  const nav=document.getElementById('pw-cats'); if(!nav)return; nav.innerHTML='';
  PWCATS.forEach(cat=>{
    const b=document.createElement('button'); b.className='pcat'+(cat.id==='all'?' on':''); b.textContent=cat.lbl;
    b.onclick=()=>{ document.querySelectorAll('#s-pawn .pcat').forEach(x=>x.classList.remove('on')); b.classList.add('on'); PW.cat=cat.id; PW.idx=0; loadPawn(); };
    nav.appendChild(b);
  });
}

export function getPwList() { return PW.cat==='all'?PAWNS:PAWNS.filter(p=>p.cat===PW.cat); }

export function loadPawn() {
  const list=getPwList(); if(!list.length)return; const pw=list[PW.idx%list.length]; PW.answered=false;
  document.getElementById('pw-kip').textContent=pw.task;
  document.getElementById('pw-ctr').textContent='Q '+(PW.idx%list.length+1)+'/'+list.length;
  hideFB('pw-fb'); document.getElementById('pw-next').style.display='none';
  const ch=document.getElementById('pw-choices'); ch.innerHTML=''; say(pw.task);
  if(pw.type==='spot'){drawBoard('pw-board',pw.fen,{click:(sn)=>handlePawnSpot(sn,pw)});}
  else {
    drawBoard('pw-board',pw.fen,{});
    if(pw.q){const q=document.createElement('div');q.style.cssText='font-weight:800;font-size:.88rem;margin-bottom:8px;padding:9px 12px;background:var(--card);border:2.5px solid var(--ink);border-radius:var(--r-sm)';q.textContent=pw.q;ch.appendChild(q);}
    const yn=document.createElement('div'); yn.className='yn-row';
    ['Yes ✅','No ❌'].forEach((lbl,i)=>{
      const b=document.createElement('button'); b.className='yn-btn '+(i===0?'yn-yes':'yn-no'); b.textContent=lbl;
      b.onclick=()=>{ if(PW.answered)return; PW.answered=true; sTick(); const ok=(i===0)===pw.ya; if(ok){sOk();confetti(25);earn(2,'pawn');showFB('pw-fb','✅ '+pw.exp,'ok');b.className='yn-btn ok';}else{sBad();showFB('pw-fb','❌ '+pw.exp,'no');b.className='yn-btn wrong';}; document.getElementById('pw-next').style.display=''; say(pw.exp); };
      yn.appendChild(b);
    }); ch.appendChild(yn);
  }
}

export function handlePawnSpot(sn,pw) {
  if(PW.answered)return; sTick(); PW.answered=true;
  if(pw.ans.includes(sn)){sOk();confetti(25);earn(2,'pawn');showFB('pw-fb','✅ '+pw.exp,'ok');drawBoard('pw-board',pw.fen,{g:[sn]});}
  else{sBad();showFB('pw-fb','❌ '+pw.exp,'no');drawBoard('pw-board',pw.fen,{r:[sn],g:pw.ans});}
  document.getElementById('pw-next').style.display='';
}

export function nextPawn() { PW.idx=(PW.idx+1)%Math.max(getPwList().length,1); loadPawn(); }
export function pawnHint() { showFB('pw-fb','💡 '+getPwList()[PW.idx%getPwList().length].hint,'info'); }
