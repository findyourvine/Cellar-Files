/* ============================================================
   THE CELLAR FILES — app: render + interactions
   ============================================================ */
(function () {
  var CH = window.CHARACTERS;
  var stage = document.getElementById("stage");
  var rail = document.getElementById("rail");
  var toast = document.getElementById("toast");
  var idx = 0;
  var sel = {}; // char.id -> {expr:int, pose:int}
  var sealSeq = 0;

  function st(c) {
    if (!sel[c.id]) sel[c.id] = { expr: 0, pose: 0 };
    return sel[c.id];
  }

  /* ---------- decorative seal (circle + text + grapes only) ---------- */
  function wineSeal(topText, botText, accent) {
    var n = ++sealSeq;
    var top = "seal-top-" + n, bot = "seal-bot-" + n;
    var grapes = "";
    var rows = [[40], [33, 47], [27, 40, 53], [33, 47], [40]];
    var cy = 36;
    rows.forEach(function (row, ri) {
      row.forEach(function (cx) {
        grapes += '<circle cx="' + cx + '" cy="' + (cy + ri * 6) + '" r="3.1" fill="' + accent + '" opacity="0.9"/>';
      });
    });
    return (
      '<svg viewBox="0 0 80 80" width="100%" height="100%">' +
        '<defs>' +
          '<path id="' + top + '" d="M 12 40 A 28 28 0 0 1 68 40" fill="none"/>' +
          '<path id="' + bot + '" d="M 14 42 A 26 26 0 0 0 66 42" fill="none"/>' +
        '</defs>' +
        '<circle cx="40" cy="40" r="38" fill="none" stroke="' + accent + '" stroke-width="1.4" opacity="0.55"/>' +
        '<circle cx="40" cy="40" r="33" fill="none" stroke="' + accent + '" stroke-width="0.8" stroke-dasharray="2 2.4" opacity="0.5"/>' +
        grapes +
        '<text font-family="Space Mono, monospace" font-size="8" letter-spacing="2.4" fill="' + accent + '" opacity="0.85">' +
          '<textPath href="#' + top + '" startOffset="50%" text-anchor="middle">' + topText + "</textPath></text>" +
        '<text font-family="Space Mono, monospace" font-size="6" letter-spacing="1.6" fill="' + accent + '" opacity="0.7">' +
          '<textPath href="#' + bot + '" startOffset="50%" text-anchor="middle">' + botText + "</textPath></text>" +
      "</svg>"
    );
  }

  function isLight(hex) {
    var h = hex.replace("#", "");
    var r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) > 165;
  }

  /* ---------- copy hex ---------- */
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () { toast.classList.remove("show"); }, 1400);
  }
  function copyHex(hex, swEl) {
    var done = function () {
      swEl.classList.add("flash");
      setTimeout(function () { swEl.classList.remove("flash"); }, 700);
      showToast("Copied " + hex);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(hex).then(done, done);
    } else {
      var ta = document.createElement("textarea");
      ta.value = hex; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta); done();
    }
  }

  /* ---------- header (shared) ---------- */
  function headerEl(c, featuredPhotoSlotId, photoCaption) {
    var h = document.createElement("div");
    h.className = "sheet-header";

    var sealTop = c.faction === "wine" ? "W · I · N · E" : "THE DECANTED";
    var sealBot = c.faction === "wine" ? "EST · GLOBAL" : "MOST WANTED";
    var seal =
      '<div class="sealcol"><div class="seal">' + wineSeal(sealTop, sealBot, c.accent) +
      '</div><div class="seal-label">' + (c.faction === "wine" ? "W.I.N.E." : "DECANTED") + "</div></div>";

    var caseBar = "";
    if (c.caseTag && c.caseTag.length) {
      var segs = c.caseTag.map(function (sg) {
        var cls = sg.live ? "live" : (sg.reward ? "reward" : "");
        var inner = (sg.live ? '<span class="blink"></span>' : "") + sg.t;
        return '<span class="seg ' + cls + '">' + inner + "</span>";
      }).join('<span class="sep"></span>');
      caseBar = '<div class="casebar">' + segs + "</div>";
    }

    var title =
      '<div class="titleblock">' +
        '<p class="kicker"><span class="dot"></span> THE CELLAR FILES — FIELD FILE ' + c.fileNo + "</p>" +
        '<h1 class="cname"><span class="ln1">' + c.name[0] + '</span><span class="ln2">' + c.name[1] + "</span></h1>" +
        '<span class="alias"><span class="star">&#9733;</span>' + c.alias.toUpperCase() + '<span class="star">&#9733;</span></span>' +
        (c.role ? '<p class="role">' + c.role + "</p>" : "") +
        caseBar +
      "</div>";

    var stampCls = c.status === "AGENT" ? "agent" : "wanted";
    var photo =
      '<div class="photocol"><div class="photo-frame">' +
        '<span class="corner tl"></span><span class="corner tr"></span><span class="corner bl"></span><span class="corner br"></span>' +
        '<span class="stamp ' + stampCls + '">' + c.status + "</span>" +
        '<div class="photo-slot-mount"></div>' +
      '</div><span class="photo-cap">' + (photoCaption || "FILE PHOTO") + "</span></div>";

    h.innerHTML = seal + title + photo;

    var mount = h.querySelector(".photo-slot-mount");
    var slot = Slots.create(featuredPhotoSlotId, photoCaption || "PORTRAIT", "drop / tap");
    mount.replaceWith(slot);
    h._photoSlot = slot;
    return h;
  }

  /* ---------- FULL sheet ---------- */
  function buildFull(c) {
    var s = st(c);
    var sheet = document.createElement("div");
    sheet.className = "sheet";
    sheet.style.setProperty("--accent", c.accent);
    sheet.style.setProperty("--accent-2", c.accent2);
    sheet.style.setProperty("--accent-soft", c.accentSoft);

    var pad = document.createElement("div");
    pad.className = "sheet-pad";

    var exprId = function (i) { return c.id + "__expr__" + c.expressions[i].key; };
    var poseId = function (i) { return c.id + "__pose__" + c.poses[i].key; };

    var header = headerEl(c, exprId(s.expr), c.expressions[s.expr].label.toUpperCase());
    pad.appendChild(header);

    /* main: hero + info */
    var main = document.createElement("div");
    main.className = "sheet-main";

    var heroCol = document.createElement("div");
    heroCol.className = "hero-col";
    var heroStage = document.createElement("div");
    heroStage.className = "hero-stage";
    heroStage.innerHTML = '<div class="hero-ground"></div>';
    var heroSlot = Slots.create(poseId(s.pose), c.poses[s.pose].label.toUpperCase() + " POSE", "full body · drop / tap");
    heroStage.appendChild(heroSlot);
    heroCol.appendChild(heroStage);

    var posebar = document.createElement("div");
    posebar.className = "posebar";
    var prowRef = null; // poses gallery, set later
    function featurePose(i) {
      s.pose = i;
      Slots.bind(heroSlot, poseId(i));
      heroSlot.querySelector(".slot-cap").textContent = c.poses[i].label.toUpperCase() + " POSE";
      posebar.querySelectorAll(".pose-btn").forEach(function (x, j) { x.classList.toggle("active", j === i); });
      if (prowRef) prowRef.querySelectorAll(".poserow").forEach(function (x, j) { x.classList.toggle("active", j === i); });
    }
    c.poses.forEach(function (p, i) {
      var b = document.createElement("button");
      b.className = "pose-btn" + (i === s.pose ? " active" : "");
      b.textContent = p.label;
      b.onclick = function () { featurePose(i); };
      posebar.appendChild(b);
    });
    heroCol.appendChild(posebar);
    main.appendChild(heroCol);

    /* info column */
    var info = document.createElement("div");
    info.className = "info-col";
    var lead = c.bio.charAt(0);
    info.innerHTML =
      '<p class="bio"><span class="lead">' + lead + "</span>" + c.bio.slice(1) + "</p>";

    var ul = document.createElement("ul");
    ul.className = "stats";
    c.stats.forEach(function (stt) {
      var li = document.createElement("li");
      li.className = "stat";
      li.innerHTML =
        '<span class="gm">&#9670;</span><span><span class="k">' + stt.k + '</span>' +
        '<span class="v' + (stt.motto ? " motto" : "") + '">' + stt.v + "</span></span>";
      ul.appendChild(li);
    });
    info.appendChild(ul);

    var acc = document.createElement("div");
    acc.className = "accessory";
    acc.innerHTML =
      '<span class="alabel">Signature Accessory</span>' +
      '<div class="aname">' + c.accessory.name + "</div>" +
      '<p class="adesc">' + c.accessory.desc + "</p>";
    info.appendChild(acc);
    main.appendChild(info);
    pad.appendChild(main);

    /* evidence rubber-stamps over the hero */
    if (c.evidence) {
      c.evidence.slice(0, 2).forEach(function (txt, i) {
        var ev = document.createElement("span");
        ev.className = "evidence-stamp" + (i === 1 ? " r" : "");
        ev.style.setProperty("--ev-col", c.status === "AGENT" ? "#3f6b3f" : "#9c2b32");
        ev.textContent = txt;
        heroStage.appendChild(ev);
      });
    }

    /* investigation layer */
    pad.appendChild(buildDossier(c));
    pad.appendChild(buildCrimes(c));
    pad.appendChild(buildTravel(c));

    /* expressions */
    var exb = block("Expressions", "tap to set the file photo");
    var exrow = document.createElement("div");
    exrow.className = "exprs";
    c.expressions.forEach(function (e, i) {
      var item = document.createElement("div");
      item.className = "expr" + (i === s.expr ? " active" : "");
      var slot = Slots.create(exprId(i), e.label, "drop");
      var lbl = document.createElement("span");
      lbl.className = "elabel";
      lbl.textContent = e.label;
      item.appendChild(slot);
      item.appendChild(lbl);
      lbl.onclick = function (ev) {
        ev.stopPropagation();
        selectExpr(i);
      };
      // clicking the slot image area still opens file picker (handled by slot);
      // but a single tap on a filled expr should also feature it:
      slot.addEventListener("click", function () {
        if (slot.classList.contains("has-img")) selectExpr(i);
      });
      function selectExpr(j) {
        s.expr = j;
        Slots.bind(header._photoSlot, exprId(j));
        header._photoSlot.querySelector(".slot-cap").textContent = c.expressions[j].label.toUpperCase();
        var cap = header.querySelector(".photo-cap");
        if (cap) cap.textContent = c.expressions[j].label.toUpperCase();
        exrow.querySelectorAll(".expr").forEach(function (x, k) { x.classList.toggle("active", k === j); });
      }
      exrow.appendChild(item);
    });
    exb.appendChild(exrow);
    pad.appendChild(exb);

    pad.appendChild(footerEl(c));
    sheet.appendChild(spine());
    sheet.appendChild(pad);
    return sheet;
  }

  /* ---------- STUB sheet ---------- */
  function buildStub(c) {
    var sheet = document.createElement("div");
    sheet.className = "sheet";
    sheet.style.setProperty("--accent", c.accent);
    sheet.style.setProperty("--accent-2", c.accent2);
    sheet.style.setProperty("--accent-soft", c.accentSoft);

    var pad = document.createElement("div");
    pad.className = "sheet-pad";
    pad.appendChild(headerEl(c, c.id + "__photo", "LAST KNOWN IMAGE"));

    var main = document.createElement("div");
    main.className = "stub-main";

    var photo = document.createElement("div");
    photo.className = "stub-photo";
    var slot = Slots.create(c.id + "__photo", "SURVEILLANCE PHOTO", "drop / tap");
    photo.appendChild(slot);
    photo.insertAdjacentHTML("beforeend", '<div class="redact r1"></div><div class="redact r2"></div>');
    photo.insertAdjacentHTML("beforeend", '<div class="classified-band">Classified</div>');
    main.appendChild(photo);

    var prof = document.createElement("div");
    prof.className = "stub-profile";
    prof.innerHTML =
      '<p class="kicker-line">Profile · Unconfirmed</p>' +
      '<p class="lead-desc">' + c.knownFor + "</p>" +
      '<p class="appearance">' + c.appearance + "</p>" +
      '<p class="sig">' + c.signature + "</p>";
    main.appendChild(prof);
    pad.appendChild(main);

    /* investigation layer */
    pad.appendChild(buildDossier(c));
    pad.appendChild(buildCrimes(c));
    pad.appendChild(buildTravel(c));

    var pending = document.createElement("div");
    pending.className = "pending";
    pending.style.marginTop = "26px";
    pending.innerHTML = '<span class="pulse"></span>DOSSIER STATUS: PENDING — full character sheet (portrait, expressions &amp; poses) to be added via the database.';
    pad.appendChild(pending);

    pad.appendChild(footerEl(c));
    sheet.appendChild(spine());
    sheet.appendChild(pad);
    return sheet;
  }

  /* ---------- shared bits ---------- */
  function block(title, hint) {
    var b = document.createElement("div");
    b.className = "block";
    b.innerHTML = '<h2 class="block-h">' + title + (hint ? ' <span class="hint">' + hint + "</span>" : "") + "</h2>";
    return b;
  }
  function spine() {
    var s = document.createElement("div");
    s.className = "spine";
    return s;
  }
  function footerEl(c) {
    var f = document.createElement("div");
    f.className = "sheet-footer";
    f.innerHTML =
      '<div class="footer-tag">FILE ' + c.fileNo + ' · <b>' + (c.faction === "wine" ? "W.I.N.E. AGENT" : "THE DECANTED") + "</b> · THE CELLAR FILES</div>" +
      '<div class="footer-mid"><div class="barcode"></div><div class="barcode-no">WINE-' + c.fileNo.replace(/\D/g, "") + "-" + c.monogram + "</div></div>" +
      '<div class="monogram">' + c.monogram + "</div>";
    return f;
  }

  /* ---------- investigation builders (v2) ---------- */
  function buildDossier(c) {
    var b = block("Field Intelligence", "interpol dossier");
    var grid = document.createElement("div");
    grid.className = "dossier-grid";

    if (c.threat) {
      var pips = "";
      for (var i = 0; i < 5; i++) pips += '<span class="pip' + (i < c.threat.level ? " on" : "") + '"></span>';
      var tcell = document.createElement("div");
      tcell.className = "dcell threat";
      tcell.style.setProperty("--threat-col", c.threat.color);
      tcell.innerHTML =
        '<span class="k">' + c.threat.label + '</span>' +
        '<div class="pips">' + pips + "</div>" +
        '<span class="threat-word">' + c.threat.word + "</span>";
      grid.appendChild(tcell);
    }
    (c.dossier || []).forEach(function (row) {
      var cell = document.createElement("div");
      cell.className = "dcell";
      cell.innerHTML = '<span class="k">' + row.k + '</span><span class="v' + (row.reward ? " reward" : "") + '">' + row.v + "</span>";
      grid.appendChild(cell);
    });
    b.appendChild(grid);
    return b;
  }

  function buildCrimes(c) {
    var data = c.crimes;
    if (!data) return document.createDocumentFragment();
    var b = block(data.title || "Known Crimes", data.hint || "rap sheet");
    var ul = document.createElement("ul");
    ul.className = "crimes";
    data.items.forEach(function (txt, i) {
      var li = document.createElement("li");
      var tag = (data.tag || "EXHIBIT") + (data.closed ? "" : " " + String.fromCharCode(65 + i));
      li.innerHTML = '<span class="ev' + (data.closed ? " closed" : "") + '">' + tag + "</span>" +
                     '<span class="cx">' + txt + "</span>";
      ul.appendChild(li);
    });
    b.appendChild(ul);
    return b;
  }

  function buildTravel(c) {
    if (!c.travel || !c.travel.length) return document.createDocumentFragment();
    var b = block("Travel History", "passport markings");
    var wrap = document.createElement("div");
    wrap.className = "stamps";
    var rots = [-7, 5, -3, 8, -5, 4];
    var inks = ["#6b4a2a", "#7a2b38", "#4e2a5e", "#5b6b3a", "#8a6a2c"];
    c.travel.forEach(function (t, i) {
      var d = document.createElement("div");
      d.className = "tstamp";
      d.style.setProperty("--rot", rots[i % rots.length] + "deg");
      d.innerHTML = travelStampSVG(t.name, t.date, inks[i % inks.length]);
      wrap.appendChild(d);
    });
    b.appendChild(wrap);
    return b;
  }

  function travelStampSVG(name, date, ink) {
    var n = ++sealSeq;
    var top = "tv-top-" + n, bot = "tv-bot-" + n;
    var fs = name.length > 9 ? 7 : (name.length > 6 ? 8.5 : 10);
    return (
      '<svg viewBox="0 0 100 100" width="100%" height="100%">' +
        '<defs>' +
          '<path id="' + top + '" d="M 16 50 A 34 34 0 0 1 84 50" fill="none"/>' +
          '<path id="' + bot + '" d="M 18 52 A 32 32 0 0 0 82 52" fill="none"/>' +
        '</defs>' +
        '<circle cx="50" cy="50" r="46" fill="none" stroke="' + ink + '" stroke-width="2"/>' +
        '<circle cx="50" cy="50" r="39" fill="none" stroke="' + ink + '" stroke-width="1" stroke-dasharray="1.5 2"/>' +
        '<text font-family="Oswald, sans-serif" font-weight="600" font-size="' + fs + '" letter-spacing="1.5" fill="' + ink + '">' +
          '<textPath href="#' + top + '" startOffset="50%" text-anchor="middle">' + name + " · SIGHTED</textPath></text>" +
        '<text font-family="Space Mono, monospace" font-size="7" letter-spacing="2" fill="' + ink + '">' +
          '<textPath href="#' + bot + '" startOffset="50%" text-anchor="middle">W.I.N.E.</textPath></text>' +
        '<text x="50" y="46" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="600" font-size="13" letter-spacing="1" fill="' + ink + '">' + date + "</text>" +
        '<text x="50" y="60" text-anchor="middle" font-family="Space Mono, monospace" font-size="6.5" letter-spacing="2" fill="' + ink + '">ENTRY</text>' +
        '<line x1="22" y1="50" x2="78" y2="50" stroke="' + ink + '" stroke-width="0.8" opacity="0.5"/>' +
      "</svg>"
    );
  }

  /* ---------- render + nav ---------- */
  var view = "dossier";
  function render(dir) {
    var c = CH[idx];
    var sheet = c.full ? buildFull(c) : buildStub(c);
    if (dir) {
      sheet.classList.add("turn-in");
      var cleanup = function () { sheet.classList.remove("turn-in"); };
      sheet.addEventListener("animationend", cleanup, { once: true });
      // fallback: never let the sheet stay trapped in the from-state
      // (CSS animations can be throttled when the tab is backgrounded)
      setTimeout(cleanup, 500);
    }
    stage.innerHTML = "";
    stage.appendChild(sheet);
    updateRail();
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function goTo(i, dir) {
    if (i < 0) i = CH.length - 1;
    if (i >= CH.length) i = 0;
    if (i === idx) return;
    var old = stage.querySelector(".sheet");
    idx = i;
    if (old) {
      old.classList.add("turn-out");
      setTimeout(function () { render(dir || "next"); }, 230);
    } else {
      render(dir || "next");
    }
  }

  function updateRail() {
    rail.innerHTML = "";
    CH.forEach(function (c, i) {
      var chip = document.createElement("button");
      chip.className = "chip" + (i === idx ? " active" : "");
      chip.style.setProperty("--accent", c.accent);
      chip.innerHTML =
        '<span class="cmono">' + c.monogram + "</span>" +
        '<span class="cinfo"><span class="cn">' + c.name.join(" ") + "</span>" +
        '<span class="ct">' + (c.faction === "wine" ? "W.I.N.E. AGENT" : c.alias) + "</span></span>" +
        (c.status === "WANTED" ? '<span class="wantdot"></span>' : "");
      chip.onclick = function () {
        if (view === "map") { idx = i; setView("dossier"); }
        else goTo(i, i > idx ? "next" : "prev");
      };
      rail.appendChild(chip);
    });
    var active = rail.querySelector(".chip.active");
    if (active) rail.scrollTo({ left: active.offsetLeft - rail.clientWidth / 2 + active.offsetWidth / 2, behavior: "smooth" });
  }

  /* ---------- view switching (dossiers <-> operations map) ---------- */
  function renderMap() {
    var m = window.buildMapSheet({ goToChar: function (i) { idx = i; setView("dossier"); } });
    stage.innerHTML = "";
    stage.appendChild(m);
    updateRail();
    window.scrollTo({ top: 0, behavior: "auto" });
  }
  function setView(v) {
    view = v;
    document.body.classList.toggle("map-view", v === "map");
    document.querySelectorAll("#modebar .mode-btn").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-view") === v);
    });
    if (v === "map") renderMap(); else render();
  }
  document.querySelectorAll("#modebar button.mode-btn").forEach(function (b) {
    b.onclick = function () { setView(b.getAttribute("data-view")); };
  });

  /* arrows */
  document.getElementById("prev").onclick = function () { goTo(idx - 1, "prev"); };
  document.getElementById("next").onclick = function () { goTo(idx + 1, "next"); };

  /* keyboard */
  document.addEventListener("keydown", function (e) {
    if (view !== "dossier") return;
    if (e.key === "ArrowLeft") goTo(idx - 1, "prev");
    else if (e.key === "ArrowRight") goTo(idx + 1, "next");
  });

  /* swipe (horizontal on the stage) */
  var sx = 0, sy = 0, tracking = false;
  stage.addEventListener("touchstart", function (e) {
    sx = e.touches[0].clientX; sy = e.touches[0].clientY; tracking = true;
  }, { passive: true });
  stage.addEventListener("touchend", function (e) {
    if (!tracking) return; tracking = false;
    if (view !== "dossier") return;
    var dx = e.changedTouches[0].clientX - sx;
    var dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.6) {
      if (dx < 0) goTo(idx + 1, "next"); else goTo(idx - 1, "prev");
    }
  }, { passive: true });

  if (location.hash === "#map") { setView("map"); }
  else { render(); }
})();
