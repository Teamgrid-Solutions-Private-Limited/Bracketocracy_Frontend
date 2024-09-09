import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  roundlist: [],
  status: "idle",
  error: null,
};

// Fetch Round Data (GET method)
export const getRounds = createAsyncThunk("getRounds", async () => {
  try {
    const response = await axios.get("http://192.168.1.26:6010/round/round/view");
    return response.data;
  } catch (error) {
    throw error;
  }
});

const roundSlice = createSlice({
  name: "round",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch data
    builder
      .addCase(getRounds.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getRounds.fulfilled, (state, action) => {
        state.status = "idle";
        state.roundlist = action.payload;
        state.error = null;
      })
      .addCase(getRounds.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      });
  },
});

export default roundSlice.reducer;
