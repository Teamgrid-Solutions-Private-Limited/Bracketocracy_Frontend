// seasonsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create an async thunk for fetching data
export const fetchNewSeasonIds = createAsyncThunk(
  'seasons/fetchNewSeasonIds',
  async () => {
    const response = await axios.get('https://v2.bracketocracy.com/season/season/views');
    const newSeasonIds = response.data.data
      .filter(season => season.status === "new")
      .map(season => season._id);
    return newSeasonIds;
  }
);

const seasonsSlice = createSlice({
  name: 'seasons',
  initialState: {
    newSeasonIds: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewSeasonIds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewSeasonIds.fulfilled, (state, action) => {
        state.loading = false;
        state.newSeasonIds = action.payload;
      })
      .addCase(fetchNewSeasonIds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default seasonsSlice.reducer;
