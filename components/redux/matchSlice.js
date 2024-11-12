import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_MAIN } from "./API";
 

const initialState = {
  matches: [],
  status: "idle",
  error: null,
};
export const fetchMatchs = createAsyncThunk(
  "match/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${API_MAIN}/match/matches`
      );
      return response.data.info;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Unknown error');
    }
  }
);
 
// Initial State

 
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
        state.matches = action.payload; 
    })
     
      .addCase(fetchMatchs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});
 
export default matchSlice.reducer;