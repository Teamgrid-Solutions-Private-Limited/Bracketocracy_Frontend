import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_MAIN } from './API';

const initialState = {
    inviteFriendLeagues: [],
    status: 'idle',
    error: null,
};

export const createinviteFriendLeagues = createAsyncThunk(
    'createinviteFriendLeagues',
    async ({ emails, league }, { rejectWithValue }) => {
        try {
            
            const response = await axios.post(
                `${API_MAIN}/invitation/invitation/invite/${league}`,
                { email: emails },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data; 
        } catch (error) {
            
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteinviteFriendLeagues = createAsyncThunk(
    'deleteinviteFriendLeagues',
    async (leagueId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                `${API_MAIN}/league/league/delete/${leagueId}`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data; 
        } catch (error) {
            // Use rejectWithValue to return a custom error payload
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const inviteFriendLeaguesSlice = createSlice({
    name: 'inviteFriendLeagues',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createinviteFriendLeagues.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createinviteFriendLeagues.fulfilled, (state, action) => {
                state.status = 'idle';
                state.inviteFriendLeagues = action.payload; // Assuming payload is the data you need
                state.error = null;
            })
            .addCase(createinviteFriendLeagues.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.payload; // Handle error payload
            })
            .addCase(deleteinviteFriendLeagues.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteinviteFriendLeagues.fulfilled, (state) => {
                state.status = 'idle';
                // You might want to handle state updates after deletion here
                state.error = null;
            })
            .addCase(deleteinviteFriendLeagues.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.payload; // Handle error payload
            });
    },
});

export default inviteFriendLeaguesSlice.reducer;
