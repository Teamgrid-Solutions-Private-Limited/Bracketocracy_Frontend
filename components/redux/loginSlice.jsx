import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_MAIN } from './API';

const initialState = {
  userToken: null,
  userId: null, 
  status: 'idle',
  error: null,
};

export const createUsers = createAsyncThunk(
  'createUsers',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_MAIN}/user/user/create`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue('Something went wrong');
      }
    }
  }
);

export const loginUser = createAsyncThunk('loginUser', async ({ email, password ,checkbox}, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${API_MAIN}/user/user/login`,
      { email, password },{headers: { 'Content-Type': 'application/json' }}
    );
    const token = response.data.token;
    const id = response.data.id;

    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.role ==='admin') {
        return Alert.alert('Access Denied', 'You do not have permission to log in as an admin.');
      } else {
        if(checkbox) {
          await AsyncStorage.setItem('userToken', token);
        }
        await AsyncStorage.setItem('userId', id);
        return { token, id };
      }
    }
  } catch (error) {
    return Alert.alert('Login Error', 'Check username or password');
  }
});

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    logOut: (state) => {
      state.userToken = null;
      state.userId = null; 
      AsyncStorage.removeItem('userToken');
      AsyncStorage.removeItem('userId');
      // localStorage.removeItem('userToken');
      // localStorage.removeItem('userId');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'idle';
        state.userToken = action.payload.token; 
        state.userId = action.payload.id; 
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
        state.userToken = null;
        state.userId = null; 
      });
  },
});

export const { logOut } = loginSlice.actions;
export default loginSlice.reducer;
