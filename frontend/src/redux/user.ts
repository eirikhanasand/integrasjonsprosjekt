import { createSlice } from "@reduxjs/toolkit"

// Declares User Slice
export const UserSlice = createSlice({
    // Slice name
    name: "user",
    // Initial state
    initialState: {
        // true is Logged in, false is logged out
        authenticated: false,
        username: "",
        userID: "gubb2",
        highscore: 0,
    },
    // Declares slice reducer
    reducers: {
        // Authenticates the user
        authenticate(state) {
            // Authenticate with Discord here (might need middleware function)
            state.authenticated = true
        },
        // Logs out the user
        logout(state) {
            state.authenticated = false
        },
        // Sets the username
        setUsername(state, action) {
            state.username = action.payload
        },
        // Sets the user ID
        setUserID(state, action) {
            state.userID = action.payload
        },
    }
})

// Exports the change function
export const { 
    authenticate, 
    logout,
    setUsername,
    setUserID,
} = UserSlice.actions

// Exports the language slice
export default UserSlice.reducer
