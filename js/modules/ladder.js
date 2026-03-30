'use strict';
import { sTick,sOk,sWin,sBad,earn,showFB,hideFB,say,confetti,srf } from '../utils.js';
import { parseFEN,drawBoard,applyMove,getLegalMovesFiltered,isCheckmate } from '../board.js';
import { getLdModes } from '../data_loader.js';

export let LD={ mode:'learn',step:0,sel:null,done:false };
let LD_MODES={};

export async function initLadder() { LD_MODES=await getLdModes(); ldSetMode('learn'); }

export function ldSetMode(mode) {
  LD={mode,step:0,sel:null,done:false};
  ['learn','practice','challenge'].forEach(m=>{ const btn=document.getElementById('ld-tab-'+m); if(btn)btn.classList.toggle('on',m===mode); });
  ldLoad();
}

export function ldLoad() {
  const modeData=LD_MODES[LD.mode]; if(!modeData)return; const step=modeData.steps[LD.step]; if(!step)return;
  LD.sel=null; LD.done=false; document.getElementById('ld-task').textContent=step.task;
  hideFB('ld-fb'); document.getElementById('ld-next').style.display='none';
  ldBuildProgress(modeData.steps.length); drawBoard('ld-board',step.fen,{click:(sn,r,f)=>handleLadder(sn,r,f,step)}); say(step.task);
}

export function ldBuildProgress(total) {
  const div=document.getElementById('ld-progress'); div.innerHTML='';
  const lbl=document.createElement('span'); lbl.style.cssText='font-weight:800;font-size:.78rem;color:#888;margin-right:4px'; lbl.textContent='Step:'; div.appendChild(lbl);
  for(let i=0;i<total;i++){const d=document.createElement('div');d.className='lp-rank'+(i<LD.step?' done':i===LD.step?' active':'');d.textContent=i+1;div.appendChild(d);}
}

export function handleLadder(sn,r,f,step) {
  if(LD.done)return; sTick(); const bd=parseFEN(step.fen); const p=bd[r][f];
  if(!LD.sel){if(p&&p[0]==='w'&&p[1]==='R'){LD.sel=sn;const lm=getLegalMovesFiltered(bd,r,f);drawBoard('ld-board',step.fen,{sel:sn,dot:lm,click:(s2,r2,f2)=>handleLadder(s2,r2,f2,step)});}return;}
  if(sn===LD.sel){LD.sel=null;drawBoard('ld-board',step.fen,{click:(s2,r2,f2)=>handleLadder(s2,r2,f2,step)});return;}
  const{r:fr,f:ff}=srf(LD.sel); const legal=getLegalMovesFiltered(bd,fr,ff);
  if(!legal.includes(sn)){showFB('ld-fb','Cannot! '+step.hint,'no');sBad();LD.sel=null;drawBoard('ld-board',step.fen,{click:(s2,r2,f2)=>handleLadder(s2,r2,f2,step)});return;}
  if(LD.sel===step.from&&sn===step.to){
    LD.done=true; const nb=applyMove(bd,fr,ff,r,f); drawBoard('ld-board',nb,{g:[sn]});
    showFB('ld-fb','✅ '+step.explain,'ok'); sOk(); earn(2,'ladder'); document.getElementById('ld-next').style.display=''; say(step.explain);
    if(isCheckmate(nb,'b')){sWin();confetti(80);earn(5,'ladder');showFB('ld-fb','🏆 CHECKMATE! Perfect Double Ladder!','ok');}
  } else { showFB('ld-fb','Wrong! '+step.hint,'no');sBad();LD.sel=null;drawBoard('ld-board',step.fen,{click:(s2,r2,f2)=>handleLadder(s2,r2,f2,step)}); }
}

export function ldNext() { const modeData=LD_MODES[LD.mode]; LD.step=(LD.step+1)%modeData.steps.length; ldLoad(); }
export function ldHint() { const step=LD_MODES[LD.mode].steps[LD.step]; showFB('ld-fb','💡 '+step.hint,'info'); drawBoard('ld-board',step.fen,{y:[step.to],sel:step.from,click:(sn,r,f)=>handleLadder(sn,r,f,step)}); say(step.hint); }
export function ldReset() { LD.step=0; ldLoad(); }
