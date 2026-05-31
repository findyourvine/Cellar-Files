/* THE CELLAR FILES — character asset manifest (committed assets)
 * Every src below points to a real PNG under /public/assets (served at /assets).
 * Some are flagged "needs replacement" in docs/asset-quality-report.md.
 */
export type AssetStatus = "ACTIVE_AGENT" | "AT_LARGE" | "WANTED" | "CAPTURED" | "UNKNOWN";
export type CharacterAsset = {
  slug: string; id: string; displayName: string; role: string; status: AssetStatus;
  dossierId: string; primaryColor: string; secondaryColor: string; accentColor: string;
  expressions: { key: string; label: string; src: string }[];
  poses: { key: string; label: string; src: string }[];
};
export const characterAssets: CharacterAsset[] = [
  {
    "slug": "cork",
    "id": "cork",
    "displayName": "CORK CONNOISSEUR",
    "role": "Chief of W.I.N.E.",
    "status": "ACTIVE_AGENT",
    "dossierId": "CC-01",
    "primaryColor": "#6E2230",
    "secondaryColor": "#B8902F",
    "accentColor": "#6E2230",
    "expressions": [
      {
        "key": "confident",
        "label": "Confident",
        "src": "/assets/characters/cork/expressions/cork-expr-confident.png"
      },
      {
        "key": "thinking",
        "label": "Thinking",
        "src": "/assets/characters/cork/expressions/cork-expr-thinking.png"
      },
      {
        "key": "amused",
        "label": "Amused",
        "src": "/assets/characters/cork/expressions/cork-expr-amused.png"
      },
      {
        "key": "surprised",
        "label": "Surprised",
        "src": "/assets/characters/cork/expressions/cork-expr-surprised.png"
      }
    ],
    "poses": [
      {
        "key": "idle",
        "label": "Idle",
        "src": "/assets/characters/cork/poses/cork-pose-idle.png"
      },
      {
        "key": "walking",
        "label": "Walking",
        "src": "/assets/characters/cork/poses/cork-pose-walking.png"
      },
      {
        "key": "victory",
        "label": "Victory",
        "src": "/assets/characters/cork/poses/cork-pose-victory.png"
      }
    ]
  },
  {
    "slug": "malbec-mike",
    "id": "malbec",
    "displayName": "MALBEC MIKE",
    "role": "The Wine Smuggler",
    "status": "WANTED",
    "dossierId": "MM-02",
    "primaryColor": "#4E2A5E",
    "secondaryColor": "#C8C6CB",
    "accentColor": "#4E2A5E",
    "expressions": [
      {
        "key": "charming",
        "label": "Charming",
        "src": "/assets/characters/malbec-mike/expressions/malbec-mike-expr-charming.png"
      },
      {
        "key": "cocky",
        "label": "Cocky",
        "src": "/assets/characters/malbec-mike/expressions/malbec-mike-expr-cocky.png"
      },
      {
        "key": "laughing",
        "label": "Laughing",
        "src": "/assets/characters/malbec-mike/expressions/malbec-mike-expr-laughing.png"
      },
      {
        "key": "focused",
        "label": "Focused",
        "src": "/assets/characters/malbec-mike/expressions/malbec-mike-expr-focused.png"
      },
      {
        "key": "winking",
        "label": "Winking",
        "src": "/assets/characters/malbec-mike/expressions/malbec-mike-expr-winking.png"
      }
    ],
    "poses": [
      {
        "key": "idle",
        "label": "Idle",
        "src": "/assets/characters/malbec-mike/poses/malbec-mike-pose-idle.png"
      },
      {
        "key": "walking",
        "label": "Walking",
        "src": "/assets/characters/malbec-mike/poses/malbec-mike-pose-walking.png"
      },
      {
        "key": "victory",
        "label": "Victory",
        "src": "/assets/characters/malbec-mike/poses/malbec-mike-pose-victory.png"
      }
    ]
  },
  {
    "slug": "champagne",
    "id": "champagne",
    "displayName": "LADY CHAMPAGNE",
    "role": "The Bubbly Phantom",
    "status": "WANTED",
    "dossierId": "LC-02",
    "primaryColor": "#A6801F",
    "secondaryColor": "#E7D196",
    "accentColor": "#B8902F",
    "expressions": [
      {
        "key": "elegant",
        "label": "Elegant",
        "src": "/assets/characters/champagne/expressions/champagne-expr-elegant.png"
      },
      {
        "key": "playful",
        "label": "Playful",
        "src": "/assets/characters/champagne/expressions/champagne-expr-playful.png"
      },
      {
        "key": "knowing",
        "label": "Knowing",
        "src": "/assets/characters/champagne/expressions/champagne-expr-knowing.png"
      },
      {
        "key": "curious",
        "label": "Curious",
        "src": "/assets/characters/champagne/expressions/champagne-expr-curious.png"
      },
      {
        "key": "mysterious",
        "label": "Mysterious",
        "src": "/assets/characters/champagne/expressions/champagne-expr-mysterious.png"
      }
    ],
    "poses": [
      {
        "key": "idle",
        "label": "Idle",
        "src": "/assets/characters/champagne/poses/champagne-pose-idle.png"
      },
      {
        "key": "walking",
        "label": "Walking",
        "src": "/assets/characters/champagne/poses/champagne-pose-walking.png"
      },
      {
        "key": "victory",
        "label": "Victory",
        "src": "/assets/characters/champagne/poses/champagne-pose-victory.png"
      }
    ]
  },
  {
    "slug": "rose-renee",
    "id": "renee",
    "displayName": "ROSÉ RENÉE",
    "role": "The Social Media Criminal",
    "status": "WANTED",
    "dossierId": "RR-02",
    "primaryColor": "#B85C7A",
    "secondaryColor": "#E8B4C4",
    "accentColor": "#B85C7A",
    "expressions": [
      {
        "key": "elegant",
        "label": "Elegant",
        "src": "/assets/characters/rose-renee/expressions/rose-renee-expr-elegant.png"
      },
      {
        "key": "playful",
        "label": "Playful",
        "src": "/assets/characters/rose-renee/expressions/rose-renee-expr-playful.png"
      },
      {
        "key": "knowing",
        "label": "Knowing",
        "src": "/assets/characters/rose-renee/expressions/rose-renee-expr-knowing.png"
      },
      {
        "key": "curious",
        "label": "Curious",
        "src": "/assets/characters/rose-renee/expressions/rose-renee-expr-curious.png"
      },
      {
        "key": "mysterious",
        "label": "Mysterious",
        "src": "/assets/characters/rose-renee/expressions/rose-renee-expr-mysterious.png"
      }
    ],
    "poses": [
      {
        "key": "idle",
        "label": "Idle",
        "src": "/assets/characters/rose-renee/poses/rose-renee-pose-idle.png"
      },
      {
        "key": "walking",
        "label": "Walking",
        "src": "/assets/characters/rose-renee/poses/rose-renee-pose-walking.png"
      },
      {
        "key": "victory",
        "label": "Victory",
        "src": "/assets/characters/rose-renee/poses/rose-renee-pose-victory.png"
      }
    ]
  },
  {
    "slug": "cabernet-jack",
    "id": "jack",
    "displayName": "CABERNET JACK",
    "role": "The Treasure Hunter",
    "status": "WANTED",
    "dossierId": "CJ-07",
    "primaryColor": "#7A3B22",
    "secondaryColor": "#C9A24B",
    "accentColor": "#7A3B22",
    "expressions": [
      {
        "key": "confident",
        "label": "Confident",
        "src": "/assets/characters/cabernet-jack/expressions/cabernet-jack-expr-confident.png"
      },
      {
        "key": "amused",
        "label": "Amused",
        "src": "/assets/characters/cabernet-jack/expressions/cabernet-jack-expr-amused.png"
      },
      {
        "key": "focused",
        "label": "Focused",
        "src": "/assets/characters/cabernet-jack/expressions/cabernet-jack-expr-focused.png"
      },
      {
        "key": "surprised",
        "label": "Surprised",
        "src": "/assets/characters/cabernet-jack/expressions/cabernet-jack-expr-surprised.png"
      },
      {
        "key": "determined",
        "label": "Determined",
        "src": "/assets/characters/cabernet-jack/expressions/cabernet-jack-expr-determined.png"
      }
    ],
    "poses": [
      {
        "key": "idle",
        "label": "Idle",
        "src": "/assets/characters/cabernet-jack/poses/cabernet-jack-pose-idle.png"
      },
      {
        "key": "walking",
        "label": "Walking",
        "src": "/assets/characters/cabernet-jack/poses/cabernet-jack-pose-walking.png"
      },
      {
        "key": "victory",
        "label": "Victory",
        "src": "/assets/characters/cabernet-jack/poses/cabernet-jack-pose-victory.png"
      }
    ]
  },
  {
    "slug": "corkfather",
    "id": "corkfather",
    "displayName": "THE CORKFATHER",
    "role": "The Crime Boss",
    "status": "WANTED",
    "dossierId": "CF-01",
    "primaryColor": "#5A1A26",
    "secondaryColor": "#B8902F",
    "accentColor": "#5A1A26",
    "expressions": [
      {
        "key": "confident",
        "label": "Confident",
        "src": "/assets/characters/corkfather/expressions/corkfather-expr-confident.png"
      },
      {
        "key": "amused",
        "label": "Amused",
        "src": "/assets/characters/corkfather/expressions/corkfather-expr-amused.png"
      },
      {
        "key": "arrogant",
        "label": "Arrogant",
        "src": "/assets/characters/corkfather/expressions/corkfather-expr-arrogant.png"
      },
      {
        "key": "thinking",
        "label": "Thinking",
        "src": "/assets/characters/corkfather/expressions/corkfather-expr-thinking.png"
      },
      {
        "key": "threatening",
        "label": "Threatening",
        "src": "/assets/characters/corkfather/expressions/corkfather-expr-threatening.png"
      }
    ],
    "poses": [
      {
        "key": "idle",
        "label": "Idle",
        "src": "/assets/characters/corkfather/poses/corkfather-pose-idle.png"
      },
      {
        "key": "walking",
        "label": "Walking",
        "src": "/assets/characters/corkfather/poses/corkfather-pose-walking.png"
      },
      {
        "key": "victory",
        "label": "Victory",
        "src": "/assets/characters/corkfather/poses/corkfather-pose-victory.png"
      }
    ]
  },
  {
    "slug": "decanter",
    "id": "decanter",
    "displayName": "THE DECANTER",
    "role": "Luxury Art & Wine Thief",
    "status": "WANTED",
    "dossierId": "TD-01",
    "primaryColor": "#4A5A66",
    "secondaryColor": "#C8D2D8",
    "accentColor": "#4A5A66",
    "expressions": [
      {
        "key": "confident",
        "label": "Confident",
        "src": "/assets/characters/decanter/expressions/decanter-expr-confident.png"
      },
      {
        "key": "amused",
        "label": "Amused",
        "src": "/assets/characters/decanter/expressions/decanter-expr-amused.png"
      },
      {
        "key": "thinking",
        "label": "Thinking",
        "src": "/assets/characters/decanter/expressions/decanter-expr-thinking.png"
      },
      {
        "key": "focused",
        "label": "Focused",
        "src": "/assets/characters/decanter/expressions/decanter-expr-focused.png"
      },
      {
        "key": "intrigued",
        "label": "Intrigued",
        "src": "/assets/characters/decanter/expressions/decanter-expr-intrigued.png"
      }
    ],
    "poses": [
      {
        "key": "idle",
        "label": "Idle",
        "src": "/assets/characters/decanter/poses/decanter-pose-idle.png"
      },
      {
        "key": "walking",
        "label": "Walking",
        "src": "/assets/characters/decanter/poses/decanter-pose-walking.png"
      },
      {
        "key": "victory",
        "label": "Victory",
        "src": "/assets/characters/decanter/poses/decanter-pose-victory.png"
      }
    ]
  },
  {
    "slug": "pinot-noir",
    "id": "pinot",
    "displayName": "PINOT NOIR",
    "role": "The Master of Disguise",
    "status": "WANTED",
    "dossierId": "PN-01",
    "primaryColor": "#3A2730",
    "secondaryColor": "#8B2638",
    "accentColor": "#3A2730",
    "expressions": [
      {
        "key": "winemaker",
        "label": "Winemaker",
        "src": "/assets/characters/pinot-noir/expressions/pinot-noir-expr-winemaker.png"
      },
      {
        "key": "sommelier",
        "label": "Sommelier",
        "src": "/assets/characters/pinot-noir/expressions/pinot-noir-expr-sommelier.png"
      },
      {
        "key": "auctioneer",
        "label": "Auctioneer",
        "src": "/assets/characters/pinot-noir/expressions/pinot-noir-expr-auctioneer.png"
      },
      {
        "key": "wine-critic",
        "label": "Wine Critic",
        "src": "/assets/characters/pinot-noir/expressions/pinot-noir-expr-wine-critic.png"
      },
      {
        "key": "importer",
        "label": "Importer",
        "src": "/assets/characters/pinot-noir/expressions/pinot-noir-expr-importer.png"
      }
    ],
    "poses": [
      {
        "key": "idle",
        "label": "Idle",
        "src": "/assets/characters/pinot-noir/poses/pinot-noir-pose-idle.png"
      },
      {
        "key": "walking",
        "label": "Walking",
        "src": "/assets/characters/pinot-noir/poses/pinot-noir-pose-walking.png"
      },
      {
        "key": "disappearing",
        "label": "Disappearing",
        "src": "/assets/characters/pinot-noir/poses/pinot-noir-pose-disappearing.png"
      }
    ]
  }
];
