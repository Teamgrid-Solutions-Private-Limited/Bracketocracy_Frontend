import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_MAIN } from "./API";

export const fetchMatchs = createAsyncThunk(
  "match/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${API_MAIN}/match/match/view`
      );
      console.log(response.data);
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
