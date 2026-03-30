'use strict';
import { sTick,sOk,sBad,earn,showFB,hideFB,say,confetti,PM,srf } from '../utils.js';
import { parseFEN,drawBoard,applyMove,getLegalMovesFiltered } from '../board.js';
import { getFtScenarios } from '../data_loader.js';

export let FT={ skill:'fork',idx:0,sel:null,answered:false };
let FT_SCENARIOS={};

export async function initForkTrain() { FT_SCENARIOS=await getFtScenarios(); ftSetSkill('fork'); }

export function ftSetSkill(skill) {
  FT={skill,idx:0,sel:null,answered:false};
  ['fork','double'].forEach(s=>{ const btn=document.getElementById('ft-tab-'+s); if(btn)btn.classList.toggle('on',s===skill); });
  const concepts={ fork:{em:'🍴',name:'Fork!',exp:'ONE piece jumps to attack TWO enemy pieces at once!'},double:{em:'💥',name:'Double Attack!',exp:'ONE MOVE creates TWO threats — opponent can only handle one!'} };
  const con=concepts[skill];
  document.querySelector('#ft-concept .tc-emoji').textContent=con.em;
  document.querySelector('#ft-concept .tc-name').textContent=con.name;
  document.getElementById('ft-con-exp').textContent=con.exp; ftLoad();
}

export function ftLoad() {
  const list=FT_SCENARIOS[FT.skill]; const sc=list[FT.idx%list.length];
  FT.sel=null; FT.answered=false;
  document.getElementById('ft-ctr').textContent='Scenario '+(FT.idx%list.length+1)+'/'+list.length;
  document.getElementById('ft-kip').textContent=sc.task; hideFB('ft-fb'); document.getElementById('ft-next').style.display='none';
  const div=document.getElementById('ft-targets'); div.innerHTML='';
  if(sc.pairs){sc.pairs.forEach(([code])=>{ const tag=document.createElement('div'); tag.className='fork-target'; tag.id='ft-tgt-'+code; tag.textContent=PM[code]||code; div.appendChild(tag); });}
  say(sc.task); drawBoard('ft-board',sc.fen,{click:(sn,r,f)=>handleFork(sn,r,f,sc)});
}

export function handleFork(sn,r,f,sc) {
  if(FT.answered)return; sTick(); const bd=parseFEN(sc.fen); const p=bd[r][f];
  if(!FT.sel){if(p&&p[0]==='w'){FT.sel=sn;const lm=getLegalMovesFiltered(bd,r,f);drawBoard('ft-board',sc.fen,{sel:sn,dot:lm,click:(s2,r2,f2)=>handleFork(s2,r2,f2,sc)});}return;}
  if(sn===FT.sel){FT.sel=null;drawBoard('ft-board',sc.fen,{click:(s2,r2,f2)=>handleFork(s2,r2,f2,sc)});return;}
  const{r:fr,f:ff}=srf(FT.sel); const legal=getLegalMovesFiltered(bd,fr,ff);
  if(!legal.includes(sn)){if(p&&p[0]==='w'){FT.sel=sn;drawBoard('ft-board',sc.fen,{sel:sn,dot:getLegalMovesFiltered(bd,r,f),click:(s2,r2,f2)=>handleFork(s2,r2,f2,sc)});return;}showFB('ft-fb','Cannot! '+sc.hint,'no');sBad();FT.sel=null;drawBoard('ft-board',sc.fen,{click:(s2,r2,f2)=>handleFork(s2,r2,f2,sc)});return;}
  if(sc.answers.includes(sn)){
    FT.answered=true; const nb=applyMove(bd,fr,ff,r,f); drawBoard('ft-board',nb,{g:[sn]});
    if(sc.pairs)sc.pairs.forEach(([code])=>{ const el=document.getElementById('ft-tgt-'+code); if(el)el.classList.add('found'); });
    showFB('ft-fb','🍴 '+sc.explain,'ok'); sOk(); confetti(50); earn(3,'fork'); document.getElementById('ft-next').style.display=''; say(sc.explain);
  } else { showFB('ft-fb','❌ Not two pieces! '+sc.hint,'no');sBad();FT.sel=null;drawBoard('ft-board',sc.fen,{click:(sn2,r2,f2)=>handleFork(sn2,r2,f2,sc)}); }
}

export function ftNext() { FT.idx=(FT.idx+1)%FT_SCENARIOS[FT.skill].length; ftLoad(); }
export function ftHint() { const sc=FT_SCENARIOS[FT.skill][FT.idx%FT_SCENARIOS[FT.skill].length]; showFB('ft-fb','💡 '+sc.hint,'info'); drawBoard('ft-board',sc.fen,{y:sc.answers,sel:sc.from,click:(sn,r,f)=>handleFork(sn,r,f,sc)}); say(sc.hint); }
