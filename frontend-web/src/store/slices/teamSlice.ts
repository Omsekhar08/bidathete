import { createSlice, createAsyncThunk, createEntityAdapter, EntityState, PayloadAction } from '@reduxjs/toolkit';

/**
 * Team types and state
 */
export type Team = {
    id: string;
    name: string;
    description?: string;
    members?: string[]; 
    createdAt?: string;
    updatedAt?: string;
};

type ExtraState = {
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: string | null;
    selectedTeamId: string | null;
};

const teamsAdapter = createEntityAdapter<Team>({
    sortComparer: (a, b) => a.name.localeCompare(b.name),
});

export type TeamState = EntityState<Team, string> & ExtraState;

const initialState: TeamState = teamsAdapter.getInitialState({
    loading: 'idle',
    error: null,
    selectedTeamId: null,
});


/**
 * API helper
 * Configure base URL via REACT_APP_API_URL environment variable (or change as needed)
 */
/* Minimal declaration so frontend TypeScript doesn't require installing @types/node */
declare const process: { env: { REACT_APP_API_URL?: string } };

// const API_BASE = process.env.REACT_APP_API_URL ?? 'http://localhost:3000';

const API_BASE = (import.meta as any).env.VITE_API_URL ?? 'http://localhost:3000/api';
/** Helper to parse fetch responses */


async function parseResponse<T>(res: Response): Promise<T> {
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) {
        const message = data?.message ?? res.statusText ?? 'API Error';
        throw new Error(message);
    }
    return data as T;
}

/**
 * Async thunks
 */
export const fetchTeams = createAsyncThunk<Team[], void, { rejectValue: string }>(
    'team/fetchTeams',
    async (_, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_BASE}/teams`);
            return await parseResponse<Team[]>(res);
        } catch (err: any) {
            return rejectWithValue(err.message ?? 'Failed to fetch teams');
        }
    }
);

export const fetchTeamById = createAsyncThunk<Team, string, { rejectValue: string }>(
    'team/fetchTeamById',
    async (id, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_BASE}/teams/${encodeURIComponent(id)}`);
            return await parseResponse<Team>(res);
        } catch (err: any) {
            return rejectWithValue(err.message ?? 'Failed to fetch team');
        }
    }
);

export const createTeam = createAsyncThunk<Team, Partial<Team>, { rejectValue: string }>(
    'team/createTeam',
    async (payload, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_BASE}/teams`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            return await parseResponse<Team>(res);
        } catch (err: any) {
            return rejectWithValue(err.message ?? 'Failed to create team');
        }
    }
);

export const updateTeam = createAsyncThunk<Team, { id: string; changes: Partial<Team> }, { rejectValue: string }>(
    'team/updateTeam',
    async ({ id, changes }, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_BASE}/teams/${encodeURIComponent(id)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(changes),
            });
            return await parseResponse<Team>(res);
        } catch (err: any) {
            return rejectWithValue(err.message ?? 'Failed to update team');
        }
    }
);

export const deleteTeam = createAsyncThunk<string, string, { rejectValue: string }>(
    'team/deleteTeam',
    async (id, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_BASE}/teams/${encodeURIComponent(id)}`, {
                method: 'DELETE',
            });
            // assume API returns success payload or empty; we return id to remove locally
            if (!res.ok) {
                const text = await res.text();
                const data = text ? JSON.parse(text) : null;
                const message = data?.message ?? res.statusText ?? 'Delete failed';
                throw new Error(message);
            }
            return id;
        } catch (err: any) {
            return rejectWithValue(err.message ?? 'Failed to delete team');
        }
    }
);

/**
 * Slice
 */
const teamSlice = createSlice({
    name: 'team',
    initialState,
    reducers: {
        setSelectedTeamId(state, action: PayloadAction<string | null>) {
            state.selectedTeamId = action.payload;
        },
        clearError(state) {
            state.error = null;
        },
        // local (synchronous) upsert helpers if you need optimistic updates
        upsertTeam(state, action: PayloadAction<Team>) {
            teamsAdapter.upsertOne(state, action.payload);
        },
        removeTeamLocal(state, action: PayloadAction<string>) {
            teamsAdapter.removeOne(state, action.payload);
        },
    },
    extraReducers: (builder) => {
        // fetchTeams
        builder.addCase(fetchTeams.pending, (state) => {
            state.loading = 'pending';
            state.error = null;
        });
        builder.addCase(fetchTeams.fulfilled, (state, { payload }) => {
            teamsAdapter.setAll(state, payload);
            state.loading = 'succeeded';
            state.error = null;
        });
        builder.addCase(fetchTeams.rejected, (state, { payload, error }) => {
            state.loading = 'failed';
            state.error = payload ?? error.message ?? 'Failed to fetch teams';
        });

        // fetchTeamById
        builder.addCase(fetchTeamById.pending, (state) => {
            state.loading = 'pending';
            state.error = null;
        });
        builder.addCase(fetchTeamById.fulfilled, (state, { payload }) => {
            teamsAdapter.upsertOne(state, payload);
            state.loading = 'succeeded';
        });
        builder.addCase(fetchTeamById.rejected, (state, { payload, error }) => {
            state.loading = 'failed';
            state.error = payload ?? error.message ?? 'Failed to fetch team';
        });

        // createTeam
        builder.addCase(createTeam.pending, (state) => {
            state.loading = 'pending';
            state.error = null;
        });
        builder.addCase(createTeam.fulfilled, (state, { payload }) => {
            teamsAdapter.addOne(state, payload);
            state.loading = 'succeeded';
        });
        builder.addCase(createTeam.rejected, (state, { payload, error }) => {
            state.loading = 'failed';
            state.error = payload ?? error.message ?? 'Failed to create team';
        });

        // updateTeam
        builder.addCase(updateTeam.pending, (state) => {
            state.loading = 'pending';
            state.error = null;
        });
        builder.addCase(updateTeam.fulfilled, (state, { payload }) => {
            teamsAdapter.upsertOne(state, payload);
            state.loading = 'succeeded';
        });
        builder.addCase(updateTeam.rejected, (state, { payload, error }) => {
            state.loading = 'failed';
            state.error = payload ?? error.message ?? 'Failed to update team';
        });

        // deleteTeam
        builder.addCase(deleteTeam.pending, (state) => {
            state.loading = 'pending';
            state.error = null;
        });
        builder.addCase(deleteTeam.fulfilled, (state, { payload }) => {
            teamsAdapter.removeOne(state, payload);
            state.loading = 'succeeded';
        });
        builder.addCase(deleteTeam.rejected, (state, { payload, error }) => {
            state.loading = 'failed';
            state.error = payload ?? error.message ?? 'Failed to delete team';
        });
    },
});

/**
 * Selectors
 * Note: these selectors assume your store has { team: TeamState } at top-level.
 * If your slice is mounted at a different key, adjust accordingly.
 */
export const {
    selectAll: selectAllTeams,
    selectById: selectTeamById,
    selectIds: selectTeamIds,
    selectEntities: selectTeamEntities,
    selectTotal: selectTeamTotal,
} = teamsAdapter.getSelectors<{ team: TeamState }>((state) => state.team);

export const selectTeamLoading = (state: { team: TeamState }) => state.team.loading;
export const selectTeamError = (state: { team: TeamState }) => state.team.error;
export const selectSelectedTeamId = (state: { team: TeamState }) => state.team.selectedTeamId;
export const selectSelectedTeam = (state: { team: TeamState }) =>
    state.team.selectedTeamId ? selectTeamById(state, state.team.selectedTeamId) : null;

/**
 * Exports
 */
export const { setSelectedTeamId, clearError, upsertTeam, removeTeamLocal } = teamSlice.actions;

export default teamSlice.reducer;