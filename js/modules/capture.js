'use strict';
import { sTick,sOk,sWin,earn,showFeedback,hideFeedback,say,PN,sqRF } from '../utils.js';
import { parseFEN,drawBoard,applyMove,getLegalMovesFiltered } from '../board.js';
import { getCapPositions } from '../data_loader.js';

export let capState={ pos:null,board:null,sel:null,movesLeft:3,captured:0,lost:0,done:false };
let CAP_POSITIONS=[];

export async function initCapture() { CAP_POSITIONS=await getCapPositions(); nextCapture(); }

export function nextCapture() {
  capState.pos=CAP_POSITIONS[Math.random()*CAP_POSITIONS.length|0]; capState.board=parseFEN(capState.pos.fen);
  capState.sel=null; capState.movesLeft=capState.pos.moves; capState.captured=0; capState.lost=0; capState.done=false;
  document.getElementById('cap-task').textContent=capState.pos.task; document.getElementById('cap-moves').textContent=capState.pos.moves;
  hideFeedback('cap-feedback'); document.getElementById('cap-next').style.display='none'; updateCapScores(); say(capState.pos.task); renderCapBoard();
}

export function renderCapBoard() { drawBoard('cap-board',capState.board,{sel:capState.sel,dot:capState.sel?getLegalMovesFiltered(capState.board,...Object.values(sqRF(capState.sel))):[],click:(sn,r,f)=>handleCapClick(sn,r,f)}); }

export function handleCapClick(sn,r,f) {
  if(capState.done) return; sTick(); const p=capState.board[r][f];
  if(!capState.sel){if(p&&p[0]==='w'){capState.sel=sn;renderCapBoard();}return;}
  if(sn===capState.sel){capState.sel=null;renderCapBoard();return;}
  const{r:fr,f:ff}=sqRF(capState.sel); const legal=getLegalMovesFiltered(capState.board,fr,ff);
  if(!legal.includes(sn)){if(p&&p[0]==='w'){capState.sel=sn;renderCapBoard();return;}showFeedback('cap-feedback',"Can't move there!",'no');capState.sel=null;renderCapBoard();return;}
  const target=capState.board[r][f]; const nb=applyMove(capState.board,fr,ff,r,f);
  if(target&&target[0]==='b'){capState.captured++;sOk();showFeedback('cap-feedback','✅ Captured '+PN[target[1]]+'!','ok');earn(1,'capture');}
  else showFeedback('cap-feedback','Moved!','info');
  capState.board=nb; capState.sel=null; capState.movesLeft--; updateCapScores();
  if(capState.movesLeft<=0){capState.done=true;const t=capState.captured;showFeedback('cap-feedback','Done! Captured '+t+'! 💰','ok');sWin();earn(t,'capture');document.getElementById('cap-next').style.display='';}
  renderCapBoard();
}

export function updateCapScores() { document.getElementById('cap-captured').textContent=capState.captured; document.getElementById('cap-lost').textContent=capState.lost; document.getElementById('cap-moves').textContent=capState.movesLeft; }
