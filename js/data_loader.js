'use strict';

const BASE = './data/json';

async function fetchJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}

let _cache = null;
let _loading = null;

async function getData() {
  if (_cache) return _cache;
  if (_loading) return _loading;
  _loading = Promise.all([
    fetchJSON(`${BASE}/puzzles.json`),
    fetchJSON(`${BASE}/pcats.json`),
    fetchJSON(`${BASE}/dojo.json`),
    fetchJSON(`${BASE}/threats.json`),
    fetchJSON(`${BASE}/capture.json`),
    fetchJSON(`${BASE}/defend.json`),
    fetchJSON(`${BASE}/blunders.json`),
    fetchJSON(`${BASE}/patterns.json`),
    fetchJSON(`${BASE}/combos.json`),
    fetchJSON(`${BASE}/endgames.json`),
    fetchJSON(`${BASE}/openings.json`),
    fetchJSON(`${BASE}/evals.json`),
    fetchJSON(`${BASE}/pawns.json`),
    fetchJSON(`${BASE}/defend_check.json`),
    fetchJSON(`${BASE}/ladder.json`),
    fetchJSON(`${BASE}/fork.json`),
  ]).then(([puzzles,pcats,dojo,threats,capture,defend,blunders,patterns,
            combos,endgames,openings,evals,pawns,defendCheck,ladder,fork]) => {
    _cache = {
      PUZZLES: puzzles, PCATS: pcats, DOJO_PIECES: dojo, THREATS: threats,
      CAP_POSITIONS: capture, DEFEND_ATTACKS: defend.attacks, ARMY_PIECES: defend.armyPieces,
      BLUNDERS: blunders, PAT_DATA: patterns, COMBOS: combos, ENDGAMES: endgames,
      OPENINGS: openings, EVALS: evals, PAWNS: pawns.scenarios, PWCATS: pawns.cats,
      DK_CONCEPTS: defendCheck.concepts, DK_SCENARIOS: defendCheck.scenarios,
      LD_MODES: ladder, FT_SCENARIOS: fork,
    };
    _loading = null;
    return _cache;
  });
  return _loading;
}

export async function preloadData() { await getData(); }
export async function getPuzzles()       { return (await getData()).PUZZLES; }
export async function getPcats()         { return (await getData()).PCATS; }
export async function getDojoPieces()    { return (await getData()).DOJO_PIECES; }
export async function getThreats()       { return (await getData()).THREATS; }
export async function getCapPositions()  { return (await getData()).CAP_POSITIONS; }
export async function getDefendAttacks() { return (await getData()).DEFEND_ATTACKS; }
export async function getArmyPieces()    { return (await getData()).ARMY_PIECES; }
export async function getBlunders()      { return (await getData()).BLUNDERS; }
export async function getPatData()       { return (await getData()).PAT_DATA; }
export async function getCombos()        { return (await getData()).COMBOS; }
export async function getEndgames()      { return (await getData()).ENDGAMES; }
export async function getOpenings()      { return (await getData()).OPENINGS; }
export async function getEvals()         { return (await getData()).EVALS; }
export async function getPawns()         { return (await getData()).PAWNS; }
export async function getPwcats()        { return (await getData()).PWCATS; }
export async function getDkConcepts()    { return (await getData()).DK_CONCEPTS; }
export async function getDkScenarios()   { return (await getData()).DK_SCENARIOS; }
export async function getLdModes()       { return (await getData()).LD_MODES; }
export async function getFtScenarios()   { return (await getData()).FT_SCENARIOS; }
