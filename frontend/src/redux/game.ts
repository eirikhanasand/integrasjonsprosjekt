import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { 
    upgrades as gameUpgrades, 
    consumables as gameConsumables, 
    skins as gameSkins, 
} from "@/screens/shop/items"

type Item = {
    id: number
    price: number
}

// Declares Game Slice
export const gameSlice = createSlice({
    name: "game",
    initialState: {
        coins: 0,
        startTime: 0,
        inGame: false,
        alive: true,
        score: 0,
        gameId: null,
        highscore: 0,
        multiplier: 1,
        coinMultiplier: 1,
        consumables: [] as OwnedConsumable[],
        upgrades: [] as OwnedUpgrade[],
        skins: [] as number[]
    },
    reducers: {
        setAlive(state, action: PayloadAction<boolean>) {
            state.alive = action.payload
        },
        setScore(state, action: PayloadAction<number>) {
            state.score = action.payload
        },
        setStartTime(state, action: PayloadAction<number>) {
            state.startTime = action.payload
        },
        addCoins(state, action: PayloadAction<number>) {
            state.coins += action.payload
        },
        purchaseConsumable(state, action: PayloadAction<Item>) {
            const { id, price } = action.payload
            const newConsumables = []
            if (state.coins >= price) {
                state.coins -= price
                const consumable = state.consumables.find((consumable) => consumable.id === id) || { id, quantity: 1 }
                
                if (state.consumables.length && state.consumables.find((consumable) => consumable.id === id)) {
                    consumable.quantity += 1

                    for (const item of state.consumables) {
                        if (item.id === id) {
                            newConsumables.push(consumable)
                        } else {
                            newConsumables.push(item)
                        }
                    }

                    state.consumables = newConsumables
                } else {
                    state.consumables.push(consumable)
                }
            }
        },
        upgradeItem(state, action: PayloadAction<{ id: number }>) {
            const { id } = action.payload
            const upgrade = state.upgrades[id] || { id, level: 0 }
            const newUpgrades = []
            const item = gameUpgrades[0].data.find((item) => item.id === id)

            if (upgrade && item && upgrade.level < item.maxLevel) {
                const price = item.price[upgrade.level]
                if (state.coins >= price) {
                    state.coins -= price
                    upgrade.level += 1
                }

                if (state.upgrades.length && state.upgrades.find((a) => a.id === id)) {
                    for (const item of state.upgrades) {
                        if (item.id === id) {
                            newUpgrades.push(upgrade)
                        } else {
                            newUpgrades.push(item)
                        }
                    }
                    
                    state.upgrades = newUpgrades
                } else {
                    state.upgrades.push(upgrade)
                }
            }
        },
        purchaseSkin(state, action: PayloadAction<Item>) {
            const { id, price } = action.payload
            if (state.coins >= price) {
                state.coins -= price
                state.skins.push(id)
            }
        },
        setInGame(state, action) {
            state.inGame = action.payload
        },
        setHighScore(state, action) {
            state.highscore = action.payload
        },
        setMultiplier(state, action) {
            state.multiplier = action.payload
        },
        setGameId(state, action) {
            state.gameId = action.payload
        },
        setCoinMultiplier(state, action) {
            const newMultiplier = action.payload
            if (typeof newMultiplier === "number" && newMultiplier >= 0) {
                state.coinMultiplier = newMultiplier
            } else {
                console.error("Invalid coinMultiplier value:", newMultiplier)
            }
        },
        increaseCoinMultiplier(state, action) {
            const incrementValue = action.payload

            if (typeof incrementValue === "number" && incrementValue > 0) {
                state.coinMultiplier += incrementValue
            } else {
                console.error("Invalid incrementValue:", incrementValue)
            }
        },
        setConsumables(state, action) {
            state.consumables = action.payload
        },
        setUpgrades(state, action) {
            state.upgrades = action.payload
        },
        setSkins(state, action) {
            state.skins = action.payload
        },
        addConsumable(state, action) {
            state.consumables.push(action.payload)
        },
        addUpgrades(state, action) {
            state.upgrades.push(action.payload)
        },
        addSkin(state, action) {
            state.skins.push(action.payload)
        }
    },
})

// Export actions
export const {
    setAlive,
    setScore,
    setStartTime,
    addCoins,
    purchaseConsumable,
    upgradeItem,
    purchaseSkin,
    setInGame,
    setHighScore,
    setMultiplier,
    setGameId,
    setCoinMultiplier,
    increaseCoinMultiplier,
    setConsumables,
    setUpgrades,
    setSkins,
    addConsumable,
    addUpgrades,
    addSkin
} = gameSlice.actions

// Export reducer
export default gameSlice.reducer
