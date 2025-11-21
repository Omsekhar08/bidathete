import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

/**
 * Auction slice
 *
 * - Provides async thunks for fetching auctions and placing bids.
 * - Keeps auctions in a normalized map for quick updates.
 * - Exports actions for selecting an auction and applying realtime updates.
 */

/* Types */
export interface Bid {
    id: string
    userId: string
    amount: number
    createdAt: string
}

export interface Auction {
    id: string
    title: string
    description?: string
    startingPrice: number
    currentPrice: number
    currency?: string
    startsAt?: string
    endsAt?: string
    bids: Bid[]
    status: 'pending' | 'active' | 'closed'
    [key: string]: any
}

interface AuctionsMap {
    [id: string]: Auction
}

interface AuctionState {
    byId: AuctionsMap
    allIds: string[]
    selectedId?: string | null
    loading: boolean
    error?: string | null
}

/* Initial state */
const initialState: AuctionState = {
    byId: {},
    allIds: [],
    selectedId: null,
    loading: false,
    error: null,
}

/* Base API client — adjust baseURL to match your backend */
const api = axios.create({
    baseURL: (globalThis as any)?.process?.env?.REACT_APP_API_BASE_URL ?? '/api',
    headers: { 'Content-Type': 'application/json' },
})

/* Async thunks */
export const fetchAuctions = createAsyncThunk<Auction[]>(
    'auction/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get<Auction[]>('/auctions')
            return res.data
        } catch (err: any) {
            return rejectWithValue(err?.response?.data ?? err.message)
        }
    }
)

export const fetchAuctionById = createAsyncThunk<Auction, string>(
    'auction/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.get<Auction>(`/auctions/${id}`)
            return res.data
        } catch (err: any) {
            return rejectWithValue(err?.response?.data ?? err.message)
        }
    }
)

export const placeBid = createAsyncThunk<
    Bid,
    { auctionId: string; amount: number; userId?: string },
    { rejectValue: string }
>('auction/placeBid', async ({ auctionId, amount }, { rejectWithValue }) => {
    try {
        const res = await api.post<Bid>(`/auctions/${auctionId}/bids`, { amount })
        return res.data
    } catch (err: any) {
        return rejectWithValue(err?.response?.data?.message ?? err.message)
    }
})

/* Utility helpers */
const upsertAuction = (state: AuctionState, auction: Auction) => {
    if (!state.byId[auction.id]) {
        state.allIds.push(auction.id)
    }
    state.byId[auction.id] = auction
}

const addBidToAuction = (state: AuctionState, auctionId: string, bid: Bid) => {
    const auction = state.byId[auctionId]
    if (!auction) return
    // ensure unique bids by id
    if (!auction.bids.find((b) => b.id === bid.id)) {
        auction.bids = [...auction.bids, bid].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    }
    if (bid.amount > auction.currentPrice) {
        auction.currentPrice = bid.amount
    }
}

/* Slice */
const auctionSlice = createSlice({
    name: 'auction',
    initialState,
    reducers: {
        selectAuction(state, action: PayloadAction<string | null>) {
            state.selectedId = action.payload
        },
        applyRealtimeUpdate(state, action: PayloadAction<Partial<Auction> & { id: string }>) {
            const partial = action.payload
            const existing = state.byId[partial.id]
            if (existing) {
                state.byId[partial.id] = { ...existing, ...partial }
            } else {
                // if new, add minimal record
                const newAuction: Auction = {
                    id: partial.id,
                    title: partial.title ?? 'Untitled',
                    description: partial.description,
                    startingPrice: partial.startingPrice ?? 0,
                    currentPrice: partial.currentPrice ?? partial.startingPrice ?? 0,
                    currency: partial.currency ?? 'USD',
                    bids: partial.bids ?? [],
                    status: (partial.status as Auction['status']) ?? 'pending',
                }
                upsertAuction(state, newAuction)
            }
        },
        clearAuctions(state) {
            state.byId = {}
            state.allIds = []
            state.selectedId = null
            state.loading = false
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            /* fetchAll */
            .addCase(fetchAuctions.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchAuctions.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.byId = {}
                state.allIds = []
                action.payload.forEach((a) => {
                    state.byId[a.id] = a
                    state.allIds.push(a.id)
                })
            })
            .addCase(fetchAuctions.rejected, (state, action) => {
                state.loading = false
                state.error = (action.payload as any) ?? action.error.message ?? 'Failed to load auctions'
            })

            /* fetchById */
            .addCase(fetchAuctionById.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchAuctionById.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                upsertAuction(state, action.payload)
            })
            .addCase(fetchAuctionById.rejected, (state, action) => {
                state.loading = false
                state.error = (action.payload as any) ?? action.error.message ?? 'Failed to load auction'
            })

            /* placeBid */
            .addCase(placeBid.pending, (state) => {
                state.error = null
            })
            .addCase(placeBid.fulfilled, (state, action) => {
                // action.meta.arg contains auctionId
                const auctionId = (action.meta.arg as any).auctionId as string
                addBidToAuction(state, auctionId, action.payload)
            })
            .addCase(placeBid.rejected, (state, action) => {
                state.error = (action.payload as any) ?? action.error.message ?? 'Failed to place bid'
            })
    },
})

/* Exports */
export const { selectAuction, applyRealtimeUpdate, clearAuctions } = auctionSlice.actions
export default auctionSlice.reducer

/* Selectors (use your RootState type in real code) */
export const selectAuctionState = (state: any): AuctionState => state.auction ?? initialState
export const selectAllAuctions = (state: any): Auction[] => {
    const s = selectAuctionState(state)
    return s.allIds.map((id) => s.byId[id])
}
export const selectAuctionById = (state: any, id: string): Auction | undefined =>
    selectAuctionState(state).byId[id]
export const selectSelectedAuction = (state: any): Auction | undefined => {
    const s = selectAuctionState(state)
    return s.selectedId ? s.byId[s.selectedId] : undefined
}