'use strict';
import { sTick,sOk,sWin,sBad,earn,showFB,hideFB,say,confetti,srf } from '../utils.js';
import { parseFEN,drawBoard,applyMove,getLegalMovesFiltered,isCheckmate } from '../board.js';
import { getCombos } from '../data_loader.js';

export let CMB={ idx:0,bd:null,step:1,sel:null,solved:false };
let COMBOS=[];

export async function initCombo() { COMBOS=await getCombos(); CMB.idx=Math.floor(Math.random()*COMBOS.length); loadCombo(); }

export function loadCombo() {
  const c=COMBOS[CMB.idx]; CMB.bd=parseFEN(c.fen); CMB.step=1; CMB.sel=null; CMB.solved=false;
  document.getElementById('cmb-kip').textContent=c.task;
  document.getElementById('cmb-turn').textContent='⬜ Move 1 of '+(c.m1r?2:1);
  hideFB('cmb-fb'); document.getElementById('cmb-next').style.display='none';
  buildComboSteps(c); drawBoard('cmb-board',CMB.bd,{click:(sn,r,f)=>handleCombo(sn,r,f,c)}); say(c.task);
}

export function buildComboSteps(c) {
  const div=document.getElementById('cmb-steps'); div.innerHTML='';
  const steps=c.m1r?['Move 1 ⬜','Bot responds ⬛','Move 2 ⬜ — Checkmate!']:['Move 1 ⬜ — Checkmate!'];
  steps.forEach((s,i)=>{ const span=document.createElement('span'); span.className='combo-step'+(i===0?' active':''); span.id='cs-'+i; span.textContent=s; div.appendChild(span); });
}

export function handleCombo(sn,r,f,c) {
  if(CMB.solved) return; sTick(); const p=CMB.bd[r][f];
  if(!CMB.sel){if(p&&p[0]==='w'){CMB.sel=sn;const lm=getLegalMovesFiltered(CMB.bd,r,f);drawBoard('cmb-board',CMB.bd,{sel:sn,dot:lm,click:(s2,r2,f2)=>handleCombo(s2,r2,f2,c)});}return;}
  if(sn===CMB.sel){CMB.sel=null;drawBoard('cmb-board',CMB.bd,{click:(s2,r2,f2)=>handleCombo(s2,r2,f2,c)});return;}
  const move=CMB.step===1?c.m1:c.m2; const{r:fr,f:ff}=srf(CMB.sel); const legal=getLegalMovesFiltered(CMB.bd,fr,ff);
  if(!legal.includes(sn)){showFB('cmb-fb',"Can't move there!",'no');sBad();CMB.sel=null;drawBoard('cmb-board',CMB.bd,{click:(s2,r2,f2)=>handleCombo(s2,r2,f2,c)});return;}
  if(CMB.sel===move.f&&sn===move.t){
    CMB.bd=applyMove(CMB.bd,fr,ff,r,f); CMB.sel=null; const cs=document.getElementById('cs-'+(CMB.step-1)); if(cs)cs.className='combo-step done';
    if(CMB.step===1&&c.m1r){
      showFB('cmb-fb','✅ Perfect! Watch the bot...','ok');sOk();CMB.step=2;document.getElementById('cmb-turn').textContent='⬛ Bot responds...';drawBoard('cmb-board',CMB.bd,{g:[sn]});
      const cs1=document.getElementById('cs-1');if(cs1)cs1.className='combo-step active';
      setTimeout(()=>{const resp=c.m1r;const{r:rr,f:rf}=srf(resp.t);CMB.bd=applyMove(CMB.bd,...Object.values(srf(resp.f)),rr,rf);drawBoard('cmb-board',CMB.bd,{y:[resp.t],click:(s2,r2,f2)=>handleCombo(s2,r2,f2,c)});showFB('cmb-fb','Bot played! Find Move 2!','info');document.getElementById('cmb-turn').textContent='⬜ Move 2 — Checkmate!';const cs1b=document.getElementById('cs-1');if(cs1b)cs1b.className='combo-step done';const cs2=document.getElementById('cs-2');if(cs2)cs2.className='combo-step active';},900);
    } else {
      if(isCheckmate(CMB.bd,'b')){CMB.solved=true;drawBoard('cmb-board',CMB.bd,{g:[sn]});showFB('cmb-fb','🏆 CHECKMATE! +5 stars!','ok');sWin();confetti(80);earn(5,'combo');document.getElementById('cmb-next').style.display='';say('Checkmate!');}
      else{showFB('cmb-fb','Good! But find checkmate!','info');sOk();drawBoard('cmb-board',CMB.bd,{click:(s2,r2,f2)=>handleCombo(s2,r2,f2,c)});}
    }
  } else { showFB('cmb-fb','❌ Wrong move! '+(CMB.step===1?c.h1:c.h2),'no');sBad();CMB.sel=null;drawBoard('cmb-board',CMB.bd,{click:(s2,r2,f2)=>handleCombo(s2,r2,f2,c)}); }
}

export function nextCombo() { CMB.idx=(CMB.idx+1)%COMBOS.length; loadCombo(); }
export function comboHint() { const c=COMBOS[CMB.idx]; showFB('cmb-fb','💡 '+(CMB.step===1?c.h1:c.h2),'info'); }
