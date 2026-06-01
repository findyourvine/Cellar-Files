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
    difficulty: { label: "Rookie", startHeat: 100, destPenalty: 25, herringCost: 0, leadBudget: 9 },
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
    difficulty: { label: "Field", startHeat: 88, destPenalty: 30, herringCost: 8, leadBudget: 2 },
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
            text: "Forensics confirm it: not one print, fibre, or smudge. Just the clean circle where a priceless magnum used to be. Unsettlingly tidy." },
          { title: "The New Intern", role: "Tip",
            text: "“I think I saw someone in a bright red coat bolt down the east stairwell!” There is no east stairwell. The intern started on Monday." }
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
            text: "“I passed someone on the cellar stair. Polite. Gloved. Gone before I'd finished saying good evening.” He shivers, unsure why." },
          { title: "Village Gossip", role: "Hearsay",
            text: "Half the café swears the thief was a tall man with a limp; the other half, a short woman in furs. They agree only that someone bought the whole bar a round." }
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
            text: "Left on the counter, a single line in immaculate hand: “Adequate. Not the prize.” The thief has standards, evidently." },
          { title: "Anonymous Note", role: "Tip",
            text: "A note slipped under the office door names a local rival as the culprit. The rival was in hospital all week. Someone wants your eyes pointed the wrong way." }
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
    difficulty: { label: "Veteran", startHeat: 74, destPenalty: 34, herringCost: 10, leadBudget: 2 },
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
            text: "Two hundred bottles shoved aside, a barrel split open across the floor. Whoever it was did not tiptoe — they bulldozed." },
          { title: "A Passing Shepherd", role: "Hearsay",
            text: "“Saw a truck go north to the coast at dawn — or south, maybe. These old eyes.” He gestures in three different directions over one sentence. Nothing you can use." }
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
            text: "“Treasure-hunters, not thieves. They don't want money — they want the story of the bottle. Worse, somehow.”" },
          { title: "Dockside Tout", role: "Tip",
            text: "For one coin he'll swear the thief sailed east to the Cape; for two, west to the Americas; for three, he admits he saw nothing at all. You keep your coins." }
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
            text: "A light plane filed a short dawn hop north — to the highest vineyards in the country, the Torrontés terraces of Cafayate.",
            dest: true },
          { title: "Torn Map", role: "Flavor",
            text: "Dropped in the mud: a wine-region map, one valley circled hard enough to tear the paper. He's not done collecting." },
          { title: "Souvenir Stall", role: "Tip",
            text: "The vendor insists the man bought a postcard of the Sydney Opera House — proof, he says, of the thief's next stop. He sells that same postcard to every tourist who'll listen." }
        ],
        dest: { clue: "A dawn hop north to the highest vineyards in the land — Cafayate.",
          correct: "CAFAYATE", options: ["PATAGONIA", "CAFAYATE", "NAPA"] }
      },
      {
        region: "CAFAYATE", country: "Argentina", place: "Torrontés terraces — Cafayate",
        leads: [
          { title: "Airfield Marshal", role: "Evidence",
            text: "“Refuelled a light plane at first light — filed across the Pacific for the old-vine Shiraz country. The Barossa. You just missed him by an hour.”",
            dest: true },
          { title: "Torrontés Grower", role: "Flavor",
            text: "“He bought every bottle of our oldest vintage, toasted ‘the final leg,’ and left without paying. Charming, in a way.”" },
          { title: "Hitchhiker's Rumour", role: "Tip",
            text: "A backpacker swears the man muttered about Mendoza, then Chile, then somewhere he couldn't pronounce. A trail of red herrings — possibly deliberate." }
        ],
        dest: { clue: "A dawn plane across the Pacific to the old-vine Shiraz country — the Barossa.",
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
  },
  /* ========================= CASE 4 ========================= */
  {
    id: "pink-mirage",
    codename: "Operation Pink Mirage",
    title: "The Blushing Crown",
    culprit: "renee",                     // Pink · Spectacle · A hashtag
    reward: "◆ 3,800,000₣",
    difficulty: { label: "Inspector", startHeat: 68, destPenalty: 36, herringCost: 10, leadBudget: 2 },
    bottle: {
      name: "The 1843 “Rosa Aurora”",
      desc: "The oldest surviving rosé on earth — a blush-pink relic worth more for its legend than its label. Lifted from a Provence estate mid-party.",
      slotId: "case-mirage-bottle"
    },
    scene: { region: "PROVENCE", place: "Domaine Soleil Rosé, Provence" },
    brief:
      "She didn't sneak in, Chief — she headlined. Two hundred guests, a string quartet, and the Rosa Aurora gone " +
      "between the toast and the encore. This one performs for an audience and signs her work where everyone can see it. " +
      "Follow the spectacle, log her signature, and don't let the show distract you from the warrant.",
    legs: [
      {
        region: "PROVENCE", country: "France", place: "Domaine Soleil Rosé — Provence",
        leads: [
          { title: "The Vigneronne", role: "Witness",
            text: "“She was invited — posed by the vats, toasted the room, blew a kiss. Somewhere between the applause and the encore, the Rosa Aurora simply left with her. Pure theatre.”",
            clue: { cat: "method", val: "Spectacle" } },
          { title: "Valet Stub", role: "Evidence",
            text: "A torn itinerary under the valet desk: a private jet logged wheels-up for the Napa Valley before the party had even ended.",
            dest: true },
          { title: "The Guestlist", role: "Flavor",
            text: "Her name appears nowhere. At the top of the list, in its place, a single lipstick kiss and a hand-drawn heart." },
          { title: "Fan Account", role: "Tip",
            text: "A breathless online account swears she fled by yacht to Monaco. The same account claims she is secretly three different pop stars. Unverified, to put it kindly." }
        ],
        dest: { clue: "A private jet, wheels-up for the Napa Valley.",
          correct: "NAPA", options: ["NAPA", "BORDEAUX", "MENDOZA"] }
      },
      {
        region: "NAPA", country: "United States", place: "Hilltop tasting gallery — Napa Valley",
        leads: [
          { title: "Gallery Owner", role: "Witness",
            text: "“She tagged us. Tagged the crime. By morning #BlushBandit was everywhere and our security footage had nine million views. She wants the audience as much as the wine.”",
            clue: { cat: "card", val: "A hashtag" } },
          { title: "Concierge Note", role: "Evidence",
            text: "The hotel concierge — starstruck — booked her next stay himself: a hilltop villa above the vineyards of Tuscany.",
            dest: true },
          { title: "Lipstick", role: "Flavor",
            text: "One perfect lipstick crescent on a glass at the tasting bar. The shade, the lab confirms, is discontinued and absurdly expensive." },
          { title: "Influencer Tip", role: "Tip",
            text: "A rival influencer DMs the bureau 'exclusive intel' for a fee. The intel is a screenshot of a map with a question mark on it. Declined." }
        ],
        dest: { clue: "A villa above the vineyards of Tuscany.",
          correct: "TUSCANY", options: ["TUSCANY", "RIOJA", "MOSEL"] }
      },
      {
        region: "TUSCANY", country: "Italy", place: "Brunello estate — Tuscany",
        leads: [
          { title: "Estate Sommelier", role: "Witness",
            text: "“Rows of priceless Brunello, untouched. She crossed the whole cellar for one thing — the pink. Always the pink. If it doesn't blush, she isn't interested.”",
            clue: { cat: "wineTrail", val: "Pink" } },
          { title: "Heliport Log", role: "Evidence",
            text: "A helicopter manifest: one passenger, a great deal of luggage, destination the Pinot and Zinfandel country of Sonoma.",
            dest: true },
          { title: "Polaroid", role: "Flavor",
            text: "Pinned to the cellar door, a Polaroid of the empty rack where the rosé stood — captioned, in glitter pen, 'borrowed ♥'." },
          { title: "Tour Guide", role: "Hearsay",
            text: "A tour guide swears she's still in the building, signing autographs. He is describing a different woman entirely, and possibly a mannequin." }
        ],
        dest: { clue: "A helicopter to the Pinot and Zinfandel country of Sonoma.",
          correct: "SONOMA", options: ["SONOMA", "DOURO", "PIEDMONT"] }
      },
      {
        region: "SONOMA", country: "United States", place: "Vineyard estate — Sonoma",
        final: true,
        leads: [
          { title: "The Vineyard Estate", role: "Final Approach",
            text: "A ring light glows on the porch. The Rosa Aurora sits on a marble table, perfectly staged, a phone propped to film whatever happens next. She's expecting an audience. Give her a warrant instead." }
        ],
        dest: null
      }
    ]
  },

  /* ========================= CASE 5 ========================= */
  {
    id: "counterfeit-cru",
    codename: "Operation Sleight",
    title: "The Counterfeit Cru",
    culprit: "pinot",                     // Bold Red · Trickery · Nothing
    reward: "◆ 4,500,000₣",
    difficulty: { label: "Senior", startHeat: 62, destPenalty: 38, herringCost: 12, leadBudget: 2 },
    bottle: {
      name: "The “Phantom” Clos",
      desc: "A single-vineyard red so rare that experts argue whether it ever truly existed. Now it's gone — and so is the proof it was ever real.",
      slotId: "case-sleight-bottle"
    },
    scene: { region: "BORDEAUX", place: "Château Verité first-growth cellar, Bordeaux" },
    brief:
      "No broken locks, no alarms, no thief on any camera — just a flawless fake sitting where the Phantom Clos used to be. " +
      "This one doesn't steal so much as rewrite the truth. Trust nothing you're handed, weigh every witness, and remember: " +
      "the cleverest evidence here was left for you to find.",
    legs: [
      {
        region: "BORDEAUX", country: "France", place: "Château Verité — Bordeaux",
        leads: [
          { title: "Château Régisseur", role: "Witness",
            text: "“He never touched the whites. Walked the first-growth cellar like a man reading a menu, took the boldest red on the estate, and left a perfect forgery in its place. We didn't notice for a week.”",
            clue: { cat: "wineTrail", val: "Bold Red" } },
          { title: "Forged Invoice", role: "Evidence",
            text: "The fake paperwork is too good — printed on a press only three houses own. One of them sits in the northern Rhône.",
            dest: true },
          { title: "The Replica", role: "Flavor",
            text: "The bottle he left is flawless to the eye: right label, right capsule, right ullage. Inside: cooking wine. A small, expensive joke." },
          { title: "Wine Critic", role: "Tip",
            text: "A famous critic insists the theft is a hoax and the bottle never existed. He is suing everyone involved, including, somehow, the bureau." }
        ],
        dest: { clue: "A press found in only three houses — one in the northern Rhône.",
          correct: "RHONE", options: ["RHONE", "TUSCANY", "GENEVA"] }
      },
      {
        region: "RHONE", country: "France", place: "Engraving workshop — Northern Rhône",
        leads: [
          { title: "Print Shop Owner", role: "Witness",
            text: "“Gone without a trace. No order slip, no name, no security trip. The plates for our rarest labels just… weren't where I left them. Like he was never here at all.”",
            clue: { cat: "card", val: "Nothing" } },
          { title: "Freight Tag", role: "Evidence",
            text: "A single shipping tag fluttered loose under the press: a crate routed to a fine-wine vault in the Napa Valley.",
            dest: true },
          { title: "Empty Frame", role: "Flavor",
            text: "Where a certificate of authenticity once hung, an empty frame — and a business card, blank on both sides." },
          { title: "Anonymous Caller", role: "Tip",
            text: "A caller offers to name the thief in exchange for immunity, then recounts, in detail, the plot of a heist film. He hangs up before anyone can object." }
        ],
        dest: { clue: "A crate routed to a fine-wine vault in the Napa Valley.",
          correct: "NAPA", options: ["NAPA", "BURGUNDY", "BAROSSA"] }
      },
      {
        region: "NAPA", country: "United States", place: "Bonded wine vault — Napa Valley",
        leads: [
          { title: "Vault Manager", role: "Witness",
            text: "“He had papers for everything — ownership, transfer, insurance, all flawless forgeries. He didn't steal the bottle. He convinced us to hand it over and thank him for the privilege.”",
            clue: { cat: "method", val: "Trickery" } },
          { title: "Decoy Ticket", role: "Evidence",
            text: "Left too neatly in the visitor log — a boarding pass to the Pinot country of Sonoma, seat circled. A taunt. He always leaves one.",
            dest: true },
          { title: "Card Trick", role: "Flavor",
            text: "On the manager's desk, a deck fanned face-up — every card the ace of spades. Forged, naturally." },
          { title: "Eyewitness", role: "Hearsay",
            text: "A guard swears the thief 'vanished into thin air.' The footage shows the thief strolling out the front door while the guard looked at his phone." }
        ],
        dest: { clue: "A taunting boarding pass to the Pinot country of Sonoma.",
          correct: "SONOMA", options: ["SONOMA", "MENDOZA", "LOIRE"] }
      },
      {
        region: "SONOMA", country: "United States", place: "Backroad roadhouse — Sonoma",
        leads: [
          { title: "Roadhouse Bartender", role: "Evidence",
            text: "“Paid in old francs, tipped me in card tricks. Said he was 'going home to the only honest dirt in America' — the Willamette. Then he was gone.”",
            dest: true },
          { title: "Matchbook", role: "Flavor",
            text: "A matchbook from the bar, a phone number inside scratched out and replaced with two words: 'nice try.'" },
          { title: "Local Legend", role: "Hearsay",
            text: "Regulars insist a ghost haunts the cellar and took the bottle. The 'ghost' bought a round on Tuesday and paid with a forged twenty." }
        ],
        dest: { clue: "'Going home' — the Pinot Noir country of the Willamette.",
          correct: "WILLAMETTE", options: ["WILLAMETTE", "FINGER LAKES", "PROVENCE"] }
      },
      {
        region: "WILLAMETTE", country: "United States", place: "Quiet farmhouse — Willamette Valley",
        final: true,
        leads: [
          { title: "The Quiet Farmhouse", role: "Final Approach",
            text: "No alarms, no tricks, no forgeries — just a porch light, the Phantom Clos uncorked on the kitchen table, and a man who seems almost relieved you finally saw through it all. Issue the warrant before he talks his way out of this one too." }
        ],
        dest: null
      }
    ]
  },

  /* ========================= CASE 6 ========================= */
  {
    id: "kingpin",
    codename: "Operation Kingpin",
    title: "The Last Cork",
    culprit: "corkfather",                // Bold Red · Muscle · A token
    reward: "◆ 6,000,000₣",
    difficulty: { label: "Master", startHeat: 56, destPenalty: 40, herringCost: 12, leadBudget: 2 },
    bottle: {
      name: "The 1900 “Capo” Barolo",
      desc: "The bottle the whole syndicate was built on. Take it, and you take the throne. The Corkfather has no intention of letting that happen.",
      slotId: "case-kingpin-bottle"
    },
    scene: { region: "TUSCANY", place: "Fortified Brunello estate, Tuscany" },
    brief:
      "This is the one, Chief — the head of the table himself. The Capo Barolo torn from a fortified estate by a small army, " +
      "and he wants us to know it was him. He only takes the big reds, he takes them by force, and he signs every job with that " +
      "wax-sealed cork. You'll need all three to be certain — guess wrong on the Kingpin and he walks. Bring him in for good.",
    legs: [
      {
        region: "TUSCANY", country: "Italy", place: "Fortified Brunello estate — Tuscany",
        leads: [
          { title: "Estate Manager", role: "Witness",
            text: "“Forty men's worth of damage and they took one case — the biggest, boldest Barolo in the house. The boss only ever wants the reds. Everything else is just mess on the way out.”",
            clue: { cat: "wineTrail", val: "Bold Red" } },
          { title: "Convoy Tracks", role: "Evidence",
            text: "Three black cars, no plates, headed north on the autostrada toward the sparkling-wine hills of Piedmont. Witnesses suddenly can't remember a thing.",
            dest: true },
          { title: "The Cork", role: "Flavor",
            text: "Pressed into the dust where the case stood: a single cork, sealed in red wax with a signet only one man uses." },
          { title: "Nervous Clerk", role: "Tip",
            text: "A clerk whispers a name, recants, asks for witness protection, then faints. The name he gave belongs to a man who died in 1976." }
        ],
        dest: { clue: "Three plateless cars, north toward the hills of Piedmont.",
          correct: "PIEDMONT", options: ["PIEDMONT", "RIOJA", "NAPA"] }
      },
      {
        region: "PIEDMONT", country: "Italy", place: "Barolo cellar — Piedmont",
        leads: [
          { title: "Cellar Owner", role: "Witness",
            text: "“No finesse. No locks picked. They took the doors off the hinges and the safe out through the wall. You don't hire thieves like that — you hire an army. And only one man has one.”",
            clue: { cat: "method", val: "Muscle" } },
          { title: "Customs Bribe", role: "Evidence",
            text: "A customs officer, suddenly wealthy and very nervous, waved through a sealed truck bound for the steep terraces of the northern Rhône.",
            dest: true },
          { title: "Broken Door", role: "Flavor",
            text: "The vault door lies flat in the courtyard, hinges and all. Scorched faintly into the steel: that same wax-seal mark." },
          { title: "Rival Boss", role: "Tip",
            text: "An anonymous note fingers a rival syndicate — printed, conveniently, on that rival's own letterhead. Either a blunder or exactly what they want you to think." }
        ],
        dest: { clue: "A bribed-through truck bound for the northern Rhône.",
          correct: "RHONE", options: ["RHONE", "MOSEL", "DOURO"] }
      },
      {
        region: "RHONE", country: "France", place: "Syrah terraces — Northern Rhône",
        leads: [
          { title: "The Vigneron", role: "Witness",
            text: "“They left it on the barrel like a calling card — a cork, sealed in red wax, stamped with his mark. The Corkfather wants you to know it was him. That's the whole point.”",
            clue: { cat: "card", val: "A token" } },
          { title: "Manifest", role: "Evidence",
            text: "A freight manifest paid in full, in cash: a temperature-controlled lorry crossing the Pyrenees to the old bodegas of Rioja.",
            dest: true },
          { title: "The Seal", role: "Flavor",
            text: "Lab analysis of the wax: a recipe unchanged in sixty years, traceable to one estate. His estate." },
          { title: "Loose Henchman", role: "Tip",
            text: "A low-level courier offers to flip. Mid-confession he gets a text, goes pale, and recalls he was 'on holiday the whole time.'" }
        ],
        dest: { clue: "A cash-paid lorry over the Pyrenees to the bodegas of Rioja.",
          correct: "RIOJA", options: ["RIOJA", "BORDEAUX", "STELLENBOSCH"] }
      },
      {
        region: "RIOJA", country: "Spain", place: "Abandoned bodega — Rioja",
        leads: [
          { title: "Stationmaster", role: "Evidence",
            text: "“The convoy came through at dawn and didn't stop. Headed for the one place he's never let us touch — the family estate in Bordeaux. He's going home.”",
            dest: true },
          { title: "Empty Bodega", role: "Flavor",
            text: "Not robbed — abandoned in a hurry. On the wall, a fresh wax seal, still soft to the touch. You're close." },
          { title: "Old Rumour", role: "Hearsay",
            text: "Locals say the Corkfather can't be arrested — that he owns judges, ports, and the weather. One adds, helpfully, that he is also nine feet tall." }
        ],
        dest: { clue: "Going home — the family estate in Bordeaux.",
          correct: "BORDEAUX", options: ["BORDEAUX", "MARLBOROUGH", "CAFAYATE"] }
      },
      {
        region: "BORDEAUX", country: "France", place: "The family estate — Bordeaux",
        final: true,
        leads: [
          { title: "The Family Estate", role: "Final Approach",
            text: "Wrought-iron gates, a long gravel drive, and at the end of it the Capo Barolo decanted on a table set for two — one glass for him, one, it seems, for you. The whole syndicate behind these walls, and the man who runs it waiting calmly in his chair. Issue the warrant. Then bring him in for good." }
        ],
        dest: null
      }
    ]
  }
,
  /* ========================= CASE 7 ========================= */
  {
    id: "loose-end",
    codename: "Operation Last Call",
    title: "The Loose End",
    culprit: "malbec",                    // Bold Red · Muscle · A mess
    reward: "◆ 7,500,000₣",
    difficulty: { label: "Legend", startHeat: 58, destPenalty: 38, herringCost: 12, leadBudget: 2 },
    bottle: {
      name: "The 1912 “Goliath” Magnum",
      desc: "A double-magnum of legendary old-vine red, big enough to anchor a boat. The Corkfather's enforcer grabbed it on his way out the door — the last score before he vanished.",
      slotId: "case-bruiser-bottle"
    },
    scene: { region: "MENDOZA", place: "Bodega Grande vaults, Mendoza" },
    brief:
      "One loose end left, Chief. With the Corkfather behind bars, his enforcer Malbec Mike grabbed the Goliath magnum " +
      "and ran — and a man that size doesn't tiptoe. He takes the big reds, takes them by force, and leaves a wreck behind " +
      "every time. Run down all three on this one or you'll never tell him from the boss. Catch him, and the set is complete.",
    legs: [
      {
        region: "MENDOZA", country: "Argentina", place: "Bodega Grande — Mendoza",
        leads: [
          { title: "The Bodega Owner", role: "Witness",
            text: "“Subtle as a wrecking ball. Tore through the rack, grabbed the biggest, oldest red in the house, and was gone. Walked right past a wall of white without a glance. Reds — only ever the reds.”",
            clue: { cat: "wineTrail", val: "Bold Red" } },
          { title: "Tyre Marks", role: "Evidence",
            text: "Deep ruts and a dropped ferry ticket: a freighter booked across the Atlantic for the first-growth country of Bordeaux.",
            dest: true },
          { title: "The Damage", role: "Flavor",
            text: "Eleven racks down, a door off its frame, a forklift driven through a wall. Whoever this was didn't pick a lock — he made a new one." },
          { title: "Café Regular", role: "Hearsay",
            text: "A regular swears the thief headed for the airport, then the docks, then 'maybe Chile,' then orders another drink and forgets the question entirely." }
        ],
        dest: { clue: "A freighter across the Atlantic to the first-growth country of Bordeaux.",
          correct: "BORDEAUX", options: ["BORDEAUX", "RIOJA", "NAPA"] }
      },
      {
        region: "BORDEAUX", country: "France", place: "First-growth château — Bordeaux",
        leads: [
          { title: "Château Guard", role: "Witness",
            text: "“Look at this place. He didn't cover his tracks — he left more of them. Broken glass, muddy boots, a barrel overturned in the courtyard. A calling card made of wreckage.”",
            clue: { cat: "card", val: "A mess" } },
          { title: "Customs Slip", role: "Evidence",
            text: "A cargo slip jammed in the gate: one oversized, badly-packed crate manifested to the steep Syrah terraces of the northern Rhône.",
            dest: true },
          { title: "Bootprint", role: "Flavor",
            text: "A single muddy bootprint, size enormous, pressed flat into a 1959 vintage ledger. The lab is mostly just impressed." },
          { title: "Insurance Man", role: "Tip",
            text: "An investigator insists it's an inside job and hands you a thick dossier. The dossier concerns a different château, in a different country, last year." }
        ],
        dest: { clue: "An oversized crate bound for the steep Syrah terraces of the northern Rhône.",
          correct: "RHONE", options: ["RHONE", "TUSCANY", "DOURO"] }
      },
      {
        region: "RHONE", country: "France", place: "Syrah cellars — Northern Rhône",
        leads: [
          { title: "The Cellarman", role: "Witness",
            text: "“Two of them held the door, one carried the crate like it was empty. No tools, no tricks — just brute strength and no manners at all. You don't sneak past men like that. They are the plan.”",
            clue: { cat: "method", val: "Muscle" } },
          { title: "Dock Ledger", role: "Evidence",
            text: "A harbourmaster's ledger, ink still wet: a cargo run booked for the old-vine Shiraz country of the Barossa.",
            dest: true },
          { title: "Bent Bars", role: "Flavor",
            text: "The cellar's iron gate is peeled open like a tin lid. No cutting torch, no explosives — just hands." },
          { title: "Anonymous Letter", role: "Tip",
            text: "A typed letter names a famous strongman wrestler as the culprit, with photographs. The photographs are very clearly cut from a magazine." }
        ],
        dest: { clue: "A cargo run booked for the old-vine Shiraz country of the Barossa.",
          correct: "BAROSSA", options: ["BAROSSA", "MARLBOROUGH", "STELLENBOSCH"] }
      },
      {
        region: "BAROSSA", country: "Australia", place: "Outback roadhouse — Barossa",
        leads: [
          { title: "Roadhouse Owner", role: "Evidence",
            text: "“Big fella, ate for three, paid in cash. Said he was 'going somewhere nobody looks' — the cold end of the world, Patagonia. Then left without paying for the pie.”",
            dest: true },
          { title: "Cleaned Out", role: "Flavor",
            text: "He didn't steal here — just passed through. But the pantry's bare, the till's light, and the dog won't stop shaking." },
          { title: "Local Tracker", role: "Hearsay",
            text: "A tracker offers to find the man for a fee, points confidently at the horizon, and leads you in a complete circle back to the bar." }
        ],
        dest: { clue: "'Somewhere nobody looks' — the cold end of the world, Patagonia.",
          correct: "PATAGONIA", options: ["PATAGONIA", "CAFAYATE", "MENDOZA"] }
      },
      {
        region: "PATAGONIA", country: "Argentina", place: "Tin-roof shack — Patagonia",
        final: true,
        leads: [
          { title: "The End of the Road", role: "Final Approach",
            text: "A tin-roof shack at the bottom of the world, woodsmoke curling, the Goliath magnum open on an upturned crate beside a single chair. Nowhere left to run, and he knows it. This is the last of The Decanted. Issue the warrant and bring him in — the set is finally complete." }
        ],
        dest: null
      }
    ]
  }

];
