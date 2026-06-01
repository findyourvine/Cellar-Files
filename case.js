/* ============================================================
   THE CELLAR FILES — Case engine
   State machine: briefing → investigate → travel → tracker → result
   Reuses window.CHARACTERS (cast), REGIONS (geo), Slots (art),
   window.TRAITS + window.CASES (gameplay).
   ============================================================ */
(function () {
  var CH = window.CHARACTERS, REG = window.REGIONS, TR = window.TRAITS;
  var CASE = window.CASES[0];
  var screen = document.getElementById("screen");
  var reveal = document.getElementById("revealwrap");
  var confirmW = document.getElementById("confirmwrap");
  var flyover = document.getElementById("flyover");
  var toastEl = document.getElementById("gtoast");

  var suspects = CH.filter(function (c) { return c.faction !== "wine"; });
  var chief = CH.filter(function (c) { return c.faction === "wine"; })[0];
  function byId(id) { return CH.filter(function (c) { return c.id === id; })[0]; }
  function firstExpr(c) { return c.expressions ? c.id + "__expr__" + c.expressions[0].key : c.id + "__photo"; }

  /* ---------- state ---------- */
  var S;
  function reset() {
    S = { view: "briefing", leg: 0, trail: 100, known: {}, warrant: null,
          leadsDone: {}, destFound: false, warrantFilings: 0 };
  }
  reset();

  /* ---------- helpers ---------- */
  function el(t, c) { var e = document.createElement(t); if (c) e.className = c; return e; }
  function proj(r) { return { x: (r.lon + 180) / 360 * 100, y: (90 - r.lat) / 180 * 100 }; }
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(function () { toastEl.classList.remove("show"); }, 1700);
  }
  function bindPhoto(node, id) { var s = Slots.create(id, "", ""); node.appendChild(s); return s; }

  /* candidates still standing given known traits */
  function candidates() {
    return suspects.filter(function (c) {
      return Object.keys(S.known).every(function (cat) {
        return TR[cat].values[c.id] === S.known[cat];
      });
    });
  }
  function isCleared(c) {
    return Object.keys(S.known).some(function (cat) {
      return TR[cat].values[c.id] !== S.known[cat];
    });
  }

  function minimapSVG() {
    var lines = "";
    for (var lon = -120; lon <= 120; lon += 60) lines += '<line x1="' + ((lon + 180) / 360 * 100) + '%" y1="0" x2="' + ((lon + 180) / 360 * 100) + '%" y2="100%"/>';
    [40, 0, -40].forEach(function (lat) { lines += '<line x1="0" y1="' + ((90 - lat) / 180 * 100) + '%" x2="100%" y2="' + ((90 - lat) / 180 * 100) + '%"/>'; });
    return '<svg class="grat" preserveAspectRatio="none">' + lines + "</svg>";
  }
  function pin(region, cls) {
    var r = REG[region]; if (!r) return "";
    var p = proj(r);
    return '<div class="mpin ' + (cls || "") + '" style="left:' + p.x + '%;top:' + p.y + '%"><span class="png"></span><span class="d"></span></div>';
  }

  var ic = {
    witness: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
    evidence: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3h6l1 4H8z"/><path d="M7 7h10l1 13H6z"/></svg>',
    flavor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>'
  };
  function leadIcon(role) {
    if (/witness/i.test(role)) return ic.witness;
    if (/evidence/i.test(role)) return ic.evidence;
    return ic.flavor;
  }

  /* ====================================================
     SCREENS
  ==================================================== */
  function go(view) { S.view = view; render(); }

  function render() {
    if (S.view === "briefing") return renderBriefing();
    if (S.view === "investigate") return renderInvestigate();
    if (S.view === "travel") return renderTravel();
    if (S.view === "tracker") return renderTracker();
    if (S.view === "result") return renderResult();
  }

  /* ---------- HUD ---------- */
  function hud() {
    var h = el("div", "hud");
    var cls = S.trail > 60 ? "" : (S.trail > 30 ? "warm" : "cold");
    var w = "";
    if (S.warrant) {
      var c = byId(S.warrant);
      w = '<div class="warrant-chip"><span class="wm">' + c.monogram + '</span><span class="wt">Warrant<br>' + c.name.join(" ") + "</span></div>";
    }
    h.innerHTML =
      '<div><div class="case-no">' + CASE.codename + '</div><div class="case-ttl">' + CASE.title + "</div></div>" +
      '<div class="grow"></div>' + w +
      '<div class="trail ' + cls + '"><span class="tl-k">Trail Heat</span><div class="bar"><i style="width:' + S.trail + '%"></i></div></div>';
    return h;
  }

  /* ---------- Briefing ---------- */
  function renderBriefing() {
    var v = el("div", "view");
    var hero = el("div", "brief-hero");
    hero.innerHTML =
      '<span class="stamp new-stamp">New Case</span>' +
      '<div class="kick"><span class="dot"></span> ' + CASE.codename + ' · Classified</div>' +
      '<h1 class="huge">' + CASE.title + "</h1>";
    v.appendChild(hero);

    var pad = el("div", "pad");

    var bc = el("div", "bottle-card");
    var slotMount = el("div");
    bc.appendChild(slotMount);
    bc.insertAdjacentHTML("beforeend",
      '<div><div class="bc-k">Stolen · ' + CASE.scene.place + '</div>' +
      '<div class="bc-n">' + CASE.bottle.name + "</div>" +
      '<div class="bc-d">' + CASE.bottle.desc + "</div>" +
      '<div class="bc-val">' + CASE.reward + ' · recovery bounty</div></div>');
    pad.appendChild(bc);
    var bottleSlot = Slots.create(CASE.bottle.slotId, "BOTTLE", "drop");
    bottleSlot.className = "gslot";
    slotMount.replaceWith(bottleSlot);

    var chiefRow = el("div", "chief");
    var chPhoto = el("div", "ch-photo");
    var chSlot = Slots.create(firstExpr(chief), "", "");
    chSlot.className = "gslot"; chSlot.style.borderRadius = "50%";
    chPhoto.appendChild(chSlot);
    chiefRow.appendChild(chPhoto);
    chiefRow.insertAdjacentHTML("beforeend",
      '<div><div class="ch-name">' + chief.name.join(" ") + '</div>' +
      '<div class="ch-role">Chief of W.I.N.E. · briefing</div></div>');
    pad.appendChild(chiefRow);

    pad.insertAdjacentHTML("beforeend",
      '<p class="brief-text"><span class="lead">“</span>' + CASE.brief + '”</p>');

    var btn = el("button", "btn gold");
    btn.textContent = "Accept the Case ›";
    btn.style.marginTop = "22px";
    btn.onclick = function () { go("investigate"); };
    pad.appendChild(btn);

    var backLink = el("a", "btn ghost");
    backLink.textContent = "‹ Character Bible";
    backLink.href = "character-bible.html";
    backLink.style.cssText = "text-decoration:none;display:flex;align-items:center;justify-content:center;margin-top:10px;";
    pad.appendChild(backLink);

    v.appendChild(pad);
    swap(v);
  }

  /* ---------- Investigation ---------- */
  function renderInvestigate() {
    var leg = CASE.legs[S.leg];
    var v = el("div", "view");
    v.appendChild(hud());

    var head = el("div", "loc-head");
    head.innerHTML =
      '<div class="kick"><span class="dot"></span> Stop ' + (S.leg + 1) + ' of ' + CASE.legs.length + ' · Investigating</div>' +
      '<div class="loc-name">' + leg.region + "</div>" +
      '<div class="loc-sub">' + leg.place + " · " + leg.country + "</div>" +
      '<div class="minimap">' + minimapSVG() + pin(leg.region) +
        '<img class="region-img" src="assets/maps/region-' + leg.region + '.png" alt="" onerror="this.remove()"/>' +
        (window.flagFor && window.flagFor(leg.country) ? '<img class="loc-flag" src="' + window.flagFor(leg.country) + '" alt=""/>' : "") +
      "</div>";
    v.appendChild(head);

    var pad = el("div", "pad");

    if (leg.final) {
      pad.insertAdjacentHTML("beforeend", '<div class="section-h">Final Approach <span class="hint">the trail ends here</span></div>');
      var L = leg.leads[0];
      pad.insertAdjacentHTML("beforeend",
        '<div class="lead done" style="cursor:default"><div class="l-ic">' + ic.evidence + '</div>' +
        '<div><div class="l-role">' + L.role + '</div><div class="l-title">' + L.title + '</div>' +
        '<div style="font-size:13.5px;line-height:1.5;color:var(--ink-soft);margin-top:7px">' + L.text + "</div></div></div>");
      v.appendChild(pad);

      var bar = el("div", "actionbar");
      var track = el("button", "btn ghost"); track.textContent = "Suspect Tracker";
      track.onclick = function () { go("tracker"); };
      var cap = el("button", "btn");
      cap.textContent = S.warrant ? "Make the Arrest ★" : "Warrant Required";
      cap.disabled = !S.warrant;
      cap.onclick = function () { attemptCapture(); };
      bar.appendChild(track); bar.appendChild(cap);
      v.appendChild(bar);
      swap(v);
      return;
    }

    pad.insertAdjacentHTML("beforeend", '<div class="section-h">Leads <span class="hint">tap to investigate</span></div>');
    leg.leads.forEach(function (L, i) {
      var key = S.leg + ":" + i;
      var done = !!S.leadsDone[key];
      var b = el("button", "lead" + (done ? " done" : ""));
      b.innerHTML =
        '<div class="l-ic">' + leadIcon(L.role) + "</div>" +
        '<div><div class="l-role">' + (done ? "Logged" : L.role) + '</div><div class="l-title">' + L.title + "</div></div>" +
        '<span class="l-arrow">' + (done ? "✓" : "›") + "</span>";
      b.onclick = function () { openLead(L, key); };
      pad.appendChild(b);
    });
    v.appendChild(pad);

    var bar2 = el("div", "actionbar");
    var track2 = el("button", "btn ghost"); track2.textContent = "Suspect Tracker";
    track2.onclick = function () { go("tracker"); };
    var travel = el("button", "btn");
    travel.textContent = S.destFound ? "Follow the Trail ›" : "Find the Trail First";
    travel.disabled = !S.destFound;
    travel.onclick = function () { go("travel"); };
    bar2.appendChild(track2); bar2.appendChild(travel);
    v.appendChild(bar2);

    swap(v);
  }

  function openLead(L, key) {
    var firstTime = !S.leadsDone[key];
    S.leadsDone[key] = true;
    var logHtml = "";
    if (L.clue && firstTime) {
      S.known[L.clue.cat] = L.clue.val;
    }
    if (L.clue) {
      logHtml =
        '<div class="r-log"><span class="rl-stamp"><span class="stamp gold">Clue Logged</span></span>' +
        '<div><div class="rl-k">' + TR[L.clue.cat].label + '</div><div class="rl-v">' + L.clue.val + "</div></div></div>";
    } else if (L.dest && firstTime) {
      S.destFound = true;
    }
    if (L.dest) {
      logHtml =
        '<div class="r-log"><span class="rl-stamp"><span class="stamp">Trail</span></span>' +
        '<div><div class="rl-k">Destination clue secured</div><div class="rl-v" style="font-size:13px;font-family:var(--font-body);font-weight:400;text-transform:none;font-style:italic">Open “Follow the Trail”.</div></div></div>';
    }
    reveal.innerHTML =
      '<div class="reveal"><div class="r-role">' + L.role + '</div><div class="r-title">' + L.title + "</div>" +
      '<div class="r-text">' + L.text + "</div>" + logHtml +
      '<button class="btn" id="reveal-close">Got it</button></div>';
    reveal.classList.add("show");
    document.getElementById("reveal-close").onclick = function () {
      reveal.classList.remove("show");
      if (L.clue && firstTime) {
        var left = candidates().length;
        toast(left > 1 ? "Tracker narrowed to " + left + " suspects" : "Only one suspect remains!");
      }
      render();
    };
  }

  /* ---------- Travel ---------- */
  function renderTravel() {
    var leg = CASE.legs[S.leg];
    var v = el("div", "view");
    v.appendChild(hud());

    var head = el("div", "travel-head");
    head.innerHTML =
      '<img class="travel-banner" src="assets/maps/travel-banner.png" alt="" onerror="this.remove()"/>' +
      '<div class="kick"><span class="dot"></span> Follow the Trail</div>' +
      '<h1 class="huge" style="font-size:30px">Where next?</h1>' +
      '<div class="dest-clue"><div class="dc-k">Destination Clue</div><div class="dc-t">' + leg.dest.clue + '</div></div>';
    v.appendChild(head);

    var pad = el("div", "pad");
    pad.insertAdjacentHTML("beforeend", '<div class="section-h">Choose a destination <span class="hint">a wrong call costs heat</span></div>');
    // shuffle options deterministically per leg
    leg.dest.options.forEach(function (rk) {
      var r = REG[rk];
      var o = el("button", "opt");
      var flagSrc = window.flagFor && r ? window.flagFor(r.country) : null;
      o.innerHTML =
        '<div class="o-map">' + (flagSrc ? '<img class="o-flag" src="' + flagSrc + '" alt=""/>' : minimapSVG() + pin(rk)) + "</div>" +
        '<div><div class="o-name">' + rk + '</div><div class="o-country">' + (r ? r.country : "") + "</div></div>" +
        '<span class="o-arrow">›</span>';
      o.onclick = function () { chooseDest(rk, leg); };
      pad.appendChild(o);
    });
    v.appendChild(pad);

    var bar = el("div", "actionbar");
    var back = el("button", "btn ghost"); back.textContent = "‹ Keep Investigating";
    back.onclick = function () { go("investigate"); };
    bar.appendChild(back);
    v.appendChild(bar);

    swap(v);
  }

  function chooseDest(rk, leg) {
    if (rk !== leg.dest.correct) {
      S.trail = Math.max(0, S.trail - 25);
      if (S.trail <= 0) { S.lossReason = "cold"; go("result"); return; }
      toast("Cold trail — she was never in " + rk + ". (−25 heat)");
      render();
      return;
    }
    // correct: fly to next leg
    playFlyover(leg.region, leg.dest.correct, function () {
      S.leg += 1;
      S.destFound = false;
      go("investigate");
    });
  }

  function playFlyover(fromR, toR, done) {
    var a = REG[fromR], b = REG[toR];
    var pa = proj(a), pb = proj(b);
    var mx = (pa.x + pb.x) / 2, my = Math.min(pa.y, pb.y) - 14;
    var path = "M " + pa.x + " " + pa.y + " Q " + mx + " " + my + " " + pb.x + " " + pb.y;
    flyover.innerHTML =
      '<div class="fly-k">In Transit</div>' +
      '<div class="fly-map">' +
        '<img class="fly-region" src="assets/maps/region-' + toR + '.png" alt="" ' +
        'onerror="this.onerror=null;this.src=\'assets/maps/travel-banner.png\'"/>' +
      "</div>" +
      '<div><div class="fly-k">Now arriving</div><div class="fly-to">' + toR + "</div></div>";
    flyover.classList.add("show");
    setTimeout(function () { flyover.classList.remove("show"); done(); }, 1750);
  }

  /* ---------- Suspect Tracker ---------- */
  function renderTracker() {
    var v = el("div", "view");
    v.appendChild(hud());

    var head = el("div", "tracker-head");
    var cands = candidates();
    head.innerHTML =
      '<div class="kick"><span class="dot"></span> Suspect Tracker · The Decanted</div>' +
      '<h1 class="huge" style="font-size:28px">' + cands.length + ' still standing</h1>' +
      '<div style="font-family:var(--font-body);font-style:italic;color:var(--ink-soft);font-size:13.5px;margin-top:6px">' +
        'Each clue clears anyone it doesn\'t fit. When one name remains, issue the warrant.</div>';
    // known traits row
    var known = '<div class="known">';
    Object.keys(TR).forEach(function (cat) {
      if (S.known[cat]) known += '<div class="kchip"><span class="kc-k">' + TR[cat].label + '</span><span class="kc-v">' + S.known[cat] + "</span></div>";
      else known += '<div class="kchip empty"><span class="kc-k">' + TR[cat].label + '</span><span class="kc-v">— ?</span></div>';
    });
    known += "</div>";
    head.insertAdjacentHTML("beforeend", known);
    v.appendChild(head);

    var pad = el("div", "pad");
    var grid = el("div", "suspects");
    suspects.forEach(function (c) {
      var cleared = isCleared(c);
      var prime = !cleared && cands.length === 1;
      var card = el("button", "suspect" + (cleared ? " cleared" : "") + (prime ? " prime" : ""));
      var photo = el("div", "s-photo");
      var slot = Slots.create(firstExpr(c), "", "");
      slot.className = "gslot"; slot.style.border = "none"; slot.style.borderRadius = "0";
      // monogram fallback under the slot
      var mono = el("div", "s-mono"); mono.style.setProperty("--sc", c.accent); mono.textContent = c.monogram;
      photo.appendChild(mono); photo.appendChild(slot);
      photo.insertAdjacentHTML("beforeend", '<span class="clear-stamp">Cleared</span>' +
        '<span class="s-threat" style="background:' + (c.threat ? c.threat.color : "#6E2230") + '">' + (c.threat ? c.threat.word : "") + "</span>");
      card.appendChild(photo);
      card.insertAdjacentHTML("beforeend",
        '<div class="s-name">' + c.name.join(" ") + '</div><div class="s-alias">' + c.alias + "</div>");
      card.onclick = function () { openConfirm(c, cleared); };
      grid.appendChild(card);
    });
    pad.appendChild(grid);
    v.appendChild(pad);

    var bar = el("div", "actionbar");
    var back = el("button", "btn ghost"); back.textContent = "‹ Back to the Chase";
    back.onclick = function () { go("investigate"); };
    bar.appendChild(back);
    v.appendChild(bar);

    swap(v);
  }

  function openConfirm(c, cleared) {
    var photoSlot;
    confirmW.innerHTML =
      '<div class="confirm"><div class="c-photo" id="c-photo-mount"></div>' +
      '<div class="c-q">Issue an international warrant for<b>' + c.name.join(" ") + "</b></div>" +
      '<div class="c-warn">' + (cleared
        ? "⚠ This suspect has been cleared by your evidence. A false warrant ends the case."
        : "Once filed, you'll chase only this suspect. Be certain.") + "</div>" +
      '<div class="c-btns"><button class="btn ghost" id="c-cancel">Cancel</button>' +
      '<button class="btn" id="c-go">File Warrant</button></div></div>';
    confirmW.classList.add("show");
    var mount = document.getElementById("c-photo-mount");
    var slot = Slots.create(firstExpr(c), "", ""); slot.className = "gslot"; slot.style.borderRadius = "50%";
    var mono = el("div", "s-mono"); mono.style.setProperty("--sc", c.accent); mono.textContent = c.monogram; mono.style.fontSize = "34px";
    mount.appendChild(mono); mount.appendChild(slot);
    document.getElementById("c-cancel").onclick = function () { confirmW.classList.remove("show"); };
    document.getElementById("c-go").onclick = function () {
      S.warrant = c.id; S.warrantFilings = (S.warrantFilings || 0) + 1; confirmW.classList.remove("show");
      toast("Warrant filed for " + c.name.join(" "));
      go("investigate");
    };
  }

  /* ---------- capture + result ---------- */
  function attemptCapture() {
    if (!S.warrant) { toast("File a warrant in the Tracker first."); return; }
    S.win = (S.warrant === CASE.culprit);
    if (!S.win) S.lossReason = "wrong";
    if (S.win && window.Career && !S.recorded) {
      S.recorded = true;
      S.award = Career.recordWin({
        caseId: CASE.id, caseTitle: CASE.title, culpritId: CASE.culprit,
        regions: CASE.legs.map(function (l) { return l.region; }),
        bottle: CASE.bottle,
        cleanWarrant: (S.warrantFilings || 0) <= 1 && S.trail === 100
      });
      if (S.award.newRegions && S.award.newRegions.length) {
        try { localStorage.setItem("cellarfiles:newstamps", JSON.stringify(S.award.newRegions)); } catch (e) {}
      }
    }
    go("result");
  }

  function renderResult() {
    var v = el("div", "view");
    var culprit = byId(CASE.culprit);
    var res = el("div", "result " + (S.win ? "win" : "lose"));

    if (S.win) {
      res.innerHTML =
        '<span class="stamp gold r-stamp">Case Closed</span>' +
        '<div class="r-portrait" id="res-photo"></div>' +
        '<h1 class="r-h">Caught!</h1>' +
        '<p class="r-sub"><b>' + culprit.name.join(" ") + "</b> — “" + culprit.alias + "” — is in custody, and " +
          CASE.bottle.name + " is on its way home.</p>" +
        '<div class="r-reward"><span>Recovery Bounty</span>' + CASE.reward + "</div>";
      v.appendChild(res);
      if (S.award) {
        var xpLine = document.createElement("div");
        xpLine.className = "xp-line";
        xpLine.innerHTML = '<span class="xpg">+' + S.award.xpGained + ' XP</span>' +
          (S.award.rankedUp ? '<span class="rankup">Promoted → ' + S.award.newRank + '</span>' : '');
        res.insertBefore(xpLine, res.querySelector(".r-reward"));
        if (S.award.newRegions && S.award.newRegions.length) {
          var META = window.REGION_META || {};
          var names = S.award.newRegions.map(function (r) { return (META[r] && META[r].name) || r; });
          var st = document.createElement("div");
          st.className = "stamped-line";
          st.innerHTML = '<span class="sl-k">◉ Passport stamped</span><span class="sl-v">' + names.join(" · ") + '</span>';
          res.insertBefore(st, res.querySelector(".r-reward"));
        }
      }
    } else {
      var msg, sub;
      if (S.lossReason === "wrong") {
        var wrong = byId(S.warrant);
        msg = "Wrong Suspect";
        sub = "You filed a warrant for " + wrong.name.join(" ") + ", and the real thief — " + culprit.name.join(" ") +
              " — slipped away with " + CASE.bottle.name + ".";
      } else {
        msg = "Trail Went Cold";
        sub = "Too many wrong turns. " + culprit.name.join(" ") + " vanished, bottle and all. The trail is dead.";
      }
      res.innerHTML =
        '<span class="stamp r-stamp">Case Failed</span>' +
        '<div class="r-portrait" id="res-photo"></div>' +
        '<h1 class="r-h">' + msg + "</h1>" +
        '<p class="r-sub">' + sub + "</p>";
      v.appendChild(res);
    }

    var btn = el("button", "btn gold");
    btn.textContent = S.win ? "Next Case ↻" : "Reopen the Case ↻";
    btn.style.marginTop = "8px";
    btn.onclick = function () { reset(); go("briefing"); };
    res.appendChild(btn);

    var hq = el("a", "btn ghost");
    hq.textContent = "‹ W.I.N.E. Headquarters";
    hq.href = "index.html";
    hq.style.cssText = "text-decoration:none;display:flex;align-items:center;justify-content:center;margin-top:10px;color:rgba(246,238,218,.8);border-color:rgba(246,238,218,.3);";
    res.appendChild(hq);
    if (S.win && S.award && S.award.newRegions && S.award.newRegions.length) {
      var pp = el("a", "btn ghost");
      pp.textContent = "◉ View Passport Stamps";
      pp.href = "passport.html";
      pp.style.cssText = "text-decoration:none;display:flex;align-items:center;justify-content:center;margin-top:10px;color:var(--gold-soft);border-color:rgba(216,188,115,.4);";
      res.appendChild(pp);
    }

    swap(v);
    // mount portrait + confetti AFTER the view is in the DOM
    mountResPhoto(culprit);
    if (S.win) launchConfetti(res);
  }
  function mountResPhoto(c) {
    var mount = document.getElementById("res-photo");
    var slot = Slots.create(firstExpr(c), "", ""); slot.className = "gslot"; slot.style.borderRadius = "50%";
    var mono = el("div", "s-mono"); mono.style.setProperty("--sc", c.accent); mono.textContent = c.monogram; mono.style.fontSize = "44px";
    mount.appendChild(mono); mount.appendChild(slot);
  }
  function launchConfetti(host) {
    var cols = ["#D8BC73", "#B8902F", "#F6EEDA", "#6E2230", "#E7D196"];
    for (var i = 0; i < 36; i++) {
      var c = el("span", "confetti");
      c.style.left = Math.random() * 100 + "%";
      c.style.background = cols[i % cols.length];
      c.style.animationDuration = (1.6 + Math.random() * 1.6) + "s";
      c.style.animationDelay = (Math.random() * 0.5) + "s";
      c.style.transform = "rotate(" + (Math.random() * 360) + "deg)";
      host.appendChild(c);
    }
  }

  /* ---------- view swap ---------- */
  function swap(v) {
    screen.innerHTML = "";
    screen.appendChild(v);
    screen.scrollTop = 0;
  }

  render();
})();
