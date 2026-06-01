/* ============================================================
   THE CELLAR FILES — Case engine data (campaign)
   ------------------------------------------------------------
   TRAITS : the deduction matrix. Each suspect (the 7 Decanted)
            has one value per category. Logging the culprit's
            value clears anyone who doesn't share it.
   CASES  : the campaign, played in order. Each case follows the
            culprit's travel trail; each leg yields one clue.
   Add a new case by appending another object to window.CASES.
   Every culprit's three trait values must be UNIQUE to them, or
   the Tracker can never narrow to a single name.
   ============================================================ */

window.TRAITS = {
  wineTrail: {
    label: "Wine Trail", hint: "what vintage were they after?",
    options: ["Sparkling", "Bold Red", "Pink"],
    values: { malbec: "Bold Red", champagne: "Sparkling", corkfather: "Bold Red",
              pinot: "Bold Red", decanter: "Sparkling", renee: "Pink", jack: "Bold Red" }
  },
  method: {
    label: "Method", hint: "how do they operate?",
    options: ["Spectacle", "Stealth", "Muscle", "Trickery"],
    values: { malbec: "Muscle", champagne: "Spectacle", corkfather: "Muscle",
              pinot: "Trickery", decanter: "Stealth", renee: "Spectacle", jack: "Stealth" }
  },
  card: {
    label: "Calling Card", hint: "what do they leave behind?",
    options: ["A token", "Nothing", "A mess", "A hashtag"],
    // corkfather signs with "A token" (a wax-sealed cork) — this keeps every
    // suspect's trait-triple unique so all seven can be uniquely identified.
    values: { malbec: "A mess", champagne: "A token", corkfather: "A token",
              pinot: "Nothing", decanter: "Nothing", renee: "A hashtag", jack: "A mess" }
  }
};

window.CASES = [
  /* ========================= CASE 1 ========================= */
  {
    id: "comet",
    codename: "Operation Comet",
    title: "The Vanishing Cuvée",
    culprit: "champagne",                 // ← the answer
    reward: "◆ 1,200,000₣",
    bottle: {
      name: "The 1921 “Comet” Cuvée",
      desc: "The only surviving bottle from the legendary comet harvest. Priceless. Irreplaceable.",
      slotId: "case-comet-bottle"
    },
    scene: { region: "EPERNAY", place: "Maison Lumière vaults, Épernay" },
    brief:
      "Chief, it's bad. The Comet Cuvée vanished from a sealed vault — mid-gala, four hundred guests, " +
      "not a fingerprint left. Only one of The Decanted moves like that. Work the trail, log every clue, " +
      "and do not issue a warrant until the Tracker leaves you one name. Bring our bottle home.",
    legs: [
      {
        region: "EPERNAY", country: "France", place: "Maison Lumière — Champagne",
        leads: [
          { title: "The Cellar Master", role: "Witness",
            text: "“Madame, every still wine sat untouched — she took only the sparkling lots. Whoever did this came for bubbles and nothing else.”",
            clue: { cat: "wineTrail", val: "Sparkling" } },
          { title: "Vault Camera 4", role: "Evidence",
            text: "A torn boarding-pass corner is caught in the drain grate. The legible ink reads “…OIRE — 19:40.” A river valley. She's already chasing the next lot.",
            dest: true },
          { title: "The Guest Book", role: "Flavor",
            text: "Three hundred signatures, one suspiciously elegant blank line at 22:14 — signed only with a small, hand-drawn bubble." }
        ],
        dest: { clue: "“…OIRE — 19:40.” A river valley known for its sparkling crémant.",
          correct: "LOIRE", options: ["LOIRE", "RIOJA", "MOSEL"] }
      },
      {
        region: "LOIRE", country: "France", place: "Crémant cellars — Loire Valley",
        leads: [
          { title: "The Sommelier", role: "Witness",
            text: "“She didn't sneak — she performed. Raised a coupe, toasted the whole room, and by the time we'd clapped she was gone. Pure theatre.”",
            clue: { cat: "method", val: "Spectacle" } },
          { title: "Dock Master's Log", role: "Evidence",
            text: "A charter manifest, hastily amended: one passenger added on a southbound flight to the Cape winelands — “Stellenbosch, first light.”",
            dest: true },
          { title: "Local Gossip", role: "Flavor",
            text: "Everyone agrees she was dazzling. Nobody agrees on her face, her accent, or which way she left. Useless — but flattering for her." }
        ],
        dest: { clue: "A charter to the Cape winelands — first light, Stellenbosch.",
          correct: "STELLENBOSCH", options: ["BORDEAUX", "STELLENBOSCH", "DOURO"] }
      },
      {
        region: "STELLENBOSCH", country: "South Africa", place: "Cape estate auction — Stellenbosch",
        leads: [
          { title: "The Auctioneer", role: "Witness",
            text: "“She left this on the podium.” He slides over a single gilded coupe. “Always a token. They say she can't resist signing her work.”",
            clue: { cat: "card", val: "A token" } },
          { title: "Harbour Ticketing", role: "Evidence",
            text: "A one-way passage, paid in vintage francs: destination the world's southernmost sauvignon coast — the land of the long white cloud.",
            dest: true },
          { title: "Estate Steward", role: "Flavor",
            text: "“Champagne tastes? In the Cape? Whoever she is, she drinks far above her station.” He sniffs. He is not wrong." }
        ],
        dest: { clue: "Southernmost sauvignon coast · the land of the long white cloud.",
          correct: "MARLBOROUGH", options: ["BAROSSA", "MENDOZA", "MARLBOROUGH"] }
      },
      {
        region: "MARLBOROUGH", country: "New Zealand", place: "Cliffside hideaway — Marlborough",
        final: true,
        leads: [
          { title: "The Hideaway", role: "Final Approach",
            text: "Lights on. A single chilled coupe waits on the rail, two glasses poured. She knows you're coming. Issue the warrant — then knock." }
        ],
        dest: null
      }
    ]
  },

  /* ========================= CASE 2 ========================= */
  {
    id: "silent-cellar",
    codename: "Operation Silent Cellar",
    title: "The Soundless Vintage",
    culprit: "decanter",                  // Sparkling · Stealth · Nothing
    reward: "◆ 2,400,000₣",
    bottle: {
      name: "The 1928 “Solstice” Blanc de Noirs",
      desc: "A magnum of midnight-dark sparkling, sealed since the year it was made. It disappeared from a vault three floors beneath W.I.N.E. itself.",
      slotId: "case-silent-bottle"
    },
    scene: { region: "GENEVA", place: "W.I.N.E. archive vault, Geneva" },
    brief:
      "This one stings, Chief — they hit our own house. The Solstice magnum lifted from the archive vault " +
      "under headquarters, alarms still armed, no forced entry, nothing disturbed. A ghost with a glass cutter. " +
      "Work the trail and tell me which of The Decanted walks through walls.",
    legs: [
      {
        region: "GENEVA", country: "Switzerland", place: "W.I.N.E. archive vault — Geneva",
        leads: [
          { title: "Night Watch", role: "Witness",
            text: "“No alarm. No noise. I did my round at two, the magnum was there; at three, just the dust-ring where it stood. Whoever this was, they don't make a sound.”",
            clue: { cat: "method", val: "Stealth" } },
          { title: "Service Elevator", role: "Evidence",
            text: "The only anomaly: the freight lift logged a single unscheduled descent to the loading dock, then a courier crate booked north to the Burgundy crémant houses.",
            dest: true },
          { title: "The Dust-Ring", role: "Flavor",
            text: "Forensics confirm it: not one print, fibre, or smudge. Just the clean circle where a priceless magnum used to be. Unsettlingly tidy." }
        ],
        dest: { clue: "A courier crate booked north to the crémant houses of Burgundy.",
          correct: "BURGUNDY", options: ["BURGUNDY", "RIOJA", "BAROSSA"] }
      },
      {
        region: "BURGUNDY", country: "France", place: "Crémant de Bourgogne house — Burgundy",
        leads: [
          { title: "The Cavist", role: "Witness",
            text: "“They only wanted the sparkling — wouldn't even glance at the grand cru reds beside it. Took two crates of crémant and left the fortune on the shelf.”",
            clue: { cat: "wineTrail", val: "Sparkling" } },
          { title: "Rail Yard Ledger", role: "Evidence",
            text: "A sealed wine-wagon coupled to the overnight express across the Alps to the sparkling cellars of Piedmont.",
            dest: true },
          { title: "Apprentice", role: "Flavor",
            text: "“I passed someone on the cellar stair. Polite. Gloved. Gone before I'd finished saying good evening.” He shivers, unsure why." }
        ],
        dest: { clue: "An overnight wagon across the Alps to the sparkling cellars of Piedmont.",
          correct: "PIEDMONT", options: ["TUSCANY", "PIEDMONT", "PROVENCE"] }
      },
      {
        region: "PIEDMONT", country: "Italy", place: "Spumante cellars — Piedmont",
        leads: [
          { title: "Cellar Foreman", role: "Witness",
            text: "“We only knew a case was gone when inventory came up one short. No break-in, no calling card, no nothing. As if it simply ceased to be here.”",
            clue: { cat: "card", val: "Nothing" } },
          { title: "Customs Stub", role: "Evidence",
            text: "A discreet export form: one climate-controlled trunk, declared “glassware,” routed to the slate-steep Riesling slopes of the Mosel.",
            dest: true },
          { title: "Tasting Notes", role: "Flavor",
            text: "Left on the counter, a single line in immaculate hand: “Adequate. Not the prize.” The thief has standards, evidently." }
        ],
        dest: { clue: "A trunk marked “glassware,” bound for the slate slopes of the Mosel.",
          correct: "MOSEL", options: ["RHONE", "MOSEL", "DOURO"] }
      },
      {
        region: "MOSEL", country: "Germany", place: "Slate-terrace estate — Mosel",
        final: true,
        leads: [
          { title: "The Estate", role: "Final Approach",
            text: "A spotless glasshouse on the steepest slate, the Solstice magnum displayed dead-centre like a museum piece — untouched, unopened, immaculate. No guards. Just a thief who never expected to be found. Issue the warrant." }
        ],
        dest: null
      }
    ]
  },

  /* ========================= CASE 3 ========================= */
  {
    id: "red-relic",
    codename: "Operation Red Relic",
    title: "The Lost Cask",
    culprit: "jack",                      // Bold Red · Stealth · A mess
    reward: "◆ 3,100,000₣",
    bottle: {
      name: "The 1847 “Conquistador” Tempranillo",
      desc: "A bottle dredged from a galleon wreck and worth more than the ship that carried it. Stolen from a guarded Rioja bodega before sunrise.",
      slotId: "case-relic-bottle"
    },
    scene: { region: "RIOJA", place: "Bodega del Sol vaults, Rioja" },
    brief:
      "A treasure-hunter's job, this one — the Conquistador lifted from a guarded Rioja bodega, with half the " +
      "cellar knocked over on the way out. Bold, messy, and three borders gone before the dust settled. " +
      "Follow the wreckage across the reds of the world and run them down before the bottle's auctioned off.",
    legs: [
      {
        region: "RIOJA", country: "Spain", place: "Bodega del Sol — Rioja",
        leads: [
          { title: "The Bodeguero", role: "Witness",
            text: "“Reds — always the big reds. Walked past the whites entirely and went straight for the oldest Tempranillo in the house. Knew exactly what it was worth.”",
            clue: { cat: "wineTrail", val: "Bold Red" } },
          { title: "Loading Bay", role: "Evidence",
            text: "Tyre tracks and a dropped cargo tag: a river barge chartered down to the terraced Port lodges of the Douro.",
            dest: true },
          { title: "Toppled Racks", role: "Flavor",
            text: "Two hundred bottles shoved aside, a barrel split open across the floor. Whoever it was did not tiptoe — they bulldozed." }
        ],
        dest: { clue: "A barge chartered to the terraced Port lodges of the Douro.",
          correct: "DOURO", options: ["BORDEAUX", "DOURO", "TUSCANY"] }
      },
      {
        region: "DOURO", country: "Portugal", place: "Port lodges — Douro Valley",
        leads: [
          { title: "Lodge Keeper", role: "Witness",
            text: "“I never saw a soul. Heard nothing all night. Just came down to find the gate picked clean and a single cask gone. Quiet as the grave, that one — when he wants to be.”",
            clue: { cat: "method", val: "Stealth" } },
          { title: "Harbour Manifest", role: "Evidence",
            text: "A freighter berth booked under a false name, bound across the Atlantic for the high-altitude Malbec country under the Andes.",
            dest: true },
          { title: "Old Cellarman", role: "Flavor",
            text: "“Treasure-hunters, not thieves. They don't want money — they want the story of the bottle. Worse, somehow.”" }
        ],
        dest: { clue: "A freighter to the high-altitude Malbec country under the Andes.",
          correct: "MENDOZA", options: ["MENDOZA", "PATAGONIA", "NAPA"] }
      },
      {
        region: "MENDOZA", country: "Argentina", place: "Andes-foot bodega — Mendoza",
        leads: [
          { title: "Vineyard Hand", role: "Witness",
            text: "“He left a mess and a half — door off its hinges, crates everywhere, muddy boots clean across the tasting room. Subtle as a rockslide.”",
            clue: { cat: "card", val: "A mess" } },
          { title: "Airstrip Log", role: "Evidence",
            text: "A light plane filed a dawn flight across the Pacific to the old-vine Shiraz country of the Barossa.",
            dest: true },
          { title: "Torn Map", role: "Flavor",
            text: "Dropped in the mud: a wine-region map, one valley circled hard enough to tear the paper. He's not done collecting." }
        ],
        dest: { clue: "A dawn flight to the old-vine Shiraz country of the Barossa.",
          correct: "BAROSSA", options: ["MARLBOROUGH", "BAROSSA", "STELLENBOSCH"] }
      },
      {
        region: "BAROSSA", country: "Australia", place: "Old-vine homestead — Barossa",
        final: true,
        leads: [
          { title: "The Homestead", role: "Final Approach",
            text: "Boots on the porch, the Conquistador open on the table, a glass already poured — the treasure-hunter toasting his own haul. He'll bolt the moment he hears you. Issue the warrant first, then move." }
        ],
        dest: null
      }
    ]
  }
];
