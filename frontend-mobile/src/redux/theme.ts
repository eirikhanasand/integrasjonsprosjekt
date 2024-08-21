import { createSlice } from "@reduxjs/toolkit"
import Dark from "@themes/dark"

// Declares the theme slice
export const ThemeSlice = createSlice({
    // Names the slice as "theme"
    name: "theme",
    // Initial state of the slice
    initialState: {
        // Default 0 (dark theme)
        value: 0,
        isDark: true,
        theme: Dark
    },
    // Declares reducers
    reducers: {
        // Function to change theme
        changeTheme(state) {
            // Increments state.theme by 1
            state.value += 1
            state.isDark = true
            state.theme = Dark
        },
        // Function to reset theme
        resetTheme(state) {
            // Sets it to 0 (dark theme)
            state.value = 0
            state.isDark = true
            state.theme = Dark
        },
        // Function to change to a specific theme using a number prop
        setTheme(state, action) {
            // Changes theme based on number given
            state.value = action.payload
            state.isDark = true
            state.theme = Dark
        }
    }
})

// Exports functions
export const { changeTheme, resetTheme, setTheme } = ThemeSlice.actions

// Exports the theme slice itself
export default ThemeSlice.reducer
