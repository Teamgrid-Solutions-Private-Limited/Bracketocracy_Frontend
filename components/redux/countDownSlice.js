import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_MAIN } from "./API";

// GET: Fetch all countdowns
export const fetchCountdowns = createAsyncThunk(
  "countdown/fetchCountdowns",
  async () => {
    const res = await fetch(`${API_MAIN}/countdown/countdown/show`);
    if (!res.ok) {
      throw new Error("Failed to fetch countdowns");
    }
    const countdowns = await res.json();
    return countdowns;
  }
);

const countdownSlice = createSlice({
  name: "countdown",
  initialState: {
    countdowns: [],
    isLoader: false,
    isError: false,
    errorMessage: "",
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountdowns.pending, (state) => {
        state.isLoader = true;
      })
      .addCase(fetchCountdowns.fulfilled, (state, action) => {
        state.isLoader = false;
        state.countdowns = action.payload;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(fetchCountdowns.rejected, (state, action) => {
        state.isLoader = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      });
  },
});

// Export the reducer
export default countdownSlice.reducer;
