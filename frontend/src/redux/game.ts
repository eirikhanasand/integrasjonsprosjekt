import { createSlice } from "@reduxjs/toolkit"

// Declares Gmae Slice
export const GameSlice = createSlice({
    // Slice name
    name: "game",
    // Initial state
    initialState: {
       coins: 0,
       startTime: 0,
       inGame: false,
       alive: false,
    },
    // Declares slice reducer
    reducers: {
        // Adds coins to the current balance
        addCoins(state, action) {
            state.coins += action.payload
        },
        removeCoins(state, action) {
            state.coins -= action.payload
        },
        setStartTime(state, action) {
            state.startTime = action.payload
        },
        setInGame(state, action) {
            state.inGame = action.payload
        },
        setAlive(state, action) {
            state.alive = action.payload
        }
    }
})

// Exports the change function
export const { 
    addCoins,
    removeCoins,
    setStartTime,
    setInGame,
    setAlive
} = GameSlice.actions

// Exports the language slice
export default GameSlice.reducer
