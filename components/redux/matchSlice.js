import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchMatchs = createAsyncThunk(
  "match/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        "http://192.168.1.26:6010/match/match/view"
      );
      
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Unknown error');
    }
  }
);

// Initial State
const initialState = {
  matches: [],
  status: "idle",
  error: null,
};

// Slice
const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatchs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMatchs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.matches = action.payload; // Store all matches data
    })
      
      .addCase(fetchMatchs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default matchSlice.reducer;
