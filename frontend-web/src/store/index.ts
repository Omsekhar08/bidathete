import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import auctionReducer from './slices/auctionSlice';
import teamReducer from './slices/teamSlice';
// import playerReducer from './slices/playerSlice';
import bidReducer from './slices/bidSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    auction: auctionReducer,
    team: teamReducer,
    // player: playerReducer,
    bid: bidReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;