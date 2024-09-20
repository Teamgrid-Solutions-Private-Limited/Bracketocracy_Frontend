import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_MAIN } from './API';

const initialState = {
  teams: [],
  status: 'idle',
  error: null,
};

export const getTeams = createAsyncThunk('teams/getTeams', async () => {
  try {
    const response = await axios.get(`${API_MAIN}/team/team/view`);
    return response.data.info; 
  } catch (error) {
    throw error;
  }
});

const teamSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTeams.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getTeams.fulfilled, (state, action) => {
        // console.log(state.teams);
        
        state.status = 'succeeded';
        state.teams = action.payload;
      })
      .addCase(getTeams.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default teamSlice.reducer;
