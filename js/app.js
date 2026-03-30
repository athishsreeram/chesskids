'use strict';

import { ST,save,load,updateStarDisplay,say,showToast,earn,resetProgress,showResult,VALID_CODES,sWin,sBad,setResultNext,confetti } from './utils.js';
import { preloadData } from './data_loader.js';
import { initPuzzle,nextPuzzle,showPuzzleHint } from './modules/puzzle.js';
import { initThreat,nextThreat,showThreatHint } from './modules/threat.js';
import { initDojo,selectDojoPiece,newDojoChallenge } from './modules/dojo.js';
import { initCapture,nextCapture,handleCapClick } from './modules/capture.js';
import { initDefend,startDefend,showDefendHint,resetDefend } from './modules/defend.js';
import { buildCurriculum } from './modules/curriculum.js';
import { initBlunder,blunderAnswer,nextBlunder,blunderHint } from './modules/blunder.js';
import { initPatterns,nextPatternChallenge,closePat } from './modules/patterns.js';
import { initCombo,nextCombo,comboHint } from './modules/combo.js';
import { initEndCoach,startEndgame,endgameNext,endgameHint,resetEndgame } from './modules/endgame.js';
import { initOpening,nextOpening } from './modules/opening.js';
import { initEval,evalAnswer,nextEval,evalHint } from './modules/eval.js';
import { initPawn,nextPawn,pawnHint } from './modules/pawn.js';
import { initDefendCheck,dkSetSkill,dkNext,dkHint } from './modules/defend_check.js';
import { initLadder,ldSetMode,ldNext,ldHint,ldReset } from './modules/ladder.js';
import { initForkTrain,ftSetSkill,ftNext,ftHint } from './modules/fork.js';
import { renderProgress } from './modules/progress.js';
import { setDiff,startBotGame,showBotHint,resetBotGame } from './modules/bot.js';

// ── ONBOARDING ──
let ob_age='',ob_level='';

function ob_next(step) {
  if(step===1){ const name=document.getElementById('ob-name-input').value.trim(); if(!name){showToast('Tell me your name! 😊');return;} ST.user.name=name; document.getElementById('ob-age-title').textContent='How old are you, '+name+'?'; }
  if(step===2){ if(!ob_age){showToast('Pick your age group! 🎂');return;} }
  document.getElementById('ob-'+step).classList.remove('ob-active');
  document.getElementById('ob-'+(step+1)).classList.add('ob-active');
}
function ob_setAge(age,btn) { ob_age=age; document.querySelectorAll('#ob-2 .ob-choice').forEach(b=>b.classList.remove('selected')); btn.classList.add('selected'); }
function ob_setLevel(level,btn) { ob_level=level; document.querySelectorAll('#ob-3 .ob-choice').forEach(b=>b.classList.remove('selected')); btn.classList.add('selected'); }
function ob_finish() {
  if(!ob_age){showToast('Pick your age group! 🎂');return;}
  if(!ob_level){showToast('Pick your chess level! ♟');return;}
  ST.user.age=ob_age; ST.user.level=ob_level; ST.onboarded=true; save();
  document.getElementById('onboarding').style.display='none'; updateHomePersonalization();
  const msgs={beginner:'Start with Piece Dojo!',some:'Try Play vs Bot!',experienced:'Tackle the Puzzle Trainer!'};
  say('Welcome '+ST.user.name+'! '+msgs[ob_level]); showToast('Welcome, '+ST.user.name+'! 🎉');
}

function updateHomePersonalization() {
  const el=document.getElementById('hero-name'); if(el)el.textContent=ST.user.name||'friend';
  const lv=document.getElementById('h-level'); if(lv)lv.textContent={beginner:'Beginner',some:'Explorer',experienced:'Improver','':'—'}[ST.user.level]||'—';
  const msgs={beginner:"Hi <strong>"+ST.user.name+"</strong>! Start with <strong>Piece Dojo</strong> to learn how every piece moves! 🐴",some:"Welcome <strong>"+ST.user.name+"</strong>! Try <strong>Play vs Bot</strong> to test your skills! 🤖",experienced:"Ready to level up, <strong>"+ST.user.name+"</strong>? Tackle the <strong>Puzzle Trainer</strong>! 🎯","":" Hi! I'm <strong>Kip</strong>! Pick any game to start learning chess! 🎉"};
  const kipEl=document.getElementById('home-kip-msg'); if(kipEl)kipEl.innerHTML=msgs[ST.user.level]||msgs[''];
  updatePremiumUI();
}

function updatePremiumUI() {
  const banner=document.getElementById('premium-banner'); const navBtn=document.getElementById('nav-premium-btn');
  const l2=document.getElementById('step-l2'),l3=document.getElementById('step-l3');
  if(ST.premium){
    if(banner)banner.style.display='none'; if(navBtn)navBtn.style.display='none';
    if(l2){l2.classList.remove('path-locked');l2.onclick=()=>{tabTo('s-curriculum','tab-curr');buildCurriculum();};const t2=document.getElementById('step-l2-tag'),i2=document.getElementById('step-l2-icon');if(t2){t2.className='ps-tag ps-tag-free';t2.textContent='UNLOCKED';}if(i2){i2.innerHTML='▶';i2.style.color='var(--purple)';}}
    if(l3){l3.classList.remove('path-locked');l3.onclick=()=>{tabTo('s-curriculum','tab-curr');buildCurriculum();};const t3=document.getElementById('step-l3-tag'),i3=document.getElementById('step-l3-icon');if(t3){t3.className='ps-tag ps-tag-free';t3.textContent='UNLOCKED';}if(i3){i3.innerHTML='▶';i3.style.color='var(--purple)';}}
    document.querySelectorAll('.module-card').forEach(card=>{ const att=card.getAttribute('onclick'); if(att&&att.includes('requirePremium')){ const m=att.match(/'([^']+)'/); if(m)card.onclick=()=>goScreen(m[1]); } });
    document.querySelectorAll('.section-badge').forEach(badge=>{ if(badge.textContent.includes('PREMIUM'))badge.style.display='none'; });
  } else {
    if(banner)banner.style.display=''; if(navBtn)navBtn.style.display='';
    if(l2){l2.classList.add('path-locked');l2.onclick=()=>requirePremium('s-curriculum');const t2=document.getElementById('step-l2-tag'),i2=document.getElementById('step-l2-icon');if(t2){t2.className='ps-tag ps-tag-pro';t2.textContent='👑 PRO';}if(i2){i2.innerHTML='🔒';i2.style.color='#ddd';}}
    if(l3){l3.classList.add('path-locked');l3.onclick=()=>requirePremium('s-curriculum');const t3=document.getElementById('step-l3-tag'),i3=document.getElementById('step-l3-icon');if(t3){t3.className='ps-tag ps-tag-pro';t3.textContent='👑 PRO';}if(i3){i3.innerHTML='🔒';i3.style.color='#ddd';}}
    document.querySelectorAll('.section-badge').forEach(badge=>{ if(badge.textContent.includes('PREMIUM'))badge.style.display=''; });
  }
}

// ── PREMIUM ──
let _pendingScreen=null;
function requirePremium(screenId) { if(ST.premium){goScreen(screenId);return;} showPremiumGate(screenId); }
function showPremiumGate(screenId) { _pendingScreen=screenId||null; document.getElementById('premium-gate').classList.add('show'); document.getElementById('pg-code-msg').textContent=''; document.getElementById('pg-code-input').value=''; }
function closePremiumGate() { document.getElementById('premium-gate').classList.remove('show'); _pendingScreen=null; }
function redeemCode() {
  const code=document.getElementById('pg-code-input').value.trim().toUpperCase(); const msg=document.getElementById('pg-code-msg');
  if(!code){msg.style.color='#dc2626';msg.textContent='Enter a code first!';return;}
  if(VALID_CODES.includes(code)){ST.premium=true;save();msg.style.color='#16a34a';msg.textContent='✅ Premium unlocked!';confetti(80);sWin();setTimeout(()=>{closePremiumGate();updatePremiumUI();if(_pendingScreen)goScreen(_pendingScreen);},1200);}
  else{msg.style.color='#dc2626';msg.textContent='❌ Invalid code. Check your email.';sBad();}
}

// ── NAVIGATION ──
const SCREEN_TAB={
  's-home':'tab-home','s-dojo':'tab-home','s-bot':'tab-bot','s-puzzle':'tab-puzzle',
  's-curriculum':'tab-curr','s-progress':'tab-prog',
  's-threat':'tab-home','s-capture':'tab-home','s-defend':'tab-home','s-blunder':'tab-home',
  's-patterns':'tab-home','s-combo':'tab-home','s-endcoach':'tab-home','s-opening':'tab-home',
  's-eval':'tab-home','s-pawn':'tab-home','s-defend-check':'tab-home','s-ladder-method':'tab-home','s-fork-train':'tab-home',
};

function goScreen(id) {
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const el=document.getElementById(id); if(el)el.classList.add('active'); window.scrollTo(0,0);
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('on'));
  const targetTab=SCREEN_TAB[id]; if(targetTab){const t=document.getElementById(targetTab);if(t)t.classList.add('on');}
  if(id==='s-puzzle')initPuzzle(); if(id==='s-threat')initThreat(); if(id==='s-dojo')initDojo();
  if(id==='s-capture')initCapture(); if(id==='s-defend')initDefend(); if(id==='s-curriculum')buildCurriculum();
  if(id==='s-progress')renderProgress(); if(id==='s-blunder')initBlunder(); if(id==='s-patterns')initPatterns();
  if(id==='s-combo')initCombo(); if(id==='s-endcoach')initEndCoach(); if(id==='s-opening')initOpening();
  if(id==='s-eval')initEval(); if(id==='s-pawn')initPawn(); if(id==='s-defend-check')initDefendCheck();
  if(id==='s-ladder-method')initLadder(); if(id==='s-fork-train')initForkTrain();
  if(id==='s-home')updateHomePersonalization();
}

function gs(id) { goScreen(id); }
function tabTo(screenId,tabId) { goScreen(screenId); document.querySelectorAll('.tab').forEach(t=>t.classList.remove('on')); const t=document.getElementById(tabId); if(t)t.classList.add('on'); }

// ── GLOBAL WINDOW EXPORTS ──
window.ob_next=ob_next; window.ob_setAge=ob_setAge; window.ob_setLevel=ob_setLevel; window.ob_finish=ob_finish;
window.goScreen=goScreen; window.gs=gs; window.tabTo=tabTo;
window.requirePremium=requirePremium; window.showPremiumGate=showPremiumGate; window.closePremiumGate=closePremiumGate; window.redeemCode=redeemCode;
window.buildCurriculum=buildCurriculum; window.renderProgress=renderProgress; window.initPuzzle=initPuzzle;
window.selectDojoPiece=selectDojoPiece; window.handleCapClick=handleCapClick; window.resetProgress=resetProgress;
window.nextPuzzle=nextPuzzle; window.showPuzzleHint=showPuzzleHint;
window.nextThreat=nextThreat; window.showThreatHint=showThreatHint;
window.newDojoChallenge=newDojoChallenge; window.nextCapture=nextCapture;
window.startDefend=startDefend; window.showDefendHint=showDefendHint; window.resetDefend=resetDefend;
window.blunderAnswer=blunderAnswer; window.nextBlunder=nextBlunder; window.blunderHint=blunderHint;
window.nextPatternChallenge=nextPatternChallenge; window.closePat=closePat;
window.nextCombo=nextCombo; window.comboHint=comboHint;
window.startEndgame=startEndgame; window.endgameNext=endgameNext; window.endgameHint=endgameHint; window.resetEndgame=resetEndgame;
window.nextOpening=nextOpening; window.evalAnswer=evalAnswer; window.nextEval=nextEval; window.evalHint=evalHint;
window.nextPawn=nextPawn; window.pawnHint=pawnHint;
window.dkSetSkill=dkSetSkill; window.dkNext=dkNext; window.dkHint=dkHint;
window.ldSetMode=ldSetMode; window.ldNext=ldNext; window.ldHint=ldHint; window.ldReset=ldReset;
window.ftSetSkill=ftSetSkill; window.ftNext=ftNext; window.ftHint=ftHint;
window.setDiff=setDiff; window.startBotGame=startBotGame; window.showBotHint=showBotHint; window.resetBotGame=resetBotGame;
window.closeResult=(again)=>{ document.getElementById('rover').classList.remove('show'); import('./utils.js').then(u=>{if(again&&u.resultNext)u.resultNext();else goScreen('s-home');}); };

// ── BOOT ──
(async()=>{
  await preloadData();
  load();
  if(!ST.onboarded){
    document.getElementById('onboarding').style.display='flex';
  } else {
    document.getElementById('onboarding').style.display='none';
    updateHomePersonalization();
    setTimeout(()=>say('Welcome back '+(ST.user.name||'friend')+'! Ready to play chess?'),500);
  }
})();
