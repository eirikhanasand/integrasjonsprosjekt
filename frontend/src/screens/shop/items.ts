// items.ts (frontend/src/screens/shop/items.ts)

import { UpgradeItem, ConsumableItem, SkinItem } from "@/interfaces";

// Upgrades Data
export const upgrades: { title: string; data: UpgradeItem[] }[] = [
  {
    title: "Upgrades",
    data: [
      {
        id: "1",
        name: "Bag Upgrade",
        type: "upgradeItem",
        price: [10, 20, 30, 40, 50],
        maxLevel: 5,
        image: require("@assets/shop/school-bag.png"),
      },
      {
        id: "2",
        name: "Coin Multiplier",
        type: "upgradeItem",
        price: [15, 30, 45, 60, 75],
        maxLevel: 5,
        image: require("@assets/shop/calculator.png"),
      },
    ],
  },
];

// Consumables Data
export const consumables: { title: string; data: ConsumableItem[] }[] = [
  {
    title: "Consumables",
    data: [
      {
        id: "3",
        name: "Start Boost",
        type: "consumableItem",
        price: [10],
        image: require("@assets/shop/coffee-cup.png"),
      },
      {
        id: "4",
        name: "Electric Scooter",
        type: "consumableItem",
        price: [15],
        image: require("@assets/shop/electric-scooter.png"),
      },
    ],
  },
];

// Skins Data
export const skins: { title: string; data: SkinItem[] }[] = [
  {
    title: "Skins",
    data: [
      {
        id: "5",
        name: "Cool Skin",
        type: "skinItem",
        price: [20],
        image: require("@assets/shop/boy.png"),
      },
      {
        id: "6",
        name: "Another Skin",
        type: "skinItem",
        price: [25],
        image: require("@assets/shop/boy.png"),
      },
    ],
  },
];
