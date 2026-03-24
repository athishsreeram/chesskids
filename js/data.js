'use strict';

export const THREATS = [
  { fen: '8/8/8/3q4/8/8/3Q4/3K4 w - - 0 1', task: 'Black Queen on D5 is threatening a White piece! Tap it!', hint: 'Black Queen on D5 can move to D2.', answers: ['d2'], explanation: 'Queen on D5 threatens the White Queen on D2!', level: 'easy' },
  { fen: '3k4/8/8/5b2/8/3R4/8/3K4 w - - 0 1', task: 'Black Bishop on F5 threatens a White piece! Tap it!', hint: 'Bishops move diagonally from F5.', answers: ['d3'], explanation: 'Bishop on F5 threatens Rook on D3!', level: 'easy' },
  { fen: '3k4/8/8/8/8/2n5/8/3K1R2 w - - 0 1', task: 'Black Knight on C3 can fork! Which White piece is threatened?', hint: 'From C3, Knight can jump to D1.', answers: ['d1'], explanation: 'Knight from C3 jumps to D1 — a fork!', level: 'medium' },
  { fen: '6k1/8/8/8/3r4/8/3R4/3K4 w - - 0 1', task: 'Black Rook on D4 threatens a White piece! Tap it!', hint: 'Rook can slide down the D-file.', answers: ['d2'], explanation: 'Black Rook threatens White Rook on D2!', level: 'easy' },
  { fen: '3k4/8/8/8/4b3/8/8/4K2R w - - 0 1', task: 'Black Bishop on E4 eyes a White piece! Tap it!', hint: 'Bishop moves diagonally toward H.', answers: ['h1'], explanation: 'Bishop on E4 threatens Rook on H1!', level: 'easy' },
];

export const DOJO_PIECES = [{ code: 'wN', label: 'Knight', icon: '♘', fact: 'The Knight jumps in an L-shape: 2+1 squares!' }, { code: 'wR', label: 'Rook', icon: '♖', fact: 'The Rook slides in straight lines!' }, { code: 'wB', label: 'Bishop', icon: '♗', fact: 'The Bishop slides diagonally!' }, { code: 'wQ', label: 'Queen', icon: '♕', fact: 'The Queen combines Rook + Bishop!' }, { code: 'wK', label: 'King', icon: '♔', fact: 'The King moves one square any direction!' }, { code: 'wP', label: 'Pawn', icon: '♙', fact: 'Pawns move forward but capture diagonally!' }];

export const CAP_POSITIONS = [
  { fen: '3k4/8/5n2/3p4/3R4/2B5/8/3K4 w - - 0 1', task: 'Capture FREE Black pieces in 3 moves!', moves: 3, hint: 'Rook can take D5 pawn. Knight on F6 is defended!' },
  { fen: '3k4/3q4/8/2p1p3/3R4/8/8/3K4 w - - 0 1', task: 'Three pieces! Capture only the undefended ones!', moves: 3, hint: 'C5 and E5 pawns are free. Queen on D7 is protected.' },
  { fen: '2bk4/8/8/3r4/2B5/8/8/3K2R1 w - - 0 1', task: 'Find the free piece and capture it!', moves: 2, hint: 'Rook on D5 is undefended! Bishop on C8 is protected.' },
];

export const DEFEND_ATTACKS = [{ name: 'Rook Attack', positions: { bR: { r: 7, f: 3 }, bK: { r: 7, f: 4 } }, description: 'A Rook charges toward your King!' }, { name: 'Bishop Assault', positions: { bB: { r: 6, f: 5 }, bK: { r: 7, f: 7 } }, description: 'A Bishop aims diagonally!' }, { name: 'Queen Rush', positions: { bQ: { r: 7, f: 7 }, bK: { r: 7, f: 5 } }, description: 'The enemy Queen approaches!' }];
export const ARMY_PIECES = [{ code: 'wR', icon: '♖' }, { code: 'wB', icon: '♗' }, { code: 'wN', icon: '♘' }, { code: 'wP', icon: '♙' }, { code: 'wP2', icon: '♙' }];

export const CURR_DATA = [
  {
    id: 'l1', label: 'L1', title: 'Beginner', subtitle: 'Foundations · 20 Sessions', color: 'lc1', goal: 'Learn the pieces, rules, and play your first game!', sessions: [
      { num: 1, title: 'The Chessboard', topics: '64 squares, files, ranks', concept: { emoji: '♟', title: 'Meet the Board!', explain: '64 squares — 32 light, 32 dark! Columns=FILES (a-h), Rows=RANKS (1-8). Every square has a unique name like "e4"!', fen: '8/8/8/8/8/8/8/8 w - - 0 1', hl: { yellow: ['e4', 'd5', 'a1', 'h8'] }, quiz: { q: 'How many squares?', opts: ['32', '64', '48', '16'], ans: '64', right: 'Yes! 64!', wrong: '8×8=64!' }, puzzle: { instr: 'Tap E4!', fen: '8/8/8/8/8/8/8/8 w - - 0 1', ans: ['e4'], hl: { yellow: ['e4'] } } } },
      { num: 2, title: 'The King', topics: 'Most important piece', concept: { emoji: '♔', title: 'The King!', explain: 'The King ♔ is the MOST IMPORTANT piece! If your King is caught (checkmate) you lose. Moves ONE square in ANY direction.', fen: '8/8/8/8/4K3/8/8/8 w - - 0 1', hl: { green: ['d3', 'e3', 'f3', 'd4', 'f4', 'd5', 'e5', 'f5'] }, quiz: { q: 'What happens if your King is checkmated?', opts: ['Lose a turn', 'Lose the game!', 'New King', 'Nothing'], ans: 'Lose the game!', right: 'Protect your King!', wrong: 'Checkmate = lose!' }, puzzle: { instr: 'King on E4. Tap where it can move!', fen: '8/8/8/8/4K3/8/8/8 w - - 0 1', ans: ['d3', 'e3', 'f3', 'd4', 'f4', 'd5', 'e5', 'f5'], hl: { yellow: ['e4'] } } } },
      { num: 3, title: 'The Queen', topics: 'Most powerful piece', concept: { emoji: '♕', title: 'The Queen!', explain: 'The Queen ♕ is the MOST POWERFUL! Moves ANY direction, as many squares. Worth 9 points!', fen: '8/8/8/8/3Q4/8/8/8 w - - 0 1', hl: { green: ['d1', 'd2', 'd3', 'd5', 'd6', 'd7', 'd8', 'a4', 'b4', 'c4', 'e4', 'f4', 'g4', 'h4'] }, quiz: { q: 'How does the Queen move?', opts: ['Only forward', 'Only diagonally', 'Any direction!', 'Only sideways'], ans: 'Any direction!', right: 'SUPER powerful!', wrong: 'Queen goes everywhere!' }, puzzle: { instr: 'Queen on D4. Tap any reachable square!', fen: '8/8/8/8/3Q4/8/8/8 w - - 0 1', ans: ['d1', 'd2', 'd3', 'd5', 'd6', 'd7', 'd8', 'a4', 'b4', 'c4', 'e4', 'f4', 'g4', 'h4'], hl: { yellow: ['d4'] } } } },
      { num: 4, title: 'The Rook', topics: 'Straight lines, worth 5', concept: { emoji: '♖', title: 'The Rook!', explain: 'The Rook ♖ moves in STRAIGHT LINES — forward, backward, sideways. Worth 5 points!', fen: '8/8/8/8/3R4/8/8/8 w - - 0 1', hl: { green: ['d1', 'd2', 'd3', 'd5', 'd6', 'd7', 'd8', 'a4', 'b4', 'c4', 'e4', 'f4', 'g4', 'h4'] }, quiz: { q: 'How does the Rook move?', opts: ['Diagonally', 'Straight lines!', 'L-shape', 'One square only'], ans: 'Straight lines!', right: 'Straight-line sliders!', wrong: 'Rooks go straight!' }, puzzle: { instr: 'Rook on D4. Tap any straight-line square!', fen: '8/8/8/8/3R4/8/8/8 w - - 0 1', ans: ['d1', 'd2', 'd3', 'd5', 'd6', 'd7', 'd8', 'a4', 'b4', 'c4', 'e4', 'f4', 'g4', 'h4'], hl: { yellow: ['d4'] } } } },
      { num: 5, title: 'The Knight', topics: 'L-shape jump, jumps over pieces', concept: { emoji: '♘', title: 'The Knight!', explain: 'The Knight ♘ jumps in an L-shape: 2 squares + 1 sideways. The ONLY piece that jumps over others! Worth 3 points.', fen: '8/8/8/8/3N4/8/8/8 w - - 0 1', hl: { green: ['b3', 'b5', 'c2', 'c6', 'e2', 'e6', 'f3', 'f5'] }, quiz: { q: 'What is special about the Knight?', opts: ['Moves diagonally', 'Jumps over pieces!', 'Goes sideways only', 'Never moves'], ans: 'Jumps over pieces!', right: 'The only jumper!', wrong: 'Knights JUMP in an L!' }, puzzle: { instr: 'Knight on D4. Tap an L-shape square!', fen: '8/8/8/8/3N4/8/8/8 w - - 0 1', ans: ['b3', 'b5', 'c2', 'c6', 'e2', 'e6', 'f3', 'f5'], hl: { yellow: ['d4'] } } } },
    ]
  },
  { id: 'l2', label: 'L2', title: 'Advanced Beginner', subtitle: 'Tactics · 20 Sessions', color: 'lc2', goal: 'Spot simple tactics and avoid blunders!', sessions: [{ num: 1, title: 'The Fork', topics: 'Attack two pieces at once', concept: { emoji: '🍴', title: 'The Fork!', explain: 'A FORK attacks TWO enemy pieces at once! The opponent can only save ONE — you get the other for free!', fen: '8/8/8/3N4/8/2k5/8/4K3 w - - 0 1', hl: { green: ['c3', 'e3'], yellow: ['d5'] }, quiz: { q: 'In a fork, how many pieces are attacked?', opts: ['One', 'Two!', 'Three', 'All'], ans: 'Two!', right: 'Fork = TWO at once!', wrong: 'Fork attacks TWO!' }, puzzle: { instr: 'Tap the forking Knight!', fen: '8/8/8/3N4/8/2k5/8/4K3 w - - 0 1', ans: ['d5'], hl: { yellow: ['d5'] } } } }] },
  { id: 'l3', label: 'L3', title: 'Intermediate', subtitle: 'Strategy · 20 Sessions', color: 'lc3', goal: 'Think 3-4 moves ahead!', sessions: [{ num: 1, title: 'Open Files', topics: 'Rooks love open files', concept: { emoji: '🚀', title: 'Open Files!', explain: 'An OPEN FILE has no pawns on it. Rooks are MOST powerful on open files!', fen: '8/8/8/8/8/8/PPP1PPPP/R7 w - - 0 1', hl: { green: ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8'] }, quiz: { q: 'What is an open file?', opts: ['Full of pawns', 'No pawns!', 'For Kings', 'Right side'], ans: 'No pawns!', right: 'Open files = Rook highways!', wrong: 'No pawns = open file!' }, puzzle: { instr: 'D-file is open! Tap the Rook!', fen: '8/8/8/8/8/8/PPP1PPPP/R7 w - - 0 1', ans: ['a1'], hl: { green: ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8'] } } } }] },
  { id: 'l4', label: 'L4', title: 'Advanced', subtitle: 'Tournament Thinking', color: 'lc4', goal: 'Learn opening systems!', sessions: [{ num: 1, title: 'Italian Game', topics: '1.e4 e5 2.Nf3 Nc6 3.Bc4', concept: { emoji: '🇮🇹', title: 'Italian Game!', explain: '1.e4 e5 2.Nf3 Nc6 3.Bc4 — Bishop to C4, aiming at the weak F7 square!', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', hl: { yellow: ['c4'], green: ['f7'] }, quiz: { q: 'Where does the Italian Bishop go?', opts: ['B5', 'C4!', 'D3', 'E2'], ans: 'C4!', right: 'Bc4 eyes F7!', wrong: 'Italian = Bc4!' }, puzzle: { instr: 'Tap the Italian Bishop!', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', ans: ['c4'], hl: { yellow: ['c4'] } } } }] },
  { id: 'l5', label: 'L5', title: 'Advanced Part 2', subtitle: 'Competitive', color: 'lc5', goal: 'Develop strong competitive skills!', sessions: [{ num: 1, title: 'Deep Calculation', topics: '4-5 moves ahead', concept: { emoji: '🔭', title: 'Calculate Deeper!', explain: 'CALCULATION means seeing moves in your head! Order: Checks → Captures → Threats. Aim for 4-5 moves ahead!', fen: 'r3k2r/ppp2ppp/2n1bn2/3qp3/3PP3/2PBBN2/PP3PPP/R2QK2R w KQkq - 0 10', hl: {}, quiz: { q: 'Calculate in what order?', opts: ['Pawns first', 'Checks, captures, threats!', 'Pretty moves', 'Random'], ans: 'Checks, captures, threats!', right: 'Checks → Captures → Threats!', wrong: 'Always: Checks first!' }, puzzle: { instr: 'Tap the Black Queen!', fen: 'r3k2r/ppp2ppp/2n1bn2/3qp3/3PP3/2PBBN2/PP3PPP/R2QK2R w KQkq - 0 10', ans: ['d5'], hl: { yellow: ['d5'] } } } }] },
  { id: 'lm', label: '★', title: 'Master Course', subtitle: 'Performance Track', color: 'lcm', goal: 'Compete in rated tournaments!', sessions: [{ num: 1, title: 'Opening Repertoire', topics: '15-20 moves deep', concept: { emoji: '🏆', title: 'Build Your Repertoire!', explain: 'At Master level you need your openings 15-20 moves deep and ALL the plans memorized!', fen: 'r2qkb1r/ppp1pppp/2n2n2/3p1b2/2PP4/2N1PN2/PP3PPP/R1BQKB1R w KQkq - 0 7', hl: {}, quiz: { q: 'How deep should a Master know openings?', opts: ['3 moves', '5 moves', '15-20 moves!', 'Just move 1'], ans: '15-20 moves!', right: 'Masters know 15-20 moves deep!', wrong: 'Masters go 15-20 moves!' }, puzzle: { instr: 'Tap the Black Queen!', fen: 'r2qkb1r/ppp1pppp/2n2n2/3p1b2/2PP4/2N1PN2/PP3PPP/R1BQKB1R w KQkq - 0 7', ans: ['d8'], hl: { yellow: ['d8'] } } } }] },
];

export const BLUNDERS = [
  { fen: '3k4/8/8/8/3R4/8/3q4/3K4 w - - 0 1', isB: true, hang: ['d4'], hint: 'Black Queen on D2 attacks White Rook on D4!', exp: 'BLUNDER! Rook D4 is attacked by Black Queen D2!', moved: 'Rook to D4' },
  { fen: '3k4/8/8/3r4/8/8/8/3RK3 w - - 0 1', isB: false, hang: [], hint: 'Black Rook cannot reach D1 in one move.', exp: 'Safe! The Black Rook cannot reach D1 directly.', moved: 'King to E1' },
  { fen: '3k4/3q4/8/3N4/8/8/8/3K4 w - - 0 1', isB: true, hang: ['d5'], hint: 'Black Queen D7 attacks Knight on D5!', exp: 'BLUNDER! Knight D5 attacked by Black Queen D7!', moved: 'Knight to D5' },
  { fen: 'r3k3/8/8/8/8/8/8/R3K3 w - - 0 1', isB: false, hang: [], hint: 'No Black piece can reach A1 in one move.', exp: 'Safe!', moved: 'Rook to A1' },
  { fen: '3k4/8/8/8/2b5/8/8/3BK3 w - - 0 1', isB: true, hang: ['d1'], hint: 'Black Bishop C4 attacks White Bishop D1!', exp: 'BLUNDER! Black Bishop C4 attacks White Bishop D1!', moved: 'Bishop to D1' },
];

export const PAT_DATA = [
  { id: 'backrank', name: 'Back Rank Mate', icon: '🏰', explain: 'The enemy King is trapped on its back rank by its OWN pawns! Rook or Queen slides in.', fen: '5rk1/5ppp/8/8/8/8/8/R5K1 w - - 0 1', sol: 'a1a8', hint: 'Rook to A8!', task: 'Deliver the Back Rank Mate!' },
  { id: 'smothered', name: 'Smothered Mate', icon: '😤', explain: 'The King is smothered by its OWN pieces! Only a Knight delivers this special mate!', fen: '6rk/6pp/7N/8/8/8/8/6K1 w - - 0 1', sol: 'h6f7', hint: 'Knight to F7!', task: 'Find the Smothered Mate!' },
  { id: 'ladder', name: 'Ladder Mate', icon: '🪜', explain: 'Two Rooks take turns pushing the King to the edge — like climbing a ladder!', fen: '6k1/8/6RR/8/8/8/8/6K1 w - - 0 1', sol: 'h6h8', hint: 'Move one Rook to H8!', task: 'Ladder Mate!' },
  { id: 'arabian', name: 'Arabian Mate', icon: '🐎', explain: 'Rook and Knight team up in the corner! Knight covers escapes, Rook delivers check.', fen: '5Rrk/8/6N1/8/8/8/8/6K1 w - - 0 1', sol: 'f8g8', hint: 'Rook to G8!', task: 'Arabian Mate!' },
  { id: 'scholars', name: "Scholar's Mate", icon: '🎓', explain: "Learn this to AVOID it — Queen+Bishop attack F7! Defend with Nf6!", fen: 'r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4', sol: 'f7', hint: 'Queen on F7 is checkmate.', task: "Scholar's Mate — tap the Queen!" },
];

export const COMBOS = [
  { fen: '6k1/5ppp/8/8/8/8/5PPP/4RRK1 w - - 0 1', m1: { f: 'e1', t: 'e8' }, m1r: { f: 'g8', t: 'h7' }, m2: { f: 'f1', t: 'f7' }, task: 'Mate in 2! Both Rooks cooperate!', h1: 'Rook E1 to E8 — check!', h2: 'Rook F1 to F7 — checkmate!' },
  { fen: '3k4/3Q4/3K4/8/8/8/8/8 w - - 0 1', m1: { f: 'd7', t: 'd8' }, m1r: null, m2: null, task: 'Mate in 1! Queen + King!', h1: 'Queen to D8 is checkmate!', h2: '' },
  { fen: 'r5k1/5ppp/8/8/8/5Q2/8/6K1 w - - 0 1', m1: { f: 'f3', t: 'f7' }, m1r: { f: 'g8', t: 'h8' }, m2: { f: 'f7', t: 'h7' }, task: 'Mate in 2! Queen drives the King to the corner!', h1: 'Queen to F7 — King must retreat!', h2: 'Queen to H7 is checkmate!' },
];

export const ENDGAMES = {
  kqk: {
    title: 'King + Queen vs King', steps: [
      { instr: 'Step 1: Queen to D5 — restrict the enemy King!', task: 'Move Queen to D5.', fen: '3k4/8/8/8/8/8/8/3QK3 w - - 0 1', tf: 'd1', tt: 'd5' },
      { instr: 'Step 2: King to E2 — march forward!', task: 'King to E2.', fen: '3k4/8/8/3Q4/8/8/8/4K3 w - - 0 1', tf: 'e1', tt: 'e2' },
      { instr: 'Step 3: Queen to D7 — push the King to the back rank!', task: 'Queen to D7!', fen: '3k4/8/8/3Q4/8/8/4K3/8 w - - 0 1', tf: 'd5', tt: 'd7' },
      { instr: 'Step 4: Checkmate! Queen to D8!', task: 'Queen to D8!', fen: '3k4/3Q4/3K4/8/8/8/8/8 w - - 0 1', tf: 'd7', tt: 'd8' },
    ]
  },
  krk: {
    title: 'King + Rook vs King', steps: [
      { instr: 'Step 1: Rook to A7 — cut off the enemy King!', task: 'Rook to A7!', fen: '3k4/8/8/8/8/8/8/R3K3 w - - 0 1', tf: 'a1', tt: 'a7' },
      { instr: 'Step 2: King to E2 — advance!', task: 'King to E2.', fen: '3k4/R7/8/8/8/8/8/4K3 w - - 0 1', tf: 'e1', tt: 'e2' },
      { instr: 'Step 3: Rook to A8!', task: 'Rook to A8!', fen: '2k5/R7/8/8/8/3K4/8/8 w - - 0 1', tf: 'a7', tt: 'a8' },
      { instr: 'Step 4: Checkmate!', task: 'Rook to A8 — checkmate!', fen: '2k5/8/2K5/8/8/8/8/R7 w - - 0 1', tf: 'a1', tt: 'a8' },
    ]
  },
  kpk: {
    title: 'King + Pawn vs King', steps: [
      { instr: 'Step 1: KING LEADS! King to D5 — in front of the pawn!', task: 'King to D5!', fen: '8/8/3k4/8/3K4/3P4/8/8 w - - 0 1', tf: 'd4', tt: 'd5' },
      { instr: 'Step 2: Push the pawn to D4!', task: 'Pawn to D4!', fen: '8/8/8/2kK4/8/3P4/8/8 w - - 0 1', tf: 'd3', tt: 'd4' },
      { instr: 'Step 3: King to D6!', task: 'King to D6!', fen: '8/8/8/3K4/3k4/3P4/8/8 w - - 0 1', tf: 'd5', tt: 'd6' },
      { instr: 'Step 4: Pawn to D5!', task: 'Pawn to D5!', fen: '8/8/3K4/8/3k4/3P4/8/8 w - - 0 1', tf: 'd3', tt: 'd5' },
    ]
  },
};

export const OPENINGS = [
  { cat: 'principles', q: 'Which first move is BETTER for White?', hint: 'Control the center!', o1: { label: '1. e4 ✅', fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', ok: true, why: 'E4 controls the center!' }, o2: { label: '1. a4 ❌', fen: 'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR b KQkq - 0 1', ok: false, why: 'A4 does nothing for center!' } },
  { cat: 'principles', q: 'After 1.e4 e5, which move is better?', hint: 'Develop toward center!', o1: { label: '2. Nf3 ✅', fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2', ok: true, why: 'Knight develops AND attacks!' }, o2: { label: '2. h3 ❌', fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/7P/PPPP1PP1/RNBQKBNR b KQkq - 0 2', ok: false, why: 'H3 wastes a move!' } },
  { cat: 'castling', q: 'Your King is in the center. What should you do?', hint: 'Castle early for safety!', o1: { label: 'Castle Kingside ✅', fen: 'r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 w - - 0 6', ok: true, why: 'Castle! King to safety!' }, o2: { label: 'Keep King in center ❌', fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5', ok: false, why: 'King in center is dangerous!' } },
];

export const EVALS = [
  { fen: '3k4/3q4/8/8/8/8/3Q4/3K4 w - - 0 1', ans: 'equal', w: 9, b: 9, hint: 'Both have a Queen!', exp: 'Equal! Both have a Queen (9 pts each).' },
  { fen: '3k4/8/8/8/3R4/8/8/3K4 w - - 0 1', ans: 'white', w: 5, b: 0, hint: 'White Rook=5, Black has nothing.', exp: 'White is winning! Rook (5) vs nothing!' },
  { fen: '3k4/3q4/8/8/8/8/8/3K4 w - - 0 1', ans: 'black', w: 0, b: 9, hint: 'Black Queen=9, White has nothing.', exp: 'Black is winning! Queen (9) vs nothing!' },
  { fen: '3k4/3p4/8/3P4/8/8/8/3K4 w - - 0 1', ans: 'equal', w: 1, b: 1, hint: 'Both have one pawn!', exp: 'Equal! One pawn each.' },
  { fen: '3k4/3r4/8/8/3RR3/8/8/3K4 w - - 0 1', ans: 'white', w: 10, b: 5, hint: 'White: 2 Rooks=10. Black: 1 Rook=5.', exp: 'White winning! Two Rooks (10) vs one Rook (5)!' },
];

export const PAWNS = [
  { cat: 'passed', fen: '3k4/8/8/3P4/8/8/8/3K4 w - - 0 1', task: 'Which pawn is a PASSED PAWN? Tap it!', hint: 'No enemy pawns on same or adjacent files in front!', ans: ['d5'], type: 'spot', exp: 'D5 is passed! No Black pawn can stop it!' },
  { cat: 'promotion', fen: '3k4/3P4/8/8/8/8/8/3K4 w - - 0 1', task: 'Tap where the D7 pawn should go to promote!', hint: 'Pawns promote on the last rank!', ans: ['d8'], type: 'spot', exp: 'D8! Pawn becomes a Queen!' },
  { cat: 'race', fen: '3k4/8/3p4/8/3P4/8/8/3K4 w - - 0 1', task: 'Who promotes first — White D4 or Black D6?', hint: 'White needs 4 moves, Black needs 5.', ans: [], type: 'yn', q: 'Does White win this pawn race?', ya: true, exp: 'Yes! White promotes in 4 moves, Black needs 5!' },
  { cat: 'structure', fen: '3k4/pp6/8/8/8/8/PP6/3K4 w - - 0 1', task: 'Are connected A+B pawns stronger than isolated ones?', hint: 'Connected pawns defend each other!', ans: [], type: 'yn', q: 'Are connected pawns stronger than isolated?', ya: true, exp: 'Yes! Connected pawns defend each other!' },
];

export const PWCATS = [{ id: 'all', lbl: 'All' }, { id: 'passed', lbl: '🏃 Passed' }, { id: 'promotion', lbl: '⬆️ Promote' }, { id: 'race', lbl: '🏁 Race' }, { id: 'structure', lbl: '🏗️ Structure' }];

export const DK_CONCEPTS = {
  move: { em: '🏃', name: 'Move Away!', exp: 'When your King is attacked, MOVE it to a safe square the enemy cannot reach!' },
  block: { em: '🧱', name: 'Block!', exp: 'If a Rook, Bishop or Queen attacks your King in a straight line, PUT A PIECE IN BETWEEN to block!' },
  capture: { em: '⚔️', name: 'Capture!', exp: 'Sometimes you can TAKE the piece attacking your King! Capture it and the check is over!' },
  protect: { em: '🛡️', name: 'Protect!', exp: 'Before the enemy takes your piece, DEFEND it so if they capture, you can recapture back.' }
};

export const DK_SCENARIOS = {
  move: [
    { fen: '4K3/8/8/8/8/8/8/4r3 w - - 0 1', task: 'King on E8 is in CHECK from Rook on E1! Move to safety!', hint: 'E-file is dangerous! Try D7, D8, F7 or F8.', answers: ['d7', 'f7', 'd8', 'f8'], bad: ['e7'], explain: 'King escaped the E-file!' },
    { fen: '7k/8/7R/8/8/8/8/7K w - - 0 1', task: 'Black King on H8 is in CHECK from Rook H6! Escape!', hint: 'H-file is dangerous! Move to G8 or G7.', answers: ['g8', 'g7'], bad: ['h7'], explain: 'G8 or G7 — off the H-file!' },
    { fen: '3K4/8/3q4/8/8/8/8/7k w - - 0 1', task: 'King on D8 in CHECK from Queen D6! Find a safe escape!', hint: 'D-file is dangerous! Try C7 or E7.', answers: ['c7', 'e7'], bad: ['d7'], explain: 'King to C7 or E7 escapes!' },
  ],
  block: [
    { fen: '6k1/8/6R1/8/8/8/8/6K1 w - - 0 1', task: 'Black King on G8 in CHECK from Rook G6! Tap the BLOCKING square!', hint: 'Only G7 sits between G6 and G8.', answers: ['g7'], bad: ['g8', 'g6'], type: 'block-sq', explain: 'G7 is the only blocking square!' },
    { fen: '3k4/3R4/8/8/8/8/8/3r3K w - - 0 1', task: 'White King on H1 in CHECK from Black Rook D1! Tap a BLOCKING square!', hint: 'Tap E1, F1 or G1.', answers: ['e1', 'f1', 'g1'], bad: ['h1', 'd1'], type: 'block-sq', explain: 'Placing a piece on E1-G1 blocks the check!' },
    { fen: '4K3/8/8/8/8/8/4r3/4q3 w - - 0 1', task: 'King on E8 in CHECK from Queen E1! Tap a BLOCKING square!', hint: 'Any square between E2-E7 blocks it.', answers: ['e7', 'e6', 'e5', 'e4', 'e3', 'e2'], bad: ['e8'], type: 'block-sq', explain: 'Blocking puts a piece between attacker and King!' },
  ],
  capture: [
    { fen: '6k1/8/8/8/8/8/6r1/6K1 w - - 0 1', task: 'King on G1 in CHECK from Rook G2! King can CAPTURE it — tap the Rook!', hint: 'Rook on G2 is right next to the King — step to G2!', answers: ['g2'], bad: ['g1', 'h1'], type: 'capture-piece', explain: 'King captured the Rook on G2!' },
    { fen: '5k2/8/5q2/8/8/8/5R2/5K2 w - - 0 1', task: 'King in CHECK from Queen F6! White Rook can CAPTURE it! Tap the Queen!', hint: 'Rook on F2 slides up to F6!', answers: ['f6'], bad: ['f1', 'f2'], type: 'capture-piece', explain: 'Rook takes Queen — check gone AND you win the Queen!' },
    { fen: '3k4/8/8/3r4/8/3K4/8/8 w - - 0 1', task: 'King in CHECK from Rook D5! Go sideways — D4 is still dangerous!', hint: 'Move to C3, E3, C4 or E4.', answers: ['c3', 'e3', 'c4', 'e4'], bad: ['d4'], type: 'capture-piece', explain: 'Moving sideways escapes the D-file check!' },
  ],
  protect: [
    { fen: '3k4/3q4/8/8/8/3R4/8/3K4 w - - 0 1', task: 'Black Queen threatens your Rook D3! PROTECT the Rook — tap a defending piece!', hint: 'King can step closer to D3 to defend it.', answers: ['d1'], protect_sq: 'd3', type: 'protect-piece', explain: 'King defends the Rook! Now Queen taking Rook loses to King recapture!' },
    { fen: '3k4/8/8/5b2/5P3/8/8/3K4 w - - 0 1', task: 'Black Bishop threatens your Pawn F4! PROTECT it!', hint: 'King on D1 can step to E2 to defend.', answers: ['d1', 'e2'], protect_sq: 'f4', type: 'protect-piece', explain: 'King stepping to E3 defends the F4 pawn!' },
    { fen: '3k4/8/8/3r4/3P4/8/8/3K4 w - - 0 1', task: 'Black Rook attacks your Pawn D4! PROTECT it!', hint: 'King needs to advance toward D3.', answers: ['d1', 'e1', 'c1'], protect_sq: 'd4', type: 'protect-piece', explain: 'Moving the King toward D3 protects the pawn!' },
  ],
};

export const LD_MODES = {
  learn: {
    steps: [
      { fen: '6k1/8/6R1/8/8/R7/8/6K1 w - - 0 1', task: '📖 Rook on G6 leaps to G7 — leapfrogging ahead! Tap G6 Rook.', from: 'g6', to: 'g7', explain: 'One Rook holds the rank while the other leaps ONE rank ahead!', hint: 'G6 → G7' },
      { fen: '6k1/6R1/8/8/R7/8/8/6K1 w - - 0 1', task: 'A4 Rook to A8 — check! Tap the A4 Rook.', from: 'a4', to: 'a8', explain: 'Second Rook leaps to the 8th rank — check! King must move.', hint: 'A4 → A8' },
      { fen: '6k1/R7/6R1/8/8/8/8/6K1 w - - 0 1', task: 'G6 Rook to H6 — cut off all escapes!', from: 'g6', to: 'h6', explain: 'Adjust Rooks to cover all corner escape squares!', hint: 'G6 → H6' },
    ]
  },
  practice: {
    steps: [
      { fen: '4k3/8/4R3/8/R7/8/8/4K3 w - - 0 1', task: '🎯 E6 Rook to E7 — push the King back!', from: 'e6', to: 'e7', explain: 'Push the King rank by rank!', hint: 'E6 → E7' },
      { fen: '4k3/4R3/8/R7/8/8/8/4K3 w - - 0 1', task: 'A5 Rook to A8 — check!', from: 'a5', to: 'a8', explain: 'Check forces King to move!', hint: 'A5 → A8' },
      { fen: '3k4/4R3/R7/8/8/8/8/4K3 w - - 0 1', task: 'E7 Rook to E8!', from: 'e7', to: 'e8', explain: 'Push the King to the back!', hint: 'E7 → E8' },
    ]
  },
  challenge: {
    steps: [
      { fen: '7k/8/6R1/8/R7/8/8/7K w - - 0 1', task: '🏆 A4 Rook to A8 — check!', from: 'a4', to: 'a8', explain: 'Check! King must move.', hint: 'A4 → A8' },
      { fen: '6k1/8/R5R1/8/8/8/8/7K w - - 0 1', task: 'G6 Rook to G7 — check!', from: 'g6', to: 'g7', explain: 'Ladder step 2!', hint: 'G6 → G7' },
      { fen: '7k/6R1/R7/8/8/8/8/7K w - - 0 1', task: 'A6 Rook to A8 — check!', from: 'a6', to: 'a8', explain: 'Ladder step 3!', hint: 'A6 → A8' },
      { fen: '6k1/6R1/R7/8/8/8/8/7K w - - 0 1', task: 'G7 Rook to G8 — CHECKMATE!', from: 'g7', to: 'g8', explain: 'Checkmate! Perfect Double Ladder!', hint: 'G7 → G8' },
    ]
  },
};

export const FT_SCENARIOS = {
  fork: [
    { fen: '3k4/8/8/8/8/2N5/8/3K4 w - - 0 1', task: 'Knight C3 — fork the King AND another piece!', from: 'c3', answers: ['e4', 'b5', 'd5', 'a4'], hint: 'From C3: B1,D1,A2,E2,A4,E4,B5,D5. Which is near the King?', explain: 'Knight forks two pieces at once!', pairs: [['bK', 'd8']] },
    { fen: 'r3k3/8/8/8/8/8/3N4/3K4 w - - 0 1', task: 'Knight D2 — fork King E8 AND Rook A8!', from: 'd2', answers: ['c4', 'e4', 'b3', 'f3'], hint: 'Find the L-shape that threatens both pieces!', explain: 'Knight forks King and Rook!', pairs: [['bK', 'e8'], ['bR', 'a8']] },
    { fen: '3k4/3q4/8/8/8/2N5/8/3K4 w - - 0 1', task: 'Knight C3 — fork King D8 AND Queen D7!', from: 'c3', answers: ['e4', 'b5'], hint: 'Which jump from C3 attacks both D8 and D7 area?', explain: 'Knight attacks two Black pieces!', pairs: [['bK', 'd8'], ['bQ', 'd7']] },
  ],
  double: [
    { fen: '3k4/3q4/8/8/8/3R4/8/3K4 w - - 0 1', task: 'DOUBLE ATTACK! Move the Rook to attack Queen AND King!', from: 'd3', answers: ['d7'], hint: 'Rook to D7 — captures Queen AND attacks King!', explain: 'Rook on D7 — double attack!', targets: ['bQ'] },
    { fen: '4k3/8/8/4r3/8/8/4R3/4K3 w - - 0 1', task: 'DOUBLE ATTACK! Rook to E5 — captures Rook AND attacks King!', from: 'e2', answers: ['e5'], hint: 'Rook E2 to E5 — takes Black Rook AND attacks King above!', explain: 'Double threat — takes Rook and attacks King!', targets: ['bR', 'bK'] },
    { fen: '3k4/3p4/8/8/8/3Q4/8/3K4 w - - 0 1', task: 'DOUBLE ATTACK with the Queen! Attack King AND Pawn!', from: 'd3', answers: ['d7'], hint: 'Queen to D7 — captures pawn AND gives check!', explain: 'Queen takes pawn on D7 — check AND win material!', targets: ['bK', 'bP'] },
  ],
};

export const PUZZLES = [
  { id: 'cm1', cat: 'mate1', fen: '6k1/5Q2/6K1/8/8/8/8/8 w - - 0 1', task: 'White to move — CHECKMATE in one!', hint: 'Move the Queen close to the King.', solution: ['f7f8', 'f7g7', 'f7h7'], wrongMsg: 'King escaped! No escape squares needed.', okMsg: 'Checkmate! ♛', turn: 'w' },
  { id: 'cm2', cat: 'mate1', fen: '8/8/8/8/8/8/1R6/k1K5 w - - 0 1', task: 'Rook to give checkmate! King is cornered!', hint: 'Rook on B2 slides to A2.', solution: ['b2a2'], wrongMsg: 'Not checkmate! Try Rook to A2.', okMsg: 'Rook to A2 is checkmate! 🏰', turn: 'w' },
  { id: 'cm3', cat: 'mate1', fen: '5rk1/5ppp/8/8/8/8/8/R5K1 w - - 0 1', task: 'Back rank checkmate! Move the Rook!', hint: 'Slide the Rook all the way to A8!', solution: ['a1a8'], wrongMsg: 'The King still has escape squares!', okMsg: 'Back Rank Mate! 🏆', turn: 'w' },
  { id: 'f1', cat: 'fork', fen: '3k4/8/8/8/8/2N5/8/3K4 w - - 0 1', task: 'Knight Fork! Find the square attacking BOTH the King and another piece!', hint: 'Knights move in L-shapes.', solution: ['c3e4', 'c3b5', 'c3a4', 'c3d5'], wrongMsg: 'Does not attack both pieces!', okMsg: 'Fork! Knight attacks two at once! 🍴', turn: 'w' },
  { id: 'h1', cat: 'hang', fen: '3k4/3q4/8/8/8/3R4/8/3K4 w - - 0 1', task: 'A FREE piece to capture! Find it!', hint: 'The Black Queen on D7 is unprotected.', solution: ['d3d7'], wrongMsg: 'Look for an undefended enemy piece!', okMsg: 'Free Queen captured! 💰', turn: 'w' },
  { id: 'e1', cat: 'escape', fen: '4K3/8/8/8/8/8/8/4r3 w - - 0 1', task: 'King is in CHECK! Move to safety!', hint: 'The E-file is dangerous! Move sideways.', solution: ['e8d7', 'e8f7', 'e8d8', 'e8f8'], wrongMsg: 'King still in danger!', okMsg: 'King escaped! 👑', turn: 'w' },
  { id: 'sk1', cat: 'skewer', fen: '8/3k4/8/8/8/8/8/3R3K w - - 0 1', task: 'Skewer! Attack the King — win the piece behind!', hint: 'Rook up the D-file to attack King on D7!', solution: ['d1d7', 'd1d8'], wrongMsg: 'A skewer attacks the MORE valuable piece first!', okMsg: 'Skewer! 🏰', turn: 'w' },
];

export const PCATS = [{ id: 'all', label: 'All Puzzles' }, { id: 'mate1', label: '☠️ Checkmate' }, { id: 'fork', label: '🍴 Fork' }, { id: 'hang', label: '💰 Free Piece' }, { id: 'escape', label: '🏃 Escape' }, { id: 'skewer', label: '⚔️ Skewer' }];
