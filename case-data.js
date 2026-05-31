/* ============================================================
   THE CELLAR FILES — Case engine data (gameplay vertical slice)
   ------------------------------------------------------------
   TRAITS : the deduction matrix. Each suspect (the 7 Decanted)
            has one value per category. Logging the culprit's
            value clears anyone who doesn't share it.
   CASE   : one fully-authored case. The chase follows the
            culprit's travel trail; each leg yields a clue.
   Add a new case by appending to window.CASES.
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
    values: { malbec: "A mess", champagne: "A token", corkfather: "A mess",
              pinot: "Nothing", decanter: "Nothing", renee: "A hashtag", jack: "A mess" }
  }
};

window.CASES = [
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
    /* The chase. Each leg = one stop on the culprit's trail.
       Exactly one lead carries a trait `clue`; one carries `dest:true`. */
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
        dest: {
          clue: "“…OIRE — 19:40.” A river valley known for its sparkling crémant.",
          correct: "LOIRE", options: ["LOIRE", "RIOJA", "MOSEL"]
        }
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
        dest: {
          clue: "A charter to the Cape winelands — first light, Stellenbosch.",
          correct: "STELLENBOSCH", options: ["BORDEAUX", "STELLENBOSCH", "DOURO"]
        }
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
        dest: {
          clue: "Southernmost sauvignon coast · the land of the long white cloud.",
          correct: "MARLBOROUGH", options: ["BAROSSA", "MENDOZA", "MARLBOROUGH"]
        }
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
  }
];
