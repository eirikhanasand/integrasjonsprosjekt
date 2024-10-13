import { upgradeItem, consumableItem, skinItem } from '@/interfaces';

export const upgrades: { title: string; data: upgradeItem[] }[] = [
    {
        title: 'Upgrades',
        data: [
            {
                id: '1',
                name: 'Bag Upgrade',
                type: 'upgradeItem',
                price: [10, 20, 30, 40, 50],
                currentLevel: 0,
                maxLevel: 5,
                image: require('@assets/shop/school-bag.png'),
            },
            {
                id: '2',
                name: 'Coin Multiplier',
                type: 'upgradeItem',
                price: [10, 20, 30, 40, 50],
                currentLevel: 0,
                maxLevel: 5,
                image: require('@assets/shop/calculator.png'),
            },
        ],
    },
]

export const consumables: { title: string; data: consumableItem[] }[] = [
    {
        title: 'Consumables',
        data: [
            {
                id: '3',
                name: 'Start Boost',
                type: 'consumableItem',
                price: [10],
                quantity: 50,  // Added quantity for Start Boost
                image: require('@assets/shop/coffee-cup.png'),
            },
            {
                id: '4',
                name: 'Electric Scooter',
                type: 'consumableItem',
                price: [15],
                quantity: 30,  // Added quantity for Electric Scooter
                image: require('@assets/shop/electric-scooter.png'),
            },
        ],
    },
]

export const skins: { title: string; data: skinItem[] }[] = [
    {
        title: 'Skins',
        data: [
            {
                id: '5',
                name: 'Cool Skin',
                type: 'skinItem',
                price: [20],
                image: require('@assets/shop/boy.png'),
            },
            {
                id: '6',
                name: 'Cool Skin',
                type: 'skinItem',
                price: [20],
                image: require('@assets/shop/boy.png'),
            },
        ],
    },
]
