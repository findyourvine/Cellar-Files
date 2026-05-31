/* ============================================================
   THE CELLAR FILES — Active Pursuits world map (v3)
   Exposes window.buildMapSheet(api) -> DOM node.
   api: { goToChar(index) }
   ============================================================ */
window.buildMapSheet = (function () {
  var CH = window.CHARACTERS, REG = window.REGIONS;

  function el(tag, cls) { var e = document.createElement(tag); if (cls) e.className = cls; return e; }
  function proj(lat, lon) { return { x: (lon + 180) / 360 * 100, y: (90 - lat) / 180 * 100 }; }
  function sx(lon) { return lon + 180; }
  function sy(lat) { return 90 - lat; }
  function lastSeen(c) {
    if (!c.dossier) return c.knownFor || "";
    var row = c.dossier.filter(function (r) { return /location/i.test(r.k); })[0];
    return row ? row.v : "";
  }
  function pinColor(c) { return c.faction === "wine" ? "#3f6b3f" : (c.threat ? c.threat.color : "#6E2230"); }

  function graticuleSVG() {
    var lines = "";
    for (var lon = -150; lon <= 150; lon += 30)
      lines += '<line x1="' + sx(lon) + '" y1="0" x2="' + sx(lon) + '" y2="180" />';
    [60, 30, -30, -60].forEach(function (lat) {
      lines += '<line x1="0" y1="' + sy(lat) + '" x2="360" y2="' + sy(lat) + '" />';
    });
    var eq = '<line class="eq" x1="0" y1="90" x2="360" y2="90" />';
    return '<svg class="graticule" viewBox="0 0 360 180" preserveAspectRatio="none">' + lines + eq + "</svg>";
  }

  function routesSVG() {
    var groups = "";
    CH.forEach(function (c) {
      var pts = [];
      if (c.mapKey && REG[c.mapKey]) pts.push(REG[c.mapKey]);
      (c.travel || []).forEach(function (t) {
        var r = REG[(t.name || "").toUpperCase()];
        if (r) pts.push(r);
      });
      // dedupe consecutive
      var clean = pts.filter(function (p, i) { return i === 0 || p !== pts[i - 1]; });
      if (clean.length < 2) { groups += '<g data-route="' + c.id + '" class="route" style="--rc:' + c.accent + '"></g>'; return; }
      var poly = clean.map(function (p) { return sx(p.lon) + "," + sy(p.lat); }).join(" ");
      groups += '<g data-route="' + c.id + '" class="route" style="--rc:' + c.accent + '">' +
        '<polyline points="' + poly + '" vector-effect="non-scaling-stroke" />' + "</g>";
    });
    return '<svg class="routes" viewBox="0 0 360 180" preserveAspectRatio="none">' + groups + "</svg>";
  }

  function compass() {
    return '<div class="compass"><svg viewBox="0 0 64 64">' +
      '<circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.6"/>' +
      '<circle cx="32" cy="32" r="21" fill="none" stroke="currentColor" stroke-width="0.7" stroke-dasharray="1.5 2" opacity="0.5"/>' +
      '<polygon points="32,8 37,32 32,30 27,32" fill="currentColor" opacity="0.85"/>' +
      '<polygon points="32,56 27,32 32,34 37,32" fill="currentColor" opacity="0.35"/>' +
      '<text x="32" y="6" text-anchor="middle" font-family="Oswald,sans-serif" font-size="7" fill="currentColor">N</text>' +
      '</svg></div>';
  }

  function legend() {
    var tiers = [
      { c: "#5B6B3A", t: "Low" }, { c: "#B8902F", t: "Viral" },
      { c: "#C8742E", t: "High" }, { c: "#9c2b32", t: "Extreme" }, { c: "#3f6b3f", t: "W.I.N.E. Agent" }
    ];
    var items = tiers.map(function (x) {
      return '<span class="leg"><span class="leg-dot" style="background:' + x.c + '"></span>' + x.t + "</span>";
    }).join("");
    return '<div class="map-legend"><span class="leg-k">Threat Key</span>' + items + "</div>";
  }

  return function buildMapSheet(api) {
    var sheet = el("div", "sheet map-sheet");
    sheet.style.setProperty("--accent", "#6E2230");
    sheet.style.setProperty("--accent-2", "#B8902F");
    sheet.style.setProperty("--accent-soft", "#caa9a0");
    sheet.appendChild(el("div", "spine"));

    var pad = el("div", "sheet-pad");
    sheet.appendChild(pad);

    var suspects = CH.filter(function (c) { return c.faction !== "wine"; });
    var regionCount = (function () {
      var s = {};
      CH.forEach(function (c) {
        if (c.mapKey) s[c.mapKey] = 1;
        (c.travel || []).forEach(function (t) { s[(t.name || "").toUpperCase()] = 1; });
      });
      return Object.keys(s).length;
    })();

    pad.innerHTML =
      '<div class="map-head">' +
        '<p class="kicker"><span class="dot"></span> W.I.N.E. — GLOBAL OPERATIONS · CLASSIFIED</p>' +
        '<h1 class="cname"><span class="ln1">ACTIVE</span><span class="ln2">PURSUITS</span></h1>' +
        '<p class="map-sub">' + suspects.length + ' suspects tracked across ' + regionCount +
          ' wine regions · 1 agent deployed worldwide</p>' +
        legend() +
      "</div>";

    /* map panel */
    var wrap = el("div", "mapwrap");
    var clip = el("div", "mapclip");
    var mapSlot = Slots.create("world-map", "DROP WORLD MAP", "optional · equirectangular · drag / tap");
    mapSlot.classList.add("map-slot");
    clip.appendChild(mapSlot);
    clip.insertAdjacentHTML("beforeend", graticuleSVG());
    clip.insertAdjacentHTML("beforeend", routesSVG());
    clip.insertAdjacentHTML("beforeend", compass());
    wrap.appendChild(clip);

    function activate(id) {
      wrap.classList.add("focused");
      var g = wrap.querySelector('.route[data-route="' + id + '"]');
      if (g) g.classList.add("on");
      var p = wrap.querySelector('.pin[data-id="' + id + '"]');
      if (p) p.classList.add("active");
    }
    function deactivate() {
      wrap.classList.remove("focused");
      wrap.querySelectorAll(".route.on").forEach(function (x) { x.classList.remove("on"); });
      wrap.querySelectorAll(".pin.active").forEach(function (x) { x.classList.remove("active"); });
    }

    CH.forEach(function (c, i) {
      var reg = c.mapKey && REG[c.mapKey];
      if (!reg) return;
      var p = proj(reg.lat, reg.lon);
      var pin = el("button", "pin" + (c.faction === "wine" ? " agent" : ""));
      pin.setAttribute("data-id", c.id);
      pin.style.left = p.x + "%";
      pin.style.top = p.y + "%";
      pin.style.setProperty("--pc", pinColor(c));
      var threatWord = c.threat ? c.threat.word : "";
      pin.innerHTML =
        '<span class="ring"></span><span class="ping"></span><span class="dot">' + c.monogram + "</span>" +
        '<span class="pin-label">' + c.name.join(" ") + "</span>" +
        '<span class="tip">' +
          '<span class="tip-name">' + c.name.join(" ") + "</span>" +
          '<span class="tip-alias">' + c.alias + "</span>" +
          '<span class="tip-row"><b>' + (c.faction === "wine" ? "Clearance" : "Threat") + ':</b> ' + threatWord + "</span>" +
          '<span class="tip-row"><b>Last seen:</b> ' + lastSeen(c) + "</span>" +
          '<span class="tip-go">Open file →</span>' +
        "</span>";
      pin.onclick = function () { api.goToChar(i); };
      pin.onmouseenter = function () { activate(c.id); };
      pin.onmouseleave = function () { deactivate(); };
      pin.onfocus = function () { activate(c.id); };
      pin.onblur = function () { deactivate(); };
      wrap.appendChild(pin);
    });

    wrap.insertAdjacentHTML("beforeend", "");
    pad.appendChild(wrap);

    /* suspects-at-large grid */
    var blk = el("div", "block");
    blk.innerHTML = '<h2 class="block-h">Suspects at Large <span class="hint">tap to open the file</span></h2>';
    var grid = el("div", "suspect-grid");
    suspects.forEach(function (c) {
      var i = CH.indexOf(c);
      var card = el("button", "scard");
      card.style.setProperty("--accent", c.accent);
      var bounty = (c.dossier || []).filter(function (r) { return /bounty/i.test(r.k); })[0];
      card.innerHTML =
        '<span class="scard-mono">' + c.monogram + "</span>" +
        '<span class="scard-info">' +
          '<span class="scard-name">' + c.name.join(" ") + "</span>" +
          '<span class="scard-alias">' + c.alias + "</span>" +
          '<span class="scard-seen">◍ ' + lastSeen(c) + "</span>" +
        "</span>" +
        '<span class="scard-side">' +
          '<span class="scard-threat" style="--tc:' + (c.threat ? c.threat.color : "#6E2230") + '">' + (c.threat ? c.threat.word : "") + "</span>" +
          (bounty ? '<span class="scard-bounty">' + bounty.v + "</span>" : "") +
        "</span>";
      card.onclick = function () { api.goToChar(i); };
      grid.appendChild(card);
    });
    blk.appendChild(grid);
    pad.appendChild(blk);

    /* footer */
    var f = el("div", "sheet-footer");
    f.innerHTML =
      '<div class="footer-tag">GLOBAL OPS · <b>' + suspects.length + ' ACTIVE PURSUITS</b> · THE CELLAR FILES</div>' +
      '<div class="footer-mid"><div class="barcode"></div><div class="barcode-no">WINE-OPS-MAP-001</div></div>' +
      '<div class="monogram">W</div>';
    pad.appendChild(f);

    return sheet;
  };
})();
