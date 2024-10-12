import { createSlice } from "@reduxjs/toolkit"

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
        gameId: null,
        highscore: 0,
        multiplier: 31,
        coinMultiplier: 1
    },
    // Declares slice reducer
    reducers: {
        // Adds coins to the current balance
        addCoins(state, action) {
            const coinsToAdd = action.payload;
            // Check for valid multiplier
            const effectiveMultiplier = 
            typeof state.coinMultiplier === 'number' 
            && !isNaN(state.coinMultiplier) ? state.coinMultiplier : 1;

            if (typeof coinsToAdd === 'number' && !isNaN(coinsToAdd)) {
                const coinsBefore = state.coins;
                // Multiplies coins to add by the effective multiplier
                const totalCoinsToAdd = coinsToAdd * effectiveMultiplier
                const coinsAfter = coinsBefore + totalCoinsToAdd;

                // console.log("Adding coins:", {
                //     coinsToAdd,
                //     coinMultiplier: effectiveMultiplier,
                //     totalCoinsToAdd,
                //     coinsBefore,
                //     coinsAfter,
                // });

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
                })

                state.coins = coinsAfter
            } else {
                console.error("Invalid coinsToRemove value:", coinsToRemove)
            }
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
            state.highscore = action.payload
        },
        setMultiplier(state, action) {
            state.multiplier = action.payload
        },
        setGameId(state, action) {
            state.gameId = action.payload
        },
        setCoinMultiplier(state, action) {
            const newMultiplier = action.payload;
            if (typeof newMultiplier === 'number' && newMultiplier >= 0) {
                console.log("Setting new coinMultiplier:", newMultiplier);
                state.multiplier = newMultiplier;
            } else {
                console.error("Invalid coinMultiplier value:", newMultiplier);
            }
        },
        // New action to increment the scoreMultiplier by a given value
        increaseCoinMultiplier(state, action) {
            const incrementValue = action.payload;
            if (typeof incrementValue === 'number' && incrementValue > 0) {
                console.log("Increasing coin multiplier by:", incrementValue);
                state.coinMultiplier += incrementValue;
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
    setGameId,
    setCoinMultiplier,
    increaseCoinMultiplier,
} = GameSlice.actions;

// Exports the game slice
export default GameSlice.reducer;
