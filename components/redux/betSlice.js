import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_MAIN } from "./API";

export const placeBet = createAsyncThunk(
  "bet/placeBet",
  async ({ matchId, userId, selectedWinner, status, seasonId, betScore }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_MAIN}/bet/bet/placebet`,
        {
          matchId,
          userId,
          selectedWinner,
          status,
          seasonId,
          betScore
        }
      );
      console.log(response.data);
      
      return response.data;
    } catch (error) {
      console.error("Error response:", error.response?.data);
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Unknown error occurred." }
      );
    }
  }
);

export const fetchUserBets = createAsyncThunk(
  "bet/fetchUserBets",
  async ({ userId }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${API_MAIN}/bet/bet/user-bets/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user bets:", error.response?.data);
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Unknown error occurred." }
      );
    }
  }
);

export const updateRound = createAsyncThunk(
  "bet/updateRound",
  async (
    { id, matchId, userId, selectedWinner, status, seasonId, betScore },
    thunkAPI
  ) => {
    try {
      const response = await axios.put(
        `${API_MAIN}/bet/bet/update/${id}`,
        { matchId, userId, selectedWinner, status, seasonId, betScore }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating round:", error.response?.data);
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Unknown error occurred." }
      );
    }
  }
);

const betSlice = createSlice({
  name: "bet",
  initialState: {
    userBets: [], // Renamed for clarity
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handling placeBet actions
      .addCase(placeBet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeBet.fulfilled, (state, action) => {
        console.log(action.payload);
        
        state.loading = false;
        state.userBets = action.payload; // Assuming new bets are appended
      })
      .addCase(placeBet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handling fetchUserBets actions
      .addCase(fetchUserBets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBets.fulfilled, (state, action) => {
        state.loading = false;
        state.userBets = action.payload; // Set the fetched bets
      })
      .addCase(fetchUserBets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handling updateRound actions
      .addCase(updateRound.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Inside your betSlice
      .addCase(updateRound.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.userBets.findIndex(
          (bet) => bet._id === action.payload._id
        );
        if (index !== -1) {
          // Update the existing bet with the new data
          state.userBets[index] = {
            ...state.userBets[index],
            ...action.payload,
          };
        } else {
          // Optional: Add the updated bet if it does not exist
          state.userBets=action.payload;
        }
        // console.log("Update successful, payload:", action.payload);
      })

      .addCase(updateRound.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default betSlice.reducer;
