/* ════════════════════════════════════════
   ChessPlayground – All 10 Mini-Games
   ════════════════════════════════════════ */

'use strict';

// ══════════════════════════════════════
// 1. MEMORY GAME
// ══════════════════════════════════════
let memoryState = {};
function initMemoryGame() {
  APP.currentLevel = 1;
  memoryState = { phase:'show', score:0, round:0, maxRounds:5, selected:new Set(), correct:new Set() };
  document.querySelectorAll('#memory-screen .level-btn').forEach(b=>{
    b.classList.toggle('active', parseInt(b.dataset.level)===1);
    b.onclick = ()=>{ APP.currentLevel=parseInt(b.dataset.level); document.querySelectorAll('#memory-screen .level-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); startMemoryRound(); soundClick(); };
  });
  startMemoryRound();
}
function getMemoryPuzzles() {
  return (APP.puzzleData?.memory||[]).filter(p=>p.level===APP.currentLevel);
}
function startMemoryRound() {
  const puzzles = getMemoryPuzzles();
  if (!puzzles.length) return;
  const puzzle = puzzles[memoryState.round % puzzles.length];
  memoryState.currentFEN = puzzle.fen;
  memoryState.phase = 'show';
  memoryState.selected = new Set();

  const viewSecs = APP.currentLevel===1 ? 6 : APP.currentLevel===2 ? 4 : 3;

  document.getElementById('memory-instruction').innerHTML = `<span class="inst-emoji">👀</span><div class="inst-text">Look at the board! Remember where the pieces are!</div>`;
  document.getElementById('memory-timer-pill').textContent = '⏱ ' + viewSecs + 's';
  document.getElementById('memory-check-btn').classList.add('hidden');
  document.getElementById('memory-hint').textContent='';

  buildBoard('memory-board', puzzle.fen, { showCoords:true });

  let t = viewSecs;
  const pill = document.getElementById('memory-timer-pill');
  speak(`Look carefully! You have ${viewSecs} seconds!`);
  const tick = setInterval(()=>{
    t--;
    pill.textContent = '⏱ ' + t + 's';
    if (t<=0) {
      clearInterval(tick);
      startMemoryRecall(puzzle);
    }
  }, 1000);
}
function startMemoryRecall(puzzle) {
  memoryState.phase = 'recall';
  document.getElementById('memory-instruction').innerHTML = `<span class="inst-emoji">🤔</span><div class="inst-text">Where were the pieces? Tap the squares!</div>`;
  document.getElementById('memory-timer-pill').textContent = '';
  document.getElementById('memory-check-btn').classList.remove('hidden');
  speak('Now tap where the pieces were!');

  // Build blank board, track clicks
  buildBoard('memory-board', '8/8/8/8/8/8/8/8 w - - 0 1', {
    showCoords:true,
    onSquareClick: (sq, el) => {
      soundClick();
      if (memoryState.selected.has(sq)) {
        memoryState.selected.delete(sq);
        el.style.background = '';
        el.classList.remove('highlight-target');
      } else {
        memoryState.selected.add(sq);
        el.classList.add('highlight-target');
      }
    }
  });

  document.getElementById('memory-check-btn').onclick = () => {
    checkMemoryAnswer(puzzle);
  };
}
function checkMemoryAnswer(puzzle) {
  const board = parseFEN(puzzle.fen);
  const correctSquares = new Set();
  board.forEach((row,r)=>row.forEach((piece,f)=>{ if(piece) correctSquares.add(String.fromCharCode(97+f)+(8-r)); }));

  let hits=0, total=correctSquares.size;
  correctSquares.forEach(sq=>{ if(memoryState.selected.has(sq)) hits++; });

  // Show correct squares
  document.querySelectorAll('#memory-board .chess-square').forEach(sq=>{
    const s = sq.dataset.square;
    sq.classList.remove('highlight-target','highlight-correct','highlight-wrong');
    if (correctSquares.has(s)) sq.classList.add('highlight-correct');
    else if (memoryState.selected.has(s)) sq.classList.add('highlight-wrong');
  });

  const pct = total>0 ? hits/total : 0;
  const stars = pct>=0.9?3:pct>=0.6?2:pct>=0.3?1:0;
  recordGameStat('memory', stars);
  memoryState.round++;

  setTimeout(()=>{
    showResult({
      emoji: stars===3?'🏆':stars>=1?'⭐':'💪',
      title: stars===3?'Perfect!':stars>=1?'Good Job!':'Keep Trying!',
      starsEarned: stars,
      scoreText: `You found ${hits} of ${total} squares!`,
      onNext: () => startMemoryRound(),
    });
  }, 1200);
}

// ══════════════════════════════════════
// 2. BLINDFOLD GAME
// ══════════════════════════════════════
let blindState = {};
function initBlindFold() {
  APP.currentLevel=1;
  document.querySelectorAll('#blindfold-screen .level-btn').forEach(b=>{
    b.classList.toggle('active', parseInt(b.dataset.level)===1);
    b.onclick=()=>{ APP.currentLevel=parseInt(b.dataset.level); document.querySelectorAll('#blindfold-screen .level-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); startBlindRound(); soundClick(); };
  });
  startBlindRound();
}
function startBlindRound() {
  const positions = (APP.puzzleData?.focus||[]).filter(p=>p.level===APP.currentLevel);
  const p = positions[Math.floor(Math.random()*positions.length)];
  if (!p) return;
  blindState = { fen:p.fen, question:p.question, answer:p.answer, showingBoard:true };

  const showSecs = APP.currentLevel===1?5:APP.currentLevel===2?3:2;
  document.getElementById('blindfold-instruction').innerHTML = `<span class="inst-emoji">👀</span><div class="inst-text">Study the board — it will disappear!</div>`;
  document.getElementById('blindfold-answer-area').classList.add('hidden');

  buildBoard('blindfold-board','8/8/8/8/8/8/8/8 w - - 0 1',{showCoords:true});

  // Show pieces briefly
  const wrap = document.getElementById('blindfold-board-wrap');
  let flash = document.createElement('div'); flash.className='board-flash'; flash.textContent='👀';
  wrap.appendChild(flash);
  setTimeout(()=>{
    buildBoard('blindfold-board', p.fen, {showCoords:true});
    flash.style.opacity='0';
    setTimeout(()=>flash.remove(),300);
    speak('Look carefully!');
    let t=showSecs;
    const ti=setInterval(()=>{
      t--;
      if(t<=0){
        clearInterval(ti);
        revealBlindQuestion(p);
      }
    },1000);
  },400);
}
function revealBlindQuestion(p) {
  // Hide pieces
  document.querySelectorAll('#blindfold-board .piece').forEach(el=>el.style.opacity='0');
  document.getElementById('blindfold-instruction').innerHTML=`<span class="inst-emoji">🤔</span><div class="inst-text">${p.question}</div>`;
  document.getElementById('blindfold-answer-area').classList.remove('hidden');
  speak(p.question);

  // Build square tap answer
  buildBoard('blindfold-board','8/8/8/8/8/8/8/8 w - - 0 1',{
    showCoords:true,
    onSquareClick:(sq,el)=>{
      soundClick();
      const correct = sq===p.answer;
      document.querySelectorAll('#blindfold-board .chess-square').forEach(s=>{
        if(s.dataset.square===p.answer) s.classList.add('highlight-correct');
      });
      el.classList.add(correct?'highlight-correct':'highlight-wrong');
      const stars = correct?3:0;
      recordGameStat('blindfold',stars);
      speak(correct?'Amazing! Correct!':'Not quite! Look where it was!');
      setTimeout(()=>{
        showResult({
          emoji:correct?'🎉':'💪',
          title:correct?'You remembered!':'Almost!',
          starsEarned:stars,
          scoreText:correct?'Perfect memory!':'The answer was '+p.answer,
          onNext:()=>startBlindRound(),
        });
      },1000);
    }
  });
}

// ══════════════════════════════════════
// 3. PIECE FINDER GAME
// ══════════════════════════════════════
let pfState = {};
function initPieceFinder() {
  APP.currentLevel=1;
  document.querySelectorAll('#piecefinder-screen .level-btn').forEach(b=>{
    b.classList.toggle('active', parseInt(b.dataset.level)===1);
    b.onclick=()=>{ APP.currentLevel=parseInt(b.dataset.level); document.querySelectorAll('#piecefinder-screen .level-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); startPFRound(); soundClick(); };
  });
  startPFRound();
}
function startPFRound() {
  const puzzles=(APP.puzzleData?.pieceFinder||[]).filter(p=>p.level===APP.currentLevel);
  const p=puzzles[Math.floor(Math.random()*puzzles.length)];
  if(!p) return;
  pfState={puzzle:p, found:new Set(), total:p.moves.length};

  const pieceName=PIECE_NAMES[p.piece]||p.piece;
  document.getElementById('pf-instruction').innerHTML=`<span class="inst-emoji">🐴</span><div class="inst-text">The <b>${pieceName}</b> is on <b>${p.square}</b>. Tap all the squares it can move to!</div>`;
  document.getElementById('pf-progress').textContent=`0 / ${p.moves.length}`;
  speak(`Find all the squares the ${pieceName} can move to!`);

  // FEN with just this piece on that square
  const simpleFEN = buildSimpleFEN(p.piece, p.square);
  buildBoard('pf-board', simpleFEN, {
    showCoords:true,
    onSquareClick:(sq,el,piece)=>{
      if(sq===p.square) { speak('That is where the piece is!'); return; }
      const isCorrect=p.moves.includes(sq);
      soundClick();
      if(isCorrect && !pfState.found.has(sq)){
        pfState.found.add(sq);
        el.classList.add('highlight-correct');
        soundCorrect();
        document.getElementById('pf-progress').textContent=`${pfState.found.size} / ${p.moves.length}`;
        speak('Yes!');
        if(pfState.found.size===pfState.total) {
          recordGameStat('pieceFinder',3);
          setTimeout(()=>showResult({emoji:'🏆',title:'All Found!',starsEarned:3,scoreText:`You found all ${p.moves.length} squares!`,onNext:startPFRound}),600);
        }
      } else if(!isCorrect){
        el.classList.add('highlight-wrong');
        soundWrong();
        speak('Not quite!');
        setTimeout(()=>el.classList.remove('highlight-wrong'),600);
      }
    }
  });
  // Highlight the piece square
  document.querySelectorAll('#pf-board .chess-square').forEach(sq=>{
    if(sq.dataset.square===p.square) sq.classList.add('highlight-target');
  });
}
function buildSimpleFEN(piece, square) {
  const board=Array.from({length:8},()=>Array(8).fill('.'));
  const f=square.charCodeAt(0)-97, r=8-parseInt(square[1]);
  board[r][f]='w'+piece;
  return fenFromBoard(board);
}
function fenFromBoard(board) {
  return board.map(row=>{
    let s='',empty=0;
    for(const cell of row){ if(cell==='.'){empty++;}else{if(empty){s+=empty;empty=0;}s+=cell[1];} }
    if(empty) s+=empty;
    return s;
  }).join('/') + ' w - - 0 1';
}

// ══════════════════════════════════════
// 4. PATTERN MATCH GAME
// ══════════════════════════════════════
let patState={};
function initPatternMatch(){
  APP.currentLevel=1;
  document.querySelectorAll('#pattern-screen .level-btn').forEach(b=>{
    b.classList.toggle('active',parseInt(b.dataset.level)===1);
    b.onclick=()=>{ APP.currentLevel=parseInt(b.dataset.level); document.querySelectorAll('#pattern-screen .level-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); startPatternRound(); soundClick(); };
  });
  startPatternRound();
}
function startPatternRound(){
  const puzzles=(APP.puzzleData?.patterns||[]).filter(p=>p.level<=APP.currentLevel);
  if(!puzzles.length) return;
  const p=puzzles[Math.floor(Math.random()*puzzles.length)];
  patState={puzzle:p,answered:false};
  document.getElementById('pattern-instruction').innerHTML=`<span class="inst-emoji">${p.emoji}</span><div class="inst-text">${p.description} Which pattern is this?</div>`;
  buildBoard('pattern-board',p.fen,{showCoords:true});
  speak(p.description + '. Which pattern is this?');

  // Build choices
  const allPatterns=['Fork','Check','Pin','Back Rank','Skewer','Discovery'];
  const wrong=allPatterns.filter(n=>n.toLowerCase()!==p.name.toLowerCase()).sort(()=>Math.random()-0.5).slice(0,APP.currentLevel===1?1:APP.currentLevel===2?2:3);
  const choices=[p.name,...wrong].sort(()=>Math.random()-0.5);
  const grid=document.getElementById('pattern-choices');
  grid.innerHTML='';
  choices.forEach(ch=>{
    const btn=document.createElement('button');
    btn.className='choice-btn';
    btn.textContent=ch;
    btn.onclick=()=>{
      if(patState.answered) return;
      patState.answered=true;
      soundClick();
      const correct=ch.toLowerCase()===p.name.toLowerCase();
      btn.classList.add(correct?'correct':'wrong');
      grid.querySelectorAll('.choice-btn').forEach(b=>{ if(b.textContent.toLowerCase()===p.name.toLowerCase()) b.classList.add('correct'); });
      const stars=correct?3:1;
      recordGameStat('patternMatch',stars);
      speak(correct?'Correct! Great pattern recognition!':'The answer is '+p.name);
      setTimeout(()=>showResult({emoji:correct?'🧩':'💪',title:correct?'Pattern Found!':'Keep Practicing!',starsEarned:stars,scoreText:'Pattern: '+p.name,onNext:startPatternRound}),800);
    };
    grid.appendChild(btn);
  });
}

// ══════════════════════════════════════
// 5. OPENING TREE EXPLORER
// ══════════════════════════════════════
function initOpeningTree(){
  const container=document.getElementById('opening-tree');
  container.innerHTML='';
  const data=APP.puzzleData?.openings||[];
  data.forEach(opening=>{
    const node=createTreeNode(opening.name, opening.moves[0]);
    container.appendChild(node);
  });
  speak('Tap a move to explore chess openings!');
  document.getElementById('opening-board-wrap').classList.add('hidden');
}
function createTreeNode(name, moveData){
  const wrapper=document.createElement('div');
  wrapper.className='tree-node';
  const header=document.createElement('div');
  header.className='tree-node-header';
  header.innerHTML=`<span>${name}</span><span class="move-badge">${moveData.notation}</span>`;
  wrapper.appendChild(header);
  const children=document.createElement('div');
  children.className='tree-children';
  if(moveData.children){
    moveData.children.forEach(child=>{
      const ch=document.createElement('div');
      ch.className='tree-child';
      ch.innerHTML=`<span>${child.name||child.notation}</span><span class="move-badge">${child.notation}</span>`;
      ch.onclick=()=>{
        soundClick();
        speak(child.name||child.notation);
        showOpeningBoard(child.fen);
      };
      children.appendChild(ch);
    });
  }
  wrapper.appendChild(children);
  header.onclick=()=>{
    soundClick();
    children.classList.toggle('open');
    showOpeningBoard(moveData.fen);
    speak(name);
  };
  return wrapper;
}
function showOpeningBoard(fen){
  document.getElementById('opening-board-wrap').classList.remove('hidden');
  buildBoard('opening-board',fen,{showCoords:true});
}

// ══════════════════════════════════════
// 6. ENDGAME TRAINER
// ══════════════════════════════════════
let egState={};
function initEndgame(){
  APP.currentLevel=1;
  document.querySelectorAll('#endgame-screen .level-btn').forEach(b=>{
    b.classList.toggle('active',parseInt(b.dataset.level)===1);
    b.onclick=()=>{ APP.currentLevel=parseInt(b.dataset.level); document.querySelectorAll('#endgame-screen .level-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); startEndgameRound(); soundClick(); };
  });
  startEndgameRound();
}
function startEndgameRound(){
  const puzzles=(APP.puzzleData?.endgame||[]).filter(p=>p.level===APP.currentLevel);
  const p=puzzles[Math.floor(Math.random()*puzzles.length)];
  if(!p) return;
  egState={puzzle:p,selected:null,solved:false};
  document.getElementById('eg-instruction').innerHTML=`<span class="inst-emoji">👑</span><div class="inst-text">${p.goal}</div>`;
  document.getElementById('eg-hint').textContent='💡 '+p.hint;
  speak(p.goal);
  buildBoard('eg-board',p.fen,{
    showCoords:true,
    onSquareClick:(sq,el,piece)=>{
      if(egState.solved) return;
      soundClick();
      if(!egState.selected){
        if(piece && piece[0]==='w'){
          egState.selected=sq;
          document.querySelectorAll('#eg-board .chess-square').forEach(s=>s.classList.remove('selected'));
          el.classList.add('selected');
          speak('Good! Now pick where to move!');
        }
      } else {
        const moveStr=egState.selected+sq;
        const correctMoves=p.moves||[];
        if(correctMoves.some(m=>m.replace(/\s/g,'')===moveStr||moveStr.startsWith(m.replace(/\s/g,'').slice(0,4)))){
          egState.solved=true;
          el.classList.add('highlight-correct');
          recordGameStat('endgame',3);
          soundWin();
          speak('Brilliant move! You did it!');
          setTimeout(()=>showResult({emoji:'👑',title:'Brilliant!',starsEarned:3,scoreText:'Perfect endgame technique!',onNext:startEndgameRound}),800);
        } else {
          el.classList.add('highlight-wrong');
          soundWrong();
          egState.selected=null;
          speak('Try again! Think carefully!');
          document.querySelectorAll('#eg-board .chess-square').forEach(s=>{ s.classList.remove('selected','highlight-wrong'); });
          setTimeout(()=>el.classList.remove('highlight-wrong'),600);
        }
      }
    }
  });
}

// ══════════════════════════════════════
// 7. BOARD VISION TRAINER
// ══════════════════════════════════════
let visState={};
function initVision(){
  APP.currentLevel=1;
  document.querySelectorAll('#vision-screen .level-btn').forEach(b=>{
    b.classList.toggle('active',parseInt(b.dataset.level)===1);
    b.onclick=()=>{ APP.currentLevel=parseInt(b.dataset.level); document.querySelectorAll('#vision-screen .level-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); startVisionRound(); soundClick(); };
  });
  startVisionRound();
}
function startVisionRound(){
  const puzzles=(APP.puzzleData?.vision||[]).filter(p=>p.level===APP.currentLevel);
  const p=puzzles[Math.floor(Math.random()*puzzles.length)];
  if(!p) return;
  visState={puzzle:p,found:new Set(),errors:0};
  const pieceName=PIECE_NAMES[p.piece]||p.piece;
  document.getElementById('vision-instruction').innerHTML=`<span class="inst-emoji">🔎</span><div class="inst-text">Tap all squares the <b>${pieceName}</b> on <b>${p.square}</b> can attack!</div>`;
  document.getElementById('vision-progress').textContent=`0 / ${p.attacked.length}`;
  speak(`Tap all squares the ${pieceName} attacks!`);
  const simpleFEN=buildSimpleFEN(p.piece,p.square);
  buildBoard('vision-board',simpleFEN,{
    showCoords:true,
    onSquareClick:(sq,el)=>{
      if(sq===p.square){ speak('That is where the piece is!'); return; }
      soundClick();
      const correct=p.attacked.includes(sq);
      if(correct && !visState.found.has(sq)){
        visState.found.add(sq);
        el.classList.add('highlight-correct');
        soundCorrect();
        document.getElementById('vision-progress').textContent=`${visState.found.size} / ${p.attacked.length}`;
        if(visState.found.size===p.attacked.length){
          const stars=visState.errors===0?3:visState.errors<=2?2:1;
          recordGameStat('vision',stars);
          setTimeout(()=>showResult({emoji:'🔎',title:'Perfect Vision!',starsEarned:stars,scoreText:`Found all ${p.attacked.length} attacked squares!`,onNext:startVisionRound}),600);
        }
      } else if(!correct){
        visState.errors++;
        el.classList.add('highlight-wrong');
        soundWrong();
        setTimeout(()=>el.classList.remove('highlight-wrong'),500);
      }
    }
  });
  document.querySelectorAll('#vision-board .chess-square').forEach(sq=>{
    if(sq.dataset.square===p.square) sq.classList.add('highlight-target');
  });
}

// ══════════════════════════════════════
// 8. CALCULATION TRAINER
// ══════════════════════════════════════
let calcState={};
function initCalculation(){
  APP.currentLevel=1;
  document.querySelectorAll('#calc-screen .level-btn').forEach(b=>{
    b.classList.toggle('active',parseInt(b.dataset.level)===1);
    b.onclick=()=>{ APP.currentLevel=parseInt(b.dataset.level); document.querySelectorAll('#calc-screen .level-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); startCalcRound(); soundClick(); };
  });
  startCalcRound();
}
function startCalcRound(){
  const puzzles=(APP.puzzleData?.calculation||[]).filter(p=>p.level===APP.currentLevel);
  const p=puzzles[Math.floor(Math.random()*puzzles.length)];
  if(!p) return;
  calcState={puzzle:p,answered:false};
  document.getElementById('calc-instruction').innerHTML=`<span class="inst-emoji">🧠</span><div class="inst-text">${p.question}</div>`;
  const simpleFEN=buildSimpleFEN(p.piece,p.from);
  buildBoard('calc-board',simpleFEN,{showCoords:true});
  document.getElementById('calc-hint').textContent='💡 '+p.hint;
  speak(p.question);
  const grid=document.getElementById('calc-choices');
  grid.innerHTML='';
  p.choices.forEach(ch=>{
    const btn=document.createElement('button');
    btn.className='choice-btn';
    btn.textContent=ch;
    btn.onclick=()=>{
      if(calcState.answered) return;
      calcState.answered=true;
      soundClick();
      let correct;
      if(Array.isArray(p.correct)) correct=p.correct.includes(ch);
      else correct=ch===p.correct;
      btn.classList.add(correct?'correct':'wrong');
      if(!correct){
        grid.querySelectorAll('.choice-btn').forEach(b=>{ if(Array.isArray(p.correct)?p.correct.includes(b.textContent):b.textContent===p.correct) b.classList.add('correct'); });
      }
      const stars=correct?3:1;
      recordGameStat('calculation',stars);
      speak(correct?'Brilliant thinking!':'Good try! Keep practicing!');
      setTimeout(()=>showResult({emoji:correct?'🧠':'💡',title:correct?'Great Thinking!':'Keep Going!',starsEarned:stars,scoreText:p.hint,onNext:startCalcRound}),800);
    };
    grid.appendChild(btn);
  });
}

// ══════════════════════════════════════
// 9. THINKING TRAINER
// ══════════════════════════════════════
let thinkState={};
function initThinking(){
  APP.currentLevel=1;
  document.querySelectorAll('#thinking-screen .level-btn').forEach(b=>{
    b.classList.toggle('active',parseInt(b.dataset.level)===1);
    b.onclick=()=>{ APP.currentLevel=parseInt(b.dataset.level); document.querySelectorAll('#thinking-screen .level-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); startThinkRound(); soundClick(); };
  });
  startThinkRound();
}
function startThinkRound(){
  const puzzles=APP.puzzleData?.thinking||[];
  const idx=Math.floor(Math.random()*puzzles.length);
  const p=puzzles[idx];
  if(!p) return;
  thinkState={puzzle:p,completed:[],errors:0};
  document.getElementById('think-scenario').innerHTML=`<span class="inst-emoji">♟</span><div class="inst-text">${p.scenario}</div>`;
  document.getElementById('think-prompt').textContent='Tap the steps in the RIGHT ORDER!';
  speak('Tap the thinking steps in the right order! '+p.scenario);
  const container=document.getElementById('thinking-steps');
  container.innerHTML='';
  const shuffled=[...p.steps].sort(()=>Math.random()-0.5);
  shuffled.forEach((step,i)=>{
    const el=document.createElement('div');
    el.className='thinking-step';
    el.dataset.original=p.steps.indexOf(step);
    el.innerHTML=`<div class="step-num">${i+1}</div><span>${step}</span>`;
    el.onclick=()=>checkThinkStep(el,step,p);
    container.appendChild(el);
  });
}
function checkThinkStep(el,step,p){
  if(el.classList.contains('done')) return;
  soundClick();
  const expectedIdx=thinkState.completed.length;
  const actualIdx=p.steps.indexOf(step);
  if(actualIdx===expectedIdx){
    el.classList.add('done');
    thinkState.completed.push(step);
    soundCorrect();
    speak('Correct! '+step);
    if(thinkState.completed.length===p.steps.length){
      const stars=thinkState.errors===0?3:thinkState.errors<=1?2:1;
      recordGameStat('thinking',stars);
      setTimeout(()=>showResult({emoji:'✅',title:'Perfect Thinking!',starsEarned:stars,scoreText:`You followed all ${p.steps.length} steps!`,onNext:startThinkRound}),600);
    }
  } else {
    thinkState.errors++;
    el.classList.add('highlight-wrong');
    soundWrong();
    speak('Not yet! Follow the order!');
    setTimeout(()=>el.classList.remove('highlight-wrong'),600);
  }
}

// ══════════════════════════════════════
// 10. FOCUS FLASH GAME
// ══════════════════════════════════════
let focusState={};
function initFocus(){
  APP.currentLevel=1;
  document.querySelectorAll('#focus-screen .level-btn').forEach(b=>{
    b.classList.toggle('active',parseInt(b.dataset.level)===1);
    b.onclick=()=>{ APP.currentLevel=parseInt(b.dataset.level); document.querySelectorAll('#focus-screen .level-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); startFocusRound(); soundClick(); };
  });
  startFocusRound();
}
function startFocusRound(){
  const puzzles=(APP.puzzleData?.focus||[]).filter(p=>p.level===APP.currentLevel);
  const p=puzzles[Math.floor(Math.random()*puzzles.length)];
  if(!p) return;
  focusState={puzzle:p,answered:false};
  const showSecs=APP.currentLevel===1?4:APP.currentLevel===2?3:2;
  document.getElementById('focus-instruction').innerHTML=`<span class="inst-emoji">⚡</span><div class="inst-text">The board will flash! Then answer the question!</div>`;
  document.getElementById('focus-question-area').classList.add('hidden');

  const wrap=document.getElementById('focus-board-wrap');
  // Add flash overlay
  let overlay=document.getElementById('focus-flash-overlay');
  if(!overlay){ overlay=document.createElement('div'); overlay.id='focus-flash-overlay'; overlay.className='board-flash'; wrap.appendChild(overlay); }
  overlay.textContent='🎮'; overlay.style.opacity='1';

  buildBoard('focus-board','8/8/8/8/8/8/8/8 w - - 0 1',{showCoords:true});
  speak('Get ready! Watch carefully!');

  setTimeout(()=>{
    buildBoard('focus-board',p.fen,{showCoords:true});
    overlay.style.opacity='0';
    soundFlip();
    speak('Look!');
    setTimeout(()=>{
      // Hide again
      overlay.style.opacity='1'; overlay.textContent='🤔';
      buildBoard('focus-board','8/8/8/8/8/8/8/8 w - - 0 1',{showCoords:true});
      soundFlip();
      // Show question
      document.getElementById('focus-instruction').innerHTML=`<span class="inst-emoji">🤔</span><div class="inst-text">${p.question}</div>`;
      document.getElementById('focus-question-area').classList.remove('hidden');
      speak(p.question);
      buildFocusChoices(p);
    }, showSecs*1000);
  },600);
}
function buildFocusChoices(p){
  const grid=document.getElementById('focus-choices');
  grid.innerHTML='';
  // Generate plausible wrong answers
  const allSquares=['a1','b3','c4','d5','e6','f7','g8','h2','e4','d4','c5','f3','g6'];
  const allNums=['2','3','4','6','8','1','5'];
  let choices;
  if(/\d/.test(p.answer) && p.answer.length===1){
    choices=[p.answer,...allNums.filter(x=>x!==p.answer).sort(()=>Math.random()-0.5).slice(0,3)].sort(()=>Math.random()-0.5);
  } else {
    choices=[p.answer,...allSquares.filter(s=>s!==p.answer).sort(()=>Math.random()-0.5).slice(0,3)].sort(()=>Math.random()-0.5);
  }
  choices.forEach(ch=>{
    const btn=document.createElement('button');
    btn.className='choice-btn';
    btn.textContent=ch;
    btn.onclick=()=>{
      if(focusState.answered) return;
      focusState.answered=true;
      soundClick();
      const correct=ch===p.answer;
      btn.classList.add(correct?'correct':'wrong');
      grid.querySelectorAll('.choice-btn').forEach(b=>{ if(b.textContent===p.answer) b.classList.add('correct'); });
      const stars=correct?3:0;
      recordGameStat('focus',stars);
      speak(correct?'Amazing focus!':'The answer was '+p.answer);
      setTimeout(()=>showResult({emoji:correct?'⚡':'😅',title:correct?'Sharp Focus!':'Keep Training!',starsEarned:stars,scoreText:correct?'Your memory is sharp!':'The answer was: '+p.answer,onNext:startFocusRound}),800);
    };
    grid.appendChild(btn);
  });
}
