import { createSlice } from "@reduxjs/toolkit";

// Declares Game Slice
export const GameSlice = createSlice({
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
        coinMultiplier: 1,
    },
    // Declares slice reducer
    reducers: {
        addCoins(state, action) {
            const coinsToAdd = action.payload;
            console.log("Action: addCoins, Payload:", coinsToAdd);
            // Check for valid multiplier
            const effectiveMultiplier =
                typeof state.coinMultiplier === "number" && !isNaN(state.coinMultiplier)
                    ? state.coinMultiplier
                    : 1;

            if (typeof coinsToAdd === "number" && !isNaN(coinsToAdd)) {
                const coinsBefore = state.coins;
                // Multiplies coins to add by the effective multiplier
                const totalCoinsToAdd = coinsToAdd * effectiveMultiplier;
                const coinsAfter = coinsBefore + totalCoinsToAdd;

                console.log("Adding coins:", {
                    coinsToAdd,
                    coinMultiplier: effectiveMultiplier,
                    totalCoinsToAdd,
                    coinsBefore,
                    coinsAfter,
                });

                state.coins = coinsAfter;
            } else {
                console.error("Invalid coinsToAdd value:", coinsToAdd);
            }
        },
        removeCoins(state, action) {
            const coinsToRemove = action.payload;
            console.log("Action: removeCoins, Payload:", coinsToRemove);
            if (typeof coinsToRemove === "number" && !isNaN(coinsToRemove) && state.coins >= coinsToRemove) {
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
            console.log("Action: setStartTime, Payload:", action.payload);
            state.startTime = action.payload;
        },
        setInGame(state, action) {
            console.log("Action: setInGame, Payload:", action.payload);
            state.inGame = action.payload;
        },
        setAlive(state, action) {
            console.log("Action: setAlive, Payload:", action.payload);
            state.alive = action.payload;
        },
        setScore(state, action) {
            console.log("Action: setScore, Payload:", action.payload);
            state.score = action.payload;
        },
        setHighScore(state, action) {
            console.log("Action: setHighScore, Payload:", action.payload);
            state.highscore = action.payload;
        },
        setMultiplier(state, action) {
            console.log("Action: setMultiplier, Payload:", action.payload);
            state.multiplier = action.payload;
        },
        setGameId(state, action) {
            console.log("Action: setGameId, Payload:", action.payload);
            state.gameId = action.payload;
        },
        setCoinMultiplier(state, action) {
            const newMultiplier = action.payload;
            console.log("Action: setCoinMultiplier, Payload:", newMultiplier);
            if (typeof newMultiplier === "number" && newMultiplier >= 0) {
                state.coinMultiplier = newMultiplier;
            } else {
                console.error("Invalid coinMultiplier value:", newMultiplier);
            }
        },
        increaseCoinMultiplier(state, action) {
            const incrementValue = action.payload;
            console.log("Action: increaseCoinMultiplier, Payload:", incrementValue);
            if (typeof incrementValue === "number" && incrementValue > 0) {
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
