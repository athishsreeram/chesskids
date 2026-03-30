'use strict';
import { ST } from '../utils.js';

export function renderProgress() {
  document.getElementById('prog-stars').textContent=ST.stars;
  document.getElementById('prog-streak').textContent=(ST.streak||0)+'🔥';
  const cont=document.getElementById('prog-modules'); if(!cont)return; cont.innerHTML='';
  [
    ['dojo','🐴 Piece Dojo'],['bot','🤖 Play vs Bot'],['puzzle','🎯 Puzzle Trainer'],
    ['threat','👁 Threat Spotter'],['capture','💥 Capture Challenge'],['defend','🛡️ Build & Defend'],
    ['blunder','🔍 Blunder Check'],['patterns','🏆 Checkmate Patterns'],['combo','🔗 Combo Builder'],
    ['endcoach','👑 Endgame Coach'],['opening','🌅 Opening Lab'],['eval',"⚖️ Who's Winning"],
    ['pawn','📐 Pawn School'],['ladder','🪜 Double Ladder'],['fork','🍴 Fork & Attack']
  ].forEach(([id,lbl])=>{
    const row=document.createElement('div'); row.className='card-sm'; row.style.cssText='margin-bottom:6px;display:flex;align-items:center;gap:10px';
    const stars=ST.mods[id]||0; row.innerHTML=`<span style="flex:1;font-weight:700;font-size:.82rem">${lbl}</span><span style="font-weight:900;color:${stars>0?'#F5A623':'#ccc'}">⭐ ${stars}</span>`;
    cont.appendChild(row);
  });
}
