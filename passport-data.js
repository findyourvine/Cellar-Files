/* ============================================================
   THE CELLAR FILES — Passport region metadata
   Master list of every wine region in the world chart, grouped
   by continent. "Discovered" status comes from career.js
   (regions actually visited via solved cases). Locked until then.
   ============================================================ */
window.REGION_META = {
  /* North America */
  NAPA:          { name: "Napa Valley",    country: "USA",          cat: "North America", fact: "California's most famous wine county — Cabernet Sauvignon is king here." },
  SONOMA:        { name: "Sonoma",         country: "USA",          cat: "North America", fact: "Larger and more varied than neighbouring Napa, from coast to mountain." },
  WILLAMETTE:    { name: "Willamette",     country: "USA",          cat: "North America", fact: "Oregon's cool-climate home of world-class Pinot Noir." },
  "FINGER LAKES":{ name: "Finger Lakes",   country: "USA",          cat: "North America", fact: "New York's glacial lakes make some of America's finest Riesling." },
  "TRAVERSE CITY":{name: "Traverse City",  country: "USA",          cat: "North America", fact: "Michigan's cherry country moonlights as a cool-climate wine spot." },

  /* Europe */
  BORDEAUX:      { name: "Bordeaux",       country: "France",       cat: "Europe", fact: "The benchmark for age-worthy red blends, split by the Gironde estuary." },
  BURGUNDY:      { name: "Burgundy",       country: "France",       cat: "Europe", fact: "Pinot Noir and Chardonnay's spiritual home — terroir obsessives welcome." },
  CHAMPAGNE:     { name: "Champagne",      country: "France",       cat: "Europe", fact: "Only sparkling wine from here may legally be called Champagne." },
  EPERNAY:       { name: "Épernay",        country: "France",       cat: "Europe", fact: "The 'capital of Champagne' sits atop kilometres of chalk cellars." },
  RHONE:         { name: "Rhône Valley",   country: "France",       cat: "Europe", fact: "Syrah in the north, Grenache blends in the sun-baked south." },
  LOIRE:         { name: "Loire Valley",   country: "France",       cat: "Europe", fact: "A river of châteaux famed for crisp whites and elegant crémant." },
  PROVENCE:      { name: "Provence",       country: "France",       cat: "Europe", fact: "The world's rosé heartland — pale, dry and endlessly imitated." },
  TUSCANY:       { name: "Tuscany",        country: "Italy",        cat: "Europe", fact: "Rolling Sangiovese hills behind Chianti and the 'Super Tuscans'." },
  PIEDMONT:      { name: "Piedmont",       country: "Italy",        cat: "Europe", fact: "Nebbiolo's home — Barolo and Barbaresco, the 'king and queen'." },
  RIOJA:         { name: "Rioja",          country: "Spain",        cat: "Europe", fact: "Spain's most famous region, defined by oak-aged Tempranillo." },
  DOURO:         { name: "Douro Valley",   country: "Portugal",     cat: "Europe", fact: "Terraced cliffs along the Douro gave the world Port." },
  MOSEL:         { name: "Mosel",          country: "Germany",      cat: "Europe", fact: "Impossibly steep slate slopes yield featherlight Riesling." },
  GENEVA:        { name: "Geneva",         country: "Switzerland",  cat: "Europe", fact: "W.I.N.E. global headquarters — and quiet Lake Geneva vineyards." },

  /* South America */
  MENDOZA:       { name: "Mendoza",        country: "Argentina",    cat: "South America", fact: "High-altitude desert vineyards under the Andes — Malbec country." },
  CAFAYATE:      { name: "Cafayate",       country: "Argentina",    cat: "South America", fact: "Some of the world's highest vineyards, famed for floral Torrontés." },
  PATAGONIA:     { name: "Patagonia",      country: "Argentina",    cat: "South America", fact: "Windswept southern frontier producing elegant cool-climate reds." },

  /* Oceania */
  BAROSSA:       { name: "Barossa Valley", country: "Australia",    cat: "Oceania", fact: "Home to some of the oldest Shiraz vines on Earth." },
  MARLBOROUGH:   { name: "Marlborough",    country: "New Zealand",  cat: "Oceania", fact: "Put NZ on the map with its piercing Sauvignon Blanc." },

  /* Africa */
  STELLENBOSCH:  { name: "Stellenbosch",   country: "South Africa", cat: "Africa", fact: "The Cape's oak-lined heart of South African wine." }
};

window.REGION_CATEGORIES = ["North America", "Europe", "South America", "Oceania", "Africa"];

/* country name -> flag asset slug (assets/flags/<slug>.png) */
window.COUNTRY_FLAGS = {
  "USA": "usa", "France": "france", "Spain": "spain", "Germany": "germany",
  "Italy": "italy", "Portugal": "portugal", "Switzerland": "switzerland",
  "Argentina": "argentina", "Australia": "australia",
  "New Zealand": "new-zealand", "South Africa": "south-africa"
};
window.flagFor = function (country) {
  var f = window.COUNTRY_FLAGS[country];
  return f ? "assets/flags/" + f + ".png" : null;
};
