// game.ts (frontend/src/redux/game.ts)

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { GameState, UpgradeItem, ConsumableItem, SkinItem } from "@/interfaces"
import { upgrades, consumables, skins } from "@/screens/shop/items"

// Initialize dynamic properties in the state
const initialUpgradesState: { [id: string]: { currentLevel: number } } = {}
upgrades[0]?.data.forEach((item: UpgradeItem) => {
    initialUpgradesState[item.id] = { currentLevel: 0 }
})

const initialConsumablesState: { [id: string]: { quantity: number } } = {}
consumables[0]?.data.forEach((item: ConsumableItem) => {
    initialConsumablesState[item.id] = { quantity: 0 }
})

const initialSkinsState: { [id: string]: { unlocked: boolean } } = {}
skins[0]?.data.forEach((item: SkinItem) => {
    initialSkinsState[item.id] = { unlocked: false }
})

const initialState: GameState = {
    coins: 0,
    startTime: 0,
    inGame: false,
    alive: true,
    score: 0,
    gameId: null,
    highscore: 0,
    multiplier: 1,
    coinMultiplier: 1,
    consumables: initialConsumablesState,
    upgrades: initialUpgradesState,
    skins: initialSkinsState,
}

// Create the slice
export const gameSlice = createSlice({
    name: "game",
    initialState,
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
        purchaseConsumable(
            state,
            action: PayloadAction<{ id: string, price: number }>
        ) {
            const { id, price } = action.payload
            if (state.coins >= price) {
                state.coins -= price
                state.consumables[id].quantity += 1
            }
        },
        upgradeItem(state, action: PayloadAction<{ id: string }>) {
            const { id } = action.payload
            const upgrade = state.upgrades[id]
            const item = upgrades[0]?.data.find((item) => item.id === id)

            if (upgrade && item && upgrade.currentLevel < item.maxLevel) {
                const price = item.price[upgrade.currentLevel]
                if (state.coins >= price) {
                    state.coins -= price
                    upgrade.currentLevel += 1
                }
            }
        },
        purchaseSkin(state, action: PayloadAction<{ id: string, price: number }>) {
            const { id, price } = action.payload
            const skin = state.skins[id]
            if (state.coins >= price && skin && !skin.unlocked) {
                state.coins -= price
                skin.unlocked = true
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
} = gameSlice.actions

// Export reducer
export default gameSlice.reducer
