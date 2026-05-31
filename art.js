/* ============================================================
   THE CELLAR FILES — Art manifest & auto-loader bridge
   ------------------------------------------------------------
   Maps every image slot id to a default PNG path under
   assets/. slots.js probes each path; if the PNG exists it
   loads automatically as permanent default art, otherwise a
   polished placeholder stays. Drop files in (matching the
   names below) and they appear everywhere — database, suspect
   cards, briefing, arrest screen, dossiers, HQ.
   Load AFTER data.js, BEFORE slots.js usage (app.js / case.js).
   ============================================================ */

/* character id (data.js)  ->  folder/file slug (asset convention) */
window.ART_SLUGS = {
  cork: "cork",
  malbec: "malbec-mike",
  champagne: "champagne",
  renee: "rose-renee",
  jack: "cabernet-jack",
  corkfather: "corkfather",
  decanter: "decanter",
  pinot: "pinot-noir"
};

window.ART_BASE = "assets/characters/";
window.ART_MANIFEST = {};

(function () {
  var CH = window.CHARACTERS || [];
  CH.forEach(function (c) {
    var slug = window.ART_SLUGS[c.id] || c.id;
    (c.expressions || []).forEach(function (e) {
      window.ART_MANIFEST[c.id + "__expr__" + e.key] =
        window.ART_BASE + slug + "/expressions/" + slug + "-expr-" + e.key + ".png";
    });
    (c.poses || []).forEach(function (p) {
      window.ART_MANIFEST[c.id + "__pose__" + p.key] =
        window.ART_BASE + slug + "/poses/" + slug + "-pose-" + p.key + ".png";
    });
  });
  // shared props
  window.ART_MANIFEST["world-map"] = "assets/maps/world-map.png";
  window.ART_MANIFEST["case-comet-bottle"] = "assets/props/stolen-bottle.png";
})();

/* ------------------------------------------------------------
   Richer, typed-style manifest (runtime mirror of the .ts the
   dev handoff ships). Useful for HQ / database screens that
   want display name, role, status, palette in one place.
------------------------------------------------------------ */
window.characterAssets = (function () {
  var CH = window.CHARACTERS || [];
  function statusOf(c) {
    if (c.faction === "wine") return "ACTIVE_AGENT";
    return c.status === "WANTED" ? "WANTED" : "AT_LARGE";
  }
  return CH.map(function (c) {
    var slug = window.ART_SLUGS[c.id] || c.id;
    return {
      slug: slug,
      id: c.id,
      displayName: c.name.join(" "),
      role: c.alias || c.role || "",
      status: statusOf(c),
      dossierId: c.fileNo || "",
      primaryColor: c.accent,
      secondaryColor: c.accent2 || c.accent,
      accentColor: (c.palette && c.palette[0] && c.palette[0].hex) || c.accent,
      expressions: (c.expressions || []).map(function (e) {
        return { key: e.key, label: e.label, src: window.ART_MANIFEST[c.id + "__expr__" + e.key] };
      }),
      poses: (c.poses || []).map(function (p) {
        return { key: p.key, label: p.label, src: window.ART_MANIFEST[c.id + "__pose__" + p.key] };
      })
    };
  });
})();
