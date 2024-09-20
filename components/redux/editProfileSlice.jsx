import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_MAIN } from './API';
 
const initialState = {
  editProfile: [],
  status: 'idle',
  error: null,
};
 
// fetchEditProfile: fetch the user profile by ID
export const fetchEditProfile = createAsyncThunk(
  'fetchEditProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_MAIN}/user/user/viewbyid/${userId}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred while fetching profile');
    }
  }
);
 
// updateEditProfile: update the user profile
export const updateEditProfile = createAsyncThunk(
  'updateEditProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('userName', userData.userName);
      formData.append('firstName', userData.firstName);
      formData.append('lastName', userData.lastName);
      formData.append('email', userData.email);
      // if(userData.profilePhoto) {
        formData.append('profilePhoto', userData.profilePhoto);
      // }
      const response = await axios.put(`${API_MAIN}/user/user/update/${userData.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
 
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred while updating profile');
    }
  }
);
 
// deleteProfile: delete the user profile by ID
export const deleteProfile = createAsyncThunk(
  'deleteProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_MAIN}/user/user/delete/${userId}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred while deleting profile');
    }
  }
);
 
const EditProfileSlice = createSlice({
  name: 'EditProfile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEditProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEditProfile.fulfilled, (state, action) => {
        state.status = 'idle';
        state.editProfile = action.payload;
        state.error = null;
      })
      .addCase(fetchEditProfile.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      })
 
      .addCase(updateEditProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateEditProfile.fulfilled, (state, action) => {
        state.status = 'idle';
        state.editProfile = action.payload;
        state.error = null;
      })
      .addCase(updateEditProfile.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      })
 
      .addCase(deleteProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteProfile.fulfilled, (state) => {
        state.status = 'idle';
        state.editProfile = null;
        state.error = null;
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      });
  },
});
 
export default EditProfileSlice.reducer;