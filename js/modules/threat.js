'use strict';
import { sTick,sOk,sBad,earn,showFeedback,hideFeedback,say,confetti } from '../utils.js';
import { drawBoard } from '../board.js';
import { getThreats } from '../data_loader.js';

export let thrState={ idx:0,correct:0,total:0,answered:false };
let THREATS=[];

export async function initThreat() {
  THREATS=await getThreats();
  thrState.idx=Math.floor(Math.random()*THREATS.length); thrState.correct=0; thrState.total=0; loadThreat();
}

export function loadThreat() {
  const t=THREATS[thrState.idx]; thrState.answered=false;
  document.getElementById('thr-task').textContent=t.task;
  document.getElementById('thr-progress').textContent=thrState.correct+' / '+thrState.total+' correct';
  hideFeedback('thr-feedback'); document.getElementById('thr-next').style.display='none';
  say(t.task); drawBoard('thr-board',t.fen,{click:(sn)=>handleThreatClick(sn,t)});
}

export function handleThreatClick(sn,t) {
  if(thrState.answered) return; sTick(); thrState.total++; thrState.answered=true;
  if(t.answers.includes(sn)){thrState.correct++;showFeedback('thr-feedback','🎉 '+t.explanation,'ok');sOk();earn(2,'threat');confetti(30);drawBoard('thr-board',t.fen,{g:[sn]});}
  else{showFeedback('thr-feedback','❌ '+t.explanation,'no');sBad();drawBoard('thr-board',t.fen,{r:[sn],y:t.answers});}
  document.getElementById('thr-progress').textContent=thrState.correct+' / '+thrState.total+' correct';
  document.getElementById('thr-next').style.display='';
}

export function nextThreat() { thrState.idx=(thrState.idx+1)%THREATS.length; loadThreat(); }
export function showThreatHint() { showFeedback('thr-feedback','💡 '+THREATS[thrState.idx].hint,'info'); }
