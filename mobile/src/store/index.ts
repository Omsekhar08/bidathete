import { configureStore } from '@reduxjs/toolkit';

// Minimal safe reducer so the app can start.
// Replace this with combineReducers({ auth: authReducer, ... }) when your slices are available.
const rootReducer = (state = {}, _action: any) => state;

export const store = configureStore({
  reducer: rootReducer,
});

// Types for convenience
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;