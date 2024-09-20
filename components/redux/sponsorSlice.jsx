import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_MAIN } from './API';
const initialState = {
    sponsors: [],
    status: 'idle',
    leagesInMessege:{},
    error: null,
};

export const getSponsor = createAsyncThunk('getSponsor', async (leagueId) => {
    try {
        const response = await axios.get(`${API_MAIN}/sponsor/sponsor/display`,{headers: { 'Content-Type': 'application/json' }});
        return response.data.data;
    } catch (error) {
        throw error;
    }
});

const sponsorSlice = createSlice({
    name: 'sponsor',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSponsor.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getSponsor.fulfilled, (state, action) => {
                state.status = 'idle';
                state.sponsors = action.payload;
                state.error = null;
            })
            .addCase(getSponsor.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.payload;
            })

    },
});

export default sponsorSlice.reducer;