import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

declare const process: {
    env: {
        REACT_APP_API_URL?: string;
    };
};


const API_BASE = (import.meta as any).env.VITE_API_URL ?? 'http://localhost:3000/api';

// Types
export interface Bid {
    id: string;
    amount: number;
    userId: string;
    itemId: string;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: any;
}

interface BidState {
    items: Bid[];
    selected?: Bid | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error?: string | null;
}

const initialState: BidState = {
    items: [],
    selected: null,
    status: 'idle',
    error: null,
};

// Async thunks
export const fetchBids = createAsyncThunk<Bid[], void, { rejectValue: string }>(
    'bids/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get<Bid[]>(`${API_BASE}/bids`);
            return res.data;
        } catch (err: any) {
            const msg = err?.response?.data?.message ?? err.message ?? 'Failed to fetch bids';
            return rejectWithValue(msg);
        }
    }
);

export const fetchBidById = createAsyncThunk<Bid, string, { rejectValue: string }>(
    'bids/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const res = await axios.get<Bid>(`${API_BASE}/bids/${id}`);
            return res.data;
        } catch (err: any) {
            const msg = err?.response?.data?.message ?? err.message ?? 'Failed to fetch bid';
            return rejectWithValue(msg);
        }
    }
);

export const createBid = createAsyncThunk<Bid, Partial<Bid>, { rejectValue: string }>(
    'bids/create',
    async (payload, { rejectWithValue }) => {
        try {
            const res = await axios.post<Bid>(`${API_BASE}/bids`, payload);
            return res.data;
        } catch (err: any) {
            const msg = err?.response?.data?.message ?? err.message ?? 'Failed to create bid';
            return rejectWithValue(msg);
        }
    }
);

export const updateBid = createAsyncThunk<Bid, { id: string; data: Partial<Bid> }, { rejectValue: string }>(
    'bids/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await axios.put<Bid>(`${API_BASE}/bids/${id}`, data);
            return res.data;
        } catch (err: any) {
            const msg = err?.response?.data?.message ?? err.message ?? 'Failed to update bid';
            return rejectWithValue(msg);
        }
    }
);

export const deleteBid = createAsyncThunk<string, string, { rejectValue: string }>(
    'bids/delete',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_BASE}/bids/${id}`);
            return id;
        } catch (err: any) {
            const msg = err?.response?.data?.message ?? err.message ?? 'Failed to delete bid';
            return rejectWithValue(msg);
        }
    }
);

// Slice
const bidsSlice = createSlice({
    name: 'bids',
    initialState,
    reducers: {
        clearSelectedBid(state) {
            state.selected = null;
        },
        resetBidState(state) {
            state.items = [];
            state.selected = null;
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchBids
            .addCase(fetchBids.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchBids.fulfilled, (state, action: PayloadAction<Bid[]>) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchBids.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ?? action.error.message ?? 'Failed to fetch bids';
            })

            // fetchBidById
            .addCase(fetchBidById.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchBidById.fulfilled, (state, action: PayloadAction<Bid>) => {
                state.status = 'succeeded';
                state.selected = action.payload;
            })
            .addCase(fetchBidById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ?? action.error.message ?? 'Failed to fetch bid';
            })

            // createBid
            .addCase(createBid.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createBid.fulfilled, (state, action: PayloadAction<Bid>) => {
                state.status = 'succeeded';
                state.items.push(action.payload);
                state.selected = action.payload;
            })
            .addCase(createBid.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ?? action.error.message ?? 'Failed to create bid';
            })

            // updateBid
            .addCase(updateBid.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateBid.fulfilled, (state, action: PayloadAction<Bid>) => {
                state.status = 'succeeded';
                const idx = state.items.findIndex((b) => b.id === action.payload.id);
                if (idx !== -1) state.items[idx] = action.payload;
                if (state.selected?.id === action.payload.id) state.selected = action.payload;
            })
            .addCase(updateBid.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ?? action.error.message ?? 'Failed to update bid';
            })

            // deleteBid
            .addCase(deleteBid.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteBid.fulfilled, (state, action: PayloadAction<string>) => {
                state.status = 'succeeded';
                state.items = state.items.filter((b) => b.id !== action.payload);
                if (state.selected?.id === action.payload) state.selected = null;
            })
            .addCase(deleteBid.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ?? action.error.message ?? 'Failed to delete bid';
            });
    },
});

export const { clearSelectedBid, resetBidState } = bidsSlice.actions;

export default bidsSlice.reducer;

// Selectors (state shape: { bids: BidState })
export const selectAllBids = (state: any): Bid[] => state.bids?.items ?? [];
export const selectBidById = (state: any, id: string): Bid | undefined =>
    state.bids?.items?.find((b: Bid) => b.id === id);
export const selectSelectedBid = (state: any): Bid | null | undefined => state.bids?.selected;
export const selectBidStatus = (state: any): BidState['status'] => state.bids?.status ?? 'idle';
export const selectBidError = (state: any): string | null | undefined => state.bids?.error ?? null;