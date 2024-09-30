import { createSlice } from "@reduxjs/toolkit";

// Declares Game Slice
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
        multiplier: 1, // Multiplier starts at 1
    },
    // Declares slice reducer
    reducers: {
        // Adds coins to the current balance
        addCoins(state, action) {
            const coinsToAdd = action.payload;
            // Check for valid multiplier
            const effectiveMultiplier = typeof state.multiplier === 'number' && !isNaN(state.multiplier) ? state.multiplier : 1;

            if (typeof coinsToAdd === 'number' && !isNaN(coinsToAdd)) {
                const coinsBefore = state.coins;
                const totalCoinsToAdd = coinsToAdd * effectiveMultiplier; // Multiply coins to add by the effective multiplier
                const coinsAfter = coinsBefore + totalCoinsToAdd;

                console.log("Adding coins:", {
                    coinsToAdd,
                    multiplier: effectiveMultiplier,
                    totalCoinsToAdd,
                    coinsBefore,
                    coinsAfter,
                });

                state.coins = coinsAfter;
            } else {
                console.error("Invalid coinsToAdd value:", coinsToAdd);
            }
        },
        // Removes coins from the current balance
        removeCoins(state, action) {
            const coinsToRemove = action.payload;
            if (
                typeof coinsToRemove === 'number' &&
                !isNaN(coinsToRemove) &&
                state.coins >= coinsToRemove
            ) {
                const coinsBefore = state.coins;
                const coinsAfter = coinsBefore - coinsToRemove;

                console.log("Removing coins:", {
                    coinsToRemove,
                    coinsBefore,
                    coinsAfter,
                });

                state.coins = coinsAfter;
            } else {
                console.error("Invalid coinsToRemove value:", coinsToRemove);
            }
        },
        setStartTime(state, action) {
            state.startTime = action.payload;
        },
        setInGame(state, action) {
            state.inGame = action.payload;
        },
        setAlive(state, action) {
            state.alive = action.payload;
        },
        setScore(state, action) {
            state.score = action.payload;
        },
        setHighScore(state, action) {
            state.highscore = action.payload;
        },
        setMultiplier(state, action) {
            const newMultiplier = action.payload;
            if (typeof newMultiplier === 'number' && newMultiplier >= 0) {
                console.log("Setting new multiplier:", newMultiplier);
                state.multiplier = newMultiplier;
            } else {
                console.error("Invalid multiplier value:", newMultiplier);
            }
        },
        // New action to increment the multiplier by a given value
        increaseMultiplier(state, action) {
            const incrementValue = action.payload;
            if (typeof incrementValue === 'number' && incrementValue > 0) {
                console.log("Increasing multiplier by:", incrementValue);
                state.multiplier += incrementValue;
            } else {
                console.error("Invalid incrementValue:", incrementValue);
            }
        },
    },
});

// Exports the change function
export const {
    addCoins,
    removeCoins,
    setStartTime,
    setInGame,
    setAlive,
    setScore,
    setHighScore,
    setMultiplier,
    increaseMultiplier,
} = GameSlice.actions;

// Exports the game slice
export default GameSlice.reducer;
