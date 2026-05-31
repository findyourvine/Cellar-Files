/* ============================================================
   THE CELLAR FILES — Career & progression store
   The RPG spine: XP, ranks, cases solved, regions cleared,
   bottles recovered, achievements. Persists in localStorage.
   The clue engine calls Career.recordWin(); HQ reads Career.state().
   ============================================================ */
window.Career = (function () {
  var KEY = "cellarfiles:career";

  var RANKS = [
    { name: "Cadet",                xp: 0 },
    { name: "Field Agent",          xp: 100 },
    { name: "Investigator",         xp: 280 },
    { name: "Senior Investigator",  xp: 560 },
    { name: "Special Agent",        xp: 1000 },
    { name: "Chief Inspector",      xp: 1700 },
    { name: "Master Detective",     xp: 2800 }
  ];

  var ACHIEVEMENTS = [
    { id: "first-case",  name: "First Cork Popped", desc: "Close your first case.",            icon: "🍾" },
    { id: "no-misfire",  name: "Clean Warrant",     desc: "Arrest without a wrong warrant.",    icon: "📜" },
    { id: "globe",       name: "Frequent Flyer",    desc: "Investigate in 6+ wine regions.",    icon: "✈" },
    { id: "five-cases",  name: "Seasoned Agent",    desc: "Close 5 cases.",                     icon: "🥂" },
    { id: "full-roster", name: "Know Your Enemy",   desc: "Catch all of The Decanted.",         icon: "🎯" }
  ];

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }

  function base() {
    return { xp: 0, casesSolved: 0, caughtIds: [], regions: [], regionLog: {}, bottles: [], achievements: [] };
  }
  function get() {
    var s = load();
    var b = base();
    for (var k in b) if (!(k in s)) s[k] = b[k];
    return s;
  }

  function rankFor(xp) {
    var cur = RANKS[0], next = null;
    for (var i = 0; i < RANKS.length; i++) {
      if (xp >= RANKS[i].xp) { cur = RANKS[i]; next = RANKS[i + 1] || null; }
    }
    var progress = 1, toNext = 0;
    if (next) {
      var span = next.xp - cur.xp;
      progress = Math.max(0, Math.min(1, (xp - cur.xp) / span));
      toNext = next.xp - xp;
    }
    return { rank: cur.name, rankIndex: RANKS.indexOf(cur), next: next ? next.name : null, progress: progress, toNext: toNext };
  }

  function state() {
    var s = get();
    var r = rankFor(s.xp);
    return {
      xp: s.xp, rank: r.rank, rankIndex: r.rankIndex, nextRank: r.next,
      progress: r.progress, xpToNext: r.toNext,
      casesSolved: s.casesSolved, caughtIds: s.caughtIds.slice(),
      regions: s.regions.slice(), regionLog: s.regionLog || {}, bottles: s.bottles.slice(),
      achievements: s.achievements.slice(),
      achievementDefs: ACHIEVEMENTS, ranks: RANKS,
      totalCriminals: 7
    };
  }

  function grant(s, id) { if (ACHIEVEMENTS.some(function (a) { return a.id === id; }) && s.achievements.indexOf(id) < 0) s.achievements.push(id); }

  // result: { caseId, caseTitle, culpritId, regions:[], bottle:{}, cleanWarrant:bool }
  function recordWin(result) {
    var s = get();
    var before = rankFor(s.xp).rankIndex;
    var gained = 120;
    s.xp += gained;
    s.casesSolved += 1;
    if (result.culpritId && s.caughtIds.indexOf(result.culpritId) < 0) s.caughtIds.push(result.culpritId);
    var newRegions = [];
    if (!s.regionLog) s.regionLog = {};
    (result.regions || []).forEach(function (rg) {
      if (s.regions.indexOf(rg) < 0) { s.regions.push(rg); newRegions.push(rg); }
      if (!s.regionLog[rg]) s.regionLog[rg] = { count: 0, firstCase: result.caseTitle || result.caseId || "" };
      s.regionLog[rg].count += 1;
    });
    if (result.bottle && result.bottle.name && s.bottles.indexOf(result.bottle.name) < 0) s.bottles.push(result.bottle.name);

    grant(s, "first-case");
    if (result.cleanWarrant) grant(s, "no-misfire");
    if (s.regions.length >= 6) grant(s, "globe");
    if (s.casesSolved >= 5) grant(s, "five-cases");
    if (s.caughtIds.length >= 7) grant(s, "full-roster");

    save(s);
    var after = rankFor(s.xp).rankIndex;
    return { xpGained: gained, rankedUp: after > before, newRank: RANKS[after].name, newRegions: newRegions };
  }

  function resetAll() { save(base()); }

  return { state: state, recordWin: recordWin, resetAll: resetAll, RANKS: RANKS, ACHIEVEMENTS: ACHIEVEMENTS };
})();
