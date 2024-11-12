import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_MAIN } from "./API";
import axios from "axios";


const initialState = {
  countDowns: [],
  isLoader: false,
  isError: false,
  errorMessage: "",
};
// GET: Fetch all countdowns
export const fetchCountdowns = createAsyncThunk(
  "countdown/fetchCountdowns",
  async () => {
    try{
      const res = await axios.get(`${API_MAIN}/countdown/countdown/show`);
      return res.data.info;
    }
    catch (error) {
      throw error;
    }
  }
);

const countdownSlice = createSlice({
  name: "countdown",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountdowns.pending, (state) => {
        state.isLoader = true;
      })
      .addCase(fetchCountdowns.fulfilled, (state, action) => {
        state.isLoader = false;
        state.countDowns = action.payload;
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
