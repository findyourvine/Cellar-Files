/* ============================================================
   THE CELLAR FILES — Character database (content-driven · v2)
   Add a character by appending an object. No code change needed.
   full:true  -> complete dossier  ·  full:false -> WANTED stub
   ============================================================ */

window.CHARACTERS = [
  {
    id: "cork",
    full: true,
    faction: "wine",
    status: "AGENT",
    fileNo: "Nº 001",
    name: ["CORK", "CONNOISSEUR"],
    alias: "Chief of W.I.N.E.",
    role: "Wine Intelligence & Navigation Enforcement",
    accent: "#6E2230",
    accent2: "#B8902F",
    accentSoft: "#caa9a0",
    monogram: "W", mapKey: "GENEVA",
    bio: "World-class wine expert, relentless investigator, and protector of legendary bottles. He follows the clues, travels the world, and brings wine criminals to justice — one vintage at a time.",
    caseTag: [
      { t: "Agent File CC-001" },
      { t: "Active Duty", live: true },
      { t: "Clearance Level V" }
    ],
    evidence: ["ON DUTY"],
    threat: { label: "Security Clearance", level: 5, word: "LEVEL V", color: "#3f6b3f" },
    dossier: [
      { k: "Last Known Location", v: "In transit — Geneva HQ" },
      { k: "Home Wine Region", v: "Global jurisdiction" },
      { k: "Favorite Wine", v: "Whatever cracks the case" },
      { k: "Case Status", v: "Active Duty" },
      { k: "Bottles Recovered", v: "142", reward: true }
    ],
    crimes: {
      title: "Service Record", hint: "commendations", tag: "CLOSED", closed: true,
      items: [
        "Recovered the lost 1945 Romanée-Conti from a sealed vault.",
        "Dismantled the Barolo black market across three countries.",
        "Cracked the Judgment of Paris forgery ring in 48 hours.",
        "Returned 142 legendary bottles to their rightful cellars."
      ]
    },
    travel: [
      { name: "NAPA", date: "MMXXI" },
      { name: "BORDEAUX", date: "MMXXII" },
      { name: "TUSCANY", date: "MMXXIII" },
      { name: "RIOJA", date: "MMXXIV" },
      { name: "MOSEL", date: "MMXXV" }
    ],
    stats: [
      { k: "Specialty", v: "Wine Regions · Tasting Notes · Clue Analysis" },
      { k: "Weapon", v: "Vintage Corkscrew" },
      { k: "Motto", v: "“Every bottle has a story. Let's find it.”", motto: true }
    ],
    accessory: { name: "W.I.N.E. Passport Notebook", desc: "A leather field journal stamped with every region he's ever cracked a case in." },
    expressions: [
      { key: "confident", label: "Confident" }, { key: "thinking", label: "Thinking" },
      { key: "amused", label: "Amused" }, { key: "surprised", label: "Surprised" }
    ],
    poses: [{ key: "idle", label: "Idle" }, { key: "walking", label: "Walking" }, { key: "victory", label: "Victory" }],
    palette: [
      { name: "Burgundy", hex: "#6E2230" }, { name: "Cream", hex: "#F0E4CC" }, { name: "Dark Oak", hex: "#3A2A1C" },
      { name: "Gold", hex: "#B8902F" }, { name: "Vine Green", hex: "#5B6B3A" }
    ]
  },

  {
    id: "malbec",
    full: true,
    faction: "decanted",
    status: "WANTED",
    fileNo: "Nº 002",
    name: ["MALBEC", "MIKE"],
    alias: "The Wine Smuggler",
    role: "Recurring Villain · Smuggler-at-Large",
    accent: "#4E2A5E",
    accent2: "#C8C6CB",
    accentSoft: "#b59ec1",
    monogram: "M", mapKey: "MENDOZA",
    bio: "Charming, daring, and always one step ahead. Malbec Mike smuggles rare wines across borders and vanishes into the vineyards before the cork's even popped.",
    caseTag: [
      { t: "Case Nº MM-002" },
      { t: "Active Pursuit", live: true },
      { t: "Armed: Grappling Corkscrew" }
    ],
    evidence: ["WANTED", "ARMED"],
    threat: { label: "Threat Level", level: 4, word: "HIGH", color: "#C8742E" },
    dossier: [
      { k: "Last Known Location", v: "Cafayate, Salta — Argentina" },
      { k: "Home Wine Region", v: "Mendoza, Argentina" },
      { k: "Favorite Wine", v: "Single-vineyard Malbec, 15 years deep" },
      { k: "Case Status", v: "Active Pursuit" },
      { k: "Bounty", v: "◆ 500,000₣", reward: true }
    ],
    crimes: {
      title: "Known Crimes", hint: "rap sheet", tag: "EXHIBIT",
      items: [
        "Smuggled 400 cases of Grand Cru across four borders.",
        "Scaled a château wall to rob a second-storey cellar.",
        "Impersonated a customs sommelier to clear his own crates.",
        "Outran three W.I.N.E. field teams through the Andes."
      ]
    },
    travel: [
      { name: "MENDOZA", date: "MMXXIII" }, { name: "PATAGONIA", date: "MMXXIV" },
      { name: "DOURO", date: "MMXXIV" }, { name: "RIOJA", date: "MMXXV" }
    ],
    stats: [
      { k: "Specialty", v: "Malbec · Escape Routes · Disguises" },
      { k: "Weapon", v: "Grappling Corkscrew" },
      { k: "Motto", v: "“The world is too big for borders… and for your cellars.”", motto: true }
    ],
    accessory: { name: "Grappling Corkscrew", desc: "An oversized silver wine-thief that doubles as a climbing hook for second-storey cellar jobs." },
    expressions: [
      { key: "charming", label: "Charming" }, { key: "cocky", label: "Cocky" }, { key: "laughing", label: "Laughing" },
      { key: "focused", label: "Focused" }, { key: "winking", label: "Winking" }
    ],
    poses: [{ key: "idle", label: "Idle" }, { key: "walking", label: "Walking" }, { key: "victory", label: "Victory" }],
    palette: [
      { name: "Plum", hex: "#4E2A5E" }, { name: "Mauve", hex: "#7A5184" }, { name: "Black", hex: "#1E1A22" },
      { name: "Burgundy", hex: "#5E1F2A" }, { name: "Silver", hex: "#C8C6CB" }
    ]
  },

  {
    id: "champagne",
    full: true,
    faction: "decanted",
    status: "WANTED",
    fileNo: "Nº 003",
    name: ["LADY", "CHAMPAGNE"],
    alias: "The Bubbly Phantom",
    role: "Mastermind · Luxury Wine Crimes",
    accent: "#A6801F",
    accent2: "#E7D196",
    accentSoft: "#d8c489",
    monogram: "LC", mapKey: "CHAMPAGNE",
    bio: "Elegant, elusive, and exquisitely sophisticated. Lady Champagne steals the world's most luxurious sparkling wines and leaves behind only bubbles and mystery.",
    caseTag: [
      { t: "Case Nº LC-003" },
      { t: "Cold Case — Reopened", live: true },
      { t: "Extreme Caution" }
    ],
    evidence: ["WANTED", "PRIORITY"],
    threat: { label: "Threat Level", level: 5, word: "EXTREME", color: "#9c2b32" },
    dossier: [
      { k: "Last Known Location", v: "Épernay — vanished mid-toast" },
      { k: "Home Wine Region", v: "Champagne, France" },
      { k: "Favorite Wine", v: "Krug Clos d'Ambonnay 1996" },
      { k: "Case Status", v: "Cold — Reopened" },
      { k: "Bounty", v: "◆ 1,200,000₣", reward: true }
    ],
    crimes: {
      title: "Known Crimes", hint: "rap sheet", tag: "EXHIBIT",
      items: [
        "Lifted the 'Comet Vintage' from a sealed auction vault.",
        "Swapped a museum Dom Pérignon for sparkling cider.",
        "Vanished mid-toast at the Met Gala, in front of 400 guests.",
        "Left only rising bubbles and a single gold coupe behind."
      ]
    },
    travel: [
      { name: "CHAMPAGNE", date: "MMXX" }, { name: "LOIRE", date: "MMXXI" },
      { name: "STELLENBOSCH", date: "MMXXIII" }, { name: "MARLBOROUGH", date: "MMXXIV" }
    ],
    stats: [
      { k: "Specialty", v: "Sparkling Wines · Luxury Auctions · Disguises" },
      { k: "Weapon", v: "Champagne Coupe" },
      { k: "Motto", v: "“Bubbles rise. Legends never fall.”", motto: true }
    ],
    accessory: { name: "Gilded Champagne Coupe", desc: "A golden coupe she raises to reveal — and conceal — the clue she always leaves behind." },
    expressions: [
      { key: "elegant", label: "Elegant" }, { key: "playful", label: "Playful" }, { key: "knowing", label: "Knowing" },
      { key: "curious", label: "Curious" }, { key: "mysterious", label: "Mysterious" }
    ],
    poses: [{ key: "idle", label: "Idle" }, { key: "walking", label: "Walking" }, { key: "victory", label: "Victory" }],
    palette: [
      { name: "Champagne Gold", hex: "#B8902F" }, { name: "Champagne", hex: "#E7D196" }, { name: "Ivory", hex: "#F4ECD8" },
      { name: "Soft Black", hex: "#211C18" }, { name: "Bronze", hex: "#8A6A2C" }
    ]
  },

  /* ---------- STUB CRIMINALS (active targets · dossier pending) ---------- */
  {
    id: "corkfather", full: true, faction: "decanted", status: "WANTED", fileNo: "Nº 004",
    name: ["THE", "CORKFATHER"], alias: "The Crime Boss",
    accent: "#5A1A26", accent2: "#B8902F", accentSoft: "#b78a8f", monogram: "CF", mapKey: "NAPA",
    bio: "The undisputed boss of the wine underworld. The Corkfather never lifts a bottle himself — he simply makes you an offer, and by morning your cellar is somehow empty. Loyalty is poured generously; betrayal is decanted permanently.",
    stats: [
      { k: "Specialty", v: "Syndicates · Intimidation · Cult Cabernet" },
      { k: "Weapon", v: "Cork-Cutter Signet Ring" },
      { k: "Motto", v: "“I'm making a pairing you can't refuse.”", motto: true }
    ],
    accessory: { name: "Cork-Cutter Signet Ring", desc: "A heavy gold ring that seals his orders in wax — and slices the foil clean off any bottle he fancies." },
    expressions: [
      { key: "confident", label: "Confident" }, { key: "amused", label: "Amused" }, { key: "arrogant", label: "Arrogant" },
      { key: "thinking", label: "Thinking" }, { key: "threatening", label: "Threatening" }
    ],
    poses: [{ key: "idle", label: "Idle" }, { key: "walking", label: "Walking" }, { key: "victory", label: "Victory" }],
    palette: [
      { name: "Deep Burgundy", hex: "#5A1A26" }, { name: "Gold", hex: "#B8902F" }, { name: "Velvet", hex: "#3A1118" },
      { name: "Cream", hex: "#F0E4CC" }, { name: "Smoke", hex: "#4A4038" }
    ],
    caseTag: [{ t: "Case Nº CF-004" }, { t: "Kingpin — At Large", live: true }, { t: "Do Not Approach" }],
    evidence: ["WANTED"],
    threat: { label: "Threat Level", level: 5, word: "KINGPIN", color: "#9c2b32" },
    dossier: [
      { k: "Last Known Location", v: "Napa Valley — private club back room" },
      { k: "Home Wine Region", v: "Napa Valley, California" },
      { k: "Favorite Wine", v: "Cult Cabernet, magnum only" },
      { k: "Case Status", v: "At Large" },
      { k: "Bounty", v: "◆ 2,000,000₣", reward: true }
    ],
    crimes: { title: "Known Crimes", hint: "rap sheet", tag: "EXHIBIT", items: [
      "Ordered the heist of twelve First-Growth cellars in one night.",
      "Launders stolen vintages through a legitimate vineyard front."
    ]},
    travel: [{ name: "NAPA", date: "MMXXII" }, { name: "SONOMA", date: "MMXXIII" }, { name: "BORDEAUX", date: "MMXXIV" }]
  },
  {
    id: "pinot", full: true, faction: "decanted", status: "WANTED", fileNo: "Nº 005",
    name: ["PINOT", "NOIR"], alias: "The Master of Disguise",
    accent: "#3A2730", accent2: "#8B2638", accentSoft: "#9c8a92", monogram: "PN", mapKey: "BURGUNDY",
    bio: "Nobody has ever seen the real face of Pinot Noir — only the dozens it borrows. A master of disguise who walks into a sealed vault wearing the guard's uniform and strolls out wearing the curator's. By the time the alarm sounds, it's already someone else entirely.",
    stats: [
      { k: "Specialty", v: "Disguise · Mimicry · Misdirection" },
      { k: "Weapon", v: "Theatrical Makeup Kit" },
      { k: "Motto", v: "“You've never actually met me.”", motto: true }
    ],
    accessory: { name: "Chameleon Kit", desc: "A slim case of prosthetics, lenses and pressed-powder identities — every face it has ever worn, filed by name." },
    expressions: [
      { key: "winemaker", label: "Winemaker" }, { key: "sommelier", label: "Sommelier" }, { key: "auctioneer", label: "Auctioneer" },
      { key: "wine-critic", label: "Wine Critic" }, { key: "importer", label: "Importer" }
    ],
    poses: [{ key: "idle", label: "Idle" }, { key: "walking", label: "Walking" }, { key: "disappearing", label: "Disappearing" }],
    palette: [
      { name: "Shadow", hex: "#3A2730" }, { name: "Cabernet", hex: "#8B2638" }, { name: "Charcoal", hex: "#2A262C" },
      { name: "Ash", hex: "#9C8A92" }, { name: "Bone", hex: "#E8E0D4" }
    ],
    caseTag: [{ t: "Case Nº PN-005" }, { t: "Identity Unknown", live: true }, { t: "Shapeshifter" }],
    evidence: ["WANTED"],
    threat: { label: "Threat Level", level: 4, word: "PHANTOM", color: "#C8742E" },
    dossier: [
      { k: "Last Known Location", v: "Unknown — wearing someone else's face" },
      { k: "Home Wine Region", v: "Burgundy, France (unconfirmed)" },
      { k: "Favorite Wine", v: "Whatever its current disguise drinks" },
      { k: "Case Status", v: "Identity Pending" },
      { k: "Bounty", v: "◆ 750,000₣", reward: true }
    ],
    crimes: { title: "Known Crimes", hint: "rap sheet", tag: "EXHIBIT", items: [
      "Impersonated a W.I.N.E. agent to walk into a sealed vault.",
      "Framed three innocent sommeliers for crimes it committed."
    ]},
    travel: [{ name: "BURGUNDY", date: "MMXXI" }, { name: "WILLAMETTE", date: "MMXXIII" }, { name: "MOSEL", date: "MMXXIV" }]
  },
  {
    id: "decanter", full: true, faction: "decanted", status: "WANTED", fileNo: "Nº 006",
    name: ["THE", "DECANTER"], alias: "Luxury Art & Wine Thief",
    accent: "#4A5A66", accent2: "#C8D2D8", accentSoft: "#a6b4bd", monogram: "D", mapKey: "PIEDMONT",
    bio: "Tall, glacial, and impossibly precise. The Decanter glides through reinforced gallery glass to lift the rarest vintage in the room — and the masterpiece hanging beside it. He breathes once, lets the moment aerate, and is gone before the security feed updates.",
    stats: [
      { k: "Specialty", v: "Glasswork · Heists · Fine Art" },
      { k: "Weapon", v: "Diamond Glass-Cutter" },
      { k: "Motto", v: "“I only steal the finest vintages.”", motto: true }
    ],
    accessory: { name: "Diamond Glass-Cutter", desc: "A jeweller's tool that scores museum glass in one silent arc — leaving a perfect circle and an empty pedestal." },
    expressions: [
      { key: "confident", label: "Confident" }, { key: "amused", label: "Amused" }, { key: "thinking", label: "Thinking" },
      { key: "focused", label: "Focused" }, { key: "intrigued", label: "Intrigued" }
    ],
    poses: [{ key: "idle", label: "Idle" }, { key: "walking", label: "Walking" }, { key: "victory", label: "Victory" }],
    palette: [
      { name: "Slate Blue", hex: "#4A5A66" }, { name: "Crystal", hex: "#C8D2D8" }, { name: "Midnight", hex: "#232B31" },
      { name: "Pewter", hex: "#8A98A0" }, { name: "Frost", hex: "#EEF2F4" }
    ],
    caseTag: [{ t: "Case Nº DC-006" }, { t: "Active — Auction Circuit", live: true }, { t: "Glass Specialist" }],
    evidence: ["WANTED"],
    threat: { label: "Threat Level", level: 4, word: "ELUSIVE", color: "#C8742E" },
    dossier: [
      { k: "Last Known Location", v: "Geneva freeport — auction circuit" },
      { k: "Home Wine Region", v: "Piedmont, Italy" },
      { k: "Favorite Wine", v: "Barolo, decanted exactly three hours" },
      { k: "Case Status", v: "Active" },
      { k: "Bounty", v: "◆ 900,000₣", reward: true }
    ],
    crimes: { title: "Known Crimes", hint: "rap sheet", tag: "EXHIBIT", items: [
      "Lifted a museum Barolo through reinforced display glass.",
      "Stole the painting on the wall beside it, for good measure."
    ]},
    travel: [{ name: "PIEDMONT", date: "MMXXII" }, { name: "TUSCANY", date: "MMXXIII" }, { name: "RIOJA", date: "MMXXIV" }]
  },
  {
    id: "renee", full: true, faction: "decanted", status: "WANTED", fileNo: "Nº 007",
    name: ["ROSÉ", "RENÉE"], alias: "The Social Media Criminal",
    accent: "#B85C7A", accent2: "#E8B4C4", accentSoft: "#dba9bd", monogram: "RR", mapKey: "PROVENCE",
    bio: "The wine world's most-followed thief. Rosé Renée doesn't break into cellars — she breaks the internet, lifting entire winery campaigns and posting the evidence before the brand even notices. Every clue she leaves is captioned, filtered, and trending by lunch.",
    stats: [
      { k: "Specialty", v: "Branding Heists · Virality · Leaks" },
      { k: "Weapon", v: "Ring-Light Drone" },
      { k: "Motto", v: "“If it's not aesthetic, is it even wine?”", motto: true }
    ],
    accessory: { name: "Ring-Light Drone", desc: "A rose-gold camera drone that lights her getaway and live-streams it — to two million followers." },
    expressions: [
      { key: "elegant", label: "Elegant" }, { key: "playful", label: "Playful" }, { key: "knowing", label: "Knowing" },
      { key: "curious", label: "Curious" }, { key: "mysterious", label: "Mysterious" }
    ],
    poses: [{ key: "idle", label: "Idle" }, { key: "walking", label: "Walking" }, { key: "victory", label: "Victory" }],
    palette: [
      { name: "Rosé Pink", hex: "#B85C7A" }, { name: "Blush", hex: "#E8B4C4" }, { name: "Rose Gold", hex: "#D8A48C" },
      { name: "Plum", hex: "#5E2A40" }, { name: "Cream", hex: "#F4E8DE" }
    ],
    caseTag: [{ t: "Case Nº RR-007" }, { t: "Trending Now", live: true }, { t: "Highly Followed" }],
    evidence: ["WANTED"],
    threat: { label: "Threat Level", level: 3, word: "VIRAL", color: "#B8902F" },
    dossier: [
      { k: "Last Known Location", v: "Geotag pending — trending now" },
      { k: "Home Wine Region", v: "Provence, France" },
      { k: "Favorite Wine", v: "Pale rosé, ring light optional" },
      { k: "Case Status", v: "Active" },
      { k: "Bounty", v: "◆ 300,000₣", reward: true }
    ],
    crimes: { title: "Known Crimes", hint: "rap sheet", tag: "EXHIBIT", items: [
      "Stole three winery ad campaigns the week before launch.",
      "Leaked unreleased label art to two million followers."
    ]},
    travel: [{ name: "PROVENCE", date: "MMXXIII" }, { name: "MARLBOROUGH", date: "MMXXIV" }, { name: "STELLENBOSCH", date: "MMXXIV" }]
  },
  {
    id: "jack", full: true, faction: "decanted", status: "WANTED", fileNo: "Nº 008",
    name: ["CABERNET", "JACK"], alias: "The Treasure Hunter",
    accent: "#7A3B22", accent2: "#C9A24B", accentSoft: "#c0967a", monogram: "CJ", mapKey: "DOURO",
    bio: "Half sommelier, half swashbuckler. Cabernet Jack chases legendary lost bottles down every coastline with a salt-stained map nobody else can read. He's not in it for the money — he's in it for the one bottle the world swears can't still exist.",
    stats: [
      { k: "Specialty", v: "Lost Vintages · Navigation · Salvage" },
      { k: "Weapon", v: "Cork Compass" },
      { k: "Motto", v: "“X marks the vintage.”", motto: true }
    ],
    accessory: { name: "Cork Compass", desc: "A brass compass capped with an ancient cork — its needle, he swears, points toward the oldest wine still unfound." },
    expressions: [
      { key: "confident", label: "Confident" }, { key: "amused", label: "Amused" }, { key: "focused", label: "Focused" },
      { key: "surprised", label: "Surprised" }, { key: "determined", label: "Determined" }
    ],
    poses: [{ key: "idle", label: "Idle" }, { key: "walking", label: "Walking" }, { key: "victory", label: "Victory" }],
    palette: [
      { name: "Rust", hex: "#7A3B22" }, { name: "Brass", hex: "#C9A24B" }, { name: "Sea Navy", hex: "#2C3A44" },
      { name: "Sand", hex: "#D8C49A" }, { name: "Wine", hex: "#5E1F2A" }
    ],
    caseTag: [{ t: "Case Nº CJ-008" }, { t: "Active — At Sea", live: true }, { t: "Map in Hand" }],
    evidence: ["WANTED"],
    threat: { label: "Threat Level", level: 4, word: "ROGUE", color: "#C8742E" },
    dossier: [
      { k: "Last Known Location", v: "Somewhere along the Douro, under sail" },
      { k: "Home Wine Region", v: "Douro Valley, Portugal" },
      { k: "Favorite Wine", v: "Whatever's been lost at sea the longest" },
      { k: "Case Status", v: "Active" },
      { k: "Bounty", v: "◆ 650,000₣", reward: true }
    ],
    crimes: { title: "Known Crimes", hint: "rap sheet", tag: "EXHIBIT", items: [
      "Looted a shipwreck cellar off the Portuguese coast.",
      "Stole regional treasure maps from three archives."
    ]},
    travel: [{ name: "DOURO", date: "MMXXII" }, { name: "PATAGONIA", date: "MMXXIII" }, { name: "BAROSSA", date: "MMXXIV" }]
  }
];
