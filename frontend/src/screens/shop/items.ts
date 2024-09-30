// Sample data for the store items
const upgrades = [
    {
        title: 'Upgrades',
        data: [
            {
                id: '1',
                name: 'Bag Upgrade',
                price: [10, 20, 30, 40, 50],
                currentLevel: 0,
                maxLevel: 5,
                image: require('@assets/shop/school-bag.png'),
            },
            {
                id: '2',
                name: 'Coin Multiplier',
                price: [10, 20, 30, 40, 50],
                currentLevel: 0,
                maxLevel: 5,
                image: require('@assets/shop/calculator.png'),
            },
        ],
    },
]

const consumables = [
    {
        title: 'Consumables',
        data: [
            { 
                id: '3', 
                name: 'Start boost', 
                price: [10],
                image: require('@assets/shop/coffee-cup.png') 
            },
            { 
                id: '4', 
                name: 'Electric Scooter', 
                price: [10],
                image: require('@assets/shop/electric-scooter.png') 
            },
        ],
    },
]

const skins = [
    {
        title: 'Skins',
        data: [
            { 
                id: '5', 
                name: 'Skin 1', 
                price: [10],
                image: require('@assets/shop/boy.png') 
            },
            { 
                id: '6', 
                name: 'Skin 2', 
                price: [10],
                image: require('@assets/shop/boy.png') 
            },
        ],
    },
]

export { upgrades, consumables, skins }
