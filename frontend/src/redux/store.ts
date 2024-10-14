// store.ts (frontend/src/redux/store.ts)

import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";

// Import your reducers
import LangReducer from "./lang";
import ThemeReducer from "./theme";
import UserReducer from "./user";
import GameReducer from "./game"; // Adjust the path if necessary

// Combine all reducers
const reducers = combineReducers({
  theme: ThemeReducer,
  lang: LangReducer,
  user: UserReducer,
  game: GameReducer,
});

// Configuration for persisting the Redux state
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["lang", "theme", "user", "game"],
};

// Persistor to remember the state
const persistedReducer = persistReducer(persistConfig, reducers);

// Configure the store
const Store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      thunk: true,
    }),
});

// Export the store
export default Store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
