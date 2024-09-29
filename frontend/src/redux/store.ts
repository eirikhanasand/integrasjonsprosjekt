import AsyncStorage from "@react-native-async-storage/async-storage"
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { persistReducer } from "redux-persist"
import LangReducer from "@redux/lang"
import ThemeReducer from "@redux/theme"
import UserReducer from "@redux/user"
import GameReducer from "@redux/game"
import { thunk } from "redux-thunk"

// Combines all reducers
const reducers = combineReducers({
    // Theme reducer
    theme: ThemeReducer,
    // Language reducer
    lang: LangReducer,
    // User reducer
    user: UserReducer,
    // Game reducer
    game: GameReducer
})

  // Function to localstore redux state
const saveState = {
    // Key property: root
    key: "root",
    // Declares which storage to use, AsyncStorage has most active community
    storage: AsyncStorage,
    // Whitelists the names of the states to save
    whitelist: [
        "lang",
        "theme",
        "user",
        "game"
    ]
}

// Persistor to remember the state
const persistedReducer = persistReducer(saveState, reducers)

// Function to configure the store
const Store = configureStore({
    // The combinded reducer
    reducer: persistedReducer,
    // Middleware to interact with AsyncStorage (must be of any type due to underlying API type error)
    middleware: () => [thunk] as any
})

// Exporting the full Redux Store
export default Store
