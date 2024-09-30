// Sample data for the store items
const storeSections = [
    {
        title: 'Upgrades',
        data: [
            {
                id: '1',
                name: 'Bag Upgrade',
                basePrice: 10,
                currentLevel: 0,
                maxLevel: 5,
                multiplier: 1,
                image: require('@assets/shop/school-bag.png'),
            },
            {
                id: '2',
                name: 'Coin Multiplier',
                basePrice: 10,
                currentLevel: 0,
                maxLevel: 5,
                multiplier: 1,
                image: require('@assets/shop/calculator.png'),
            },
        ],
    },
    // Other sections like Consumables and Skins remain unchanged
    {
        title: 'Consumables',
        data: [
            { id: '3', name: 'Start boost', price: 10, image: require('@assets/shop/coffee-cup.png') },
            { id: '4', name: 'Electric Scooter', price: 10, image: require('@assets/shop/electric-scooter.png') },
        ],
    },
    {
        title: 'Skins',
        data: [
            { id: '5', name: 'Skin 1', price: 10, image: require('@assets/shop/boy.png') },
            { id: '6', name: 'Skin 2', price: 10, image: require('@assets/shop/boy.png') },
        ],
    },
]

export default storeSections
