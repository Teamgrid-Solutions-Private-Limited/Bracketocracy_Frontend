import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_MAIN } from './API';

const initialState = {
  leagues: [],
  allUsers: [],
  allUserId: [],
  status: 'idle',
  rankArr: [],
  error: null,
};

// Fetch multiple profiles
export const fetchMultipleProfiles = createAsyncThunk(
  'fetchMultipleProfiles',
  async (userIds, { rejectWithValue }) => {
    try {
      const responses = await Promise.all(
        userIds.map((userId) =>
          axios.get(`${API_MAIN}/user/user/viewbyid/${userId}`, {
            headers: { 'Content-Type': 'application/json' }
          })
        )
      );
      return responses.map(response => response.data);  // Return serializable data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Fetch all users
export const fetchAllUsers = createAsyncThunk(
  'fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_MAIN}/user/user/view`, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Get leagues
export const getLeagues = createAsyncThunk(
  'getLeagues',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_MAIN}/league/league/search/${userId}`, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data.data;  // Return serializable data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Get rank array
export const getRankArr = createAsyncThunk(
  'getRankArr',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_MAIN}/rank/${"66a33f9a8da54d9197e3dbe6"}`, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Create or update leagues
export const createUpdateLeagues = createAsyncThunk(
  'createUpdateLeagues',
  async ({ title, emails, userId, allowInvitation, action, leagueId }, { rejectWithValue }) => {
    try {
      const formData = { title, emails, userId, allowInvitation };
      if (action === "update") {
        const response = await axios.put(
          `${API_MAIN}/league/league/update/${leagueId}`,
          formData,
          { headers: { 'Content-Type': 'application/json' } }
        );
        return response.data;  // Return serializable data
      } else if (action === "create") {
        const response = await axios.post(
          `${API_MAIN}/league/league/create`,
          formData,
          { headers: { 'Content-Type': 'application/json' } }
        );
        return response.data;
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Delete league
export const deleteLeagues = createAsyncThunk(
  'deleteLeagues',
  async (leagueId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_MAIN}/league/league/delete/${leagueId}`, {
        headers: { 'Content-Type': 'application/json' }
      });
      return leagueId;  // Return serializable ID of deleted league
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Delete league user
export const deleteLeaguesUser = createAsyncThunk(
  'deleteLeaguesUser',
  async ({ leagueId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_MAIN}/league/league/user`, {
        data: { leagueId, userId },
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;  // Return serializable data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

const Leagueslice = createSlice({
  name: 'leagues',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createUpdateLeagues.fulfilled, (state, action) => {
        state.status = 'idle';
      })
      .addCase(createUpdateLeagues.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      })
      .addCase(getLeagues.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getLeagues.fulfilled, (state, action) => {
        state.status = 'idle';
        state.leagues = action.payload;
        state.error = null;
      })
      .addCase(getLeagues.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.status = 'idle';
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      })
      .addCase(fetchMultipleProfiles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMultipleProfiles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allUserId = action.payload;
      })
      .addCase(fetchMultipleProfiles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getRankArr.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getRankArr.fulfilled, (state, action) => {
        state.status = 'idle';
        state.rankArr = action.payload;
        state.error = null;
      })
      .addCase(getRankArr.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      })
      .addCase(deleteLeagues.fulfilled, (state, action) => {
        state.status = 'idle';
        state.leagues = state.leagues.filter((league) => league._id !== action.payload);
      })
      .addCase(deleteLeagues.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      });
  },
});

export default Leagueslice.reducer;
