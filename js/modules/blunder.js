'use strict';
import { sTick,sOk,sBad,sWin,earn,showFB,hideFB,say,confetti } from '../utils.js';
import { drawBoard } from '../board.js';
import { getBlunders } from '../data_loader.js';

export let BLU={ idx:0,correct:0,total:0,phase:0,answered:false };
let BLUNDERS=[];

export async function initBlunder() {
  BLUNDERS=await getBlunders();
  BLU={ idx:Math.floor(Math.random()*BLUNDERS.length),correct:0,total:0,phase:0,answered:false }; loadBlunder();
}

export function loadBlunder() {
  const b=BLUNDERS[BLU.idx]; BLU.answered=false; BLU.phase=0;
  document.getElementById('blu-kip').innerHTML='White just played: <b>'+b.moved+'</b>. Is this a BLUNDER?';
  document.getElementById('blu-ctr').textContent='Position '+(BLU.idx+1)+'/'+BLUNDERS.length;
  document.getElementById('blu-prog').textContent=BLU.correct+' / '+BLU.total;
  hideFB('blu-fb'); document.getElementById('blu-next').style.display='none'; document.getElementById('blu-tap-inst').classList.add('hidden');
  document.getElementById('blu-yes').className='yn-btn yn-yes'; document.getElementById('blu-no').className='yn-btn yn-no';
  drawBoard('blu-board',b.fen,{}); say(document.getElementById('blu-kip').textContent);
}

export function blunderAnswer(saidSafe) {
  if(BLU.answered) return; sTick(); const b=BLUNDERS[BLU.idx];
  const correct=(saidSafe&&!b.isB)||(!saidSafe&&b.isB); BLU.total++; if(correct)BLU.correct++; BLU.answered=true;
  document.getElementById(saidSafe?'blu-yes':'blu-no').className='yn-btn '+(correct?'ok':'wrong');
  document.getElementById(saidSafe?'blu-no':'blu-yes').className='yn-btn '+(correct?'':'ok');
  if(correct&&b.isB&&b.hang.length>0){showFB('blu-fb','✅ Correct! Tap the hanging piece for bonus!','ok');document.getElementById('blu-tap-inst').classList.remove('hidden');BLU.phase=1;earn(1,'blunder');drawBoard('blu-board',b.fen,{click:(sn)=>blunderTap(sn,b)});}
  else if(correct){showFB('blu-fb','✅ '+b.exp,'ok');sOk();confetti(30);earn(2,'blunder');document.getElementById('blu-next').style.display='';}
  else{showFB('blu-fb','❌ '+b.exp,'no');sBad();document.getElementById('blu-next').style.display='';}
  document.getElementById('blu-prog').textContent=BLU.correct+' / '+BLU.total;
}

export function blunderTap(sn,b) {
  if(BLU.phase!==1) return; sTick();
  if(b.hang.includes(sn)){BLU.phase=2;sWin();confetti(40);earn(2,'blunder');showFB('blu-fb','🎉 Found it! '+b.exp,'ok');drawBoard('blu-board',b.fen,{r:b.hang});document.getElementById('blu-tap-inst').classList.add('hidden');document.getElementById('blu-next').style.display='';}
  else{showFB('blu-fb','Not that one!','info');sBad();}
}

export function nextBlunder() { BLU.idx=(BLU.idx+1)%BLUNDERS.length; loadBlunder(); }
export function blunderHint() { showFB('blu-fb','💡 '+BLUNDERS[BLU.idx].hint,'info'); }
