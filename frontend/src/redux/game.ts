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
       score: 0,
       highscore: 0,
       multiplier: 31,
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
        },
        setScore(state, action) {
            state.score = action.payload
        },
        setHighScore(state, action) {
            console.log("highscore updated")
            state.highscore = action.payload
        },
        setMultiplier(state, action) {
            state.multiplier = action.payload
        }
    }
})

// Exports the change function
export const { 
    addCoins,
    removeCoins,
    setStartTime,
    setInGame,
    setAlive,
    setScore,
    setHighScore,
    setMultiplier
} = GameSlice.actions

// Exports the language slice
export default GameSlice.reducer
