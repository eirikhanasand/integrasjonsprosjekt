// Upgrades
export const upgrades: { title: string; data: Upgrade[] }[] = [
  {
    title: "Upgrades",
    data: [
      {
        id: 1,
        name: "Bag Upgrade",
        type: "Upgrade",
        price: [10, 20, 30, 40, 50],
        maxLevel: 5,
        image: require("@assets/shop/school-bag.png"),
      },
      {
        id: 2,
        name: "Coin Multiplier",
        type: "Upgrade",
        price: [15, 30, 45, 60, 75],
        maxLevel: 5,
        image: require("@assets/shop/calculator.png"),
      },
    ],
  },
]

// Consumables
export const consumables: { title: string; data: Consumable[] }[] = [
    {
        title: "Consumables",
        data: [
            {
                id: 3,
                name: "Start Boost",
                type: "Consumable",
                price: [10],
                image: require("@assets/shop/coffee-cup.png"),
            },
            {
                id: 4,
                name: "Electric Scooter",
                type: "Consumable",
                price: [15],
                image: require("@assets/shop/electric-scooter.png"),
            },
        ],
    },
]

// Skins
export const skins: { title: string; data: Skin[] }[] = [
    {
        title: "Skins",
        data: [
            {
                id: 5,
                name: "Cool Skin",
                type: "Skin",
                price: [20],
                image: require("@assets/shop/boy.png"),
            },
            {
                id: 6,
                name: "Another Skin",
                type: "Skin",
                price: [25],
                image: require("@assets/shop/boy.png"),
            },
        ],
    },
];
