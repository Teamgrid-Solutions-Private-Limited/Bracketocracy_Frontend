import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  teams: [],
  status: 'idle',
  error: null,
};

export const getTeams = createAsyncThunk('teams/getTeams', async () => {
  try {
    const response = await axios.get('http://192.168.1.26:6010/team/team/view');
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
        console.log(state.teams);
        
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
