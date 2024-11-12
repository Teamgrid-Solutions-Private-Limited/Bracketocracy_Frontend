import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_MAIN } from './API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const initialState = {
  leagues: [],
  allUsers: [],
  allUserId: [],
  status: 'idle',
  leagueStatus: 'idle',
  rankArr: [],
  error: null,
};

// Fetch multiple profiles
export const fetchMultipleProfiles = createAsyncThunk(
  'fetchMultipleProfiles',
  async (userIds, { rejectWithValue }) => {
    try {
      const results = await Promise.allSettled(
        userIds.map((userId) =>
          axios.get(`${API_MAIN}/user/user/viewbyid/${userId}`, {})
        )
      );

      // Filter successful results and extract user data
      const successfulResults = results.filter((result) => result.status === 'fulfilled');
      const userProfiles = successfulResults.map((result) => result.value.data);

      return userProfiles;
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
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Get rank array
export const getRankArr = createAsyncThunk(
  'getRankArr',
  async (seasonId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_MAIN}/rank/${seasonId}`, {
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
      const token = await AsyncStorage.getItem('userToken');
      const formData = { title, emails, userId, allowInvitation};
      if (action === "update") {
        const response = await axios.put(
          `${API_MAIN}/league/league/update/${leagueId}`,
          formData,
          { headers: { 'Content-Type': 'application/json' ,
            'Authorization': `Bearer ${token}`
          } }
        );
        if(response.data.message){
          Alert.alert("Success",response.data.message);
        }
        return response.data;  
      } else if (action === "create") {
        const response = await axios.post(
          `${API_MAIN}/league/league/create`,
          formData,
          { headers: { 'Content-Type': 'application/json' } }
        );
        if(response.data.message){
          Alert.alert("Success",response.data.message);
        }
        return response.data;
      }
    } catch (error) {
      return Alert.alert("error",error.response.data.error);
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
      return leagueId;  
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error Deleting League');
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
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

const Leagueslice = createSlice({
  name: 'leagues',
  initialState,
  reducers: {
    resetLeagues: (state) => {
      state.leagues = [];
      state.rankArr = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUpdateLeagues.fulfilled, (state, action) => {
        state.leagueStatus = 'idle';
      })
      .addCase(createUpdateLeagues.rejected, (state, action) => {
        state.leagueStatus = 'error';
        state.error = action.payload;
      })
      .addCase(getLeagues.pending, (state) => {
        state.leagueStatus = 'loading';
      })
      .addCase(getLeagues.fulfilled, (state, action) => {
        state.leagueStatus = 'idle';
        state.leagues = action.payload;
        state.error = null;
      })
      .addCase(getLeagues.rejected, (state, action) => {
        state.leagueStatus = 'error';
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
      })
      .addCase(getRankArr.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      })
      .addCase(deleteLeagues.fulfilled, (state, action) => {
        state.leagueStatus = 'idle';
        state.leagues = state.leagues.filter((league) => league._id !== action.payload);
      })
      .addCase(deleteLeagues.rejected, (state, action) => {
        state.leagueStatus = 'error';
        state.error = action.payload;
      })
      .addCase(deleteLeaguesUser.fulfilled, (state, action) => {
        state.status = 'idle';
        const updatedLeague = action.payload.league;
        state.leagues = state.leagues.filter((league) => league._id !== updatedLeague._id);
      })
      .addCase(deleteLeaguesUser.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      });
  },
});
export const { resetLeagues } = Leagueslice.actions;
export default Leagueslice.reducer;
