'use strict';
import { ST,sOk,sBad,confetti } from '../utils.js';
import { drawBoard } from '../board.js';

const CURR_DATA=[
  {id:'l1',label:'L1',title:'Beginner',subtitle:'Foundations · 20 Sessions',color:'lc1',goal:'Learn the pieces, rules, and play your first game!',sessions:[
    {num:1,title:'The Chessboard',topics:'64 squares, files, ranks',concept:{emoji:'♟',title:'Meet the Board!',explain:'64 squares — 32 light, 32 dark! Columns=FILES (a-h), Rows=RANKS (1-8). Every square has a unique name like "e4"!',fen:'8/8/8/8/8/8/8/8 w - - 0 1',hl:{yellow:['e4','d5','a1','h8']},quiz:{q:'How many squares?',opts:['32','64','48','16'],ans:'64',right:'Yes! 64!',wrong:'8×8=64!'},puzzle:{instr:'Tap E4!',fen:'8/8/8/8/8/8/8/8 w - - 0 1',ans:['e4'],hl:{yellow:['e4']}}}},
    {num:2,title:'The King',topics:'Most important piece',concept:{emoji:'♔',title:'The King!',explain:'The King ♔ is the MOST IMPORTANT piece! If your King is caught (checkmate) you lose. Moves ONE square in ANY direction.',fen:'8/8/8/8/4K3/8/8/8 w - - 0 1',hl:{green:['d3','e3','f3','d4','f4','d5','e5','f5']},quiz:{q:'What happens if your King is checkmated?',opts:['Lose a turn','Lose the game!','New King','Nothing'],ans:'Lose the game!',right:'Protect your King!',wrong:'Checkmate = lose!'},puzzle:{instr:'King on E4. Tap where it can move!',fen:'8/8/8/8/4K3/8/8/8 w - - 0 1',ans:['d3','e3','f3','d4','f4','d5','e5','f5'],hl:{yellow:['e4']}}}},
    {num:3,title:'The Queen',topics:'Most powerful piece',concept:{emoji:'♕',title:'The Queen!',explain:'The Queen ♕ is the MOST POWERFUL! Moves ANY direction, as many squares. Worth 9 points!',fen:'8/8/8/8/3Q4/8/8/8 w - - 0 1',hl:{green:['d1','d2','d3','d5','d6','d7','d8','a4','b4','c4','e4','f4','g4','h4']},quiz:{q:'How does the Queen move?',opts:['Only forward','Only diagonally','Any direction!','Only sideways'],ans:'Any direction!',right:'SUPER powerful!',wrong:'Queen goes everywhere!'},puzzle:{instr:'Queen on D4. Tap any reachable square!',fen:'8/8/8/8/3Q4/8/8/8 w - - 0 1',ans:['d1','d2','d3','d5','d6','d7','d8','a4','b4','c4','e4','f4','g4','h4'],hl:{yellow:['d4']}}}},
    {num:4,title:'The Rook',topics:'Straight lines, worth 5',concept:{emoji:'♖',title:'The Rook!',explain:'The Rook ♖ moves in STRAIGHT LINES — forward, backward, sideways. Worth 5 points!',fen:'8/8/8/8/3R4/8/8/8 w - - 0 1',hl:{green:['d1','d2','d3','d5','d6','d7','d8','a4','b4','c4','e4','f4','g4','h4']},quiz:{q:'How does the Rook move?',opts:['Diagonally','Straight lines!','L-shape','One square only'],ans:'Straight lines!',right:'Straight-line sliders!',wrong:'Rooks go straight!'},puzzle:{instr:'Rook on D4. Tap any straight-line square!',fen:'8/8/8/8/3R4/8/8/8 w - - 0 1',ans:['d1','d2','d3','d5','d6','d7','d8','a4','b4','c4','e4','f4','g4','h4'],hl:{yellow:['d4']}}}},
    {num:5,title:'The Knight',topics:'L-shape jump, jumps over pieces',concept:{emoji:'♘',title:'The Knight!',explain:'The Knight ♘ jumps in an L-shape: 2 squares + 1 sideways. The ONLY piece that jumps over others! Worth 3 points.',fen:'8/8/8/8/3N4/8/8/8 w - - 0 1',hl:{green:['b3','b5','c2','c6','e2','e6','f3','f5']},quiz:{q:'What is special about the Knight?',opts:['Moves diagonally','Jumps over pieces!','Goes sideways only','Never moves'],ans:'Jumps over pieces!',right:'The only jumper!',wrong:'Knights JUMP in an L!'},puzzle:{instr:'Knight on D4. Tap an L-shape square!',fen:'8/8/8/8/3N4/8/8/8 w - - 0 1',ans:['b3','b5','c2','c6','e2','e6','f3','f5'],hl:{yellow:['d4']}}}}
  ]},
  {id:'l2',label:'L2',title:'Advanced Beginner',subtitle:'Tactics · 20 Sessions',color:'lc2',goal:'Spot simple tactics and avoid blunders!',sessions:[{num:1,title:'The Fork',topics:'Attack two pieces at once',concept:{emoji:'🍴',title:'The Fork!',explain:'A FORK attacks TWO enemy pieces at once! The opponent can only save ONE — you get the other for free!',fen:'8/8/8/3N4/8/2k5/8/4K3 w - - 0 1',hl:{green:['c3','e3'],yellow:['d5']},quiz:{q:'In a fork, how many pieces are attacked?',opts:['One','Two!','Three','All'],ans:'Two!',right:'Fork = TWO at once!',wrong:'Fork attacks TWO!'},puzzle:{instr:'Tap the forking Knight!',fen:'8/8/8/3N4/8/2k5/8/4K3 w - - 0 1',ans:['d5'],hl:{yellow:['d5']}}}}]},
  {id:'l3',label:'L3',title:'Intermediate',subtitle:'Strategy · 20 Sessions',color:'lc3',goal:'Think 3-4 moves ahead!',sessions:[{num:1,title:'Open Files',topics:'Rooks love open files',concept:{emoji:'🚀',title:'Open Files!',explain:'An OPEN FILE has no pawns on it. Rooks are MOST powerful on open files!',fen:'8/8/8/8/8/8/PPP1PPPP/R7 w - - 0 1',hl:{green:['d1','d2','d3','d4','d5','d6','d7','d8']},quiz:{q:'What is an open file?',opts:['Full of pawns','No pawns!','For Kings','Right side'],ans:'No pawns!',right:'Open files = Rook highways!',wrong:'No pawns = open file!'},puzzle:{instr:'D-file is open! Tap the Rook!',fen:'8/8/8/8/8/8/PPP1PPPP/R7 w - - 0 1',ans:['a1'],hl:{green:['d1','d2','d3','d4','d5','d6','d7','d8']}}}}]},
  {id:'l4',label:'L4',title:'Advanced',subtitle:'Tournament Thinking',color:'lc4',goal:'Learn opening systems!',sessions:[{num:1,title:'Italian Game',topics:'1.e4 e5 2.Nf3 Nc6 3.Bc4',concept:{emoji:'🇮🇹',title:'Italian Game!',explain:'1.e4 e5 2.Nf3 Nc6 3.Bc4 — Bishop to C4, aiming at the weak F7 square!',fen:'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',hl:{yellow:['c4'],green:['f7']},quiz:{q:'Where does the Italian Bishop go?',opts:['B5','C4!','D3','E2'],ans:'C4!',right:'Bc4 eyes F7!',wrong:'Italian = Bc4!'},puzzle:{instr:'Tap the Italian Bishop!',fen:'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',ans:['c4'],hl:{yellow:['c4']}}}}]},
  {id:'l5',label:'L5',title:'Advanced Part 2',subtitle:'Competitive',color:'lc5',goal:'Develop strong competitive skills!',sessions:[{num:1,title:'Deep Calculation',topics:'4-5 moves ahead',concept:{emoji:'🔭',title:'Calculate Deeper!',explain:'CALCULATION means seeing moves in your head! Order: Checks → Captures → Threats. Aim for 4-5 moves ahead!',fen:'r3k2r/ppp2ppp/2n1bn2/3qp3/3PP3/2PBBN2/PP3PPP/R2QK2R w KQkq - 0 10',hl:{},quiz:{q:'Calculate in what order?',opts:['Pawns first','Checks, captures, threats!','Pretty moves','Random'],ans:'Checks, captures, threats!',right:'Checks → Captures → Threats!',wrong:'Always: Checks first!'},puzzle:{instr:'Tap the Black Queen!',fen:'r3k2r/ppp2ppp/2n1bn2/3qp3/3PP3/2PBBN2/PP3PPP/R2QK2R w KQkq - 0 10',ans:['d5'],hl:{yellow:['d5']}}}}]},
  {id:'lm',label:'★',title:'Master Course',subtitle:'Performance Track',color:'lcm',goal:'Compete in rated tournaments!',sessions:[{num:1,title:'Opening Repertoire',topics:'15-20 moves deep',concept:{emoji:'🏆',title:'Build Your Repertoire!',explain:'At Master level you need your openings 15-20 moves deep and ALL the plans memorized!',fen:'r2qkb1r/ppp1pppp/2n2n2/3p1b2/2PP4/2N1PN2/PP3PPP/R1BQKB1R w KQkq - 0 7',hl:{},quiz:{q:'How deep should a Master know openings?',opts:['3 moves','5 moves','15-20 moves!','Just move 1'],ans:'15-20 moves!',right:'Masters know 15-20 moves deep!',wrong:'Masters go 15-20 moves!'},puzzle:{instr:'Tap the Black Queen!',fen:'r2qkb1r/ppp1pppp/2n2n2/3p1b2/2PP4/2N1PN2/PP3PPP/R1BQKB1R w KQkq - 0 7',ans:['d8'],hl:{yellow:['d8']}}}}]}
];

let currBuilt=false; let lastPremiumState=null;

export function buildCurriculum() {
  if(currBuilt&&lastPremiumState===ST.premium)return;
  currBuilt=true; lastPremiumState=ST.premium;
  const cont=document.getElementById('curr-levels'); if(!cont)return; cont.innerHTML='';
  CURR_DATA.forEach(level=>{
    const card=document.createElement('div'); card.className='level-card';
    card.innerHTML=`<div class="level-head ${level.color}"><div class="level-badge">${level.label}</div><div class="level-info"><h3>${level.title}</h3><p>${level.subtitle}</p></div><div class="level-arrow">▶</div></div><div class="level-body"><p style="font-size:.8rem;font-weight:700;color:#666;margin-bottom:10px">🎯 ${level.goal}</p><div id="sl-${level.id}"></div></div>`;
    card.querySelector('.level-head').onclick=()=>{ card.classList.toggle('open'); if(card.classList.contains('open'))buildSessions(level); };
    cont.appendChild(card);
  });
}

export function buildSessions(level) {
  const cont=document.getElementById('sl-'+level.id); if(!cont||cont.children.length>0)return;
  level.sessions.forEach(s=>{
    const item=document.createElement('div'); item.className='session-card'; item.innerHTML=`<div class="session-title">Session ${s.num}: ${s.title}</div><div class="session-topics">${s.topics}</div>`;
    const body=document.createElement('div'); body.style.display='none';
    item.onclick=()=>{ body.style.display=body.style.display==='none'?'block':'none'; if(body.style.display==='block'&&!body.children.length)buildConceptCard(s.concept,body); };
    cont.appendChild(item); cont.appendChild(body);
  });
}

export function buildConceptCard(c,container) {
  container.innerHTML=''; const card=document.createElement('div'); card.className='concept-card'; card.innerHTML=`<div style="font-size:2rem;margin-bottom:4px">${c.emoji}</div><div class="cc-title">${c.title}</div><div class="cc-explain">${c.explain}</div>`;
  const bw=document.createElement('div'); bw.className='cc-board-wrap'; const bd=document.createElement('div'); bd.className='cc-board board'; bd.id='ccb-'+Math.random().toString(36).slice(2); bw.appendChild(bd); card.appendChild(bw); container.appendChild(card);
  setTimeout(()=>drawBoard(bd.id,c.fen,{g:c.hl.green||[],y:c.hl.yellow||[]}),30);
  const qDiv=document.createElement('div'); qDiv.style.marginTop='8px'; qDiv.innerHTML=`<div style="font-weight:800;font-size:.85rem;color:#666;margin-bottom:6px">✅ Quiz: ${c.quiz.q}</div>`;
  const opts=document.createElement('div'); opts.className='quiz-opts'; let done=false;
  c.quiz.opts.forEach(opt=>{ const b=document.createElement('button'); b.className='quiz-opt'; b.textContent=opt; b.onclick=()=>{ if(done)return; done=true; const ok=opt===c.quiz.ans; b.classList.add(ok?'ok':'no'); opts.querySelectorAll('.quiz-opt').forEach(x=>{if(x.textContent===c.quiz.ans)x.classList.add('ok');}); const fb=document.createElement('div'); fb.className='quiz-feedback show '+(ok?'ok':'no'); fb.textContent=ok?c.quiz.right:c.quiz.wrong; qDiv.appendChild(fb); if(ok){sOk();confetti(20);}else sBad(); }; opts.appendChild(b); });
  qDiv.appendChild(opts); container.appendChild(qDiv);
  const pDiv=document.createElement('div'); pDiv.style.marginTop='8px'; pDiv.innerHTML=`<div class="puzzle-instr">${c.puzzle.instr}</div>`;
  const pbw=document.createElement('div'); pbw.className='cc-board-wrap'; const pbd=document.createElement('div'); pbd.className='cc-board board'; const pbId='pzb-'+Math.random().toString(36).slice(2,8); pbd.id=pbId; pbw.appendChild(pbd); pDiv.appendChild(pbw);
  const pr=document.createElement('div'); pr.className='puzzle-result'; pDiv.appendChild(pr); let pandswered=false;
  setTimeout(()=>{ drawBoard(pbId,c.puzzle.fen,{y:c.puzzle.hl.yellow||[],g:c.puzzle.hl.green||[],click:(sn)=>{ if(pandswered)return; if(c.puzzle.ans.includes(sn)){pandswered=true;pr.textContent='🎉 Correct!';pr.className='puzzle-result show ok';sOk();confetti(20);drawBoard(pbId,c.puzzle.fen,{g:[sn]});}else{pr.textContent='❌ Try again!';pr.className='puzzle-result show no';sBad();setTimeout(()=>{pr.className='puzzle-result';},1000);} }}); },30);
  container.appendChild(pDiv);
}
