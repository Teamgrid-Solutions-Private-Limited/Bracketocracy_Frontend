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
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Unknown error occurred." }
      );
    }
  }
);

// export const fetchUserBets = createAsyncThunk(
//   "bet/fetchUserBets",
//   async ({ userId }, thunkAPI) => {
//     try {
//       const response = await axios.get(
//         `${API_MAIN}/bet/bet/user-bets/${userId}`
//       );
//       console.log(response, "response");
//       return response.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data || { message: "Unknown error occurred." }
//       );
//     }
//   }
// );


export const fetchUserBets = createAsyncThunk(
  "bet/fetchUserBets",
  async ({ userId }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${API_MAIN}/bet/bet/user-bets/${userId}`
      );
      if (response?.data ) {
        const validBets = response.data?.filter((bet) => bet.matchId !== null);
        if (validBets.length > 0) {
          return validBets;
        } else {
          return thunkAPI.rejectWithValue(
            "No valid bets with a non-null matchId found."
          );
        }
      } else {
        // return thunkAPI.rejectWithValue(
        //   response.data?.message || "Invalid response structure."
        // );
      }
    } catch (error) {
      console.error("Error fetching user bets:", error);
      // return thunkAPI.rejectWithValue(
      //   error.response?.data || { message: "Unknown error occurred." }
      // );
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
      return response.data.info;
    } catch (error) {
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
        // state.loading = false;
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
        state.userBets = action.payload; 
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
        // state.loading = false;
      })
      .addCase(updateRound.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default betSlice.reducer;
